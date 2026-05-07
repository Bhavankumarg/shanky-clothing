import Link from 'next/link'
import { getAllProducts } from '@/lib/productStore'
import AdminProductList from '@/components/AdminProductList'
import AdminStats from '@/components/AdminStats'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const products = await getAllProducts()

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">Catalog</p>
          <h1 className="italiana admin-h1">Products</h1>
          <p className="admin-sub">
            Manage prices, badges, images, and product details. Changes are live on the storefront immediately.
          </p>
        </div>
        <Link href="/admin/dashboard/new" className="btn-dark admin-cta">
          <span>+ New Product</span>
        </Link>
      </div>

      <AdminStats products={products} />
      <AdminProductList products={products} />
    </div>
  )
}
