'use client'
import { useEffect, useMemo, useState } from 'react'

const LETTERS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

// Standard menswear size chart in cm. Ranges are inclusive of low,
// exclusive of high — except the last bucket which is open-ended.
const CHART = {
  XS:   { chest: [82, 90],  hip: [82, 90],  waist: [68, 74] },
  S:    { chest: [90, 96],  hip: [90, 96],  waist: [74, 80] },
  M:    { chest: [96, 102], hip: [96, 102], waist: [80, 86] },
  L:    { chest: [102, 108], hip: [102, 108], waist: [86, 92] },
  XL:   { chest: [108, 116], hip: [108, 116], waist: [92, 100] },
  XXL:  { chest: [116, 124], hip: [116, 124], waist: [100, 108] },
  XXXL: { chest: [124, 999], hip: [124, 999], waist: [108, 999] },
}

function bucketFor(metric, cm) {
  for (const size of LETTERS) {
    const [lo, hi] = CHART[size][metric]
    if (cm >= lo && cm < hi) return size
  }
  return cm < CHART.XS[metric][0] ? 'XS' : 'XXXL'
}

const inchToCm = (inches) => Math.round(inches * 2.54)

// Quick recommender (existing flow): combines height + usual size + fit feel.
function recommendQuick(product, { heightCm, usual, fit }) {
  const sizes = product.sizes || []
  if (sizes.length === 0) return null

  const letterIdx = LETTERS.indexOf(usual)
  if (letterIdx !== -1) {
    let idx = letterIdx
    if (heightCm >= 188) idx += 1
    else if (heightCm < 168) idx -= 1
    if (fit === 'relaxed') idx += 1
    if (fit === 'fitted') idx -= 1
    idx = Math.max(0, Math.min(LETTERS.length - 1, idx))
    for (let r = 0; r < LETTERS.length; r++) {
      const up = LETTERS[Math.min(LETTERS.length - 1, idx + r)]
      const down = LETTERS[Math.max(0, idx - r)]
      if (sizes.includes(up)) return up
      if (sizes.includes(down)) return down
    }
  }

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

// Measurement-based recommender. Returns { size, pattern, breakdown }.
function recommendByMeasurements(product, { chest, hip, waist, heightCm, fit }) {
  const sizes = product.sizes || []
  if (sizes.length === 0) return null

  const isTrouser = ['Trousers', 'Denim'].includes(product.category)
  const numericSizes = sizes
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n))
  const sizeIsNumeric = numericSizes.length > 0 && numericSizes.length === sizes.length

  // Numeric (waist) sizing — snap waist (in inches) to nearest available size
  if (sizeIsNumeric) {
    const waistIn = Math.round(waist / 2.54)
    let target = waistIn
    if (fit === 'relaxed') target += 1
    if (fit === 'fitted') target -= 1
    const closest = numericSizes.reduce((best, s) =>
      Math.abs(s - target) < Math.abs(best - target) ? s : best
    )
    return {
      size: String(closest),
      pattern: 'numeric',
      breakdown: {
        primary: `Waist ${waist} cm (~${waistIn}")`,
        rule: `Closest available size: ${closest}`,
      },
    }
  }

  // Letter sizing
  const cs = bucketFor('chest', chest)
  const hs = bucketFor('hip', hip)
  const ws = bucketFor('waist', waist)

  const cIdx = LETTERS.indexOf(cs)
  const hIdx = LETTERS.indexOf(hs)

  // For tops/outerwear we lead with chest; trousers lead with waist/hip.
  const primaryIdx = isTrouser ? Math.max(LETTERS.indexOf(ws), hIdx) : cIdx
  const otherIdx = isTrouser ? hIdx : hIdx
  const sizingFloor = Math.max(primaryIdx, otherIdx)

  let pattern = 'even'
  if (!isTrouser) {
    if (cIdx > hIdx + 1) pattern = 'tapered'
    else if (hIdx > cIdx + 1) pattern = 'wider-hip'
    else if (cIdx === hIdx + 1) pattern = 'athletic'
    else if (hIdx === cIdx + 1) pattern = 'soft-shoulder'
  } else {
    if (LETTERS.indexOf(ws) > hIdx) pattern = 'narrow-hip'
    else if (LETTERS.indexOf(ws) < hIdx) pattern = 'wider-hip'
  }

  let idx = sizingFloor
  if (fit === 'relaxed') idx += 1
  if (fit === 'fitted') idx -= 1
  idx = Math.max(0, Math.min(LETTERS.length - 1, idx))

  let pickedLetter = LETTERS[idx]
  if (!sizes.includes(pickedLetter)) {
    for (let r = 1; r < LETTERS.length; r++) {
      const up = LETTERS[Math.min(LETTERS.length - 1, idx + r)]
      const down = LETTERS[Math.max(0, idx - r)]
      if (sizes.includes(up)) { pickedLetter = up; break }
      if (sizes.includes(down)) { pickedLetter = down; break }
    }
  }

  return {
    size: pickedLetter,
    pattern,
    breakdown: {
      chest: `${chest} cm → ${cs}`,
      hip: `${hip} cm → ${hs}`,
      waist: `${waist} cm → ${ws}`,
      height: `${heightCm} cm`,
    },
  }
}

