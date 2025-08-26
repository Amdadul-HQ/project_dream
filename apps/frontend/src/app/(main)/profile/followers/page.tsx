"use client"

import { ProfileLayout } from "@/components/profile/profile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Users, UserPlus, TrendingUp, Calendar, Filter } from "lucide-react"

// Mock data
const followerGrowthData = [
  { date: "2024-01-01", followers: 850, following: 420, newFollowers: 12, unfollows: 3 },
  { date: "2024-01-08", followers: 920, following: 435, newFollowers: 78, unfollows: 8 },
  { date: "2024-01-15", followers: 1050, following: 445, newFollowers: 142, unfollows: 12 },
  { date: "2024-01-22", followers: 1180, following: 450, newFollowers: 135, unfollows: 5 },
  { date: "2024-01-29", followers: 1250, following: 455, newFollowers: 75, unfollows: 5 },
]

const recentFollowers = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "@sarahj_dev",
    avatar: "/woman-developer.png",
    followedAt: "2024-01-20",
    isVerified: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    username: "@mikechen_ui",
    avatar: "/man-designer.png",
    followedAt: "2024-01-19",
    isVerified: false,
  },
  {
    id: "3",
    name: "Alex Rivera",
    username: "@alexr_code",
    avatar: "/person-coding.png",
    followedAt: "2024-01-18",
    isVerified: true,
  },
  {
    id: "4",
    name: "Emma Wilson",
    username: "@emmaw_tech",
    avatar: "/woman-tech.png",
    followedAt: "2024-01-17",
    isVerified: false,
  },
]

const topFollowers = [
  {
    id: "1",
    name: "Tech Influencer",
    username: "@techguru",
    followers: "125K",
    avatar: "/tech-influencer.png",
    isVerified: true,
  },
  {
    id: "2",
    name: "Design Studio",
    username: "@designstudio",
    followers: "89K",
    avatar: "/modern-design-studio.png",
    isVerified: true,
  },
  {
    id: "3",
    name: "Code Academy",
    username: "@codeacademy",
    followers: "67K",
    avatar: "/coding-academy.png",
    isVerified: true,
  },
]

export default function FollowersPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Followers & Following</h2>
            <p className="text-muted-foreground">Track your community growth and engagement</p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Follower Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +70 this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">455</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +5 this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follower Ratio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.75</div>
              <p className="text-xs text-muted-foreground">followers per following</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5.9%</div>
              <p className="text-xs text-muted-foreground">monthly growth</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth Over Time</CardTitle>
            <CardDescription>Track your follower and following count progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={followerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="followers"
                  stackId="1"
                  stroke="#15803d"
                  fill="#15803d"
                  fillOpacity={0.6}
                  name="Followers"
                />
                <Area
                  type="monotone"
                  dataKey="following"
                  stackId="2"
                  stroke="#84cc16"
                  fill="#84cc16"
                  fillOpacity={0.6}
                  name="Following"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New Followers vs Unfollows */}
        <Card>
          <CardHeader>
            <CardTitle>Follower Activity</CardTitle>
            <CardDescription>New followers and unfollows over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={followerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newFollowers" stroke="#15803d" strokeWidth={2} name="New Followers" />
                <Line type="monotone" dataKey="unfollows" stroke="#ef4444" strokeWidth={2} name="Unfollows" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Followers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Followers</CardTitle>
              <CardDescription>Your newest community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFollowers.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.name} />
                        <AvatarFallback>
                          {follower.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{follower.name}</p>
                          {follower.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{follower.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(follower.followedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Followers */}
          <Card>
            <CardHeader>
              <CardTitle>Notable Followers</CardTitle>
              <CardDescription>High-influence followers in your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFollowers.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.name} />
                        <AvatarFallback>
                          {follower.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{follower.name}</p>
                          {follower.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{follower.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{follower.followers}</p>
                      <p className="text-xs text-muted-foreground">followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProfileLayout>
  )
}
