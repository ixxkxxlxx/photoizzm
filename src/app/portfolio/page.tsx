"use client"

import Link from "next/link"
import { Camera, Image, ArrowRight } from "lucide-react"
import { useState } from "react"

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "convocation", label: "Convocation" },
  { id: "engagement", label: "Engagement" },
]

const GALLERY_ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  category: ["convocation", "engagement"][i % 2] as "convocation" | "engagement",
  title: ["Graduation Day", "The Big Question"][i % 2],
}))

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredItems = activeCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory)

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground">
              <Camera className="h-4 w-4 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-serif text-lg font-bold tracking-wide">PHOTOIZZM</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/#portfolio" className="text-sm font-medium text-foreground">Portfolio</Link>
            <Link href="/#services" className="text-sm font-medium text-muted-foreground hover:text-foreground">Services</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 sm:pt-24 pb-8 sm:py-16 px-3 sm:px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2 sm:mb-4">
              Our Portfolio
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">
              A collection of our favorite moments captured
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6 sm:mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-foreground text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group aspect-square relative overflow-hidden rounded-xl sm:rounded-2xl bg-secondary cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="h-8 w-8 sm:h-16 sm:w-16 text-muted-foreground/30" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <p className="font-serif text-sm sm:text-lg font-bold text-white">{item.title}</p>
                  <p className="text-[10px] sm:text-xs text-white/80 capitalize">{item.category}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-16 text-center">
            <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              Like what you see? Let&apos;s create something beautiful together.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 sm:px-8 py-3 sm:py-4 font-serif text-sm sm:text-lg font-bold text-primary-foreground transition-all hover:bg-foreground/80 hover:shadow-lg"
            >
              Book a Session
              <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
