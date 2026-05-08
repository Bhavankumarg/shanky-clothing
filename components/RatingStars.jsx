'use client'
import { stars } from '@/lib/reviews'

export default function RatingStars({ rating = 0, size = 14 }) {
  const arr = stars(rating)
  return (
    <span className="rating-stars" aria-hidden style={{ fontSize: size }}>
      {arr.map((kind, i) => {
        const fill = kind === 'full' ? 'currentColor' : 'transparent'
        const halfId = `half-${i}-${rating}`
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
            {kind === 'half' && (
              <defs>
                <linearGradient id={halfId}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.73 1.64 7.03z"
              fill={kind === 'half' ? `url(#${halfId})` : fill}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        )
      })}
    </span>
  )
}
