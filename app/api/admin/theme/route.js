import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { getTheme, saveTheme, resetTheme, DEFAULT_THEME } from '@/lib/themeStore'

export const runtime = 'nodejs'

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const theme = await getTheme()
  return NextResponse.json({ ok: true, theme, defaults: DEFAULT_THEME })
}

export async function PATCH(req) {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  try {
    const theme = await saveTheme(body)
    return NextResponse.json({ ok: true, theme })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to save' }, { status: 400 })
  }
}

export async function DELETE() {
  if (!isAdmin()) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  try {
    const theme = await resetTheme()
    return NextResponse.json({ ok: true, theme })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || 'Failed to reset' }, { status: 400 })
  }
}
