'use client'
import { useEffect, useRef, useState } from 'react'

export default function Newsletter() {
  const sectionRef = useRef(null)
  const [email, setEmail] = useState('')
  const [placeholder, setPlaceholder] = useState('your@email.com')
  const [btnBg, setBtnBg] = useState('#0a0a0a')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        }),
      { threshold: 0.12 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = () => {
    if (email) {
      setEmail('')
      setPlaceholder("You're in. Welcome to Shanky ✦")
      setTimeout(() => setPlaceholder('your@email.com'), 3000)
    }
  }

  return (
    <section id="newsletter" ref={sectionRef} className="newsletter-section">
      <div className="reveal">
        <p className="section-label mb-4">Stay Connected</p>
        <h2 className="italiana newsletter-title">First Access.<br />Always.</h2>
        <p className="newsletter-copy">
          Join the Shanky inner circle. Drops, stories, and exclusive offers — straight to your inbox before anyone else.
        </p>

        <div className="newsletter-form email-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            onMouseEnter={() => setBtnBg('#c94f2a')}
            onMouseLeave={() => setBtnBg('#0a0a0a')}
            style={{ background: btnBg }}
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}
