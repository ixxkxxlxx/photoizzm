"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CalendarDays, MapPin, CheckCircle2, Heart, Camera, Users, Flower2, Sparkles } from "lucide-react"

export const WEDDING_PACKAGES = [
  {
    id: "wedding-soon",
    name: "Kami Kahwin",
    price: "RM2000",
    features: ["Half day (4 hours)", "2 photographers", "100 edited photos", "Softcopy via Google Drive", "Online gallery"],
  },
  {
    id: "wedding-merried",
    name: "Selamat Berkahwin",
    price: "RM3500",
    features: ["Full day coverage", "2 photographers", "200 edited photos", "Softcopy via Google Drive", "Premium photo album", "Engagement session included"],
  },
  {
    id: "wedding-blissful",
    name: "Happy Ever After",
    price: "RM5000+",
    features: ["Full day + pre-wedding", "2-3 photographers", "300+ edited photos", "Softcopy via Google Drive", "Premium photo album", "Same-day edit teaser", "Drone coverage"],
  },
]

export const WEDDING_ADDONS = [
  { id: "addon-album", name: "Extra Photo Album", price: "RM500" },
  { id: "addon-drone", name: "Drone Coverage", price: "RM300" },
  { id: "addon-sameday", name: "Same-Day Edit Video", price: "RM800" },
  { id: "addon-photobooth", name: "Photobooth", price: "RM400" },
]

interface FormData {
  package: string
  name: string
  partnerName: string
  phone: string
  email: string
  eventDate: string
  eventTime: string
  venue: string
  addons: string[]
  notes: string
}

const INITIAL: FormData = {
  package: "",
  name: "",
  partnerName: "",
  phone: "",
  email: "",
  eventDate: "",
  eventTime: "",
  venue: "",
  addons: [],
  notes: "",
}

