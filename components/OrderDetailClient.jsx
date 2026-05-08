'use client'
import Link from 'next/link'
import { useCart } from './CartContext'
import { formatPrice } from '@/lib/products'

const STATUS_FLOW = [
  { key: 'placed', label: 'Order placed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

export default function OrderDetailClient({ order }) {
  const { addItem } = useCart()
  const status = order.status || 'placed'
  const isCancelled = status === 'cancelled'
  const reachedIdx = STATUS_FLOW.findIndex((s) => s.key === status)

  const reorder = () => {
    order.items?.forEach((it) => {
      addItem(
        {
          slug: it.slug,
          name: it.name,
          price: it.price,
          originalPrice: it.originalPrice,
          images: [it.image],
          sizes: it.size ? [it.size] : ['One Size'],
          colors: it.color ? [it.color] : ['Default'],
        },
        { size: it.size, color: it.color, qty: it.qty }
      )
    })
  }

  return (
    <section className="order-detail">
      <Link href="/account" className="order-detail-back">← Back to account</Link>
      <div className="order-detail-head">
        <div>
          <p className="section-label">Order</p>
          <h1 className="italiana order-detail-title">{order.orderId}</h1>
          <p className="order-detail-meta">
            Placed {new Date(order.createdAt || Date.now()).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {' · '}{order.payment || 'Online'}
            {order.totals?.coupon && <> · Promo <strong>{order.totals.coupon}</strong></>}
          </p>
        </div>
        <button onClick={reorder} className="btn-dark order-detail-reorder">
          <span>Reorder all</span>
        </button>
      </div>

      {!isCancelled && (
        <ol className="order-status-flow" aria-label="Order status">
          {STATUS_FLOW.map((s, i) => {
            const done = reachedIdx >= i
            const active = reachedIdx === i
            return (
              <li key={s.key} className={`order-status-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                <span className="order-status-dot">{done ? '✓' : i + 1}</span>
                <span className="order-status-label">{s.label}</span>
              </li>
            )
          })}
        </ol>
      )}
      {isCancelled && (
        <p className="order-status-cancelled">This order was cancelled.</p>
      )}
      {order.etaText && !isCancelled && (
        <p className="order-detail-eta">Expected delivery · <strong>{order.etaText}</strong></p>
      )}

      <div className="order-detail-grid">
        <div>
          <p className="section-label" style={{ marginBottom: 14 }}>Items · {order.items?.length || 0}</p>
          <div className="order-detail-items">
            {order.items?.map((it, idx) => (
              <Link
                href={`/collection/${it.slug}`}
                key={`${it.id || it.slug}-${idx}`}
                className="order-detail-item"
                title="View product"
              >
                <div className="order-detail-item-img">
                  <img src={it.image} alt={it.name} />
                </div>
                <div className="order-detail-item-body">
                  <strong>{it.name}</strong>
                  <span className="order-detail-item-meta">
                    {it.color && <>{it.color} · </>}Size {it.size} · Qty {it.qty}
                  </span>
                  <span className="order-detail-item-help">
                    Tap to verify on product page →
                  </span>
                </div>
                <div className="order-detail-item-price">
                  {it.originalPrice && it.originalPrice > it.price && (
                    <s>{formatPrice(it.originalPrice * it.qty)}</s>
                  )}
                  <strong>{formatPrice(it.price * it.qty)}</strong>
                  {it.qty > 1 && <small>{formatPrice(it.price)} each</small>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="order-detail-side">
          <div className="order-detail-card">
            <p className="section-label">Summary</p>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.totals?.subtotal || 0)}</span>
            </div>
            {(order.totals?.discount || 0) > 0 && (
              <div className="summary-row" style={{ color: 'var(--rust)' }}>
                <span>Promo {order.totals?.coupon ? `(${order.totals.coupon})` : ''}</span>
                <span>− {formatPrice(order.totals.discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{(order.totals?.shipping || 0) === 0 ? 'Free' : formatPrice(order.totals.shipping)}</span>
            </div>
            <div className="summary-total">
              <span>Total paid</span>
              <span>{formatPrice(order.totals?.total || 0)}</span>
            </div>
          </div>

          <div className="order-detail-card">
            <p className="section-label">Ship to</p>
            <p style={{ marginTop: 8, lineHeight: 1.6, fontSize: '0.9rem' }}>
              <strong>{order.address?.fullName}</strong><br />
              {order.address?.address}{order.address?.address2 ? `, ${order.address.address2}` : ''}<br />
              {order.address?.city} · {order.address?.state} · {order.address?.pincode}<br />
              {order.address?.phone && <>{order.address.phone}<br /></>}
              <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{order.email}</span>
            </p>
          </div>

          <div className="order-detail-help">
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Spotted a wrong item or size?{' '}
              <Link href="/contact" style={{ color: 'var(--rust)' }}>Contact us</Link>{' '}
              within 24 hours of placing the order.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
