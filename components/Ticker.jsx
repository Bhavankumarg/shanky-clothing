const items = [
  'Free Shipping Over ₹4999',
  'Sustainably Made',
  '30-Day Returns',
  'New SS25 Drop',
  'Members Get 15% Off',
]

export default function Ticker() {
  const doubled = [...items, ...items, ...items, ...items]

  return (
    <div className="brand-ticker">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'ticker 20s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.05rem',
              letterSpacing: '0.22em',
              color: '#f5f0e8',
              padding: '0 36px',
              lineHeight: 1,
            }}
          >
            {item}
            <span style={{ color: 'rgba(245,240,232,0.4)', padding: '0 16px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
