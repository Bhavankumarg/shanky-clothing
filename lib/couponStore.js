// Server-side coupon store. Replaces the hardcoded codes in app/cart/page.jsx.
// Persists to data/coupons.json with the same read-only-FS fallback pattern as
// productStore / themeStore.

import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'coupons.json')

const READ_ONLY_FS =
  process.env.VERCEL === '1' ||
  process.env.AWS_EXECUTION_ENV != null ||
  process.env.READ_ONLY_FS === '1'

const SEED = [
  {
    code: 'VOID10',
    percent: 10,
    description: '10% off · sitewide',
    active: true,
    minSubtotal: 0,
  },
  {
    code: 'FIRST15',
    percent: 15,
    description: '15% off your first order',
    active: true,
    minSubtotal: 0,
  },
]

let memoryCache = null

function normalize(input) {
  return {
    code: String(input.code || '').trim().toUpperCase(),
    percent: Math.max(0, Math.min(90, Number(input.percent) || 0)),
    description: String(input.description || '').trim(),
    active: input.active !== false,
    minSubtotal: Math.max(0, Number(input.minSubtotal) || 0),
  }
}

async function tryReadFile() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data?.coupons) ? data.coupons.map(normalize) : null
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
      await fs.writeFile(DB_FILE, JSON.stringify({ coupons: SEED }, null, 2), 'utf-8')
    }
    return true
  } catch {
    return false
  }
}

async function readAll() {
  let coupons = await tryReadFile()
  if (coupons) return coupons
  await tryEnsureFile()
  coupons = await tryReadFile()
  if (coupons) return coupons
  if (!memoryCache) memoryCache = SEED.map(normalize)
  return memoryCache
}

async function writeAll(coupons) {
  memoryCache = coupons
  if (READ_ONLY_FS) {
    throw new Error('Read-only filesystem — coupon changes only persist locally.')
  }
  const ok = await tryEnsureFile()
  if (!ok) throw new Error('Filesystem is read-only — cannot persist coupons.')
  await fs.writeFile(DB_FILE, JSON.stringify({ coupons }, null, 2), 'utf-8')
}

export async function getAllCoupons() {
  return readAll()
}

export async function getActiveCoupons() {
  const all = await readAll()
  return all.filter((c) => c.active)
}

export async function findCoupon(code) {
  const all = await readAll()
  const norm = String(code || '').trim().toUpperCase()
  return all.find((c) => c.code === norm) || null
}

export async function upsertCoupon(input) {
  const c = normalize(input)
  if (!c.code) throw new Error('Code is required')
  if (!c.percent) throw new Error('Percent must be > 0')
  const all = await readAll()
  const idx = all.findIndex((x) => x.code === c.code)
  const next = [...all]
  if (idx === -1) next.unshift(c)
  else next[idx] = c
  await writeAll(next)
  return c
}

export async function deleteCoupon(code) {
  const norm = String(code || '').trim().toUpperCase()
  const all = await readAll()
  const next = all.filter((c) => c.code !== norm)
  if (next.length === all.length) throw new Error('Coupon not found')
  await writeAll(next)
}
