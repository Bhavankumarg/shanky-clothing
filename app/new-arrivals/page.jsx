import PageHeader from '@/components/PageHeader'
import NewArrivalsClient from '@/components/NewArrivalsClient'
import { getNewArrivals } from '@/lib/productStore'

export const dynamic = 'force-dynamic'

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(12)
  return (
    <>
      <PageHeader
        kicker="Just Landed · Men"
        title="New"
        accent=" Arrivals"
        subtitle="Fresh from the atelier. The men's pieces shaped by our quietest mood yet — slower fabrics, softer silhouettes, longer commitments."
        image="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1600&q=85&auto=format&fit=crop"
      />
      <div style={{ background: '#0a0a0a', color: '#f5f0e8', padding: '14px 60px', textAlign: 'center' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: '0.22em' }}>
          ✦ Free overnight shipping on all New Arrivals · this week only ✦
        </span>
      </div>
      <NewArrivalsClient products={products} />
    </>
  )
}
