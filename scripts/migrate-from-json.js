// One-shot migration: data/*.json + public/uploads/* → Supabase Postgres + Storage.
//
// Usage:
//   1. Apply scripts/schema.sql in the Supabase SQL editor.
//   2. Set DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.
//   3. Make sure the storage bucket exists (default name "shanky", public).
//   4. node scripts/migrate-from-json.js
//
// Idempotent: re-running upserts products/coupons/theme, skips already-seen
// users/addresses/orders.

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import * as schema from '../lib/schema.js'
import { products as seedProducts } from '../lib/products.js'
import { DEFAULT_THEME } from '../lib/themeStore.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, 'data')
const UPLOADS = path.join(ROOT, 'public', 'uploads')

// Pull env from .env if not already present.
try {
  const env = await fs.readFile(path.join(ROOT, '.env'), 'utf-8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const need = (k) => {
  const v = process.env[k]
  if (!v) {
    console.error(`Missing env var: ${k}`)
    process.exit(1)
  }
  return v
}

const DATABASE_URL = need('DATABASE_URL')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'shanky'

const sqlClient = postgres(DATABASE_URL, { prepare: false, max: 5 })
const db = drizzle(sqlClient, { schema })
const storage =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf-8')) } catch { return fallback }
}

async function uploadLocalImages(productList) {
  const map = new Map()
  if (!storage) return map
  const localUrls = new Set()
  for (const p of productList) {
    for (const u of p.images || []) {
      if (typeof u === 'string' && u.startsWith('/uploads/')) localUrls.add(u)
    }
  }
  if (localUrls.size === 0) return map
  console.log(`→ uploading ${localUrls.size} image(s) to bucket "${BUCKET}"`)
  for (const localUrl of localUrls) {
    const fname = localUrl.replace(/^\/uploads\//, '')
    const filePath = path.join(UPLOADS, fname)
    let buf
    try { buf = await fs.readFile(filePath) } catch {
      console.warn(`!  Skipping missing file ${filePath}`)
      continue
    }
    const ext = (fname.split('.').pop() || 'bin').toLowerCase()
    const contentType =
      { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' }[ext] ||
      'application/octet-stream'
    const dest = `products/migrated-${fname}`
    const { error } = await storage.storage.from(BUCKET).upload(dest, buf, {
      contentType, cacheControl: '31536000', upsert: true,
    })
    if (error) { console.warn(`!  Upload failed for ${fname}: ${error.message}`); continue }
    const { data } = storage.storage.from(BUCKET).getPublicUrl(dest)
    map.set(localUrl, data.publicUrl)
  }
  return map
}

async function migrateProducts() {
  const onDisk = await readJson(path.join(DATA, 'products.json'), null)
  const list = onDisk?.products || seedProducts
  console.log(`→ products: ${list.length}`)
  const localImageMap = await uploadLocalImages(list)
  for (const p of list) {
    const images = (p.images || []).map((u) => localImageMap.get(u) || u)
    const row = {
      slug: p.slug,
      name: p.name,
      price: Number(p.price) || 0,
      originalPrice: p.originalPrice && Number(p.originalPrice) > Number(p.price) ? Number(p.originalPrice) : null,
      category: p.category || 'Outerwear',
      gender: p.gender || 'Men',
      badge: p.badge || null,
      colors: p.colors || [],
      sizes: p.sizes || [],
      material: p.material || '',
      care: p.care || '',
      description: p.description || '',
      images,
    }
    await db.insert(schema.products).values(row).onConflictDoUpdate({
      target: schema.products.slug,
      set: {
        name: row.name, price: row.price, originalPrice: row.originalPrice,
        category: row.category, badge: row.badge,
        colors: row.colors, sizes: row.sizes,
        material: row.material, care: row.care, description: row.description, images: row.images,
      },
    })
  }
}

async function migrateUsers() {
  const onDisk = await readJson(path.join(DATA, 'users.json'), { users: [] })
  const list = onDisk.users || []
  console.log(`→ users: ${list.length}`)
  for (const u of list) {
    await db.insert(schema.users).values({
      id: u.id,
      email: u.email.toLowerCase(),
      name: u.name || u.email.split('@')[0],
      passwordHash: u.passwordHash,
      createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
    }).onConflictDoNothing()
    for (const a of u.addresses || []) {
      await db.insert(schema.addresses).values({
        id: a.id, userId: u.id,
        fullName: a.fullName || '', phone: a.phone || '',
        address: a.address || '', address2: a.address2 || '',
        city: a.city || '', state: a.state || '',
        pincode: a.pincode || '', label: a.label || 'Home',
        createdAt: Number(a.createdAt) || Date.now(),
      }).onConflictDoNothing()
    }
  }
}

async function migrateOrders() {
  const onDisk = await readJson(path.join(DATA, 'orders.json'), { orders: [] })
  const list = onDisk.orders || []
  console.log(`→ orders: ${list.length}`)
  for (const o of list) {
    await db.insert(schema.orders).values({
      orderId: o.orderId, email: (o.email || '').toLowerCase(),
      items: o.items || [], address: o.address || {},
      payment: o.payment || 'Online', totals: o.totals || {},
      etaText: o.etaText || '', status: o.status || 'placed',
      createdAt: Number(o.createdAt) || Date.now(),
      updatedAt: o.updatedAt ? Number(o.updatedAt) : null,
    }).onConflictDoNothing()
  }
}

async function migrateCoupons() {
  const onDisk = await readJson(path.join(DATA, 'coupons.json'), null)
  const list = onDisk?.coupons || [
    { code: 'VOID10', percent: 10, description: '10% off · sitewide', active: true, minSubtotal: 0 },
    { code: 'FIRST15', percent: 15, description: '15% off your first order', active: true, minSubtotal: 0 },
  ]
  console.log(`→ coupons: ${list.length}`)
  for (const c of list) {
    const row = {
      code: c.code.toUpperCase(),
      percent: Number(c.percent) || 0,
      description: c.description || '',
      active: c.active !== false,
      minSubtotal: Number(c.minSubtotal) || 0,
    }
    await db.insert(schema.coupons).values(row).onConflictDoUpdate({
      target: schema.coupons.code,
      set: { percent: row.percent, description: row.description, active: row.active, minSubtotal: row.minSubtotal },
    })
  }
}

async function migrateTheme() {
  const onDisk = await readJson(path.join(DATA, 'theme.json'), DEFAULT_THEME)
  console.log('→ theme: 1 row')
  const merged = { ...DEFAULT_THEME, ...onDisk }
  await db.insert(schema.theme).values({ id: 1, ...merged })
    .onConflictDoUpdate({ target: schema.theme.id, set: merged })
}

async function summary() {
  const counts = await Promise.all([
    db.execute(sql`SELECT COUNT(*)::int AS n FROM products`),
    db.execute(sql`SELECT COUNT(*)::int AS n FROM users`),
    db.execute(sql`SELECT COUNT(*)::int AS n FROM addresses`),
    db.execute(sql`SELECT COUNT(*)::int AS n FROM orders`),
    db.execute(sql`SELECT COUNT(*)::int AS n FROM coupons`),
    db.execute(sql`SELECT COUNT(*)::int AS n FROM theme`),
  ])
  console.log('\n── final counts ──')
  ;['products', 'users', 'addresses', 'orders', 'coupons', 'theme'].forEach((name, i) => {
    const row = counts[i].rows ? counts[i].rows[0] : counts[i][0]
    console.log(`   ${name.padEnd(10)} ${row?.n ?? '?'}`)
  })
}

async function main() {
  try {
    await migrateProducts()
    await migrateUsers()
    await migrateOrders()
    await migrateCoupons()
    await migrateTheme()
    await summary()
    console.log('\n✓ migration complete')
  } catch (e) {
    console.error('\n✗ migration failed:', e.message)
    process.exitCode = 1
  } finally {
    await sqlClient.end({ timeout: 5 })
  }
}

main()
