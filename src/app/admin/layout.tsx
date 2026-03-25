"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Menu, LogOut } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth"

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdminAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoginPage && !isAuthenticated) {
      router.replace("/admin/login")
    }
  }, [isAuthenticated, isLoginPage, router])

  // Render login page without the shell chrome
  if (isLoginPage) return <>{children}</>

  // While redirecting, render nothing
  if (!isAuthenticated) return null

  const handleLogout = () => {
    logout()
    router.replace("/admin/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
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
              PHOTOIZZM Photography &mdash; Panel Admin
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Keluar
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  )
}
