export function MovieCardSkeleton({ layout = 'row' }) {
  const sizing = layout === 'row' ? 'w-[140px] shrink-0 sm:w-[170px]' : 'w-full'
  return (
    <div className={sizing}>
      <div className="aspect-[2/3] w-full animate-pulse rounded-xl bg-navy-700" />
      <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-navy-700" />
      <div className="mt-1.5 h-2.5 w-1/2 animate-pulse rounded bg-navy-700" />
    </div>
  )
}

export function MovieRowSkeleton({ count = 6 }) {
  return (
    <div>
      <div className="mb-3 h-3 w-28 animate-pulse rounded bg-navy-700" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} layout="grid" />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[64vh] min-h-[440px] w-full animate-pulse bg-navy-800 sm:h-[80vh]">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-scrim" />
      <div className="absolute bottom-14 left-4 flex w-full max-w-lg flex-col gap-3 sm:left-8 md:left-12">
        <div className="h-9 w-3/4 rounded bg-navy-700 sm:h-11" />
        <div className="h-3 w-full rounded bg-navy-700" />
        <div className="h-3 w-5/6 rounded bg-navy-700" />
        <div className="mt-2 h-11 w-44 rounded-full bg-navy-700" />
      </div>
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[38vh] w-full bg-navy-800 sm:h-[46vh]" />
      <div className="mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="hidden h-72 w-48 shrink-0 rounded-xl bg-navy-700 sm:block" />
          <div className="flex-1 space-y-3 pt-4">
            <div className="h-8 w-2/3 rounded bg-navy-700" />
            <div className="h-3 w-1/3 rounded bg-navy-700" />
            <div className="h-3 w-full rounded bg-navy-700" />
            <div className="h-3 w-5/6 rounded bg-navy-700" />
            <div className="h-3 w-2/3 rounded bg-navy-700" />
          </div>
        </div>
      </div>
    </div>
  )
}
