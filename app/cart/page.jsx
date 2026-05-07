'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { formatPrice } from '@/lib/products'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, savings, hydrated } = useCart()
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(null)
  const [promoMsg, setPromoMsg] = useState('')

  const validCodes = { VOID10: 0.1, FIRST15: 0.15 }
  const discount = applied ? Math.round(subtotal * validCodes[applied]) : 0
  const shipping = subtotal === 0 ? 0 : subtotal >= 4999 ? 0 : 199
  const total = subtotal - discount + shipping

  const apply = () => {
    const code = promo.trim().toUpperCase()
    if (validCodes[code]) {
      setApplied(code)
      setPromoMsg(`✦ ${code} applied · ${validCodes[code] * 100}% off`)
    } else {
      setApplied(null)
      setPromoMsg('Code not recognised.')
    }
    setTimeout(() => setPromoMsg(''), 3000)
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
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div style={{ marginBottom: 40 }}>
        <p className="section-label">Your Bag</p>
        <h1 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: 14, lineHeight: 1.1 }}>
          Review &amp; Refine.
        </h1>
      </div>

      <div className="cart-grid">
        <div>
          {items.map((it) => (
            <div key={it.id} className="cart-row">
              <Link href={`/collection/${it.slug}`} className="cart-row-img">
                <img src={it.image} alt={it.name} />
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
                  <button onClick={() => updateQty(it.id, it.qty - 1)}>−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
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
            />
            <button onClick={apply}>Apply</button>
          </div>
          {promoMsg && (
            <p style={{ fontSize: '0.7rem', color: applied ? '#c94f2a' : '#7a7060', letterSpacing: '0.08em', marginTop: -12, marginBottom: 16 }}>
              {promoMsg}
            </p>
          )}
          <p style={{ fontSize: '0.68rem', color: '#7a7060', marginBottom: 14, letterSpacing: '0.06em' }}>
            Try <strong>VOID10</strong> or <strong>FIRST15</strong>.
          </p>

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
    </section>
  )
}
