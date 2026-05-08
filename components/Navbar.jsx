'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from './CartContext'
import { useUser } from './UserContext'
import { useWishlist } from './WishlistContext'

const navLinks = [
  { label: 'Collection', href: '/collection' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, setDrawerOpen } = useCart()
  const { user } = useUser()
  const { count: wishCount } = useWishlist()
  const pathname = usePathname() || ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  // Pages that begin with a cream/light background (no dark hero behind the
  // navbar). On these we want the navbar to default to dark text so the logo
  // and links read against the cream page from the very top.
  const isLightBgPage =
    /^\/collection\/[^/]+/.test(pathname) || // PDP
    pathname === '/cart' ||
    pathname === '/account' ||
    pathname === '/checkout' ||
    pathname === '/order-confirmed' ||
    pathname === '/wishlist'

  // Light chrome rules:
  //   • menu open → always white (over the dark overlay)
  //   • light-bg page (e.g. PDP) → never light at the top, always dark
  //   • everywhere else → white at the top, dark after scroll
  const isLight = menuOpen || (!isLightBgPage && !scrolled)

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-10 transition-all duration-400 ${
          scrolled && !menuOpen ? 'nav-scrolled' : ''
        } ${isLight ? 'nav-light' : 'nav-dark'}`}
        style={{ height: '80px' }}
      >
        <Link href="/" className="brand-mark z-[1010] no-underline">
          SHAN<span style={{ color: '#c94f2a' }}>KY</span>
        </Link>

        <div className="hidden md:flex items-center gap-9 z-[1010]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5 z-[1010]">
          <Link
            href={user ? '/account' : '/account/login'}
            className="account-link"
            aria-label={user ? 'My account' : 'Sign in'}
            title={user ? user.name : 'Sign in'}
          >
            {user ? (
              <span className="account-pill">
                <span className="account-avatar">{(user.name || user.email)[0]?.toUpperCase()}</span>
                <span className="account-pill-name">{user.name?.split(' ')[0] || 'Account'}</span>
              </span>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            )}
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="wishlist-btn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishCount > 0 && <span className="bag-count">{wishCount}</span>}
          </Link>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Bag"
            className="bag-btn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && <span className="bag-count">{count}</span>}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className={`relative flex flex-col justify-center items-end gap-[6px] w-11 h-11 bg-transparent border-none p-0 cursor-none ${
              menuOpen ? 'hamburger-open' : ''
            }`}
          >
            <span className="hamburger-line" style={{ width: '32px' }} />
            <span className="hamburger-line" style={{ width: '22px' }} />
            <span className="hamburger-line" style={{ width: '28px' }} />
          </button>
        </div>
      </nav>

      <div className={`menu-overlay ${menuOpen ? 'menu-open' : ''}`}>
        <div className="menu-inner">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="menu-link"
              onClick={close}
              style={{ animationDelay: `${0.4 + i * 0.06}s` }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-8 justify-center mt-12">
            {[
              { label: 'Instagram', href: 'https://instagram.com/' },
              { label: 'Pinterest', href: 'https://pinterest.com/' },
              { label: 'TikTok', href: 'https://www.tiktok.com/' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="menu-social"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
