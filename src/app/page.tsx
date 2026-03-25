import { BookingForm } from "@/components/booking-form"
import { Camera } from "lucide-react"

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center gap-4 text-center">
          {/* Logo mark */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
            <Camera className="h-6 w-6 text-primary-foreground" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-serif text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              PHOTOIZZM
            </p>
            <h1 className="font-serif text-4xl font-black leading-tight text-foreground text-balance md:text-5xl">
              Convocation
              <br />
              <span className="font-serif italic font-medium">Photography</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Book your convocation photo slot now.<br />
              Pre-convocation, post-convocation & group sessions available.
            </p>
          </div>

          {/* Divider */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-serif text-xs italic text-muted-foreground">
              Booking Form
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </header>

        {/* Form Card */}
        <div className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm md:px-10 md:py-10">
          <BookingForm />
        </div>

        {/* Footer note */}
        <footer className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
          Any questions? Contact us via WhatsApp or Instagram{" "}
          <span className="font-semibold text-foreground">@photoizzm</span>
          <br />
          Base area: Puncak Alam · Setia Alam · Shah Alam
          <br />
          <a
            href="/admin"
            className="mt-2 inline-block font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Admin Panel
          </a>
        </footer>
      </div>
    </main>
  )
}
