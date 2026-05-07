// Server-side product store. Reads from / writes to data/products.json.
// On first read it copies the seed (lib/products.js) into the JSON file.
// All admin mutations go through this module.

import { promises as fs } from 'fs'
import path from 'path'
import { products as seed } from './products.js'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'products.json')

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DB_FILE)
  } catch {
    await fs.writeFile(
      DB_FILE,
      JSON.stringify({ products: seed }, null, 2),
      'utf-8'
    )
  }
}

async function readAll() {
  await ensureFile()
  const raw = await fs.readFile(DB_FILE, 'utf-8')
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data?.products) ? data.products : []
  } catch {
    return []
  }
}

async function writeAll(products) {
  await ensureFile()
  await fs.writeFile(
    DB_FILE,
    JSON.stringify({ products }, null, 2),
    'utf-8'
  )
}

export async function getAllProducts() {
  return readAll()
}

export async function getProductBySlug(slug) {
  const all = await readAll()
  return all.find((p) => p.slug === slug) || null
}

export async function getCategories() {
  const all = await readAll()
  const cats = new Set()
  all.forEach((p) => p.category && cats.add(p.category))
  return ['All', ...Array.from(cats).sort()]
}

export async function getRelated(slug, limit = 3) {
  const all = await readAll()
  return all.filter((p) => p.slug !== slug).slice(0, limit)
}

export async function getNewArrivals(limit = 12) {
  const all = await readAll()
  const news = all.filter((p) => p.badge === 'New')
  if (news.length >= limit) return news.slice(0, limit)
  const rest = all.filter((p) => p.badge !== 'New')
  return [...news, ...rest].slice(0, limit)
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeProduct(input) {
  // Original price (MRP) is optional. Stored as a number > 0 only when the
  // product is on sale (i.e. originalPrice > price). Anything else clears it.
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
      : String(input.colors || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    sizes: Array.isArray(input.sizes)
      ? input.sizes
      : String(input.sizes || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    material: String(input.material || '').trim(),
    care: String(input.care || '').trim(),
    description: String(input.description || '').trim(),
    images: Array.isArray(input.images)
      ? input.images.filter(Boolean)
      : [String(input.images || '').trim()].filter(Boolean),
  }
}

export async function createProduct(input) {
  const product = normalizeProduct(input)
  if (!product.name) throw new Error('Name is required')
  if (!product.slug) throw new Error('Slug is required')
  if (!product.price) throw new Error('Price is required')
  if (product.images.length === 0) throw new Error('At least one image is required')
  if (product.sizes.length === 0) product.sizes = ['One Size']
  if (product.colors.length === 0) product.colors = ['Default']

  const all = await readAll()
  if (all.some((p) => p.slug === product.slug)) {
    throw new Error(`A product with slug "${product.slug}" already exists`)
  }
  all.unshift(product)
  await writeAll(all)
  return product
}

export async function updateProduct(slug, input) {
  const all = await readAll()
  const idx = all.findIndex((p) => p.slug === slug)
  if (idx === -1) throw new Error('Product not found')
  const merged = { ...all[idx], ...normalizeProduct({ ...all[idx], ...input }) }
  // never let the slug change via update
  merged.slug = all[idx].slug
  all[idx] = merged
  await writeAll(all)
  return merged
}

export async function deleteProduct(slug) {
  const all = await readAll()
  const next = all.filter((p) => p.slug !== slug)
  if (next.length === all.length) throw new Error('Product not found')
  await writeAll(next)
}

export async function resetToSeed() {
  await writeAll(seed)
}
