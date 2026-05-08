'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/products'
import { useAdminUI } from './AdminUI'

const CATEGORY_OPTIONS = [
  'Outerwear', 'Tailoring', 'Knitwear', 'Shirts', 'Trousers',
  'Denim', 'Footwear', 'Basics', 'Loungewear',
]
const BADGE_OPTIONS = ['', 'New', 'Best Seller', 'Limited']

const slugify = (s) =>
  String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const SLOT_ROLES = ['Lead · Front', 'Back', 'Side', 'Detail', 'On-model']
const RECOMMENDED_IMAGES = 5

export default function AdminProductForm({ initial, mode = 'create' }) {
  const router = useRouter()
  const { toast, confirm } = useAdminUI()
  const fileRef = useRef(null)
  const formRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [reorderFrom, setReorderFrom] = useState(null)
  const [reorderOver, setReorderOver] = useState(null)

  const [form, setForm] = useState(() => ({
    slug: initial?.slug || '',
    name: initial?.name || '',
    price: initial?.price ?? '',
    originalPrice: initial?.originalPrice ?? '',
    category: initial?.category || 'Outerwear',
    badge: initial?.badge || '',
    colors: (initial?.colors || []).join(', '),
    sizes: (initial?.sizes || ['S', 'M', 'L', 'XL']).join(', '),
    material: initial?.material || '',
    care: initial?.care || '',
    description: initial?.description || '',
    images: initial?.images || [],
  }))

  // Track unsaved changes for "leave page" guard
  const [dirty, setDirty] = useState(false)
  useEffect(() => {
    if (mode !== 'edit') return
    setDirty(true)
  }, [form, mode])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onNameChange = (e) => {
    const name = e.target.value
    setForm((f) => ({
      ...f,
      name,
      slug: mode === 'create' && (!f.slug || f.slug === slugify(f.name)) ? slugify(name) : f.slug,
    }))
  }

  const addImageUrl = () => {
    const url = prompt('Paste an image URL (https://…):')
    if (!url) return
    setForm((f) => ({ ...f, images: [...f.images, url.trim()] }))
    toast('Image URL added', 'success')
  }

  const removeImage = (i) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  }

  const moveImage = (i, dir) => {
    setForm((f) => {
      const next = [...f.images]
      const j = i + dir
      if (j < 0 || j >= next.length) return f
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...f, images: next }
    })
  }

  const reorderTo = (from, to) => {
    if (from === to || from == null || to == null) return
    setForm((f) => {
      if (from < 0 || from >= f.images.length) return f
      const target = Math.min(to, f.images.length - 1)
      const next = [...f.images]
      const [pick] = next.splice(from, 1)
      next.splice(target, 0, pick)
      return { ...f, images: next }
    })
  }

  const setLeadImage = (i) => {
    setForm((f) => {
      if (i === 0) return f
      const next = [...f.images]
      const [pick] = next.splice(i, 1)
      next.unshift(pick)
      return { ...f, images: next }
    })
    toast('Lead image set', 'success')
  }

  const onPickFile = () => fileRef.current?.click()

  const uploadFiles = async (filesArray) => {
    if (filesArray.length === 0) return
    setUploading(true)
    const fd = new FormData()
    filesArray.forEach((f) => fd.append('file', f))
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        toast(data.error || 'Upload failed', 'error')
      } else {
        setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }))
        toast(`Uploaded ${data.urls.length} image${data.urls.length > 1 ? 's' : ''}`, 'success')
      }
    } catch {
      toast('Upload network error', 'error')
    }
    setUploading(false)
  }

  const onFile = async (e) => {
    const files = Array.from(e.target.files || [])
    await uploadFiles(files)
    if (fileRef.current) fileRef.current.value = ''
  }

  // Drag-and-drop
  const onDragEnter = (e) => {
    e.preventDefault()
    if (e.dataTransfer?.types?.includes('Files')) setDragActive(true)
  }
  const onDragLeave = (e) => {
    e.preventDefault()
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return
    setDragActive(false)
  }
  const onDragOver = (e) => e.preventDefault()
  const onDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) {
      toast('Drop an image file', 'error')
      return
    }
    await uploadFiles(files)
  }

  const submit = async (e) => {
    e?.preventDefault()
    setBusy(true)
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice) || null,
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      slug: form.slug || slugify(form.name),
    }
    try {
      const url =
        mode === 'create' ? '/api/admin/products' : `/api/admin/products/${initial.slug}`
      const method = mode === 'create' ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        toast(data.error || 'Save failed', 'error')
        setBusy(false)
        return
      }
      setDirty(false)
      toast(mode === 'create' ? 'Product created' : 'Changes saved', 'success')
      router.replace('/admin/dashboard')
      router.refresh()
    } catch {
      toast('Network error', 'error')
      setBusy(false)
    }
  }

  const cancel = async () => {
    if (dirty) {
      const yes = await confirm({
        title: 'Discard changes?',
        message: 'You have unsaved edits. Leaving will lose them.',
        confirmText: 'Discard',
        cancelText: 'Keep editing',
        danger: true,
      })
      if (!yes) return
    }
    router.replace('/admin/dashboard')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault()
        formRef.current?.requestSubmit?.()
      } else if (e.key === 'Escape') {
        // Don't trigger when typing inside an input — let blur happen first.
        // But honour escape when focus is on a button or outside form.
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
          e.preventDefault()
          cancel()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dirty])

  // Live preview values
  const previewPrice = Number(form.price) || 0
  const previewLead = form.images?.[0]

  return (
    <form ref={formRef} onSubmit={submit} className="admin-form">
      <div className="admin-form-grid">
        <div className="admin-form-col">
          <label className="admin-field">
            <span>Name</span>
            <input value={form.name} onChange={onNameChange} required placeholder="Oversized Linen Topcoat" />
          </label>

          <label className="admin-field">
            <span>Slug</span>
            <input
              value={form.slug}
              onChange={update('slug')}
              required
              disabled={mode === 'edit'}
              placeholder="oversized-linen-topcoat"
            />
            <small>URL-safe identifier (locked after creation).</small>
          </label>

          <div className="admin-field-row">
            <label className="admin-field">
              <span>Selling Price (₹)</span>
              <input type="number" value={form.price} onChange={update('price')} required min={0} />
            </label>
            <label className="admin-field">
              <span>Original / MRP (₹) <small>· optional</small></span>
              <input
                type="number"
                value={form.originalPrice}
                onChange={update('originalPrice')}
                min={0}
                placeholder="Leave blank if not on sale"
              />
              {(() => {
                const sp = Number(form.price) || 0
                const op = Number(form.originalPrice) || 0
                if (op > sp) {
                  const pct = Math.round((1 - sp / op) * 100)
                  const save = op - sp
                  return (
                    <small style={{ color: '#c94f2a', fontWeight: 600 }}>
                      Save ₹{save.toLocaleString('en-IN')} · {pct}% off
                    </small>
                  )
                }
                if (op > 0 && op <= sp) {
                  return <small style={{ color: '#b03a1a' }}>MRP must be higher than selling price.</small>
                }
                return null
              })()}
            </label>
            <label className="admin-field">
              <span>Category</span>
              <select value={form.category} onChange={update('category')}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Badge</span>
              <select value={form.badge} onChange={update('badge')}>
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b || 'None'}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="admin-field">
            <span>Sizes <small>(comma-separated)</small></span>
            <input value={form.sizes} onChange={update('sizes')} placeholder="S, M, L, XL, XXL" />
          </label>

          <label className="admin-field">
            <span>Colors <small>(comma-separated)</small></span>
            <input value={form.colors} onChange={update('colors')} placeholder="Stone, Charcoal, Sand" />
          </label>

          <label className="admin-field">
            <span>Material</span>
            <input value={form.material} onChange={update('material')} placeholder="Belgian Linen · 320gsm" />
          </label>

          <label className="admin-field">
            <span>Care</span>
            <input value={form.care} onChange={update('care')} placeholder="Cold wash · Hang dry · Iron low" />
          </label>

          <label className="admin-field">
            <span>Description</span>
            <textarea
              rows={6}
              value={form.description}
              onChange={update('description')}
              placeholder="A heavyweight overcoat for the in-between seasons…"
            />
          </label>
        </div>

        <div className="admin-form-col">
          {/* LIVE PREVIEW */}
          <div className="admin-preview">
            <p className="admin-section-label">Live preview</p>
            <div className="admin-preview-card">
              {previewLead ? (
                <img src={previewLead} alt="" />
              ) : (
                <div className="admin-preview-blank">No image yet</div>
              )}
              {form.badge && (
                <span className="card-badge" style={{ position: 'absolute', top: 14, left: 14, zIndex: 2 }}>
                  {form.badge}
                </span>
              )}
              {(() => {
                const op = Number(form.originalPrice) || 0
                const sp = Number(form.price) || 0
                const onSale = op > sp && sp > 0
                if (onSale) {
                  const pct = Math.round((1 - sp / op) * 100)
                  return (
                    <div className="card-discount-chip" style={{ position: 'absolute', top: 14, right: 14, zIndex: 2 }}>
                      −{pct}%
                    </div>
                  )
                }
                return null
              })()}
              <div className="admin-preview-overlay">
                <div className="admin-preview-name">{form.name || 'Product Name'}</div>
                <div className="admin-preview-price">
                  {formatPrice(previewPrice || 0)}
                  {Number(form.originalPrice) > Number(form.price) && Number(form.price) > 0 && (
                    <s style={{ marginLeft: 8, color: '#9c9080', fontSize: '0.7rem' }}>
                      {formatPrice(Number(form.originalPrice))}
                    </s>
                  )}
                </div>
              </div>
            </div>
            <p className="admin-preview-cap">
              How this looks on /collection
            </p>
          </div>

          {/* IMAGE MANAGER WITH DRAG-DROP */}
          <div
            className={`admin-images ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <div className="admin-images-head">
              <span>
                Images
                <small className={form.images.length >= RECOMMENDED_IMAGES ? 'is-complete' : ''}>
                  {form.images.length} / {RECOMMENDED_IMAGES}
                </small>
              </span>
              <div className="admin-images-actions">
                <button type="button" onClick={addImageUrl} className="admin-btn-ghost">+ URL</button>
                <button type="button" onClick={onPickFile} className="admin-btn-ghost" disabled={uploading}>
                  {uploading ? 'Uploading…' : '+ Upload'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFile}
                  hidden
                />
              </div>
            </div>

            <div className="admin-images-progress" aria-hidden>
              <span
                className="admin-images-progress-bar"
                style={{ width: `${Math.min(100, (form.images.length / RECOMMENDED_IMAGES) * 100)}%` }}
              />
            </div>

            <div className="admin-images-grid">
              {Array.from({ length: Math.max(RECOMMENDED_IMAGES, form.images.length) }).map((_, i) => {
                const src = form.images[i]
                const isFilled = Boolean(src)
                const role = SLOT_ROLES[i] || `Photo #${i + 1}`
                const isDragging = reorderFrom === i
                const isOver = reorderOver === i && reorderFrom !== null && reorderFrom !== i
                const tileClass =
                  `admin-image-tile ${isFilled ? 'is-filled' : 'is-empty'} ${i === 0 && isFilled ? 'is-lead' : ''} ${isDragging ? 'is-dragging' : ''} ${isOver ? 'is-over' : ''}`
                return (
                  <div
                    key={i}
                    className={tileClass}
                    draggable={isFilled}
                    onDragStart={(e) => {
                      if (!isFilled) return
                      setReorderFrom(i)
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/x-image-index', String(i))
                    }}
                    onDragEnter={(e) => {
                      if (reorderFrom === null) return
                      e.preventDefault()
                      e.stopPropagation()
                      setReorderOver(i)
                    }}
                    onDragOver={(e) => {
                      if (reorderFrom === null) return
                      e.preventDefault()
                      e.stopPropagation()
                      e.dataTransfer.dropEffect = 'move'
                    }}
                    onDrop={(e) => {
                      if (reorderFrom === null) return
                      e.preventDefault()
                      e.stopPropagation()
                      reorderTo(reorderFrom, i)
                      setReorderFrom(null)
                      setReorderOver(null)
                    }}
                    onDragEnd={() => {
                      setReorderFrom(null)
                      setReorderOver(null)
                    }}
                  >
                    {isFilled ? (
                      <>
                        <img src={src} alt="" title={src} />
                        <div className="admin-image-tile-pos">
                          {i === 0 ? '★ Lead' : `#${i + 1}`}
                        </div>
                        <div className="admin-image-tile-actions">
                          {i !== 0 && (
                            <button type="button" onClick={() => setLeadImage(i)} title="Set as lead image" aria-label="Set as lead image">★</button>
                          )}
                          <button type="button" onClick={() => removeImage(i)} title="Remove image" aria-label="Remove image">×</button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={onPickFile}
                        className="admin-image-tile-empty-btn"
                        disabled={uploading}
                        aria-label={`Add ${role} photo`}
                      >
                        <span className="admin-image-tile-plus">+</span>
                        <span className="admin-image-tile-role">{role}</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {dragActive && (
              <div className="admin-dropzone-overlay">
                <div>
                  <div className="admin-dropzone-icon" style={{ fontSize: '3rem' }}>⤓</div>
                  Drop to upload
                </div>
              </div>
            )}

            <p className="admin-hint">
              Recommended for clothing: <strong>5 photos</strong> — front, back, side, detail, on-model.
              Drag tiles to reorder · the first tile is the lead image shown on /collection.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" onClick={cancel} className="admin-link-muted">Cancel</button>
        <span className="admin-shortcut-hint"><kbd>⌘S</kbd> save · <kbd>Esc</kbd> cancel</span>
        <button type="submit" className="btn-dark" disabled={busy}>
          <span>{busy ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save changes'}</span>
        </button>
      </div>
    </form>
  )
}
