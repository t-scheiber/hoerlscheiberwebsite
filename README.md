# hoerlscheiberwebsite

A one-page photo gallery for the wedding of Louise and Christoph Hörl-Scheiber on 18 July 2025. I built it for my brother's wedding. The page text is in German.

Live site: https://hoerl-scheiber.at

The home page shows a heading that types out congratulation messages in a loop, then a slideshow of 25 wedding photos below it. The photo list is hard-coded in `app/page.tsx` and is shuffled in the browser after the page loads. Server and first client render use the same order, so hydration does not mismatch.

## Slideshow

- Advances every 4 seconds (`autoPlayInterval={4000}`).
- Previous and next buttons wrap around at both ends.
- A pause/play button stops and restarts the timer.
- A row of thumbnails selects a photo and scrolls the active one into view.
- Photos go through `next/image` with AVIF and WebP output. The settings are in `next.config.ts`.

## Stack

- Next.js 16.4 (App Router) and React 19.3
- TypeScript 6.0
- Tailwind CSS 4.3, loaded through `@tailwindcss/postcss`
- `nextjs-simple-typewriter` for the heading
- Geist, Geist Mono, Playfair Display and Inter, served from `app/fonts/` (licences next to the files)
- Bun 1.4.2 as package manager, set in `packageManager`

`GET /api/health` returns `{"status":"ok","message":"App is up and running"}`. `proxy.ts` is a pass-through that does nothing yet.

## Run it

```bash
bun install
bun run dev      # development server with Turbopack, http://localhost:3000
bun run build    # production build with webpack
bun run start    # serve the production build
```

No environment variables are needed.

## Checks

```bash
bun run lint
bun run typecheck
bun run test
```

`bun run test` runs the files in `tests/` with the Node test runner. They cover the carousel behaviour, hydration of the home page and a production server smoke test. That last test needs a finished `bun run build` and uses port 4328.

## Deployment

The live site runs on Hostinger's Node.js hosting. `bun run build` uses webpack (`next build --webpack`), because the Turbopack build fails on Hostinger's builder. The PostCSS helper process exits there before Turbopack connects to it.

Hostinger's builder installs with npm, not Bun, so a deploy goes from a staged copy of the repository:

1. Copy the repository without `node_modules` and `.next`.
2. Remove the ESLint packages from `devDependencies` and the `lint` script. npm rejects ESLint 10 next to the peer range of `eslint-plugin-react`.
3. Create the npm lockfile with `npm install --package-lock-only`.
4. Zip the copy with forward-slash entry names and upload it as a Node.js app.

On any other host that runs Node, `bun run build` followed by `bun run start` serves the site.

## Photos

`public/galleryimages/` holds the 25 family photos shown on the page, committed to this repository.
