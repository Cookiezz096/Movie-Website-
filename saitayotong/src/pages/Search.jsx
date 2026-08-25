import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar/SearchBar'
import { MovieGrid } from '../components/MovieGrid/MovieGrid'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'
import { useDebounce } from '../hooks/useDebounce'
import { usePaginatedFetch } from '../hooks/usePaginatedFetch'
import { searchMulti } from '../services/tmdb'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(query, 400)
  const [trailerTarget, setTrailerTarget] = useState(null)

  // One-way sync, state -> URL, so a shared/refreshed link reflects the
  // debounced search rather than firing on every keystroke.
  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const trimmedQuery = debouncedQuery.trim()
  const fetcher = (page) =>
    trimmedQuery ? searchMulti(trimmedQuery, page) : Promise.resolve({ results: [], total_pages: 1 })
  const { items, status, error, hasMore, isLoadingMore, loadMore, retry } = usePaginatedFetch(fetcher, trimmedQuery)

  // search/multi can surface "person" results; this app only displays titles.
  const filteredItems = items.filter((item) => item.media_type === 'movie' || item.media_type === 'tv')

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="mb-6 font-display text-2xl text-ivory-50 sm:text-3xl">Search</h1>

      <div className="mx-auto max-w-xl">
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} autoFocus />
      </div>

      <div className="mt-10">
        {trimmedQuery ? (
          <MovieGrid
            items={filteredItems}
            status={status}
            error={error}
            onPlayTrailer={setTrailerTarget}
            onRetry={retry}
            onLoadMore={loadMore}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            emptyMessage={`No matches for "${trimmedQuery}".`}
          />
        ) : (
          <p className="mt-16 text-center text-sm text-mist-500">Start typing to search movies and TV shows.</p>
        )}
      </div>

      <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
    </div>
  )
}
