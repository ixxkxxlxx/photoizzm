"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  fetchBookings,
  MONTHLY_REVENUE,
  getStats,
  type Booking,
} from "@/lib/admin-data"
import { StatsCards } from "@/components/admin/stats-cards"
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Users } from "lucide-react"

const COLORS = [
  "oklch(0.22 0.02 60)",
  "oklch(0.68 0.12 65)",
  "oklch(0.60 0.08 75)",
  "oklch(0.48 0.02 60)",
]

export default function AnalyticsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = getStats(bookings)

  // Package breakdown data
  const packageCounts: Record<string, number> = {}
  const packageRevenue: Record<string, number> = {}
  for (const b of bookings) {
    packageCounts[b.package] = (packageCounts[b.package] || 0) + 1
    if (b.status !== "cancelled") {
      packageRevenue[b.package] = (packageRevenue[b.package] || 0) + b.amount
    }
  }
  const packageData = Object.entries(packageCounts).map(([name, value]) => ({
    name,
    value,
    revenue: packageRevenue[name] || 0,
  }))

  // University breakdown
  const uniCounts: Record<string, number> = {}
  for (const b of bookings) {
    if (b.university) {
      uniCounts[b.university] = (uniCounts[b.university] || 0) + 1
    }
  }
  const universityData = Object.entries(uniCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Status distribution for line chart simulation
  const statusData = [
    { name: "Pending", value: stats.pending },
    { name: "Confirmed", value: stats.confirmed },
    { name: "Completed", value: stats.completed },
    { name: "Cancelled", value: stats.cancelled },
  ]

  // Average booking value
  const activeBookings = bookings.filter((b) => b.status !== "cancelled")
  const avgValue = activeBookings.length > 0
    ? Math.round(activeBookings.reduce((sum, b) => sum + b.amount, 0) / activeBookings.length)
    : 0

  // Conversion rate
  const conversionRate = stats.total > 0
    ? Math.round(((stats.confirmed + stats.completed) / stats.total) * 100)
    : 0

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
      <div>
        <h1 className="font-serif text-2xl font-black text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          PHOTOIZZM Photography booking performance and statistics
        </p>
      </div>

      {/* Stats overview */}
      <StatsCards {...stats} />

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">Average Booking Value</span>
          </div>
          <p className="font-serif text-2xl font-black text-foreground">RM {avgValue}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">Conversion Rate</span>
          </div>
          <p className="font-serif text-2xl font-black text-foreground">{conversionRate}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">Active Universities</span>
          </div>
          <p className="font-serif text-2xl font-black text-foreground">{universityData.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">Package Types</span>
          </div>
          <p className="font-serif text-2xl font-black text-foreground">{packageData.length}</p>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">Monthly Revenue</h3>
            <p className="text-xs text-muted-foreground">Booking revenue 2026</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.87 0.02 75)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.48 0.02 60)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.48 0.02 60)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `RM${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`RM ${value}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid oklch(0.87 0.02 75)",
                  backgroundColor: "oklch(0.99 0.008 75)",
                  fontSize: "12px",
                  color: "oklch(0.18 0.01 60)",
                }}
                cursor={{ fill: "oklch(0.93 0.018 78)" }}
              />
              <Bar dataKey="revenue" fill="oklch(0.22 0.02 60)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Package Breakdown */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">Package Breakdown</h3>
            <p className="text-xs text-muted-foreground">Booking distribution by package</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={packageData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {packageData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value + " bookings", name]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid oklch(0.87 0.02 75)",
                  backgroundColor: "oklch(0.99 0.008 75)",
                  fontSize: "12px",
                  color: "oklch(0.18 0.01 60)",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: "11px", color: "oklch(0.48 0.02 60)" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Status Distribution */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">Booking Status</h3>
            <p className="text-xs text-muted-foreground">Breakdown by status</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} layout="vertical" barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.87 0.02 75)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "oklch(0.48 0.02 60)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(0.48 0.02 60)" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [value + " bookings", "Total"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid oklch(0.87 0.02 75)",
                  backgroundColor: "oklch(0.99 0.008 75)",
                  fontSize: "12px",
                  color: "oklch(0.18 0.01 60)",
                }}
              />
              <Bar dataKey="value" fill="oklch(0.68 0.12 65)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* University Breakdown */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">University</h3>
            <p className="text-xs text-muted-foreground">Bookings by university</p>
          </div>
          {universityData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No data yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {universityData.map((uni, i) => {
                const percentage = stats.total > 0 ? Math.round((uni.value / stats.total) * 100) : 0
                return (
                  <div key={uni.name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground truncate">{uni.name}</span>
                        <span className="text-xs text-muted-foreground">{uni.value} ({percentage}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Package Revenue Table */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h3 className="font-serif text-base font-bold text-foreground">Revenue by Package</h3>
          <p className="text-xs text-muted-foreground">Revenue and bookings per package</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Package", "Bookings", "Revenue", "% of Revenue"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {packageData.map((pkg) => {
                const revenuePercent = stats.revenue > 0
                  ? Math.round((pkg.revenue / stats.revenue) * 100)
                  : 0
                return (
                  <tr key={pkg.name} className="transition-colors hover:bg-secondary/50">
                    <td className="px-5 py-3 font-semibold text-foreground">{pkg.name}</td>
                    <td className="px-5 py-3 text-foreground">{pkg.value}</td>
                    <td className="px-5 py-3 font-serif font-bold text-foreground">
                      RM {pkg.revenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${revenuePercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{revenuePercent}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
