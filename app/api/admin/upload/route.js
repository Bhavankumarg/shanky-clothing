import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { isAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

const safeName = (s) =>
  String(s || 'upload')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

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

  await fs.mkdir(UPLOAD_DIR, { recursive: true })

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
    const filename = `${Date.now()}-${safeName(file.name)}`
    const dest = path.join(UPLOAD_DIR, filename)
    await fs.writeFile(dest, buf)
    urls.push(`/uploads/${filename}`)
  }

  return NextResponse.json({ ok: true, urls })
}
