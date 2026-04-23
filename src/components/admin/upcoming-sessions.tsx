"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Heart, Camera, CalendarDays, RefreshCw, ArrowRight } from "lucide-react"
import { mapApiBooking, type Booking, type BookingStatus } from "@/lib/admin-data"
import { BookingDetailModal } from "@/components/admin/booking-detail-modal"
import { updateBookingStatus } from "@/lib/admin-data"

function getCategoryIcon(category: string) {
  switch (category) {
    case "convocation": return <Users className="h-3 w-3" />
    case "engagement": return <Heart className="h-3 w-3" />
    case "wedding": return <Camera className="h-3 w-3" />
    default: return <Camera className="h-3 w-3" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "convocation": return "bg-purple-100 text-purple-700"
    case "engagement": return "bg-pink-100 text-pink-700"
    case "wedding": return "bg-rose-100 text-rose-700"
    default: return "bg-secondary text-muted-foreground"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed": return "bg-emerald-100 text-emerald-700"
    case "pending": return "bg-amber-100 text-amber-700"
    default: return "bg-secondary text-muted-foreground"
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { label: "Today", badge: "bg-red-100 text-red-700" }
  if (diffDays === 1) return { label: "Tomorrow", badge: "bg-orange-100 text-orange-700" }
  if (diffDays <= 7) return { label: `${diffDays}d`, badge: "bg-blue-100 text-blue-700" }
  return { label: d.toLocaleDateString("en-MY", { day: "numeric", month: "short" }), badge: "" }
}

export function UpcomingSessions() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

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

  const handleStatusChange = async (status: BookingStatus) => {
    if (!selectedBooking) return
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBooking.id ? { ...b, status } : b))
    )
    await updateBookingStatus(selectedBooking.id, status)
    setSelectedBooking(null)
  }

  return (
    <>
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm text-foreground">Upcoming Session</span>
          </div>
          <button
            onClick={load}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 animate-pulse">
                <div className="h-6 w-6 rounded-full bg-secondary shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 w-3/5 rounded bg-secondary" />
                  <div className="h-2 w-4/5 rounded bg-secondary" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Failed to load</p>
              <button onClick={load} className="text-xs underline">Retry</button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-muted-foreground">No upcoming sessions</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const { label, badge } = formatDate(booking.date)
              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${getCategoryColor(booking.category)}`}>
                    {getCategoryIcon(booking.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-xs font-medium text-foreground">{booking.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{label}</span>
                      {booking.sessionTime && <span>• {booking.sessionTime}</span>}
                    </div>
                  </div>

                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${badge || getStatusColor(booking.status)}`}>
                    {badge ? label : booking.status}
                  </span>
                </div>
              )
            })
          )}
        </div>

        <div className="border-t border-border">
          <Link
            href="/admin/bookings"
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            See full logs
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </>
  )
}