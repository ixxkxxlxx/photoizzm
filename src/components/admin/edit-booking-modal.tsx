"use client"

import { useState } from "react"
import { X, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Booking } from "@/lib/admin-data"

interface EditBookingModalProps {
  booking: Booking
  onClose: () => void
  onSave: (data: Partial<Booking>) => Promise<void>
}

export function EditBookingModal({ booking, onClose, onSave }: EditBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customerName: booking.name,
    email: booking.email,
    phone: booking.phone,
    packageName: booking.package,
    university: booking.university,
    date: booking.date.split("T")[0],
    time: booking.sessionTime,
    location: booking.location,
    pax: booking.pax?.toString() ?? "",
    notes: booking.notes ?? "",
    transportationFee: booking.transportationFee?.toString() ?? "0",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        name: form.customerName,
        email: form.email,
        phone: form.phone,
        package: form.packageName,
        university: form.university,
        date: form.date,
        sessionTime: form.time,
        location: form.location,
        pax: form.pax ? parseInt(form.pax) : undefined,
        notes: form.notes || undefined,
        transportationFee: parseFloat(form.transportationFee) || 0,
      })
      onClose()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{booking.id}</p>
            <h2 className="font-serif text-xl font-black text-foreground">Edit Booking</h2>
          </div>
          <button onClick={onClose} className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Customer Name</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Package</label>
              <input
                type="text"
                value={form.packageName}
                onChange={(e) => setForm({ ...form, packageName: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">University</label>
              <input
                type="text"
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Pax</label>
              <input
                type="number"
                value={form.pax}
                onChange={(e) => setForm({ ...form, pax: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Transportation Fee (RM)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.transportationFee}
                onChange={(e) => setForm({ ...form, transportationFee: e.target.value })}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}