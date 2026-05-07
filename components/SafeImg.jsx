'use client'
import { useState } from 'react'

// Curated MALE-only fallbacks (verified working, men's editorial / neutral).
const FALLBACKS = [
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop', // male editorial walk
  'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=900&q=85&auto=format&fit=crop', // clean menswear
  'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=85&auto=format&fit=crop',  // neutral atelier hands
]

const pickFallback = (key) => {
  const i = (String(key).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % FALLBACKS.length
  return FALLBACKS[i]
}

/**
 * <img> that swaps to a curated men's editorial photo if the original fails to load.
 */
export default function SafeImg({ src, alt = '', fallbackKey, className = '', style, ...rest }) {
  const [current, setCurrent] = useState(src)
  const [erred, setErred] = useState(false)

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (erred) return
        setErred(true)
        setCurrent(pickFallback(fallbackKey || src || alt))
      }}
    />
  )
}
