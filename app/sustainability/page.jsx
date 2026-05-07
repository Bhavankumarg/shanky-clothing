'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import SafeImg from '@/components/SafeImg'

const handsAtWork = [
  { src: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=85&auto=format&fit=crop', label: 'Cutting' },
  { src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85&auto=format&fit=crop', label: 'Tailoring' },
  { src: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=900&q=85&auto=format&fit=crop', label: 'Finishing' },
  { src: 'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=900&q=85&auto=format&fit=crop', label: 'Polishing' },
  { src: 'https://images.unsplash.com/photo-1606293926249-ed22a78f9e76?w=900&q=85&auto=format&fit=crop', label: 'Folding' },
  { src: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&q=85&auto=format&fit=crop', label: 'Packing' },
]

const pillars = [
  {
    n: '01',
    kicker: 'Materials',
    title: 'Only what the earth can return.',
    text: 'Linen, cotton, wool, silk, leather. No synthetics that last 200 years longer than the garment they make. Where we use polyester, it is recycled and traceable.',
  },
  {
    n: '02',
    kicker: 'Atelier',
    title: 'Fair wages, real names.',
    text: 'Every garment is signed by the maker. Twelve full-time tailors, paid above-market, with healthcare and a four-day week. We have known some of them for a decade.',
  },
  {
    n: '03',
    kicker: 'Waste',
    title: 'Cut once, use twice.',
    text: 'Fabric scraps become tote linings, button covers, packaging. Less than 4% of our cutting waste ends up in landfill — and that fraction shrinks every season.',
  },
  {
    n: '04',
    kicker: 'Logistics',
    title: 'Carbon-neutral, every parcel.',
    text: 'Every order ships in recycled-paper mailers, sealed with kraft tape. Emissions are offset through a Western Ghats reforestation cooperative we visit twice a year.',
  },
]

const numbers = [
  { num: '92', suffix: '%', label: 'Natural fibres' },
  { num: '4', suffix: '%', label: 'Cutting waste' },
  { num: '12', suffix: 'yr', label: 'Avg. atelier tenure' },
  { num: '0', suffix: '', label: 'Air freight' },
]

export default function SustainabilityPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <PageHeader
        kicker="Slow by Design"
        title="Sustain"
        accent="ability"
        subtitle="We don't call it sustainable. We call it the only way we know how to make menswear. Real numbers, plain language — read on."
        image="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=85&auto=format&fit=crop"
      />

      <section className="sustain-numbers-section">
        <div className="reveal grid r-grid-4" style={{ textAlign: 'center' }}>
          {numbers.map((n, i) => (
            <div key={n.label} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: '#f5f0e8', lineHeight: 1 }}>
                {n.num}
                <span style={{ color: '#c94f2a' }}>{n.suffix}</span>
              </div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#7a7060', marginTop: 10 }}>
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="sustain-pillars-section">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="section-label">Four commitments</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginTop: 14 }}>
            What we promise.
          </h2>
        </div>

        <div className="grid r-grid-2">
          {pillars.map((p, i) => (
            <div
              key={p.n}
              className="reveal pillar"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="pillar-num">{p.n}</span>
              <p className="section-label" style={{ marginTop: 12 }}>{p.kicker}</p>
              <h3 className="italiana" style={{ fontSize: '1.7rem', marginTop: 12, lineHeight: 1.2 }}>
                {p.title}
              </h3>
              <p style={{ color: '#7a7060', fontSize: '0.88rem', lineHeight: 1.85, marginTop: 14, fontWeight: 300 }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="sustain-hands-section">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label">Inside the atelier</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1, marginTop: 14, color: '#f5f0e8' }}>
            Six hands per garment.
          </h2>
        </div>
        <div className="hands-grid">
          {handsAtWork.map((h, i) => (
            <figure key={h.label} className="reveal hands-cell" style={{ transitionDelay: `${i * 60}ms` }}>
              <SafeImg src={h.src} alt={h.label} fallbackKey={`hand-${h.label}`} />
              <figcaption>{h.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sustain-feature-section">
        <div className="reveal r-grid-2 r-gap-60" style={{ alignItems: 'center' }}>
          <SafeImg
            src="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1000&q=85&auto=format&fit=crop"
            alt="Reforestation"
            fallbackKey="reforestation"
            className="sustain-feature-img"
          />
          <div>
            <p className="section-label">Western Ghats Project</p>
            <h2 className="italiana" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1, marginTop: 14 }}>
              For every order, a tree.
            </h2>
            <p style={{ color: '#7a7060', fontSize: '0.92rem', lineHeight: 1.85, marginTop: 18, fontWeight: 300 }}>
              Since 2021, we have planted 28,400 native saplings across degraded land in Karnataka and Kerala — in
              partnership with a women-led cooperative that monitors growth and biodiversity year-round.
              You can adopt a sapling at checkout for ₹49.
            </p>
            <Link href="/about" className="btn-dark" style={{ marginTop: 28 }}>
              <span>Read our story</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
