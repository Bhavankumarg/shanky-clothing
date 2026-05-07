// Server-side theme store. The site palette lives as CSS custom properties
// in globals.css; this store persists overrides to data/theme.json and the
// root layout injects them onto <html>, so the admin can recolour the entire
// storefront without touching code. Mirrors productStore.js's read-only-FS
// fallback so reads still resolve on Vercel/Lambda.

import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'theme.json')

const READ_ONLY_FS =
  process.env.VERCEL === '1' ||
  process.env.AWS_EXECUTION_ENV != null ||
  process.env.READ_ONLY_FS === '1'

// Defaults match the values currently in app/globals.css `:root`.
export const DEFAULT_THEME = {
  cream: '#f5f0e8',
  cream2: '#ece4d6',
  black: '#0a0a0a',
  rust: '#c94f2a',
  rustLight: '#e8633a',
  sand: '#d4c5a9',
  muted: '#7a7060',
}

// Hex (#rgb / #rrggbb) — the only format we accept from the admin UI.
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

let memoryCache = null

async function tryReadFile() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return normalizeTheme(data)
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
      await fs.writeFile(DB_FILE, JSON.stringify(DEFAULT_THEME, null, 2), 'utf-8')
    }
    return true
  } catch {
    return false
  }
}

export async function getTheme() {
  let theme = await tryReadFile()
  if (theme) return theme

  await tryEnsureFile()
  theme = await tryReadFile()
  if (theme) return theme

  if (!memoryCache) memoryCache = { ...DEFAULT_THEME }
  return memoryCache
}

export async function saveTheme(input) {
  const theme = normalizeTheme(input)
  memoryCache = theme

  if (READ_ONLY_FS) {
    throw new Error(
      'This deployment runs on a read-only filesystem. Theme changes only ' +
      'persist in local development. Run the admin locally, commit ' +
      'data/theme.json, and redeploy.'
    )
  }

  const ok = await tryEnsureFile()
  if (!ok) throw new Error('Filesystem is read-only — cannot persist theme.')
  await fs.writeFile(DB_FILE, JSON.stringify(theme, null, 2), 'utf-8')
  return theme
}

export async function resetTheme() {
  return saveTheme(DEFAULT_THEME)
}

// Map our friendly keys to the CSS custom property names already used in
// globals.css. Anything not in this map is ignored when building the inline
// style block.
export const CSS_VAR_MAP = {
  cream: '--cream',
  cream2: '--cream-2',
  black: '--black',
  rust: '--rust',
  rustLight: '--rust-light',
  sand: '--sand',
  muted: '--muted',
}

export function themeToCssVars(theme) {
  const out = {}
  for (const [key, varName] of Object.entries(CSS_VAR_MAP)) {
    if (theme?.[key]) out[varName] = theme[key]
  }
  return out
}
