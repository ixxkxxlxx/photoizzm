export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type BookingCategory = "convocation" | "engagement" | "wedding"

export interface Booking {
  id: string
  name: string
  phone: string
  email: string
  university: string
  category: BookingCategory
  package: string
  date: string
  sessionTime: string
  location: string
  pax?: number
  amount: number
  transportationFee: number
  status: BookingStatus
  createdAt: string
  notes?: string
}

export function mapApiBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    name: (row.customer_name as string) ?? "",
    phone: row.phone as string,
    email: row.email as string,
    university: (row.university as string) ?? "",
    category: (row.category as BookingCategory) ?? "convocation",
    package: (row.package_name as string) ?? "",
    date: row.date as string,
    sessionTime: (row.time as string) ?? "",
    location: (row.location as string) ?? "",
    pax: (row.pax as number) ?? undefined,
    amount: (row.total_price as number) ?? 0,
    transportationFee: (row.transportation_fee as number) ?? 0,
    status: (row.status as BookingStatus) ?? "pending",
    createdAt: (row.created_at as string) ?? "",
    notes: (row.notes as string) ?? undefined,
  }
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch("/api/bookings", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch bookings")
  const data = await res.json()
  return data.map(mapApiBooking)
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  const res = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Failed to update booking")
}

export interface UpdateBookingData {
  customerName?: string
  email?: string
  phone?: string
  packageName?: string
  university?: string
  date?: string
  time?: string
  location?: string
  pax?: number
  notes?: string
  transportationFee?: number
  totalPrice?: number
}

export async function updateBookingDetails(
  id: string,
  data: UpdateBookingData
): Promise<Booking> {
  const res = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update booking")
  const row = await res.json()
  return mapApiBooking(row)
}

export const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
]

export function getStats(bookings: Booking[]) {
  const total = bookings.length
  const pending = bookings.filter((b) => b.status === "pending").length
  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const completed = bookings.filter((b) => b.status === "completed").length
  const cancelled = bookings.filter((b) => b.status === "cancelled").length
  const revenue = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + b.amount + b.transportationFee, 0)

  return { total, pending, confirmed, completed, cancelled, revenue }
}