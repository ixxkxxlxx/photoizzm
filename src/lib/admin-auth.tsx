"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const ADMIN_EMAIL = "admin@photoizzm.com"
const ADMIN_PASSWORD = "photoizzm@2026"
const SESSION_KEY = "photoizzm_admin_session"

interface AuthContextValue {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === "true") setIsAuthenticated(true)
  }, [])

  const login = async (email: string, password: string) => {
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
