"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { chatService, Conversation, ChatMessage } from "../services/chat";
import { getAccessToken } from "@/services/auth";
import useUser from "@/hooks/useUser";

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  isConnected: boolean;
  unreadCount: number;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (recipientId: string, content: string) => void;
  loadMoreMessages: () => void;
  markAsRead: (conversationId: string) => void;
  getOnlineStatus: (userIds: string[]) => void;
  onlineUsers: Record<string, boolean>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isUserLoading } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [cursor, setCursor] = useState<string | null>(null);

  // Get token when user is available
  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const accessToken = await getAccessToken();
        setToken(accessToken || null);
      }
    };
    fetchToken();
  }, [user]);

  // Connect to chat when token is available
  useEffect(() => {
    if (!token || !user) return;

    chatService.connect(token);

    const handleConnect = () => {
      setIsConnected(true);
      // Load conversations on connect
      chatService.loadConversations();
    };

    const handleDisconnect = () => setIsConnected(false);

    const handleNewMessage = (message: ChatMessage) => {
      console.log("New message received1111:", message);
      // Add to messages if it's for active conversation
      if (message.conversationId === activeConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }

      // Update conversations list
      setConversations((prev) => {
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
    };

    const handleChatHistory = (data: {
      conversationId: string;
      messages: ChatMessage[];
      nextCursor: string | null;
    }) => {
      console.log(data, "chat history data");
      setMessages(data.messages);
      setCursor(data.nextCursor);
    };

    const handleConversations = (convs: Conversation[]) => {
      setConversations(convs);
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      userId: string;
    }) => {
      console.log(data, "messages read data");
      if (data.conversationId === activeConversation?.id) {
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
    };

    const handleOnlineStatus = (status: Record<string, boolean>) => {
      setOnlineUsers(status);
    };

    chatService.on("connect", handleConnect);
    chatService.on("disconnect", handleDisconnect);
    chatService.on("private:new_message", handleNewMessage);
    chatService.on("private:chat_history", handleChatHistory);
    chatService.on("private:conversations", handleConversations);
    chatService.on("private:messages_read", handleMessagesRead);
    chatService.on("private:online_status", handleOnlineStatus);

    // Load conversations if already connected
    if (chatService.isConnected()) {
      chatService.loadConversations();
    }

    return () => {
      chatService.off("connect", handleConnect);
      chatService.off("disconnect", handleDisconnect);
      chatService.off("private:new_message", handleNewMessage);
      chatService.off("private:chat_history", handleChatHistory);
      chatService.off("private:conversations", handleConversations);
      chatService.off("private:messages_read", handleMessagesRead);
      chatService.off("private:online_status", handleOnlineStatus);
      chatService.disconnect();
    };
  }, [token, user, activeConversation?.id]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      chatService.loadMessages(activeConversation.id);
      chatService.markAsRead(activeConversation.id);
    }
  }, [activeConversation?.id]);

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

  const handleSendMessage = useCallback((recipientId: string, content: string) => {
    chatService.sendMessage(recipientId, content);
  }, []);

  const loadMoreMessages = useCallback(() => {
    if (cursor && activeConversation) {
      chatService.loadMessages(activeConversation.id, 20, cursor);
    }
  }, [cursor, activeConversation]);

  const handleMarkAsRead = useCallback((conversationId: string) => {
    chatService.markAsRead(conversationId);
  }, []);

  const handleGetOnlineStatus = useCallback((userIds: string[]) => {
    chatService.getOnlineStatus(userIds);
  }, []);

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    isConnected,
    unreadCount,
    setActiveConversation,
    sendMessage: handleSendMessage,
    loadMoreMessages,
    markAsRead: handleMarkAsRead,
    getOnlineStatus: handleGetOnlineStatus,
    onlineUsers,
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