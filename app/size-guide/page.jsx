'use client'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'

const sizeData = {
  Women: {
    cols: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'EU', 'UK'],
    rows: [
      ['XS', '32', '24', '34', '32', '4'],
      ['S', '34', '26', '36', '34', '6'],
      ['M', '36', '28', '38', '36', '8'],
      ['L', '38', '30', '40', '38', '10'],
      ['XL', '40', '32', '42', '40', '12'],
    ],
  },
  Men: {
    cols: ['Size', 'Chest (in)', 'Waist (in)', 'Sleeve (in)', 'EU', 'UK'],
    rows: [
      ['XS', '34', '28', '32', '44', 'XS'],
      ['S', '36', '30', '33', '46', 'S'],
      ['M', '38', '32', '34', '48', 'M'],
      ['L', '40', '34', '35', '50', 'L'],
      ['XL', '42', '36', '36', '52', 'XL'],
      ['XXL', '44', '38', '37', '54', 'XXL'],
    ],
  },
  Footwear: {
    cols: ['IN', 'UK', 'EU', 'US (M)', 'US (W)', 'CM'],
    rows: [
      ['7', '6', '40', '7', '8.5', '25.0'],
      ['8', '7', '41', '8', '9.5', '25.7'],
      ['9', '8', '42', '9', '10.5', '26.7'],
      ['10', '9', '43', '10', '11.5', '27.5'],
      ['11', '10', '44', '11', '12.5', '28.4'],
    ],
  },
}

export default function SizeGuidePage() {
  const [tab, setTab] = useState('Women')

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
        kicker="Fit guide"
        title="Find your"
        accent=" size."
        subtitle="Our garments lean intentionally relaxed. If you're between sizes and prefer a closer fit — size down. For a generous, oversized drape — stay true."
      />

      <section style={{ background: '#f5f0e8', padding: '80px 60px 120px' }}>
        <div className="reveal tabs" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(sizeData).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? 'active' : ''}`}>
              {t}
            </button>
          ))}
        </div>

        <div
          className="grid reveal"
          style={{ gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start', marginTop: 40 }}
        >
          <div>
            <h3 className="italiana" style={{ fontSize: '1.8rem', marginBottom: 14 }}>
              {tab} sizing
            </h3>
            <p style={{ color: '#7a7060', fontSize: '0.88rem', lineHeight: 1.85 }}>
              All measurements taken with the garment laid flat, then doubled where applicable. Body measurements suggested below are taken on the body, not the garment.
            </p>

            <div style={{ overflowX: 'auto', marginTop: 24 }}>
              <table className="size-table">
                <thead>
                  <tr>
                    {sizeData[tab].cols.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeData[tab].rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={i} style={{ fontFamily: i === 0 ? "'Bebas Neue', sans-serif" : 'inherit', letterSpacing: i === 0 ? '0.12em' : 0 }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="section-label" style={{ marginBottom: 16 }}>How to measure</h4>
            <svg viewBox="0 0 240 360" style={{ width: '100%', maxWidth: 320, display: 'block' }}>
              <ellipse cx="120" cy="50" rx="22" ry="28" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
              <path d="M120 78 L120 100" stroke="#0a0a0a" strokeWidth="1.5" />
              <path d="M70 130 Q120 100 170 130 L160 220 Q120 240 80 220 Z" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
              <path d="M85 220 L 75 320" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
              <path d="M155 220 L 165 320" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
              <path d="M70 130 L 40 200" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
              <path d="M170 130 L 200 200" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
              <line x1="50" y1="150" x2="190" y2="150" stroke="#c94f2a" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="200" y="153" fontSize="9" fill="#c94f2a" fontFamily="Bebas Neue" letterSpacing="1">BUST</text>
              <line x1="65" y1="200" x2="175" y2="200" stroke="#c94f2a" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="180" y="203" fontSize="9" fill="#c94f2a" fontFamily="Bebas Neue" letterSpacing="1">WAIST</text>
              <line x1="60" y1="240" x2="180" y2="240" stroke="#c94f2a" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="185" y="243" fontSize="9" fill="#c94f2a" fontFamily="Bebas Neue" letterSpacing="1">HIP</text>
            </svg>

            <div style={{ marginTop: 24 }}>
              {[
                ['Bust', 'Wrap tape around the fullest part, level with the floor.'],
                ['Waist', 'Around the narrowest part of your torso, just above the navel.'],
                ['Hip', 'Around the fullest part, usually 8–9 inches below the waist.'],
              ].map(([k, v]) => (
                <p key={k} style={{ fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 10 }}>
                  <strong style={{ color: '#c94f2a', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</strong>
                  &nbsp;&nbsp;{v}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
