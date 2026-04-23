"use client"

import { useEffect, useState } from "react"
import { fetchBookings, updateBookingStatus, updateBookingDetails, getStats, type Booking, type BookingStatus } from "@/lib/admin-data"
import { StatsCards } from "@/components/admin/stats-cards"
import { BookingsTable } from "@/components/admin/bookings-table"
import { CalendarDays, Download } from "lucide-react"

export default function BookingsPage() {
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

  const handleEdit = async (id: string, data: Partial<Booking>) => {
    const fieldMap: Record<string, string> = {
      name: "customerName",
      phone: "phone",
      email: "email",
      university: "university",
      category: "category",
      package: "packageName",
      date: "date",
      sessionTime: "time",
      location: "location",
      pax: "pax",
      amount: "totalPrice",
      transportationFee: "transportationFee",
      notes: "notes",
    }

    const apiData: Record<string, unknown> = {}
    Object.entries(data).forEach(([key, value]) => {
      const apiKey = fieldMap[key] || key
      if (value !== undefined) {
        if (key === "date") {
          apiData[apiKey] = new Date(value as string).toISOString()
        } else {
          apiData[apiKey] = value
        }
      }
    })

    await updateBookingDetails(id, apiData)
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
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-black text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage all convocation photography session bookings
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats summary */}
      <StatsCards {...stats} />

      {/* Bookings table */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-serif text-lg font-bold text-foreground">All Bookings</h2>
        </div>
        <BookingsTable bookings={bookings} onStatusChange={handleStatusChange} onEdit={handleEdit} onBookingsChange={setBookings} />
      </div>
    </div>
  )
}
