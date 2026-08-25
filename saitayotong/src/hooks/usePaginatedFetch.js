import { useState, useEffect } from 'react'

// Fetches page 1 whenever `key` changes, and exposes loadMore() to append
// page N+1. `fetcher` must be a (page) => Promise<{results, total_pages}> function.
export function usePaginatedFetch(fetcher, key) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [reloadTick, setReloadTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)
    setItems([])
    setPage(1)

    fetcher(1)
      .then((data) => {
        if (cancelled) return
        setItems(data.results || [])
        setTotalPages(data.total_pages || 1)
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
    // fetcher is a fresh closure each render by design; `key` (+ retry tick)
    // is what should actually re-trigger the fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reloadTick])

  function loadMore() {
    if (isLoadingMore || page >= totalPages) return
    setIsLoadingMore(true)
    const nextPage = page + 1
    fetcher(nextPage)
      .then((data) => {
        setItems((current) => [...current, ...(data.results || [])])
        setPage(nextPage)
      })
      .catch(() => {
        /* silently keep current results; the Load more button just stays available to retry */
      })
      .finally(() => setIsLoadingMore(false))
  }

  return {
    items,
    status,
    error,
    hasMore: page < totalPages,
    isLoadingMore,
    loadMore,
    retry: () => setReloadTick((t) => t + 1),
  }
}
