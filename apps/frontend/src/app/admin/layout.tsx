"use client"

import type React from "react"

import { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Users, FileText, AlertTriangle, Music, Shield, Search, BarChart3, Menu, X } from "lucide-react"


const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
  { name: "Audio", href: "/admin/audio", icon: Music },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center px-6 border-b">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-xl font-bold text-foreground">Admin Panel</h1>
            <Button variant="ghost" size="sm" className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top header */}
          <header className="bg-card border-b">
            <div className="flex h-16 items-center px-6">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>

              <div className="ml-auto flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
