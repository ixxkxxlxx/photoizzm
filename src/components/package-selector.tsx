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
    price: "From RM60",
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
    <div className="grid gap-3 sm:grid-cols-3">
      {PACKAGES.map((pkg) => {
        const selected = value === pkg.id
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onChange(pkg.id)}
            className={cn(
              "relative flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border-2 p-3 sm:p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]",
              selected
                ? "border-[#d4af37] bg-[#d4af37]/20 shadow-lg scale-[1.02]"
                : "border-white/20 bg-white/10 text-white hover:border-[#d4af37]/50 hover:shadow-md"
            )}
            aria-pressed={selected}
          >
            {/* Badge */}
            <span
              className={cn(
                "w-fit rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wide",
                selected
                  ? "bg-[#d4af37]/30 text-[#d4af37]"
                  : "bg-white/10 text-white/70"
              )}
            >
              {pkg.badge}
            </span>

            {/* Name */}
            <p className="font-serif text-sm sm:text-lg font-bold leading-tight text-balance text-white">
              {pkg.name}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-0.5">
              <span className="font-serif text-xl sm:text-3xl font-black text-[#d4af37]">{pkg.price}</span>
              {pkg.priceNote && (
                <span className="text-xs sm:text-sm font-medium text-white/70">{pkg.priceNote}</span>
              )}
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-1 text-xs sm:text-sm">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 sm:gap-2">
                  <Check
                    className={cn(
                      "mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0",
                      selected ? "text-[#d4af37]" : "text-[#d4af37]/70"
                    )}
                  />
                  <span className={cn("leading-snug", selected ? "text-white" : "text-white/90")}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Selected indicator */}
            {selected && (
              <span className="absolute right-3 sm:right-4 top-3 sm:top-4 flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-[#d4af37]">
                <Check className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#1a1814]" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
