import { Conversation, PrivateMessage } from './socket';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ChatApiService {
  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async fetchConversations(token: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`${BASE_URL}/private-chat/conversations`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Conversation[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async fetchMessageHistory(conversationId: string, token: string): Promise<PrivateMessage[]> {
    try {
      const response = await fetch(`${BASE_URL}/ts/private-chat/history/${conversationId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PrivateMessage[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching message history:', error);
      throw error;
    }
  }

  async sendMessageRest(recipientId: string, content: string, token: string): Promise<PrivateMessage> {
    try {
      const response = await fetch(`${BASE_URL}/ts/private-chat/send`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({
          recipientId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PrivateMessage> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error sending message via REST:', error);
      throw error;
    }
  }

  async markAsRead(conversationId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/ts/private-chat/mark-read/${conversationId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }

  async createConversation(participantId: string, token: string): Promise<Conversation> {
    try {
      const response = await fetch(`${BASE_URL}/ts/private-chat/conversations`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({
          participantId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Conversation> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async searchUsers(query: string, token: string): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/ts/users/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatApiService = new ChatApiService();