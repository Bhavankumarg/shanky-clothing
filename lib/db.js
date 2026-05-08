// Postgres client (Supabase) wired through Drizzle. Lazy-initialised so
// importing the schema in build scripts (drizzle-kit, migrations) doesn't
// require a live database.
//
// Configure with one env var:
//   DATABASE_URL  — Supabase → ⚙ Project Settings → Database → Connection
//                   string → URI tab → "Transaction pooler" mode → copy.
//                   Replace [YOUR-PASSWORD] with your actual database
//                   password (no brackets, no quotes).

import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.js'

let _db = null
let _sql = null

function makeClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env (Supabase → Project Settings → Database → Connection string → Transaction pooler).'
    )
  }
  if (!/^postgres(ql)?:\/\//.test(url)) {
    throw new Error(
      'DATABASE_URL must start with postgres:// or postgresql://. Got: ' +
        url.slice(0, 40) + '...'
    )
  }

  // `prepare: false` is required by Supabase's transaction-mode pooler (port
  // 6543). Harmless on direct/session connections so we set it always.
  _sql = postgres(url, {
    prepare: false,
    max: process.env.NODE_ENV === 'production' ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
  })
  _db = drizzle(_sql, { schema })
  return _db
}

export function getDb() {
  if (!_db) makeClient()
  return _db
}

export async function closeDb() {
  if (_sql) {
    await _sql.end({ timeout: 5 })
    _sql = null
    _db = null
  }
}

export { schema }
