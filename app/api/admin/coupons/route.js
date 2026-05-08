import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { getAllCoupons, upsertCoupon, deleteCoupon } from '@/lib/couponStore'

export const runtime = 'nodejs'

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const coupons = await getAllCoupons()
  return NextResponse.json({ ok: true, coupons })
}

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  try {
    const c = await upsertCoupon(body)
    return NextResponse.json({ ok: true, coupon: c })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to save' }, { status: 400 })
  }
}

export async function DELETE(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ ok: false, error: 'code is required' }, { status: 400 })
  try {
    await deleteCoupon(code)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
