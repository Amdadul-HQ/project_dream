"use client"

import { ProfileLayout } from "@/components/profile/profile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Heart, MessageCircle, Share2, TrendingUp, Users, Filter } from "lucide-react"

// Mock data
const engagementOverTime = [
  { date: "2024-01-01", likes: 45, comments: 12, shares: 8 },
  { date: "2024-01-08", likes: 67, comments: 18, shares: 15 },
  { date: "2024-01-15", likes: 89, comments: 23, shares: 12 },
  { date: "2024-01-22", likes: 156, comments: 45, shares: 28 },
  { date: "2024-01-29", likes: 203, comments: 67, shares: 41 },
]

const engagementByType = [
  { name: "Likes", value: 65, count: 2847, color: "#15803d" },
  { name: "Comments", value: 25, count: 1095, color: "#84cc16" },
  { name: "Shares", value: 10, count: 438, color: "#22c55e" },
]

const topEngagingPosts = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    engagementRate: 12.8,
    likes: 203,
    comments: 67,
    shares: 41,
    publishedAt: "2024-01-08",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    engagementRate: 10.2,
    likes: 156,
    comments: 45,
    shares: 28,
    publishedAt: "2024-01-12",
  },
  {
    id: "3",
    title: "Getting Started with Next.js 14",
    engagementRate: 8.7,
    likes: 89,
    comments: 23,
    shares: 12,
    publishedAt: "2024-01-15",
  },
]

const recentComments = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "/woman-developer.png",
    comment: "This is exactly what I needed! Thanks for the detailed explanation.",
    postTitle: "Building Scalable React Applications",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    author: "Mike Chen",
    avatar: "/man-designer.png",
    comment: "Great insights on AI integration. Looking forward to more content like this.",
    postTitle: "The Future of AI in Web Development",
    createdAt: "2024-01-19T15:45:00Z",
  },
  {
    id: "3",
    author: "Alex Rivera",
    avatar: "/person-coding.png",
    comment: "Could you do a follow-up on deployment strategies?",
    postTitle: "Getting Started with Next.js 14",
    createdAt: "2024-01-18T09:15:00Z",
  },
]

export default function EngagementPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Engagement Analytics</h2>
            <p className="text-muted-foreground">Deep dive into how your audience interacts with your content</p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Period
          </Button>
        </div>

        {/* Engagement Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +18% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,095</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +25% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">438</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Engagement Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>Track how your engagement has grown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="likes" stroke="#15803d" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="comments" stroke="#84cc16" strokeWidth={2} name="Comments" />
                  <Line type="monotone" dataKey="shares" stroke="#22c55e" strokeWidth={2} name="Shares" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Distribution</CardTitle>
              <CardDescription>Breakdown of engagement types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {engagementByType.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-lg font-bold">{item.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Engaging Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Engaging Posts</CardTitle>
            <CardDescription>Your posts with the highest engagement rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEngagingPosts.map((post, index) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <h3 className="font-semibold">{post.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{post.engagementRate}%</div>
                      <div className="text-xs text-muted-foreground">engagement rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{post.likes}</span>
                      <span className="text-sm text-muted-foreground">likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{post.comments}</span>
                      <span className="text-sm text-muted-foreground">comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{post.shares}</span>
                      <span className="text-sm text-muted-foreground">shares</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    Published on {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
            <CardDescription>Latest comments from your community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                      <AvatarFallback>
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{comment.comment}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {comment.postTitle}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  )
}
