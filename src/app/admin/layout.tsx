"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Menu, Settings, LogOut, User } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNotifications } from "@/components/admin/admin-notifications"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth"
import { Toaster } from "@/components/ui/sonner"

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, logout } = useAdminAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isInitialized && !isLoginPage && !isAuthenticated) {
      router.replace("/admin/login")
    }
  }, [isInitialized, isAuthenticated, isLoginPage, router])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    )
  }

  if (isLoginPage) return <>{children}</>

  if (!isAuthenticated) return null

  const handleLogout = () => {
    logout()
    router.replace("/admin/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              PHOTOIZZM Photography — Panel Admin
            </p>
            <div className="flex items-center gap-1">
              <AdminNotifications />
              <Link
                href="/admin/settings"
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Profile"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Logout Modal - rendered at root for sidebar */}
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
      <Toaster />
    </AdminAuthProvider>
  )
}