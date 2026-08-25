import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, Info, Plus, Check, Star } from 'lucide-react'
import { getMovieDetails } from '../../services/tmdb'
import { backdropUrl, formatRating, formatRuntime, releaseYear, truncate } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'
import { HeroSkeleton } from '../LoadingSkeleton/LoadingSkeleton'

// Trending/popular list endpoints only return genre_ids and no runtime,
// so once a candidate is picked, Hero fetches the full /movie/{id} record.
export function Hero({ candidateId, onPlayTrailer }) {
  const [details, setDetails] = useState(null)
  const [status, setStatus] = useState('loading')
  const { isFavorite, toggleFavorite } = useApp()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!candidateId) return
    let cancelled = false
    setStatus('loading')
    getMovieDetails(candidateId)
      .then((data) => {
        if (cancelled) return
        setDetails(data)
        setStatus('success')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [candidateId])

  if (status === 'loading' || !details) return <HeroSkeleton />
  if (status === 'error') return null

  const favored = isFavorite(details.id, 'movie')
  const bg = backdropUrl(details.backdrop_path)

  function handleFavorite() {
    toggleFavorite({
      id: details.id,
      mediaType: 'movie',
      title: details.title,
      posterPath: details.poster_path,
      date: details.release_date,
      rating: details.vote_average,
    })
  }

  return (
    <section className="relative h-[64vh] min-h-[460px] w-full overflow-hidden sm:h-[82vh]">
      {bg && (
        <div className="absolute inset-0">
          <img src={bg} alt="" className="h-full w-full object-cover object-top" />
        </div>
      )}
      <div className="absolute inset-0 bg-scrim" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-14 sm:px-8 sm:pb-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <span className="text-eyebrow">Featured</span>
            <h1 className="mt-2 text-3xl font-bold text-ivory-50 sm:text-5xl">{details.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-mist-400">
              {details.vote_average > 0 && (
                <span className="flex items-center gap-1 font-medium text-gold-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {formatRating(details.vote_average)}
                </span>
              )}
              <span>{releaseYear(details.release_date)}</span>
              {formatRuntime(details.runtime) && <span>{formatRuntime(details.runtime)}</span>}
              {details.genres?.slice(0, 3).map((g) => (
                <span key={g.id} className="rounded-full border border-navy-600 px-2 py-0.5 text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="mt-4 hidden text-sm leading-relaxed text-ivory-200/90 sm:block">
              {truncate(details.overview, 220)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onPlayTrailer?.({ id: details.id, mediaType: 'movie', title: details.title })}
                className="inline-flex items-center gap-2 rounded-full bg-ivory-100 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-transform hover:scale-[1.03] active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Trailer
              </button>
              <Link
                to={`/movie/${details.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-navy-800/80 px-5 py-2.5 text-sm font-semibold text-ivory-100 backdrop-blur transition-colors hover:bg-navy-700"
              >
                <Info className="h-4 w-4" />
                More Info
              </Link>
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
