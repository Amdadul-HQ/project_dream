"use client"

import { useState } from "react"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Mic, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatViewProps {
  conversationId: string
//   onBack: () => void
}

const ChatDetails=({ conversationId }: ChatViewProps) => {
  const [message, setMessage] = useState("")

  // Mock messages based on your database schema
  const messages = [
    {
      id: "1",
      content: "Hi!",
      senderId: "2",
      timestamp: "11:59 am",
      status: "read",
    },
    {
      id: "2",
      content: "Hi",
      senderId: "1",
      timestamp: "12:56 pm",
      status: "delivered",
    },
    {
      id: "3",
      content: "We can meet? I am free",
      senderId: "2",
      timestamp: "11:59 pm",
      status: "read",
    },
    {
      id: "4",
      content: "Can you write the time and place of the meeting?",
      senderId: "2",
      timestamp: "2:41 pm",
      status: "read",
    },
    {
      id: "5",
      content: "That's fine",
      senderId: "1",
      timestamp: "2:40 pm",
      status: "sent",
    },
    {
      id: "6",
      content: "Then at 5 near the tower",
      senderId: "1",
      timestamp: "2:41 pm",
      status: "sent",
    },
    {
      id: "7",
      content: "Deal!",
      senderId: "2",
      timestamp: "2:41 pm",
      status: "read",
    },
    {
      id: "8",
      content: "Kisses! 😘",
      senderId: "2",
      timestamp: "2:52 pm",
      status: "read",
    },
  ]

  const currentUser = "1"
  const otherUser = { name: "Imogen", avatar: "/diverse-group-collaborating.png", status: "online" }

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("[v0] Sending message:", message)
      setMessage("")
    }
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
          <AvatarImage src={otherUser.avatar || "/placeholder.svg"} />
          <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <h2 className="font-medium">{otherUser.name}</h2>
          <p className="text-xs text-muted-foreground">{otherUser.status}</p>
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

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === currentUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.senderId === currentUser
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-end mt-1 gap-1">
                <span className="text-xs opacity-70">{msg.timestamp}</span>
                {msg.senderId === currentUser && (
                  <div className="flex">
                    <div className={`w-1 h-1 rounded-full ${msg.status === "read" ? "bg-blue-400" : "bg-gray-400"}`} />
                    <div
                      className={`w-1 h-1 rounded-full ml-0.5 ${
                        msg.status === "read"
                          ? "bg-blue-400"
                          : msg.status === "delivered"
                            ? "bg-gray-400"
                            : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Another Date Separator */}
        <div className="flex justify-center">
          <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">Friday, 18</span>
        </div>
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
              onChange={(e) => setMessage(e.target.value)}
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