import { useEffect, useRef, useCallback, useState } from 'react';
import { socketService, PrivateMessage, SendPrivateMessageDto } from '../services/socket';

export const useSocket = (token?: string) => {
  const isConnecting = useRef(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    if (token && !isConnected && !isConnecting.current) {
      isConnecting.current = true;
      
      socketService.connect(token)
        .then(() => {
          console.log('Socket connected successfully');
          setIsConnected(true);
        })
        .catch((error) => {
          console.error('Socket connection failed:', error);
          setIsConnected(false);
        })
        .finally(() => {
          isConnecting.current = false;
        });
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive for the session
      // socketService.disconnect();
    };
  }, [token, isConnected]);

  const sendMessage = useCallback((recipientId: string, dto: SendPrivateMessageDto, userId: string, file?: File) => {
    if (!isConnected) {
      console.error('Socket not connected');
      return;
    }
    socketService.sendMessage(recipientId, dto, userId, file);
  }, [isConnected]);

  const sendTyping = useCallback((recipientId: string, isTyping: boolean) => {
    socketService.sendTyping(recipientId, isTyping);
  }, []);

  // Listen specifically for backend's private new message event
  const onMessage = useCallback((callback: (message: PrivateMessage) => void) => {
    // Map to the explicit backend event
    socketService.onMessage(callback); // socketService already binds common names
    return () => socketService.off('private:new_message', callback);
  }, []);

  const onMessageStatus = useCallback((callback: (data: { messageId: string; status: string }) => void) => {
    socketService.onMessageStatus(callback);
    return () => socketService.off('messageStatus', callback);
  }, []);

  const onTyping = useCallback((callback: (data: { userId: string; isTyping: boolean }) => void) => {
    socketService.onTyping(callback);
    return () => socketService.off('typing', callback);
  }, []);

  const onUserStatus = useCallback((callback: (data: { userId: string; status: string }) => void) => {
    socketService.onUserStatus(callback);
    return () => socketService.off('userStatus', callback);
  }, []);

  // --- Private namespace specific helpers ---
  // Request list of conversations from backend
  const requestConversations = useCallback(() => {
    // emit event that backend expects
    const socket = socketService.getSocket();
    if (!socket) return;
    socket.emit('private:conversations');
  }, []);

  // Listen for conversations response (server may emit same or other event name)
  const onConversations = useCallback((callback: (conversations: any[]) => void) => {
    const socket = socketService.getSocket();
    if (!socket) return () => {};
    socket.on('private:conversations', callback);
    return () => socket.off('private:conversations', callback);
  }, []);

  // Request chat history for a conversation
  const requestChatHistory = useCallback((conversationId: string) => {
    const socket = socketService.getSocket();
    if (!socket) return;
    socket.emit('private:chat_history', { conversationId });
  }, []);

  // Listen for chat history response
  const onChatHistory = useCallback((callback: (messages: PrivateMessage[]) => void) => {
    const socket = socketService.getSocket();
    if (!socket) return () => {};
    socket.on('private:chat_history', callback);
    return () => socket.off('private:chat_history', callback);
  }, []);

  // Mark messages as read
  const markMessagesRead = useCallback((conversationId: string, messageIds: string[]) => {
    const socket = socketService.getSocket();
    if (!socket) return;
    socket.emit('private:messages_read', { conversationId, messageIds });
  }, []);

  return {
    isConnected,
    sendMessage,
    sendTyping,
    onMessage,
    onMessageStatus,
    onTyping,
    onUserStatus,
    // Private namespace helpers
    requestConversations,
    onConversations,
    requestChatHistory,
    onChatHistory,
    markMessagesRead,
  };
};