'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { PrivateMessage, Conversation, User } from '../services/socket';

// Types
interface ChatState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Record<string, PrivateMessage[]>;
  typingUsers: Record<string, boolean>;
  onlineUsers: Set<string>;
  loading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: { message: PrivateMessage; currentUserId: string } }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { messageId: string; status: string } }
  | { type: 'SET_MESSAGES'; payload: { conversationId: string; messages: PrivateMessage[] } }
  | { type: 'SET_TYPING'; payload: { userId: string; isTyping: boolean } }
  | { type: 'SET_USER_STATUS'; payload: { userId: string; status: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_CONVERSATION_LAST_MESSAGE'; payload: { conversationId: string; message: string; timestamp: string } };

// Initial state
const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  loading: false,
  error: null,
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    
    case 'ADD_MESSAGE':
      const { message, currentUserId } = action.payload;
      const conversationId = message.senderId === currentUserId 
        ? message.recipientId 
        : message.senderId;
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [
            ...(state.messages[conversationId] || []),
            message
          ]
        }
      };
    
    case 'UPDATE_MESSAGE_STATUS':
      const { messageId, status } = action.payload;
      const updatedMessages = { ...state.messages };
      
      Object.keys(updatedMessages).forEach(convId => {
        updatedMessages[convId] = updatedMessages[convId].map(msg =>
          msg.id === messageId ? { ...msg, status: status as any } : msg
        );
      });
      
      return { ...state, messages: updatedMessages };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages
        }
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.userId]: action.payload.isTyping
        }
      };
    
    case 'SET_USER_STATUS':
      const { userId, status: userStatus } = action.payload;
      const newOnlineUsers = new Set(state.onlineUsers);
      
      if (userStatus === 'online') {
        newOnlineUsers.add(userId);
      } else {
        newOnlineUsers.delete(userId);
      }
      
      return {
        ...state,
        onlineUsers: newOnlineUsers,
        conversations: state.conversations.map(conv =>
          conv.user.id === userId
            ? { ...conv, user: { ...conv.user, status: userStatus as any } }
            : conv
        )
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_CONVERSATION_LAST_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                lastMessage: action.payload.message,
                timestamp: action.payload.timestamp
              }
            : conv
        )
      };
    
    default:
      return state;
  }
}

// Context
interface ChatContextType extends ChatState {
  sendMessage: (recipientId: string, content: string, file?: File) => void;
  setCurrentConversation: (conversationId: string | null) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  sendTyping: (recipientId: string, isTyping: boolean) => void;
  userId: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
interface ChatProviderProps {
  children: ReactNode;
  token?: string;
  userId?: string;
}

export function ChatProvider({ children, token, userId = '' }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const {
    isConnected,
    sendMessage: socketSendMessage,
    sendTyping: socketSendTyping,
    onMessage,
    onMessageStatus,
    onTyping,
    onUserStatus,
    requestConversations,
    onConversations,
    requestChatHistory,
    onChatHistory,
    markMessagesRead,
  } = useSocket(token);

  // Set up socket listeners for real-time communication
  useEffect(() => {
    if (!isConnected) return;
    // Request conversations list when socket connects
    try {
      requestConversations?.();
    } catch (err) {
      console.warn('requestConversations failed:', err);
    }

    const unsubscribeMessage = onMessage((message: PrivateMessage) => {
      dispatch({ type: 'ADD_MESSAGE', payload: { message, currentUserId: userId } });
      
      // Update conversation last message
      const conversationId = message.senderId === userId 
        ? message.recipientId 
        : message.senderId;
      
      dispatch({
        type: 'UPDATE_CONVERSATION_LAST_MESSAGE',
        payload: {
          conversationId,
          message: message.content,
          timestamp: message.timestamp
        }
      });
    });

    const unsubscribeMessageStatus = onMessageStatus((data) => {
      dispatch({ type: 'UPDATE_MESSAGE_STATUS', payload: data });
    });

    const unsubscribeTyping = onTyping((data) => {
      dispatch({ type: 'SET_TYPING', payload: data });
    });

    const unsubscribeUserStatus = onUserStatus((data) => {
      dispatch({ type: 'SET_USER_STATUS', payload: data });
    });

    // Listen for conversations payload from server
    const unsubscribeConversations = onConversations((conversations: any[]) => {
      // Map server conversation shape to Conversation[] if necessary
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations as Conversation[] });
    });

    // Listen for chat history payload
    const unsubscribeChatHistory = onChatHistory((messages: PrivateMessage[]) => {
      if (!messages || messages.length === 0) return;
      const convId = messages[0].senderId === userId ? messages[0].recipientId : messages[0].senderId;
      dispatch({ type: 'SET_MESSAGES', payload: { conversationId: convId, messages } });
    });

    return () => {
      unsubscribeMessage();
      unsubscribeMessageStatus();
      unsubscribeTyping();
      unsubscribeUserStatus();
      unsubscribeConversations();
      unsubscribeChatHistory();
    };
  }, [isConnected, userId, onMessage, onMessageStatus, onTyping, onUserStatus, onConversations, onChatHistory, requestConversations]);

  // Actions
  const sendMessage = useCallback((recipientId: string, content: string, file?: File) => {
    if (!isConnected) {
      dispatch({ type: 'SET_ERROR', payload: 'Not connected to chat server' });
      return;
    }

    const dto = { content };

    // Send message using the WebSocket with proper format
    socketSendMessage(recipientId, dto, userId, file);

    // Optimistically add message to state
    const optimisticMessage: PrivateMessage = {
      id: Date.now().toString(), // Temporary ID
      content,
      senderId: userId,
      recipientId,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { message: optimisticMessage, currentUserId: userId } });
  }, [isConnected, socketSendMessage, userId]);

  const setCurrentConversation = useCallback((conversationId: string | null) => {
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationId });
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // If socket is connected, conversations will be populated via the onConversations listener
      // which is triggered by requestConversations() on connect. If not connected, implement
      // a REST fallback here to fetch conversations from the API.
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load conversations' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // If socket is connected, request history via socket and let the onChatHistory listener
      // populate the messages. If socket isn't connected, implement a REST fallback here.
      if (isConnected) {
        try {
          requestChatHistory(conversationId);
          return;
        } catch (err) {
          console.warn('requestChatHistory failed:', err);
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userId, isConnected, requestChatHistory]);

  const markAsRead = useCallback((conversationId: string) => {
    // Emit messages read via socket
    if (isConnected) {
      // For simplicity, mark all messages in conversation as read
      const msgs = state.messages[conversationId] || [];
      const messageIds = msgs.map(m => m.id);
      try {
        markMessagesRead(conversationId, messageIds);
      } catch (err) {
        console.warn('markMessagesRead failed:', err);
      }
    } else {
      console.log('Not connected - cannot mark messages as read');
    }
  }, [isConnected, markMessagesRead, state.messages]);

  const sendTyping = useCallback((recipientId: string, isTyping: boolean) => {
    if (isConnected) {
      socketSendTyping(recipientId, isTyping);
    }
  }, [isConnected, socketSendTyping]);

  const contextValue: ChatContextType = {
    ...state,
    sendMessage,
    setCurrentConversation,
    loadConversations,
    loadMessages,
    markAsRead,
    sendTyping,
    userId,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// Hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}