export function WeddingForm() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const selectedPkg = WEDDING_PACKAGES.find((p) => p.id === form.package)

  const set = (key: keyof FormData) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleAddon = (id: string) => {
    setForm((prev) => ({
      ...prev,
      addons: prev.addons.includes(id)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id],
    }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.package) e.package = "Sila pilih pakej."
    if (!form.name.trim()) e.name = "Nama diperlukan."
    if (!form.partnerName.trim()) e.partnerName = "Nama pasangan diperlukan."
    if (!form.phone.trim()) e.phone = "Nombor telefon diperlukan."
    if (!form.email.trim()) e.email = "Emel diperlukan."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format emel tidak sah."
    if (!form.eventDate) e.eventDate = "Tarikh majlis diperlukan."
    if (!form.eventTime) e.eventTime = "Masa majlis diperlukan."
    if (!form.venue) e.venue = "Alamat diperlukan."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const calculateTotal = () => {
    let total = selectedPkg ? Number(selectedPkg.price.replace(/[^0-9.]/g, "")) : 0
    form.addons.forEach((addonId) => {
      const addon = WEDDING_ADDONS.find((a) => a.id === addonId)
      if (addon) total += Number(addon.price.replace(/[^0-9.]/g, ""))
    })
    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError("")

    const addonsList = form.addons.map((id) => WEDDING_ADDONS.find((a) => a.id === id)?.name).filter(Boolean)
    const totalPrice = calculateTotal()

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "wedding",
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          packageName: selectedPkg?.name ?? form.package,
          date: form.eventDate,
          time: form.eventTime,
          location: form.venue,
          notes: `Pasangan: ${form.partnerName}\nTarikh Majlis: ${form.eventDate} ${form.eventTime}\nAdd-ons: ${addonsList.join(", ") || "Tiada"}\n\n${form.notes}`,
          totalPrice,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit booking")

      setSubmitted(true)
    } catch {
      setSubmitError("Gagal menghantar tempahan. Sila cuba lagi.")
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
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-[#d4af37]" strokeWidth={1.5} />
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-3xl font-black text-white text-balance">
            Tempahan Berjaya!
          </h2>
          <p className="text-white/80 leading-relaxed">
            Terima kasih, <span className="font-semibold text-[#d4af37]">{form.name}</span>!<br />
            Tempahan fotografi perkahwinan anda telah diterima.
          </p>
          <p className="mt-1 text-sm text-white/60">
            Kami akan menghubungi anda untuk perbincangan lanjut dan pengesahan.
          </p>
        </div>
        <Button
          onClick={handleReset}
          variant="outline"
          className="mt-2 rounded-2xl border-[#d4af37]/50 font-semibold text-white hover:bg-[#d4af37]/20"
        >
          Buat Tempahan Baru
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <SectionHeading step={1} title="Pilih Pakej" />
        <div className="grid gap-4 sm:grid-cols-3">
          {WEDDING_PACKAGES.map((pkg) => {
            const selected = form.package === pkg.id
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => set("package")(pkg.id)}
                className={cn(
                  "relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]",
                  selected
                    ? "border-[#d4af37] bg-[#d4af37]/20 shadow-lg scale-[1.02]"
                    : "border-white/20 bg-white/10 text-white hover:border-[#d4af37]/50 hover:shadow-md"
                )}
              >
                <span className={cn(
                  "w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
                  selected ? "bg-[#d4af37]/30 text-[#d4af37]" : "bg-white/10 text-white/70"
                )}>
                  Wedding
                </span>
                <p className="font-serif text-lg font-bold leading-tight text-white">{pkg.name}</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-serif text-3xl font-black text-[#d4af37]">{pkg.price}</span>
                </div>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Heart className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", selected ? "text-[#d4af37]" : "text-[#d4af37]/70")} />
                      <span className={cn("leading-3", selected ? "text-white" : "text-white/90")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
        {errors.package && <p className="text-xs text-red-400">{errors.package}</p>}
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading step={2} title="Maklumat Pasangan" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-white">Nama Pengantin (Anda) *</Label>
            <Input
              placeholder="Nama anda"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              className={cn(errors.name && "border-red-400")}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-white">Nama Pasangan *</Label>
            <Input
              placeholder="Nama pasangan"
              value={form.partnerName}
              onChange={(e) => set("partnerName")(e.target.value)}
              className={cn(errors.partnerName && "border-red-400")}
            />
            {errors.partnerName && <p className="text-xs text-red-400">{errors.partnerName}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-white">Nombor Telefon *</Label>
            <Input
              type="tel"
              placeholder="01X-XXXXXXXX"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              className={cn(errors.phone && "border-red-400")}
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-white">Emel *</Label>
            <Input
              type="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              className={cn(errors.email && "border-red-400")}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading step={3} title="Detail Majlis" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-white">Tarikh Majlis *</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                type="date"
                value={form.eventDate}
                onChange={(e) => set("eventDate")(e.target.value)}
                className={cn("pl-10", errors.eventDate && "border-red-400")}
              />
            </div>
            {errors.eventDate && <p className="text-xs text-red-400">{errors.eventDate}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-white">Masa Majlis *</Label>
            <Input
              placeholder="Contoh: 10:00 pagi - 5:00 petang"
              value={form.eventTime}
              onChange={(e) => set("eventTime")(e.target.value)}
              className={cn(errors.eventTime && "border-red-400")}
            />
            {errors.eventTime && <p className="text-xs text-red-400">{errors.eventTime}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-white">Alamat Lokasi *</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Textarea
              placeholder="Alamat penuh majlis"
              rows={3}
              value={form.venue}
              onChange={(e) => set("venue")(e.target.value)}
              className={cn("pl-10 resize-none", errors.venue && "border-red-400")}
            />
          </div>
          {errors.venue && <p className="text-xs text-red-400">{errors.venue}</p>}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading step={4} title="Add-ons" optional />
        <div className="grid gap-3 sm:grid-cols-2">
          {WEDDING_ADDONS.map((addon) => {
            const selected = form.addons.includes(addon.id)
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 p-4 transition-all",
                  selected
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                )}
              >
                <span className="text-sm font-medium text-white">{addon.name}</span>
                <span className="font-serif font-bold text-[#d4af37]">{addon.price}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading step={5} title="Nota Tambahan" optional />
        <Textarea
          placeholder="Tema majlis, permintaan khas, dll."
          rows={4}
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          className="resize-none"
        />
      </section>

      {selectedPkg && (
        <div className="flex items-center justify-between rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-5 py-4">
          <div>
            <p className="text-xs text-white/60">Pakej dipilih</p>
            <p className="font-serif font-bold text-white">{selectedPkg.name}</p>
            {form.addons.length > 0 && (
              <p className="text-xs text-white/60">+ {form.addons.length} add-on(s)</p>
            )}
          </div>
          <p className="font-serif text-2xl font-black text-[#d4af37]">RM{calculateTotal()}</p>
        </div>
      )}

      {submitError && (
        <p className="text-center text-sm text-red-400 font-medium">{submitError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-[#d4af37] py-6 font-serif text-lg font-bold text-[#1a1814] transition-all hover:bg-[#d4af37]/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Menghantar..." : "Hantar Tempahan"}
      </Button>
    </form>
  )
}

function SectionHeading({ step, title, optional }: { step: number; title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d4af37] font-sans text-xs font-bold text-[#1a1814]">
        {step}
      </span>
      <h2 className="font-serif text-lg font-bold text-white">
        {title}
        {optional && <span className="ml-2 font-sans text-xs font-normal text-white/60">(Opsional)</span>}
      </h2>
    </div>
  )
}
