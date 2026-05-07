'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { formatPrice } from '@/lib/products'

function ConfirmInner() {
  const sp = useSearchParams()
  const id = sp.get('id') || 'SHK-XXXXX'
  const total = Number(sp.get('total') || 0)
  const email = sp.get('email') || ''
  const emailWarn = sp.get('emailWarn') === '1'

  const today = new Date()
  const eta = new Date(today.getTime() + 5 * 86400000)
  const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <section className="confirm-page">
      <div className="confirm-bg" />
      <div style={{ textAlign: 'center', position: 'relative', maxWidth: 560 }}>
        <div className="check-mark">
          <svg viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="50" />
            <path d="M35 56 L50 70 L78 42" />
          </svg>
        </div>

        <p className="section-label" style={{ marginTop: 28 }}>Order Confirmed</p>
        <h1 className="italiana" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginTop: 14, lineHeight: 1.05 }}>
          Thank you. <span style={{ color: '#c94f2a' }}>Truly.</span>
        </h1>
        <p style={{ color: '#7a7060', maxWidth: 460, margin: '20px auto 0', lineHeight: 1.85, fontWeight: 300 }}>
          Your order has been placed. We are folding it by hand right now.
          {email && !emailWarn && (
            <> A full receipt was just emailed to <strong style={{ color: '#0a0a0a' }}>{email}</strong>.</>
          )}
        </p>

        {emailWarn && (
          <div
            style={{
              marginTop: 18,
              padding: '12px 18px',
              background: 'rgba(201,79,42,0.08)',
              borderLeft: '2px solid #c94f2a',
              fontSize: '0.82rem',
              color: '#0a0a0a',
              textAlign: 'left',
              maxWidth: 460,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            We placed your order, but the confirmation email could not be delivered to <strong>{email}</strong>.
            Please write to <a href="mailto:hello@shanky.in" style={{ color: '#c94f2a' }}>hello@shanky.in</a> with order ID <strong>{id}</strong> and we'll resend it.
          </div>
        )}

        <div
          style={{
            marginTop: 40,
            padding: 28,
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(10,10,10,0.08)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            textAlign: 'left',
          }}
        >
          <div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.32em', color: '#7a7060', textTransform: 'uppercase' }}>Order ID</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', marginTop: 6 }}>{id}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.32em', color: '#7a7060', textTransform: 'uppercase' }}>Total Paid</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', marginTop: 6, color: '#c94f2a' }}>
              {formatPrice(total)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.32em', color: '#7a7060', textTransform: 'uppercase' }}>Estimated Delivery</p>
            <p style={{ fontSize: '0.95rem', marginTop: 6 }}>{fmt(today)} – {fmt(eta)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.32em', color: '#7a7060', textTransform: 'uppercase' }}>Email</p>
            <p style={{ fontSize: '0.92rem', marginTop: 6, wordBreak: 'break-all' }}>{email || 'Sent to your inbox'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <Link href="/collection" className="btn-dark"><span>Continue Shopping</span></Link>
          <Link href="/contact" className="filter-chip" style={{ display: 'inline-flex', alignItems: 'center' }}>
            Contact us
          </Link>
        </div>

        <p style={{ marginTop: 40, fontSize: '0.82rem', color: '#7a7060', fontStyle: 'italic', fontFamily: "'Italiana', serif" }}>
          "What you wear becomes you. Wear nothing ordinary." — SHAN<span style={{ color: '#c94f2a' }}>KY</span>
        </p>
      </div>
    </section>
  )
}

export default function Confirmed() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  )
}
