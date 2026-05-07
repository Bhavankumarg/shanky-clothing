import PageHeader from '@/components/PageHeader'
import CollectionClient from '@/components/CollectionClient'
import { getAllProducts, getCategories } from '@/lib/productStore'

export const dynamic = 'force-dynamic'

export default async function CollectionPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])

  return (
    <>
      <PageHeader
        kicker="The Men's Edit"
        title="Pieces"
        accent=" That Stay."
        subtitle="Made to be worn until they fall apart, then mended and worn again. No drops, no hype — just menswear built around how you actually live."
        image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1600&q=85&auto=format&fit=crop"
      />
      <CollectionClient products={products} categories={categories} />
    </>
  )
}
