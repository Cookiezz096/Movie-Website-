import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Star, Plus, Check } from 'lucide-react'
import { posterUrl, releaseYear, formatRating, normalizeMedia } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'

export function MovieCard({ item, mediaType, onPlayTrailer, layout = 'row' }) {
  const media = normalizeMedia(item, mediaType)
  const { isFavorite, toggleFavorite } = useApp()
  const [imgError, setImgError] = useState(false)
  const favored = isFavorite(media.id, media.mediaType)
  const poster = !imgError ? posterUrl(media.posterPath, 'w342') : null
  const href = `/${media.mediaType === 'tv' ? 'tv' : 'movie'}/${media.id}`
  const sizing = layout === 'row' ? 'w-[140px] shrink-0 sm:w-[170px]' : 'w-full'

  function handleFavoriteClick(e) {
    e.preventDefault()
    toggleFavorite({
      id: media.id,
      mediaType: media.mediaType,
      title: media.title,
      posterPath: media.posterPath,
      date: media.date,
      rating: media.rating,
    })
  }

  function handleTrailerClick(e) {
    e.preventDefault()
    onPlayTrailer?.(media)
  }

  return (
    <div className={`group/card relative ${sizing}`}>
      <Link to={href} className="block outline-none">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-navy-800 shadow-card transition-transform duration-300 ease-out group-hover/card:-translate-y-1 group-hover/card:shadow-gold-glow group-focus-within/card:-translate-y-1">
          {poster ? (
            <img
              src={poster}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center">
              <span className="font-display text-sm text-mist-500">{media.title}</span>
            </div>
          )}

          {media.rating > 0 && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-navy-950/80 px-2 py-1 text-xs font-medium text-gold-300">
              <Star className="h-3 w-3 fill-current" />
              {formatRating(media.rating)}
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="truncate text-sm font-medium text-ivory-100">{media.title}</p>
          <p className="text-xs text-mist-500">{releaseYear(media.date)}</p>
        </div>
      </Link>

      {/* Sibling overlay, not nested in the link, so buttons stay real <button> elements */}
      <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[2/3] w-full">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 rounded-b-xl bg-gradient-to-t from-navy-950/95 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-within/card:opacity-100">
          {onPlayTrailer ? (
            <button
              type="button"
              onClick={handleTrailerClick}
              aria-label={`Play trailer for ${media.title}`}
              className="pointer-events-auto rounded-full bg-ivory-100 p-2 text-navy-950 transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favored ? `Remove ${media.title} from My List` : `Add ${media.title} to My List`}
            aria-pressed={favored}
            className={`pointer-events-auto rounded-full p-2 transition-colors active:scale-95 ${
              favored ? 'bg-gold-500 text-navy-950' : 'bg-navy-950/70 text-ivory-100 hover:bg-navy-950'
            }`}
          >
            {favored ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
