import { useState } from 'react'
import { MovieGrid } from '../components/MovieGrid/MovieGrid'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'
import { usePaginatedFetch } from '../hooks/usePaginatedFetch'
import { getTrendingAll, getTrendingMovies, getTrendingTVShows } from '../services/tmdb'

const SCOPES = [
  { key: 'all', label: 'All', fetcher: getTrendingAll },
  { key: 'movie', label: 'Movies', fetcher: getTrendingMovies },
  { key: 'tv', label: 'TV Shows', fetcher: getTrendingTVShows },
]

const WINDOWS = [
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'This Week' },
]

export default function Trending() {
  const [scope, setScope] = useState('all')
  const [timeWindow, setTimeWindow] = useState('day')
  const [trailerTarget, setTrailerTarget] = useState(null)

  const activeScope = SCOPES.find((s) => s.key === scope)
  const fetcher = (page) => activeScope.fetcher(timeWindow, page)

  const { items, status, error, hasMore, isLoadingMore, loadMore, retry } = usePaginatedFetch(
    fetcher,
    `${scope}-${timeWindow}`
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">Trending</h1>

      <div className="mb-8 mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="row-scroll flex gap-2 overflow-x-auto">
          {SCOPES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setScope(s.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                scope === s.key ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-ivory-200 hover:bg-navy-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 gap-1 rounded-full bg-navy-800 p-1">
          {WINDOWS.map((w) => (
            <button
              key={w.key}
              type="button"
              onClick={() => setTimeWindow(w.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                timeWindow === w.key ? 'bg-navy-600 text-ivory-100' : 'text-mist-400 hover:text-ivory-200'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <MovieGrid
        items={items}
        status={status}
        error={error}
        mediaType={scope === 'tv' ? 'tv' : 'movie'}
        onPlayTrailer={setTrailerTarget}
        onRetry={retry}
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        emptyMessage="Nothing trending right now."
      />

      <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
    </div>
  )
}
