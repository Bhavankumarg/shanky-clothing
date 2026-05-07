import AdminProductForm from '@/components/AdminProductForm'

export const dynamic = 'force-dynamic'

export default function NewProductPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">Create</p>
          <h1 className="italiana admin-h1">New Product</h1>
          <p className="admin-sub">It will appear in the Collection grid the moment you save.</p>
        </div>
      </div>
      <AdminProductForm mode="create" />
    </div>
  )
}
