import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/productStore'
import AdminProductForm from '@/components/AdminProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">Edit</p>
          <h1 className="italiana admin-h1">{product.name}</h1>
          <p className="admin-sub">Saved changes go live immediately on the storefront.</p>
        </div>
      </div>
      <AdminProductForm mode="edit" initial={product} />
    </div>
  )
}
