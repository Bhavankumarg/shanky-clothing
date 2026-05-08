import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/userAuth'
import { getOrdersByEmail } from '@/lib/orderStore'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const orders = await getOrdersByEmail(user.email)
  return NextResponse.json({ ok: true, orders })
}
