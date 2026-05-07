import { NextResponse } from 'next/server'
import { verifyOtp, markVerified } from '@/lib/otp'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  const email = String(body?.email || '').trim()
  const code = String(body?.code || '').trim()
  if (!email || !code) {
    return NextResponse.json({ ok: false, error: 'Email and code are required.' }, { status: 400 })
  }
  const result = verifyOtp(email, code)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 401 })
  }
  markVerified(email)
  return NextResponse.json({ ok: true })
}
