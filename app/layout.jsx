import './globals.css'
import { CartProvider } from '@/components/CartContext'
import StorefrontShell from '@/components/StorefrontShell'

export const metadata = {
  title: 'Shanky — Wear Nothing Ordinary',
  description:
    'Shanky · A Bengaluru atelier crafting quiet, considered menswear. Slow-made garments, shipped worldwide.',
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
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  )
}
