'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import SafeImg from './SafeImg'

const moods = [
  {
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85&auto=format&fit=crop',
    kicker: 'Outerwear',
    title: 'The Long Topcoat',
    text: 'Italian virgin wool, notch lapels, half-belted back. Built for ten winters.',
    href: '/collection?cat=Outerwear',
  },
  {
    img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop',
    kicker: 'Tailoring',
    title: 'Quiet Tailoring',
    text: 'Boxy shoulder, raw-edge hem, hidden tab. Wool-cashmere blend, finished by hand.',
    href: '/collection?cat=Tailoring',
  },
  {
    img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=900&q=85&auto=format&fit=crop',
    kicker: 'Denim',
    title: 'The Indigo Hour',
    text: '12oz Okayama selvedge with horn buttons. Stiff at first; broken in over months.',
    href: '/collection?cat=Denim',
  },
]

export default function EditorialStrip() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="editorial-strip">
      <div className="reveal editorial-head">
        <p className="section-label">Wear by mood</p>
        <h2 className="italiana editorial-title">Three studies in stillness.</h2>
      </div>

      <div className="editorial-grid">
        {moods.map((m, i) => (
          <Link
            key={m.title}
            href={m.href}
            className="reveal editorial-card"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="editorial-img-wrap">
              <SafeImg src={m.img} alt={m.title} fallbackKey={m.title} />
              <div className="editorial-img-overlay" />
            </div>
            <div className="editorial-card-body">
              <p className="section-label">{m.kicker}</p>
              <h3 className="italiana editorial-card-title">{m.title}</h3>
              <p className="editorial-card-text">{m.text}</p>
              <span className="editorial-card-cta">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
