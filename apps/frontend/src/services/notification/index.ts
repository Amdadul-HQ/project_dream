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

  connect(userId: string, token: string) {
    if (this.socket?.connected) {
      return;
    }
    console.log(token,'token')

    this.socket = io(process.env.NEXT_PUBLIC_BASE_API || "", {
      auth: { token },
      query: { userId },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("notification:new", (notification: Notification) => {
      this.emit("notification:new", notification);
    });

    this.socket.on("notification:allRead", () => {
      this.emit("notification:allRead");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
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
notificationId: string, token: string): Promise<void> {
  try {
    const token = await getTokenFromCookie();
    
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
export async function markAllNotificationsAsRead(token: string): Promise<void> {
  try {
    const token = await getTokenFromCookie();
    
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

/**
 * Helper to get token from cookie (client-side)
 */
function getTokenFromCookie(): string | undefined {
  if (typeof window === "undefined") return undefined;
  
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="));
  
  return cookie?.split("=")[1];
}