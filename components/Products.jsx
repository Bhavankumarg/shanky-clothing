'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import ProductCard from './ProductCard'

export default function Products({ products = [] }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [products])

  const featured = products.slice(0, 3)

  return (
    <section id="collection" ref={sectionRef} className="featured-section">
      <div className="reveal featured-head">
        <div>
          <p className="section-label mb-4">Featured</p>
          <h2 className="italiana featured-title">Signature Pieces</h2>
        </div>
        <Link href="/collection" className="featured-view-all">
          View All →
        </Link>
      </div>

      <div className="featured-grid">
        {featured.map((product, i) => (
          <ProductCard key={product.slug} product={product} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}
