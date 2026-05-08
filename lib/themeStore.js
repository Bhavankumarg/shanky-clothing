// Theme store — Postgres (Supabase) via Drizzle. Single-row table on id = 1.

import { eq } from 'drizzle-orm'
import { getDb } from './db.js'
import { theme } from './schema.js'

export const DEFAULT_THEME = {
  cream: '#f5f0e8',
  cream2: '#ece4d6',
  black: '#0a0a0a',
  rust: '#c94f2a',
  rustLight: '#e8633a',
  sand: '#d4c5a9',
  muted: '#7a7060',
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export function normalizeTheme(input = {}) {
  const out = { ...DEFAULT_THEME }
  for (const key of Object.keys(DEFAULT_THEME)) {
    const v = input[key]
    if (typeof v === 'string' && HEX_RE.test(v.trim())) {
      out[key] = v.trim().toLowerCase()
    }
  }
  return out
}

export async function getTheme() {
  const db = getDb()
  const [row] = await db.select().from(theme).where(eq(theme.id, 1)).limit(1)
  if (!row) {
    await db.insert(theme).values({ id: 1, ...DEFAULT_THEME }).onConflictDoNothing()
    return { ...DEFAULT_THEME }
  }
  return {
    cream: row.cream,
    cream2: row.cream2,
    black: row.black,
    rust: row.rust,
    rustLight: row.rustLight,
    sand: row.sand,
    muted: row.muted,
  }
}

export async function saveTheme(input) {
  const next = normalizeTheme(input)
  const db = getDb()
  await db
    .insert(theme)
    .values({ id: 1, ...next })
    .onConflictDoUpdate({ target: theme.id, set: next })
  return next
}

export async function resetTheme() {
  return saveTheme(DEFAULT_THEME)
}

export const CSS_VAR_MAP = {
  cream: '--cream',
  cream2: '--cream-2',
  black: '--black',
  rust: '--rust',
  rustLight: '--rust-light',
  sand: '--sand',
  muted: '--muted',
}

export function themeToCssVars(themeObj) {
  const out = {}
  for (const [key, varName] of Object.entries(CSS_VAR_MAP)) {
    if (themeObj?.[key]) out[varName] = themeObj[key]
  }
  return out
}
