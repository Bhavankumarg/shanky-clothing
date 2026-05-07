'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import SafeImg from '@/components/SafeImg'

// Editorial mix: neck-down menswear shots + atelier process + material details.
const editorial = [
  { src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1400&q=85&auto=format&fit=crop', label: 'I · The Long Coat', col: 'span 6', row: 'span 2' },
  { src: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1400&q=85&auto=format&fit=crop', label: 'II · The Open Collar', col: 'span 6', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1400&q=85&auto=format&fit=crop', label: 'III · The Long Walk', col: 'span 3', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1400&q=85&auto=format&fit=crop', label: 'IV · Soft Architecture', col: 'span 3', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=1400&q=85&auto=format&fit=crop', label: 'V · Studies in Drape', col: 'span 4', row: 'span 2' },
  { src: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=1400&q=85&auto=format&fit=crop', label: 'VI · Easy Volume', col: 'span 8', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=1400&q=85&auto=format&fit=crop', label: 'VII · The Loafer', col: 'span 4', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1400&q=85&auto=format&fit=crop', label: 'VIII · The Indigo Hour', col: 'span 4', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=85&auto=format&fit=crop', label: 'IX · Hands at the Hem', col: 'span 4', row: 'span 1' },
  { src: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=1400&q=85&auto=format&fit=crop', label: 'X · Closing', col: 'span 12', row: 'span 1' },
]

export default function LookbookPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <PageHeader
        kicker="Spring · Summer 2025 · The Men's Edit"
        title="Lookbook"
        accent=" 25"
        subtitle="A study in stillness, shot in the salt-bleached light of the Konkan coast over four mornings. Ten men's pieces, one quiet wardrobe — photographed by Anaya Kapoor and styled in our Bengaluru atelier."
        image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1600&q=85&auto=format&fit=crop"
      />

      <div className="lb-grid" style={{ gridAutoRows: '32vh' }}>
        {editorial.map((e, i) => (
          <div
            key={i}
            className="lb-cell reveal"
            style={{ gridColumn: e.col, gridRow: e.row, transitionDelay: `${i * 60}ms` }}
          >
            <SafeImg src={e.src} alt={e.label} fallbackKey={e.label} />
            <span className="lb-cell-text">{e.label}</span>
          </div>
        ))}
      </div>

      <section style={{ background: '#0a0a0a', padding: '120px 60px', textAlign: 'center' }}>
        <p className="section-label" style={{ color: '#c94f2a' }}>Credits</p>
        <h3 className="italiana" style={{ color: '#f5f0e8', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginTop: 14, lineHeight: 1.2 }}>
          Photography · <span style={{ color: '#c94f2a' }}>Anaya Kapoor</span><br />
          Direction · Arjun Mathur<br />
          Models · Tarun, Neil, Dev
        </h3>
        <Link href="/collection" className="btn-primary" style={{ marginTop: 36 }}>
          <span>Shop the Lookbook</span>
        </Link>
      </section>
    </>
  )
}
