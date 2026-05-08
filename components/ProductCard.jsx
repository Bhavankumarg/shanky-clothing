'use client'
import Link from 'next/link'
import { formatPrice, hasDiscount, discountPercent } from '@/lib/products'
import { useCart } from './CartContext'
import { useWishlist } from './WishlistContext'
import SafeImg from './SafeImg'
import RatingStars from './RatingStars'
import { ratingFor } from '@/lib/reviews'
import { events } from '@/lib/analytics'

export default function ProductCard({ product, delay = 0 }) {
  const { addItem } = useCart()
  const { has: wishHas, toggle: wishToggle } = useWishlist()
  const wished = wishHas(product.slug)
  const onSale = hasDiscount(product)
  const { rating, count } = ratingFor(product.slug)

  return (
    <div
      className="product-card reveal relative overflow-hidden cursor-none group"
      style={{ aspectRatio: '3/4', background: '#1a1a1a', transitionDelay: `${delay}ms` }}
    >
      <Link href={`/collection/${product.slug}`} className="block w-full h-full">
        <SafeImg
          src={product.images[0]}
          alt={product.name}
          fallbackKey={product.slug}
          className="card-img w-full h-full object-cover absolute inset-0"
        />
        {product.badge && <div className="card-badge">{product.badge}</div>}
        {onSale && (
          <div className="card-discount-chip">−{discountPercent(product)}%</div>
        )}
        <div
          className="card-info absolute bottom-0 left-0 right-0 z-10"
          style={{
            padding: 24,
            background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)',
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.4rem',
              letterSpacing: '0.1em',
              color: '#f5f0e8',
            }}
          >
            {product.name}
          </div>
          <div className="card-rating-row" aria-label={`${rating} out of 5 from ${count} reviews`}>
            <span style={{ color: '#e8633a' }}><RatingStars rating={rating} size={11} /></span>
            <span>{rating} · {count}</span>
          </div>
          <div className="card-price-row">
            <span className="card-price">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="card-price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!wished) events.addToWishlist(product)
          wishToggle(product)
        }}
        className={`card-wish ${wished ? 'is-active' : ''}`}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wished}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.preventDefault()
          addItem(product)
          events.addToCart(product, {})
        }}
        className="card-cta z-20"
        style={{
          background: '#c94f2a',
          color: '#f5f0e8',
          border: 'none',
          padding: '12px 28px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1rem',
          letterSpacing: '0.15em',
          cursor: 'none',
        }}
      >
        Quick Add
      </button>
    </div>
  )
}
