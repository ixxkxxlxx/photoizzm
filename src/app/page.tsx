"use client"

import Link from "next/link"
import Image from "next/image"
import { Camera, Heart, Users, Image as ImageIcon, Mail, Phone, Instagram, GraduationCap, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/components/ui/use-mobile"

const ALL_PORTFOLIO_IMAGES = [
  "/images/portfolio/portfolio-1-ukm.jpg",
  "/images/portfolio/portfolio-2.jpg",
  "/images/portfolio/portfolio-3.jpg",
  "/images/portfolio/portfolio-4.jpg",
  "/images/portfolio/portfolio-5.jpg",
  "/images/portfolio/portfolio-6.jpg",
  "/images/portfolio/portfolio-7.jpg",
  "/images/portfolio/portfolio-8.jpg",
]

const HERO_IMAGES = [
  "/images/hero section bg/DSCF0106-enhance.jpg",
  "/images/hero section bg/_DSC0937.jpg",
  "/images/hero section bg/_DSC5213.jpg",
  "/images/hero section bg/_DSC5724.jpg",
  "/images/hero section bg/_DSC7610.jpg",
  "/images/hero section bg/_DSC8005.jpg",
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function HomePage() {
  const [portfolioImages, setPortfolioImages] = useState<string[]>(ALL_PORTFOLIO_IMAGES)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, mobileMenuOpen])

  useEffect(() => {
    const interval = isMobile ? 4000 : 6000
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, interval)
    return () => clearInterval(timer)
  }, [isMobile])

  return (
    <main className="min-h-screen bg-background">
{/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full overflow-hidden border border-border shadow">
              <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="object-contain" />
            </div>
        
            <span className="font-serif text-lg font-bold tracking-wide">PHOTOIZZM</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="cursor-pointer text-sm font-medium text-foreground">Home</Link>
            <Link href="/#portfolio" className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
            <Link href="/#services" className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
            <Link href="/contact" className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/#portfolio" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
              <Link href="/#services" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/contact" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
        {/* Background Slider */}
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 z-0 ${isMobile ? 'transition-opacity duration-500' : 'transition-opacity duration-[2000ms] ease-in-out'} ${index === currentHeroIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={src}
              alt={`Hero Background ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={isMobile ? 60 : 80}
              className={`object-cover ${isMobile ? '' : 'transition-transform duration-[10000ms] ease-linear'} ${index === currentHeroIndex ? (isMobile ? '' : 'scale-110') : 'scale-100'
                }`}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}

        <div className="relative z-10 mx-auto max-w-4xl text-center px-3 sm:px-4 w-full">
          <div className="flex items-center justify-center mx-auto drop-shadow-2xl">
            <Image
              src="/Photoizzm logo drk.png"
              alt="Logo"
              width={isMobile ? 240 : 800}
              height={isMobile ? 240 : 800}
              className="object-contain w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[400px] md:h-[400px] lg:w-[600px] lg:h-[600px] filter drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="flex flex-col items-center justify-center px-3 sm:px-4 py-12 md:py-24 bg-background">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-['The_Seasons'] text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-foreground mb-3 md:mb-6">
            Your Milestone
            <br />
            <span className="italic font-medium">Perfectly Captured.</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-10">
            Professional photography services for your special occasions.
            From convocation to engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full px-4 sm:px-0">
            <Link
              href="/booking"
              className="cursor-pointer rounded-full bg-foreground px-6 md:px-8 py-3 md:py-4 font-serif text-sm md:text-lg font-bold text-primary-foreground transition-all hover:bg-foreground/80 hover:shadow-lg w-full sm:w-auto text-center"
            >
              Book Now
            </Link>
            <Link
              href="/#services"
              className="cursor-pointer rounded-full border-2 border-foreground px-6 md:px-8 py-3 md:py-4 font-serif text-sm md:text-lg font-bold text-foreground transition-colors hover:bg-foreground/10 w-full sm:w-auto text-center"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-secondary/30 px-3 sm:px-4 py-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 md:mb-16 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2 md:mb-4">
              Our Services
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Three niches, one passion for photography
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
            <ServiceCard
              icon={<GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />}
              title="Convocation"
              description="Celebrate your academic achievement with stunning photos. Pre-convo, post-convo, and group sessions."
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
              description="Capture the joy of your engagement day with our affordable packages."
              href="/booking/engagement"
            />
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-4 sm:p-6 text-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-3 sm:mb-4 text-muted-foreground" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">Wedding</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Your perfect day deserves perfect photos. Full-day coverage with premium albums.</p>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" className="px-3 sm:px-4 py-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 md:mb-16 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2 md:mb-4">
              Portfolio
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              A glimpse of our recent work
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4">
            {portfolioImages.map((src, i) => (
              <div
                key={i}
                className="aspect-square relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-secondary"
              >
                <Image
                  src={src}
                  alt={`Portfolio ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 md:mt-10 text-center">
            <a
              href="https://photoizzm.mypixieset.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center gap-2 rounded-full border-2 border-foreground px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-3 font-semibold text-xs sm:text-sm md:text-base text-foreground transition-colors hover:bg-foreground/10"
            >
              View Full Portfolio
            </a>
          </div>

        </div>
      </section>

{/* Contact Section */}
      <section className="bg-foreground px-3 sm:px-4 py-12 md:py-24 text-primary-foreground">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4">
            Get In Touch
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-80 mb-6 md:mb-10">
            Ready to book? Have questions? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8">
            <a href="https://wa.me/601114227957" className="cursor-pointer flex items-center gap-2 md:gap-3 hover:text-accent transition-colors text-xs sm:text-sm md:text-base">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>+60 11-1422 7957</span>
            </a>
            <a href="https://instagram.com/photoizzm" className="cursor-pointer flex items-center gap-2 md:gap-3 hover:text-accent transition-colors text-xs sm:text-sm md:text-base">
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>@photoizzm</span>
            </a>
            <a href="mailto:izz@photoizzm.my" className="cursor-pointer flex items-center gap-2 md:gap-3 hover:text-accent transition-colors text-xs sm:text-sm md:text-base">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>izz@photoizzm.my</span>
            </a>
          </div>
          <p className="mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm opacity-60">
            Based in Puncak Alam · Setia Alam · Shah Alam
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 md:py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full overflow-hidden border border-border">
              <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
        
            <span className="font-serif text-sm font-bold">PHOTOIZZM</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Photoizzm. All rights reserved.
          </p>
        </div>
      </footer>
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
      className="group cursor-pointer rounded-2xl md:rounded-3xl border border-border bg-card p-6 md:p-8 transition-colors duration-200 hover:shadow-xl hover:border-accent"
    >
      <div className="mb-4 md:mb-6 flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-foreground text-primary-foreground">
        {icon}
      </div>
      <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">{description}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:gap-3 transition-all">
        Book Now
        <span className="text-lg">&rarr;</span>
      </span>
    </Link>
  )
}
