import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createUser } from '@/lib/userStore'
import { makeUserToken, USER_COOKIE, userCookieOptions } from '@/lib/userAuth'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
  try {
    const user = await createUser({
      email: body?.email,
      name: body?.name,
      password: body?.password,
    })
    const token = makeUserToken(user.id)
    cookies().set(USER_COOKIE, token, userCookieOptions())
    return NextResponse.json({ ok: true, user })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Signup failed' }, { status: 400 })
  }
}
