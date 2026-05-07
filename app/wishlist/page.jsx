'use client'
import Link from 'next/link'
import { useWishlist } from '@/components/WishlistContext'
import { useCart } from '@/components/CartContext'
import { formatPrice } from '@/lib/products'

export default function WishlistPage() {
  const { items, remove, hydrated } = useWishlist()
  const { addItem } = useCart()

  if (!hydrated) return null

  if (items.length === 0) {
    return (
      <section className="wishlist-page" style={{ minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <p className="section-label">Your Wishlist</p>
          <h1 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', marginTop: 18, lineHeight: 1.1 }}>
            Nothing saved <span style={{ color: '#c94f2a' }}>yet.</span>
          </h1>
          <p style={{ color: '#7a7060', maxWidth: 460, margin: '20px auto 36px', lineHeight: 1.8 }}>
            Tap the heart on a piece you love and it will live here, ready when you are.
          </p>
          <Link href="/collection" className="btn-dark"><span>Browse Collection</span></Link>
        </div>
      </section>
    )
  }

  return (
    <section className="wishlist-page">
      <div style={{ marginBottom: 40 }}>
        <p className="section-label">Your Wishlist</p>
        <h1 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: 14, lineHeight: 1.1 }}>
          Saved for <span style={{ color: '#c94f2a' }}>later.</span>
        </h1>
        <p className="wishlist-meta">
          {items.length} {items.length === 1 ? 'piece' : 'pieces'} kept aside.
        </p>
      </div>

      <div className="wishlist-grid">
        {items.map((it) => (
          <article key={it.slug} className="wishlist-card">
            <Link href={`/collection/${it.slug}`} className="wishlist-card-img">
              <img src={it.image} alt={it.name} />
            </Link>
            <div className="wishlist-card-body">
              <p className="section-label" style={{ fontSize: '0.6rem' }}>{it.category}</p>
              <Link href={`/collection/${it.slug}`} className="wishlist-card-title">
                {it.name}
              </Link>
              <div className="wishlist-card-price">
                <span>{formatPrice(it.price)}</span>
                {it.originalPrice && (
                  <s style={{ color: '#9c9080', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                    {formatPrice(it.originalPrice)}
                  </s>
                )}
              </div>
              <div className="wishlist-card-actions">
                <button
                  onClick={() => addItem({
                    slug: it.slug,
                    name: it.name,
                    price: it.price,
                    originalPrice: it.originalPrice,
                    images: [it.image],
                    sizes: it.sizes,
                    colors: it.colors,
                  })}
                  className="btn-dark"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={() => remove(it.slug)}
                  className="wishlist-remove"
                  aria-label={`Remove ${it.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(10,10,10,0.06)' }}>
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
    </section>
  )
}
