"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { MONTHLY_REVENUE } from "@/lib/admin-data"

export function RevenueChart() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-base font-bold text-foreground">Monthly Revenue</h3>
          <p className="text-xs text-muted-foreground">Booking revenue 2026</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={MONTHLY_REVENUE} barSize={28}>
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
          <Bar
            dataKey="revenue"
            fill="oklch(0.22 0.02 60)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
