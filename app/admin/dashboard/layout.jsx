import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import AdminTopbar from '@/components/AdminTopbar'
import { AdminUIProvider } from '@/components/AdminUI'

export const dynamic = 'force-dynamic'

export default function AdminDashboardLayout({ children }) {
  if (!isAdmin()) redirect('/admin')
  return (
    <div className="admin-shell">
      <AdminUIProvider>
        <AdminTopbar />
        <main className="admin-main">{children}</main>
      </AdminUIProvider>
    </div>
  )
}
