import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Products from '@/components/Products'
import EditorialStrip from '@/components/EditorialStrip'
import AtelierStrip from '@/components/AtelierStrip'
import Categories from '@/components/Categories'
import About from '@/components/About'
import Newsletter from '@/components/Newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Products />
      <EditorialStrip />
      <AtelierStrip />
      <Categories />
      <About />
      <Newsletter />
    </>
  )
}
