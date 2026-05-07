import Link from 'next/link'

const shop = [
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Outerwear', href: '/collection?cat=Outerwear' },
  { label: 'Tailoring', href: '/collection?cat=Tailoring' },
  { label: 'Knitwear', href: '/collection?cat=Knitwear' },
  { label: 'Shirts', href: '/collection?cat=Shirts' },
  { label: 'Denim', href: '/collection?cat=Denim' },
  { label: 'All Men', href: '/collection' },
]
const about = [
  { label: 'Our Story', href: '/about' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Press', href: '/contact' },
]
const help = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping & Returns', href: '/shipping-returns' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-col">
          <Link href="/" className="footer-brand">
            SHAN<span style={{ color: '#c94f2a' }}>KY</span>
          </Link>
          <p className="footer-tag">
            Clothing for the thoughtful. Made slow, worn long. Based in Bengaluru, shipped worldwide.
          </p>
          <div className="footer-socials">
            {['IG', 'PIN', 'TT'].map((s) => (
              <a key={s} href="#" className="footer-social">{s}</a>
            ))}
          </div>
        </div>

        {[
          { title: 'Shop', links: shop },
          { title: 'About', links: about },
          { title: 'Help', links: help },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="footer-heading">{col.title}</h4>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href} className="footer-link footer-list-link">
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>© 2025 SHANKY. All rights reserved.</p>
        <div className="footer-paypills">
          {['Visa', 'MC', 'Amex', 'UPI', 'RuPay'].map((p) => (
            <span key={p} className="footer-paypill">{p}</span>
          ))}
        </div>
        <p>Made with intention in Bengaluru, India.</p>
      </div>
    </footer>
  )
}
