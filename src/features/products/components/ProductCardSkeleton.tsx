export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <div className="aspect-square animate-pulse bg-neutral-200" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
        <div className="h-9 w-full animate-pulse rounded-sm bg-neutral-200" />
      </div>
    </div>
  )
}
