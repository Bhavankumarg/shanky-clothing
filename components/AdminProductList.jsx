'use client'
import Link from 'next/link'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice, hasDiscount, discountPercent } from '@/lib/products'
import { useAdminUI } from './AdminUI'

const BADGE_OPTIONS = [null, 'New', 'Best Seller', 'Limited']
const VIEW_KEY = 'shanky-admin-view'
const VIEW_MODES = [
  {
    id: 'icons',
    label: 'as Icons',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="1.5" width="5" height="5" /><rect x="9.5" y="1.5" width="5" height="5" />
        <rect x="1.5" y="9.5" width="5" height="5" /><rect x="9.5" y="9.5" width="5" height="5" />
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'as List',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
        <line x1="1.5" y1="3" x2="14.5" y2="3" /><line x1="1.5" y1="8" x2="14.5" y2="8" />
        <line x1="1.5" y1="13" x2="14.5" y2="13" />
      </svg>
    ),
  },
  {
    id: 'columns',
    label: 'as Columns',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="1.5" width="4" height="13" /><rect x="6.5" y="1.5" width="4" height="13" />
        <rect x="11.5" y="1.5" width="3" height="13" />
      </svg>
    ),
  },
  {
    id: 'gallery',
    label: 'as Gallery',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="3" width="13" height="9" />
        <line x1="4.5" y1="13.5" x2="11.5" y2="13.5" />
      </svg>
    ),
  },
]

