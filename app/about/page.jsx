'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import SafeImg from '@/components/SafeImg'

const timeline = [
  { year: '2013', title: 'A small flat in Indiranagar', text: 'Started with two sewing machines, three friends, and a stubborn idea: clothing that lasts longer than a season.' },
  { year: '2017', title: 'The first atelier', text: 'Moved into a 600-square-foot studio in Domlur. Hired our first three pattern cutters from a generations-old tailoring family.' },
  { year: '2021', title: 'Carbon-neutral shipping', text: 'Partnered with a Western Ghats reforestation cooperative to offset every parcel we send. Still going.' },
  { year: '2025', title: 'Lifetime mend', text: 'Every garment now ships with a lifetime repair promise. Send it back — we mend it, free.' },
]

const values = [
  {
    kicker: 'Made slow',
    title: 'A garment a day, not a hundred',
    text: 'Our atelier turns out fewer than 200 men\'s pieces a season. Each one passes through six pairs of hands, including a final review by our founder.',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85&auto=format&fit=crop',
  },
  {
    kicker: 'Worn long',
    title: 'Designed for the tenth year',
    text: 'We sketch with longevity in mind. If it will look out of place in a decade, we don\'t make it. The opposite of trend.',
    img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop',
  },
  {
    kicker: 'Mended often',
    title: 'Repair is part of the design',
    text: 'Buttons, hems, lapels, soles — built to be fixed. Tags include repair instructions. Send it back if you\'d rather we did it.',
    img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=85&auto=format&fit=crop',
  },
]

export default function AboutPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))

    const onScroll = () => {
      document.querySelectorAll('.parallax').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        if (inView) {
          const speed = parseFloat(el.dataset.speed || 0.18)
          const offset = (rect.top - window.innerHeight / 2) * speed * -1
          el.style.transform = `translateY(${offset}px)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <PageHeader
        kicker="Our Story"
        title="Twelve years"
        accent=" of slow menswear."
        subtitle="Shanky is a Bengaluru atelier making men's clothing the old way: one stitch at a time, by hands that know the difference between work and craft."
        image="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=85&auto=format&fit=crop"
      />

      {/* INTRO */}
      <section className="about-intro-section">
        <div className="reveal" style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p className="italiana" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', lineHeight: 1.5, color: '#0a0a0a' }}>
            "We started Shanky because we were tired. Tired of menswear that broke after a season, of shopping that felt like noise.
            We wanted clothing a man could put on and forget — in the best way."
          </p>
          <p style={{ marginTop: 28, color: '#7a7060', fontSize: '0.78rem', letterSpacing: '0.32em', textTransform: 'uppercase' }}>
            — Arjun Mathur, Founder
          </p>
        </div>
      </section>

      {/* PARALLAX SHOWPIECE */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden', background: '#0a0a0a' }}>
        <SafeImg
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=85&auto=format&fit=crop"
          alt="Atelier"
          fallbackKey="about-parallax"
          className="parallax"
          data-speed="0.25"
          style={{
            position: 'absolute', inset: '-10% 0',
            width: '100%', height: '120%',
            objectFit: 'cover',
            filter: 'grayscale(100%) contrast(1.08) brightness(0.55)',
            willChange: 'transform',
          }}
        />
        <div
          className="reveal"
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 40,
          }}
        >
          <div>
            <p className="section-label" style={{ color: '#c94f2a' }}>Inside the atelier</p>
            <h2
              className="italiana"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: '#f5f0e8', lineHeight: 1.1, marginTop: 14 }}
            >
              Six pairs of hands.<br />
              <span style={{ color: '#c94f2a' }}>One garment.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values-section">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="section-label">What we believe</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginTop: 14, lineHeight: 1.1 }}>
            Three quiet rules.
          </h2>
        </div>
        <div className="grid r-grid-3 about-values-grid">
          {values.map((v, i) => (
            <article
              key={v.title}
              className="reveal value-card"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="value-card-imgwrap">
                <SafeImg src={v.img} alt={v.title} fallbackKey={`value-${i}`} />
                <span className="value-card-num">0{i + 1}</span>
              </div>
              <div className="value-card-body">
                <p className="section-label">{v.kicker}</p>
                <h3 className="italiana value-card-title">{v.title}</h3>
                <p className="value-card-text">{v.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="about-timeline-section">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ color: '#c94f2a' }}>The road so far</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginTop: 14, color: '#f5f0e8', lineHeight: 1.1 }}>
            A short timeline.
          </h2>
        </div>
        <div className="timeline">
          {timeline.map((t, i) => (
            <div
              key={t.year}
              className="reveal"
              style={{ transitionDelay: `${i * 100}ms`, borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 24 }}
            >
              <span className="timeline-year">{t.year}</span>
              <h4
                className="italiana"
                style={{ fontSize: '1.4rem', marginTop: 8, color: '#f5f0e8' }}
              >
                {t.title}
              </h4>
              <p style={{ color: '#7a7060', fontSize: '0.85rem', lineHeight: 1.85, marginTop: 12, fontWeight: 300 }}>
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <h2 className="italiana reveal" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.1, color: '#0a0a0a' }}>
          Visit the atelier.
        </h2>
        <p
          className="reveal"
          style={{ color: '#7a7060', maxWidth: 520, margin: '20px auto 36px', fontSize: '0.92rem', lineHeight: 1.85, fontWeight: 300 }}
        >
          By appointment, weekdays. We'll pour the chai. <br />
          14, 5th Cross, Indiranagar 1st Stage, Bengaluru 560038.
        </p>
        <Link href="/contact" className="btn-dark"><span>Book a Visit</span></Link>
      </section>
    </>
  )
}
