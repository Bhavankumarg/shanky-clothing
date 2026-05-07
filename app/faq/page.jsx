'use client'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'

const sections = {
  Orders: [
    { q: 'When will my order ship?', a: 'Most orders leave the atelier within 24–48 hours. You\'ll receive a tracking link by email the moment your parcel goes on its way.' },
    { q: 'Can I edit or cancel my order?', a: 'You can edit address or cancel within 30 minutes of placing the order, from your account page. After that, write to us — we\'ll do our best.' },
    { q: 'I never received an order confirmation.', a: 'Check the spam folder first. Still nothing? Email hello@shanky.in with the email you ordered with — we\'ll resend.' },
  ],
  Shipping: [
    { q: 'Do you ship internationally?', a: 'Yes — to over 60 countries. International shipping calculated at checkout. Customs and import duties are the buyer\'s responsibility.' },
    { q: 'How long does shipping take?', a: 'India: 2–6 working days depending on speed. Asia & Middle East: 4–7 days. Europe & North America: 5–10 days.' },
    { q: 'Is shipping free?', a: 'Free standard shipping within India on orders over ₹4,999. Below that, it\'s ₹199 flat. International shipping varies by destination.' },
  ],
  Returns: [
    { q: 'What is your return policy?', a: '30 days from delivery, unworn, with all tags. Free returns on standard items within India. Final-sale and bespoke items cannot be returned.' },
    { q: 'How do refunds work?', a: 'Once we receive and inspect your return (3–5 working days), we\'ll refund to the original payment method. UPI/cards: 5–7 days. COD: bank transfer.' },
    { q: 'Do you offer exchanges?', a: 'Yes — for size only. Initiate an exchange in your account; we\'ll arrange pickup and dispatch the new size as soon as we receive the original.' },
  ],
  Care: [
    { q: 'Do you mend my garment if it tears?', a: 'Yes. Lifetime mend, free, on every Shanky garment. Send it back; we\'ll repair and return within two weeks. You pay only the return shipping.' },
    { q: 'How do I care for linen?', a: 'Cold wash inside out, gentle cycle. Hang dry in shade. Iron on low while slightly damp. Linen softens beautifully with age — don\'t fight the wrinkles.' },
    { q: 'Can my garment be dry cleaned?', a: 'Some pieces prefer dry cleaning (silks, wool tailoring). The garment label is the source of truth — always defer to it.' },
  ],
  Account: [
    { q: 'Do I need an account to order?', a: 'No — guest checkout works. But an account lets you track orders, save addresses, and access easy returns/exchanges.' },
    { q: 'I forgot my password.', a: 'Click "Forgot password" on the sign-in page. A reset link arrives by email within minutes.' },
  ],
}

export default function FAQPage() {
  const [tab, setTab] = useState('Orders')
  const [open, setOpen] = useState(0)

  useEffect(() => {
    setOpen(0)
  }, [tab])

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
        kicker="Help"
        title="Questions"
        accent=", answered."
        subtitle="Quick reads on orders, shipping, returns, garment care and accounts. Can't find your answer? Write to hello@shanky.in — a real human replies."
      />
      <section style={{ padding: '80px 60px 120px', background: '#f5f0e8' }}>
        <div className="tabs reveal" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(sections).map((s) => (
            <button key={s} onClick={() => setTab(s)} className={`tab ${tab === s ? 'active' : ''}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="reveal" style={{ maxWidth: 800, marginTop: 40 }}>
          {sections[tab].map((item, i) => (
            <div key={item.q} className={`acc-item ${open === i ? 'open' : ''}`}>
              <button className="acc-trigger" onClick={() => setOpen(open === i ? -1 : i)}>
                {item.q}
                <span className="acc-icon" />
              </button>
              <div className="acc-content">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 80,
            padding: 36,
            background: '#0a0a0a',
            color: '#f5f0e8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <p className="section-label" style={{ color: '#c94f2a' }}>Still curious?</p>
            <h3 className="italiana" style={{ fontSize: '1.8rem', marginTop: 8, color: '#f5f0e8' }}>
              Write to a real human.
            </h3>
          </div>
          <a href="mailto:hello@shanky.in" className="btn-primary"><span>hello@shanky.in</span></a>
        </div>
      </section>
    </>
  )
}
