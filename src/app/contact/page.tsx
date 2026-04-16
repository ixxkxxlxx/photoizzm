"use client"

import Link from "next/link"
import { Camera, Phone, Mail, Instagram, MapPin, MessageCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useIsMobile } from "@/components/ui/use-mobile"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border border-border shadow">
              <img
                src="/logo.jpg"
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-serif text-lg font-bold tracking-wide">PHOTOIZZM</span>
          </Link>
    
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/#portfolio" className="text-sm font-medium text-muted-foreground hover:text-foreground">Portfolio</Link>
            <Link href="/#services" className="text-sm font-medium text-muted-foreground hover:text-foreground">Services</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground">Contact</Link>
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
              <Link href="/" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/#portfolio" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
              <Link href="/#services" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/contact" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-20 sm:pt-24 pb-8 sm:py-16 px-3 sm:px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 sm:mb-10 md:mb-16 text-center">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2 sm:mb-3 md:mb-4">
              Get In Touch
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-muted-foreground">
              Have questions? Ready to book? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-12">
            {/* Contact Info */}
            <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
              <div className="rounded-xl sm:rounded-2xl md:rounded-3xl border border-border bg-card p-4 sm:p-6 md:p-8">
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6">
                  Contact Information
                </h2>
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                  <a href="https://wa.me/60123456789" className="flex items-center gap-3 sm:gap-4 text-foreground hover:text-accent transition-colors">
                    <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-foreground text-primary-foreground">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-semibold text-sm sm:text-base">+60 1114227957</p>
                    </div>
                  </a>
                  <a href="https://instagram.com/photoizzm" className="flex items-center gap-3 sm:gap-4 text-foreground hover:text-accent transition-colors">
                    <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-foreground text-primary-foreground">
                      <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Instagram</p>
                      <p className="font-semibold text-sm sm:text-base">@photoizzm</p>
                    </div>
                  </a>
                  <a href="mailto:izz@photoizzm.my" className="flex items-center gap-3 sm:gap-4 text-foreground hover:text-accent transition-colors">
                    <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-foreground text-primary-foreground">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-sm sm:text-base">izz@photoizzm.my</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 sm:gap-4 text-foreground">
                    <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-foreground text-primary-foreground">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold text-sm sm:text-base">Puncak Alam, Selangor</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl sm:rounded-2xl md:rounded-3xl border border-border bg-card p-4 sm:p-6 md:p-8">
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                  Service Areas
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  We primarily serve the Klang Valley area including Puncak Alam, Setia Alam, Shah Alam, Subang, and surrounding areas. Travel fees may apply for locations outside these areas.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl sm:rounded-2xl md:rounded-3xl border border-border bg-card p-4 sm:p-6 md:p-8">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6">
                Send us a Message
              </h2>
              {submitted ? (
                <div className="flex flex-col items-center gap-3 sm:gap-4 py-6 sm:py-8 md:py-12 text-center">
                  <div className="flex h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 items-center justify-center rounded-full bg-accent/20">
                    <Mail className="h-5 sm:h-6 md:h-8 w-5 sm:h-6 md:w-8 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground">Message Sent!</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">We&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-1 sm:mt-2 md:mt-4 text-xs sm:text-sm font-medium text-foreground underline underline-offset-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message" className="text-sm">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-xl bg-foreground py-3 sm:py-4 md:py-6 font-serif text-sm sm:text-base md:text-lg font-bold text-primary-foreground hover:bg-foreground/80">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
