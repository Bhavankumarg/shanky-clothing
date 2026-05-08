import { NextResponse } from 'next/server'
import { razorpayConfigured, razorpayPublicKey } from '@/lib/razorpay'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    ok: true,
    enabled: true, // always advertise the option; demo mode handles missing keys
    configured: razorpayConfigured(),
    keyId: razorpayPublicKey() || null,
  })
}
