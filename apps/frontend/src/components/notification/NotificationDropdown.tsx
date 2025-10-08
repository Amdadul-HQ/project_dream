// components/notification/NotificationDropdown.tsx
"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import NotificationList from "./NotificationList";
import useNotifications from "@/hooks/useNotification";

interface NotificationDropdownProps {
  userId: string;
  token: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userId,
  token,
}) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useNotifications(userId, token);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="end"
        style={{
          maxHeight: isExpanded ? "500px" : "320px",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          hasMore={hasMore}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onLoadMore={loadMore}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;