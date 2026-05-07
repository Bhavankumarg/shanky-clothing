'use client'
import { useEffect, useState } from 'react'
import { formatPrice, hasDiscount } from '@/lib/products'

function useCounter(target, duration = 1200, decimals = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    let raf
    const t = Number(target) || 0
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(decimals === 0 ? Math.round(eased * t) : Number((eased * t).toFixed(decimals)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, decimals])
  return val
}

export default function AdminStats({ products = [] }) {
  const total = products.length
  const newCount = products.filter((p) => p.badge === 'New').length
  const bestCount = products.filter((p) => p.badge === 'Best Seller').length
  const onSaleCount = products.filter((p) => hasDiscount(p)).length
  const totalValue = products.reduce((s, p) => s + (Number(p.price) || 0), 0)
  const avgPrice = total > 0 ? Math.round(totalValue / total) : 0
  const categories = new Set(products.map((p) => p.category)).size

  const c0 = useCounter(total)
  const c1 = useCounter(newCount)
  const c2 = useCounter(bestCount)
  const c3 = useCounter(onSaleCount)
  const c4 = useCounter(avgPrice, 1500)
  const c5 = useCounter(totalValue, 1800)
  const c6 = useCounter(categories)

  const cards = [
    { label: 'Products', value: c0 },
    { label: 'New Arrivals', value: c1, accent: true },
    { label: 'Best Sellers', value: c2 },
    { label: 'On Sale', value: c3, accent: onSaleCount > 0 },
    { label: 'Avg Price', value: formatPrice(c4) },
    { label: 'Catalog Value', value: formatPrice(c5) },
    { label: 'Categories', value: c6 },
  ]

  return (
    <div className="admin-stats">
      {cards.map((c) => (
        <div key={c.label} className={`admin-stat ${c.accent ? 'accent' : ''}`}>
          <div className="admin-stat-label">{c.label}</div>
          <div className="admin-stat-value">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
