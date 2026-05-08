// Supabase Storage helper for product image uploads. Server-only.

import { createClient } from '@supabase/supabase-js'

const URL = process.env.SUPABASE_URL || ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'shanky'

let _client = null

export function storageConfigured() {
  return Boolean(URL && SERVICE_KEY)
}

function getClient() {
  if (!storageConfigured()) {
    throw new Error(
      'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }
  if (!_client) {
    _client = createClient(URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _client
}

export async function uploadProductImage({ buffer, filename, contentType }) {
  const client = getClient()
  const path = `products/${Date.now()}-${filename}`
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      cacheControl: '31536000',
      upsert: false,
    })
  if (error) throw new Error(error.message || 'Storage upload failed')
  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
