import { getAllOrders } from '@/lib/orderStore'
import AdminOrdersClient from '@/components/AdminOrdersClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">Fulfilment</p>
          <h1 className="italiana admin-h1">Orders</h1>
          <p className="admin-sub">
            Every order placed since you wired up persistence. Update the status to keep customers in the loop.
          </p>
        </div>
      </div>
      <AdminOrdersClient initial={orders} />
    </div>
  )
}
