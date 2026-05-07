'use client'
import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [sent, setSent] = useState(false)
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', subject: 'General', message: '' })
    }, 4000)
  }

  return (
    <>
      <PageHeader
        kicker="In Touch"
        title="Say"
        accent=" hello."
        subtitle="A real human reads every message. Allow us 1–2 working days for a thoughtful reply."
        image="https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=1600&q=85&auto=format&fit=crop"
      />

      <div className="contact-grid">
        <div className="reveal">
          <h2 className="italiana" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1 }}>
            Send a note.
          </h2>
          <p style={{ color: '#7a7060', marginTop: 14, fontSize: '0.9rem', lineHeight: 1.8 }}>
            Question, complaint, collaboration, or just a hello — write to us below.
          </p>

          <form onSubmit={submit} style={{ marginTop: 36 }}>
            <Field label="Your Name" value={form.name} onChange={update('name')} />
            <Field label="Email" type="email" value={form.email} onChange={update('email')} />

            <div className={`field ${form.subject ? 'filled' : ''}`}>
              <select value={form.subject} onChange={update('subject')}>
                <option>General</option>
                <option>Order Help</option>
                <option>Returns & Repairs</option>
                <option>Wholesale</option>
                <option>Press</option>
                <option>Careers</option>
              </select>
              <label>Subject</label>
            </div>

            <div className={`field ${form.message ? 'filled' : ''}`}>
              <textarea rows={5} value={form.message} onChange={update('message')} placeholder=" " style={{ resize: 'vertical', minHeight: 120 }} />
              <label>Message</label>
            </div>

            <button
              type="submit"
              className="btn-dark"
              style={{ width: '100%', marginTop: 12, transform: sent ? 'scale(0.98)' : 'scale(1)', transition: 'transform 0.2s' }}
            >
              <span>{sent ? '✦ Thank you. We will be in touch.' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        <aside className="reveal">
          <div style={{ background: '#0a0a0a', color: '#f5f0e8', padding: 36, marginBottom: 24 }}>
            <p className="section-label" style={{ color: '#c94f2a' }}>Atelier · Flagship</p>
            <h3 className="italiana" style={{ fontSize: '1.8rem', marginTop: 12, color: '#f5f0e8' }}>
              Bengaluru
            </h3>
            <p style={{ color: '#d4c5a9', fontSize: '0.85rem', lineHeight: 1.85, marginTop: 14, fontWeight: 300 }}>
              14, 5th Cross,<br />
              Indiranagar 1st Stage,<br />
              Bengaluru 560038
            </p>
            <p style={{ color: '#7a7060', fontSize: '0.72rem', letterSpacing: '0.18em', marginTop: 16, textTransform: 'uppercase' }}>
              Tue – Sun · 11:00 – 19:00
            </p>
          </div>

          <div style={{ background: '#ece4d6', padding: 36, marginBottom: 24 }}>
            <p className="section-label">Reach</p>
            <p style={{ marginTop: 14, fontSize: '0.92rem', lineHeight: 2 }}>
              <a href="mailto:hello@shanky.in" style={{ color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: 4 }}>hello@shanky.in</a><br />
              <a href="mailto:press@shanky.in" style={{ color: '#7a7060', textDecoration: 'underline', textUnderlineOffset: 4 }}>press@shanky.in</a><br />
              <span style={{ color: '#7a7060' }}>+91 80 4567 8910</span>
            </p>
          </div>

          <div style={{ height: 280, background: '#d4c5a9', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 280" style={{ display: 'block' }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(10,10,10,0.08)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="280" fill="url(#grid)" />
              <path d="M0 140 Q 100 120 200 140 T 400 140" stroke="#7a7060" strokeWidth="1.5" fill="none" />
              <path d="M0 200 Q 80 180 160 200 T 400 195" stroke="#7a7060" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M180 0 L 180 280" stroke="#7a7060" strokeWidth="1" fill="none" opacity="0.4" />
              <circle cx="220" cy="135" r="10" fill="#c94f2a" />
              <circle cx="220" cy="135" r="22" fill="none" stroke="#c94f2a" strokeWidth="1.5" opacity="0.5">
                <animate attributeName="r" from="10" to="40" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="220" y="170" textAnchor="middle" fontFamily="Bebas Neue" fontSize="14" fill="#0a0a0a" letterSpacing="2">Shanky ATELIER</text>
            </svg>
          </div>
        </aside>
      </div>
    </>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div className={`field ${value ? 'filled' : ''}`}>
      <input type={type} value={value} onChange={onChange} placeholder=" " />
      <label>{label}</label>
    </div>
  )
}
