import { TrendingUp, Clock, CheckCircle2, XCircle, Camera, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  revenue: number
}

const cards = (s: StatsCardsProps) => [
  {
    label: "Total Bookings",
    value: s.total,
    icon: Camera,
    color: "bg-foreground text-primary-foreground",
    iconColor: "text-primary-foreground/70",
  },
  {
    label: "Pending Confirmation",
    value: s.pending,
    icon: Clock,
    color: "bg-amber-50 text-amber-800 border border-amber-200",
    iconColor: "text-amber-500",
  },
  {
    label: "Confirmed",
    value: s.confirmed,
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    iconColor: "text-emerald-500",
  },
  {
    label: "Completed",
    value: s.completed,
    icon: TrendingUp,
    color: "bg-sky-50 text-sky-800 border border-sky-200",
    iconColor: "text-sky-500",
  },
  {
    label: "Cancelled",
    value: s.cancelled,
    icon: XCircle,
    color: "bg-rose-50 text-rose-800 border border-rose-200",
    iconColor: "text-rose-500",
  },
  {
    label: "Total Revenue (RM)",
    value: `RM ${s.revenue.toLocaleString()}`,
    icon: DollarSign,
    color: "bg-secondary text-foreground border border-border",
    iconColor: "text-accent",
  },
]

export function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {cards(props).map(({ label, value, icon: Icon, color, iconColor }) => (
        <div
          key={label}
          className={cn(
            "flex flex-col gap-3 rounded-2xl p-4",
            color
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium leading-tight opacity-80">{label}</p>
            <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
          </div>
          <p className="font-serif text-2xl font-black leading-none">{value}</p>
        </div>
      ))}
    </div>
  )
}
