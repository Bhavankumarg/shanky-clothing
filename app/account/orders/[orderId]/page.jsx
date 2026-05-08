import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/userAuth'
import { getOrder } from '@/lib/orderStore'
import OrderDetailClient from '@/components/OrderDetailClient'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }) {
  const user = await getCurrentUser()
  if (!user) redirect(`/account/login?next=/account/orders/${params.orderId}`)
  const order = await getOrder(params.orderId)
  if (!order) notFound()
  if ((order.email || '').toLowerCase() !== (user.email || '').toLowerCase()) {
    notFound()
  }
  return <OrderDetailClient order={order} />
}
