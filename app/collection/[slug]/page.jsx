import { notFound } from 'next/navigation'
import { getProductBySlug, getRelated } from '@/lib/productStore'
import ProductDetailClient from '@/components/ProductDetailClient'
import { ratingFor } from '@/lib/reviews'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Not found · Shanky' }
  const desc = product.description?.slice(0, 155) || `Shanky · ${product.name}`
  return {
    title: `${product.name} · Shanky`,
    description: desc,
    openGraph: {
      title: `${product.name} · Shanky`,
      description: desc,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
  }
}

function ProductJsonLd({ product }) {
  const { rating, count } = ratingFor(product.slug)
  const json = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Shanky' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: count,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  const related = await getRelated(params.slug, 3)
  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailClient product={product} related={related} />
    </>
  )
}
