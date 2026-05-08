'use client'
import { useState } from 'react'
import { useAdminUI } from './AdminUI'

const empty = { code: '', percent: 10, description: '', active: true, minSubtotal: 0 }

export default function AdminCouponsClient({ initial }) {
  const { toast, confirm } = useAdminUI()
  const [list, setList] = useState(initial || [])
  const [draft, setDraft] = useState(empty)
  const [busy, setBusy] = useState(false)

  const upsert = async (input) => {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        toast(data.error || 'Save failed', 'error')
      } else {
        setList((curr) => {
          const exists = curr.some((c) => c.code === data.coupon.code)
          return exists
            ? curr.map((c) => (c.code === data.coupon.code ? data.coupon : c))
            : [data.coupon, ...curr]
        })
        toast(`Saved ${data.coupon.code}`, 'success')
        if (input === draft) setDraft(empty)
      }
    } catch {
      toast('Network error', 'error')
    }
    setBusy(false)
  }

  const remove = async (code) => {
    const yes = await confirm({
      title: `Delete ${code}?`,
      message: 'Customers will no longer be able to apply this code.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      danger: true,
    })
    if (!yes) return
    const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(code)}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok || !data.ok) toast(data.error || 'Delete failed', 'error')
    else {
      setList((curr) => curr.filter((c) => c.code !== code))
      toast(`Deleted ${code}`, 'success')
    }
  }

  const toggleActive = (c) => upsert({ ...c, active: !c.active })

  const submitDraft = (e) => {
    e.preventDefault()
    if (!draft.code.trim() || !draft.percent) {
      toast('Code and percent are required', 'error')
      return
    }
    upsert(draft)
  }

  return (
    <div className="admin-coupons">
      <form className="coupon-form" onSubmit={submitDraft}>
        <div className="admin-field-row">
          <label className="admin-field">
            <span>Code</span>
            <input
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER25"
              required
            />
          </label>
          <label className="admin-field">
            <span>Percent off</span>
            <input
              type="number"
              min={1}
              max={90}
              value={draft.percent}
              onChange={(e) => setDraft({ ...draft, percent: Number(e.target.value) })}
              required
            />
          </label>
          <label className="admin-field">
            <span>Min. subtotal (₹)</span>
            <input
              type="number"
              min={0}
              value={draft.minSubtotal}
              onChange={(e) => setDraft({ ...draft, minSubtotal: Number(e.target.value) })}
            />
          </label>
        </div>
        <label className="admin-field">
          <span>Description</span>
          <input
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Summer drop · 25% off everything"
          />
        </label>
        <div className="admin-form-actions">
          <span className="admin-shortcut-hint">Codes are auto-uppercased.</span>
          <button type="submit" className="btn-dark" disabled={busy}>
            <span>{busy ? 'Saving…' : 'Add coupon'}</span>
          </button>
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>%</th>
            <th>Min ₹</th>
            <th>Description</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#7a7060' }}>No coupons yet — add your first above.</td></tr>
          )}
          {list.map((c) => (
            <tr key={c.code}>
              <td><strong>{c.code}</strong></td>
              <td>{c.percent}%</td>
              <td>{c.minSubtotal ? `₹${c.minSubtotal.toLocaleString('en-IN')}` : '—'}</td>
              <td>{c.description || <em style={{ color: '#9c9080' }}>—</em>}</td>
              <td>
                <label className="coupon-toggle">
                  <input type="checkbox" checked={c.active} onChange={() => toggleActive(c)} />
                  <span>{c.active ? 'On' : 'Off'}</span>
                </label>
              </td>
              <td>
                <button onClick={() => remove(c.code)} className="admin-link-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
