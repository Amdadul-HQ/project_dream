"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockReports, type Report } from "@/lib/admin-data"
import {
  AlertTriangle,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  User,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [reasonFilter, setReasonFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesReason = reasonFilter === "all" || report.reason.toLowerCase().includes(reasonFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesReason
  })

  const handleResolveReport = (reportId: string, resolution?: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "RESOLVED" } : report)))
  }

  const handleDismissReport = (reportId: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "DISMISSED" } : report)))
  }

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter((report) => report.id !== reportId))
  }

  const getReportStats = () => {
    const totalReports = reports.length
    const pending = reports.filter((r) => r.status === "PENDING").length
    const resolved = reports.filter((r) => r.status === "RESOLVED").length
    const dismissed = reports.filter((r) => r.status === "DISMISSED").length

    return { totalReports, pending, resolved, dismissed }
  }

  const getUniqueReasons = () => {
    return Array.from(new Set(reports.map((report) => report.reason)))
  }

  const stats = getReportStats()
  const reasons = getUniqueReasons()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
        <p className="text-muted-foreground">Review and resolve user reports and content moderation issues</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.dismissed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Management */}
      <Card>
        <CardHeader>
          <CardTitle>Content Reports</CardTitle>
          <CardDescription>Review and resolve user reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports by post, reporter, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="DISMISSED">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {reasons.map((reason) => (
                  <SelectItem key={reason} value={reason.toLowerCase()}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{report.postTitle}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Reported by {report.reporter}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{report.reason}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge >{report.status}</Badge>
                        <span className="text-xs text-muted-foreground">{report.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <ReportDetailDialog
                      report={report}
                      onResolve={handleResolveReport}
                      onDismiss={handleDismissReport}
                    />
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {report.status === "PENDING" && (
                        <>
                          <DropdownMenuItem onClick={() => handleResolveReport(report.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDismissReport(report.id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Dismiss Report
                          </DropdownMenuItem>
                        </>
                      )}
                      {report.status !== "PENDING" && (
                        <DropdownMenuItem
                          onClick={() =>
                            setReports(reports.map((r) => (r.id === report.id ? { ...r, status: "PENDING" } : r)))
                          }
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Reopen Report
                        </DropdownMenuItem>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Report
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this report for &quot;{report.postTitle}&quot;? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReport(report.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Report Detail Dialog Component
function ReportDetailDialog({
  report,
  onResolve,
  onDismiss,
}: {
  report: Report
  onResolve: (reportId: string, resolution?: string) => void
  onDismiss: (reportId: string) => void
}) {
  const [resolution, setResolution] = useState("")
  const [actionType, setActionType] = useState<"resolve" | "dismiss" | null>(null)

  const handleSubmit = () => {
    if (actionType === "resolve") {
      onResolve(report.id, resolution)
    } else if (actionType === "dismiss") {
      onDismiss(report.id)
    }
    setActionType(null)
    setResolution("")
  }

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Report Review</DialogTitle>
        <DialogDescription>
          <div className="flex items-center space-x-4 mt-2">
            <Badge >{report.status}</Badge>
            <span className="text-xs">{report.createdAt}</span>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Report Details */}
        <div className="grid gap-4">
          <div>
            <Label className="text-sm font-medium">Reported Post</Label>
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{report.postTitle}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Reporter</Label>
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{report.reporter}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Reason</Label>
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{report.reason}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content Preview */}
        <div>
          <Label className="text-sm font-medium">Reported Content Preview</Label>
          <div className="mt-2 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              This is a preview of the reported content. In a real implementation, this would show the actual post
              content that was reported, allowing moderators to review the content and determine if the report is valid.
              The content might include text, images, or other media that violates community guidelines.
            </p>
          </div>
        </div>

        {/* Resolution Actions */}
        {report.status === "PENDING" && (
          <div>
            <Label className="text-sm font-medium">Resolution</Label>
            <div className="mt-2 space-y-3">
              <Textarea
                placeholder="Add resolution notes (optional)..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" onClick={() => setActionType("resolve")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Resolve Report
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Resolve Report</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to mark this report as resolved? This indicates that appropriate action
                        has been taken.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>Resolve</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" onClick={() => setActionType("dismiss")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Dismiss Report
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Dismiss Report</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to dismiss this report? This indicates that no action is needed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>Dismiss</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Content
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Report History */}
        <div>
          <Label className="text-sm font-medium">Report Timeline</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Report submitted by {report.reporter}</p>
                <p className="text-xs text-muted-foreground">{report.createdAt}</p>
              </div>
            </div>
            
            {report.status !== "PENDING" && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Report {report.status.toLowerCase()} by admin</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
