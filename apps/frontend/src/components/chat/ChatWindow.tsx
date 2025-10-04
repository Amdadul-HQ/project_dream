"use client";

import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import useUser from "@/hooks/useUser";
import { useChat } from "@/contexts/ChatContext";

export function ChatWindow() {
  const { user } = useUser();
  const {
    conversations,
    activeConversation,
    messages,
    isConnected,
    unreadCount,
    setActiveConversation,
    sendMessage,
    onlineUsers,
  } = useChat();

  console.log(messages, "messages in chat window");

  const [messageInput, setMessageInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation || !user) return;

    const recipient = activeConversation.members.find(
      (m) => m.userId !== user.id
    );

    if (recipient) {
      sendMessage(recipient.userId, messageInput);
      setMessageInput("");
    }
  };

  if (!user) return null;

  if (!showChat) {
    return (
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
      >
        💬 {unreadCount > 0 && <span className="ml-1">({unreadCount})</span>}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">
          {activeConversation
            ? activeConversation.members.find((m) => m.userId !== user.id)
                ?.user.name || "Chat"
            : "Messages"}
        </h3>
        <div className="flex items-center gap-2">
          {!isConnected && (
            <span className="text-xs bg-yellow-500 px-2 py-1 rounded">
              Reconnecting...
            </span>
          )}
          <button onClick={() => setShowChat(false)} className="text-white">
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        {!activeConversation && (
          <div className="w-full overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = conv.members.find(
                  (m) => m.userId !== user.id
                )?.user;
                const lastMessage = conv.messages[0];
                const isOnline = otherUser ? onlineUsers[otherUser.id] : false;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className="relative">
                      <img
                        src={otherUser?.profile || "/default-avatar.png"}
                        alt={otherUser?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{otherUser?.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Chat Messages */}
        {activeConversation && (
          <div className="flex-1 flex flex-col">
            <button
              onClick={() => setActiveConversation(null)}
              className="p-2 text-left text-sm text-blue-600 border-b hover:bg-gray-50"
            >
              ← Back to conversations
            </button>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        isMine
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 shadow"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <span
                        className={`text-xs ${
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
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 border-t bg-white flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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