'use client'
import { useEffect, useRef, useState } from 'react'
import SafeImg from './SafeImg'

function useCounter(target, duration = 1800, trigger) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [trigger, target, duration])
  return count
}

const stats = [
  { num: 48, suffix: 'K', label: 'Customers' },
  { num: 120, suffix: '+', label: 'Pieces / Season' },
  { num: 100, suffix: '%', label: 'Sustainable' },
]

export default function About() {
  const sectionRef = useRef(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
          if (entry.isIntersecting && !triggered) setTriggered(true)
        })
      },
      { threshold: 0.12 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [triggered])

  const c0 = useCounter(stats[0].num, 1800, triggered)
  const c1 = useCounter(stats[1].num, 1800, triggered)
  const c2 = useCounter(stats[2].num, 1800, triggered)
  const counts = [c0, c1, c2]

  return (
    <div id="about" ref={sectionRef} className="home-about">
      <div className="about-img-col reveal home-about-imgwrap">
        <SafeImg
          src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=85&auto=format&fit=crop"
          alt="Atelier"
          fallbackKey="home-about"
          className="home-about-img"
        />
        <div className="home-about-badge">
          <span style={{ fontSize: '3rem', lineHeight: 1 }}>12</span>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.7)' }}>
            Years of Craft
          </span>
        </div>
      </div>

      <div className="reveal home-about-content">
        <p className="section-label mb-4">Our Story</p>
        <h2 className="italiana home-about-title">
          Design Born<br />from Silence
        </h2>
        <p className="home-about-copy">
          Shanky began in a small Bengaluru atelier with one obsession — menswear that speaks without shouting.
          Every stitch carries intention. Every silhouette, a quiet rebellion against the noise of fast fashion.
        </p>

        <div className="home-about-stats">
          {stats.map((s, i) => (
            <div key={s.label}>
              <div className="home-about-stat-num">
                {counts[i]}<span style={{ color: '#c94f2a' }}>{s.suffix}</span>
              </div>
              <div className="home-about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
