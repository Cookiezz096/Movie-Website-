import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <Compass className="h-10 w-10 text-gold-400" strokeWidth={1.5} />
      <h1 className="mt-4 font-display text-3xl text-ivory-50 sm:text-4xl">Scene not found</h1>
      <p className="mt-3 text-sm text-mist-400">
        This page does not exist, or the title you were looking for was removed from TMDB's catalog.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-transform hover:scale-[1.03]"
      >
        Back to Home
      </Link>
    </div>
  )
}
