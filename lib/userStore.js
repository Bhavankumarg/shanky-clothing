// Server-only user store. Passwords are hashed with scrypt + per-user salt.
// Same read-only-fs resilience pattern as productStore: tries to read/write
// data/users.json on disk, falls back to an in-memory cache when the disk
// is read-only (e.g. Vercel). Writes throw a clear error on read-only
// deployments so the auth API can surface a useful message.

import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'users.json')

const READ_ONLY_FS =
  process.env.VERCEL === '1' ||
  process.env.AWS_EXECUTION_ENV != null ||
  process.env.READ_ONLY_FS === '1'

let memoryCache = null

async function tryReadFile() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data?.users) ? data.users : null
  } catch {
    return null
  }
}

async function tryEnsureFile() {
  if (READ_ONLY_FS) return false
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    try {
      await fs.access(DB_FILE)
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify({ users: [] }, null, 2), 'utf-8')
    }
    return true
  } catch {
    return false
  }
}

async function readAll() {
  let users = await tryReadFile()
  if (users) return users
  await tryEnsureFile()
  users = await tryReadFile()
  if (users) return users
  if (!memoryCache) memoryCache = []
  return memoryCache
}

async function writeAll(users) {
  memoryCache = users
  if (READ_ONLY_FS) {
    throw new Error(
      'Read-only filesystem on this deployment — accounts cannot be created here. ' +
      'Run locally and commit data/users.json, or wire up a database.'
    )
  }
  const ok = await tryEnsureFile()
  if (!ok) throw new Error('Filesystem is read-only — cannot persist users.')
  await fs.writeFile(DB_FILE, JSON.stringify({ users }, null, 2), 'utf-8')
}

// ── PASSWORD HASHING (scrypt, no external deps) ───────────────────────────────

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false
  const [salt, hash] = stored.split(':')
  const candidate = crypto.scryptSync(String(password), salt, 64).toString('hex')
  // Constant-time compare
  if (candidate.length !== hash.length) return false
  let diff = 0
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i)
  }
  return diff === 0
}

const normEmail = (e) => String(e || '').trim().toLowerCase()

const isValidEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)

// ── PUBLIC API ───────────────────────────────────────────────────────────────

export async function findUserByEmail(email) {
  const e = normEmail(email)
  const users = await readAll()
  return users.find((u) => u.email === e) || null
}

export async function findUserById(id) {
  if (!id) return null
  const users = await readAll()
  return users.find((u) => u.id === id) || null
}

export async function createUser({ email, name, password }) {
  const e = normEmail(email)
  if (!isValidEmail(e)) throw new Error('Please enter a valid email.')
  if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.')

  const users = await readAll()
  if (users.some((u) => u.email === e)) {
    throw new Error('An account with this email already exists.')
  }

  const user = {
    id: 'usr_' + crypto.randomBytes(8).toString('hex'),
    email: e,
    name: String(name || '').trim() || e.split('@')[0],
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  await writeAll([...users, user])
  return publicUser(user)
}

export async function authenticate(email, password) {
  const u = await findUserByEmail(email)
  if (!u) return null
  if (!verifyPassword(password, u.passwordHash)) return null
  return publicUser(u)
}

// Strip secrets before returning to the wire.
export function publicUser(u) {
  if (!u) return null
  const { passwordHash, ...rest } = u
  return rest
}

// ── ADDRESSES ────────────────────────────────────────────────────────────────
// Addresses live on the user record so they never leak across accounts and
// reuse the existing read-only-FS fallbacks.

export async function getAddresses(userId) {
  const u = await findUserById(userId)
  return Array.isArray(u?.addresses) ? u.addresses : []
}

export async function addAddress(userId, address) {
  const users = await readAll()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) throw new Error('User not found')
  const list = Array.isArray(users[idx].addresses) ? [...users[idx].addresses] : []
  const entry = {
    id: 'adr_' + crypto.randomBytes(6).toString('hex'),
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
  list.unshift(entry)
  const next = [...users]
  next[idx] = { ...users[idx], addresses: list }
  await writeAll(next)
  return entry
}

export async function removeAddress(userId, addressId) {
  const users = await readAll()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) throw new Error('User not found')
  const list = (users[idx].addresses || []).filter((a) => a.id !== addressId)
  const next = [...users]
  next[idx] = { ...users[idx], addresses: list }
  await writeAll(next)
}
