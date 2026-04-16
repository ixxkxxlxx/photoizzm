"use client"

import { useEffect, useState } from "react"
import { fetchBookings, updateBookingStatus, getStats, type Booking, type BookingStatus } from "@/lib/admin-data"
import { StatsCards } from "@/components/admin/stats-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { PackageBreakdown } from "@/components/admin/package-breakdown"
import { BookingsTable } from "@/components/admin/bookings-table"
import { UpcomingSessions } from "@/components/admin/upcoming-sessions"

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false))
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
      {/* Page title */}
      <div>
        <h1 className="font-serif text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          PHOTOIZZM Photography booking and revenue overview
        </p>
      </div>

      {/* Stats */}
      <StatsCards {...stats} />

      {/* Upcoming Sessions */}
      <UpcomingSessions />

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PackageBreakdown bookings={bookings} />
      </div>

      {/* Bookings table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-foreground">All Bookings</h2>
        </div>
        <BookingsTable bookings={bookings} onStatusChange={handleStatusChange} />
      </div>
    </div>
  )
}
