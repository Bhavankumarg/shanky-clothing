'use client'
import { useEffect, useState } from 'react'

// Tiny, deterministic size recommender. We don't need a model — for a
// menswear catalogue the rule is good enough: combine height + chest into a
// score, then pick the closest size the product carries.
function recommend(product, { heightCm, usual, fit }) {
  const sizes = product.sizes || []
  if (sizes.length === 0) return null

  // Letter sizes
  const letters = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const letterIdx = letters.indexOf(usual)
  if (letterIdx !== -1) {
    let idx = letterIdx
    // Adjust by height
    if (heightCm >= 188) idx += 1
    else if (heightCm < 168) idx -= 1
    // Adjust for relaxed fit
    if (fit === 'relaxed') idx += 1
    if (fit === 'fitted') idx -= 1
    idx = Math.max(0, Math.min(letters.length - 1, idx))
    // Find closest available letter size
    for (let r = 0; r < letters.length; r++) {
      const up = letters[Math.min(letters.length - 1, idx + r)]
      const down = letters[Math.max(0, idx - r)]
      if (sizes.includes(up)) return up
      if (sizes.includes(down)) return down
    }
  }

  // Numeric (waist / shoe)
  const num = parseInt(usual, 10)
  if (!Number.isNaN(num)) {
    const numericSizes = sizes
      .map((s) => parseInt(s, 10))
      .filter((n) => !Number.isNaN(n))
    if (numericSizes.length) {
      let target = num
      if (fit === 'relaxed') target += 1
      if (fit === 'fitted') target -= 1
      const closest = numericSizes.reduce((best, s) =>
        Math.abs(s - target) < Math.abs(best - target) ? s : best
      )
      return String(closest)
    }
  }

  return sizes[Math.floor(sizes.length / 2)]
}

export default function SizeFinder({ product, onPick, onClose }) {
  const [step, setStep] = useState(1)
  const [heightCm, setHeightCm] = useState(178)
  const [usual, setUsual] = useState(product.sizes?.[0] || 'M')
  const [fit, setFit] = useState('regular')
  const pick = recommend(product, { heightCm, usual, fit })

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="size-finder-backdrop" onClick={onClose}>
      <div
        className="size-finder"
        role="dialog"
        aria-modal="true"
        aria-label="Find my size"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="size-finder-close" onClick={onClose} aria-label="Close">×</button>
        <p className="section-label">Find my size</p>
        <h3 className="italiana" style={{ fontSize: '1.8rem', marginTop: 4, marginBottom: 18 }}>
          Two questions, one suggestion.
        </h3>

        {step === 1 && (
          <div className="size-finder-step">
            <label className="size-finder-field">
              <span>Your height</span>
              <div className="size-finder-row">
                <input
                  type="range"
                  min={150}
                  max={205}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
                <strong>{heightCm} cm</strong>
              </div>
            </label>

            <label className="size-finder-field">
              <span>Your usual size</span>
              <div className="size-finder-pills">
                {(product.sizes || []).map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`size-finder-pill ${usual === s ? 'active' : ''}`}
                    onClick={() => setUsual(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </label>

            <label className="size-finder-field">
              <span>How do you like it to sit?</span>
              <div className="size-finder-pills">
                {[
                  { v: 'fitted', label: 'Closer fit' },
                  { v: 'regular', label: 'Regular' },
                  { v: 'relaxed', label: 'Roomier' },
                ].map((o) => (
                  <button
                    type="button"
                    key={o.v}
                    className={`size-finder-pill ${fit === o.v ? 'active' : ''}`}
                    onClick={() => setFit(o.v)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </label>

            <button className="btn-dark" onClick={() => setStep(2)} style={{ marginTop: 8 }}>
              <span>See suggestion</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="size-finder-step">
            <p className="size-finder-result">
              We'd suggest size <strong>{pick}</strong>.
            </p>
            <p className="size-finder-note">
              Based on {heightCm} cm tall, you usually wear {usual}, and you like it {fit}.
              Sizing here runs slightly oversized — if in doubt, the rule is "closer to ribs, not ears".
            </p>
            <div className="size-finder-actions">
              <button className="btn-dark" onClick={() => onPick?.(pick)}>
                <span>Use {pick}</span>
              </button>
              <button className="size-finder-secondary" onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
