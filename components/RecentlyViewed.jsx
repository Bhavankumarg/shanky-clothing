'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/products'

export default function RecentlyViewed({ excludeSlug, title = 'Recently viewed', max = 6 }) {
  const [items, setItems] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('void-recent-v1')
      const list = raw ? JSON.parse(raw) : []
      setItems(list.filter((p) => p.slug && p.slug !== excludeSlug).slice(0, max))
    } catch {}
    setHydrated(true)
  }, [excludeSlug, max])

  if (!hydrated || items.length === 0) return null

  return (
    <section className="recently-viewed">
      <p className="section-label">{title}</p>
      <h3 className="italiana" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginTop: 6, marginBottom: 22 }}>
        Pick up where you left off.
      </h3>
      <div className="recently-viewed-row">
        {items.map((p) => (
          <Link key={p.slug} href={`/collection/${p.slug}`} className="recently-viewed-card">
            <div className="recently-viewed-img">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="recently-viewed-meta">
              <span>{p.name}</span>
              <strong>{formatPrice(p.price)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
