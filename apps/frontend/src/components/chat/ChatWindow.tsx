"use client";

import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import useUser from "@/hooks/useUser";
import { useChat } from "@/contexts/ChatContext";
import { UserListItem } from "@/services/user";

type ViewMode = "conversations" | "users" | "chat";

export function ChatWindow() {
  const { user } = useUser();
  const {
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
    sendMessage,
    loadUserList,
    startChatWithUser,
  } = useChat();

  const [messageInput, setMessageInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("conversations");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log("🐛 ChatWindow Debug:", {
      conversationsCount: conversations.length,
      activeConversation: activeConversation?.id,
      messagesCount: messages.length,
      isConnected,
      userId: user?.id,
      viewMode
    });
  }, [conversations, activeConversation, messages, isConnected, user, viewMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeConversation) {
      setViewMode("chat");
    }
  }, [activeConversation]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation || !user) {
      console.warn("⚠️ Cannot send message:", {
        hasInput: !!messageInput.trim(),
        hasConversation: !!activeConversation,
        hasUser: !!user
      });
      return;
    }

    const recipient = activeConversation.members.find(
      (m) => m.userId !== user.id
    );

    console.log("📤 Attempting to send message:", {
      recipient: recipient?.userId,
      content: messageInput,
      conversationId: activeConversation.id
    });

    if (recipient) {
      sendMessage(recipient.userId, messageInput);
      setMessageInput("");
    } else {
      console.error("❌ No recipient found in conversation");
    }
  };

  const handleUserClick = (userId: string) => {
    startChatWithUser(userId);
  };

  const handleBackToList = () => {
    setActiveConversation(null);
    setViewMode("conversations");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewMode === "users") {
      loadUserList(1, searchQuery);
    }
  };

  if (!user) {
    console.log("⚠️ No user, not rendering chat");
    return null;
  }

  if (!showChat) {
    return (
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50 transition-all"
        aria-label="Open chat"
      >
        <span className="text-xl">💬</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">
            {viewMode === "chat" && activeConversation
              ? activeConversation.members.find((m) => m.userId !== user.id)
                  ?.user.name || "Chat"
              : viewMode === "users"
              ? "All Users"
              : "Messages"}
          </h3>
          <div className="flex items-center gap-2">
            {!isConnected && (
              <span className="text-xs bg-yellow-500 px-2 py-1 rounded animate-pulse">
                Reconnecting...
              </span>
            )}
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-blue-700 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {viewMode !== "chat" && (
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("conversations")}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                viewMode === "conversations"
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Chats {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => {
                setViewMode("users");
                loadUserList(1);
              }}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                viewMode === "users"
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Users
            </button>
          </div>
        )}
      </div>

      {/* Search Bar (for users view) */}
      {viewMode === "users" && (
        <div className="p-3 border-b bg-gray-50">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </form>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Conversations List */}
        {viewMode === "conversations" && (
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">💬</div>
                <p className="mb-2 font-medium">No conversations yet</p>
                <button
                  onClick={() => setViewMode("users")}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  Start a new chat
                </button>
              </div>
            ) : (
              conversations.map((conv) => {
                console.log("🔍 Rendering conversation:", conv.id, conv);
                
                const otherUser = conv.members.find(
                  (m) => m.userId !== user.id
                )?.user;
                
                // Safely access the last message
                const lastMessage = conv.messages && conv.messages.length > 0 
                  ? conv.messages[0] 
                  : null;
                
                const isOnline = otherUser ? onlineUsers[otherUser.id] : false;
                
                const hasUnread = lastMessage && 
                  lastMessage.senderId !== user.id && 
                  lastMessage.statuses?.find(s => s.userId === user.id)?.status !== "READ";

                if (!otherUser) {
                  console.error("❌ No other user found in conversation:", conv.id);
                  return null;
                }

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      console.log("👆 Conversation clicked:", conv.id);
                      setActiveConversation(conv);
                    }}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                      hasUnread ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={otherUser.profile || "/default-avatar.png"}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`truncate ${hasUnread ? "font-bold" : "font-semibold"}`}>
                        {otherUser.name}
                      </p>
                      <p className={`text-sm truncate ${hasUnread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                        {lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {lastMessage && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(lastMessage.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                      {hasUnread && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Users List */}
        {viewMode === "users" && (
          <div className="flex-1 overflow-y-auto">
            {userListLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Loading users...</p>
              </div>
            ) : userList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">👥</div>
                <p>No users found</p>
              </div>
            ) : (
              <>
                {userList.map((listUser: UserListItem) => (
                  <div
                    key={listUser.id}
                    onClick={() => handleUserClick(listUser.id)}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={listUser.profile || "/default-avatar.png"}
                        alt={listUser.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                      />
                      {listUser.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold truncate">
                          {listUser.name}
                        </p>
                        {listUser.role !== "USER" && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                            {listUser.role}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {listUser.lastMessage
                          ? listUser.lastMessage.content
                          : "Start a conversation"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {listUser.lastMessage && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(listUser.lastMessage.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                      {listUser.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 font-bold">
                          {listUser.unreadCount > 99 ? "99+" : listUser.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {userListMeta && userListMeta.totalPages > 1 && (
                  <div className="p-3 border-t bg-gray-50 flex justify-between items-center sticky bottom-0">
                    <button
                      onClick={() => loadUserList(userListMeta.page - 1, searchQuery)}
                      disabled={!userListMeta.hasPreviousPage}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      Page {userListMeta.page} of {userListMeta.totalPages}
                    </span>
                    <button
                      onClick={() => loadUserList(userListMeta.page + 1, searchQuery)}
                      disabled={!userListMeta.hasNextPage}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Chat Messages */}
        {viewMode === "chat" && activeConversation && (
          <div className="flex-1 flex flex-col">
            <button
              onClick={handleBackToList}
              className="p-2.5 text-left text-sm text-blue-600 border-b hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">←</span>
              <span>Back to {conversations.length > 0 ? "conversations" : "users"}</span>
            </button>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-1">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg shadow-sm ${
                          isMine
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                        <span
                          className={`text-xs block mt-1 ${
                            isMine ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatDistanceToNow(new Date(msg.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 border-t bg-white flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !isConnected}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}