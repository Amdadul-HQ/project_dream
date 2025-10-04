// components/notification/NotificationItem.tsx
"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Bell,
  FileText,
} from "lucide-react";
import { Notification } from "@/services/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onClick,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "POST_LIKED":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "POST_COMMENTED":
      case "COMMENT_REPLIED":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "NEW_FOLLOWER":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "POST_SHARED":
        return <Share2 className="h-5 w-5 text-purple-500" />;
      case "POST_PUBLISHED":
        return <FileText className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.();
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </p>
          {notification.content && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {notification.content}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
        </div>
        
        {!notification.isRead && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;