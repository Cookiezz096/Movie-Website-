# SaitayoTong

A movie and TV discovery site: browse what's trending and popular, preview trailers,
and build a personal watchlist — all backed by live [TMDB](https://www.themoviedb.org/)
data. Southeast Asian–inspired identity (deep navy, gold, crimson, a film-strip-over-
temple-spire mark), built with React, Vite, and Tailwind CSS.

This is an independent project. It is not affiliated with, endorsed by, or a
replacement for any streaming service — there's no video hosting here, only
discovery, trailers (via YouTube), and a watchlist.

## Features

- **Live TMDB data** — trending, popular, now playing, upcoming, and top-rated
  movies; popular and top-rated TV; genre browsing; multi search (movies + TV).
  Nothing is hard-coded — the catalog updates whenever TMDB's does.
- **Movie & TV details** — cast, crew/creator, genres, runtime, production
  companies, trailer, and a "similar titles" row, at `/movie/:id` and `/tv/:id`.
- **My List** — add/remove favorites from any card or details page, persisted to
  `localStorage`, no account required.
- **Search** — debounced, synced to the URL (`/search?q=...`) so results are
  shareable and survive a refresh.
- **Responsive, accessible UI** — horizontal touch/mouse-scrollable rows, a
  keyboard-navigable trailer modal (Escape to close, focus returns to the
  trigger), visible focus states, `prefers-reduced-motion` support.
- **Loading and error states everywhere** — skeleton loaders instead of spinners,
  and friendly messages for a missing/invalid API key, network failures, rate
  limiting, and empty results.

## Tech stack

React 19 · Vite · React Router · Tailwind CSS v4 · Framer Motion · Lucide icons ·
the native Fetch API (no Axios — nothing here needed it) · TMDB API v3.

## Getting started

```bash
npm install
cp .env.example .env   # then add your TMDB key, see below
npm run dev
```

Open the URL Vite prints (defaults to `http://localhost:5173`).

### Get a TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** and request a key (choose "Developer").
3. Copy the **API Key (v3 auth)** value.
4. Put it in `.env` at the project root:

   ```env
   VITE_TMDB_API_KEY=your_key_here
   ```
5. Restart `npm run dev` (Vite only reads `.env` on startup).

If the key is missing or rejected, the app shows an explanatory in-app message
rather than crashing — you don't need a key just to look at the UI shell.

## Available commands

```bash
npm run dev       # start the dev server with hot reload
npm run build     # production build, output to dist/
npm run preview   # serve the production build locally, to sanity-check it
npm run lint      # oxlint static checks
```

## Deployment

`npm run build` produces a static `dist/` folder — deploy it to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.). Two things to set up on
whichever host you pick:

1. **Environment variable** — set `VITE_TMDB_API_KEY` in the host's dashboard
   (it gets baked into the build at build time, same as locally).
2. **SPA fallback** — this app uses client-side routing, so the host needs to
   serve `index.html` for unknown paths (e.g. a direct load of `/movie/123`)
   instead of 404ing. Vercel/Netlify do this automatically for Vite projects;
   other hosts may need an explicit rewrite rule (e.g. `_redirects` on Netlify:
   `/* /index.html 200`).

## API key security (read this before deploying)

`VITE_*` environment variables are inlined into the JavaScript bundle at build
time — that's how Vite exposes them to browser code. **This means the TMDB key
is visible to anyone who opens dev tools on the deployed site.** That's fine for
TMDB specifically: their v3 key is meant for exactly this kind of client-side
use and isn't a secret you're leaking.

It would **not** be fine for a provider whose key must stay private. If you ever
swap TMDB for an API with stricter key requirements, put that call behind a small
backend or serverless function (Vercel/Netlify functions, Cloudflare Workers,
etc.) instead of calling it from the browser. This project's architecture is
intentionally simple (no backend) because TMDB doesn't require one — that
trade-off won't hold for every API.

## Project structure

```text
src/
├── components/     # Navbar, Hero, MovieCard, MovieRow, MovieGrid, SearchBar,
│                   # TrailerModal, GenreCard, LoadingSkeleton, ErrorState, Footer
├── pages/          # one file per route
├── services/tmdb.js    # every TMDB call lives here — nowhere else touches fetch()
├── hooks/          # useDebounce, useMovies, usePaginatedFetch
├── context/        # AppContext — favorites/My List, backed by localStorage
└── utils/helpers.js    # image URL builders, formatters, TMDB response normalizers
```

## Known limitations

- **No automated visual/interaction tests.** The build was verified with
  `npm run build`, `npm run lint`, and serving the production output and
  exercising routes over HTTP — there's no headless-browser or visual
  regression test in this environment, so give it a manual click-through
  before you treat it as done.
- **TV-show detail depth is lighter than movies.** Movies get director +
  full genre/runtime data from TMDB; TV shows use the first-listed creator
  and each show's per-episode runtime, since TMDB doesn't expose an exact
  TV equivalent for a couple of movie-only fields.
- **Genre browsing covers movies only** — the same pattern (a genre picker
  page filtering a grid) would extend to TV genres with a second TMDB genre
  list and endpoint; it just isn't wired up yet.
- **TMDB attribution** includes the required text notice (in the footer and
  on `/about`), but not their logo image — see TMDB's
  [attribution guidelines](https://www.themoviedb.org/about/logos-attribution)
  if you plan to publish this beyond a personal/portfolio context.
- **Search staleness edge case**: if you're already on `/search` and use the
  separate quick-search box in the desktop navbar to search something new,
  the main search page's input doesn't sync to the new term (it only reads
  the URL once, on first load, to avoid fighting your typing while debouncing).
  Clearing the search box and retyping, or navigating to `/search` fresh,
  both work as expected.

## Future improvements

- Backend-proxied API calls, if this ever needs a key that can't be public.
- TV genre browsing, and a dedicated season/episode view for TV details.
- Real accounts (the previous iteration of this project explored OAuth) if
  cross-device sync for My List becomes a goal — intentionally left out of
  this pass in favor of getting real data and every core flow working first.
