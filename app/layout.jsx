import './globals.css'
import { CartProvider } from '@/components/CartContext'
import Cursor from '@/components/Cursor'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Toast from '@/components/Toast'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Shanky — Wear Nothing Ordinary',
  description:
    'Shanky · A Bengaluru atelier crafting quiet, considered clothing. Slow-made garments, shipped worldwide.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@300;400;500;600;700&family=Italiana&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Cursor />
          <Navbar />
          <CartDrawer />
          <Toast />
          <main className="page-main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
