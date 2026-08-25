export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="font-display text-2xl text-ivory-50 sm:text-3xl">Privacy</h1>
      <p className="mt-2 text-sm text-mist-500">Last updated {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ivory-200/90">
        <section>
          <h2 className="font-display text-lg text-ivory-50">No accounts, no server</h2>
          <p className="mt-2">
            SaitayoTong has no login, no backend, and no analytics. It runs entirely in your
            browser and talks directly to TMDB's public API for movie and TV data.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ivory-50">My List</h2>
          <p className="mt-2">
            Titles you add to My List are saved with your browser's localStorage, on your
            device only. Clearing your browser data, or opening the site in a different
            browser or device, will not carry your list over.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ivory-50">Third-party data</h2>
          <p className="mt-2">
            Posters, backdrops, cast photos, and trailer links are fetched from TMDB and
            embedded from YouTube. Those services may apply their own privacy practices to
            those requests.
          </p>
        </section>
      </div>
    </div>
  )
}
