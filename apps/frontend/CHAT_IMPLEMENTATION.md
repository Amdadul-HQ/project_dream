# Private Chat Implementation - Usage Guide

## Overview
This implementation provides a complete real-time private chat system for your Next.js application using Socket.IO for real-time communication and REST APIs for data persistence.

## Files Created

### Core Services
- `src/services/socket.ts` - WebSocket service for real-time communication
- `src/services/chatApi.ts` - REST API service for data persistence
- `src/hooks/useSocket.ts` - React hook for socket integration
- `src/contexts/ChatContext.tsx` - Global chat state management

### Components
- `src/components/chat/ChatWrapper.tsx` - Authentication wrapper
- Updated `src/components/chat/chat-list.tsx` - Real-time conversation list
- Updated `src/components/chat/chat-view.tsx` - Real-time chat interface

## Quick Setup

### 1. Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_BASE_API=http://localhost:5000
```

### 2. Authentication Integration
Update `ChatWrapper.tsx` to use your authentication system:

```tsx
// Example with auth context
import { useAuth } from '@/contexts/AuthContext';

export function ChatWrapper({ children }: ChatWrapperProps) {
  const { token } = useAuth(); // Replace with your auth hook
  
  return (
    <ChatProvider token={token}>
      {children}
    </ChatProvider>
  );
}
```

### 3. Layout Integration
Create or update your chat layout:

```tsx
// app/(main)/chat/layout.tsx
import { ChatWrapper } from '@/components/chat/ChatWrapper';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatWrapper>
      <div className="flex h-screen">
        {children}
      </div>
    </ChatWrapper>
  );
}
```

### 4. Chat Pages
Create your chat pages:

```tsx
// app/(main)/chat/page.tsx
import Chatlist from '@/components/chat/chat-list';

export default function ChatsPage() {
  return (
    <div className="w-full md:w-1/3 border-r">
      <Chatlist />
    </div>
  );
}

// app/(main)/chat/[id]/page.tsx
import ChatDetails from '@/components/chat/chat-view';

export default function ChatPage() {
  return (
    <div className="flex-1">
      <ChatDetails />
    </div>
  );
}
```

## Features Implemented

### Real-time Features
- ✅ WebSocket connection with JWT authentication
- ✅ Real-time message sending and receiving
- ✅ Typing indicators
- ✅ User online/offline status
- ✅ Message status (sent, delivered, read)
- ✅ Automatic reconnection handling

### UI Features
- ✅ Responsive conversation list
- ✅ Real-time message updates
- ✅ Search conversations
- ✅ Message status indicators
- ✅ Typing indicators in chat view
- ✅ Auto-scroll to latest messages
- ✅ Empty states and loading states

### State Management
- ✅ Global chat context
- ✅ Optimistic UI updates
- ✅ Message persistence
- ✅ Conversation management

## Backend Integration

### WebSocket Events
The frontend listens for these events from your backend:
- `connect` - Connection established
- `disconnect` - Connection lost
- `message` - New message received
- `messageStatus` - Message status update
- `typing` - Typing indicator
- `userStatus` - User online/offline status

### WebSocket Emitters
The frontend sends these events to your backend:
- `sendMessage` - Send a new message
- `typing` - Send typing indicator

### REST API Endpoints
The frontend expects these REST endpoints:
- `GET /ts/private-chat/conversations` - Fetch conversations
- `GET /ts/private-chat/history/:userId` - Fetch message history
- `POST /ts/private-chat/send` - Send message (fallback)
- `POST /ts/private-chat/mark-read/:conversationId` - Mark as read

## Customization

### Authentication
Update the `getCurrentUserId()` function in `ChatContext.tsx`:

```tsx
function getCurrentUserId(): string {
  // Replace with your auth implementation
  const { user } = useAuth();
  return user?.id || '1';
}
```

### API Integration
Update the mock data in `ChatContext.tsx` to use real API calls:

```tsx
const loadConversations = async () => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const conversations = await chatApiService.fetchConversations(token!);
    dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Failed to load conversations' });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};
```

### Styling
The components use Tailwind CSS and shadcn/ui components. Customize the styles by modifying the className props.

## Error Handling

The implementation includes comprehensive error handling:
- Connection failures
- Authentication errors
- API failures
- Network issues
- Graceful degradation

## Performance Considerations

- Messages are loaded per conversation (not all at once)
- Typing indicators have debouncing
- Socket connection is reused across components
- Optimistic UI updates for better UX

## Next Steps

1. Replace mock data with real API calls
2. Implement proper authentication integration
3. Add file/image sharing capabilities
4. Add push notifications for background messages
5. Implement message encryption
6. Add group chat functionality

## Troubleshooting

### Connection Issues
- Check `NEXT_PUBLIC_BASE_API` environment variable
- Verify JWT token is valid
- Check browser console for WebSocket errors

### Authentication Problems
- Ensure token is passed correctly to `ChatWrapper`
- Verify token format matches backend expectations
- Check token expiration

### UI Issues
- Verify all shadcn/ui components are installed
- Check Tailwind CSS configuration
- Ensure proper routing setup