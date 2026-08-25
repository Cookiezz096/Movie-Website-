const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export class TMDBError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name = 'TMDBError'
    this.code = code // 'missing_key' | 'invalid_key' | 'rate_limited' | 'network' | 'not_found' | 'unknown'
    this.status = status
  }
}

export const isConfigured = () => Boolean(API_KEY && API_KEY !== 'YOUR_API_KEY')

async function tmdbFetch(path, params = {}) {
  if (!isConfigured()) {
    throw new TMDBError('TMDB API key is not set.', 'missing_key')
  }

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  let response
  try {
    response = await fetch(url.toString())
  } catch {
    throw new TMDBError('Could not reach TMDB.', 'network')
  }

  if (response.status === 401) {
    throw new TMDBError('TMDB rejected the API key.', 'invalid_key', 401)
  }
  if (response.status === 404) {
    throw new TMDBError('Not found.', 'not_found', 404)
  }
  if (response.status === 429) {
    throw new TMDBError('Too many requests to TMDB. Slow down and retry.', 'rate_limited', 429)
  }
  if (!response.ok) {
    throw new TMDBError(`TMDB request failed (${response.status}).`, 'unknown', response.status)
  }

  return response.json()
}

/* ---------- Movies ---------- */
export const getTrendingMovies = (timeWindow = 'week', page = 1) =>
  tmdbFetch(`/trending/movie/${timeWindow}`, { page })

export const getPopularMovies = (page = 1) => tmdbFetch('/movie/popular', { page })
export const getNowPlayingMovies = (page = 1) => tmdbFetch('/movie/now_playing', { page })
export const getUpcomingMovies = (page = 1) => tmdbFetch('/movie/upcoming', { page })
export const getTopRatedMovies = (page = 1) => tmdbFetch('/movie/top_rated', { page })

export const getMoviesByGenre = (genreId, page = 1) =>
  tmdbFetch('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' })

export const getMovieDetails = (id) => tmdbFetch(`/movie/${id}`)
export const getMovieCredits = (id) => tmdbFetch(`/movie/${id}/credits`)
export const getMovieVideos = (id) => tmdbFetch(`/movie/${id}/videos`)
export const getSimilarMovies = (id, page = 1) => tmdbFetch(`/movie/${id}/similar`, { page })
export const getMovieRecommendations = (id, page = 1) =>
  tmdbFetch(`/movie/${id}/recommendations`, { page })

/* ---------- TV ---------- */
export const getPopularTVShows = (page = 1) => tmdbFetch('/tv/popular', { page })
export const getTopRatedTVShows = (page = 1) => tmdbFetch('/tv/top_rated', { page })
export const getTVDetails = (id) => tmdbFetch(`/tv/${id}`)
export const getTVCredits = (id) => tmdbFetch(`/tv/${id}/credits`)
export const getTVVideos = (id) => tmdbFetch(`/tv/${id}/videos`)
export const getSimilarTVShows = (id, page = 1) => tmdbFetch(`/tv/${id}/similar`, { page })

/* ---------- Search ---------- */
export const searchMovies = (query, page = 1) => tmdbFetch('/search/movie', { query, page })
export const searchMulti = (query, page = 1) =>
  tmdbFetch('/search/multi', { query, page, include_adult: false })

/* ---------- Genres ---------- */
export const getMovieGenres = () => tmdbFetch('/genre/movie/list')
export const getTVGenres = () => tmdbFetch('/genre/tv/list')

/* ---------- Trending ---------- */
export const getTrendingAll = (timeWindow = 'day', page = 1) =>
  tmdbFetch(`/trending/all/${timeWindow}`, { page })

export const getTrendingTVShows = (timeWindow = 'day', page = 1) =>
  tmdbFetch(`/trending/tv/${timeWindow}`, { page })
