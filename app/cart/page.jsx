'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/CartContext'
import { formatPrice } from '@/lib/products'
import { SHIPPING_THRESHOLD, SHIPPING_FEE, events } from '@/lib/analytics'
import RecentlyViewed from '@/components/RecentlyViewed'
import SafeImg from '@/components/SafeImg'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, savings, hydrated, count } = useCart()
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(null)
  const [appliedPct, setAppliedPct] = useState(0)
  const [promoMsg, setPromoMsg] = useState('')
  const [validating, setValidating] = useState(false)

  const discount = applied ? Math.round(subtotal * (appliedPct / 100)) : 0
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal - discount + shipping
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal)
  const pct = subtotal === 0 ? 0 : Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100))

  const apply = async () => {
    const code = promo.trim().toUpperCase()
    if (!code) return
    setValidating(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setApplied(null)
        setAppliedPct(0)
        setPromoMsg(data.error || 'Code not recognised.')
      } else {
        setApplied(data.coupon.code)
        setAppliedPct(data.coupon.percent)
        setPromoMsg(`✦ ${data.coupon.code} applied · ${data.coupon.percent}% off`)
      }
    } catch {
      setPromoMsg('Could not check code, try again.')
    }
    setValidating(false)
    setTimeout(() => setPromoMsg(''), 3500)
  }

  if (!hydrated) return null

  if (items.length === 0) {
    return (
      <section className="cart-page" style={{ minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <p className="section-label">Your Bag</p>
          <h1 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', marginTop: 18, lineHeight: 1.1 }}>
            Empty. <span style={{ color: '#c94f2a' }}>For now.</span>
          </h1>
          <p style={{ color: '#7a7060', maxWidth: 420, margin: '20px auto 36px', lineHeight: 1.8 }}>
            Begin with a single, considered piece. The kind that becomes part of you.
          </p>
          <Link href="/collection" className="btn-dark"><span>Browse Collection</span></Link>
        </div>
        <div style={{ marginTop: 80 }}>
          <RecentlyViewed title="You were eyeing" />
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div style={{ marginBottom: 28 }}>
        <p className="section-label">Your Bag</p>
        <h1 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: 14, lineHeight: 1.1 }}>
          Review &amp; Refine.
        </h1>
      </div>

      <div className="ship-meter ship-meter-page" aria-label="Free shipping progress">
        <div className="ship-meter-text">
          {remaining === 0 ? (
            <span><strong style={{ color: '#c94f2a' }}>✦ Free shipping unlocked.</strong> Your order ships free.</span>
          ) : (
            <span>You're <strong>{formatPrice(remaining)}</strong> away from <strong>free shipping</strong>.</span>
          )}
        </div>
        <div className="ship-meter-track" aria-hidden>
          <div className="ship-meter-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="cart-grid">
        <div>
          {items.map((it) => (
            <div key={it.id} className="cart-row">
              <Link href={`/collection/${it.slug}`} className="cart-row-img">
                <SafeImg src={it.image} alt={it.name} fallbackKey={`cart-${it.slug}`} />
              </Link>
              <div>
                <Link
                  href={`/collection/${it.slug}`}
                  style={{
                    fontFamily: "'Italiana', serif",
                    fontSize: '1.4rem',
                    color: '#0a0a0a',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  {it.name}
                </Link>
                <p style={{ fontSize: '0.78rem', color: '#7a7060', letterSpacing: '0.08em', marginTop: 6 }}>
                  {it.color && <>{it.color} · </>}Size {it.size}
                </p>
                <div className="qty" style={{ marginTop: 18 }}>
                  <button onClick={() => updateQty(it.id, it.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span aria-live="polite">{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  style={{
                    marginTop: 16,
                    background: 'transparent', border: 'none',
                    color: '#7a7060', fontSize: '0.7rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    cursor: 'none', transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c94f2a')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7060')}
                >
                  Remove
                </button>
              </div>
              <div style={{ textAlign: 'right' }}>
                {it.originalPrice && it.originalPrice > it.price && (
                  <s style={{ display: 'block', fontSize: '0.78rem', color: '#9c9080', letterSpacing: '0.08em' }}>
                    {formatPrice(it.originalPrice * it.qty)}
                  </s>
                )}
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em' }}>
                  {formatPrice(it.price * it.qty)}
                </span>
                {it.qty > 1 && (
                  <p style={{ fontSize: '0.7rem', color: '#7a7060', marginTop: 4 }}>
                    {formatPrice(it.price)} each
                  </p>
                )}
                {it.originalPrice && it.originalPrice > it.price && (
                  <p style={{ fontSize: '0.68rem', color: '#c94f2a', marginTop: 4, letterSpacing: '0.08em' }}>
                    Save {formatPrice((it.originalPrice - it.price) * it.qty)}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(10,10,10,0.06)' }}>
            <Link
              href="/collection"
              style={{
                fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#c94f2a', textDecoration: 'none', borderBottom: '1px solid rgba(201,79,42,0.4)',
                paddingBottom: 2,
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        <aside className="summary-card">
          <p className="section-label" style={{ marginBottom: 18 }}>Order Summary</p>

          {savings > 0 && (
            <>
              <div className="summary-row">
                <span>MRP Total</span>
                <span><s style={{ color: '#9c9080' }}>{formatPrice(subtotal + savings)}</s></span>
              </div>
              <div className="summary-row" style={{ color: '#c94f2a' }}>
                <span>Sale Savings</span>
                <span>− {formatPrice(savings)}</span>
              </div>
            </>
          )}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? '#c94f2a' : '#0a0a0a' }}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          {discount > 0 && (
            <div className="summary-row" style={{ color: '#c94f2a' }}>
              <span>Promo ({applied})</span>
              <span>− {formatPrice(discount)}</span>
            </div>
          )}

          <div className="promo">
            <input
              placeholder="Promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && apply()}
              aria-label="Promo code"
            />
            <button onClick={apply} disabled={validating || !promo.trim()}>
              {validating ? '…' : 'Apply'}
            </button>
          </div>
          {promoMsg && (
            <p
              role="status"
              style={{
                fontSize: '0.7rem',
                color: applied ? '#c94f2a' : '#7a7060',
                letterSpacing: '0.08em',
                marginTop: -12,
                marginBottom: 16,
              }}
            >
              {promoMsg}
            </p>
          )}

          <CouponBanner />

          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#7a7060', marginTop: 8, letterSpacing: '0.05em' }}>
            Or 6 EMIs of {formatPrice(Math.round(total / 6))} · No-cost
          </p>

          <Link
            href="/checkout"
            className="btn-dark"
            style={{ display: 'block', textAlign: 'center', marginTop: 24 }}
            onClick={() => events.beginCheckout(subtotal, count)}
          >
            <span>Proceed to Checkout</span>
          </Link>

          <div style={{ marginTop: 22, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Visa', 'MC', 'Amex', 'UPI', 'RuPay', 'Net Banking', 'COD'].map((p) => (
              <span key={p} className="pay-logo">{p}</span>
            ))}
          </div>
        </aside>
      </div>

      <div style={{ marginTop: 80 }}>
        <RecentlyViewed title="Recently viewed" />
      </div>
    </section>
  )
}

function CouponBanner() {
  const [list, setList] = useState([])
  useEffect(() => {
    fetch('/api/coupons').then((r) => r.json()).then((d) => {
      if (d.ok && Array.isArray(d.coupons)) setList(d.coupons.slice(0, 2))
    }).catch(() => {})
  }, [])
  if (list.length === 0) {
    return (
      <p style={{ fontSize: '0.68rem', color: '#7a7060', marginBottom: 14, letterSpacing: '0.06em' }}>
        Try <strong>VOID10</strong> or <strong>FIRST15</strong>.
      </p>
    )
  }
  return (
    <p style={{ fontSize: '0.68rem', color: '#7a7060', marginBottom: 14, letterSpacing: '0.06em' }}>
      Try {list.map((c, i) => (
        <span key={c.code}>{i > 0 && ' or '}<strong>{c.code}</strong></span>
      ))} · {list[0]?.description}
    </p>
  )
}
