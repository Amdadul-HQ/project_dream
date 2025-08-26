"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Shield, CheckCircle, XCircle, Clock, Eye, Filter, MoreHorizontal } from "lucide-react"
import { ProfileLayout } from "@/components/profile/profile-layout"

// Mock data
const reportsSummary = {
  total: 12,
  pending: 3,
  resolved: 7,
  dismissed: 2,
}

const recentReports = [
  {
    id: "1",
    postTitle: "Getting Started with Next.js 14",
    reason: "Spam content",
    status: "PENDING",
    reportedAt: "2024-01-20T10:30:00Z",
    reportedBy: {
      name: "Anonymous User",
      avatar: "/anonymous-user.png",
    },
    priority: "Medium",
  },
  {
    id: "2",
    postTitle: "The Future of AI in Web Development",
    reason: "Inappropriate content",
    status: "RESOLVED",
    reportedAt: "2024-01-18T15:45:00Z",
    resolvedAt: "2024-01-19T09:30:00Z",
    reportedBy: {
      name: "Sarah Johnson",
      avatar: "/woman-developer.png",
    },
    priority: "High",
    resolution: "No action needed - content is appropriate",
  },
  {
    id: "3",
    postTitle: "Building Scalable React Applications",
    reason: "Copyright violation",
    status: "DISMISSED",
    reportedAt: "2024-01-15T12:20:00Z",
    resolvedAt: "2024-01-16T14:15:00Z",
    reportedBy: {
      name: "Mike Chen",
      avatar: "/man-designer.png",
    },
    priority: "Low",
    resolution: "Report was invalid - original content confirmed",
  },
  {
    id: "4",
    postTitle: "Database Design Best Practices",
    reason: "Misleading information",
    status: "RESOLVED",
    reportedAt: "2024-01-12T08:15:00Z",
    resolvedAt: "2024-01-13T16:45:00Z",
    reportedBy: {
      name: "Alex Rivera",
      avatar: "/person-coding.png",
    },
    priority: "Medium",
    resolution: "Content updated with corrections",
  },
]

const contentStatus = [
  {
    id: "1",
    title: "Advanced React Patterns",
    status: "UNDER_REVIEW",
    reviewedAt: "2024-01-21T10:00:00Z",
    reason: "Automated content review",
    priority: "Low",
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    status: "PUBLISHED",
    publishedAt: "2024-01-20T14:30:00Z",
    views: 1250,
  },
  {
    id: "3",
    title: "GraphQL vs REST APIs",
    status: "HOLD",
    heldAt: "2024-01-19T11:20:00Z",
    reason: "Pending fact-check verification",
    priority: "Medium",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "RESOLVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "DISMISSED":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "UNDER_REVIEW":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "PUBLISHED":
      return "bg-green-100 text-green-800 border-green-200"
    case "HOLD":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function ReportsPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Reports & Moderation</h2>
            <p className="text-muted-foreground">Monitor content reports and moderation status</p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reports
          </Button>
        </div>

        {/* Reports Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsSummary.total}</div>
              <p className="text-xs text-muted-foreground">all time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{reportsSummary.pending}</div>
              <p className="text-xs text-muted-foreground">need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{reportsSummary.resolved}</div>
              <p className="text-xs text-muted-foreground">completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
              <XCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{reportsSummary.dismissed}</div>
              <p className="text-xs text-muted-foreground">invalid reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest reports submitted against your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{report.postTitle}</h3>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Reason:</strong> {report.reason}
                      </p>
                      {report.resolution && (
                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                          <strong>Resolution:</strong> {report.resolution}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={report.reportedBy.avatar || "/placeholder.svg"}
                          alt={report.reportedBy.name}
                        />
                        <AvatarFallback className="text-xs">
                          {report.reportedBy.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">Reported by {report.reportedBy.name}</span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Reported: {new Date(report.reportedAt).toLocaleDateString()}</div>
                      {report.resolvedAt && <div>Resolved: {new Date(report.resolvedAt).toLocaleDateString()}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Status */}
        <Card>
          <CardHeader>
            <CardTitle>Content Moderation Status</CardTitle>
            <CardDescription>Current status of your content in the moderation pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentStatus.map((content) => (
                <div key={content.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{content.title}</h3>
                      <Badge className={getStatusColor(content.status)}>{content.status.replace("_", " ")}</Badge>
                      {content.priority && (
                        <Badge className={getPriorityColor(content.priority)}>{content.priority}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {content.views && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {content.views.toLocaleString()}
                        </div>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {content.reason && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Reason:</strong> {content.reason}
                    </p>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {content.publishedAt && (
                      <span>Published: {new Date(content.publishedAt).toLocaleDateString()}</span>
                    )}
                    {content.reviewedAt && (
                      <span>Under review since: {new Date(content.reviewedAt).toLocaleDateString()}</span>
                    )}
                    {content.heldAt && <span>On hold since: {new Date(content.heldAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Moderation Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Content Guidelines
            </CardTitle>
            <CardDescription>Key points to keep your content compliant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Do&apos;s</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Provide accurate and well-researched information</li>
                  <li>• Credit sources and respect copyright</li>
                  <li>• Use respectful and professional language</li>
                  <li>• Follow community guidelines</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-destructive">Don&apos;ts</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Share misleading or false information</li>
                  <li>• Use copyrighted content without permission</li>
                  <li>• Post spam or promotional content</li>
                  <li>• Engage in harassment or inappropriate behavior</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  )
}
