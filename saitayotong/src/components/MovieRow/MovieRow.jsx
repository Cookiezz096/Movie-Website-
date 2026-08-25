import { useRef, useState, useEffect, useId } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieCard } from '../MovieCard/MovieCard'
import { MovieRowSkeleton } from '../LoadingSkeleton/LoadingSkeleton'
import { ErrorState, errorToCode } from '../ErrorState/ErrorState'

export function MovieRow({ title, items, status = 'success', error, mediaType = 'movie', onPlayTrailer, onRetry }) {
  const scrollerRef = useRef(null)
  const headingId = useId()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateArrows() {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    updateArrows()
  }, [items])

  function scrollBy(direction) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: el.clientWidth * 0.85 * direction, behavior: 'smooth' })
  }

  if (status === 'loading') return <MovieRowSkeleton />
  if (status === 'error') return <ErrorState code={errorToCode(error)} onRetry={onRetry} />
  if (!items || items.length === 0) return null

  return (
    <section aria-labelledby={headingId} className="relative">
      <h2 id={headingId} className="text-eyebrow mb-3 px-4 sm:px-6 lg:px-8">
        {title}
      </h2>

      <div className="group/row relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${title} left`}
          tabIndex={canScrollLeft ? 0 : -1}
          className={`absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-navy-950/90 p-2 text-ivory-100 shadow-card transition-opacity duration-200 lg:flex ${
            canScrollLeft ? 'opacity-0 group-hover/row:opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="row-scroll flex gap-3 overflow-x-auto scroll-smooth px-4 pb-1 sm:px-6 lg:px-8"
        >
          {items.map((item) => (
            <MovieCard
              key={`${item.media_type || mediaType}-${item.id}`}
              item={item}
              mediaType={mediaType}
              onPlayTrailer={onPlayTrailer}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${title} right`}
          tabIndex={canScrollRight ? 0 : -1}
          className={`absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-navy-950/90 p-2 text-ivory-100 shadow-card transition-opacity duration-200 lg:flex ${
            canScrollRight ? 'opacity-0 group-hover/row:opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
