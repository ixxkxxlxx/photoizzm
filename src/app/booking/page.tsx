"use client"

import Link from "next/link"
import Image from "next/image"
import { Camera, Heart, Users, ArrowRight, GraduationCap } from "lucide-react"

export default function BookingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/booking-home.jpg")' }}
        />
        <div className="absolute inset-0 bg-[#1a1814]/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4 text-center">
          <div className="relative h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 overflow-hidden rounded-full border-2 border-white/30 shadow-xl">
            <Image
              src="/logo.jpg"
              alt="PHOTOIZZM Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-white text-balance">
              Choose Your Service
              <br />
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
              Select the type of photography service you need
            </p>
          </div>
        </header>

        {/* Service Selection */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <ServiceCard
            icon={<GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />}
            title="Convocation"
            description="Pre-convo, post-convo, and group sessions for your graduation day."
            href="/booking/convocation"
          />
          <ServiceCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-8 sm:h-8"
              >
                <path d="M12 7V3L15 4.5L12 6L9 4.5L12 3" />
                <circle cx="12" cy="14" r="7" />
              </svg>
            }
            title="Engagement"
            description="Capture the joy of your engagement with beautiful photos."
            href="/booking/engagement"
          />
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-border bg-card/50 backdrop-blur-sm p-5 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-muted text-muted-foreground">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Wedding</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">Full-day wedding photography with premium packages.</p>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 sm:mt-10 text-center">
          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

function ServiceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center rounded-2xl sm:rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-5 sm:p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="mb-4 sm:mb-6 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-foreground text-primary-foreground">
        {icon}
      </div>
      <h3 className="font-serif text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">{description}</p>
      <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground group-hover:gap-3 transition-all">
        Book Now
        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </span>
    </Link>
  )
}
