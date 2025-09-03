"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { mockUsers, type User } from "@/lib/admin-data"
import { Users, Search, Plus, MoreHorizontal, UserCheck, Ban, Shield, Edit, Trash2, UserMinus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handlePromoteUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, role: user.role === "USER" ? "WRITER" : user.role === "WRITER" ? "ADMIN" : "ADMIN" }
          : user,
      ),
    )
  }

  const handleDemoteUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, role: user.role === "ADMIN" ? "WRITER" : user.role === "WRITER" ? "USER" : "USER" }
          : user,
      ),
    )
  }

  const handleBlockUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" } : user,
      ),
    )
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "USER",
      status: "Active",
      posts: 0,
      followers: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, newUser])
    setIsAddUserOpen(false)
  }

  const handleEditUser = (userData: Partial<User>) => {
    if (!editingUser) return

    setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...userData } : user)))
    setEditingUser(null)
  }

  const getUserStats = () => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "Active").length
    const writers = users.filter((u) => u.role === "WRITER").length
    const admins = users.filter((u) => u.role === "ADMIN").length

    return { totalUsers, activeUsers, writers, admins }
  }

  const stats = getUserStats()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage platform users, roles, and permissions</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <UserDialog onSubmit={handleAddUser} />
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Writers</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.writers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage and moderate platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
                <SelectItem value="WRITER">Writers</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge >{user.role}</Badge>
                      <Badge >{user.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.posts} posts</p>
                    <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      {user.role !== "ADMIN" && (
                        <DropdownMenuItem onClick={() => handlePromoteUser(user.id)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          {user.role === "USER" ? "Promote to Writer" : "Promote to Admin"}
                        </DropdownMenuItem>
                      )}
                      {user.role !== "USER" && (
                        <DropdownMenuItem onClick={() => handleDemoteUser(user.id)}>
                          <UserMinus className="mr-2 h-4 w-4" />
                          {user.role === "ADMIN" ? "Demote to Writer" : "Demote to User"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4" />
                        {user.status === "Active" ? "Block User" : "Unblock User"}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <UserDialog user={editingUser} onSubmit={handleEditUser} isEditing={true} />
        </Dialog>
      )}
    </div>
  )
}

// User Dialog Component
function UserDialog({
  user,
  onSubmit,
  isEditing = false,
}: {
  user?: User
  onSubmit: (data: Partial<User>) => void
  isEditing?: boolean
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || ("USER" as User["role"]),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!isEditing) {
      setFormData({ name: "", email: "", role: "USER" })
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update user information and permissions." : "Create a new user account."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter user name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="WRITER">Writer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{isEditing ? "Update User" : "Add User"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
