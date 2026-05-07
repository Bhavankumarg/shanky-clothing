import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { USER_COOKIE } from '@/lib/userAuth'

export const runtime = 'nodejs'

export async function POST() {
  cookies().set(USER_COOKIE, '', { path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
