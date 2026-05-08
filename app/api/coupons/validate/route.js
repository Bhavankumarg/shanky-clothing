import { NextResponse } from 'next/server'
import { findCoupon } from '@/lib/couponStore'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  const { code, subtotal } = body || {}
  const coupon = await findCoupon(code)
  if (!coupon || !coupon.active) {
    return NextResponse.json({ ok: false, error: 'Code not recognised.' }, { status: 404 })
  }
  if (Number(subtotal || 0) < coupon.minSubtotal) {
    return NextResponse.json(
      { ok: false, error: `Spend ₹${coupon.minSubtotal} to use ${coupon.code}.` },
      { status: 400 }
    )
  }
  return NextResponse.json({ ok: true, coupon })
}
