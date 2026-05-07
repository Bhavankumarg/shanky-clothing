'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from './CartContext'
import { formatPrice } from '@/lib/products'

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, removeItem, updateQty, subtotal, count } = useCart()

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
                    <span style={{ fontSize: '0.78rem', color: '#0a0a0a' }}>
                      {formatPrice(it.price * it.qty)}
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
            <div className="cart-foot-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="cart-foot-note">Shipping & taxes calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
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
