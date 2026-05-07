'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminTopbar() {
  const router = useRouter()
  const pathname = usePathname()

  const links = [
    { href: '/admin/dashboard', label: 'Products' },
    { href: '/admin/dashboard/new', label: 'New Product' },
    { href: '/admin/dashboard/theme', label: 'Theme' },
  ]

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin')
    router.refresh()
  }

  return (
    <header className="admin-topbar">
      <Link href="/admin/dashboard" className="admin-brand">
        SHAN<span style={{ color: '#c94f2a' }}>KY</span>
        <span className="admin-brand-tag">Admin</span>
      </Link>
      <nav className="admin-nav">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`admin-nav-link ${pathname === l.href ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="admin-topbar-right">
        <Link href="/" className="admin-link-muted">View store →</Link>
        <button onClick={logout} className="admin-btn-ghost">Sign out</button>
      </div>
    </header>
  )
}
