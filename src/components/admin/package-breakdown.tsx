"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Booking } from "@/lib/admin-data"

const COLORS = [
  "oklch(0.22 0.02 60)",
  "oklch(0.68 0.12 65)",
  "oklch(0.60 0.08 75)",
]

interface PackageBreakdownProps {
  bookings: Booking[]
}

export function PackageBreakdown({ bookings }: PackageBreakdownProps) {
  const counts: Record<string, number> = {}
  for (const b of bookings) {
    counts[b.package] = (counts[b.package] || 0) + 1
  }

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }))

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <h3 className="font-serif text-base font-bold text-foreground">Popular Packages</h3>
        <p className="text-xs text-muted-foreground">Breakdown by package type</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
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
  )
}
