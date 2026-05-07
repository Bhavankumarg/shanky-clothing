'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

export default function ShippingReturnsPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const ship = [
    ['Standard (India)', '4–6 working days', 'Free over ₹4,999 · ₹199 below'],
    ['Express (India)', '2–3 working days', '₹299'],
    ['Next-Day (Metro)', '1 working day · Mon–Fri', '₹499'],
    ['Asia / Middle East', '4–7 working days', 'From ₹1,200'],
    ['Europe / North America', '5–10 working days', 'From ₹1,800'],
    ['Rest of World', '7–14 working days', 'Calculated at checkout'],
  ]

  const returns = [
    { kicker: '01', title: 'Begin a return', text: 'From your account, or by emailing returns@shanky.in. You\'ll receive a prepaid label within hours.' },
    { kicker: '02', title: 'Send it back', text: 'Drop the labelled parcel at any partnered courier point. Free pickups available on most pincodes.' },
    { kicker: '03', title: 'We inspect', text: 'Within 3–5 working days of receiving. Tags, no wear, original packaging — that\'s all we ask.' },
    { kicker: '04', title: 'Refund issued', text: 'To your original payment method. Cards/UPI: 5–7 days. COD: bank transfer to your saved account.' },
  ]

  return (
    <>
      <PageHeader
        kicker="Logistics"
        title="Shipping"
        accent=" & Returns."
        subtitle="Plain rules, no fine print. Ship fast or ship slow, send it back if it doesn't feel right — for thirty whole days."
      />

      <section style={{ padding: '100px 60px', background: '#f5f0e8' }}>
        <div className="reveal" style={{ marginBottom: 24 }}>
          <p className="section-label">Shipping</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 14 }}>
            How it gets to you.
          </h2>
        </div>
        <div className="reveal" style={{ overflowX: 'auto' }}>
          <table className="size-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Estimated Time</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {ship.map(([s, t, c]) => (
                <tr key={s}>
                  <td style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>{s}</td>
                  <td>{t}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="reveal" style={{ marginTop: 18, fontSize: '0.78rem', color: '#7a7060', lineHeight: 1.7 }}>
          International orders may incur customs duties and import taxes, which are the buyer's responsibility and not collected by Shanky.
        </p>
      </section>

      <section style={{ padding: '100px 60px', background: '#ece4d6' }}>
        <div className="reveal" style={{ marginBottom: 40 }}>
          <p className="section-label">Returns</p>
          <h2 className="italiana" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: 14 }}>
            Four steps. Thirty days.
          </h2>
        </div>
        <div className="grid r-grid-4">
          {returns.map((r, i) => (
            <div key={r.kicker} className="reveal pillar" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="pillar-num">{r.kicker}</span>
              <h3 className="italiana" style={{ fontSize: '1.4rem', marginTop: 12, lineHeight: 1.2 }}>{r.title}</h3>
              <p style={{ color: '#7a7060', fontSize: '0.85rem', lineHeight: 1.8, marginTop: 12, fontWeight: 300 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 60px', background: '#0a0a0a', color: '#f5f0e8', textAlign: 'center' }}>
        <p className="section-label" style={{ color: '#c94f2a' }}>Lifetime Mend</p>
        <h2 className="italiana" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#f5f0e8', marginTop: 14, lineHeight: 1.1 }}>
          Tear a seam? <span style={{ color: '#c94f2a' }}>Send it back.</span>
        </h2>
        <p style={{ color: '#d4c5a9', maxWidth: 520, margin: '20px auto 32px', fontSize: '0.92rem', lineHeight: 1.85, fontWeight: 300 }}>
          Every garment ships with a lifetime mend promise. Lost a button, blown out a heel, ripped a hem — return it,
          we repair it, free. You only pay return shipping.
        </p>
        <Link href="/contact" className="btn-primary"><span>Initiate a Mend</span></Link>
      </section>
    </>
  )
}
