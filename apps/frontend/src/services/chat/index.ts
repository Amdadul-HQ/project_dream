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
  private eventHandlers: Map<string, Set<Function>> = new Map();
  private isConnecting: boolean = false;

  connect(token: string) {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    try {
    this.socket = io("http://localhost:5005/private", {
      auth: {
        token: token  // Send token in auth object
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

      this.socket.on("connect", () => {
        console.log("✅ Chat WebSocket connected");
        this.isConnecting = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Chat WebSocket connection error:", error);
        this.isConnecting = false;
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Chat WebSocket disconnected:", reason);
        this.isConnecting = false;
      });

      this.socket.on("private:new_message", (message: ChatMessage) => {
        console.log("💬 New message received:", message);
        this.emit("private:new_message", message);
      });

      this.socket.on("private:chat_history", (data) => {
        this.emit("private:chat_history", data);
      });

      this.socket.on("private:conversations", (conversations) => {
        this.emit("private:conversations", conversations);
      });

      this.socket.on("private:messages_read", (data) => {
        this.emit("private:messages_read", data);
      });

      this.socket.on("private:online_status", (status) => {
        this.emit("private:online_status", status);
      });

      this.socket.on("error", (error) => {
        console.error("❌ Chat error:", error);
        this.emit("error", error);
      });
    } catch (error) {
      console.error("Failed to initialize chat WebSocket:", error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  sendMessage(recipientId: string, content: string) {
    if (!this.socket?.connected) {
      throw new Error("Chat WebSocket not connected");
    }

    this.socket.emit("private:send_message", {
      recipientId,
      dto: { content },
    });
  }

  loadMessages(conversationId: string, limit = 20, cursor?: string) {
    if (!this.socket?.connected) {
      throw new Error("Chat WebSocket not connected");
    }

    this.socket.emit("private:load_messages", {
      conversationId,
      limit,
      cursor,
    });
  }

  loadConversations() {
    if (!this.socket?.connected) {
      throw new Error("Chat WebSocket not connected");
    }

    this.socket.emit("private:load_conversations");
  }

  markAsRead(conversationId: string) {
    if (!this.socket?.connected) {
      throw new Error("Chat WebSocket not connected");
    }

    this.socket.emit("private:mark_read", { conversationId });
  }

  getOnlineStatus(userIds: string[]) {
    if (!this.socket?.connected) {
      throw new Error("Chat WebSocket not connected");
    }

    this.socket.emit("private:get_online_status", { userIds });
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  off(event: string, handler: Function) {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: string, ...args: any[]) {
    this.eventHandlers.get(event)?.forEach((handler) => handler(...args));
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const chatService = new ChatService();