import { useState, useEffect } from 'react'

// Delays updating the returned value until `value` stops changing for `delay` ms.
// Used so search doesn't fire a request on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