const PATTERN_NOTES = {
  even: 'Even build — chest and hip line up. Garment will sit straight without pulling.',
  athletic: 'Athletic cut — chest is one notch broader than hip. We size up for shoulder room; the hem stays clean.',
  tapered: 'V-shape — broader chest, narrower hip. Going with the larger size keeps the chest comfortable; expect a clean drop through the body.',
  'wider-hip': 'Wider through the seat — sized up so the garment doesn\'t pull. If you prefer a slimmer chest, the next size down will still close.',
  'soft-shoulder': 'Softer shoulder, fuller hip — sized for the hip; chest will sit relaxed.',
  'narrow-hip': 'Slim seat — sized to the waist. The leg will read straight without bunching at the hip.',
  numeric: 'Sized by waist measurement, rounded to the nearest available inch.',
}

export default function SizeFinder({ product, onPick, onClose }) {
  const [mode, setMode] = useState('quick')
  const [step, setStep] = useState(1)

  // Quick mode state
  const [heightCm, setHeightCm] = useState(178)
  const [usual, setUsual] = useState(product.sizes?.[0] || 'M')
  const [fit, setFit] = useState('regular')

  // Measurement mode state (cm)
  const [chest, setChest] = useState(96)
  const [hip, setHip] = useState(96)
  const [waist, setWaist] = useState(82)
  const [unit, setUnit] = useState('cm')

  const result = useMemo(() => {
    if (mode === 'quick') {
      const size = recommendQuick(product, { heightCm, usual, fit })
      return size ? { size, pattern: null, breakdown: null } : null
    }
    return recommendByMeasurements(product, { chest, hip, waist, heightCm, fit })
  }, [mode, product, heightCm, usual, fit, chest, hip, waist])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const display = (cm) => unit === 'in' ? `${(cm / 2.54).toFixed(1)}"` : `${cm} cm`
  const fromInput = (raw) => unit === 'in' ? inchToCm(Number(raw)) : Number(raw)
  const toInput = (cm) => unit === 'in' ? Number((cm / 2.54).toFixed(1)) : cm

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
        <h3 className="italiana" style={{ fontSize: '1.8rem', marginTop: 4, marginBottom: 14 }}>
          {mode === 'quick' ? 'Two questions, one suggestion.' : 'Tell us your measurements.'}
        </h3>

        <div className="size-finder-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'quick'}
            className={`size-finder-tab ${mode === 'quick' ? 'active' : ''}`}
            onClick={() => { setMode('quick'); setStep(1) }}
          >
            Quick estimate
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'measure'}
            className={`size-finder-tab ${mode === 'measure' ? 'active' : ''}`}
            onClick={() => { setMode('measure'); setStep(1) }}
          >
            Measure me · precise
          </button>
        </div>

        {mode === 'quick' && step === 1 && (
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

        {mode === 'measure' && step === 1 && (
          <div className="size-finder-step">
            <div className="size-finder-unit-toggle">
              <button
                type="button"
                className={`size-finder-unit ${unit === 'cm' ? 'active' : ''}`}
                onClick={() => setUnit('cm')}
              >cm</button>
              <button
                type="button"
                className={`size-finder-unit ${unit === 'in' ? 'active' : ''}`}
                onClick={() => setUnit('in')}
              >inch</button>
            </div>

            <label className="size-finder-field">
              <span>Height</span>
              <div className="size-finder-row">
                <input
                  type="range"
                  min={150}
                  max={205}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
                <strong>{display(heightCm)}</strong>
              </div>
            </label>

            <label className="size-finder-field">
              <span>Chest <small>· around the fullest part, arms relaxed</small></span>
              <div className="size-finder-row">
                <input
                  type="number"
                  step={unit === 'in' ? 0.5 : 1}
                  min={unit === 'in' ? 28 : 70}
                  max={unit === 'in' ? 60 : 150}
                  value={toInput(chest)}
                  onChange={(e) => setChest(fromInput(e.target.value))}
                  className="size-finder-num"
                />
                <span className="size-finder-unit-label">{unit}</span>
              </div>
            </label>

            <label className="size-finder-field">
              <span>Waist <small>· narrowest part, above the hip bone</small></span>
              <div className="size-finder-row">
                <input
                  type="number"
                  step={unit === 'in' ? 0.5 : 1}
                  min={unit === 'in' ? 24 : 60}
                  max={unit === 'in' ? 50 : 130}
                  value={toInput(waist)}
                  onChange={(e) => setWaist(fromInput(e.target.value))}
                  className="size-finder-num"
                />
                <span className="size-finder-unit-label">{unit}</span>
              </div>
            </label>

            <label className="size-finder-field">
              <span>Hip <small>· around the fullest part of the seat</small></span>
              <div className="size-finder-row">
                <input
                  type="number"
                  step={unit === 'in' ? 0.5 : 1}
                  min={unit === 'in' ? 28 : 70}
                  max={unit === 'in' ? 60 : 150}
                  value={toInput(hip)}
                  onChange={(e) => setHip(fromInput(e.target.value))}
                  className="size-finder-num"
                />
                <span className="size-finder-unit-label">{unit}</span>
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
              <span>See my size & pattern</span>
            </button>
          </div>
        )}

        {step === 2 && result && (
          <div className="size-finder-step">
            <p className="size-finder-result">
              We'd suggest size <strong>{result.size}</strong>.
            </p>

            {mode === 'measure' && result.breakdown && (
              <div className="size-finder-breakdown">
                {result.breakdown.chest && (
                  <div className="size-finder-bd-row">
                    <span>Chest</span><strong>{result.breakdown.chest}</strong>
                  </div>
                )}
                {result.breakdown.waist && (
                  <div className="size-finder-bd-row">
                    <span>Waist</span><strong>{result.breakdown.waist}</strong>
                  </div>
                )}
                {result.breakdown.hip && (
                  <div className="size-finder-bd-row">
                    <span>Hip</span><strong>{result.breakdown.hip}</strong>
                  </div>
                )}
                {result.breakdown.height && (
                  <div className="size-finder-bd-row">
                    <span>Height</span><strong>{result.breakdown.height}</strong>
                  </div>
                )}
                {result.breakdown.primary && (
                  <div className="size-finder-bd-row">
                    <span>Sizing on</span><strong>{result.breakdown.primary}</strong>
                  </div>
                )}
              </div>
            )}

            {mode === 'measure' && result.pattern && (
              <p className="size-finder-pattern">
                <span className="size-finder-pattern-tag">Pattern</span>
                {PATTERN_NOTES[result.pattern]}
              </p>
            )}

            <p className="size-finder-note">
              {mode === 'quick'
                ? `Based on ${heightCm} cm tall, you usually wear ${usual}, and you like it ${fit}. `
                : `Adjusted for "${fit}" preference. `}
              Sizing here runs slightly oversized — if in doubt, the rule is "closer to ribs, not ears".
            </p>

            <div className="size-finder-actions">
              <button className="btn-dark" onClick={() => onPick?.(result.size)}>
                <span>Use {result.size}</span>
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
