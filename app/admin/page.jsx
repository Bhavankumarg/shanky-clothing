import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import AdminLogin from '@/components/AdminLogin'

export const dynamic = 'force-dynamic'

export default function AdminEntry() {
  if (isAdmin()) redirect('/admin/dashboard')
  return <AdminLogin />
}
