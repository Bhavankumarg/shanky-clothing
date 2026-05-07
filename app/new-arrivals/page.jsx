'use client'
import { useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/products'

export default function NewArrivalsPage() {
  const fresh = products.filter((p) => p.badge === 'New').concat(products.slice(0, 6)).slice(0, 8)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <PageHeader
        kicker="Just Landed · Men"
        title="New"
        accent=" Arrivals"
        subtitle="Fresh from the atelier. The men's pieces shaped by our quietest mood yet — slower fabrics, softer silhouettes, longer commitments."
        image="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1600&q=85&auto=format&fit=crop"
      />
      <div style={{ background: '#0a0a0a', color: '#f5f0e8', padding: '14px 60px', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: '0.22em' }}>
          ✦ Free overnight shipping on all New Arrivals · this week only ✦
        </span>
      </div>
      <div className="collection-grid">
        {fresh.map((p, i) => (
          <ProductCard key={p.slug + i} product={p} delay={i * 60} />
        ))}
      </div>
    </>
  )
}
