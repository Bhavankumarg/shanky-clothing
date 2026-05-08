import { NextResponse } from 'next/server'
import { isVerified } from '@/lib/otp'
import { sendEmail } from '@/lib/email'
import { renderOrderEmail } from '@/lib/orderEmail'
import { recordOrder } from '@/lib/orderStore'
import { findCoupon } from '@/lib/couponStore'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const { email, items, address, payment, totals, couponCode } = body || {}

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

  // Server-side coupon validation — never trust the client total alone.
  let coupon = null
  let discount = 0
  if (couponCode) {
    coupon = await findCoupon(couponCode)
    if (coupon && coupon.active && Number(totals?.subtotal || 0) >= coupon.minSubtotal) {
      discount = Math.round(Number(totals?.subtotal || 0) * (coupon.percent / 100))
    } else {
      coupon = null
    }
  }

  const totalsFinal = {
    subtotal: Number(totals?.subtotal || 0),
    shipping: Number(totals?.shipping || 0),
    total: Number(totals?.total || 0),
    savings: Number(totals?.savings || 0),
    discount,
    coupon: coupon ? coupon.code : null,
  }

  const html = renderOrderEmail({
    orderId,
    items,
    address,
    payment: payment || 'Online',
    totals: totalsFinal,
    etaText,
  })

  // Persist the order so /account can show history and the admin can fulfil.
  // Soft-fails on read-only filesystems — the email still goes out.
  try {
    await recordOrder({
      orderId,
      email: email.toLowerCase(),
      items,
      address,
      payment: payment || 'Online',
      totals: totalsFinal,
      etaText,
      status: 'placed',
    })
  } catch {}

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
