"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const ADMIN_EMAIL = "admin@photoizzm.com"
const ADMIN_PASSWORD = "photoizzm@2026"
const SESSION_KEY = "photoizzm_admin_session"

const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? ""

interface AuthContextValue {
  isAuthenticated: boolean
  login: (email: string, password: string, turnstileToken?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === "true") setIsAuthenticated(true)
  }, [])

  const login = async (email: string, password: string, turnstileToken?: string) => {
    if (TURNSTILE_SECRET_KEY && turnstileToken) {
      try {
        const verifyRes = await fetch("/api/verify-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileToken }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.success) {
          return { success: false, error: "Verification failed. Please try again." }
        }
      } catch {
        return { success: false, error: "Verification failed. Please try again." }
      }
    }

    await new Promise((r) => setTimeout(r, 700))

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true")
      setIsAuthenticated(true)
      return { success: true }
    }

    return { success: false, error: "Invalid email or password." }
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider")
  return ctx
}
