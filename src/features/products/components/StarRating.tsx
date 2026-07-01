interface StarRatingProps {
  rating: number
  reviewCount: number
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1 text-sm" aria-label={`Rated ${rating} out of 5 stars`}>
      <span className="text-amber-500" aria-hidden="true">
        ★
      </span>
      <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-gray-400">({reviewCount.toLocaleString()})</span>
    </div>
  )
}
