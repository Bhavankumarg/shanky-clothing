// Coupon store — Postgres (Supabase) via Drizzle.

import { eq, desc } from 'drizzle-orm'
import { getDb } from './db.js'
import { coupons } from './schema.js'

function normalize(input) {
  return {
    code: String(input.code || '').trim().toUpperCase(),
    percent: Math.max(0, Math.min(90, Number(input.percent) || 0)),
    description: String(input.description || '').trim(),
    active: input.active !== false,
    minSubtotal: Math.max(0, Number(input.minSubtotal) || 0),
  }
}

export async function getAllCoupons() {
  const db = getDb()
  return db.select().from(coupons).orderBy(desc(coupons.code))
}

export async function getActiveCoupons() {
  const db = getDb()
  return db.select().from(coupons).where(eq(coupons.active, true)).orderBy(desc(coupons.code))
}

export async function findCoupon(code) {
  if (!code) return null
  const db = getDb()
  const norm = String(code).trim().toUpperCase()
  const [row] = await db.select().from(coupons).where(eq(coupons.code, norm)).limit(1)
  return row || null
}

export async function upsertCoupon(input) {
  const c = normalize(input)
  if (!c.code) throw new Error('Code is required')
  if (!c.percent) throw new Error('Percent must be > 0')

  const db = getDb()
  const [row] = await db
    .insert(coupons)
    .values(c)
    .onConflictDoUpdate({
      target: coupons.code,
      set: {
        percent: c.percent,
        description: c.description,
        active: c.active,
        minSubtotal: c.minSubtotal,
      },
    })
    .returning()
  return row
}

export async function deleteCoupon(code) {
  const db = getDb()
  const norm = String(code || '').trim().toUpperCase()
  const result = await db.delete(coupons).where(eq(coupons.code, norm)).returning({ code: coupons.code })
  if (result.length === 0) throw new Error('Coupon not found')
}
