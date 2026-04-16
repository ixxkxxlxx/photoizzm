"use client"

import Link from "next/link"
import Image from "next/image"
import { BookingForm } from "@/components/booking-form"
import { Sparkles } from "lucide-react"

export default function ConvocationBookingPage() {
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

      <div className="relative z-10 mx-auto max-w-2xl px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <header className="mb-6 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4 text-center">
          <div className="relative h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 overflow-hidden rounded-full border-2 sm:border-4 border-[#d4af37]/30 shadow-2xl">
            <Image
              src="/logo.jpg"
              alt="PHOTOIZZM Logo"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-serif text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#d4af37]">
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-white text-balance">
              Convocation
              <br />
              <span className="font-serif italic font-light text-[#d4af37]">Photography</span>
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#c9c2b5] leading-relaxed max-w-xs sm:max-w-md mx-auto">
              Capture your unforgettable convocation moments with us.<br />
              Pre-convo, post-convo & group sessions available.
          
            </p>
          </div>

          <div className="flex w-full items-center gap-3 mt-1 sm:mt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
            <Sparkles className="h-3 w-3 text-[#d4af37]" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          </div>
        </header>

        <div className="mb-4 sm:mb-6">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/80 hover:text-[#d4af37] transition-colors duration-300"
          >
            <span className="text-lg">←</span> Back to Services
          </Link>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-[#d4af37]/20 bg-[#252220]/90 backdrop-blur-md px-4 sm:px-6 py-6 sm:py-8 shadow-2xl md:px-10 md:py-10">
          <div className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_select]:bg-white/10 [&_select]:border-white/20 [&_select]:text-white [&_.lucide-calendar]:text-white/70 [&_.lucide-map-pin]:text-white/70 [&_.lucide-camera]:text-[#d4af37] [&_.lucide-check-circle-2]:text-[#d4af37] [&_label]:text-white [&_.text-destructive]:text-red-400 [&_.text-muted-foreground]:text-white/60 [&_.bg-secondary]:bg-white/10 [&_.text-accent]:text-[#d4af37]">
            <BookingForm />
          </div>
        </div>

        <footer className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-white/60 leading-relaxed">
          Any questions? Contact us via WhatsApp or Instagram{" "}
          <span className="font-semibold text-[#d4af37]">@photoizzm</span>
          <br />
          <span className="text-white/70">Base area: Puncak Alam · Setia Alam · Shah Alam</span>
        </footer>
      </div>
    </main>
  )
}
