// Lightweight review stub. We don't have a write/moderation flow yet, so the
// rating is derived deterministically from the product slug — the same product
// always shows the same rating + review count. Replace with a real review
// store later (data/reviews.json + admin moderation) without touching call
// sites.

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function ratingFor(slug) {
  const h = hash(slug || 'default')
  // 4.2 .. 4.9 — boutique items skew positive
  const rating = 4.2 + ((h % 8) / 10)
  // 18 .. 312 reviews
  const count = 18 + (h % 295)
  return { rating: Number(rating.toFixed(1)), count }
}

export function stars(rating) {
  // Returns an array of "full" | "half" | "empty" of length 5.
  const out = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) out.push('full')
    else if (rating >= i - 0.5) out.push('half')
    else out.push('empty')
  }
  return out
}
