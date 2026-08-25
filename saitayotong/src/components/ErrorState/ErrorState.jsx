import { KeyRound, WifiOff, Clock, ServerCrash, SearchX, RefreshCw } from 'lucide-react'

const PRESETS = {
  missing_key: {
    icon: KeyRound,
    title: 'TMDB API key missing',
    message:
      'Add VITE_TMDB_API_KEY to a .env file at the project root, then restart the dev server. See the README for the two-minute setup.',
  },
  invalid_key: {
    icon: KeyRound,
    title: 'TMDB rejected that API key',
    message: 'Double check the key in your .env file against your TMDB account, then restart the dev server.',
  },
  network: {
    icon: WifiOff,
    title: 'Connection problem',
    message: 'This device could not reach TMDB. Check your connection and try again.',
  },
  rate_limited: {
    icon: Clock,
    title: 'Too many requests',
    message: 'TMDB is rate limiting this API key for a moment. Wait a few seconds and retry.',
  },
  not_found: {
    icon: SearchX,
    title: 'Nothing here',
    message: "That title does not exist, or has been removed from TMDB's catalog.",
  },
  empty: {
    icon: SearchX,
    title: 'No results',
    message: 'Nothing matched. Try a different title, genre, or spelling.',
  },
  unknown: {
    icon: ServerCrash,
    title: 'Something went wrong',
    message: 'That request failed unexpectedly. Try again in a moment.',
  },
}

export function ErrorState({ code = 'unknown', message, onRetry, className = '' }) {
  const preset = PRESETS[code] || PRESETS.unknown
  const Icon = preset.icon

  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-navy-700 bg-navy-800/50 px-6 py-16 text-center ${className}`}>
      <Icon className="h-9 w-9 text-gold-400" strokeWidth={1.5} />
      <h3 className="font-display text-lg text-ivory-100">{preset.title}</h3>
      <p className="max-w-sm text-sm text-mist-400">{message || preset.message}</p>
      {onRetry && code !== 'missing_key' && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-4 py-2 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-500/10"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  )
}

// Maps a thrown TMDBError (or any error) to the preset code ErrorState expects.
export function errorToCode(error) {
  if (!error) return 'unknown'
  if (error.code && PRESETS[error.code]) return error.code
  return 'unknown'
}
