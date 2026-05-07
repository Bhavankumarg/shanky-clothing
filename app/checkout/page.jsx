'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import { formatPrice } from '@/lib/products'

const upiApps = [
  { name: 'Google Pay', short: 'GPay', bg: '#4285F4' },
  { name: 'PhonePe', short: 'PPe', bg: '#5F259F' },
  { name: 'Paytm', short: 'Pay', bg: '#00BAF2' },
  { name: 'BHIM UPI', short: 'BHIM', bg: '#F7941D' },
  { name: 'Amazon Pay', short: 'Apay', bg: '#FF9900' },
  { name: 'Cred', short: 'Cred', bg: '#000000' },
  { name: 'WhatsApp Pay', short: 'WA', bg: '#25D366' },
  { name: 'Other UPI', short: 'UPI', bg: '#7a7060' },
]

const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'IndusInd Bank', 'IDFC First']

const wallets = [
  { name: 'Paytm Wallet', bg: '#00BAF2' },
  { name: 'PhonePe Wallet', bg: '#5F259F' },
  { name: 'Amazon Pay', bg: '#FF9900' },
  { name: 'Mobikwik', bg: '#0066B2' },
]

const bnpl = [
  { name: 'Simpl', desc: 'Buy now, pay in 15 days. No cost.', bg: '#1A1F71' },
  { name: 'LazyPay', desc: 'Pay later in one click. ₹1 lakh limit.', bg: '#7B68EE' },
]

const PAY_LABEL = {
  upi: 'UPI',
  card: 'Credit / Debit Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
  emi: 'EMI',
  bnpl: 'Pay Later',
  cod: 'Cash on Delivery',
}

const validEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, savings, clear } = useCart()
  const shipping = subtotal === 0 ? 0 : subtotal >= 4999 ? 0 : 199
  const total = subtotal + shipping

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    pincode: '',
    state: '',
  })

  // Email verification
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otpMsg, setOtpMsg] = useState('')
  const [devCode, setDevCode] = useState('')

  const [shipMethod, setShipMethod] = useState('standard')
  const [payMethod, setPayMethod] = useState('upi')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [bank, setBank] = useState(banks[0])
  const [emi, setEmi] = useState(6)
  const [processing, setProcessing] = useState(false)
  const [orderError, setOrderError] = useState('')

  const update = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    if (k === 'email') {
      // Email changed → reset verification
      setVerified(false)
      setOtpSent(false)
      setOtp('')
      setOtpMsg('')
      setDevCode('')
    }
  }

  if (items.length === 0 && !processing) {
    return (
      <section className="checkout-page" style={{ minHeight: '60vh', textAlign: 'center', paddingTop: 200 }}>
        <p className="italiana" style={{ fontSize: '2.4rem' }}>Your bag is empty.</p>
        <Link href="/collection" className="btn-dark" style={{ marginTop: 24 }}>
          <span>Browse Collection</span>
        </Link>
      </section>
    )
  }

  const sendOtp = async () => {
    if (!validEmail(form.email)) {
      setOtpMsg('Please enter a valid email first.')
      return
    }
    setSending(true)
    setOtpMsg('')
    setDevCode('')
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setOtpMsg(data.error || 'Could not send code. Try again.')
      } else {
        setOtpSent(true)
        if (data.dev && data.devCode) {
          setDevCode(data.devCode)
          setOtpMsg(`Code sent. Dev mode: ${data.devCode}`)
        } else {
          setOtpMsg(`Code sent to ${form.email}. Check your inbox.`)
        }
      }
    } catch (e) {
      setOtpMsg('Network error. Try again.')
    }
    setSending(false)
  }

  const verifyOtpCode = async () => {
    if (otp.length !== 6) {
      setOtpMsg('Enter the 6-digit code.')
      return
    }
    setVerifying(true)
    setOtpMsg('')
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: otp }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setOtpMsg(data.error || 'Verification failed.')
      } else {
        setVerified(true)
        setOtpMsg('')
      }
    } catch {
      setOtpMsg('Network error. Try again.')
    }
    setVerifying(false)
  }

  const goNext = async () => {
    setOrderError('')
    if (step === 1) {
      if (!form.email || !form.fullName || !form.address || !form.city || !form.pincode) {
        alert('Please fill in all required fields.')
        return
      }
      if (!verified) {
        setOtpMsg('Please verify your email before continuing.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      // Place order
      if (!verified) {
        setOrderError('Please verify your email first.')
        setStep(1)
        return
      }
      setProcessing(true)
      try {
        const res = await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            items,
            address: {
              fullName: form.fullName,
              phone: form.phone,
              address: form.address,
              address2: form.address2,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            },
            payment: PAY_LABEL[payMethod] || 'Online',
            totals: { subtotal, shipping, total, savings },
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) {
          setOrderError(data.error || 'Could not place order.')
          setProcessing(false)
          return
        }
        clear()
        const params = new URLSearchParams({
          id: data.orderId,
          total: String(total),
          email: form.email,
        })
        if (data.emailSent === false) params.set('emailWarn', '1')
        router.push(`/order-confirmed?${params.toString()}`)
      } catch (e) {
        setOrderError('Network error. Try again.')
        setProcessing(false)
      }
    }
  }

  const goBack = () => step > 1 && setStep(step - 1)

  return (
    <section className="checkout-page">
      <p className="section-label" style={{ marginBottom: 12 }}>Checkout</p>
      <h1 className="italiana" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: 36, lineHeight: 1.1 }}>
        Almost <span style={{ color: '#c94f2a' }}>yours.</span>
      </h1>

      <div className="steps">
        {['Address', 'Shipping', 'Payment'].map((label, i) => {
          const n = i + 1
          const cls = step === n ? 'active' : step > n ? 'done' : ''
          return (
            <div key={label} className="step-wrap">
              <span className={`step ${cls}`}>
                <span className="step-dot">{step > n ? '✓' : n}</span>
                <span className="step-label">{label}</span>
              </span>
              {n < 3 && <span className="step-line" />}
            </div>
          )
        })}
      </div>

      <div className="checkout-grid">
        <div>
          {step === 1 && (
            <div className="reveal visible">
              <h2 className="italiana" style={{ fontSize: '2rem', marginBottom: 20 }}>Where shall we send it?</h2>

              {/* Email + verification */}
              <div className={`field ${form.email ? 'filled' : ''}`} style={{ marginBottom: 8 }}>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder=" "
                  disabled={verified}
                  style={{ paddingRight: verified ? 110 : 124 }}
                />
                <label>Email</label>
                {!verified && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={sending || !validEmail(form.email)}
                    className="email-verify-btn"
                  >
                    {sending ? 'Sending…' : otpSent ? 'Resend' : 'Send code'}
                  </button>
                )}
                {verified && <span className="email-verified">✓ Verified</span>}
              </div>

              {otpSent && !verified && (
                <div className="otp-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    className="otp-input"
                  />
                  <button
                    type="button"
                    onClick={verifyOtpCode}
                    disabled={verifying || otp.length !== 6}
                    className="otp-verify-btn"
                  >
                    {verifying ? 'Verifying…' : 'Verify'}
                  </button>
                </div>
              )}

              {otpMsg && (
                <p className={`otp-msg ${verified ? 'ok' : devCode ? 'dev' : 'info'}`}>
                  {otpMsg}
                </p>
              )}

              <div style={{ height: 12 }} />

              <Field label="Full Name" value={form.fullName} onChange={update('fullName')} />
              <Field label="Phone (10-digit)" value={form.phone} onChange={update('phone')} type="tel" />
              <Field label="Street Address" value={form.address} onChange={update('address')} />
              <Field label="Apartment, suite (optional)" value={form.address2} onChange={update('address2')} />
              <div className="field-row">
                <Field label="City" value={form.city} onChange={update('city')} />
                <Field label="Pincode" value={form.pincode} onChange={update('pincode')} />
              </div>
              <Field label="State" value={form.state} onChange={update('state')} />
            </div>
          )}

          {step === 2 && (
            <div className="reveal visible">
              <h2 className="italiana" style={{ fontSize: '2rem', marginBottom: 20 }}>How fast?</h2>
              {[
                { id: 'standard', name: 'Standard', sub: '4–6 working days', price: shipping === 0 ? 'Free' : formatPrice(shipping) },
                { id: 'express', name: 'Express', sub: '2–3 working days', price: '₹ 299' },
                { id: 'next', name: 'Next-Day Metro', sub: 'Mon–Fri · select cities', price: '₹ 499' },
              ].map((s) => (
                <label key={s.id} className={`pay-method ${shipMethod === s.id ? 'active' : ''}`}>
                  <div className="pay-method-head">
                    <div className="pay-method-name">
                      <span className="pay-radio" />
                      <span>
                        {s.name}
                        <small style={{ display: 'block', fontWeight: 300, color: '#7a7060', marginTop: 2, fontSize: '0.78rem', letterSpacing: 0 }}>
                          {s.sub}
                        </small>
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                      {s.price}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="ship"
                    checked={shipMethod === s.id}
                    onChange={() => setShipMethod(s.id)}
                    style={{ position: 'absolute', opacity: 0 }}
                  />
                </label>
              ))}

              <div style={{ marginTop: 24, padding: 18, background: 'rgba(201,79,42,0.06)', borderLeft: '2px solid #c94f2a' }}>
                <p style={{ fontSize: '0.78rem', color: '#0a0a0a', lineHeight: 1.7 }}>
                  <strong style={{ color: '#c94f2a', letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.65rem' }}>Carbon-neutral</strong>
                  <br />
                  Every shipment is offset through a verified reforestation partner in the Western Ghats.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="reveal visible">
              <h2 className="italiana" style={{ fontSize: '2rem', marginBottom: 20 }}>How would you like to pay?</h2>

              {/* UPI */}
              <label className={`pay-method ${payMethod === 'upi' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>UPI</span>
                  </div>
                  <div className="pay-logos">
                    <span className="pay-logo" style={{ background: '#4285F4', color: '#fff' }}>GPay</span>
                    <span className="pay-logo" style={{ background: '#5F259F', color: '#fff' }}>PPe</span>
                    <span className="pay-logo" style={{ background: '#00BAF2', color: '#fff' }}>Paytm</span>
                    <span className="pay-logo" style={{ background: '#F7941D', color: '#fff' }}>BHIM</span>
                  </div>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'upi'} onChange={() => setPayMethod('upi')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <p style={{ fontSize: '0.82rem', color: '#2a2a2a', marginBottom: 14 }}>
                    Pay instantly with any UPI app:
                  </p>
                  <div className="upi-grid">
                    {upiApps.map((u) => (
                      <button key={u.name} className="upi-app" type="button">
                        <span className="upi-icon" style={{ background: u.bg }}>{u.short}</span>
                        <span className="upi-name">{u.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="field" style={{ marginTop: 18 }}>
                    <input placeholder=" " />
                    <label>or enter UPI ID (yourname@bank)</label>
                  </div>
                </div>
              </label>

              {/* CARD */}
              <label className={`pay-method ${payMethod === 'card' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>Credit / Debit Card</span>
                  </div>
                  <div className="pay-logos">
                    {['Visa', 'MC', 'Amex', 'RuPay'].map((c) => (
                      <span key={c} className="pay-logo">{c}</span>
                    ))}
                  </div>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'card'} onChange={() => setPayMethod('card')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <Field
                    label="Card Number"
                    value={card.number}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
                      setCard((c) => ({ ...c, number: v }))
                    }}
                  />
                  <Field label="Cardholder Name" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} />
                  <div className="field-row">
                    <Field
                      label="MM / YY"
                      value={card.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2)
                        setCard((c) => ({ ...c, expiry: v }))
                      }}
                    />
                    <Field label="CVV" value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#7a7060', marginTop: 4, letterSpacing: '0.05em' }}>
                    🔒 256-bit SSL encrypted · We never store your card details.
                  </p>
                </div>
              </label>

              {/* NET BANKING */}
              <label className={`pay-method ${payMethod === 'netbanking' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>Net Banking</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#7a7060', letterSpacing: '0.1em' }}>50+ Indian banks</span>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'netbanking'} onChange={() => setPayMethod('netbanking')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <div className="bank-grid">
                    {banks.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBank(b)}
                        className={`filter-chip ${bank === b ? 'active' : ''}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '12px 16px' }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#7a7060', marginTop: 14 }}>
                    You'll be redirected to <strong style={{ color: '#0a0a0a' }}>{bank}</strong> to complete payment securely.
                  </p>
                </div>
              </label>

              {/* WALLETS */}
              <label className={`pay-method ${payMethod === 'wallet' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>Wallets</span>
                  </div>
                  <div className="pay-logos">
                    {wallets.slice(0, 3).map((w) => (
                      <span key={w.name} className="pay-logo" style={{ background: w.bg, color: '#fff' }}>{w.name.split(' ')[0]}</span>
                    ))}
                  </div>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'wallet'} onChange={() => setPayMethod('wallet')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <div className="bank-grid">
                    {wallets.map((w) => (
                      <button
                        key={w.name}
                        type="button"
                        className="filter-chip"
                        style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '14px 16px' }}
                      >
                        <span style={{ display: 'inline-block', width: 8, height: 8, background: w.bg, borderRadius: '50%', marginRight: 10 }} />
                        {w.name}
                      </button>
                    ))}
                  </div>
                </div>
              </label>

              {/* EMI */}
              <label className={`pay-method ${payMethod === 'emi' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>EMI <small style={{ color: '#c94f2a', letterSpacing: '0.05em', marginLeft: 8, fontSize: '0.72rem' }}>· No-cost on cards</small></span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#7a7060', letterSpacing: '0.1em' }}>From {formatPrice(Math.round(total / 12))}/mo</span>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'emi'} onChange={() => setPayMethod('emi')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <div className="emi-row">
                    {[3, 6, 9, 12].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`emi-pill ${emi === n ? 'active' : ''}`}
                        onClick={() => setEmi(n)}
                      >
                        {n} months
                        <small>{formatPrice(Math.round(total / n))}/mo</small>
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#7a7060', marginTop: 12 }}>
                    Available on HDFC, ICICI, Axis, Kotak, Yes Bank credit cards. Bajaj Finserv supported.
                  </p>
                </div>
              </label>

              {/* BNPL */}
              <label className={`pay-method ${payMethod === 'bnpl' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>Pay Later</span>
                  </div>
                  <div className="pay-logos">
                    {bnpl.map((b) => (
                      <span key={b.name} className="pay-logo" style={{ background: b.bg, color: '#fff' }}>{b.name}</span>
                    ))}
                  </div>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'bnpl'} onChange={() => setPayMethod('bnpl')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <div className="bank-grid">
                    {bnpl.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        className="filter-chip"
                        style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '14px 16px', flexDirection: 'column', alignItems: 'flex-start' }}
                      >
                        <strong style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>{b.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#7a7060', textTransform: 'none', letterSpacing: 0, marginTop: 4 }}>
                          {b.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </label>

              {/* COD */}
              <label className={`pay-method ${payMethod === 'cod' ? 'active' : ''}`}>
                <div className="pay-method-head">
                  <div className="pay-method-name">
                    <span className="pay-radio" />
                    <span>Cash on Delivery</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#7a7060', letterSpacing: '0.1em' }}>+ ₹40 handling</span>
                </div>
                <input type="radio" name="pay" checked={payMethod === 'cod'} onChange={() => setPayMethod('cod')} style={{ position: 'absolute', opacity: 0 }} />
                <div className="pay-body">
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: '#2a2a2a' }}>
                    Pay our delivery partner in cash or UPI when your order arrives. A ₹40 handling fee applies.
                    Available on orders below ₹15,000 across serviceable pincodes.
                  </p>
                </div>
              </label>

              {orderError && (
                <p style={{ marginTop: 14, color: '#c94f2a', fontSize: '0.82rem' }}>{orderError}</p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'center' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                style={{
                  background: 'transparent', border: 'none',
                  color: '#7a7060', cursor: 'none',
                  fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                  textDecoration: 'underline', textUnderlineOffset: 4,
                }}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={goNext}
              className="btn-dark"
              style={{ marginLeft: 'auto' }}
              disabled={processing || (step === 1 && !verified)}
            >
              <span>
                {processing
                  ? 'Placing order…'
                  : step === 3
                  ? `Place Order · ${formatPrice(total)} ✦`
                  : step === 1 && !verified
                  ? 'Verify email to continue'
                  : 'Continue →'}
              </span>
            </button>
          </div>
        </div>

        <aside className="summary-card">
          <p className="section-label" style={{ marginBottom: 18 }}>Your Order · {items.length} item{items.length !== 1 ? 's' : ''}</p>

          <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 12 }}>
            {items.map((it) => (
              <div key={it.id} className="mini-item">
                <img src={it.image} alt={it.name} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{it.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#7a7060', marginTop: 4, letterSpacing: '0.06em' }}>
                    {it.color} · {it.size} · ×{it.qty}
                  </div>
                </div>
                <span className="mini-item-price">
                  {it.originalPrice && it.originalPrice > it.price && (
                    <s style={{ display: 'block', fontSize: '0.7rem', color: '#9c9080' }}>
                      {formatPrice(it.originalPrice * it.qty)}
                    </s>
                  )}
                  <span style={{ fontSize: '0.82rem' }}>{formatPrice(it.price * it.qty)}</span>
                </span>
              </div>
            ))}
          </div>

          {savings > 0 && (
            <>
              <div className="summary-line"><span>MRP</span><span><s style={{ color: '#9c9080' }}>{formatPrice(subtotal + savings)}</s></span></div>
              <div className="summary-line" style={{ color: '#c94f2a' }}>
                <span>Sale Savings</span>
                <span>− {formatPrice(savings)}</span>
              </div>
            </>
          )}
          <div className="summary-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-line">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? '#c94f2a' : '#0a0a0a' }}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          <div className="summary-line"><span>Tax</span><span>Included</span></div>

          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div style={{ marginTop: 24, padding: 14, background: 'rgba(10,10,10,0.04)', fontSize: '0.72rem', color: '#7a7060', lineHeight: 1.7 }}>
            <strong style={{ color: '#0a0a0a' }}>🔒 Secure checkout</strong>
            <br />
            All transactions encrypted end-to-end. A confirmation will be emailed to <strong style={{ color: '#0a0a0a' }}>{form.email || 'your inbox'}</strong> the moment we receive your order.
          </div>
        </aside>
      </div>
    </section>
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
