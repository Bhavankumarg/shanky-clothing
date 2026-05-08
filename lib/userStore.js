// User + address store — Postgres (Supabase) via Drizzle. Same public API
// as the JSON-on-disk version. scrypt password hashing is unchanged.

import crypto from 'crypto'
import { and, eq, desc } from 'drizzle-orm'
import { getDb } from './db.js'
import { users, addresses } from './schema.js'

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false
  const [salt, hash] = stored.split(':')
  const candidate = crypto.scryptSync(String(password), salt, 64).toString('hex')
  if (candidate.length !== hash.length) return false
  let diff = 0
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i)
  }
  return diff === 0
}

const normEmail = (e) => String(e || '').trim().toLowerCase()
const isValidEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)

export async function findUserByEmail(email) {
  const db = getDb()
  const e = normEmail(email)
  const [row] = await db.select().from(users).where(eq(users.email, e)).limit(1)
  return row || null
}

export async function findUserById(id) {
  if (!id) return null
  const db = getDb()
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return row || null
}

export async function createUser({ email, name, password }) {
  const e = normEmail(email)
  if (!isValidEmail(e)) throw new Error('Please enter a valid email.')
  if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.')

  const db = getDb()
  const existing = await findUserByEmail(e)
  if (existing) throw new Error('An account with this email already exists.')

  const user = {
    id: 'usr_' + crypto.randomBytes(8).toString('hex'),
    email: e,
    name: String(name || '').trim() || e.split('@')[0],
    passwordHash: hashPassword(password),
  }
  const [inserted] = await db.insert(users).values(user).returning()
  return publicUser(inserted)
}

export async function authenticate(email, password) {
  const u = await findUserByEmail(email)
  if (!u) return null
  if (!verifyPassword(password, u.passwordHash)) return null
  return publicUser(u)
}

export function publicUser(u) {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return rest
}

export async function getAddresses(userId) {
  if (!userId) return []
  const db = getDb()
  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.createdAt))
  return rows
}

export async function addAddress(userId, address) {
  const db = getDb()
  const u = await findUserById(userId)
  if (!u) throw new Error('User not found')

  const entry = {
    id: 'adr_' + crypto.randomBytes(6).toString('hex'),
    userId,
    fullName: String(address.fullName || '').trim(),
    phone: String(address.phone || '').trim(),
    address: String(address.address || '').trim(),
    address2: String(address.address2 || '').trim(),
    city: String(address.city || '').trim(),
    state: String(address.state || '').trim(),
    pincode: String(address.pincode || '').trim(),
    label: String(address.label || 'Home').trim(),
    createdAt: Date.now(),
  }
  const [inserted] = await db.insert(addresses).values(entry).returning()
  return inserted
}

export async function removeAddress(userId, addressId) {
  const db = getDb()
  await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
}
