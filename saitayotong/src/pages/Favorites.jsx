import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { MovieGrid } from '../components/MovieGrid/MovieGrid'
import { TrailerModal } from '../components/TrailerModal/TrailerModal'

export default function Favorites() {
  const { favorites } = useApp()
  const [trailerTarget, setTrailerTarget] = useState(null)

  // Favorites are stored in the normalized shape (posterPath, date, rating,
  // mediaType). MovieCard expects raw-ish TMDB field names, so translate back.
  const items = favorites.map((f) => ({
    id: f.id,
    media_type: f.mediaType,
    title: f.mediaType === 'tv' ? undefined : f.title,
    name: f.mediaType === 'tv' ? f.title : undefined,
    poster_path: f.posterPath,
    release_date: f.mediaType === 'tv' ? undefined : f.date,
    first_air_date: f.mediaType === 'tv' ? f.date : undefined,
    vote_average: f.rating,
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">My List</h1>
      <p className="mt-2 text-sm text-mist-400">
        {favorites.length > 0
          ? `${favorites.length} saved title${favorites.length === 1 ? '' : 's'}`
          : 'Nothing saved yet'}
      </p>

      <div className="mt-8">
        <MovieGrid
          items={items}
          status="success"
          onPlayTrailer={setTrailerTarget}
          emptyMessage="Add titles to My List from any movie or show to see them here."
        />
      </div>

      <TrailerModal target={trailerTarget} onClose={() => setTrailerTarget(null)} />
    </div>
  )
}
