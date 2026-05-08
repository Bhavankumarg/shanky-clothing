// Server-side order persistence. The /api/place-order route was originally
// fire-and-forget — we now also write a record to data/orders.json so the
// account page can show order history and the admin can see fulfilment state.

import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'orders.json')

const READ_ONLY_FS =
  process.env.VERCEL === '1' ||
  process.env.AWS_EXECUTION_ENV != null ||
  process.env.READ_ONLY_FS === '1'

let memoryCache = null

async function tryReadFile() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data?.orders) ? data.orders : null
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
      await fs.writeFile(DB_FILE, JSON.stringify({ orders: [] }, null, 2), 'utf-8')
    }
    return true
  } catch {
    return false
  }
}

async function readAll() {
  let orders = await tryReadFile()
  if (orders) return orders
  await tryEnsureFile()
  orders = await tryReadFile()
  if (orders) return orders
  if (!memoryCache) memoryCache = []
  return memoryCache
}

async function writeAll(orders) {
  memoryCache = orders
  if (READ_ONLY_FS) {
    // Soft-fail — the order is still confirmed via email; we just lose history.
    return
  }
  const ok = await tryEnsureFile()
  if (!ok) return
  await fs.writeFile(DB_FILE, JSON.stringify({ orders }, null, 2), 'utf-8')
}

export async function recordOrder(order) {
  const all = await readAll()
  // Newest first.
  const next = [{ ...order, createdAt: order.createdAt || Date.now() }, ...all]
  await writeAll(next)
  return next[0]
}

export async function getOrdersByEmail(email) {
  if (!email) return []
  const all = await readAll()
  const e = email.toLowerCase()
  return all.filter((o) => (o.email || '').toLowerCase() === e)
}

export async function getAllOrders() {
  return readAll()
}

export async function getOrder(orderId) {
  const all = await readAll()
  return all.find((o) => o.orderId === orderId) || null
}

export async function updateOrderStatus(orderId, status) {
  const all = await readAll()
  const idx = all.findIndex((o) => o.orderId === orderId)
  if (idx === -1) throw new Error('Order not found')
  const next = [...all]
  next[idx] = { ...next[idx], status, updatedAt: Date.now() }
  await writeAll(next)
  return next[idx]
}
