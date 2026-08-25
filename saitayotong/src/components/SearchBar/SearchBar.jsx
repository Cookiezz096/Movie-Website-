import { Search as SearchIcon, X } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search movies and TV shows',
  autoFocus = false,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mist-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="w-full rounded-full border border-navy-600 bg-navy-800 py-3.5 pl-12 pr-12 text-base text-ivory-100 outline-none transition-colors placeholder:text-mist-500 focus:border-gold-500"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mist-400 transition-colors hover:bg-navy-700 hover:text-ivory-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
