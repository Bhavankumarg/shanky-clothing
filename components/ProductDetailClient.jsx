'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice, hasDiscount, discountPercent, discountAmount } from '@/lib/products'
import { useCart } from '@/components/CartContext'
import ProductCard from '@/components/ProductCard'
import SafeImg from '@/components/SafeImg'

export default function ProductDetailClient({ product, related }) {
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState(product.sizes[0])
  const [color, setColor] = useState(product.colors[0])
  const [openAcc, setOpenAcc] = useState('details')
  const [adding, setAdding] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const handleAdd = () => {
    setAdding(true)
    addItem(product, { size, color })
    setTimeout(() => setAdding(false), 700)
  }

  return (
    <>
      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-img-main reveal">
            <SafeImg src={product.images[activeImg]} alt={product.name} fallbackKey={`${product.slug}-${activeImg}`} />
          </div>
          <div className="pdp-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                aria-label={`View image ${i + 1}`}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h4>Size · {size}</h4>
              <Link
                href="/size-guide"
                style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c94f2a', textDecoration: 'underline', textUnderlineOffset: 4 }}
              >
                Size guide
              </Link>
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
            <button className="icon-btn" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
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

          <div className="benefits">
            <div className="benefit"><span className="benefit-icon">↻</span><span className="benefit-label">30-Day Returns</span></div>
            <div className="benefit"><span className="benefit-icon">✦</span><span className="benefit-label">Free Shipping</span></div>
            <div className="benefit"><span className="benefit-icon">∞</span><span className="benefit-label">Lifetime Mend</span></div>
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

      <section style={{ padding: '100px 60px 120px', background: '#ece4d6' }}>
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
    </>
  )
}
