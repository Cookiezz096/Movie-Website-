import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Brand } from '../Logo'

const EXPLORE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/trending', label: 'Trending' },
  { to: '/genres', label: 'Genres' },
  { to: '/favorites', label: 'My List' },
]

const COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-navy-700 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-2">
            <Brand markClassName="h-9 w-9" wordmarkClassName="text-lg" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist-400">
              An original movie and TV discovery experience. Browse what is trending,
              build a watchlist, and preview trailers before you commit an evening to them.
            </p>
            <a
              href="mailto:contact@saitayotong.app"
              className="mt-4 inline-flex items-center gap-2 text-sm text-mist-400 transition-colors hover:text-gold-400"
            >
              <Mail className="h-4 w-4" />
              contact@saitayotong.app
            </a>
          </div>

          <div>
            <h3 className="text-eyebrow mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-mist-400 transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-4">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-mist-400 transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-navy-700 pt-6 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SaitayoTong. Built as an independent project, not affiliated with any streaming service.</p>
          <p>
            This product uses the TMDB API but is not endorsed or certified by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-mist-400 underline decoration-navy-600 underline-offset-2 hover:text-gold-400"
            >
              TMDB
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
