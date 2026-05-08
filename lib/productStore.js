// Product store — Postgres (Supabase) via Drizzle.
// Public API matches the previous JSON-on-disk implementation.

import { eq, ne, asc, sql } from 'drizzle-orm'
import { getDb } from './db.js'
import { products } from './schema.js'

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function fromRow(row) {
  if (!row) return null
  return {
    slug: row.slug,
    name: row.name,
    price: row.price,
    originalPrice: row.originalPrice ?? null,
    category: row.category,
    gender: row.gender || 'Men',
    badge: row.badge || null,
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    material: row.material || '',
    care: row.care || '',
    description: row.description || '',
    images: Array.isArray(row.images) ? row.images : [],
  }
}

function normalizeProduct(input) {
  const sellingPrice = Number(input.price) || 0
  const rawOriginal = Number(input.originalPrice)
  const originalPrice =
    Number.isFinite(rawOriginal) && rawOriginal > sellingPrice ? rawOriginal : null

  return {
    slug: slugify(input.slug || input.name),
    name: String(input.name || '').trim(),
    price: sellingPrice,
    originalPrice,
    category: String(input.category || 'Outerwear').trim(),
    gender: 'Men',
    badge: input.badge ? String(input.badge).trim() : null,
    colors: Array.isArray(input.colors)
      ? input.colors
      : String(input.colors || '').split(',').map((s) => s.trim()).filter(Boolean),
    sizes: Array.isArray(input.sizes)
      ? input.sizes
      : String(input.sizes || '').split(',').map((s) => s.trim()).filter(Boolean),
    material: String(input.material || '').trim(),
    care: String(input.care || '').trim(),
    description: String(input.description || '').trim(),
    images: Array.isArray(input.images)
      ? input.images.filter(Boolean)
      : [String(input.images || '').trim()].filter(Boolean),
  }
}

export async function getAllProducts() {
  const db = getDb()
  const rows = await db.select().from(products).orderBy(asc(products.createdAt))
  return rows.reverse().map(fromRow)
}

export async function getProductBySlug(slug) {
  const db = getDb()
  const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
  return fromRow(row)
}

export async function getCategories() {
  const db = getDb()
  const rows = await db.select({ category: products.category }).from(products)
  const cats = new Set()
  rows.forEach((r) => r.category && cats.add(r.category))
  return ['All', ...Array.from(cats).sort()]
}

export async function getRelated(slug, limit = 3) {
  const db = getDb()
  const rows = await db.select().from(products).where(ne(products.slug, slug)).limit(limit)
  return rows.map(fromRow)
}

export async function getNewArrivals(limit = 12) {
  const all = await getAllProducts()
  const news = all.filter((p) => p.badge === 'New')
  if (news.length >= limit) return news.slice(0, limit)
  const rest = all.filter((p) => p.badge !== 'New')
  return [...news, ...rest].slice(0, limit)
}

export async function createProduct(input) {
  const product = normalizeProduct(input)
  if (!product.name) throw new Error('Name is required')
  if (!product.slug) throw new Error('Slug is required')
  if (!product.price) throw new Error('Price is required')
  if (product.images.length === 0) throw new Error('At least one image is required')
  if (product.sizes.length === 0) product.sizes = ['One Size']
  if (product.colors.length === 0) product.colors = ['Default']

  const db = getDb()
  const [existing] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.slug, product.slug))
    .limit(1)
  if (existing) throw new Error(`A product with slug "${product.slug}" already exists`)

  await db.insert(products).values(product)
  return product
}

export async function updateProduct(slug, input) {
  const db = getDb()
  const [current] = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
  if (!current) throw new Error('Product not found')

  const merged = normalizeProduct({ ...fromRow(current), ...input })
  merged.slug = current.slug

  await db.update(products).set(merged).where(eq(products.slug, slug))
  return merged
}

export async function deleteProduct(slug) {
  const db = getDb()
  const result = await db.delete(products).where(eq(products.slug, slug)).returning({ slug: products.slug })
  if (result.length === 0) throw new Error('Product not found')
}

export async function resetToSeed() {
  throw new Error('resetToSeed is no longer supported — re-run scripts/migrate-from-json.js manually if needed.')
}

export async function getProductCount() {
  const db = getDb()
  const [row] = await db.select({ n: sql`count(*)::int` }).from(products)
  return row?.n || 0
}
