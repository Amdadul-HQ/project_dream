import { getAccessToken } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_BASE_API;

export interface UserListItem {
  id: string;
  name: string;
  profile: string | null;
  role: "USER" | "WRITER" | "ADMIN" | "MODERATOR";
  status: "Active" | "Inactive" | "Suspended" | "Banned";
  isOnline: boolean;
  conversationId: string | null;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  unreadCount: number;
  lastMessageAt: string | null;
}

export interface UserListResponse {
  success: boolean;
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Helper to build query string
function buildQueryString(params?: Record<string, any>) {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return `?${query.toString()}`;
}

export async function getUserList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<UserListResponse> {
  const token = await getAccessToken();
  const queryString = buildQueryString(params);

  const response = await fetch(`${API_URL}/private-chat/users${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user list: ${response.statusText}`);
  }

  return (await response.json()) as UserListResponse;
}

export async function getUnreadCount(): Promise<number> {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/private-chat/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch unread count: ${response.statusText}`);
  }

  const data = await response.json();
  return data.unreadCount as number;
}
