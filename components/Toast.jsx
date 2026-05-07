'use client'
import { useCart } from './CartContext'

export default function Toast() {
  const { toast } = useCart()
  return (
    <div className={`toast ${toast ? 'show' : ''}`}>
      <span className="toast-mark">✦</span>
      <span>{toast}</span>
    </div>
  )
}
