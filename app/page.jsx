import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Products from '@/components/Products'
import EditorialStrip from '@/components/EditorialStrip'
import ShirtsEdit from '@/components/ShirtsEdit'
import AtelierStrip from '@/components/AtelierStrip'
import Categories from '@/components/Categories'
import About from '@/components/About'
import Newsletter from '@/components/Newsletter'
import { getAllProducts } from '@/lib/productStore'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getAllProducts()
  return (
    <>
      <Hero />
      <Ticker />
      <Products products={products} />
      <EditorialStrip />
      <ShirtsEdit />
      <AtelierStrip />
      <Categories />
      <About />
      <Newsletter />
    </>
  )
}
