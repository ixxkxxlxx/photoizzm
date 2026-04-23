"use client"

import { useEffect, useState, useRef } from "react"
import { Bell, X } from "lucide-react"
import { fetchBookings, type Booking } from "@/lib/admin-data"

export function AdminNotifications() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchBookings()
      .then((data) => {
        const sorted = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10)
        setBookings(sorted)
        setUnreadCount(data.filter(b => b.status === "pending").length)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {bookings.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-muted-foreground">No notifications</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-b border-border/50 px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {booking.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {booking.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.package} • {booking.status}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(booking.createdAt).toLocaleDateString("en-MY", { 
                          day: "numeric", 
                          month: "short", 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                    {booking.status === "pending" && (
                      <span className="shrink-0 rounded-full w-2 h-2 bg-amber-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}