'use client'
import Link from 'next/link'
import { formatPrice } from '@/lib/products'
import { useCart } from './CartContext'
import SafeImg from './SafeImg'

export default function ProductCard({ product, delay = 0 }) {
  const { addItem } = useCart()
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
        {product.badge && (
          <div className="card-badge">{product.badge}</div>
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
          <div style={{ fontSize: '0.78rem', color: '#d4c5a9', marginTop: 4, letterSpacing: '0.15em' }}>
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault()
          addItem(product)
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
