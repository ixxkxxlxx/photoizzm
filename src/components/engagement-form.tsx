"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CalendarDays, MapPin, CheckCircle2, Heart } from "lucide-react"

export const ENGAGEMENT_PACKAGES = [
  {
    id: "engagement-reminiscence",
    name: "Reminiscence",
    price: "RM250",
    features: ["Outdoor only", "2 hour session", "Unlimited shots", "All edited photos", "Softcopy via Google Photos"],
  },
  {
    id: "engagement-memoir",
    name: "Memoir",
    price: "RM350",
    features: ["Indoor only", "3 hour session", "Unlimited shots", "All edited photos", "Softcopy via Google Photos"],
  },
  {
    id: "engagement-forever",
    name: "Forever",
    price: "RM400",
    features: ["Indoor & outdoor", "4 hour session", "Unlimited shots", "All edited photos", "Softcopy via Google Photos"],
  },
]

interface FormData {
  package: string
  name: string
  partnerName: string
  phone: string
  email: string
  date: string
  sessionTime: string
  location: string
  notes: string
}

const INITIAL: FormData = {
  package: "",
  name: "",
  partnerName: "",
  phone: "",
  email: "",
  date: "",
  sessionTime: "",
  location: "",
  notes: "",
}

export function EngagementForm() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const selectedPkg = ENGAGEMENT_PACKAGES.find((p) => p.id === form.package)

  const set = (key: keyof FormData) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.package) e.package = "Please select a package."
    if (!form.name.trim()) e.name = "Your name is required."
    if (!form.partnerName.trim()) e.partnerName = "Partner's name is required."
    if (!form.phone.trim()) e.phone = "Phone number is required."
    if (!form.email.trim()) e.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format."
    if (!form.date) e.date = "Date is required."
    if (!form.sessionTime) e.sessionTime = "Time is required."
    if (!form.location) e.location = "Location is required."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError("")

    const totalPrice = selectedPkg ? Number(selectedPkg.price.replace(/[^0-9.]/g, "")) : 0

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "engagement",
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          packageName: selectedPkg?.name ?? form.package,
          date: form.date,
          time: form.sessionTime,
          location: form.location,
          notes: `Partner: ${form.partnerName}${form.notes ? `\n\n${form.notes}` : ""}`,
          totalPrice,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit booking")

      setSubmitted(true)
    } catch {
      setSubmitError("Failed to submit booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(INITIAL)
    setErrors({})
    setSubmitError("")
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 sm:gap-6 py-8 sm:py-12 text-center">
        <div className="relative">
          <CheckCircle2 className="h-12 sm:h-16 w-12 sm:w-16 text-[#b8a082]" strokeWidth={1.5} />
          <Heart className="absolute -bottom-1 -right-1 h-4 sm:h-5 w-4 sm:w-5 text-[#b8a082] fill-[#b8a082]" />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#f5f1ec] text-balance">
            Thank You
          </h2>
          <p className="text-xs sm:text-sm text-[#c9c2b5] leading-relaxed">
            Dear <span className="font-medium text-[#b8a082]">{form.name}</span> & <span className="font-medium text-[#b8a082]">{form.partnerName}</span>,<br />
            Your engagement session booking has been received.
          </p>
          <p className="mt-1 text-[10px] sm:text-sm text-[#a09a90]">
            We will contact you soon to confirm your session details.
          </p>
        </div>
        <Button
          onClick={handleReset}
          variant="outline"
          className="mt-1 sm:mt-2 rounded-full border-[#b8a082]/50 px-6 sm:px-8 font-medium text-xs sm:text-sm text-[#b8a082] hover:bg-[#b8a082]/10"
        >
          Make Another Booking
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 sm:gap-10">
      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={1} title="Choose Package" />
        <div className="flex flex-col gap-3 sm:gap-4">
          {ENGAGEMENT_PACKAGES.map((pkg) => {
            const selected = form.package === pkg.id
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => set("package")(pkg.id)}
                className={cn(
                  "group relative flex w-full flex-col items-stretch overflow-hidden rounded-xl border-2 transition-all duration-300 sm:flex-row",
                  selected
                    ? "border-[#FFAB91] bg-[#FFAB91]/10 shadow-lg scale-[1.01]"
                    : "border-white/10 bg-white/5 text-[#d4d0c8] hover:border-[#FFAB91]/50 hover:bg-white/10"
                )}
              >
                <div className="flex flex-1 flex-col justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-10">
                  <ul className="flex flex-col gap-1 text-xs sm:text-sm">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 sm:gap-2">
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          selected ? "bg-[#FFAB91]" : "bg-white/30"
                        )} />
                        <span className={cn("font-light leading-tight", selected ? "text-white" : "text-white/80")}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-center p-3 sm:p-6">
                  <div className={cn(
                    "flex flex-col overflow-hidden rounded-xl border-2 min-w-[100px] sm:min-w-[140px] md:min-w-[180px]",
                    selected ? "border-[#FFAB91] bg-[#FFAB91]" : "border-white/20 bg-transparent"
                  )}>
                    <div className={cn(
                      "flex items-center justify-center border-b px-3 sm:px-6 py-1.5 sm:py-2",
                      selected ? "border-white/20" : "border-white/20"
                    )}>
                      <span className={cn(
                        "font-serif text-sm sm:text-lg font-medium",
                        selected ? "text-[#1a1814]" : "text-[#d4d0c8]"
                      )}>
                        {pkg.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center px-3 sm:px-6 py-2 sm:py-4">
                      <span className={cn(
                        "font-serif text-xl sm:text-3xl font-light md:text-4xl",
                        selected ? "text-[#1a1814]" : "text-[#FFAB91]"
                      )}>
                        {pkg.price}
                      </span>
                    </div>
                  </div>
                </div>

                {selected && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 h-5 sm:h-6 w-5 sm:w-6 rounded-full bg-[#FFAB91] flex items-center justify-center">
                    <CheckCircle2 className="h-3 sm:h-4 w-3 sm:w-4 text-[#1a1814]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {errors.package && <p className="text-xs text-[#e57373]">{errors.package}</p>}

        <p className="text-xs text-[#fff7ed] italic mt-1">
          *Price includes travel costs for the entire KL & Selangor area.
        </p>
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={2} title="Couple's Information" />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Your Name *</Label>
            <Input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              className={cn(errors.name && "border-[#e57373]")}
            />
            {errors.name && <p className="text-xs text-[#e57373]">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Partner's Name *</Label>
            <Input
              placeholder="Partner's name"
              value={form.partnerName}
              onChange={(e) => set("partnerName")(e.target.value)}
              className={cn(errors.partnerName && "border-[#e57373]")}
            />
            {errors.partnerName && <p className="text-xs text-[#e57373]">{errors.partnerName}</p>}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Phone Number *</Label>
            <Input
              type="tel"
              placeholder="01X-XXXXXXXX"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              className={cn(errors.phone && "border-[#e57373]")}
            />
            {errors.phone && <p className="text-xs text-[#e57373]">{errors.phone}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Email *</Label>
            <Input
              type="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              className={cn(errors.email && "border-[#e57373]")}
            />
            {errors.email && <p className="text-xs text-[#e57373]">{errors.email}</p>}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={3} title="Date & Location" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Date *</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8a082]" />
              <Input
                type="date"
                value={form.date}
                onChange={(e) => set("date")(e.target.value)}
                className={cn("pl-10", errors.date && "border-[#e57373]")}
              />
            </div>
            {errors.date && <p className="text-xs text-[#e57373]">{errors.date}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Time *</Label>
            <Input
              placeholder="e.g. 10:00am – 12:00pm"
              value={form.sessionTime}
              onChange={(e) => set("sessionTime")(e.target.value)}
              className={cn(errors.sessionTime && "border-[#e57373]")}
            />
            {errors.sessionTime && <p className="text-xs text-[#e57373]">{errors.sessionTime}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs sm:text-sm font-light text-[#d4d0c8]">Location *</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8a082]" />
              <Input
                placeholder="Session location"
                value={form.location}
                onChange={(e) => set("location")(e.target.value)}
                className={cn("pl-10", errors.location && "border-[#e57373]")}
              />
            </div>
            {errors.location && <p className="text-xs text-[#e57373]">{errors.location}</p>}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={4} title="Additional Notes" optional />
        <Textarea
          placeholder="Special requests, color theme, props, etc."
          rows={3}
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          className="resize-none"
        />
      </section>

      {selectedPkg && (
        <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-[#FFAB91]/30 bg-[#FFAB91]/10 px-4 sm:px-5 py-3 sm:py-4">
          <div>
            <p className="text-[10px] sm:text-xs text-[#a09a90]">Selected package</p>
            <p className="font-serif font-medium text-[#f5f1ec]">{selectedPkg.name}</p>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-light text-[#FFAB91]">{selectedPkg.price}</p>
        </div>
      )}

      {submitError && (
        <p className="text-center text-xs sm:text-sm text-[#e57373] font-medium">{submitError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#FFAB91] py-4 sm:py-6 font-serif text-sm sm:text-base font-medium text-[#1a1814] transition-all hover:bg-[#ff8a65] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Book Now"}
      </Button>
    </form>
  )
}

function SectionHeading({ step, title, optional }: { step: number; title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b8a082] font-sans text-xs font-medium text-[#1a1814]">
        {step}
      </span>
      <h2 className="font-serif text-lg font-light text-[#f5f1ec]">
        {title}
        {optional && <span className="ml-2 font-sans text-xs font-normal text-[#a09a90]">(Optional)</span>}
      </h2>
    </div>
  )
}
