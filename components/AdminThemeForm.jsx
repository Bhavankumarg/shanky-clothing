'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminUI } from './AdminUI'

const FIELDS = [
  {
    key: 'cream',
    label: 'Cream',
    desc: 'Primary page background — most pages, cards, buttons.',
  },
  {
    key: 'cream2',
    label: 'Cream 2',
    desc: 'Secondary cream — order summary, alt sections, ticker.',
  },
  {
    key: 'black',
    label: 'Black',
    desc: 'Body text + dark surfaces (hero, footer, dark buttons).',
  },
  {
    key: 'rust',
    label: 'Rust (Accent)',
    desc: 'Primary brand accent — links, CTAs, the K in SHANKY.',
  },
  {
    key: 'rustLight',
    label: 'Rust Light',
    desc: 'Hover / highlight tone for the rust accent.',
  },
  {
    key: 'sand',
    label: 'Sand',
    desc: 'Warm neutral used in dark sections.',
  },
  {
    key: 'muted',
    label: 'Muted',
    desc: 'Secondary text — subtitles, meta lines, captions.',
  },
]

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const expand = (hex) => {
  if (!hex) return '#000000'
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    return '#' + hex.slice(1).split('').map((c) => c + c).join('').toLowerCase()
  }
  return hex.toLowerCase()
}

export default function AdminThemeForm({ initial, defaults }) {
  const router = useRouter()
  const { toast, confirm } = useAdminUI()
  const [form, setForm] = useState(() => ({ ...defaults, ...initial }))
  const [busy, setBusy] = useState(false)

  const update = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const previewVars = useMemo(() => ({
    '--cream': form.cream,
    '--cream-2': form.cream2,
    '--black': form.black,
    '--rust': form.rust,
    '--rust-light': form.rustLight,
    '--sand': form.sand,
    '--muted': form.muted,
  }), [form])

  const invalid = FIELDS.filter((f) => !HEX_RE.test(form[f.key] || ''))

  const submit = async (e) => {
    e?.preventDefault()
    if (invalid.length > 0) {
      toast(`Fix invalid hex: ${invalid.map((i) => i.label).join(', ')}`, 'error')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        toast(data.error || 'Save failed', 'error')
        setBusy(false)
        return
      }
      toast('Theme saved · live on storefront', 'success')
      router.refresh()
    } catch {
      toast('Network error', 'error')
    }
    setBusy(false)
  }

  const reset = async () => {
    const yes = await confirm({
      title: 'Reset theme?',
      message: 'This restores all colors to the original palette.',
      confirmText: 'Reset',
      cancelText: 'Keep editing',
      danger: true,
    })
    if (!yes) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/theme', { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        toast(data.error || 'Reset failed', 'error')
        setBusy(false)
        return
      }
      setForm({ ...defaults })
      toast('Theme reset to defaults', 'success')
      router.refresh()
    } catch {
      toast('Network error', 'error')
    }
    setBusy(false)
  }

  const restoreDefault = (key) => {
    setForm((f) => ({ ...f, [key]: defaults[key] }))
  }

  return (
    <form onSubmit={submit} className="admin-form admin-theme-form">
      <div className="admin-form-grid">
        <div className="admin-form-col">
          {FIELDS.map((field) => {
            const value = form[field.key] || ''
            const isValid = HEX_RE.test(value)
            const isDefault = expand(value) === expand(defaults[field.key])
            return (
              <div key={field.key} className="admin-theme-row">
                <div className="admin-theme-row-head">
                  <div>
                    <span className="admin-theme-label">{field.label}</span>
                    <p className="admin-theme-desc">{field.desc}</p>
                  </div>
                  {!isDefault && (
                    <button
                      type="button"
                      className="admin-link-muted admin-theme-restore"
                      onClick={() => restoreDefault(field.key)}
                      title="Restore default"
                    >
                      Restore default
                    </button>
                  )}
                </div>
                <div className="admin-theme-inputs">
                  <input
                    type="color"
                    value={isValid ? expand(value) : '#000000'}
                    onChange={update(field.key)}
                    aria-label={`${field.label} color picker`}
                    className="admin-theme-color"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={update(field.key)}
                    placeholder={defaults[field.key]}
                    spellCheck={false}
                    className={`admin-theme-hex ${!isValid ? 'invalid' : ''}`}
                  />
                  <span
                    className="admin-theme-swatch"
                    style={{ background: isValid ? value : '#ccc' }}
                    aria-hidden
                  />
                </div>
                {!isValid && (
                  <p className="admin-theme-err">Use hex format like {defaults[field.key]}.</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="admin-form-col">
          <div className="admin-preview" style={previewVars}>
            <p className="admin-section-label">Live preview</p>
            <div className="admin-theme-preview">
              <div
                className="admin-theme-preview-hero"
                style={{ background: form.black, color: form.cream }}
              >
                <span className="admin-theme-preview-kicker" style={{ color: form.rust }}>Atelier</span>
                <h3 style={{ fontFamily: "'Italiana', serif", fontSize: '1.8rem', lineHeight: 1.1 }}>
                  Wear nothing <em style={{ color: form.rust, fontStyle: 'normal' }}>ordinary.</em>
                </h3>
                <p style={{ color: form.sand, fontSize: '0.78rem', marginTop: 8, letterSpacing: '0.06em' }}>
                  Sand-toned sub copy on dark surfaces.
                </p>
              </div>
              <div
                className="admin-theme-preview-body"
                style={{ background: form.cream, color: form.black }}
              >
                <span style={{ color: form.rust, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                  Section label
                </span>
                <h4 style={{ fontFamily: "'Italiana', serif", fontSize: '1.4rem', marginTop: 6 }}>
                  Considered Tailoring.
                </h4>
                <p style={{ color: form.muted, fontSize: '0.85rem', marginTop: 10, lineHeight: 1.7 }}>
                  Muted body copy fades back; the rust accent leads the eye.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: form.black, color: form.cream,
                      fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.18em',
                      padding: '10px 18px', fontSize: '0.85rem',
                    }}
                  >
                    Add to Bag
                  </span>
                  <span
                    style={{
                      background: form.rust, color: form.cream,
                      fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.18em',
                      padding: '10px 18px', fontSize: '0.85rem',
                    }}
                  >
                    Sale −20%
                  </span>
                  <span
                    style={{
                      background: form.cream2, color: form.black,
                      fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.18em',
                      padding: '10px 18px', fontSize: '0.85rem',
                    }}
                  >
                    Quiet
                  </span>
                </div>
              </div>
            </div>
            <p className="admin-preview-cap">Your palette in context.</p>
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" onClick={reset} className="admin-link-danger" disabled={busy}>
          Reset to defaults
        </button>
        <span className="admin-shortcut-hint">
          {invalid.length === 0 ? 'All hex values valid.' : `${invalid.length} invalid value(s).`}
        </span>
        <button type="submit" className="btn-dark" disabled={busy || invalid.length > 0}>
          <span>{busy ? 'Saving…' : 'Save theme'}</span>
        </button>
      </div>
    </form>
  )
}
