"use client"

import { useEffect, useState, useRef } from "react"
import { fetchBookings, updateBookingStatus, getStats, type Booking, type BookingStatus } from "@/lib/admin-data"
import { StatsCards } from "@/components/admin/stats-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { PackageBreakdown } from "@/components/admin/package-breakdown"
import { BookingsTable } from "@/components/admin/bookings-table"
import { UpcomingSessions } from "@/components/admin/upcoming-sessions"
import { LatestBookingByClient } from "@/components/admin/recent-booking-status"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [lastCount, setLastCount] = useState(0)
  const toastShown = useRef<Set<string>>(new Set())

  const loadBookings = async () => {
    try {
      const data = await fetchBookings()
      setBookings(data)
      
      if (!loading && data.length > lastCount) {
        const newBookings = data.slice(0, data.length - lastCount)
        for (const booking of newBookings) {
          if (!toastShown.current.has(booking.id)) {
            toast.success(`New booking from ${booking.name}!`, {
              description: `${booking.category} - ${booking.date}`,
            })
            toastShown.current.add(booking.id)
          }
        }
      }
      setLastCount(data.length)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
    const interval = setInterval(loadBookings, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
    await updateBookingStatus(id, status)
  }

  const stats = getStats(bookings)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          PHOTOIZZM Photography booking and revenue overview
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <StatsCards {...stats} />

          <div className="grid gap-4 lg:grid-cols-2">
            <RevenueChart />
            <PackageBreakdown bookings={bookings} />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-foreground">All Bookings</h2>
            </div>
            <BookingsTable bookings={bookings} onStatusChange={handleStatusChange} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <UpcomingSessions />
          <LatestBookingByClient />
        </div>
      </div>
    </div>
  )
}
