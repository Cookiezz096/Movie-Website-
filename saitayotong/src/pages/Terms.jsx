export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">Terms</h1>
      <p className="mt-2 text-sm text-mist-500">Last updated {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ivory-200/90">
        <section>
          <h2 className="font-display text-lg text-ivory-50">What this is</h2>
          <p className="mt-2">
            SaitayoTong is an independent, non-commercial discovery project for movies and TV
            shows. It is not affiliated with, endorsed by, or a substitute for any streaming
            service, and it does not host, sell, or distribute video content.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ivory-50">Data source</h2>
          <p className="mt-2">
            Catalog data is provided by TMDB and is only as accurate and current as their
            database. Trailers link out to YouTube and are subject to YouTube's own
            availability and terms.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ivory-50">As-is</h2>
          <p className="mt-2">This project is provided as-is, without warranty, as a personal and portfolio build.</p>
        </section>
      </div>
    </div>
  )
}
