'use client'
import { useState } from 'react'
import { useAdminUI } from './AdminUI'
import { formatPrice } from '@/lib/products'

const STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersClient({ initial }) {
  const { toast } = useAdminUI()
  const [orders, setOrders] = useState(initial || [])
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState('')

  const update = async (orderId, status) => {
    setBusy(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        toast(data.error || 'Update failed', 'error')
      } else {
        setOrders((list) => list.map((o) => (o.orderId === orderId ? { ...o, status } : o)))
        toast(`Marked ${orderId} as ${status}`, 'success')
      }
    } catch {
      toast('Network error', 'error')
    }
    setBusy('')
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => (o.status || 'placed') === filter)

  if (orders.length === 0) {
    return (
      <div className="admin-empty">
        <p className="admin-section-label">No orders yet</p>
        <p>The first order placed on the storefront will appear here.</p>
      </div>
    )
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-filter">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const count = orders.filter((o) => (o.status || 'placed') === s).length
          if (count === 0) return null
          return (
            <button
              type="button"
              key={s}
              onClick={() => setFilter(s)}
              className={`filter-chip ${filter === s ? 'active' : ''}`}
            >
              {s} ({count})
            </button>
          )
        })}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.orderId}>
              <td>
                <strong>{o.orderId}</strong>
                <small>{new Date(o.createdAt || Date.now()).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
              </td>
              <td>
                {o.address?.fullName}
                <small>{o.email}</small>
                <small>{o.address?.city} · {o.address?.pincode}</small>
              </td>
              <td>
                <div className="admin-orders-thumbs">
                  {o.items?.slice(0, 4).map((it, i) => (
                    <img key={i} src={it.image} alt={it.name} title={`${it.name} × ${it.qty}`} />
                  ))}
                  {o.items?.length > 4 && <span>+{o.items.length - 4}</span>}
                </div>
              </td>
              <td><strong>{formatPrice(o.totals?.total || 0)}</strong></td>
              <td>
                <select
                  value={o.status || 'placed'}
                  onChange={(e) => update(o.orderId, e.target.value)}
                  disabled={busy === o.orderId}
                  className="admin-status-select"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
