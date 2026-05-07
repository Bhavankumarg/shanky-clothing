// HMAC-signed session cookies for shoppers. Same pattern as lib/auth.js
// (admin) but the token also embeds the userId so we can resolve the
// current user on every request without server-side session state.

import crypto from 'crypto'
import { cookies } from 'next/headers'
import { findUserById, publicUser } from './userStore'

const SECRET = process.env.USER_SECRET || process.env.ADMIN_SECRET || 'shanky-user-secret-change-me'
const TTL = 30 * 24 * 60 * 60 * 1000 // 30 days
export const USER_COOKIE = 'shanky_user'

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(String(value)).digest('hex')
}

export function makeUserToken(userId) {
  const expires = Date.now() + TTL
  const payload = `${userId}.${expires}`
  return `${payload}.${sign(payload)}`
}

export function verifyUserToken(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [userId, expiresStr, hmac] = parts
  if (!userId || !expiresStr || !hmac) return null
  const expires = Number(expiresStr)
  if (!expires || Date.now() > expires) return null
  const expected = sign(`${userId}.${expiresStr}`)
  if (expected.length !== hmac.length) return null
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ hmac.charCodeAt(i)
  }
  return diff === 0 ? userId : null
}

export async function getCurrentUser() {
  const c = cookies()
  const token = c.get(USER_COOKIE)?.value
  const userId = verifyUserToken(token)
  if (!userId) return null
  const user = await findUserById(userId)
  return publicUser(user)
}

export function userCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(TTL / 1000),
  }
}
