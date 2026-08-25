import { Loader2 } from 'lucide-react'
import { MovieCard } from '../MovieCard/MovieCard'
import { GridSkeleton } from '../LoadingSkeleton/LoadingSkeleton'
import { ErrorState, errorToCode } from '../ErrorState/ErrorState'

export function MovieGrid({
  items,
  status = 'success',
  error,
  mediaType = 'movie',
  onPlayTrailer,
  onRetry,
  emptyMessage,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
}) {
  const hasItems = items && items.length > 0

  if (status === 'loading' && !hasItems) return <GridSkeleton />
  if (status === 'error' && !hasItems) return <ErrorState code={errorToCode(error)} onRetry={onRetry} />
  if (!hasItems) return <ErrorState code="empty" message={emptyMessage} />

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MovieCard
            key={`${item.media_type || mediaType}-${item.id}`}
            item={item}
            mediaType={mediaType}
            onPlayTrailer={onPlayTrailer}
            layout="grid"
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-6 py-2.5 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-500/10 disabled:opacity-50"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoadingMore ? 'Loading' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
