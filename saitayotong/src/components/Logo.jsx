// Signature mark: a Khmer-temple spire silhouette (tiered, tapering roofline)
// with a film-strip ribbon draped down the front, perforations and all.
// One shape, two materials — the whole brand idea in a single glyph.
export function LogoMark({ className = 'h-8 w-8' }) {
  const perforationRows = [22, 28, 34, 40, 46, 52]

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="12" y="52" width="40" height="4" rx="1" fill="var(--color-gold-500)" />
      <polygon points="14,52 50,52 44,40 20,40" fill="var(--color-gold-500)" />
      <polygon points="20,40 44,40 37,26 27,26" fill="var(--color-gold-400)" />
      <polygon points="27,26 37,26 33,14 31,14" fill="var(--color-gold-300)" />
      <polygon points="31,14 33,14 32,6" fill="var(--color-gold-300)" />
      <circle cx="32" cy="5" r="1.6" fill="var(--color-gold-300)" />

      <rect x="28.5" y="20" width="7" height="34" fill="var(--color-crimson-600)" />
      {perforationRows.map((y) => (
        <g key={y}>
          <rect x="29.4" y={y} width="1.6" height="1.6" rx="0.3" fill="var(--color-gold-300)" opacity="0.85" />
          <rect x="33" y={y} width="1.6" height="1.6" rx="0.3" fill="var(--color-gold-300)" opacity="0.85" />
        </g>
      ))}
    </svg>
  )
}

export function Brand({ markClassName = 'h-9 w-9', wordmarkClassName = 'text-xl', showWordmark = true }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={markClassName} />
      {showWordmark && (
        <span className={`font-display tracking-wide text-ivory-100 ${wordmarkClassName}`}>
          Saitayo<span className="text-gold-400">Tong</span>
        </span>
      )}
    </span>
  )
}
