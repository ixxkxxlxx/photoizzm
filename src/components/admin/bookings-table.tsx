"use client"

import { useState } from "react"
import { Search, ChevronDown, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Booking, BookingStatus, BookingCategory } from "@/lib/admin-data"
import { BookingDetailModal } from "@/components/admin/booking-detail-modal"
import { EditBookingModal } from "@/components/admin/edit-booking-modal"

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  completed: "bg-sky-100 text-sky-700 border border-sky-200",
  cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
}

const CATEGORY_LABELS: Record<BookingCategory, string> = {
  convocation: "Convocation",
  engagement: "Engagement",
  wedding: "Wedding",
}

const CATEGORY_STYLES: Record<BookingCategory, string> = {
  convocation: "bg-purple-100 text-purple-700 border border-purple-200",
  engagement: "bg-pink-100 text-pink-700 border border-pink-200",
  wedding: "bg-rose-100 text-rose-700 border border-rose-200",
}

const ALL_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"]
const ALL_CATEGORIES: BookingCategory[] = ["convocation", "engagement", "wedding"]

interface BookingsTableProps {
  bookings: Booking[]
  onStatusChange: (id: string, status: BookingStatus) => void
  onEdit?: (id: string, data: Partial<Booking>) => Promise<void>
  onBookingsChange?: (bookings: Booking[]) => void
}

export function BookingsTable({ bookings, onStatusChange, onEdit, onBookingsChange }: BookingsTableProps) {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all")
  const [filterPackage, setFilterPackage] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<BookingCategory | "all">("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || b.status === filterStatus
    const matchPackage = filterPackage === "all" || b.package === filterPackage
    const matchCategory = filterCategory === "all" || b.category === filterCategory
    return matchSearch && matchStatus && matchPackage && matchCategory
  })

  const packages = Array.from(new Set(bookings.map((b) => b.package)))

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name, ID or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as BookingStatus | "all")}
              className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Package filter */}
          <div className="relative">
            <select
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
              className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Packages</option>
              {packages.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as BookingCategory | "all")}
              className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Name", "Category", "Package", "Date", "Location", "Amount", "Transport", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-sm text-muted-foreground">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="group transition-colors hover:bg-secondary/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {booking.id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground leading-tight">{booking.name}</p>
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          CATEGORY_STYLES[booking.category]
                        )}
                      >
                        {CATEGORY_LABELS[booking.category]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-foreground">
                        {booking.package}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-32 truncate">
                      {booking.location}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-serif font-bold text-foreground">
                      RM {booking.amount + booking.transportationFee}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {booking.transportationFee > 0 ? `RM ${booking.transportationFee}` : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          STATUS_STYLES[booking.status]
                        )}
                      >
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => setEditingBooking(booking)}
                            className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          View
                        </button>
                        {/* Quick status change */}
                        <div className="relative">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              onStatusChange(booking.id, e.target.value as BookingStatus)
                            }
                            className="h-7 appearance-none rounded-lg border border-border bg-background pl-2 pr-6 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={(status) => {
            onStatusChange(selectedBooking.id, status)
            setSelectedBooking({ ...selectedBooking, status })
          }}
        />
      )}

      {editingBooking && onEdit && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={async (data) => {
            await onEdit(editingBooking.id, data)
            if (onBookingsChange) {
              const updatedBookings = bookings.map((b) => 
                b.id === editingBooking.id ? { ...b, ...data } : b
              )
              onBookingsChange(updatedBookings)
            }
          }}
        />
      )}
    </>
  )
}
