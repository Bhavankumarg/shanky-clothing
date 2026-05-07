'use client'
import { usePathname } from 'next/navigation'
import Cursor from '@/components/Cursor'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Toast from '@/components/Toast'
import Footer from '@/components/Footer'

export default function StorefrontShell({ children }) {
  const path = usePathname() || ''
  const isAdmin = path.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Cursor />
      <Navbar />
      <CartDrawer />
      <Toast />
      <main className="page-main">{children}</main>
      <Footer />
    </>
  )
}
