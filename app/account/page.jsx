import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/userAuth'
import AccountClient from '@/components/AccountClient'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/account/login?next=/account')
  return <AccountClient user={user} />
}
