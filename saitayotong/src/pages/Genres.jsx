import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { GenreCard } from '../components/GenreCard/GenreCard'
import { MovieGrid } from '../components/MovieGrid/MovieGrid'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'
import { GridSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton'
import { ErrorState, errorToCode } from '../components/ErrorState/ErrorState'
import { usePaginatedFetch } from '../hooks/usePaginatedFetch'
import { getMovieGenres, getMoviesByGenre } from '../services/tmdb'

export default function Genres() {
  const [searchParams, setSearchParams] = useSearchParams()
  const genreId = searchParams.get('id')
  const genreName = searchParams.get('name')
  const [trailerTarget, setTrailerTarget] = useState(null)
  const [genresState, setGenresState] = useState({ status: 'loading', list: [], error: null })

  useEffect(() => {
    let cancelled = false
    getMovieGenres()
      .then((data) => {
        if (cancelled) return
        setGenresState({ status: 'success', list: data.genres || [], error: null })
      })
      .catch((error) => {
        if (cancelled) return
        setGenresState({ status: 'error', list: [], error })
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Guarded so the picker view (no genreId yet) never fires a bogus request.
  const fetcher = (page) =>
    genreId ? getMoviesByGenre(genreId, page) : Promise.resolve({ results: [], total_pages: 1 })
  const grid = usePaginatedFetch(fetcher, genreId)

  if (genreId) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <button
          type="button"
          onClick={() => setSearchParams({})}
          className="mb-4 inline-flex items-center gap-2 text-sm text-mist-400 transition-colors hover:text-gold-400"
        >
          <ArrowLeft className="h-4 w-4" />
          All genres
        </button>
        <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">{genreName || 'Genre'}</h1>

        <div className="mt-8">
          <MovieGrid
            items={grid.items}
            status={grid.status}
            error={grid.error}
            mediaType="movie"
            onPlayTrailer={setTrailerTarget}
            onRetry={grid.retry}
            onLoadMore={grid.loadMore}
            isLoadingMore={grid.isLoadingMore}
            hasMore={grid.hasMore}
            emptyMessage="No movies found in this genre."
          />
        </div>

        <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">Genres</h1>
      <p className="mt-2 text-sm text-mist-400">Pick a genre to browse.</p>

      {genresState.status === 'loading' && (
        <div className="mt-8">
          <GridSkeleton count={16} />
        </div>
      )}
      {genresState.status === 'error' && (
        <div className="mt-8">
          <ErrorState code={errorToCode(genresState.error)} />
        </div>
      )}
      {genresState.status === 'success' && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {genresState.list.map((genre, i) => (
            <GenreCard key={genre.id} genre={genre} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
