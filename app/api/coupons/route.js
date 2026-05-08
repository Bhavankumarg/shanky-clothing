import { NextResponse } from 'next/server'
import { getActiveCoupons } from '@/lib/couponStore'

export const runtime = 'nodejs'

export async function GET() {
  const coupons = await getActiveCoupons()
  return NextResponse.json({ ok: true, coupons })
}
