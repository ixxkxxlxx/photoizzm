"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, LayoutDashboard, CalendarDays, BarChart2, Settings, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              <Camera className="h-4 w-4 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-sm font-black text-foreground">PHOTOIZZM</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
            View Booking Form
          </Link>
        </div>
      </aside>
    </>
  )
}
