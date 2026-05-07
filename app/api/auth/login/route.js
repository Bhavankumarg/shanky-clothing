import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authenticate } from '@/lib/userStore'
import { makeUserToken, USER_COOKIE, userCookieOptions } from '@/lib/userAuth'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
  const user = await authenticate(body?.email, body?.password)
  if (!user) {
    // Slight delay to soften brute force
    await new Promise((r) => setTimeout(r, 350))
    return NextResponse.json({ ok: false, error: 'Wrong email or password.' }, { status: 401 })
  }
  const token = makeUserToken(user.id)
  cookies().set(USER_COOKIE, token, userCookieOptions())
  return NextResponse.json({ ok: true, user })
}
