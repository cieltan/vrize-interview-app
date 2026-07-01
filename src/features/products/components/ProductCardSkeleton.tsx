export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden border border-gray-200 bg-white">
      <div className="aspect-square animate-pulse bg-gray-200" />
      <div className="flex flex-col gap-3 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full animate-pulse rounded-sm bg-gray-200" />
      </div>
    </div>
  )
}
