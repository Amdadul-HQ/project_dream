"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { chatService, Conversation, ChatMessage } from "../services/chat";
import { getAccessToken } from "@/services/auth";
import useUser from "@/hooks/useUser";
import { getUserList, UserListItem } from "@/services/user";

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  isConnected: boolean;
  unreadCount: number;
  userList: UserListItem[];
  userListLoading: boolean;
  userListMeta: any;
  onlineUsers: Record<string, boolean>;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (recipientId: string, content: string) => void;
  loadMoreMessages: () => void;
  markAsRead: (conversationId: string) => void;
  getOnlineStatus: (userIds: string[]) => void;
  loadUserList: (page?: number, search?: string) => void;
  startChatWithUser: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [cursor, setCursor] = useState<string | null>(null);
  
  const [userList, setUserList] = useState<UserListItem[]>([]);
  const [userListLoading, setUserListLoading] = useState(false);
  const [userListMeta, setUserListMeta] = useState<any>(null);

  const activeConversationRef = useRef(activeConversation);
  const userRef = useRef(user);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const accessToken = await getAccessToken();
        setToken(accessToken || null);
      }
    };
    fetchToken();
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserList();
    }
  }, [user]);

  useEffect(() => {

    console.log("🔑 Auth Debug:", {
        hasToken: !!token,
        tokenLength: token?.length,
        hasUser: !!user,
        userName: user?.name
    });

    if (!token || !user) return;

    console.log("🔌 Connecting to chat...");
    chatService.connect(token);

    const handleConnect = () => {
      console.log("✅ Chat connected");
      setIsConnected(true);
      chatService.loadConversations();
      chatService.subscribeToStatus();
    };

    const handleDisconnect = () => {
      console.log("🔌 Chat disconnected");
      setIsConnected(false);
    };

    const handleNewMessage = (message: ChatMessage) => {
      console.log("💬 New message received:", message);
      
      // IMPORTANT: Add message to the current view if it's the active conversation
      const currentActiveConv = activeConversationRef.current;
      if (currentActiveConv) {
        // Check if message belongs to active conversation
        const isForActiveConv = 
          message.conversationId === currentActiveConv.id ||
          (currentActiveConv.id.startsWith('temp-') && 
           (message.senderId === currentActiveConv.members[1].userId || 
            message.receiverId === currentActiveConv.members[1].userId));

        if (isForActiveConv) {
          setMessages((prev) => {
            // Prevent duplicates
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;
            return [...prev, message];
          });

          // If it was a temp conversation, update to real conversation ID
          if (currentActiveConv.id.startsWith('temp-') && message.conversationId) {
            setActiveConversation(prev => prev ? {
              ...prev,
              id: message.conversationId
            } : null);
          }
        }
      }

      // Update conversations list
      setConversations((prev) => {
        const conversationExists = prev.some((conv) => conv.id === message.conversationId);
        
        if (!conversationExists) {
          // New conversation, reload to get full data
          chatService.loadConversations();
          return prev;
        }

        const updated = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              messages: [message],
              lastMessageAt: message.createdAt,
            };
          }
          return conv;
        });

        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        );
      });

      // Refresh user list
      loadUserList();
    };

    const handleChatHistory = (data: {
      conversationId: string;
      messages: ChatMessage[];
      nextCursor: string | null;
    }) => {
      console.log("📜 Chat history loaded:", data.messages.length, "messages");
      setMessages(data.messages);
      setCursor(data.nextCursor);
    };

    const handleConversations = (convs: Conversation[]) => {
      console.log("💼 Conversations loaded:", convs);
      setConversations(convs);
      
      // If we have a temp conversation and real one arrived, switch to it
      const currentActiveConv = activeConversationRef.current;
      if (currentActiveConv?.id.startsWith('temp-')) {
        const userId = currentActiveConv.id.replace('temp-', '');
        const realConv = convs.find((c) => 
          c.type === 'DIRECT' && c.members.some((m) => m.userId === userId)
        );
        if (realConv) {
          console.log("🔄 Switching from temp to real conversation:", realConv.id);
          setActiveConversation(realConv);
        }
      }
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      userId: string;
    }) => {
      console.log("✓ Messages read:", data);
      
      if (data.conversationId === activeConversationRef.current?.id) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            statuses: msg.statuses?.map((status) =>
              status.userId === data.userId
                ? { ...status, status: "READ" as const }
                : status
            ),
          }))
        );
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === data.conversationId && conv.messages[0]) {
            return {
              ...conv,
              messages: [
                {
                  ...conv.messages[0],
                  statuses: conv.messages[0].statuses?.map((status) =>
                    status.userId === data.userId
                      ? { ...status, status: "READ" as const }
                      : status
                  ),
                },
              ],
            };
          }
          return conv;
        })
      );
    };

    const handleOnlineStatus = (status: Record<string, boolean>) => {
      console.log("👥 Online status update:", Object.keys(status).length, "users");
      setOnlineUsers((prev) => ({ ...prev, ...status }));
      
      setUserList((prev) =>
        prev.map((u) => ({
          ...u,
          isOnline: status[u.id] ?? u.isOnline,
        }))
      );
    };

    const handleUserOnline = (data: { userId: string; isOnline: boolean }) => {
      console.log("👤 User online:", data.userId);
      setOnlineUsers((prev) => ({ ...prev, [data.userId]: true }));
      setUserList((prev) =>
        prev.map((u) => (u.id === data.userId ? { ...u, isOnline: true } : u))
      );
    };

    const handleUserOffline = (data: { userId: string; isOnline: boolean }) => {
      console.log("👤 User offline:", data.userId);
      setOnlineUsers((prev) => ({ ...prev, [data.userId]: false }));
      setUserList((prev) =>
        prev.map((u) => (u.id === data.userId ? { ...u, isOnline: false } : u))
      );
    };

    const handleError = (error: any) => {
      console.error("❌ Chat error:", error);
    };

    chatService.on("connect", handleConnect);
    chatService.on("disconnect", handleDisconnect);
    chatService.on("private:new_message", handleNewMessage);
    chatService.on("private:chat_history", handleChatHistory);
    chatService.on("private:conversations", handleConversations);
    chatService.on("private:messages_read", handleMessagesRead);
    chatService.on("private:online_status", handleOnlineStatus);
    chatService.on("private:user_online", handleUserOnline);
    chatService.on("private:user_offline", handleUserOffline);
    chatService.on("error", handleError);

    if (chatService.isConnected()) {
      handleConnect();
    }

    return () => {
      console.log("🧹 Cleaning up chat connection");
      chatService.off("connect", handleConnect);
      chatService.off("disconnect", handleDisconnect);
      chatService.off("private:new_message", handleNewMessage);
      chatService.off("private:chat_history", handleChatHistory);
      chatService.off("private:conversations", handleConversations);
      chatService.off("private:messages_read", handleMessagesRead);
      chatService.off("private:online_status", handleOnlineStatus);
      chatService.off("private:user_online", handleUserOnline);
      chatService.off("private:user_offline", handleUserOffline);
      chatService.off("error", handleError);
      chatService.disconnect();
    };
  }, [token, user]);

  useEffect(() => {
    if (activeConversation && isConnected) {
      if (activeConversation.id.startsWith('temp-')) {
        console.log("📝 New conversation (temp), ready to send first message");
        setMessages([]);
        return;
      }

      console.log("📨 Loading messages for:", activeConversation.id);
      chatService.loadMessages(activeConversation.id);
      chatService.markAsRead(activeConversation.id);
    }
  }, [activeConversation?.id, isConnected]);

  const unreadCount = conversations.reduce((count, conv) => {
    const lastMessage = conv.messages[0];
    if (lastMessage && lastMessage.senderId !== user?.id) {
      const myStatus = lastMessage.statuses?.find(
        (s) => s.userId === user?.id
      );
      if (myStatus?.status !== "READ") {
        return count + 1;
      }
    }
    return count;
  }, 0);

  const loadUserList = useCallback(async (page = 1, search?: string) => {
    setUserListLoading(true);
    try {
      const response = await getUserList({ page, limit: 20, search });
      setUserList(response.data);
      setUserListMeta(response.meta);

      const userIds = response.data.map((u: any) => u.id);
      if (userIds.length > 0 && chatService.isConnected()) {
        chatService.getOnlineStatus(userIds);
      }
    } catch (error) {
      console.error("Failed to load user list:", error);
    } finally {
      setUserListLoading(false);
    }
  }, []);

  const startChatWithUser = useCallback(
    (userId: string) => {
      const userInList = userList.find((u) => u.id === userId);
      
      if (!userInList || !user) return;

      if (userInList.conversationId) {
        const existingConv = conversations.find(
          (c) => c.id === userInList.conversationId
        );
        
        if (existingConv) {
          setActiveConversation(existingConv);
        } else {
          chatService.loadConversations();
        }
      } else {
        const tempConv: Conversation = {
          id: `temp-${userId}`,
          type: "DIRECT",
          members: [
            {
              userId: user.id,
              user: {
                id: user.id,
                name: user.name,
                profile: user.profile || null,
              },
            },
            {
              userId: userInList.id,
              user: {
                id: userInList.id,
                name: userInList.name,
                profile: userInList.profile,
              },
            },
          ],
          messages: [],
          lastMessageAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setActiveConversation(tempConv);
        setMessages([]);
      }
    },
    [userList, conversations, user]
  );

  const handleSendMessage = useCallback((recipientId: string, content: string) => {
    if (!isConnected) {
      console.error("❌ Cannot send message: not connected");
      return;
    }

    console.log("📤 Sending message to:", recipientId, "content:", content);
    
    try {
      chatService.sendMessage(recipientId, content);
      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  }, [isConnected]);

  const loadMoreMessages = useCallback(() => {
    if (cursor && activeConversation && isConnected && !activeConversation.id.startsWith('temp-')) {
      chatService.loadMessages(activeConversation.id, 20, cursor);
    }
  }, [cursor, activeConversation, isConnected]);

  const handleMarkAsRead = useCallback((conversationId: string) => {
    if (isConnected && !conversationId.startsWith('temp-')) {
      chatService.markAsRead(conversationId);
    }
  }, [isConnected]);

  const handleGetOnlineStatus = useCallback((userIds: string[]) => {
    if (isConnected) {
      chatService.getOnlineStatus(userIds);
    }
  }, [isConnected]);

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    isConnected,
    unreadCount,
    userList,
    userListLoading,
    userListMeta,
    onlineUsers,
    setActiveConversation,
    sendMessage: handleSendMessage,
    loadMoreMessages,
    markAsRead: handleMarkAsRead,
    getOnlineStatus: handleGetOnlineStatus,
    loadUserList,
    startChatWithUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}