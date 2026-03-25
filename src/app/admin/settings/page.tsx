"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock,
  Bell,
  Palette,
  Shield,
} from "lucide-react"
import toast from "react-hot-toast"

interface BusinessSettings {
  name: string
  tagline: string
  email: string
  phone: string
  whatsapp: string
  instagram: string
  address: string
  operatingHours: string
}

interface NotificationSettings {
  emailOnNewBooking: boolean
  emailOnStatusChange: boolean
  whatsappReminder: boolean
}

interface AppearanceSettings {
  primaryColor: string
  showPricing: boolean
  maintenanceMode: boolean
}

export default function SettingsPage() {
  const [business, setBusiness] = useState<BusinessSettings>({
    name: "PHOTOIZZM Photography",
    tagline: "Convocation Photography Specialist",
    email: "hello@photoizzm.com",
    phone: "+60 12-345 6789",
    whatsapp: "+60 12-345 6789",
    instagram: "@photoizzm",
    address: "Puncak Alam, Selangor",
    operatingHours: "Monday – Saturday, 9:00am – 6:00pm",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailOnNewBooking: true,
    emailOnStatusChange: true,
    whatsappReminder: false,
  })

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    primaryColor: "warm-cream",
    showPricing: true,
    maintenanceMode: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSaving(false)
    toast.success("Settings saved successfully!")
  }

  const updateBusiness = (key: keyof BusinessSettings, value: string) => {
    setBusiness((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-black text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure business information and application
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-foreground text-primary-foreground hover:bg-foreground/80"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Info */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <Camera className="h-4 w-4 text-accent" />
            <h2 className="font-serif text-base font-bold text-foreground">Business Information</h2>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <Field label="Business Name">
              <Input
                value={business.name}
                onChange={(e) => updateBusiness("name", e.target.value)}
              />
            </Field>
            <Field label="Tagline">
              <Input
                value={business.tagline}
                onChange={(e) => updateBusiness("tagline", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={business.email}
                    onChange={(e) => updateBusiness("email", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={business.phone}
                    onChange={(e) => updateBusiness("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={business.whatsapp}
                    onChange={(e) => updateBusiness("whatsapp", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Field>
              <Field label="Instagram">
                <div className="relative">
                  <Instagram className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={business.instagram}
                    onChange={(e) => updateBusiness("instagram", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Field>
            </div>
            <Field label="Address">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  value={business.address}
                  onChange={(e) => updateBusiness("address", e.target.value)}
                  className="pl-10 resize-none"
                  rows={2}
                />
              </div>
            </Field>
            <Field label="Operating Hours">
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={business.operatingHours}
                  onChange={(e) => updateBusiness("operatingHours", e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Notifications */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Bell className="h-4 w-4 text-accent" />
              <h2 className="font-serif text-base font-bold text-foreground">Notifications</h2>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <ToggleRow
                label="New booking email"
                description="Receive an email when a new booking is made"
                checked={notifications.emailOnNewBooking}
                onChange={(v) => setNotifications((p) => ({ ...p, emailOnNewBooking: v }))}
              />
              <ToggleRow
                label="Status change email"
                description="Receive an email when a booking status changes"
                checked={notifications.emailOnStatusChange}
                onChange={(v) => setNotifications((p) => ({ ...p, emailOnStatusChange: v }))}
              />
              <ToggleRow
                label="WhatsApp reminder"
                description="Send reminders to customers via WhatsApp"
                checked={notifications.whatsappReminder}
                onChange={(v) => setNotifications((p) => ({ ...p, whatsappReminder: v }))}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Palette className="h-4 w-4 text-accent" />
              <h2 className="font-serif text-base font-bold text-foreground">Appearance</h2>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <Field label="Color Theme">
                <select
                  value={appearance.primaryColor}
                  onChange={(e) => setAppearance((p) => ({ ...p, primaryColor: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="warm-cream">Warm Cream (Original)</option>
                  <option value="ocean-blue">Ocean Blue</option>
                  <option value="forest-green">Forest Green</option>
                  <option value="royal-purple">Royal Purple</option>
                </select>
              </Field>
              <ToggleRow
                label="Show pricing"
                description="Display package prices on the booking form"
                checked={appearance.showPricing}
                onChange={(v) => setAppearance((p) => ({ ...p, showPricing: v }))}
              />
              <ToggleRow
                label="Maintenance mode"
                description="Redirect customers to the maintenance page"
                checked={appearance.maintenanceMode}
                onChange={(v) => setAppearance((p) => ({ ...p, maintenanceMode: v }))}
              />
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Shield className="h-4 w-4 text-accent" />
              <h2 className="font-serif text-base font-bold text-foreground">Security</h2>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <Field label="Current Password">
                <Input type="password" placeholder="••••••••" />
              </Field>
              <Field label="New Password">
                <Input type="password" placeholder="Enter new password" />
              </Field>
              <Field label="Confirm Password">
                <Input type="password" placeholder="Re-enter password" />
              </Field>
              <Button variant="outline" className="rounded-xl w-fit">
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─── */

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-foreground" : "bg-secondary"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}
