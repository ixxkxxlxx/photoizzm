"use client"

import { useState } from "react"
import { PackageSelector, PACKAGES } from "@/components/package-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarDays, MapPin, CheckCircle2, Camera } from "lucide-react"

const UNIVERSITIES = [
  "UITM Shah Alam",
  "Universiti Kebangsaan Malaysia (UKM)",
  "Universiti Malaya (UM)",
  "UniKL",
  "Others",
]

interface FormData {
  package: string
  name: string
  phone: string
  email: string
  university: string
  universityCustom: string
  date: string
  sessionTime: string
  location: string
  pax: string
  notes: string
}

const INITIAL: FormData = {
  package: "",
  name: "",
  phone: "",
  email: "",
  university: "",
  universityCustom: "",
  date: "",
  sessionTime: "",
  location: "",
  pax: "",
  notes: "",
}

export function BookingForm() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const selectedPkg = PACKAGES.find((p) => p.id === form.package)
  const isForeverUs = form.package === "forever-us"

  const set = (key: keyof FormData) => (val: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val }
      if (key === "university" && val !== "Others") {
        next.universityCustom = ""
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.package) e.package = "Please select a package."
    if (!form.name.trim()) e.name = "Name is required."
    if (!form.phone.trim()) e.phone = "Phone number is required."
    if (!form.email.trim()) e.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format."
    if (!form.university) e.university = "Please select a university."
    if (form.university === "Others" && !form.universityCustom.trim())
      e.universityCustom = "Please enter university name."
    if (!form.date) e.date = "Date is required."
    if (!form.sessionTime) e.sessionTime = "Time is required."
    if (!form.location) e.location = "Location is required."
    if (isForeverUs && (!form.pax || Number(form.pax) < 2))
      e.pax = "Minimum 2 people for Forever Us package."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const getGroupPrice = (pax: number) => {
    if (pax === 2) return 80
    if (pax === 3) return 70
    return 60
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError("")

    const university =
      form.university === "Others" ? form.universityCustom : form.university

    let totalPrice = 0
    if (selectedPkg) {
      if (isForeverUs) {
        const paxCount = Number(form.pax)
        totalPrice = getGroupPrice(paxCount) * paxCount
      } else {
        totalPrice = Number(selectedPkg.price.replace(/[^0-9.]/g, ""))
      }
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "convocation",
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          packageName: selectedPkg?.name ?? form.package,
          university,
          date: form.date,
          time: form.sessionTime,
          location: form.location,
          pax: form.pax ? Number(form.pax) : null,
          notes: form.notes || null,
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
    return <SuccessScreen pkg={selectedPkg?.name ?? ""} name={form.name} onReset={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 sm:gap-10">
      {/* Step 1 – Package */}
      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={1} title="Select Package" />
        <PackageSelector value={form.package} onChange={set("package")} />
        {errors.package && <ErrorMsg>{errors.package}</ErrorMsg>}
      </section>

      {/* Step 2 – Personal Info */}
      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={2} title="Personal Information" />
        <div className="grid gap-3 sm:gap-4">
          <Field label="Name *" error={errors.name}>
            <Input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              className={cn(errors.name && "border-red-400")}
            />
          </Field>
          <Field label="Phone Number *" error={errors.phone}>
            <Input
              type="tel"
              placeholder="01X-XXXXXXXX"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              className={cn(errors.phone && "border-red-400")}
            />
          </Field>
        </div>
        <Field label="Email *" error={errors.email}>
          <Input
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            className={cn(errors.email && "border-red-400")}
          />
        </Field>
        <Field label="University *" error={errors.university}>
          <Select value={form.university} onValueChange={set("university")}>
            <SelectTrigger className={cn(errors.university && "border-red-400", "text-white")}>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent className="bg-[#252220] border-white/20 text-white">
              {UNIVERSITIES.map((u) => (
                <SelectItem key={u} value={u} className="text-white focus:bg-[#d4af37]/20 focus:text-[#d4af37]">
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {form.university === "Others" && (
          <Field label="University Name *" error={errors.universityCustom}>
            <Input
              placeholder="Your university name"
              value={form.universityCustom}
              onChange={(e) => set("universityCustom")(e.target.value)}
              className={cn(errors.universityCustom && "border-red-400")}
            />
          </Field>
        )}
      </section>

      {/* Step 3 – Schedule */}
      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={3} title="Date & Time" />
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <Field label="Date *" error={errors.date}>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                type="date"
                value={form.date}
                onChange={(e) => set("date")(e.target.value)}
                className={cn("pl-10", errors.date && "border-red-400")}
              />
            </div>
          </Field>
          <Field label="Time *" error={errors.sessionTime}>
            <Input
              placeholder="e.g. 10:00am – 12:00pm"
              value={form.sessionTime}
              onChange={(e) => set("sessionTime")(e.target.value)}
              className={cn(errors.sessionTime && "border-red-400")}
            />
          </Field>
        </div>
      </section>

      {/* Step 4 – Location */}
      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading step={4} title="Location" />
        <Field label="Session Location *" error={errors.location}>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="e.g. UITM Puncak Alam, Studio, etc."
              value={form.location}
              onChange={(e) => set("location")(e.target.value)}
              className={cn("pl-10", errors.location && "border-red-400")}
            />
          </div>
        </Field>
        <p className="text-[10px] sm:text-xs text-white/50">
          * Enter the full location for your photography session. Additional transportation charges apply for areas outside Puncak Alam / Setia Alam / Shah Alam.
        </p>
      </section>

      {/* Forever Us – Pax count */}
      {isForeverUs && (
        <section className="flex flex-col gap-3 sm:gap-4">
          <SectionHeading step={5} title="Number of Participants" />
          <Field label="Number of Pax * (min. 2)" error={errors.pax}>
            <Input
              type="number"
              min={2}
              placeholder="e.g. 3"
              value={form.pax}
              onChange={(e) => set("pax")(e.target.value)}
              className={cn("w-32 sm:w-40", errors.pax && "border-red-400")}
            />
          </Field>
          {form.pax && Number(form.pax) >= 2 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white">
              <Camera className="h-3 sm:h-4 w-3 sm:w-4 text-[#d4af37]" />
              Estimated: <span className="font-black text-[#d4af37]">RM{getGroupPrice(Number(form.pax)) * Number(form.pax)}</span>
              <span className="text-[10px] sm:text-xs text-white/60">
                ({getGroupPrice(Number(form.pax))}/pax)
              </span>
            </div>
          )}
        </section>
      )}

      {/* Notes */}
      <section className="flex flex-col gap-3 sm:gap-4">
        <SectionHeading
          step={isForeverUs ? 6 : 5}
          title="Additional Notes"
          optional
        />
        <Textarea
          placeholder="Special requests, color themes, props needed, etc."
          rows={3}
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          className="resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </section>

      {/* Summary bar */}
      {selectedPkg && (
        <div className="flex items-center justify-between rounded-xl sm:2xl border border-white/20 bg-white/10 px-4 sm:px-5 py-3 sm:py-4">
          <div>
            <p className="text-[10px] sm:text-xs text-white/60">Selected package</p>
            <p className="font-serif font-bold text-white">{selectedPkg.name}</p>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-black text-[#d4af37]">
            {selectedPkg.price}
            {selectedPkg.priceNote && (
              <span className="text-xs sm:text-sm font-medium text-white/60">
                {selectedPkg.priceNote}
              </span>
            )}
          </p>
        </div>
      )}

      {submitError && (
        <p className="text-center text-xs sm:text-sm text-red-400 font-medium">{submitError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-xl sm:rounded-2xl bg-[#d4af37] py-4 sm:py-6 font-serif text-sm sm:text-lg font-bold text-[#1a1814] transition-all hover:bg-[#c9a030] hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}

/* ─── Sub-components ─── */

function SectionHeading({
  step,
  title,
  optional,
}: {
  step: number
  title: string
  optional?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d4af37] font-sans text-xs font-bold text-[#1a1814]">
        {step}
      </span>
      <h2 className="font-serif text-lg font-bold text-white">
        {title}
        {optional && (
          <span className="ml-2 font-sans text-xs font-normal text-white/60">
            (Optional)
          </span>
        )}
      </h2>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-semibold text-white">{label}</Label>
      {children}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  )
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-red-400">{children}</p>
}

function SuccessScreen({
  pkg,
  name,
  onReset,
}: {
  pkg: string
  name: string
  onReset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <CheckCircle2 className="h-16 w-16 text-[#d4af37]" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-3xl font-black text-white text-balance">
          Booking Successful!
        </h2>
        <p className="text-white/70 leading-relaxed">
          Thank you, <span className="font-semibold text-white">{name}</span>!<br />
          Your booking for the{" "}
          <span className="font-semibold text-[#d4af37]">{pkg}</span> package has been received.
        </p>
        <p className="mt-1 text-sm text-white/60">
          We will contact you shortly via phone or WhatsApp for slot confirmation.
        </p>
      </div>
      <Button
        onClick={onReset}
        variant="outline"
        className="mt-2 rounded-2xl border-[#000]/50 font-semibold text-black hover:bg-[#d4af37]/20"
   
      >
        Make New Booking
      </Button>
    </div>
  )
}
