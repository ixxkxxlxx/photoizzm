"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface Package {
  id: string
  name: string
  price: string
  priceNote?: string
  type: "Preconvo" | "Postconvo" | "Group"
  features: string[]
  badge: string
}

export const PACKAGES: Package[] = [
  {
    id: "preconvo-classic",
    name: "Preconvo Classic",
    price: "RM230",
    type: "Preconvo",
    badge: "Pre-Convo",
    features: [
      "Solo + Family",
      "1–2 hour session",
      "Unlimited shots",
      "All edited photos",
      "Softcopy via Google Photos",
    ],
  },
  {
    id: "postconvo-classic",
    name: "Postconvo Classic",
    price: "RM250",
    type: "Postconvo",
    badge: "Post-Convo",
    features: [
      "Solo + Family",
      "1 hour session",
      "Unlimited shots",
      "All edited photos",
      "Softcopy via Google Photos",
    ],
  },
  {
    id: "forever-us",
    name: "Forever Us",
    price: "RM60",
    priceNote: "/Pax",
    type: "Group",
    badge: "Group",
    features: [
      "Duo / Trio / Group photoshoot",
      "1–2 hour session",
      "Unlimited shots",
      "All edited photos",
      "Softcopy via Google Photos",
    ],
  },
]

interface PackageSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function PackageSelector({ value, onChange }: PackageSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {PACKAGES.map((pkg) => {
        const selected = value === pkg.id
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onChange(pkg.id)}
            className={cn(
              "relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              selected
                ? "border-foreground bg-foreground text-primary-foreground shadow-lg scale-[1.02]"
                : "border-border bg-card text-foreground hover:border-foreground/40 hover:shadow-md"
            )}
            aria-pressed={selected}
          >
            {/* Badge */}
            <span
              className={cn(
                "w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
                selected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {pkg.badge}
            </span>

            {/* Name */}
            <p className="font-serif text-lg font-bold leading-tight text-balance">
              {pkg.name}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-0.5">
              <span className="font-serif text-3xl font-black">{pkg.price}</span>
              {pkg.priceNote && (
                <span className="text-sm font-medium opacity-70">{pkg.priceNote}</span>
              )}
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-1.5 text-sm">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      selected ? "text-primary-foreground" : "text-accent"
                    )}
                  />
                  <span className={cn("leading-snug opacity-90")}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Selected indicator */}
            {selected && (
              <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground">
                <Check className="h-3 w-3 text-foreground" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
