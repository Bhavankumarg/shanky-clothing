import './globals.css'
import { CartProvider } from '@/components/CartContext'
import { WishlistProvider } from '@/components/WishlistContext'
import { UserProvider } from '@/components/UserContext'
import StorefrontShell from '@/components/StorefrontShell'
import { getCurrentUser } from '@/lib/userAuth'
import { getTheme, themeToCssVars } from '@/lib/themeStore'

export const metadata = {
  title: 'Shanky — Wear Nothing Ordinary',
  description:
    'Shanky · A Bengaluru atelier crafting quiet, considered menswear. Slow-made garments, shipped worldwide.',
}

export default async function RootLayout({ children }) {
  // Resolve the user server-side so the navbar shows the right state on
  // first paint instead of flashing "Sign In" before hydration.
  const initialUser = await getCurrentUser()
  const theme = await getTheme()
  const themeVars = themeToCssVars(theme)

  return (
    <html lang="en" style={themeVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@300;400;500;600;700&family=Italiana&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <UserProvider initialUser={initialUser}>
          <CartProvider>
            <WishlistProvider>
              <StorefrontShell>{children}</StorefrontShell>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
