const row1 = ['Outerwear', 'Knitwear', 'Dresses', 'Trousers', 'Accessories']
const row2 = ['Footwear', 'Loungewear', 'Basics', 'Tailoring', 'Denim']

function MarqueeRow({ items, reverse = false }) {
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div
      className="flex whitespace-nowrap overflow-hidden"
      style={{ animation: `ticker ${reverse ? '25s linear infinite reverse' : '28s linear infinite'}` }}
    >
      {doubled.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6" style={{ padding: '0 40px' }}>
          <span
            className="italiana"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              color: '#0a0a0a',
              letterSpacing: '0.04em',
            }}
          >
            {item}
          </span>
          <span
            style={{ width: 8, height: 8, background: '#c94f2a', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }}
          />
        </span>
      ))}
    </div>
  )
}

export default function Categories() {
  return (
    <div style={{ background: '#d4c5a9', padding: '80px 0', overflow: 'hidden' }}>
      <MarqueeRow items={row1} />
      <div style={{ marginTop: 20 }}>
        <MarqueeRow items={row2} reverse />
      </div>
    </div>
  )
}
