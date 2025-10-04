'use client';

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