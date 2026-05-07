'use client'
import { useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

export default function NewArrivalsClient({ products }) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [products])

  return (
    <div className="collection-grid">
      {products.map((p, i) => (
        <ProductCard key={p.slug + i} product={p} delay={i * 60} />
      ))}
    </div>
  )
}
