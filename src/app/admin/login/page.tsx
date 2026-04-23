"use client"

import { useState, type FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth"

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        "error-callback"?: () => void
        "expired-callback"?: () => void
        theme?: string
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ""
const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? ""

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileError, setTurnstileError] = useState("")
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string>("")

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || process.env.NODE_ENV === "development") return

    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token)
            setTurnstileError("")
          },
          "error-callback": () => {
            setTurnstileError("Turnstile verification failed.")
          },
          "expired-callback": () => {
            setTurnstileToken("")
          },
          theme: "light",
        })
      }
    }

    // Reuse existing script tag if already injected (prevents double-append in React Strict Mode)
    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    )
    if (existingScript) {
      // Script already loaded — render immediately if API ready
      if (window.turnstile) renderWidget()
      else existingScript.addEventListener("load", renderWidget)
    } else {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      script.onload = renderWidget
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = ""
      }
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) { setError("Please enter your email."); return }
    if (!password.trim()) { setError("Please enter your password."); return }
    if (TURNSTILE_SITE_KEY && process.env.NODE_ENV !== "development" && !turnstileToken) {
      setTurnstileError("Please complete the verification.")
      return
    }

    setIsLoading(true)
    const result = await login(email.trim(), password, turnstileToken)
    setIsLoading(false)

    if (result.success) {
      router.replace("/admin")
    } else {
      setError(result.error ?? "Login failed.")
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken("")
      }
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
              <img
                src="/logo.jpg"
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
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
                  placeholder="email@example.com"
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

            {/* Turnstile */}
            {TURNSTILE_SITE_KEY && (
              <div className="flex flex-col gap-1.5">
                <div ref={turnstileRef} className="flex justify-start" />
                {turnstileError && (
                  <p className="text-xs text-destructive">{turnstileError}</p>
                )}
              </div>
            )}

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
