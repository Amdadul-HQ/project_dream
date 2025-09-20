"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Mic, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChat } from "@/contexts/ChatContext"
import { useParams, useRouter } from "next/navigation"



const ChatDetails=() => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const params = useParams()
  
  const {
    conversations,
    currentConversation,
    messages,
    sendMessage,
    loadMessages,
    sendTyping,
    typingUsers,
    setCurrentConversation,
    userId: currentUserId
  } = useChat()

  const conversationId = (params?.id as string) || currentConversation || ""
  const conversation = conversations.find(c => c.id === conversationId)
  const conversationMessages = conversationId ? (messages[conversationId] || []) : []

  // Set current conversation when component mounts
  useEffect(() => {
    if (conversationId && conversationId !== currentConversation) {
      setCurrentConversation(conversationId)
    }
  }, [conversationId, currentConversation, setCurrentConversation])

  // Load messages for this conversation
  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId)
    }
  }, [conversationId, loadMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationMessages])

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // Handle typing indicators
  const handleTyping = (value: string) => {
    setMessage(value)
    
    if (conversation && value && !isTyping) {
      setIsTyping(true)
      sendTyping(conversation.user.id, true)
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (conversation) {
        setIsTyping(false)
        sendTyping(conversation.user.id, false)
      }
    }, 1000)
  }

  const handleSend = () => {
    if (message.trim() && conversation) {
      sendMessage(conversation.user.id, message.trim())
      setMessage("")
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false)
        sendTyping(conversation.user.id, false)
      }
      
      // Clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const handleBack = () => {
    router.push('/chat')
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'read':
        return 'bg-blue-400'
      case 'delivered':
        return 'bg-gray-400'
      case 'sent':
        return 'bg-gray-300'
      default:
        return 'bg-gray-300'
    }
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Conversation not found</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Chats
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-border bg-card">
        <Button variant="ghost" size="sm" 
        // onClick={onBack} 
        className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
          <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <h2 className="font-medium">{conversation.user.name}</h2>
          <p className="text-xs text-muted-foreground">
            {typingUsers[conversation.user.id] ? (
              <span className="text-blue-500">typing...</span>
            ) : (
              conversation.user.status
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Separator */}
        <div className="flex justify-center">
          <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">Tuesday, 15</span>
        </div>

        {conversationMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.senderId === currentUserId
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-end mt-1 gap-1">
                <span className="text-xs opacity-70">{formatTimestamp(msg.timestamp)}</span>
                {msg.senderId === currentUserId && (
                  <div className="flex">
                    <div className={`w-1 h-1 rounded-full ${getMessageStatus(msg.status)}`} />
                    <div className={`w-1 h-1 rounded-full ml-0.5 ${getMessageStatus(msg.status)}`} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Hi! How do you?"
              className="pr-10 rounded-full"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          {message.trim() ? (
            <Button size="sm" onClick={handleSend} className="rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}


export default ChatDetails;