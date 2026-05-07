import { NextResponse } from 'next/server'
import { issueOtp } from '@/lib/otp'
import { sendEmail } from '@/lib/email'
import { renderOtpEmail } from '@/lib/orderEmail'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  const email = String(body?.email || '').trim()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 })
  }

  const code = issueOtp(email)
  const result = await sendEmail({
    to: email,
    subject: `Your Shanky verification code · ${code}`,
    html: renderOtpEmail(code),
    text: `Your Shanky verification code is ${code}. It expires in 10 minutes.`,
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 })
  }

  // In dev mode (no RESEND_API_KEY), surface the code so the user can test the flow.
  return NextResponse.json({ ok: true, dev: !!result.dev, devCode: result.dev ? code : undefined })
}
