// Simple HMAC-signed cookie auth for the admin panel.
// Configure via env: ADMIN_PASSWORD (default 'shanky2025'),
// ADMIN_SECRET (default 'shanky-admin-secret-change-me').

import crypto from 'crypto'
import { cookies } from 'next/headers'

const PASSWORD = process.env.ADMIN_PASSWORD || 'shanky2025'
const SECRET = process.env.ADMIN_SECRET || 'shanky-admin-secret-change-me'
const TTL = 7 * 24 * 60 * 60 * 1000 // 7 days
export const ADMIN_COOKIE = 'shanky_admin'

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(String(value)).digest('hex')
}

export function checkPassword(input) {
  return String(input || '') === PASSWORD
}

export function makeToken() {
  const expires = Date.now() + TTL
  return `${expires}.${sign(expires)}`
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false
  const [expiresStr, hmac] = token.split('.')
  if (!expiresStr || !hmac) return false
  const expires = Number(expiresStr)
  if (!expires || Date.now() > expires) return false
  const expected = sign(expiresStr)
  // Constant-time compare
  if (expected.length !== hmac.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ hmac.charCodeAt(i)
  return diff === 0
}

export function isAdmin() {
  const c = cookies()
  const token = c.get(ADMIN_COOKIE)?.value
  return verifyToken(token)
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(TTL / 1000),
  }
}
