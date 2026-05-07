'use client'
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

function CollectionInner({ products, categories }) {
  const searchParams = useSearchParams()
  const initialCat = searchParams.get('cat') || 'All'
  const [active, setActive] = useState(initialCat)
  const [sort, setSort] = useState('Featured')

  const filtered = useMemo(() => {
    let list = active === 'All' ? products : products.filter((p) => p.category === active)
    if (sort === 'Low to High') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'High to Low') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'Newest') list = [...list].sort((a, b) => (b.badge === 'New') - (a.badge === 'New'))
    return list
  }, [active, sort, products])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [filtered])

  return (
    <>
      <div className="filters-bar">
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#7a7060', marginRight: 12 }}>
          Filter
        </span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`filter-chip ${active === c ? 'active' : ''}`}
          >
            {c}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#7a7060' }}>
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '8px 14px',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              border: '1px solid rgba(10,10,10,0.18)',
              background: 'transparent',
              cursor: 'none',
              outline: 'none',
            }}
          >
            <option>Featured</option>
            <option>Newest</option>
            <option>Low to High</option>
            <option>High to Low</option>
          </select>
        </div>
      </div>

      <div className="collection-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '120px 24px', textAlign: 'center' }}>
            <p className="italiana" style={{ fontSize: '2.4rem', color: '#0a0a0a' }}>
              Nothing here. <span style={{ color: '#c94f2a' }}>For now.</span>
            </p>
            <p style={{ color: '#7a7060', fontSize: '0.88rem', marginTop: 12 }}>
              Check back soon — or browse another category.
            </p>
          </div>
        ) : (
          filtered.map((p, i) => <ProductCard key={p.slug + active} product={p} delay={i * 60} />)
        )}
      </div>

      <section style={{ background: '#0a0a0a', padding: '100px 60px', textAlign: 'center' }}>
        <p className="section-label" style={{ color: '#c94f2a' }}>Made to last</p>
        <h3
          className="italiana"
          style={{ color: '#f5f0e8', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginTop: 14, lineHeight: 1.1 }}
        >
          Every garment carries a<br />
          <span style={{ color: '#c94f2a' }}>lifetime repair promise.</span>
        </h3>
        <p style={{ color: '#d4c5a9', maxWidth: 480, margin: '20px auto 0', fontSize: '0.92rem', lineHeight: 1.8, fontWeight: 300 }}>
          Tear a seam, lose a button, wear through a heel — send it back, we mend it. Built to be loved hard, mended often, kept forever.
        </p>
      </section>
    </>
  )
}

export default function CollectionClient(props) {
  return (
    <Suspense fallback={<div style={{ padding: 120, textAlign: 'center' }}>Loading…</div>}>
      <CollectionInner {...props} />
    </Suspense>
  )
}
