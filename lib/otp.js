// In-memory OTP store. Pinned to globalThis so it survives Next.js dev-mode
// module re-evaluation across separate API route bundles (each /api/* route
// gets its own module instance otherwise, which would break sharing).
//
// For multi-instance production, swap for Redis or a DB.

const TTL_MS = 10 * 60 * 1000
const VERIFIED_TTL = 30 * 60 * 1000

const g = globalThis
if (!g.__shankyOtp) g.__shankyOtp = new Map()
if (!g.__shankyVerified) g.__shankyVerified = new Map()

const store = g.__shankyOtp
const verifiedStore = g.__shankyVerified

const norm = (e) => String(e || '').trim().toLowerCase()

export function issueOtp(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  store.set(norm(email), { code, expires: Date.now() + TTL_MS, attempts: 0 })
  return code
}

export function verifyOtp(email, code) {
  const k = norm(email)
  const rec = store.get(k)
  if (!rec) return { ok: false, reason: 'No code requested for this email.' }
  if (Date.now() > rec.expires) {
    store.delete(k)
    return { ok: false, reason: 'Code expired. Request a new one.' }
  }
  rec.attempts += 1
  if (rec.attempts > 6) {
    store.delete(k)
    return { ok: false, reason: 'Too many attempts. Request a new code.' }
  }
  if (rec.code !== String(code).trim()) {
    return { ok: false, reason: 'Incorrect code.' }
  }
  store.delete(k)
  return { ok: true }
}

export function markVerified(email) {
  verifiedStore.set(norm(email), Date.now() + VERIFIED_TTL)
}

export function isVerified(email) {
  const k = norm(email)
  const exp = verifiedStore.get(k)
  if (!exp) return false
  if (Date.now() > exp) {
    verifiedStore.delete(k)
    return false
  }
  return true
}
