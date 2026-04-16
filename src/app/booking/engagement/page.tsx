"use client"

import Link from "next/link"
import Image from "next/image"
import { EngagementForm } from "@/components/engagement-form"
import { Heart } from "lucide-react"

export default function EngagementBookingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/tunang-bg.jpg")' }}
        />
        <div className="absolute inset-0 bg-[#1a1814]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1814]/60 via-transparent to-[#1a1814]/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <header className="mb-6 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4 text-center">
          <div className="relative h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 overflow-hidden rounded-full border-2 border-[#b8a082]/50 shadow-xl">
            <Image
              src="/logo.jpg"
              alt="PHOTOIZZM Logo"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-serif text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#b8a082]">
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-[#f5f1ec] text-balance">
              Engagement
              <br />
              <span className="font-serif italic font-light text-[#b8a082]">Photography</span>
            </h1>
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-[#c9c2b5] leading-relaxed max-w-xs sm:max-w-md mx-auto font-light">
              Capture the joy and love of your engagement day.<br />
              Cherish these beautiful moments forever with our professional photography.
          
            </p>
          </div>

          <div className="flex w-full items-center gap-3 mt-1 sm:mt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b8a082]/40 to-transparent" />
            <Heart className="h-3 w-3 text-[#b8a082] fill-[#b8a082]" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b8a082]/40 to-transparent" />
          </div>
        </header>

        <div className="mb-4 sm:mb-6">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/70 hover:text-[#b8a082] transition-colors duration-300"
          >
            <span className="text-lg">←</span> Back to Services
          </Link>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-[#b8a082]/20 bg-[#252220]/90 backdrop-blur-md px-4 sm:px-6 py-6 sm:py-8 shadow-xl md:px-10 md:py-10">
          <div className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-[#f5f1ec] [&_input]:placeholder:text-white/40 [&_select]:bg-white/5 [&_select]:border-white/20 [&_select]:text-[#f5f1ec] [&_textarea]:bg-white/5 [&_textarea]:border-white/20 [&_textarea]:text-[#f5f1ec] [&_textarea]:placeholder:text-white/40 [&_.lucide-calendar]:text-[#b8a082] [&_.lucide-map-pin]:text-[#b8a082] [&_.lucide-heart]:text-[#b8a082] [&_.lucide-camera]:text-[#b8a082] [&_.lucide-check-circle-2]:text-[#b8a082] [&_label]:text-[#d4d0c8] [&_label_span]:text-[#d4d0c8] [&_.text-destructive]:text-[#e57373] [&_.text-muted-foreground]:text-[#a09a90] [&_.bg-secondary]:bg-white/5 [&_.text-accent]:text-[#b8a082] [&_.border-destructive]:border-[#e57373]">
            <EngagementForm />
          </div>
        </div>

        <footer className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-[#a09a90] leading-relaxed font-light">
          Any questions? Contact us via WhatsApp or Instagram{" "}
          <span className="font-medium text-[#b8a082]">@photoizzm</span>
          <br />
          <span className="text-white/50">Based in: Puncak Alam · Setia Alam · Shah Alam</span>
        </footer>
      </div>
    </main>
  )
}
