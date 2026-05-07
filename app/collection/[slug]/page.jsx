import { notFound } from 'next/navigation'
import { getProductBySlug, getRelated } from '@/lib/productStore'
import ProductDetailClient from '@/components/ProductDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  const related = await getRelated(params.slug, 3)
  return <ProductDetailClient product={product} related={related} />
}
