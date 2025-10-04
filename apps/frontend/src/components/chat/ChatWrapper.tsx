'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import useUser from '@/hooks/useUser';

interface ChatWrapperProps {
  children: ReactNode;
}

export function ChatWrapper({ children }: ChatWrapperProps) {
  // Get user from context
  const { user } = useUser();
  // Keep values stable during SSR to avoid hydration mismatch; compute token and userId on client
  const [clientToken, setClientToken] = useState<string | undefined>(undefined);
  const [clientUserId, setClientUserId] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Parse cookies to find accessToken
    const cookies = document.cookie ? document.cookie.split(';') : [];
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));

    if (tokenCookie) {
      setClientToken(tokenCookie.split('=')[1]);
    }

    setClientUserId(user?.id || '');
    // mark mounted after we've set client values
    setMounted(true);
  }, [user]);

  // Avoid rendering the chat UI until mounted on client to prevent hydration mismatches
  if (!mounted) {
    return <div aria-hidden className="w-full">Loading chat...</div>;
  }

  return (
    <ChatProvider token={clientToken} userId={clientUserId}>
      {children}
    </ChatProvider>
  );
}

// TODO: Implement this function based on your auth system
function getTokenFromAuth(): string | null {
  // Replace this with your actual authentication logic
  // Examples:
  
  // From localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  
  // From cookies (server-side safe)
  // import { cookies } from 'next/headers';
  // const cookieStore = cookies();
  // return cookieStore.get('authToken')?.value || null;
  
  // From your auth provider/context
  // This would need to be implemented within a component that has access to auth context
  
  return null;
}

// Example usage in your layout or pages:
/*
// In your chat layout or page:
import { ChatWrapper } from '@/components/chat/ChatWrapper';
import Chatlist from '@/components/chat/chat-list';
import ChatDetails from '@/components/chat/chat-view';

export default function ChatLayout() {
  return (
    <ChatWrapper>
      <div className="flex h-screen">
        <div className="w-1/3">
          <Chatlist />
        </div>
        <div className="flex-1">
          <ChatDetails />
        </div>
      </div>
    </ChatWrapper>
  );
}
*/