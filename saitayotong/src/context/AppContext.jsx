import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const AppContext = createContext(undefined)
const STORAGE_KEY = 'saitayotong:favorites'

// Favorite items are stored as:
// { id, mediaType: 'movie' | 'tv', title, posterPath, date, rating }
export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Storage unavailable (private browsing, quota exceeded). Favorites
      // still work for this session, they just won't persist on refresh.
    }
  }, [favorites])

  const isFavorite = useCallback(
    (id, mediaType = 'movie') => favorites.some((f) => f.id === id && f.mediaType === mediaType),
    [favorites]
  )

  const toggleFavorite = useCallback((item) => {
    setFavorites((current) => {
      const exists = current.some((f) => f.id === item.id && f.mediaType === item.mediaType)
      if (exists) {
        return current.filter((f) => !(f.id === item.id && f.mediaType === item.mediaType))
      }
      return [item, ...current]
    })
  }, [])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (ctx === undefined) {
    throw new Error('useApp must be used inside an AppProvider')
  }
  return ctx
}
