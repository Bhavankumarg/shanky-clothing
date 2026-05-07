import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkPassword, makeToken, ADMIN_COOKIE, cookieOptions } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
  const password = String(body?.password || '')
  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: 'Wrong password' }, { status: 401 })
  }
  const token = makeToken()
  const c = cookies()
  c.set(ADMIN_COOKIE, token, cookieOptions())
  return NextResponse.json({ ok: true })
}
