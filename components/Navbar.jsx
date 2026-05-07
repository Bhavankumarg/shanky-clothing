'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from './CartContext'

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  // Light chrome (white logo/links/icons) when at top of page OR when the
  // fullscreen dark menu is open. Dark chrome once the user scrolls past the
  // hero — so the logo always has contrast against whatever's behind it.
  const isLight = !scrolled || menuOpen

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
            {['Instagram', 'Pinterest', 'TikTok'].map((s) => (
              <a key={s} href="#" onClick={close} className="menu-social">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
