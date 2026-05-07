import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { getProductBySlug, updateProduct, deleteProduct } from '@/lib/productStore'

export const runtime = 'nodejs'

export async function GET(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const product = await getProductBySlug(params.slug)
  if (!product) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true, product })
}

export async function PATCH(req, { params }) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  try {
    const product = await updateProduct(params.slug, body)
    return NextResponse.json({ ok: true, product })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  try {
    await deleteProduct(params.slug)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Delete failed' }, { status: 400 })
  }
}
