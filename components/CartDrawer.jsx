'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from './CartContext'
import { formatPrice } from '@/lib/products'
import { SHIPPING_THRESHOLD, events } from '@/lib/analytics'

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, removeItem, updateQty, subtotal, savings, count } = useCart()
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal)
  const pct = subtotal === 0 ? 0 : Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100))

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
  }, [drawerOpen])

  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`}
      />
      <aside className={`cart-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="cart-head">
          <p className="section-label" style={{ color: '#c94f2a' }}>
            Your Bag · {count}
          </p>
          <button onClick={() => setDrawerOpen(false)} className="cart-close" aria-label="Close">
            <span /><span />
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-mark">∅</div>
              <p className="italiana" style={{ fontSize: '2rem', color: '#0a0a0a' }}>
                Your bag is quiet.
              </p>
              <p style={{ color: '#7a7060', fontSize: '0.85rem', marginTop: 8, lineHeight: 1.7 }}>
                Add a piece to fill the void.
              </p>
              <Link
                href="/collection"
                onClick={() => setDrawerOpen(false)}
                className="btn-primary mt-8"
                style={{ marginTop: 24 }}
              >
                <span>Browse Collection</span>
              </Link>
            </div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="cart-item">
                <Link
                  href={`/collection/${it.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="cart-item-img"
                >
                  <img src={it.image} alt={it.name} />
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-row">
                    <Link
                      href={`/collection/${it.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="cart-item-name"
                    >
                      {it.name}
                    </Link>
                    <span className="cart-item-price-stack">
                      {it.originalPrice && it.originalPrice > it.price && (
                        <s className="cart-item-mrp">{formatPrice(it.originalPrice * it.qty)}</s>
                      )}
                      <span style={{ fontSize: '0.82rem', color: '#0a0a0a' }}>
                        {formatPrice(it.price * it.qty)}
                      </span>
                    </span>
                  </div>
                  <div className="cart-item-meta">
                    {it.color && <>{it.color} · </>}Size {it.size}
                  </div>
                  <div className="cart-item-row" style={{ marginTop: 12 }}>
                    <div className="qty">
                      <button onClick={() => updateQty(it.id, it.qty - 1)} aria-label="Less">−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => updateQty(it.id, it.qty + 1)} aria-label="More">+</button>
                    </div>
                    <button onClick={() => removeItem(it.id)} className="cart-remove">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-foot">
            <div className="ship-meter" aria-label="Free shipping progress">
              <div className="ship-meter-text">
                {remaining === 0 ? (
                  <span><strong style={{ color: '#c94f2a' }}>✦ Free shipping unlocked.</strong> Delivered free across India.</span>
                ) : (
                  <span>Add <strong>{formatPrice(remaining)}</strong> more for <strong>free shipping</strong>.</span>
                )}
              </div>
              <div className="ship-meter-track" aria-hidden>
                <div className="ship-meter-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {savings > 0 && (
              <div className="cart-foot-row cart-foot-savings">
                <span>You save</span>
                <span>− {formatPrice(savings)}</span>
              </div>
            )}
            <div className="cart-foot-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="cart-foot-note">
              {savings > 0
                ? `Saving ${formatPrice(savings)} vs. MRP · `
                : ''}
              Taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={() => {
                setDrawerOpen(false)
                events.beginCheckout(subtotal, count)
              }}
              className="btn-primary"
              style={{ display: 'block', textAlign: 'center', marginTop: 14 }}
            >
              <span>Checkout</span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 12,
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#7a7060',
                textDecoration: 'underline',
              }}
            >
              View Bag
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