export default function AdminProductList({ products: initialProducts }) {
  const router = useRouter()
  const { toast, confirm } = useAdminUI()
  const [products, setProducts] = useState(initialProducts)
  const [busy, setBusy] = useState(null)
  const [editingPrice, setEditingPrice] = useState(null)
  const [draftPrice, setDraftPrice] = useState('')
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [badgeFilter, setBadgeFilter] = useState('All')
  const [view, setView] = useState('list')
  const [hydratedView, setHydratedView] = useState(false)
  const searchRef = useRef(null)

  // Load saved view mode
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY)
      if (saved && VIEW_MODES.some((m) => m.id === saved)) setView(saved)
    } catch {}
    setHydratedView(true)
  }, [])

  useEffect(() => {
    if (!hydratedView) return
    try { localStorage.setItem(VIEW_KEY, view) } catch {}
  }, [view, hydratedView])

  // Keyboard: '/' focuses search, 'n' new product, 1-4 switch view modes
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        router.push('/admin/dashboard/new')
      } else if (['1', '2', '3', '4'].includes(e.key) && !e.metaKey && !e.ctrlKey) {
        const mode = VIEW_MODES[Number(e.key) - 1]
        if (mode) setView(mode.id)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [router])

  const allCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [products])

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products.filter((p) => {
      if (catFilter !== 'All' && p.category !== catFilter) return false
      if (badgeFilter !== 'All') {
        if (badgeFilter === 'None' && p.badge) return false
        if (badgeFilter !== 'None' && p.badge !== badgeFilter) return false
      }
      if (q && !`${p.name} ${p.slug} ${p.category}`.toLowerCase().includes(q)) return false
      return true
    })
    const dir = sort.dir === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const A = a[sort.key], B = b[sort.key]
      if (typeof A === 'number') return (A - B) * dir
      return String(A || '').localeCompare(String(B || '')) * dir
    })
    return list
  }, [products, query, catFilter, badgeFilter, sort])

  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }
  const sortIndicator = (key) =>
    sort.key === key ? <span className="admin-sort-arrow">{sort.dir === 'asc' ? '↑' : '↓'}</span> : null

  const startEditPrice = (p) => {
    setEditingPrice(p.slug)
    setDraftPrice(String(p.price))
  }
  const cancelEditPrice = () => {
    setEditingPrice(null)
    setDraftPrice('')
  }
  const savePrice = async (p) => {
    const next = Number(draftPrice)
    if (!Number.isFinite(next) || next <= 0) { toast('Enter a valid price', 'error'); return }
    if (next === p.price) { cancelEditPrice(); return }
    setBusy(p.slug)
    try {
      const res = await fetch(`/api/admin/products/${p.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: next }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) toast(data.error || 'Save failed', 'error')
      else {
        setProducts((prev) => prev.map((x) => (x.slug === p.slug ? { ...x, price: next } : x)))
        toast(`${p.name} → ${formatPrice(next)}`, 'success')
        router.refresh()
      }
    } catch { toast('Network error', 'error') }
    setBusy(null); cancelEditPrice()
  }
  const onPriceKey = (e, p) => {
    if (e.key === 'Enter') savePrice(p)
    else if (e.key === 'Escape') cancelEditPrice()
  }

  const setBadge = async (p, badge) => {
    setBusy(p.slug)
    try {
      const res = await fetch(`/api/admin/products/${p.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badge }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) toast(data.error || 'Update failed', 'error')
      else {
        setProducts((prev) => prev.map((x) => (x.slug === p.slug ? { ...x, badge: badge || null } : x)))
        toast(badge ? `Marked "${badge}"` : 'Badge removed', 'success')
        router.refresh()
      }
    } catch { toast('Network error', 'error') }
    setBusy(null)
  }

  const remove = async (p) => {
    const yes = await confirm({
      title: `Delete "${p.name}"?`,
      message: 'This removes it from the storefront immediately and cannot be undone.',
      productThumb: p.images?.[0],
      confirmText: 'Delete',
      cancelText: 'Keep',
      danger: true,
    })
    if (!yes) return
    setBusy(p.slug)
    try {
      const res = await fetch(`/api/admin/products/${p.slug}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.ok) toast(data.error || 'Delete failed', 'error')
      else {
        setProducts((prev) => prev.filter((x) => x.slug !== p.slug))
        toast(`Deleted "${p.name}"`, 'success')
        router.refresh()
      }
    } catch { toast('Network error', 'error') }
    setBusy(null)
  }

  const duplicate = async (p) => {
    const yes = await confirm({
      title: `Duplicate "${p.name}"?`,
      message: 'A copy will be created with " (Copy)" in the name. You can rename it after.',
      productThumb: p.images?.[0],
      confirmText: 'Duplicate',
      cancelText: 'Cancel',
    })
    if (!yes) return
    setBusy(p.slug)
    try {
      const copy = {
        ...p,
        name: `${p.name} (Copy)`,
        slug: `${p.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      }
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) toast(data.error || 'Duplicate failed', 'error')
      else {
        setProducts((prev) => [data.product, ...prev])
        toast(`Duplicated · edit "${data.product.name}"`, 'success')
        router.refresh()
      }
    } catch { toast('Network error', 'error') }
    setBusy(null)
  }

  const clearFilters = () => { setQuery(''); setCatFilter('All'); setBadgeFilter('All') }
  const filtersActive = query || catFilter !== 'All' || badgeFilter !== 'All'

  // Reusable cells
  const PriceCell = ({ p, big = false }) =>
    editingPrice === p.slug ? (
      <div className="admin-price-edit">
        <span className="admin-price-prefix">₹</span>
        <input
          type="number"
          value={draftPrice}
          onChange={(e) => setDraftPrice(e.target.value)}
          onKeyDown={(e) => onPriceKey(e, p)}
          onBlur={() => savePrice(p)}
          autoFocus
          min={0}
        />
      </div>
    ) : (
      <button
        onClick={() => startEditPrice(p)}
        className={`admin-price-display ${big ? 'big' : ''} ${hasDiscount(p) ? 'on-sale' : ''}`}
        title="Click to edit selling price"
      >
        <span className="admin-price-current">{formatPrice(p.price)}</span>
        {hasDiscount(p) && (
          <>
            <s className="admin-price-mrp">{formatPrice(p.originalPrice)}</s>
            <span className="admin-price-pct">−{discountPercent(p)}%</span>
          </>
        )}
        <span className="admin-edit-hint">✎</span>
      </button>
    )

  const BadgeCell = ({ p }) => (
    <select
      value={p.badge || ''}
      onChange={(e) => setBadge(p, e.target.value || null)}
      className={`admin-badge-select ${p.badge ? 'has-badge' : ''}`}
      disabled={busy === p.slug}
      onClick={(e) => e.stopPropagation()}
    >
      {BADGE_OPTIONS.map((b) => (
        <option key={b || 'none'} value={b || ''}>{b || '—'}</option>
      ))}
    </select>
  )

  const RowActions = ({ p, compact = false }) => (
    <div className={`admin-row-actions ${compact ? 'compact' : ''}`}>
      <Link href={`/collection/${p.slug}`} target="_blank" className="admin-link-muted">View</Link>
      <Link href={`/admin/dashboard/edit/${p.slug}`} className="admin-link">Edit</Link>
      <button onClick={() => duplicate(p)} className="admin-link-muted" disabled={busy === p.slug}>
        Duplicate
      </button>
      <button onClick={() => remove(p)} disabled={busy === p.slug} className="admin-link-danger">
        Delete
      </button>
    </div>
  )

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <span className="admin-search-icon">⌕</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products… (press / to focus)"
          />
          {query && (
            <button onClick={() => setQuery('')} className="admin-search-clear" aria-label="Clear">
              ×
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <span className="admin-filter-label">Category</span>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            {allCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="admin-filter-group">
          <span className="admin-filter-label">Badge</span>
          <select value={badgeFilter} onChange={(e) => setBadgeFilter(e.target.value)}>
            <option>All</option><option>None</option><option>New</option>
            <option>Best Seller</option><option>Limited</option>
          </select>
        </div>

        {filtersActive && (
          <button onClick={clearFilters} className="admin-link-muted">Clear filters</button>
        )}

        <div className="admin-toolbar-spacer" />

        <span className="admin-result-count">
          {filteredSorted.length} of {products.length}
        </span>

        <div className="admin-view-toggle" role="tablist" aria-label="View mode">
          {VIEW_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setView(m.id)}
              className={view === m.id ? 'active' : ''}
              title={m.label}
              aria-label={m.label}
              role="tab"
              aria-selected={view === m.id}
            >
              {m.icon}
            </button>
          ))}
        </div>
      </div>

      {filteredSorted.length === 0 ? (
        <div className="admin-empty">
          <p className="italiana" style={{ fontSize: '2rem' }}>
            {filtersActive ? 'No matches.' : 'No products yet.'}
          </p>
          <p>{filtersActive ? 'Try clearing your filters.' : 'Add the first piece using the button above.'}</p>
        </div>
      ) : (
        <>
          {view === 'list' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th onClick={() => toggleSort('name')} className="admin-th-sortable">
                      Name {sortIndicator('name')}
                    </th>
                    <th onClick={() => toggleSort('category')} className="admin-th-sortable">
                      Category {sortIndicator('category')}
                    </th>
                    <th>Badge</th>
                    <th onClick={() => toggleSort('price')} className="admin-th-sortable">
                      Price {sortIndicator('price')}
                    </th>
                    <th>Sizes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((p) => (
                    <tr key={p.slug} className={busy === p.slug ? 'admin-row-busy' : ''}>
                      <td>
                        <div className="admin-thumb"><img src={p.images?.[0]} alt="" /></div>
                      </td>
                      <td>
                        <Link href={`/admin/dashboard/edit/${p.slug}`} className="admin-product-name">
                          {p.name}
                        </Link>
                        <div className="admin-slug">/{p.slug}</div>
                      </td>
                      <td>{p.category}</td>
                      <td><BadgeCell p={p} /></td>
                      <td><PriceCell p={p} /></td>
                      <td className="admin-mute">{(p.sizes || []).join(' · ')}</td>
                      <td><RowActions p={p} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === 'icons' && (
            <div className="admin-grid-icons">
              {filteredSorted.map((p) => (
                <Link
                  key={p.slug}
                  href={`/admin/dashboard/edit/${p.slug}`}
                  className={`admin-icon-card ${busy === p.slug ? 'admin-row-busy' : ''}`}
                >
                  <div className="admin-icon-img">
                    <img src={p.images?.[0]} alt="" />
                    {p.badge && <span className="admin-icon-badge">{p.badge}</span>}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        remove(p)
                      }}
                      className="admin-icon-delete"
                      title="Delete"
                      disabled={busy === p.slug}
                    >
                      ×
                    </button>
                  </div>
                  <div className="admin-icon-cap">
                    <span className="admin-icon-name">{p.name}</span>
                    <span className="admin-icon-price">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {view === 'columns' && (
            <div className="admin-grid-columns">
              {filteredSorted.map((p) => (
                <article key={p.slug} className={`admin-col-card ${busy === p.slug ? 'admin-row-busy' : ''}`}>
                  <Link href={`/admin/dashboard/edit/${p.slug}`} className="admin-col-img">
                    <img src={p.images?.[0]} alt="" />
                    {p.badge && <span className="admin-col-badge">{p.badge}</span>}
                  </Link>
                  <div className="admin-col-body">
                    <Link href={`/admin/dashboard/edit/${p.slug}`} className="admin-product-name">
                      {p.name}
                    </Link>
                    <div className="admin-slug">/{p.slug}</div>
                    <div className="admin-col-meta">
                      <span className="admin-col-meta-pill">{p.category}</span>
                      {(p.sizes || []).length > 0 && (
                        <span className="admin-mute">{(p.sizes || []).join(' · ')}</span>
                      )}
                    </div>
                    <div className="admin-col-controls">
                      <PriceCell p={p} big />
                      <BadgeCell p={p} />
                    </div>
                    <RowActions p={p} compact />
                  </div>
                </article>
              ))}
            </div>
          )}

          {view === 'gallery' && (
            <div className="admin-grid-gallery">
              {filteredSorted.map((p) => (
                <article key={p.slug} className={`admin-gallery-card ${busy === p.slug ? 'admin-row-busy' : ''}`}>
                  <Link href={`/admin/dashboard/edit/${p.slug}`} className="admin-gallery-img">
                    <img src={p.images?.[0]} alt="" />
                    {p.badge && <span className="admin-gallery-badge">{p.badge}</span>}
                  </Link>
                  <div className="admin-gallery-body">
                    <div className="admin-gallery-head">
                      <Link href={`/admin/dashboard/edit/${p.slug}`} className="admin-gallery-name">
                        {p.name}
                      </Link>
                      <span className="admin-gallery-cat">{p.category}</span>
                    </div>
                    <div className="admin-gallery-row">
                      <PriceCell p={p} big />
                      <BadgeCell p={p} />
                    </div>
                    <RowActions p={p} compact />
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <div className="admin-shortcuts">
        <span><kbd>/</kbd> search</span>
        <span><kbd>n</kbd> new product</span>
        <span><kbd>1</kbd>–<kbd>4</kbd> switch view</span>
        <span>Click a price to edit inline</span>
      </div>
    </>
  )
}
