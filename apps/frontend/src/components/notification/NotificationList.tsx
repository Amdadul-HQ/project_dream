// components/notification/NotificationList.tsx
"use client";

import React, { useRef } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/services/notification";

interface NotificationListProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onLoadMore: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  unreadCount,
  isLoading,
  hasMore,
  onMarkAsRead,
  onMarkAllAsRead,
  onLoadMore,
  isExpanded,
  onToggleExpand,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log(notifications,'asdfasdfasdfasdfas')
  // Auto-load more when scrolled to bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (bottom && hasMore && !isLoading) {
      onLoadMore();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto"
        style={{
          maxHeight: isExpanded ? "400px" : "220px",
        }}
      >
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}

            {/* Loading more indicator */}
            {isLoading && (
              <div className="px-4 py-3 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
              </div>
            )}

            {/* No more notifications */}
            {!hasMore && notifications.length > 0 && (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No more notifications
              </div>
            )}
          </>
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Footer with See More button */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-accent hover:text-indigo-700 hover:bg-gray-50"
            onClick={onToggleExpand}
          >
            {isExpanded ? "See less" : "See more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;