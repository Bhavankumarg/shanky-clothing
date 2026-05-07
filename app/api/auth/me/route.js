import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/userAuth'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json({ ok: true, user })
}
