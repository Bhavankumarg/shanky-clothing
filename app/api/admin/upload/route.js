import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { uploadProductImage, storageConfigured } from '@/lib/supabaseStorage'

export const runtime = 'nodejs'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

const safeName = (s) =>
  String(s || 'upload')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  if (!storageConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.',
      },
      { status: 500 }
    )
  }

  let formData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 })
  }

  const files = formData.getAll('file').filter(Boolean)
  if (files.length === 0) {
    return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 })
  }

  const urls = []
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported type: ${file.type}` },
        { status: 415 }
      )
    }
    const buf = Buffer.from(await file.arrayBuffer())
    if (buf.length > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'Max 8 MB per image' }, { status: 413 })
    }
    try {
      const url = await uploadProductImage({
        buffer: buf,
        filename: safeName(file.name),
        contentType: file.type,
      })
      urls.push(url)
    } catch (e) {
      return NextResponse.json(
        { ok: false, error: e.message || 'Storage upload failed' },
        { status: 502 }
      )
    }
  }

  return NextResponse.json({ ok: true, urls })
}
