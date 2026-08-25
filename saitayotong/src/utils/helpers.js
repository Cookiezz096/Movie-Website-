const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(path, size = 'w500') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path, size = 'original') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function profileUrl(path, size = 'w185') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function formatRuntime(minutes) {
  if (minutes === undefined || minutes === null || minutes === 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function releaseYear(dateString) {
  if (!dateString) return '—'
  return dateString.slice(0, 4)
}

export function formatRating(voteAverage) {
  if (voteAverage === undefined || voteAverage === null || voteAverage === 0) return '—'
  return voteAverage.toFixed(1)
}

export function truncate(text, max = 220) {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max).trim() + '…'
}

// Normalizes a movie or tv result into the shape MovieCard/MovieRow expect,
// since /trending/all and /search/multi mix media_type into the payload.
export function normalizeMedia(item, fallbackMediaType) {
  const mediaType = item.media_type || fallbackMediaType || (item.first_air_date ? 'tv' : 'movie')
  return {
    id: item.id,
    mediaType,
    title: mediaType === 'tv' ? item.name : item.title,
    date: mediaType === 'tv' ? item.first_air_date : item.release_date,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    overview: item.overview,
    rating: item.vote_average,
    genreIds: item.genre_ids || [],
  }
}

export function findTrailer(videosResponse) {
  const results = videosResponse?.results || []
  return (
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    results.find((v) => v.site === 'YouTube') ||
    null
  )
}
