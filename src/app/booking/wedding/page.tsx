"use client"

import Link from "next/link"
import Image from "next/image"
import { WeddingForm } from "@/components/wedding-form"
import { Users } from "lucide-react"

export default function WeddingBookingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/booking-bg.jpg")' }}
        />
        <div className="absolute inset-0 bg-[#1a1814]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1814]/60 via-transparent to-[#1a1814]/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 md:py-16">
        <header className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#d4af37]/30 shadow-2xl">
            <Image
              src="/logo.jpg"
              alt="PHOTOIZZM Logo"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-serif text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              PHOTOIZZM
            </p>
            <h1 className="font-serif text-4xl font-black leading-tight text-white text-balance md:text-5xl">
              Wedding
              <br />
              <span className="font-serif italic font-light text-[#d4af37]">Photography</span>
            </h1>
            <p className="mt-3 text-sm text-[#c9c2b5] leading-relaxed max-w-md mx-auto">
              Your perfect day deserves perfect photos.<br />
              Full-day coverage with premium albums.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 mt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
            <Users className="h-3 w-3 text-[#d4af37]" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          </div>
        </header>

        <div className="mb-6">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-[#d4af37] transition-colors duration-300"
          >
            <span className="text-lg">←</span> Back to Services
          </Link>
        </div>

        <div className="rounded-3xl border border-[#d4af37]/20 bg-[#252220]/90 backdrop-blur-md px-6 py-8 shadow-2xl md:px-10 md:py-10">
          <div className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_select]:bg-white/10 [&_select]:border-white/20 [&_select]:text-white [&_textarea]:bg-white/10 [&_textarea]:border-white/20 [&_textarea]:text-white [&_textarea]:placeholder:text-white/50 [&_.lucide-calendar]:text-white/70 [&_.lucide-map-pin]:text-white/70 [&_.lucide-heart]:text-[#d4af37] [&_.lucide-users]:text-[#d4af37] [&_.lucide-camera]:text-[#d4af37] [&_.lucide-check-circle-2]:text-[#d4af37] [&_label]:text-white [&_label_span]:text-white [&_.text-destructive]:text-red-400 [&_.text-muted-foreground]:text-white/60 [&_.bg-secondary]:bg-white/10 [&_.text-accent]:text-[#d4af37] [&_.border-destructive]:border-red-400">
            <WeddingForm />
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-white/60 leading-relaxed">
          Any questions? Contact us via WhatsApp or Instagram{" "}
          <span className="font-semibold text-[#d4af37]">@photoizzm</span>
          <br />
          <span className="text-white/70">Base area: Puncak Alam · Setia Alam · Shah Alam</span>
        </footer>
      </div>
    </main>
  )
}
