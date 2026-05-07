'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'void-wishlist-v1'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const has = useCallback(
    (slug) => items.some((i) => i.slug === slug),
    [items]
  )

  const add = useCallback((product) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === product.slug)) return prev
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          originalPrice:
            product.originalPrice && product.originalPrice > product.price
              ? product.originalPrice
              : null,
          image: product.images?.[0],
          category: product.category,
          colors: product.colors,
          sizes: product.sizes,
          addedAt: Date.now(),
        },
      ]
    })
  }, [])

  const remove = useCallback((slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const toggle = useCallback((product) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === product.slug)) {
        return prev.filter((i) => i.slug !== product.slug)
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          originalPrice:
            product.originalPrice && product.originalPrice > product.price
              ? product.originalPrice
              : null,
          image: product.images?.[0],
          category: product.category,
          colors: product.colors,
          sizes: product.sizes,
          addedAt: Date.now(),
        },
      ]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = items.length

  return (
    <WishlistContext.Provider
      value={{ items, add, remove, toggle, has, clear, count, hydrated }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider')
  return ctx
}
