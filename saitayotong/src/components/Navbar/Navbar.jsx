import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, Heart } from 'lucide-react'
import { Brand } from '../Logo'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/trending', label: 'Trending' },
  { to: '/genres', label: 'Genres' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  function handleSearchSubmit(e) {
    e.preventDefault()
    const query = new FormData(e.currentTarget).get('q')?.toString().trim()
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const desktopLinkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors ${
      isActive ? 'text-gold-400' : 'text-ivory-200/80 hover:text-gold-300'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
      isActive ? 'bg-navy-800 text-gold-400' : 'text-ivory-200/90'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-navy-700 bg-navy-950/90 shadow-card backdrop-blur-md'
          : 'bg-gradient-to-b from-navy-950/85 to-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" aria-label="SaitayoTong home" className="shrink-0">
          <Brand markClassName="h-8 w-8" wordmarkClassName="hidden text-lg sm:inline" />
        </NavLink>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" />
            <input
              name="q"
              type="search"
              placeholder="Search titles"
              aria-label="Search titles"
              className="w-44 rounded-full border border-navy-600 bg-navy-800/80 py-1.5 pl-9 pr-3 text-sm text-ivory-100 outline-none transition-all placeholder:text-mist-500 focus:w-64 focus:border-gold-500"
            />
          </form>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? 'text-gold-400' : 'text-ivory-200/80 hover:text-gold-300'
              }`
            }
          >
            <Heart className="h-4 w-4" />
            My List
          </NavLink>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <NavLink to="/search" aria-label="Search">
            <Search className="h-5 w-5 text-ivory-100" />
          </NavLink>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-ivory-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-navy-700 bg-navy-950/98 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={mobileLinkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/favorites" className={mobileLinkClass}>
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> My List
              </span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
