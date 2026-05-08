// Provider-agnostic analytics shim. The storefront calls `track(event, props)`
// at meaningful moments (view item, add to cart, begin checkout, purchase,
// search, sign-in, wishlist add). Any provider — GA4 (gtag), Plausible,
// Segment, custom — can be wired up later by reading window.__SHANKY_EVENTS__
// or by replacing the body of `track`.
//
// Until a provider is wired up, events are buffered on `window` so you can
// inspect them in the browser console (`window.__SHANKY_EVENTS__`) and verify
// instrumentation without shipping a tracker.

export const SHIPPING_THRESHOLD = 4999
export const SHIPPING_FEE = 199

export function track(event, props = {}) {
  if (typeof window === 'undefined') return

  // 1) Buffer for inspection.
  if (!window.__SHANKY_EVENTS__) window.__SHANKY_EVENTS__ = []
  window.__SHANKY_EVENTS__.push({ event, props, ts: Date.now() })

  // 2) GA4 (gtag) — ignored if not loaded.
  if (typeof window.gtag === 'function') {
    try { window.gtag('event', event, props) } catch {}
  }
  // 3) Plausible custom events — ignored if not loaded.
  if (typeof window.plausible === 'function') {
    try { window.plausible(event, { props }) } catch {}
  }
  // 4) Custom dataLayer (GTM-style).
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...props })
  }
}

export const events = {
  viewItem: (product) =>
    track('view_item', {
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
    }),
  addToCart: (product, opts = {}) =>
    track('add_to_cart', {
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: opts.size,
      color: opts.color,
      qty: opts.qty || 1,
    }),
  removeFromCart: (item) =>
    track('remove_from_cart', { slug: item.slug, qty: item.qty }),
  beginCheckout: (subtotal, count) =>
    track('begin_checkout', { subtotal, count }),
  purchase: (orderId, total) =>
    track('purchase', { orderId, total }),
  addToWishlist: (product) =>
    track('add_to_wishlist', { slug: product.slug, name: product.name }),
  search: (query, results) =>
    track('search', { query, results }),
  signIn: (method) => track('login', { method }),
  signUp: (method) => track('sign_up', { method }),
}
