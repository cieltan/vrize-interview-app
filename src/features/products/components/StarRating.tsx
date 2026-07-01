interface StarRatingProps {
  rating: number
  reviewCount: number
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const pct = (Math.max(0, Math.min(5, rating)) / 5) * 100

  return (
    <div className="flex items-center gap-1.5 text-sm" aria-label={`Rated ${rating} out of 5 stars`}>
      <span className="relative inline-block leading-none" aria-hidden="true">
        <span className="tracking-tight text-gray-300">★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap tracking-tight text-amber-500"
          style={{ width: `${pct}%` }}
        >
          ★★★★★
        </span>
      </span>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)} ({reviewCount.toLocaleString()})
      </span>
    </div>
  )
}
