// Order store — Postgres (Supabase) via Drizzle.

import { eq, desc, sql } from 'drizzle-orm'
import { getDb } from './db.js'
import { orders } from './schema.js'

function fromRow(row) {
  if (!row) return null
  return {
    orderId: row.orderId,
    email: row.email,
    items: row.items || [],
    address: row.address || {},
    payment: row.payment || 'Online',
    totals: row.totals || {},
    etaText: row.etaText || '',
    status: row.status || 'placed',
    createdAt: Number(row.createdAt) || Date.now(),
    updatedAt: row.updatedAt ? Number(row.updatedAt) : null,
  }
}

export async function recordOrder(order) {
  const db = getDb()
  const now = Date.now()
  const row = {
    orderId: order.orderId,
    email: (order.email || '').toLowerCase(),
    items: order.items || [],
    address: order.address || {},
    payment: order.payment || 'Online',
    totals: order.totals || {},
    etaText: order.etaText || '',
    status: order.status || 'placed',
    createdAt: order.createdAt || now,
    updatedAt: null,
  }
  const [inserted] = await db.insert(orders).values(row).returning()
  return fromRow(inserted)
}

export async function getOrdersByEmail(email) {
  if (!email) return []
  const db = getDb()
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.email, email.toLowerCase()))
    .orderBy(desc(orders.createdAt))
  return rows.map(fromRow)
}

export async function getAllOrders() {
  const db = getDb()
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  return rows.map(fromRow)
}

export async function getOrder(orderId) {
  const db = getDb()
  const [row] = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1)
  return fromRow(row)
}

export async function updateOrderStatus(orderId, status) {
  const db = getDb()
  const [row] = await db
    .update(orders)
    .set({ status, updatedAt: Date.now() })
    .where(eq(orders.orderId, orderId))
    .returning()
  if (!row) throw new Error('Order not found')
  return fromRow(row)
}

export async function getOrderCount() {
  const db = getDb()
  const [r] = await db.select({ n: sql`count(*)::int` }).from(orders)
  return r?.n || 0
}
