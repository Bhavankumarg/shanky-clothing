'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import SafeImg from './SafeImg'

const shirts = [
  {
    img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85&auto=format&fit=crop',
    name: 'Oxford Cotton',
    sub: 'White · Sky · Ecru',
    href: '/collection/oxford-shirt',
  },
  {
    img: 'https://images.unsplash.com/photo-1605908502724-9093a79a1b39?w=900&q=85&auto=format&fit=crop',
    name: 'Relaxed Linen',
    sub: 'Bone · Stone · Olive',
    href: '/collection/linen-long-sleeve',
  },
  {
    img: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=85&auto=format&fit=crop',
    name: 'Mandarin Collar',
    sub: 'Black · Bone · Charcoal',
    href: '/collection/mandarin-collar-shirt',
  },
  {
    img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&q=85&auto=format&fit=crop',
    name: 'Pleated Tuxedo',
    sub: 'White · Ivory',
    href: '/collection/tuxedo-shirt',
  },
  {
    img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=900&q=85&auto=format&fit=crop',
    name: 'Silk Camp',
    sub: 'Ink · Sand · Olive',
    href: '/collection/silk-camp-shirt',
  },
  {
    img: 'https://images.unsplash.com/photo-1607435097405-db48f377bff6?w=900&q=85&auto=format&fit=crop',
    name: 'Brushed Workshirt',
    sub: 'Olive · Slate · Indigo',
    href: '/collection/workshirt',
  },
]

export default function ShirtsEdit() {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.06 }
    )
    ref.current?.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="shirts-edit">
      <div className="reveal shirts-edit-head">
        <div>
          <p className="section-label" style={{ color: '#c94f2a' }}>The Shirts Edit</p>
          <h2 className="italiana shirts-edit-title">
            Six shirts. <span style={{ color: '#c94f2a' }}>One man.</span>
          </h2>
          <p className="shirts-edit-copy">
            From the Monday Oxford to the Saturday camp shirt — six button-ups that cover the week without ever shouting.
          </p>
        </div>
        <Link href="/collection?cat=Shirts" className="shirts-edit-cta">
          See All Shirts →
        </Link>
      </div>

      <div className="shirts-edit-grid">
        {shirts.map((s, i) => (
          <Link
            key={s.name}
            href={s.href}
            className="reveal shirt-card"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <div className="shirt-card-imgwrap">
              <SafeImg src={s.img} alt={s.name} fallbackKey={`shirt-${s.name}`} />
              <div className="shirt-card-overlay" />
            </div>
            <div className="shirt-card-cap">
              <span className="shirt-card-name">{s.name}</span>
              <span className="shirt-card-sub">{s.sub}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
