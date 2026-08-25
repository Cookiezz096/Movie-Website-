import { useState, useEffect } from 'react'
import { Hero } from '../components/Hero/Hero'
import { MovieRow } from '../components/MovieRow/MovieRow'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'
import { useMovies } from '../hooks/useMovies'
import {
  getTrendingMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getPopularTVShows,
  getMoviesByGenre,
} from '../services/tmdb'

// Stable, long-standing TMDB genre ids.
const GENRE_ACTION = 28
const GENRE_COMEDY = 35

export default function Home() {
  const [trailerTarget, setTrailerTarget] = useState(null)

  const trending = useMovies(() => getTrendingMovies('day'), [])
  const popular = useMovies(() => getPopularMovies(), [])
  const nowPlaying = useMovies(() => getNowPlayingMovies(), [])
  const upcoming = useMovies(() => getUpcomingMovies(), [])
  const topRated = useMovies(() => getTopRatedMovies(), [])
  const popularTV = useMovies(() => getPopularTVShows(), [])
  const action = useMovies(() => getMoviesByGenre(GENRE_ACTION), [])
  const comedy = useMovies(() => getMoviesByGenre(GENRE_COMEDY), [])

  const [heroId, setHeroId] = useState(null)

  // Pick once when trending data lands, not on every re-render (e.g. when
  // the trailer modal opens/closes and Home re-renders). Doing the random
  // pick in an effect (rather than useMemo) also keeps render itself pure.
  useEffect(() => {
    const results = trending.data?.results
    if (!results || results.length === 0) return
    setHeroId(results[Math.floor(Math.random() * Math.min(results.length, 5))].id)
  }, [trending.data])

  const rows = [
    { title: 'Trending Today', state: trending, mediaType: 'movie' },
    { title: 'Popular Movies', state: popular, mediaType: 'movie' },
    { title: 'Now Playing', state: nowPlaying, mediaType: 'movie' },
    { title: 'Upcoming', state: upcoming, mediaType: 'movie' },
    { title: 'Top Rated', state: topRated, mediaType: 'movie' },
    { title: 'Popular TV Shows', state: popularTV, mediaType: 'tv' },
    { title: 'Action', state: action, mediaType: 'movie' },
    { title: 'Comedy', state: comedy, mediaType: 'movie' },
  ]

  return (
    <>
      <Hero candidateId={heroId} onPlayTrailer={setTrailerTarget} />

      <div className="mx-auto max-w-7xl space-y-10 py-10 sm:space-y-14 sm:py-14">
        {rows.map((row) => (
          <MovieRow
            key={row.title}
            title={row.title}
            items={row.state.data?.results}
            status={row.state.status}
            error={row.state.error}
            mediaType={row.mediaType}
            onPlayTrailer={setTrailerTarget}
            onRetry={row.state.reload}
          />
        ))}
      </div>

      <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
    </>
  )
}
