"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Booking, BookingStatus } from "@/lib/admin-data"

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-sky-100 text-sky-700",
  cancelled: "bg-rose-100 text-rose-700",
}

const ALL_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"]

interface BookingDetailModalProps {
  booking: Booking
  onClose: () => void
  onStatusChange: (status: BookingStatus) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

export function BookingDetailModal({ booking, onClose, onStatusChange }: BookingDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{booking.id}</p>
            <h2 className="font-serif text-xl font-black text-foreground text-balance leading-tight">
              {booking.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status badge */}
        <div className="mb-5 flex items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              STATUS_STYLES[booking.status]
            )}
          >
            {STATUS_LABELS[booking.status]}
          </span>
          <span className="text-xs text-muted-foreground">
            Created:{" "}
            {new Date(booking.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
          <Row label="Phone" value={booking.phone} />
          <Row label="Email" value={booking.email} />
          <Row label="University" value={booking.university} />
          <Row label="Package" value={booking.package} />
          <Row
            label="Date"
            value={new Date(booking.date).toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <Row label="Session Time" value={booking.sessionTime} />
          <Row label="Location" value={booking.location} />
          {booking.pax && <Row label="Number of Pax" value={`${booking.pax} pax`} />}
          <Row
            label="Amount"
            value={
              <span className="font-serif font-black text-foreground text-base">
                RM {booking.amount}
              </span>
            }
          />
          {booking.notes && <Row label="Notes" value={booking.notes} />}
        </div>

        {/* Status change */}
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Update Status
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                  booking.status === s
                    ? cn(STATUS_STYLES[s], "ring-2 ring-offset-1 ring-current")
                    : "border border-border text-muted-foreground hover:bg-secondary"
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
