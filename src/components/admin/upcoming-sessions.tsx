"use client"

import { useEffect, useState } from "react"
import { Users, Heart, Camera, MapPin, Clock, CalendarDays, RefreshCw } from "lucide-react"
import { mapApiBooking, type Booking } from "@/lib/admin-data"

function getCategoryIcon(category: string) {
  switch (category) {
    case "convocation": return <Users className="h-4 w-4" />
    case "engagement": return <Heart className="h-4 w-4" />
    case "wedding": return <Camera className="h-4 w-4" />
    default: return <Camera className="h-4 w-4" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "convocation": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
    case "engagement": return "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
    case "wedding": return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
    default: return "bg-secondary text-secondary-foreground"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
    case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
    default: return "bg-secondary text-secondary-foreground"
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const formatted = d.toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  if (diffDays === 0) return { label: formatted, badge: "Today", badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" }
  if (diffDays === 1) return { label: formatted, badge: "Tomorrow", badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" }
  if (diffDays <= 7) return { label: formatted, badge: `In ${diffDays}d`, badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" }
  return { label: formatted, badge: null, badgeClass: "" }
}

export function UpcomingSessions() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true)
    setError(false)
    fetch("/api/bookings/upcoming")
      .then((r) => r.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data.map(mapApiBooking) : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-foreground" />
          <div>
            <h3 className="font-serif text-base font-bold text-foreground leading-tight">Upcoming Sessions</h3>
            <p className="text-xs text-muted-foreground">Pending &amp; confirmed jobs</p>
          </div>
        </div>
        <button
          onClick={load}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="divide-y divide-border">
        {loading ? (
          // Skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-secondary shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/5 rounded bg-secondary" />
                <div className="h-3 w-3/5 rounded bg-secondary" />
              </div>
              <div className="h-5 w-16 rounded-full bg-secondary shrink-0" />
            </div>
          ))
        ) : error ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">Failed to load sessions</p>
            <button onClick={load} className="text-xs font-medium text-foreground underline">Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No upcoming sessions</p>
            <p className="text-xs text-muted-foreground">All clear for now ✓</p>
          </div>
        ) : (
          bookings.map((booking) => {
            const { label, badge, badgeClass } = formatDate(booking.date)
            return (
              <div
                key={booking.id}
                className="flex items-center gap-3 px-5 py-4 hover:bg-secondary/30 transition-colors"
              >
                {/* Category icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getCategoryColor(booking.category)}`}>
                  {getCategoryIcon(booking.category)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="truncate font-semibold text-foreground text-sm">{booking.name}</p>
                    {badge && (
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold leading-none ${badgeClass}`}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {label}
                    </span>
                    {booking.sessionTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.sessionTime}
                      </span>
                    )}
                    {booking.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}