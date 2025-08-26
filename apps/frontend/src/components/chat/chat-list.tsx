"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Headphones, Plus, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import Link from 'next/link'


const conversations = [
    {
      id: "1",
      user: { name: "Gyllinton", avatar: "/abstract-geometric-shapes.png", status: "online" },
      lastMessage: "I don't know what you're...",
      timestamp: "2:44 pm",
      unread: 3,
    },
    {
      id: "2",
      user: { name: "Mark", avatar: "/abstract-geometric-shapes.png", status: "offline" },
      lastMessage: "Why?",
      timestamp: "9:00 am",
      unread: 0,
    },
    {
      id: "3",
      user: { name: "Imogen", avatar: "/diverse-group-collaborating.png", status: "online" },
      lastMessage: "Kisses! 😘",
      timestamp: "Friday",
      unread: 0,
    },
    {
      id: "4",
      user: { name: "Alice", avatar: "/abstract-geometric-shapes.png", status: "away" },
      lastMessage: "Okay, I'll tell him",
      timestamp: "8:34 am",
      unread: 1,
    },
    {
      id: "5",
      user: { name: "Cloud", avatar: "/single-cumulus-cloud.png", status: "online" },
      lastMessage: "Audio",
      timestamp: "8:31 am",
      unread: 0,
      type: "audio",
    },
  ]


const Chatlist = () => {
    const [, setSelectedChat] = useState<string | null>(null)
  return (
    <div className="flex-1 flex flex-col">
            {/* Chat List Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold font-serif">Chats</h1>
                <Button size="sm" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-10 rounded-full bg-muted" />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <Link key={conversation.id} href={`chat/${conversation.id}`}>
                    <div
                  key={conversation.id}
                  className="flex items-center p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50"
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                        conversation.user.status === "online"
                          ? "bg-green-500"
                          : conversation.user.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.user.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.type === "audio" ? (
                          <span className="flex items-center">
                            <Headphones className="h-3 w-3 mr-1" />
                            {conversation.lastMessage}
                          </span>
                        ) : (
                          conversation.lastMessage
                        )}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
  )
}


export default Chatlist