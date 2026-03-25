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
  "UITM Puncak Alam",
  "UITM Shah Alam",
  "Universiti Malaya (UM)",
  "UPM Serdang",
  "Lain-lain",
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
      if (key === "university" && val !== "Lain-lain") {
        next.universityCustom = ""
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.package) e.package = "Sila pilih pakej."
    if (!form.name.trim()) e.name = "Nama diperlukan."
    if (!form.phone.trim()) e.phone = "No. telefon diperlukan."
    if (!form.email.trim()) e.email = "E-mel diperlukan."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format e-mel tidak sah."
    if (!form.university) e.university = "Sila pilih universiti."
    if (form.university === "Lain-lain" && !form.universityCustom.trim())
      e.universityCustom = "Sila masukkan nama universiti."
    if (!form.date) e.date = "Tarikh diperlukan."
    if (!form.sessionTime) e.sessionTime = "Masa diperlukan."
    if (!form.location) e.location = "Lokasi diperlukan."
    if (isForeverUs && (!form.pax || Number(form.pax) < 2))
      e.pax = "Minimum 2 orang untuk pakej Forever Us."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError("")

    const university =
      form.university === "Lain-lain" ? form.universityCustom : form.university

    let totalPrice = 0
    if (selectedPkg) {
      const priceNum = Number(selectedPkg.price.replace(/[^0-9.]/g, ""))
      if (isForeverUs) {
        totalPrice = priceNum * Number(form.pax)
      } else {
        totalPrice = priceNum
      }
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
    return <SuccessScreen pkg={selectedPkg?.name ?? ""} name={form.name} onReset={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      {/* Step 1 – Package */}
      <section className="flex flex-col gap-4">
        <SectionHeading step={1} title="Pilih Pakej" />
        <PackageSelector value={form.package} onChange={set("package")} />
        {errors.package && <ErrorMsg>{errors.package}</ErrorMsg>}
      </section>

      {/* Step 2 – Personal Info */}
      <section className="flex flex-col gap-4">
        <SectionHeading step={2} title="Maklumat Peribadi" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama *" error={errors.name}>
            <Input
              placeholder="Nama anda"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              className={cn(errors.name && "border-destructive")}
            />
          </Field>
          <Field label="No. Telefon *" error={errors.phone}>
            <Input
              type="tel"
              placeholder="01X-XXXXXXXX"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              className={cn(errors.phone && "border-destructive")}
            />
          </Field>
        </div>
        <Field label="E-mel *" error={errors.email}>
          <Input
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            className={cn(errors.email && "border-destructive")}
          />
        </Field>
        <Field label="Universiti *" error={errors.university}>
          <Select value={form.university} onValueChange={set("university")}>
            <SelectTrigger className={cn(errors.university && "border-destructive")}>
              <SelectValue placeholder="Pilih universiti" />
            </SelectTrigger>
            <SelectContent>
              {UNIVERSITIES.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {form.university === "Lain-lain" && (
          <Field label="Nama Universiti *" error={errors.universityCustom}>
            <Input
              placeholder="Nama universiti anda"
              value={form.universityCustom}
              onChange={(e) => set("universityCustom")(e.target.value)}
              className={cn(errors.universityCustom && "border-destructive")}
            />
          </Field>
        )}
      </section>

      {/* Step 3 – Schedule */}
      <section className="flex flex-col gap-4">
        <SectionHeading step={3} title="Tarikh & Masa" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tarikh *" error={errors.date}>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={form.date}
                onChange={(e) => set("date")(e.target.value)}
                className={cn("pl-10", errors.date && "border-destructive")}
              />
            </div>
          </Field>
          <Field label="Masa *" error={errors.sessionTime}>
            <Input
              placeholder="Contoh: 10:00am – 12:00pm"
              value={form.sessionTime}
              onChange={(e) => set("sessionTime")(e.target.value)}
              className={cn(errors.sessionTime && "border-destructive")}
            />
          </Field>
        </div>
      </section>

      {/* Step 4 – Location */}
      <section className="flex flex-col gap-4">
        <SectionHeading step={4} title="Lokasi" />
        <Field label="Lokasi Sesi *" error={errors.location}>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Contoh: UITM Puncak Alam, Studio, dll."
              value={form.location}
              onChange={(e) => set("location")(e.target.value)}
              className={cn("pl-10", errors.location && "border-destructive")}
            />
          </div>
        </Field>
        <p className="text-xs text-muted-foreground">
          * Masukkan lokasi penuh sesi fotografi anda. Caj pengangkutan tambahan
          dikenakan untuk kawasan di luar Puncak Alam / Setia Alam / Shah Alam.
        </p>
      </section>

      {/* Forever Us – Pax count */}
      {isForeverUs && (
        <section className="flex flex-col gap-4">
          <SectionHeading step={5} title="Bilangan Peserta" />
          <Field label="Bilangan Pax * (min. 2)" error={errors.pax}>
            <Input
              type="number"
              min={2}
              placeholder="Contoh: 3"
              value={form.pax}
              onChange={(e) => set("pax")(e.target.value)}
              className={cn("w-40", errors.pax && "border-destructive")}
            />
          </Field>
          {form.pax && Number(form.pax) >= 2 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-foreground">
              <Camera className="h-4 w-4 text-accent" />
              Anggaran: <span className="font-black">RM{Number(form.pax) * 60}</span>
            </div>
          )}
        </section>
      )}

      {/* Notes */}
      <section className="flex flex-col gap-4">
        <SectionHeading
          step={isForeverUs ? 6 : 5}
          title="Catatan Tambahan"
          optional
        />
        <Textarea
          placeholder="Permintaan khas, tema warna, prop yang diperlukan, dll."
          rows={4}
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          className="resize-none"
        />
      </section>

      {/* Summary bar */}
      {selectedPkg && (
        <div className="flex items-center justify-between rounded-2xl border border-foreground/20 bg-secondary px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Pakej dipilih</p>
            <p className="font-serif font-bold text-foreground">{selectedPkg.name}</p>
          </div>
          <p className="font-serif text-2xl font-black text-foreground">
            {selectedPkg.price}
            {selectedPkg.priceNote && (
              <span className="text-sm font-medium text-muted-foreground">
                {selectedPkg.priceNote}
              </span>
            )}
          </p>
        </div>
      )}

      {submitError && (
        <p className="text-center text-sm text-destructive font-medium">{submitError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-foreground py-6 font-serif text-lg font-bold text-primary-foreground transition-all hover:bg-foreground/80 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Menghantar..." : "Hantar"}
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
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground font-sans text-xs font-bold text-primary-foreground">
        {step}
      </span>
      <h2 className="font-serif text-lg font-bold text-foreground">
        {title}
        {optional && (
          <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
            (Pilihan)
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
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {children}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  )
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-destructive">{children}</p>
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
      <CheckCircle2 className="h-16 w-16 text-accent" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-3xl font-black text-foreground text-balance">
          Tempahan Berjaya!
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Terima kasih, <span className="font-semibold text-foreground">{name}</span>!<br />
          Tempahan anda untuk pakej{" "}
          <span className="font-semibold text-foreground">{pkg}</span> telah diterima.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Kami akan menghubungi anda tidak lama lagi melalui telefon atau WhatsApp untuk
          pengesahan slot.
        </p>
      </div>
      <Button
        onClick={onReset}
        variant="outline"
        className="mt-2 rounded-2xl border-foreground font-semibold text-foreground hover:bg-secondary"
      >
        Buat Tempahan Baru
      </Button>
    </div>
  )
}
