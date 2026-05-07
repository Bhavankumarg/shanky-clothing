'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from './UserContext'

export default function AccountClient({ user }) {
  const router = useRouter()
  const { logout } = useUser()

  const onSignOut = async () => {
    await logout()
    router.replace('/')
    router.refresh()
  }

  const initial = (user.name || user.email || '?')[0]?.toUpperCase()
  const created = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <section className="account-page">
      <div className="account-header">
        <div className="account-avatar account-avatar-lg">{initial}</div>
        <div>
          <p className="section-label">Your Account</p>
          <h1 className="italiana account-greeting">
            Hello, <span style={{ color: '#c94f2a' }}>{user.name || user.email.split('@')[0]}</span>.
          </h1>
          <p className="account-meta">
            {user.email} · Member since {created}
          </p>
        </div>
      </div>

      <div className="account-grid">
        <article className="account-tile">
          <p className="section-label">Orders</p>
          <h3 className="italiana account-tile-title">Your past orders</h3>
          <p className="account-tile-text">
            Every order you place is emailed straight to your inbox with full details and tracking.
            For history, search your inbox for <strong>Shanky</strong>.
          </p>
          <Link href="/collection" className="account-tile-link">Continue shopping →</Link>
        </article>

        <article className="account-tile">
          <p className="section-label">Saved addresses</p>
          <h3 className="italiana account-tile-title">No addresses yet</h3>
          <p className="account-tile-text">
            Your shipping address is collected at checkout each time. Saved addresses coming soon.
          </p>
          <Link href="/checkout" className="account-tile-link">Go to checkout →</Link>
        </article>

        <article className="account-tile">
          <p className="section-label">Care &amp; Returns</p>
          <h3 className="italiana account-tile-title">Need help with a piece?</h3>
          <p className="account-tile-text">
            Lifetime mend, 30-day returns, full size guide — all the answers, in one place.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="/faq" className="account-tile-link">FAQ →</Link>
            <Link href="/shipping-returns" className="account-tile-link">Returns →</Link>
          </div>
        </article>

        <article className="account-tile account-tile-dark">
          <p className="section-label" style={{ color: '#c94f2a' }}>Session</p>
          <h3 className="italiana account-tile-title" style={{ color: '#f5f0e8' }}>Sign out</h3>
          <p className="account-tile-text" style={{ color: '#d4c5a9' }}>
            You'll need your password to sign back in.
          </p>
          <button onClick={onSignOut} className="btn-primary" style={{ marginTop: 14 }}>
            <span>Sign out</span>
          </button>
        </article>
      </div>
    </section>
  )
}
