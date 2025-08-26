"use client"

import { ProfileLayout } from "@/components/profile/profile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, Calendar, Tag, Filter, Star } from "lucide-react"

// Mock data
const categoryPerformance = [
  { category: "React", posts: 25, avgViews: 2400, avgEngagement: 9.2, color: "#15803d" },
  { category: "Next.js", posts: 18, avgViews: 2100, avgEngagement: 8.7, color: "#84cc16" },
  { category: "AI", posts: 15, avgViews: 2800, avgEngagement: 11.5, color: "#22c55e" },
  { category: "Database", posts: 12, avgViews: 1600, avgEngagement: 6.8, color: "#16a34a" },
  { category: "UI/UX", posts: 10, avgViews: 1900, avgEngagement: 7.9, color: "#65a30d" },
]

const contentTypes = [
  { name: "Tutorials", value: 45, posts: 40, color: "#15803d" },
  { name: "Tips & Tricks", value: 30, posts: 27, color: "#84cc16" },
  { name: "Case Studies", value: 15, posts: 13, color: "#22c55e" },
  { name: "Opinion", value: 10, posts: 9, color: "#16a34a" },
]

const topPerformingContent = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    category: "React",
    type: "Tutorial",
    views: 3200,
    engagement: 12.8,
    publishedAt: "2024-01-08",
    performance: "Excellent",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    category: "AI",
    type: "Opinion",
    views: 2800,
    engagement: 11.5,
    publishedAt: "2024-01-12",
    performance: "Excellent",
  },
  {
    id: "3",
    title: "Next.js 14 Performance Tips",
    category: "Next.js",
    type: "Tips & Tricks",
    views: 2400,
    engagement: 8.7,
    publishedAt: "2024-01-15",
    performance: "Good",
  },
  {
    id: "4",
    title: "Database Optimization Strategies",
    category: "Database",
    type: "Tutorial",
    views: 1600,
    engagement: 6.8,
    publishedAt: "2024-01-05",
    performance: "Average",
  },
]

const contentTrends = [
  { month: "Sep", tutorials: 8, tips: 5, cases: 2, opinion: 1 },
  { month: "Oct", tutorials: 10, tips: 6, cases: 3, opinion: 2 },
  { month: "Nov", tutorials: 12, tips: 8, cases: 4, opinion: 2 },
  { month: "Dec", tutorials: 15, tips: 10, cases: 5, opinion: 3 },
  { month: "Jan", tutorials: 18, tips: 12, cases: 6, opinion: 4 },
]

export default function ContentPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Content Performance</h2>
            <p className="text-muted-foreground">
              Analyze your content strategy and discover what resonates with your audience
            </p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Content
          </Button>
        </div>

        {/* Content Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">pieces published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Category</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">AI</div>
              <p className="text-xs text-muted-foreground">11.5% avg engagement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Type</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tutorials</div>
              <p className="text-xs text-muted-foreground">45% of content</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4%</div>
              <p className="text-xs text-muted-foreground">engagement rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>How different content categories perform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="avgViews" fill="#15803d" name="Avg Views" />
                <Bar yAxisId="right" dataKey="avgEngagement" fill="#84cc16" name="Avg Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Content Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type Distribution</CardTitle>
              <CardDescription>Breakdown of your content by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={contentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {contentTypes.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">
                      {item.name}: {item.posts}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Content Publishing Trends</CardTitle>
              <CardDescription>Your content output over time by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={contentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tutorials" stackId="a" fill="#15803d" name="Tutorials" />
                  <Bar dataKey="tips" stackId="a" fill="#84cc16" name="Tips" />
                  <Bar dataKey="cases" stackId="a" fill="#22c55e" name="Case Studies" />
                  <Bar dataKey="opinion" stackId="a" fill="#16a34a" name="Opinion" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Your best content ranked by performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingContent.map((content, index) => (
                <div key={content.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <h3 className="font-semibold">{content.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{content.category}</Badge>
                          <Badge variant="outline">{content.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          content.performance === "Excellent"
                            ? "default"
                            : content.performance === "Good"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {content.performance}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-lg font-bold">{content.views.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{content.engagement}%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                    <div>
                      <div className="text-sm">{new Date(content.publishedAt).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">published</div>
                    </div>
                  </div>

                  <Progress value={content.engagement * 8} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Content Insights</CardTitle>
            <CardDescription>Key takeaways from your content performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Top Performing Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Content</span>
                    <span className="text-sm font-medium">11.5% engagement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">React Tutorials</span>
                    <span className="text-sm font-medium">9.2% engagement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next.js Guides</span>
                    <span className="text-sm font-medium">8.7% engagement</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Content Recommendations</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Focus more on AI-related content (highest engagement)</p>
                  <p>• Tutorials perform better than opinion pieces</p>
                  <p>• Consider more case studies (underrepresented)</p>
                  <p>• Database content needs improvement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  )
}
