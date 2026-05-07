'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Hero() {
  const imgRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return
      const scrolled = window.scrollY
      if (scrolled < window.innerHeight) {
        imgRef.current.style.transform = `scale(1) translateY(${scrolled * 0.18}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="home" className="hero-section">
      <div className="hero-left">
        <div className="hero-bg-text">SHANKY</div>

        <p className="hero-tag section-label mb-5">SS 2025 · The Men's Edit</p>

        <h1 className="hero-title">
          Wear<br />
          <span style={{ color: '#c94f2a' }}>Nothing</span><br />
          Ordinary
        </h1>

        <p className="hero-sub mt-7 font-light">
          Menswear for those who live between the lines. Minimal form, maximum statement. Slow-made tailoring, knits, denim and leather — built season after season.
        </p>

        <div className="hero-btns flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10">
          <Link href="/collection" className="btn-primary">
            <span>Shop Collection</span>
          </Link>
          <Link href="/lookbook" className="btn-ghost">Lookbook</Link>
        </div>

        {/* <div className="scroll-indicator">
          <div
            className="scroll-line"
            style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, #c94f2a, transparent)' }}
          />
          <span className="scroll-indicator-text">Scroll</span>
        </div> */}
      </div>

      <div className="hero-right">
        <div className="hero-img-wrapper">
          <img
            ref={imgRef}
            src="/shanky-banner.jpg"
            alt="Black and white editorial portrait — Shanky SS25"
            className="hero-img"
            onError={(e) => {
              // Fallback to a B&W Unsplash image if the local file is missing.
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1400&q=90&auto=format&fit=crop'
            }}
          />
          <div className="hero-img-overlay" />
          <div className="hero-img-grain" />
          <div className="hero-frame-corners">
            <span /><span /><span /><span />
          </div>
        </div>
        <div className="hero-label">New Drop · 24 Pieces</div>
        {/* <div className="hero-credit">
          B&amp;W · 35mm · Anaya Kapoor
        </div> */}
      </div>
    </section>
  )
}
