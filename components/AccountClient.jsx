'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from './UserContext'
import { useWishlist } from './WishlistContext'
import { formatPrice } from '@/lib/products'

export default function AccountClient({ user }) {
  const router = useRouter()
  const { logout } = useUser()
  const { count: wishCount } = useWishlist()
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    Promise.all([
      fetch('/api/account/orders').then((r) => r.json()).catch(() => ({})),
      fetch('/api/account/addresses').then((r) => r.json()).catch(() => ({})),
    ]).then(([o, a]) => {
      if (o.ok) setOrders(o.orders || [])
      if (a.ok) setAddresses(a.addresses || [])
      setLoaded(true)
    })
  }, [])

  const onSignOut = async () => {
    await logout()
    router.replace('/')
    router.refresh()
  }

  const removeAddress = async (id) => {
    const res = await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) setAddresses((list) => list.filter((a) => a.id !== id))
  }

  const stats = useMemo(() => {
    const lifetime = orders.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0)
    const inFlight = orders.filter((o) => ['placed', 'packed', 'shipped'].includes(o.status || 'placed')).length
    return { lifetime, count: orders.length, inFlight }
  }, [orders])

  const initial = (user.name || user.email || '?')[0]?.toUpperCase()
  const created = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <section className="account-page account-v2">
      <header className="account-hero">
        <div className="account-hero-left">
          <div className="account-avatar account-avatar-lg">{initial}</div>
          <div>
            <p className="section-label">Your Account</p>
            <h1 className="italiana account-greeting">
              Hello, <span style={{ color: 'var(--rust)' }}>{user.name || user.email.split('@')[0]}</span>.
            </h1>
            <p className="account-meta">
              {user.email} · Member since {created}
            </p>
          </div>
        </div>
        <div className="account-hero-actions">
          <Link href="/wishlist" className="account-pill-btn">
            ♡ Wishlist · {wishCount}
          </Link>
          <Link href="/collection" className="account-pill-btn">→ Continue shopping</Link>
          <button onClick={onSignOut} className="account-pill-btn account-pill-danger">
            Sign out
          </button>
        </div>
      </header>

      <div className="account-stats">
        <Stat label="Orders placed" value={stats.count} accent />
        <Stat label="In transit" value={stats.inFlight} />
        <Stat label="Lifetime spend" value={formatPrice(stats.lifetime)} />
        <Stat label="Saved addresses" value={addresses.length} />
      </div>

      <nav className="account-tabs" role="tablist">
        {[
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'addresses', label: `Addresses (${addresses.length})` },
          { id: 'help', label: 'Help & Care' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`account-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'orders' && (
        <div className="account-panel">
          {!loaded && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
          {loaded && orders.length === 0 && (
            <div className="account-empty">
              <p className="italiana" style={{ fontSize: '1.6rem' }}>No orders yet.</p>
              <p style={{ color: 'var(--muted)', marginTop: 6 }}>
                When you place an order it'll appear here with tracking, an itemised receipt, and a one-click reorder.
              </p>
              <Link href="/collection" className="btn-dark" style={{ marginTop: 18 }}>
                <span>Browse the collection</span>
              </Link>
            </div>
          )}
          {orders.length > 0 && (
            <ul className="order-cards">
              {orders.map((o) => (
                <li key={o.orderId} className="order-card">
                  <Link href={`/account/orders/${o.orderId}`} className="order-card-link">
                    <div className="order-card-head">
                      <div>
                        <strong>{o.orderId}</strong>
                        <span>
                          {new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{o.items?.length || 0} item{(o.items?.length || 0) === 1 ? '' : 's'}
                        </span>
                      </div>
                      <span className={`order-status order-status-${o.status || 'placed'}`}>
                        {o.status || 'placed'}
                      </span>
                    </div>

                    <div className="order-card-thumbs">
                      {o.items?.slice(0, 5).map((it, i) => (
                        <div key={i} className="order-card-thumb" title={it.name}>
                          <img src={it.image} alt={it.name} />
                        </div>
                      ))}
                      {(o.items?.length || 0) > 5 && (
                        <div className="order-card-thumb order-card-thumb-more">
                          +{o.items.length - 5}
                        </div>
                      )}
                    </div>

                    <div className="order-card-foot">
                      <span style={{ color: 'var(--muted)' }}>
                        Tap to view items, verify pieces, track shipping →
                      </span>
                      <strong>{formatPrice(o.totals?.total || 0)}</strong>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'addresses' && (
        <div className="account-panel">
          {addresses.length === 0 ? (
            <div className="account-empty">
              <p className="italiana" style={{ fontSize: '1.6rem' }}>No saved addresses.</p>
              <p style={{ color: 'var(--muted)', marginTop: 6 }}>
                At checkout, tick "save this address" — it'll prefill next time.
              </p>
              <Link href="/checkout" className="btn-dark" style={{ marginTop: 18 }}>
                <span>Go to checkout</span>
              </Link>
            </div>
          ) : (
            <ul className="address-list">
              {addresses.map((a) => (
                <li key={a.id} className="address-row">
                  <div>
                    <strong>{a.label || 'Home'}</strong>
                    <p>{a.fullName}</p>
                    <p>{a.address}{a.address2 ? `, ${a.address2}` : ''}</p>
                    <p>{a.city} · {a.state} · {a.pincode}</p>
                    {a.phone && <p>{a.phone}</p>}
                  </div>
                  <button
                    onClick={() => removeAddress(a.id)}
                    className="account-tile-link"
                    style={{ alignSelf: 'flex-start', padding: 0, border: 0 }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'help' && (
        <div className="account-panel account-help-grid">
          <Link href="/faq" className="account-help-card">
            <span className="account-help-icon">?</span>
            <strong>FAQ</strong>
            <p>Sizing, shipping, repairs — the answers people ask most.</p>
          </Link>
          <Link href="/shipping-returns" className="account-help-card">
            <span className="account-help-icon">↻</span>
            <strong>Returns</strong>
            <p>30-day window. Unworn, tagged. Free in India.</p>
          </Link>
          <Link href="/size-guide" className="account-help-card">
            <span className="account-help-icon">⌗</span>
            <strong>Size guide</strong>
            <p>Detailed measurements for every silhouette we cut.</p>
          </Link>
          <Link href="/sustainability" className="account-help-card">
            <span className="account-help-icon">∞</span>
            <strong>Lifetime mend</strong>
            <p>We repair what wears out. Bring your piece back, any time.</p>
          </Link>
          <Link href="/contact" className="account-help-card">
            <span className="account-help-icon">✉</span>
            <strong>Talk to us</strong>
            <p>Real humans, no scripts. Reply within one working day.</p>
          </Link>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className={`account-stat ${accent ? 'accent' : ''}`}>
      <span className="account-stat-label">{label}</span>
      <span className="account-stat-value">{value}</span>
    </div>
  )
}
