import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MovieGrid } from '../components/MovieGrid/MovieGrid'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'
import { usePaginatedFetch } from '../hooks/usePaginatedFetch'
import { getPopularMovies, getNowPlayingMovies, getUpcomingMovies, getTopRatedMovies } from '../services/tmdb'

const TABS = [
  { key: 'popular', label: 'Popular', fetcher: getPopularMovies },
  { key: 'now_playing', label: 'Now Playing', fetcher: getNowPlayingMovies },
  { key: 'upcoming', label: 'Upcoming', fetcher: getUpcomingMovies },
  { key: 'top_rated', label: 'Top Rated', fetcher: getTopRatedMovies },
]

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeKey = TABS.some((t) => t.key === requestedTab) ? requestedTab : 'popular'
  const activeTab = TABS.find((t) => t.key === activeKey)
  const [trailerTarget, setTrailerTarget] = useState(null)

  const { items, status, error, hasMore, isLoadingMore, loadMore, retry } = usePaginatedFetch(
    activeTab.fetcher,
    activeKey
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">Movies</h1>

      <div className="row-scroll mb-8 mt-5 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSearchParams({ tab: tab.key })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeKey === tab.key ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-ivory-200 hover:bg-navy-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <MovieGrid
        items={items}
        status={status}
        error={error}
        mediaType="movie"
        onPlayTrailer={setTrailerTarget}
        onRetry={retry}
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        emptyMessage="No movies found in this category right now."
      />

      <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
    </div>
  )
}
