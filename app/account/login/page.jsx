import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/userAuth'
import AuthForms from '@/components/AuthForms'

export const dynamic = 'force-dynamic'

export default async function AccountLoginPage({ searchParams }) {
  const user = await getCurrentUser()
  if (user) redirect(searchParams?.next || '/account')
  return (
    <Suspense fallback={null}>
      <AuthForms defaultMode={searchParams?.mode === 'signup' ? 'signup' : 'login'} />
    </Suspense>
  )
}
