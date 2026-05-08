import { NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  const { orderId, paymentId, signature } = body || {}
  const valid = verifyRazorpaySignature({ orderId, paymentId, signature })
  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Signature verification failed.' }, { status: 400 })
  }
  return NextResponse.json({ ok: true, paymentId, orderId })
}
