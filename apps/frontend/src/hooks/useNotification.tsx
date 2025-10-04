// hooks/useNotifications.ts
"use client";

import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notificationService,
  Notification,
} from "@/services/notification";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function useNotifications(userId?: string, token?: string) {
    console.log(token,'helo')
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    if (userId && token) {
      notificationService.connect(userId, token);
      setIsConnected(true);

      // Listen for new notifications
      const handleNewNotification = (notification: Notification) => {
        console.log("New notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        toast.info(notification.title, {
          description: notification.content,
          duration: 5000,
        });
      };

      // Listen for mark all read event
      const handleAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      };

      notificationService.on("notification:new", handleNewNotification);
      notificationService.on("notification:allRead", handleAllRead);

      // Cleanup on unmount
      return () => {
        notificationService.off("notification:new", handleNewNotification);
        notificationService.off("notification:allRead", handleAllRead);
        notificationService.disconnect();
        setIsConnected(false);
      };
    }
  }, [userId, token]);

  // Fetch initial notifications
  const loadNotifications = useCallback(
    async (pageNum: number = 1) => {
      if (!userId || !token) return;

      setIsLoading(true);
      try {
        const response: any = await fetchNotifications(pageNum, 20, token);
        console.log(response,'response')
        if (pageNum === 1) {
          setNotifications(response?.items || []);
        } else {
          setNotifications((prev) => [...prev, ...(response?.items || [])]);
        }

        setUnreadCount(response.data?.unreadCount || 0);
        setHasMore((response?.items || []).length === 20);
        setPage(pageNum);
      } catch (error) {
        console.error("Error loading notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, token]
  );

  // Load initial notifications on mount
  useEffect(() => {
    if (userId && token) {
      loadNotifications(1);
    }
  }, [userId, token, loadNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!token) return;
    
    try {
      await markNotificationAsRead(notificationId, token);

      setNotifications((prev) =>
        prev.map((n: any) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  }, [token]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    
    try {
      await markAllNotificationsAsRead(token);

      // Also emit via socket for real-time sync across tabs
      notificationService.markAllReadSocket();

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  }, [token]);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadNotifications(page + 1);
    }
  }, [isLoading, hasMore, page, loadNotifications]);

  // Refresh notifications
  const refresh = useCallback(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    isConnected,
    markAsRead,
    markAllAsRead,
    loadMore,
    refresh,
  };
}