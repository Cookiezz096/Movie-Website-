import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Plus, Check, Star, Clock, Calendar } from 'lucide-react'
import {
  getMovieDetails,
  getMovieCredits,
  getMovieRecommendations,
  getTVDetails,
  getTVCredits,
  getSimilarTVShows,
} from '../services/tmdb'
import { backdropUrl, posterUrl, profileUrl, formatRuntime, formatRating, releaseYear } from '../utils/helpers'
import { useApp } from '../context/AppContext'
import { DetailsSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton'
import { ErrorState, errorToCode } from '../components/ErrorState/ErrorState'
import { MovieRow } from '../components/MovieRow/MovieRow'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'

export default function MovieDetails({ mediaType = 'movie' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useApp()
  const [state, setState] = useState({ status: 'loading', details: null, credits: null, error: null })
  const [related, setRelated] = useState({ status: 'loading', items: [] })
  const [trailerTarget, setTrailerTarget] = useState(null)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', details: null, credits: null, error: null })
    setRelated({ status: 'loading', items: [] })
    window.scrollTo({ top: 0 })

    const detailsFetch = mediaType === 'tv' ? getTVDetails(id) : getMovieDetails(id)
    const creditsFetch = mediaType === 'tv' ? getTVCredits(id) : getMovieCredits(id)

    Promise.all([detailsFetch, creditsFetch])
      .then(([details, credits]) => {
        if (cancelled) return
        setState({ status: 'success', details, credits, error: null })
      })
      .catch((error) => {
        if (cancelled) return
        setState({ status: 'error', details: null, credits: null, error })
      })

    const relatedFetch = mediaType === 'tv' ? getSimilarTVShows(id) : getMovieRecommendations(id)
    relatedFetch
      .then((data) => {
        if (cancelled) return
        setRelated({ status: 'success', items: data.results || [] })
      })
      .catch(() => {
        if (cancelled) return
        setRelated({ status: 'error', items: [] })
      })

    return () => {
      cancelled = true
    }
  }, [id, mediaType])

  if (state.status === 'loading') return <DetailsSkeleton />
  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <ErrorState code={errorToCode(state.error)} onRetry={() => navigate(0)} />
      </div>
    )
  }

  const { details, credits } = state
  const title = mediaType === 'tv' ? details.name : details.title
  const date = mediaType === 'tv' ? details.first_air_date : details.release_date
  const runtime =
    mediaType === 'tv'
      ? details.episode_run_time?.[0]
        ? formatRuntime(details.episode_run_time[0])
        : null
      : formatRuntime(details.runtime)
  const director =
    mediaType === 'movie' ? credits?.crew?.find((c) => c.job === 'Director') : details.created_by?.[0]

  const favored = isFavorite(details.id, mediaType)
  const bg = backdropUrl(details.backdrop_path)
  const poster = posterUrl(details.poster_path, 'w500')

  function handleFavorite() {
    toggleFavorite({
      id: details.id,
      mediaType,
      title,
      posterPath: details.poster_path,
      date,
      rating: details.vote_average,
    })
  }

  return (
    <div>
      <div className="relative h-[38vh] w-full sm:h-[46vh]">
        {bg && <img src={bg} alt="" className="h-full w-full object-cover object-top" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-navy-900/10" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-20 z-10 inline-flex items-center gap-2 rounded-full bg-navy-950/70 px-4 py-2 text-sm font-medium text-ivory-100 backdrop-blur transition-colors hover:bg-navy-950 sm:left-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 sm:flex-row"
        >
          {poster && (
            <img
              src={poster}
              alt=""
              className="hidden h-72 w-48 shrink-0 rounded-xl object-cover shadow-card sm:block"
            />
          )}
          <div className="flex-1 pt-2 sm:pt-4">
            <h1 className="font-display text-2xl font-bold text-ivory-50 sm:text-4xl">{title}</h1>
            {details.tagline && <p className="mt-1 italic text-mist-400">{details.tagline}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-mist-400">
              {details.vote_average > 0 && (
                <span className="flex items-center gap-1 font-medium text-gold-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {formatRating(details.vote_average)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {releaseYear(date)}
              </span>
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {runtime}
                </span>
              )}
            </div>

            {details.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {details.genres.map((g) => (
                  <span key={g.id} className="rounded-full border border-navy-600 px-3 py-1 text-xs text-ivory-200">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ivory-200/90">
              {details.overview || 'No synopsis available.'}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-mist-400">
              {director && (
                <p>
                  <span className="text-ivory-200">{mediaType === 'tv' ? 'Creator' : 'Director'}:</span>{' '}
                  {director.name}
                </p>
              )}
              {details.production_companies?.length > 0 && (
                <p>
                  <span className="text-ivory-200">Studio:</span>{' '}
                  {details.production_companies.slice(0, 2).map((c) => c.name).join(', ')}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setTrailerTarget({ id: details.id, mediaType, title })}
                className="inline-flex items-center gap-2 rounded-full bg-ivory-100 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-transform hover:scale-[1.03] active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Trailer
              </button>
              <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={favored}
                aria-label={favored ? 'Remove from My List' : 'Add to My List'}
                className="inline-flex items-center gap-2 rounded-full border border-ivory-100/30 px-5 py-2.5 text-sm font-semibold text-ivory-100 transition-colors hover:bg-ivory-100/10"
              >
                {favored ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                My List
              </button>
            </div>

            {credits?.cast?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-eyebrow mb-3">Cast</h2>
                <div className="row-scroll flex gap-4 overflow-x-auto pb-2">
                  {credits.cast.slice(0, 12).map((person) => {
                    const photo = profileUrl(person.profile_path)
                    return (
                      <div key={person.id} className="w-20 shrink-0 text-center sm:w-24">
                        <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-navy-800 sm:h-24 sm:w-24">
                          {photo && <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />}
                        </div>
                        <p className="mt-2 truncate text-xs font-medium text-ivory-100">{person.name}</p>
                        <p className="truncate text-xs text-mist-500">{person.character}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl pb-16">
        <MovieRow
          title={mediaType === 'tv' ? 'More Like This' : 'Similar Titles'}
          items={related.items}
          status={related.status}
          mediaType={mediaType}
          onPlayTrailer={setTrailerTarget}
        />
      </div>

      <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
    </div>
  )
}
