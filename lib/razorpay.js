// Razorpay integration — direct HTTP + HMAC verification, no extra npm deps.
//
// Configure with two env vars:
//   RAZORPAY_KEY_ID      — public key, also exposed to the browser
//   RAZORPAY_KEY_SECRET  — server-only, used for Basic auth + signature
//
// When the env vars are absent we run in "demo mode": orders are still
// generated locally (so the storefront flow works end-to-end without
// signups), but payments are simulated client-side. Production should
// always provide real keys.

import crypto from 'crypto'

const KEY_ID = process.env.RAZORPAY_KEY_ID || ''
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''
const API_BASE = 'https://api.razorpay.com/v1'

export const razorpayConfigured = () => Boolean(KEY_ID && KEY_SECRET)
export const razorpayPublicKey = () => KEY_ID

// Razorpay expects amounts in the smallest unit (paise for INR).
const toPaise = (rupees) => Math.round(Number(rupees || 0) * 100)

export async function createRazorpayOrder({ amount, receipt, notes }) {
  const amountPaise = toPaise(amount)
  if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
    throw new Error('Invalid amount')
  }

  // Demo mode — synthesise an order id so the client flow still works.
  if (!razorpayConfigured()) {
    return {
      id: 'order_demo_' + crypto.randomBytes(8).toString('hex'),
      amount: amountPaise,
      currency: 'INR',
      receipt: receipt || null,
      demo: true,
    }
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: receipt || undefined,
      notes: notes || undefined,
      payment_capture: 1,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error?.description || 'Razorpay order creation failed')
  }
  return data
}

// Razorpay sends back razorpay_order_id, razorpay_payment_id, razorpay_signature
// after a successful payment. We verify the HMAC SHA-256 of `${order_id}|${payment_id}`
// using the secret to make sure the payment really came from Razorpay.
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  if (!razorpayConfigured()) {
    // In demo mode we accept any signature that starts with "demo_". This is
    // intentional — production deployments must provide real keys.
    return typeof signature === 'string' && signature.startsWith('demo_')
  }
  if (!orderId || !paymentId || !signature) return false
  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return diff === 0
}
