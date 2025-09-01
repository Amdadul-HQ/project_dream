export interface User {
  id: string
  name: string
  email: string
  role: "USER" | "WRITER" | "ADMIN"
  status: "Active" | "Blocked" | "Banned" | "Suspended"
  posts: number
  followers: number
  createdAt?: string
}

export interface Post {
  id: string
  title: string
  author: string
  status: "PUBLISHED" | "UNDER_REVIEW" | "REPORTED" | "DELETED" | "HOLD"
  likes: number
  comments: number
  views: number
  createdAt: string
}

export interface Report {
  id: string
  postTitle: string
  reporter: string
  reason: string
  status: "PENDING" | "RESOLVED" | "DISMISSED"
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  publishedPosts: number
  reportedPosts: number
  totalLikes: number
  totalComments: number
  totalViews: number
  audioFiles: number
  pendingReports: number
}

// Mock data
export const mockStats: AdminStats = {
  totalUsers: 12847,
  activeUsers: 8932,
  totalPosts: 5643,
  publishedPosts: 4821,
  reportedPosts: 67,
  totalLikes: 89234,
  totalComments: 23456,
  totalViews: 456789,
  audioFiles: 1234,
  pendingReports: 23,
}

export const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "USER", status: "Active", posts: 45, followers: 234 },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "WRITER",
    status: "Active",
    posts: 123,
    followers: 1567,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "USER",
    status: "Blocked",
    posts: 12,
    followers: 89,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "WRITER",
    status: "Active",
    posts: 89,
    followers: 892,
  },
  {
    id: "5",
    name: "Alex Brown",
    email: "alex@example.com",
    role: "ADMIN",
    status: "Active",
    posts: 234,
    followers: 3456,
  },
  {
    id: "6",
    name: "Emma Davis",
    email: "emma@example.com",
    role: "WRITER",
    status: "Active",
    posts: 67,
    followers: 789,
  },
]

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React",
    author: "Jane Smith",
    status: "PUBLISHED",
    likes: 234,
    comments: 45,
    views: 1234,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Advanced TypeScript Tips",
    author: "Sarah Wilson",
    status: "UNDER_REVIEW",
    likes: 89,
    comments: 12,
    views: 456,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Building Modern UIs",
    author: "John Doe",
    status: "REPORTED",
    likes: 156,
    comments: 23,
    views: 789,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "CSS Grid Mastery",
    author: "Emma Davis",
    status: "PUBLISHED",
    likes: 445,
    comments: 67,
    views: 2345,
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Node.js Best Practices",
    author: "Alex Brown",
    status: "HOLD",
    likes: 78,
    comments: 15,
    views: 234,
    createdAt: "2024-01-11",
  },
]

export const mockReports: Report[] = [
  {
    id: "1",
    postTitle: "Building Modern UIs",
    reporter: "User123",
    reason: "Inappropriate content",
    status: "PENDING",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    postTitle: "React Best Practices",
    reporter: "User456",
    reason: "Spam",
    status: "PENDING",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    postTitle: "CSS Grid Tutorial",
    reporter: "User789",
    reason: "Copyright violation",
    status: "RESOLVED",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    postTitle: "JavaScript Fundamentals",
    reporter: "User101",
    reason: "Misleading information",
    status: "PENDING",
    createdAt: "2024-01-12",
  },
]
