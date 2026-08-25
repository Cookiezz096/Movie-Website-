import { Link } from 'react-router-dom'

const GRADIENTS = [
  'from-crimson-600 to-navy-900',
  'from-gold-600 to-navy-900',
  'from-navy-600 to-navy-950',
  'from-crimson-700 to-navy-900',
]

export function GenreCard({ genre, index = 0 }) {
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <Link
      to={`/genres?id=${genre.id}&name=${encodeURIComponent(genre.name)}`}
      className={`group relative flex h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradient} px-4 text-center shadow-card transition-transform duration-200 hover:-translate-y-0.5 sm:h-28`}
    >
      <span className="font-display text-base font-semibold text-ivory-50 sm:text-lg">{genre.name}</span>
    </Link>
  )
}
