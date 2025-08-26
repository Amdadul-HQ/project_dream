"use client"

import { ProfileLayout } from "@/components/profile/profile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Eye, Heart, MessageCircle, Share2, Calendar, TrendingUp, Filter } from "lucide-react"

// Mock data for posts
const postsData = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    publishedAt: "2024-01-15",
    views: 2400,
    likes: 89,
    comments: 23,
    shares: 12,
    status: "PUBLISHED",
    category: "Technology",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    publishedAt: "2024-01-12",
    views: 1800,
    likes: 156,
    comments: 45,
    shares: 28,
    status: "PUBLISHED",
    category: "AI",
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    publishedAt: "2024-01-08",
    views: 3200,
    likes: 203,
    comments: 67,
    shares: 41,
    status: "PUBLISHED",
    category: "React",
  },
  {
    id: "4",
    title: "Database Design Best Practices",
    publishedAt: "2024-01-05",
    views: 1500,
    likes: 78,
    comments: 19,
    shares: 15,
    status: "PUBLISHED",
    category: "Database",
  },
]

const postPerformanceChart = [
  { date: "2024-01-01", views: 1200, engagement: 6.5 },
  { date: "2024-01-05", views: 1500, engagement: 7.2 },
  { date: "2024-01-08", views: 3200, engagement: 9.8 },
  { date: "2024-01-12", views: 1800, engagement: 12.8 },
  { date: "2024-01-15", views: 2400, engagement: 5.2 },
]

export default function PostsPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Posts Analytics</h2>
            <p className="text-muted-foreground">Detailed performance metrics for your content</p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Posts
          </Button>
        </div>

        {/* Posts Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+4 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.1K</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">React</div>
              <p className="text-xs text-muted-foreground">32% of total posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Post Performance Over Time</CardTitle>
            <CardDescription>Views and engagement rate for your recent posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={postPerformanceChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="views" fill="#15803d" name="Views" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#84cc16"
                  strokeWidth={2}
                  name="Engagement %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Individual Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Performance breakdown for your latest content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postsData.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <Badge variant="outline">{post.category}</Badge>
                        <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>{post.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Published on {new Date(post.publishedAt).toLocaleDateString()}
                      </p>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{post.likes}</span>
                          <span className="text-xs text-muted-foreground">likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{post.comments}</span>
                          <span className="text-xs text-muted-foreground">comments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{post.shares}</span>
                          <span className="text-xs text-muted-foreground">shares</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {(((post.likes + post.comments + post.shares) / post.views) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">engagement</div>
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
