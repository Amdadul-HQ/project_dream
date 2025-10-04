// services/notification.ts
import { io, Socket } from "socket.io-client";

export interface Notification {
  id: string;
  userId: string;
  type:
    | "POST_LIKED"
    | "POST_COMMENTED"
    | "COMMENT_REPLIED"
    | "NEW_FOLLOWER"
    | "POST_SHARED"
    | "POST_PUBLISHED"
    | "SYSTEM";
  title: string;
  content?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    items: Notification[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  };
}

class NotificationService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<Function>> = new Map();
  private isConnecting: boolean = false;

  connect(userId: string, token: string) {
  if (this.socket?.connected || this.isConnecting) {
    return;
  }

  this.isConnecting = true;

  try {
    this.socket = io('http://localhost:5005/notifications', {
      auth: { token, userId },
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected for user:", userId);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 WebSocket disconnected:", reason);
      this.isConnecting = false;
    });

    // Listen for new notifications
    this.socket.on("notification:new", (notification: Notification) => {
      console.log("🔔 New notification received:", notification);
      this.emit("notification:new", notification);
    });

    this.socket.on("notification:allRead", () => {
      this.emit("notification:allRead");
    });
  } catch (error) {
    console.error("Failed to initialize WebSocket:", error);
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

  markAllReadSocket() {
    if (this.socket?.connected) {
      this.socket.emit("notification:markAllRead");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const notificationService = new NotificationService();

/**
 * Fetch notifications with pagination
 */
export async function fetchNotifications(
  page: number = 1,
  limit: number = 20,
  token?: string
): Promise<NotificationResponse> {
  try {
    if (!token) {
      throw new Error("Missing authentication token");
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/notifications/me?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  token?: string
): Promise<void> {
  try {
    if (!token) {
      throw new Error("Missing authentication token");
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to mark notification as read");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(token?: string): Promise<void> {
  try {
    if (!token) {
      throw new Error("Missing authentication token");
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/notifications/read-all`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to mark all notifications as read");
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}