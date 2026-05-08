'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    // Skip the custom cursor (and its `cursor: none` body rule) on touch devices
    // and when the user prefers reduced motion. Restore the native cursor in
    // those cases so taps and tab-navigation behave as expected.
    const noHover = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (noHover || reduced) {
      document.body.style.cursor = 'auto'
      document.documentElement.dataset.nativeCursor = '1'
      return
    }

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
