import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { token } = await request.json()
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY

  if (!secretKey) {
    return NextResponse.json({ success: false, error: "Turnstile not configured" })
  }

  if (!token) {
    return NextResponse.json({ success: false, error: "Token missing" })
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    })
    const data = await res.json()
    return NextResponse.json({ success: data.success })
  } catch {
    return NextResponse.json({ success: false, error: "Verification request failed" })
  }
}
