import Chatlist from '@/components/chat/chat-list'
import { ChatWrapper } from '@/components/chat/ChatWrapper'
import { SocketDebugger } from '@/components/chat/SocketDebugger'
import React from 'react'

const ChatList = () => {
  return (
    <ChatWrapper>
      <div className="w-full md:w-1/3 border-r border-border">
        <Chatlist/>
      </div>
      
      {/* Temporary debugger for testing WebSocket connection */}
      <div className="w-full md:w-2/3 p-4">
        <h2 className="text-xl font-semibold mb-4">Chat Debug Console</h2>
        <SocketDebugger />
      </div>
    </ChatWrapper>
  )
}

export default ChatList