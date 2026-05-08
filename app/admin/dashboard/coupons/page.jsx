import { getAllCoupons } from '@/lib/couponStore'
import AdminCouponsClient from '@/components/AdminCouponsClient'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">Promotions</p>
          <h1 className="italiana admin-h1">Coupons</h1>
          <p className="admin-sub">
            Codes shoppers can apply at checkout. Toggle active to retire one without losing its history.
          </p>
        </div>
      </div>
      <AdminCouponsClient initial={coupons} />
    </div>
  )
}
