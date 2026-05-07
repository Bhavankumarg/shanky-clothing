'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const follower = document.getElementById('cursor-follower')
    if (!cursor || !follower) return

    let mx = 0, my = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.left = mx + 'px'
      cursor.style.top = my + 'px'
      requestAnimationFrame(() => {
        follower.style.left = mx + 'px'
        follower.style.top = my + 'px'
      })
    }

    const isInteractive = (el) => {
      if (!el) return false
      return !!el.closest(
        'a, button, input, select, textarea, .product-card, .swatch, .size-btn, .filter-chip, .pay-method, .upi-app, .acc-trigger, .qty button, .tab, .emi-pill'
      )
    }

    const onOver = (e) => {
      if (isInteractive(e.target)) {
        cursor.classList.add('expanded')
        follower.classList.add('expanded')
      } else {
        cursor.classList.remove('expanded')
        follower.classList.remove('expanded')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div id="cursor" />
      <div id="cursor-follower" />
    </>
  )
}
