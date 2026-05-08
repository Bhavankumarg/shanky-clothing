import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { getAllOrders, updateOrderStatus } from '@/lib/orderStore'

export const runtime = 'nodejs'

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const orders = await getAllOrders()
  return NextResponse.json({ ok: true, orders })
}

export async function PATCH(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  const { orderId, status } = body || {}
  if (!orderId || !status) {
    return NextResponse.json({ ok: false, error: 'orderId and status are required' }, { status: 400 })
  }
  try {
    const updated = await updateOrderStatus(orderId, status)
    return NextResponse.json({ ok: true, order: updated })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
