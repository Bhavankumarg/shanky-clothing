import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { getAllProducts, createProduct } from '@/lib/productStore'

export const runtime = 'nodejs'

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const products = await getAllProducts()
  return NextResponse.json({ ok: true, products })
}

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  try {
    const product = await createProduct(body)
    return NextResponse.json({ ok: true, product })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to create' }, { status: 400 })
  }
}
