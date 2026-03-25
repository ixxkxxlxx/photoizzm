"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Camera, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) { setError("Please enter your email."); return }
    if (!password.trim()) { setError("Please enter your password."); return }

    setIsLoading(true)
    const result = await login(email.trim(), password)
    setIsLoading(false)

    if (result.success) {
      router.replace("/admin")
    } else {
      setError(result.error ?? "Login failed.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.18 0.01 60) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">

          {/* Brand mark */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground shadow-md">
              <Camera className="h-7 w-7 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-black tracking-tight text-foreground">
                PHOTOIZZM
              </h1>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="font-serif text-xl font-bold text-foreground">Login</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your admin credentials to continue.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
            >
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError("") }}
                  placeholder="admin@photoizzm.com"
                  className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError("") }}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground font-semibold text-primary-foreground shadow-sm transition-all hover:bg-foreground/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PHOTOIZZM Photography. All rights reserved.
        </p>
      </div>
    </div>
  )
}
