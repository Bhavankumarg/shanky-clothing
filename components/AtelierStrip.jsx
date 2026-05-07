'use client'
import { useEffect, useRef } from 'react'
import SafeImg from './SafeImg'

const shots = [
  {
    img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=85&auto=format&fit=crop',
    label: 'Patterning',
    sub: 'Marked by hand · 60 GSM kraft',
  },
  {
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85&auto=format&fit=crop',
    label: 'Tailoring',
    sub: 'Raw lapel · canvas chest',
  },
  {
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85&auto=format&fit=crop',
    label: 'Stitching',
    sub: 'Vintage Singers · 8–9 SPI',
  },
  {
    img: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=900&q=85&auto=format&fit=crop',
    label: 'Finishing',
    sub: 'Pressed · steamed · signed',
  },
]

export default function AtelierStrip() {
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
    <section ref={ref} className="atelier-strip">
      <div className="reveal atelier-strip-head">
        <p className="section-label" style={{ color: '#c94f2a' }}>Behind the seams</p>
        <h2 className="italiana atelier-strip-title">
          Four hands, <span style={{ color: '#c94f2a' }}>one garment.</span>
        </h2>
        <p className="atelier-strip-copy">
          From paper pattern to pressed seam, every menswear piece moves through our Bengaluru atelier in stages — never a rush, never a compromise.
        </p>
      </div>

      <div className="atelier-strip-grid">
        {shots.map((s, i) => (
          <figure
            key={s.label}
            className="reveal atelier-shot"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="atelier-shot-imgwrap">
              <SafeImg src={s.img} alt={s.label} fallbackKey={s.label} className="atelier-shot-img" />
              <span className="atelier-shot-num">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <figcaption className="atelier-shot-cap">
              <span className="atelier-shot-label">{s.label}</span>
              <span className="atelier-shot-sub">{s.sub}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
