import { Brand } from '../components/Logo'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <Brand markClassName="h-10 w-10" wordmarkClassName="text-2xl" />
      <h1 className="mt-8 font-display text-2xl text-ivory-50 sm:text-3xl">About SaitayoTong</h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory-200/90">
        <p>
          SaitayoTong is an independent movie and TV discovery project. It is not a streaming
          service: there is no video hosting here, only browsing, trailers, and a personal
          watchlist built against live catalog data.
        </p>
        <p>
          Its identity, the film-strip-over-a-temple-spire mark, the deep navy backdrop, and
          the gold and crimson accents, is Southeast Asian—inspired by the region this project
          was built in.
        </p>
      </div>

      <h2 className="mt-10 font-display text-lg text-ivory-50">Credits</h2>
      <p className="mt-3 text-sm leading-relaxed text-mist-400">
        This product uses the TMDB API but is not endorsed or certified by{' '}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer noopener"
          className="text-gold-400 underline decoration-navy-600 underline-offset-2 hover:text-gold-300"
        >
          TMDB
        </a>
        . All movie and TV metadata, artwork, and trailer links come from their catalog.
      </p>
    </div>
  )
}
