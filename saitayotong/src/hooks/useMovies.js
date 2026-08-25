import { useState, useEffect, useCallback } from 'react'

// Wraps any TMDB service call with loading / success / error state.
// `deps` re-triggers the fetch, same contract as useEffect's dependency array.
export function useMovies(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    fetcher()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // fetcher is intentionally excluded: callers pass a fresh function each
    // render, and deps describes what should actually trigger a re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  return { data, status, error, isLoading: status === 'loading', reload: load }
}
