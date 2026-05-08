import { NextResponse } from 'next/server'
import { createRazorpayOrder, razorpayPublicKey, razorpayConfigured } from '@/lib/razorpay'
import { isVerified } from '@/lib/otp'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  const { email, amount, items, address } = body || {}

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
  }
  // Reuse the same OTP gate the storefront uses for cash-on-delivery.
  if (!isVerified(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please verify your email before paying.' },
      { status: 401 }
    )
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false, error: 'Your bag is empty.' }, { status: 400 })
  }
  if (!address?.fullName || !address?.address || !address?.city || !address?.pincode) {
    return NextResponse.json({ ok: false, error: 'Address is incomplete.' }, { status: 400 })
  }

  try {
    const order = await createRazorpayOrder({
      amount,
      receipt: `shk-${Date.now().toString(36)}`,
      notes: { email, fullName: address.fullName },
    })
    return NextResponse.json({
      ok: true,
      order,
      keyId: razorpayPublicKey() || null,
      configured: razorpayConfigured(),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Could not create order.' }, { status: 502 })
  }
}
