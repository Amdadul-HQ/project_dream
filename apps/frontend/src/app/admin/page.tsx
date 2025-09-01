"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, AlertTriangle, TrendingUp, Eye, Heart, MessageCircle, Music } from "lucide-react"
import { mockStats } from "@/lib/admin-data"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your platform's performance and key metrics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{mockStats.activeUsers.toLocaleString()} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalPosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{mockStats.publishedPosts.toLocaleString()} published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{mockStats.totalComments.toLocaleString()} comments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockStats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">New user registered: john.doe@example.com</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Post reported: "Advanced React Patterns"</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">New post published by Sarah Wilson</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">User blocked: mike.johnson@example.com</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Writer promoted: emma.davis@example.com</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Views</span>
              </div>
              <span className="font-semibold">{mockStats.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Likes</span>
              </div>
              <span className="font-semibold">{mockStats.totalLikes.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Comments</span>
              </div>
              <span className="font-semibold">{mockStats.totalComments.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Audio Files</span>
              </div>
              <span className="font-semibold">{mockStats.audioFiles.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">94.2%</div>
            <p className="text-xs text-muted-foreground">posts approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2.3h</div>
            <p className="text-xs text-muted-foreground">avg report resolution</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
