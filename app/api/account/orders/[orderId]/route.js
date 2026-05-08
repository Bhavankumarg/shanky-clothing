import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/userAuth'
import { getOrder } from '@/lib/orderStore'

export const runtime = 'nodejs'

export async function GET(_req, { params }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const order = await getOrder(params.orderId)
  if (!order) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  if ((order.email || '').toLowerCase() !== (user.email || '').toLowerCase()) {
    return NextResponse.json({ ok: false, error: 'Not your order' }, { status: 403 })
  }
  return NextResponse.json({ ok: true, order })
}
