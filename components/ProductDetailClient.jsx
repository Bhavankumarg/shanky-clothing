'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { formatPrice, hasDiscount, discountPercent, discountAmount } from '@/lib/products'
import { useCart } from '@/components/CartContext'
import { useWishlist } from '@/components/WishlistContext'
import ProductCard from '@/components/ProductCard'
import SafeImg from '@/components/SafeImg'
import SizeFinder from '@/components/SizeFinder'
import RatingStars from '@/components/RatingStars'
import { ratingFor } from '@/lib/reviews'
import { events } from '@/lib/analytics'

export default function ProductDetailClient({ product, related }) {
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState(product.sizes[0])
  const [color, setColor] = useState(product.colors[0])
  const [openAcc, setOpenAcc] = useState('details')
  const [adding, setAdding] = useState(false)
  const [showSizeFinder, setShowSizeFinder] = useState(false)
  const [bundleSelected, setBundleSelected] = useState(() => new Set(related.map((r) => r.slug)))
  const { addItem } = useCart()
  const { has: wishHas, toggle: wishToggle } = useWishlist()
  const wished = wishHas(product.slug)
  const { rating, count: reviewCount } = ratingFor(product.slug)
  const galleryRef = useRef(null)

  useEffect(() => {
    events.viewItem(product)

    // Recently viewed (localStorage, last 8)
    try {
      const raw = localStorage.getItem('void-recent-v1')
      const list = raw ? JSON.parse(raw) : []
      const next = [
        { slug: product.slug, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.images?.[0] },
        ...list.filter((p) => p.slug !== product.slug),
      ].slice(0, 8)
      localStorage.setItem('void-recent-v1', JSON.stringify(next))
    } catch {}
  }, [product])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Keyboard nav for the gallery
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setActiveImg((i) => (i - 1 + product.images.length) % product.images.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setActiveImg((i) => (i + 1) % product.images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product.images.length])

  const handleAdd = () => {
    setAdding(true)
    addItem(product, { size, color })
    events.addToCart(product, { size, color })
    setTimeout(() => setAdding(false), 700)
  }

  const toggleBundle = (slug) => {
    setBundleSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const bundlePicks = related.filter((r) => bundleSelected.has(r.slug))
  const bundleTotal = bundlePicks.reduce((s, p) => s + (p.price || 0), 0) + product.price

  const addBundle = () => {
    addItem(product, { size, color })
    events.addToCart(product, { size, color })
    bundlePicks.forEach((p) => {
      addItem(p)
      events.addToCart(p, {})
    })
  }

  return (
    <>
      <div className="pdp">
        <div className="pdp-gallery" ref={galleryRef}>
          <div className="reveal">
          <div className="pdp-img-main">
            <SafeImg src={product.images[activeImg]} alt={product.name} fallbackKey={`${product.slug}-${activeImg}`} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveImg((i) => (i - 1 + product.images.length) % product.images.length)
              }}
              className="pdp-arrow pdp-arrow-prev"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveImg((i) => (i + 1) % product.images.length)
              }}
              className="pdp-arrow pdp-arrow-next"
              aria-label="Next image"
            >
              ›
            </button>
            <span className="pdp-img-counter" aria-hidden>
              {activeImg + 1} / {product.images.length}
            </span>
          </div>
          </div>
          <div className="pdp-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                aria-label={`View image ${i + 1}`}
                aria-current={activeImg === i}
              >
                <SafeImg src={img} alt="" fallbackKey={`${product.slug}-thumb-${i}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <p className="section-label">{product.category}</p>
            {product.badge && (
              <span style={{ background: '#c94f2a', color: '#f5f0e8', fontSize: '0.62rem', letterSpacing: '0.22em', padding: '3px 8px', textTransform: 'uppercase' }}>
                {product.badge}
              </span>
            )}
          </div>
          <h1 className="pdp-title">{product.name}</h1>
          <a href="#reviews" className="pdp-rating-row" aria-label={`${rating} stars from ${reviewCount} reviews`}>
            <RatingStars rating={rating} />
            <span className="pdp-rating-num">{rating}</span>
            <span className="pdp-rating-count">· {reviewCount} reviews</span>
          </a>
          <div className="pdp-price-row">
            <span className="pdp-price">{formatPrice(product.price)}</span>
            {hasDiscount(product) && (
              <>
                <span className="pdp-price-original">{formatPrice(product.originalPrice)}</span>
                <span className="pdp-price-pct">−{discountPercent(product)}%</span>
              </>
            )}
          </div>
          {hasDiscount(product) && (
            <p className="pdp-savings">
              You save <strong>{formatPrice(discountAmount(product))}</strong> · Limited time
            </p>
          )}
          <p style={{ color: '#7a7060', fontSize: '0.65rem', letterSpacing: '0.18em', marginTop: 4 }}>
            Inclusive of all taxes · Free shipping over ₹4,999
          </p>

          <p style={{ color: '#2a2a2a', fontSize: '0.92rem', lineHeight: 1.85, marginTop: 22, fontWeight: 300 }}>
            {product.description}
          </p>

          <div className="pdp-section">
            <h4>Color · {color}</h4>
            <div className="swatch-row">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`swatch ${color === c ? 'active' : ''}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <h4>Size · {size}</h4>
              <div style={{ display: 'flex', gap: 14 }}>
                <button
                  type="button"
                  onClick={() => setShowSizeFinder(true)}
                  style={{
                    background: 'transparent', border: 'none', padding: 0,
                    fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: '#c94f2a', cursor: 'none', textDecoration: 'underline', textUnderlineOffset: 4,
                  }}
                >
                  Find my size
                </button>
                <Link
                  href="/size-guide"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c94f2a', textDecoration: 'underline', textUnderlineOffset: 4 }}
                >
                  Size guide
                </Link>
              </div>
            </div>
            <div className="size-row">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-add">
            <button
              onClick={handleAdd}
              className="btn-dark"
              style={{ transform: adding ? 'scale(0.96)' : 'scale(1)', transition: 'transform 0.2s' }}
            >
              <span>{adding ? 'Added ✦' : 'Add to Bag'}</span>
            </button>
            <button
              onClick={() => {
                wishToggle(product)
                if (!wished) events.addToWishlist(product)
              }}
              className={`icon-btn ${wished ? 'icon-btn-active' : ''}`}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wished}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <div className="pdp-trust">
            <Link href="/shipping-returns" className="pdp-trust-item" aria-label="30-day returns">
              <span className="benefit-icon">↻</span>
              <span>
                <strong>30-Day Returns</strong>
                <em>Unworn, tagged · free in India</em>
              </span>
            </Link>
            <Link href="/shipping-returns" className="pdp-trust-item" aria-label="Free shipping over 4999">
              <span className="benefit-icon">✦</span>
              <span>
                <strong>Free Shipping</strong>
                <em>Over ₹4,999 · 3–5 days</em>
              </span>
            </Link>
            <Link href="/sustainability" className="pdp-trust-item" aria-label="Lifetime mend">
              <span className="benefit-icon">∞</span>
              <span>
                <strong>Lifetime Mend</strong>
                <em>We repair, you keep wearing</em>
              </span>
            </Link>
          </div>

          <div className="pdp-section">
            <h4>Pay your way</h4>
            <div className="pay-row">
              {['Visa', 'Mastercard', 'Amex', 'RuPay', 'UPI', 'Net Banking', 'EMI', 'COD'].map((p) => (
                <span key={p} className="pay-pill">{p}</span>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: '#7a7060', marginTop: 10, letterSpacing: '0.05em' }}>
              EMI from ₹{Math.round(product.price / 6).toLocaleString('en-IN')} / month · No-cost on cards.
            </p>
          </div>

          <div className="pdp-section">
            <div className={`acc-item ${openAcc === 'details' ? 'open' : ''}`}>
              <button className="acc-trigger" onClick={() => setOpenAcc(openAcc === 'details' ? '' : 'details')}>
                Material & Care
                <span className="acc-icon" />
              </button>
              <div className="acc-content">
                <p>
                  <strong>Material:</strong> {product.material}<br />
                  <strong>Care:</strong> {product.care}<br />
                  <strong>Origin:</strong> Hand-finished in our Bengaluru atelier from globally sourced natural fibres.
                </p>
              </div>
            </div>
            <div className={`acc-item ${openAcc === 'fit' ? 'open' : ''}`}>
              <button className="acc-trigger" onClick={() => setOpenAcc(openAcc === 'fit' ? '' : 'fit')}>
                Fit & Sizing
                <span className="acc-icon" />
              </button>
              <div className="acc-content">
                <p>Designed for an oversized, relaxed silhouette. Model is 5'10" and wears size S. For a closer fit, size down. Refer to the size guide for detailed measurements.</p>
              </div>
            </div>
            <div className={`acc-item ${openAcc === 'ship' ? 'open' : ''}`}>
              <button className="acc-trigger" onClick={() => setOpenAcc(openAcc === 'ship' ? '' : 'ship')}>
                Shipping & Returns
                <span className="acc-icon" />
              </button>
              <div className="acc-content">
                <p>Free shipping across India on orders over ₹4,999. International shipping calculated at checkout. Returns accepted within 30 days, unworn and tagged. Sale items final.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETE THE LOOK */}
      {related.length > 0 && (
        <section className="pdp-bundle">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 28 }}>
            <p className="section-label">Complete the look</p>
            <h2 className="italiana" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginTop: 8 }}>
              Worn together.
            </h2>
            <p style={{ color: '#7a7060', maxWidth: 520, margin: '12px auto 0', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Hand-picked pairings. Tick off what you'd like and add the lot in one move.
            </p>
          </div>
          <div className="pdp-bundle-grid">
            <div className="pdp-bundle-item is-anchor">
              <img src={product.images[0]} alt={product.name} />
              <div className="pdp-bundle-meta">
                <span className="pdp-bundle-tag">This piece</span>
                <strong>{product.name}</strong>
                <span>{formatPrice(product.price)}</span>
              </div>
            </div>
            {related.map((p) => {
              const sel = bundleSelected.has(p.slug)
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggleBundle(p.slug)}
                  className={`pdp-bundle-item pdp-bundle-toggle ${sel ? 'is-selected' : ''}`}
                  aria-pressed={sel}
                >
                  <img src={p.images[0]} alt={p.name} />
                  <div className="pdp-bundle-meta">
                    <span className="pdp-bundle-tag">{sel ? '✓ In bundle' : '+ Add'}</span>
                    <strong>{p.name}</strong>
                    <span>{formatPrice(p.price)}</span>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="pdp-bundle-foot">
            <div>
              <p className="section-label">Bundle total</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.08em' }}>
                {formatPrice(bundleTotal)}
              </p>
              <p style={{ color: '#7a7060', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
                {1 + bundlePicks.length} pieces · adds {bundlePicks.length + 1} item{bundlePicks.length === 0 ? '' : 's'} to your bag
              </p>
            </div>
            <button onClick={addBundle} className="btn-dark">
              <span>Add bundle to bag</span>
            </button>
          </div>
        </section>
      )}

      <section id="reviews" style={{ padding: '100px 60px 120px', background: '#ece4d6' }}>
        <div className="reveal" style={{ marginBottom: 40, textAlign: 'center' }}>
          <p className="section-label">Pair with</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginTop: 12 }}>
            You might also love
          </h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* STICKY MOBILE ATC */}
      <div className="pdp-sticky-atc" role="region" aria-label="Add to bag">
        <div className="pdp-sticky-atc-info">
          <strong>{formatPrice(product.price)}</strong>
          <span>Size {size} · {color}</span>
        </div>
        <button onClick={handleAdd} className="btn-dark">
          <span>{adding ? 'Added ✦' : 'Add to Bag'}</span>
        </button>
      </div>

      {showSizeFinder && (
        <SizeFinder
          product={product}
          onPick={(s) => { setSize(s); setShowSizeFinder(false) }}
          onClose={() => setShowSizeFinder(false)}
        />
      )}
    </>
  )
}
