"use client"

import { useEffect, useState } from "react"
import { fetchBookings, type Booking, type BookingStatus } from "@/lib/admin-data"
import { BookingDetailModal } from "@/components/admin/booking-detail-modal"
import { updateBookingStatus } from "@/lib/admin-data"

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-sky-100 text-sky-700",
  cancelled: "bg-rose-100 text-rose-700",
}

export function LatestBookingByClient() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
      .then((data) => {
        const sorted = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5)
        setBookings(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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
      <div className="rounded-2xl border border-border bg-card overflow-hidden mt-4">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <span className="font-semibold text-sm text-foreground">Recent Booking </span>
        </div>

        <div className="max-h-[200px] overflow-y-auto">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 animate-pulse">
                <div className="h-6 w-6 rounded-full bg-secondary" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 w-3/5 rounded bg-secondary" />
                  <div className="h-2 w-4/5 rounded bg-secondary" />
                </div>
              </div>
            ))
          ) : bookings.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground">No bookings yet</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-0"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                  {booking.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{booking.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {booking.package} • {new Date(booking.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}
                  </p>
                </div>

                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${STATUS_STYLES[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}