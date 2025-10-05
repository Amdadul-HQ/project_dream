// services/chat.ts
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  receiverId: string | null;
  fileUrl?: string;
  fileType?: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    profile: string | null;
  };
  statuses?: Array<{
    userId: string;
    status: "SENT" | "DELIVERED" | "READ";
  }>;
}

export interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string;
  members: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      profile: string | null;
    };
  }>;
  messages: ChatMessage[];
  lastMessageAt: string;
  updatedAt: string;
}

class ChatService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<any>> = new Map();
  private isConnecting: boolean = false;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log("⚠️ Socket already connected");
      return;
    }
    
    if (this.isConnecting) {
      console.log("⚠️ Connection already in progress");
      return;
    }

    console.log("🔌 Attempting to connect to WebSocket...");
    console.log("📍 URL: http://localhost:5005/private");
    console.log("🔑 Token preview:", token.substring(0, 50) + "...");
    console.log("🔑 Token length:", token.length);
    
    this.isConnecting = true;
    
    try {
      this.socket = io("http://localhost:5005/private", {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        timeout: 10000,
        autoConnect: true,
      });

      // Connection successful
      this.socket.on("connect", () => {
        console.log("✅ Chat WebSocket connected successfully!");
        console.log("📌 Socket ID:", this.socket?.id);
        this.isConnecting = false;
        this.emit("connect");
      });

      // Connection error
      this.socket.on("connect_error", (error) => {
        console.error("❌ Chat WebSocket connection error:");
        console.error("   Error type:", error.name);
        console.error("   Error message:", error.message);
        console.error("   Full error:", error);
        this.isConnecting = false;
        this.emit("error", error);
      });

      // Disconnection
      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Chat WebSocket disconnected");
        console.log("   Reason:", reason);
        this.isConnecting = false;
        this.emit("disconnect", reason);
        
        // Auto-reconnect on certain reasons
        if (reason === "io server disconnect") {
          console.log("🔄 Server disconnected us, attempting to reconnect...");
          this.socket?.connect();
        }
      });

      // Reconnection attempt
      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`🔄 Reconnection attempt #${attemptNumber}`);
      });

      // Reconnection failed
      this.socket.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed after all attempts");
        this.isConnecting = false;
      });

      // Reconnected successfully
      this.socket.on("reconnect", (attemptNumber) => {
        console.log(`✅ Reconnected successfully after ${attemptNumber} attempts`);
      });

      // Message events
      this.socket.on("private:new_message", (message: ChatMessage) => {
        console.log("💬 New message received:", message);
        this.emit("private:new_message", message);
      });

      this.socket.on("private:chat_history", (data) => {
        console.log("📜 Chat history received:", data);
        this.emit("private:chat_history", data);
      });

      this.socket.on("private:conversations", (conversations) => {
        console.log("💼 Conversations received:", conversations);
        this.emit("private:conversations", conversations);
      });

      this.socket.on("private:messages_read", (data) => {
        console.log("✓ Messages marked as read:", data);
        this.emit("private:messages_read", data);
      });

      this.socket.on("private:online_status", (status) => {
        console.log("👥 Online status received:", status);
        this.emit("private:online_status", status);
      });

      this.socket.on("private:user_online", (data) => {
        console.log("👤 User came online:", data);
        this.emit("private:user_online", data);
      });

      this.socket.on("private:user_offline", (data) => {
        console.log("👤 User went offline:", data);
        this.emit("private:user_offline", data);
      });

      this.socket.on("private:online_users_count", (data) => {
        console.log("👥 Online users count:", data);
        this.emit("private:online_users_count", data);
      });

      this.socket.on("error", (error) => {
        console.error("❌ Socket error event:", error);
        this.emit("error", error);
      });

      console.log("✅ Socket.IO client initialized, waiting for connection...");
      
    } catch (error) {
      console.error("❌ Failed to initialize chat WebSocket:", error);
      this.isConnecting = false;
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Manually disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  sendMessage(recipientId: string, content: string) {
    if (!this.socket?.connected) {
      console.error("❌ Cannot send message: Socket not connected");
      throw new Error("Chat WebSocket not connected");
    }

    console.log("📤 Emitting send_message event:", { recipientId, content });
    this.socket.emit("private:send_message", {
      recipientId,
      dto: { content },
    });
  }

  loadMessages(conversationId: string, limit = 20, cursor?: string) {
    if (!this.socket?.connected) {
      console.warn("⚠️ Cannot load messages: Socket not connected");
      return;
    }

    console.log("📨 Loading messages:", { conversationId, limit, cursor });
    this.socket.emit("private:load_messages", {
      conversationId,
      limit,
      cursor,
    });
  }

  loadConversations() {
    if (!this.socket?.connected) {
      console.error("❌ Cannot load conversations: Socket not connected");
      throw new Error("Chat WebSocket not connected");
    }

    console.log("📋 Loading conversations");
    this.socket.emit("private:load_conversations");
  }

  markAsRead(conversationId: string) {
    if (!this.socket?.connected) {
      console.error("❌ Cannot mark as read: Socket not connected");
      throw new Error("Chat WebSocket not connected");
    }

    console.log("✓ Marking conversation as read:", conversationId);
    this.socket.emit("private:mark_read", { conversationId });
  }

  getOnlineStatus(userIds: string[]) {
    if (!this.socket?.connected) {
      console.error("❌ Cannot get online status: Socket not connected");
      throw new Error("Chat WebSocket not connected");
    }

    console.log("👥 Requesting online status for users:", userIds);
    this.socket.emit("private:get_online_status", { userIds });
  }

  subscribeToStatus() {
    if (!this.socket?.connected) {
      console.error("❌ Cannot subscribe to status: Socket not connected");
      throw new Error("Chat WebSocket not connected");
    }

    console.log("👁️ Subscribing to status updates");
    this.socket.emit("private:subscribe_status");
  }

  on(event: string, handler: any) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  off(event: string, handler: any) {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in handler for ${event}:`, error);
        }
      });
    }
  }

  isConnected(): boolean {
    const connected = this.socket?.connected || false;
    console.log("🔍 Connection check:", connected);
    return connected;
  }
}

export const chatService = new ChatService();