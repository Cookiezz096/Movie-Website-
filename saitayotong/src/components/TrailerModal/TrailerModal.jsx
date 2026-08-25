import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { getMovieVideos, getTVVideos } from '../../services/tmdb'
import { findTrailer } from '../../utils/helpers'

// target: { id, mediaType, title } | null
export function TrailerModal({ target, onClose }) {
  const [status, setStatus] = useState('loading')
  const [videoKey, setVideoKey] = useState(null)
  const closeButtonRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!target) return
    let cancelled = false
    setStatus('loading')
    setVideoKey(null)

    const fetchVideos = target.mediaType === 'tv' ? getTVVideos : getMovieVideos
    fetchVideos(target.id)
      .then((data) => {
        if (cancelled) return
        const trailer = findTrailer(data)
        if (trailer) {
          setVideoKey(trailer.key)
          setStatus('success')
        } else {
          setStatus('empty')
        }
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [target])

  useEffect(() => {
    if (!target) return
    closeButtonRef.current?.focus()

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [target, onClose])

  return createPortal(
    <AnimatePresence>
      {target && (
        <motion.div
          key="trailer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${target.title} trailer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
          onClick={onClose}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-navy-900 shadow-gold-glow"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close trailer"
              className="absolute right-3 top-3 z-10 rounded-full bg-navy-950/80 p-2 text-ivory-100 transition-colors hover:bg-navy-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full bg-navy-950">
              {status === 'loading' && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
                </div>
              )}
              {status === 'success' && videoKey && (
                <iframe
                  key={videoKey}
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                  title={`${target.title} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
              {(status === 'empty' || status === 'error') && (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="font-display text-ivory-100">No trailer available</p>
                  <p className="text-sm text-mist-400">
                    TMDB does not have a YouTube trailer on file for this title yet.
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 py-4">
              <p className="font-display text-lg text-ivory-100">{target.title}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
