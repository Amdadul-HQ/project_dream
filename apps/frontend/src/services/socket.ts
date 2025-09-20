import { io, Socket } from 'socket.io-client';

export interface PrivateMessage {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface SendPrivateMessageDto {
  content: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage?: string;
  timestamp?: string;
  unread: number;
  type?: 'text' | 'audio';
}

class SocketService {
  private socket: Socket | null = null;
  private baseUrl: string;

  constructor() {
  // Prefer explicit socket URL env var (keeps REST API and socket host separate)
  const socketEnv = process.env.NEXT_PUBLIC_SOCKET_URL;
  const apiUrl = socketEnv || process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000';
    // Parse and keep only the origin (strip paths) to ensure websocket base is correct
    try {// e.g., https://project-dream-backend.onrender.com
      this.baseUrl = "https://project-dream-backend.onrender.com";
    } catch (err) {
      // Fallback: naive replacement
      this.baseUrl = "https://project-dream-backend.onrender.com";
    }

    console.log('WebSocket URL:', this.baseUrl);
  }

  connect(token: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      console.log('Attempting to connect to WebSocket server:', this.baseUrl);
      
      // First try connecting to the main server
      // Use polling first to avoid browser websocket handshake issues (CORS/upgrade)
      this.socket = io(this.baseUrl, {
        auth: { token },  // Pass JWT here
        forceNew: true,
        transports: ['polling', 'websocket'],
        timeout: 15000, // 15 second timeout
        autoConnect: true
      });

      const connectTimeout = setTimeout(() => {
        if (!this.socket?.connected) {
          const err = new Error('Socket connection timeout');
          console.error(err);
          reject(err);
        }
      }, 15000);

      this.socket.on('connect', () => {
        console.log('Connected to chat server successfully');
        console.log('Socket ID:', this.socket?.id);
        
        // Test if we can access the private namespace by trying to join it
        this.socket?.emit('join-private-chat', { token });
        
        // Add debugging to see what events are available
        this.socket?.onAny((eventName, ...args) => {
          console.log('Received event:', eventName, args);
        });
        
        clearTimeout(connectTimeout);
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error: any) => {
        // Richer logging for browser console to diagnose failures
        console.error('Connection failed:', error?.message || error);
        try {
          console.error('Connect error details:', {
            message: error?.message,
            code: error?.code,
            data: error?.data,
            stack: error?.stack
          });
        } catch (err) {
          console.error('Failed to stringify connect_error:', err);
        }

        // If main connection fails, try with /private namespace
        console.log('Retrying with /private namespace...');

        this.socket?.disconnect();
        this.socket = io(`${this.baseUrl}/private`, {
          auth: { token },
          forceNew: true,
          transports: ['polling', 'websocket'],
          timeout: 15000
        });
        
        this.socket.on('connect', () => {
          console.log('Connected to /private namespace successfully');
          resolve(this.socket!);
        });
        
        this.socket.on('connect_error', (retryError) => {
          console.error('Failed to connect to both main and /private namespace:', retryError);
          reject(retryError);
        });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from chat server:', reason);
      });

      // Add additional error handling
      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send a private message using the backend's expected format
  sendMessage(recipientId: string, dto: SendPrivateMessageDto, userId: string, file?: File) {
    if (this.socket?.connected) {
      console.log('Sending message with data:', { recipientId, dto, userId, file });
      
      // Primary message format - try the most likely event names
      const messageData = {
        recipientId,
        dto,
        userId,
        file,
        timestamp: new Date().toISOString()
      };

      // Try multiple event names in order of preference
      const eventNames = [
        'private:send_message'
      ];

      console.log(`Trying primary event: ${eventNames[0]}`);
      this.socket.emit(eventNames[0], messageData);
      
      // Also try alternative formats as fallbacks
      setTimeout(() => {
        console.log('Sending fallback events...');
        
        // Simple format fallback
        this.socket!.emit('sendMessage', {
          recipientId,
          content: dto.content,
          userId,
          file
        });
        
        // Another common format
        this.socket!.emit('message', {
          to: recipientId,
          content: dto.content,
          from: userId
        });

        // Direct content format
        this.socket!.emit('send-private-message', {
          senderId: userId,
          receiverId: recipientId,
          message: dto.content,
          timestamp: new Date().toISOString()
        });
        
      }, 500);
      
    } else {
      console.error('Socket not connected - cannot send message');
    }
  }

  // Listen for incoming messages with multiple possible event names
  onMessage(callback: (message: PrivateMessage) => void) {
    if (this.socket) {
      // Listen for various possible message events
      this.socket.on('private:new_message', callback);
    }
  }

  // Listen for message status updates
  onMessageStatus(callback: (data: { messageId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('messageStatus', callback);
    }
  }

  // Listen for typing indicators
  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  // Send typing indicator
  sendTyping(recipientId: string, isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('typing', { recipientId, isTyping });
    }
  }

  // Listen for user status changes
  onUserStatus(callback: (data: { userId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('userStatus', callback);
    }
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketService = new SocketService();