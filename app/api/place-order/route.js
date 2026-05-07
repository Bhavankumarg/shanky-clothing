import { NextResponse } from 'next/server'
import { isVerified } from '@/lib/otp'
import { sendEmail } from '@/lib/email'
import { renderOrderEmail } from '@/lib/orderEmail'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const { email, items, address, payment, totals } = body || {}

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
  }
  if (!isVerified(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please verify your email before placing the order.' },
      { status: 401 }
    )
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false, error: 'Your bag is empty.' }, { status: 400 })
  }
  if (!address?.fullName || !address?.address || !address?.city || !address?.pincode) {
    return NextResponse.json({ ok: false, error: 'Address is incomplete.' }, { status: 400 })
  }

  const orderId = 'SHK-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  const today = new Date()
  const eta = new Date(today.getTime() + 5 * 86400000)
  const fmtDate = (d) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const etaText = `${fmtDate(today)} – ${fmtDate(eta)}`

  const html = renderOrderEmail({
    orderId,
    items,
    address,
    payment: payment || 'Online',
    totals: {
      subtotal: Number(totals?.subtotal || 0),
      shipping: Number(totals?.shipping || 0),
      total: Number(totals?.total || 0),
    },
    etaText,
  })

  const result = await sendEmail({
    to: email,
    subject: `Your Shanky order ${orderId} is confirmed ✦`,
    html,
    text: `Your Shanky order ${orderId} has been confirmed. Total: ₹${totals?.total}. Estimated delivery: ${etaText}.`,
  })

  if (!result.ok) {
    // Order is still placed even if mailer fails — we just surface the warning.
    return NextResponse.json({
      ok: true,
      orderId,
      emailSent: false,
      warning: result.error || 'Email could not be sent.',
    })
  }

  return NextResponse.json({ ok: true, orderId, emailSent: true, dev: !!result.dev })
}
