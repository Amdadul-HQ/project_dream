"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { mockPosts, type Post } from "@/lib/admin-data"
import {
  FileText,
  Search,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Music,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [authorFilter, setAuthorFilter] = useState<string>("all")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // Filter posts based on search and filters
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesAuthor = authorFilter === "all" || post.author === authorFilter

    return matchesSearch && matchesStatus && matchesAuthor
  })

  const handleStatusChange = (postId: string, newStatus: Post["status"]) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, status: newStatus } : post)))
  }

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const getPostStats = () => {
    const totalPosts = posts.length
    const published = posts.filter((p) => p.status === "PUBLISHED").length
    const underReview = posts.filter((p) => p.status === "UNDER_REVIEW").length
    const reported = posts.filter((p) => p.status === "REPORTED").length
    const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments, 0)

    return { totalPosts, published, underReview, reported, totalEngagement }
  }

  const getUniqueAuthors = () => {
    return Array.from(new Set(posts.map((post) => post.author)))
  }

  const stats = getPostStats()
  const authors = getUniqueAuthors()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Post Management</h1>
        <p className="text-muted-foreground">Review, moderate, and manage platform content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.underReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported</CardTitle>
            <Ban className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.reported}</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Management */}
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Review and moderate platform content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts by title or author..."
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
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="REPORTED">Reported</SelectItem>
                <SelectItem value="HOLD">On Hold</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">by {post.author}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge>{post.status}</Badge>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{post.likes.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.comments.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views.toLocaleString()}</span>
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <PostDetailDialog post={post} />
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {post.status !== "PUBLISHED" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "PUBLISHED")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve & Publish
                        </DropdownMenuItem>
                      )}
                      {post.status !== "UNDER_REVIEW" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "UNDER_REVIEW")}>
                          <Clock className="mr-2 h-4 w-4" />
                          Mark for Review
                        </DropdownMenuItem>
                      )}
                      {post.status !== "HOLD" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "HOLD")}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Put on Hold
                        </DropdownMenuItem>
                      )}
                      {post.status !== "REPORTED" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "REPORTED")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Mark as Reported
                        </DropdownMenuItem>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Post
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePost(post.id)}
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

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Post Detail Dialog Component
function PostDetailDialog({ post }: { post: Post }) {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">{post.title}</DialogTitle>
        <DialogDescription>
          <div className="flex items-center space-x-4 mt-2">
            <span>by {post.author}</span>
            <Badge>{post.status}</Badge>
            <span className="text-xs">{post.createdAt}</span>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Post Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Likes</span>
            </div>
            <div className="text-2xl font-bold">{post.likes.toLocaleString()}</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Comments</span>
            </div>
            <div className="text-2xl font-bold">{post.comments.toLocaleString()}</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <div className="text-2xl font-bold">{post.views.toLocaleString()}</div>
          </div>
        </div>

        {/* Post Content Preview */}
        <div>
          <h4 className="font-medium mb-3">Content Preview</h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              This is a preview of the post content. In a real implementation, this would show the actual post content
              from your database. The content could include text, images, code blocks, and other rich media elements
              that make up the full post.
            </p>
          </div>
        </div>

        {/* Audio Content */}
        <div>
          <h4 className="font-medium mb-3">Audio Content</h4>
          <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
            <Music className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Audio file available</p>
              <p className="text-xs text-muted-foreground">Duration: 15:32 • Size: 12.4 MB</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto bg-transparent">
              Play Audio
            </Button>
          </div>
        </div>

        {/* Moderation Actions */}
        <div>
          <h4 className="font-medium mb-3">Moderation Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button variant="secondary" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Review
            </Button>
            <Button variant="outline" size="sm">
              <XCircle className="mr-2 h-4 w-4" />
              Hold
            </Button>
            <Button variant="destructive" size="sm">
              <Ban className="mr-2 h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
