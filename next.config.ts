import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * Ship only what the server actually runs.
   *
   * Next traces the modules each route really imports and writes them, plus a
   * `server.js` of its own, to `.next/standalone/`. The production image stops
   * carrying the full dependency tree — 646 MB of it — to serve HTML that was
   * already generated at build time.
   *
   * TWO THINGS THIS MAKES THE DOCKERFILE RESPONSIBLE FOR, and both are silent
   * when forgotten:
   * · `public/` and `.next/static/` are NOT part of the standalone output.
   *   They have to be copied next to `server.js`, or the site serves markup
   *   with no styles and no images while the build stays green.
   * · The entrypoint is `node server.js`, not `next start`. The `next` CLI is
   *   not in the traced output at all.
   */
  output: 'standalone',

  /**
   * The language lives in the URL (§28). The root redirects to the default
   * one. A temporary redirect is used while the site is unpublished; once it
   * is live, this becomes `permanent: true`.
   */
  async redirects() {
    return [{ source: '/', destination: '/es', permanent: false }]
  },

  images: {
    /**
     * WEBP ONLY, NO AVIF (2026-09-11).
     *
     * AVIF was first in this list and Chrome always took it. Measured on the
     * deployed site: `/_next/image` answers of 15 to 123 KB took 2.1 to 3.9 s
     * on a connection that pulled an 11 MB video at 500 KB/s, so the time was
     * not the network — it was the server encoding AVIF on demand from 2560 px
     * masters. AVIF is the slowest encoder by an order of magnitude, and the
     * container has no persistent optimiser cache, so every rollout, restart or
     * replica paid it again.
     *
     * WebP costs 20 to 30 % more bytes per image and encodes in tens of
     * milliseconds. Until there is a CDN holding the variants, that trade wins.
     */
    formats: ['image/webp'],
    /**
     * Next only serves the qualities declared here; any other one errors. 70
     * was added for the hero photograph: it is the LCP element, and at the
     * default quality it weighed 332 KB on Retina screens — over the 250 KB
     * budget §29 sets — with the LCP at 2.44s against a 2.5s limit. Lowering
     * the master did not help (330 KB to 318 KB): what decides here is the
     * encoder, not the source.
     */
    qualities: [70, 75],
    /**
     * HOW LONG AN OPTIMISED VARIANT IS KEPT BEFORE IT IS ENCODED AGAIN.
     *
     * For images that live in `public/`, Next cannot read a `Cache-Control`
     * from an upstream, so this value IS the cache lifetime. The default is 60
     * seconds: every variant was re-encoded a minute after the last visit.
     *
     * Thirty-one days matches the reasoning of the `public/` header below:
     * these masters change rarely, never carry a hash in their name, and a
     * replaced one should still reach visitors within weeks, not never. The
     * optimiser cache lives inside the container, so it is also wiped on every
     * rollout — this only stops the churn between them.
     */
    minimumCacheTTL: 2678400,
  },

  /**
   * CACHING · what the origin declares, and why.
   *
   * Measured before writing this, against `next start` and not by reading the
   * docs: `/_next/static/*` already ships `immutable` for a year — those
   * filenames carry a content hash, so it is always safe — but everything in
   * `public/` was going out with `max-age=0`. That is 38 MB of media, a 28 MB
   * film among it, revalidating on every visit. ETags keep the answer a cheap
   * 304 so the bytes are not re-sent, but the round trip happens anyway and,
   * worse, a CDN cannot hold any of it at the edge.
   *
   * ── WHY NOT `immutable` ─────────────────────────────────────────────────
   * Because nothing in `public/` carries a content hash in its name. A re-cut
   * delivered over the same path would never reach anyone who had already
   * visited, and re-cuts do happen here: the media registry records posters
   * being re-picked and encodes rejected on weight.
   *
   * So the policy is a long freshness window plus `stale-while-revalidate`:
   * repeat visits are instant, a replaced file propagates within the week, and
   * a CDN still gets to serve from the edge the whole time it refreshes. The
   * day these filenames carry a hash, this becomes `immutable` and the
   * trade-off disappears.
   */
  async headers() {
    return [
      {
        /* Brand media: delivered once, replaced rarely, never hashed.
         *
         * `woff2` USED TO BE IN THIS LIST AND HAD TO GO (2026-09-08). There is
         * not a single font in `public/`; the only `.woff2` files the site
         * serves are the 21 that `next/font` emits under
         * `/_next/static/media/`, with TWO content hashes in the name. This
         * pattern matched them and replaced Next's own header —
         * `max-age=31536000, immutable` — with seven days.
         *
         * Measured: the JS chunks came back immutable and the fonts did not.
         * A file whose name contains its own hash can never go stale, so a
         * returning visitor was revalidating 80 KB of typefaces every week for
         * nothing. Without `woff2` here, Next's default applies again. */
        source: '/:all*(jpg|jpeg|png|svg|webp|avif|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        /**
         * HTML pages. Next's own default here is `s-maxage=31536000` — a year
         * for shared caches — which is the right default when the platform
         * keys its CDN by deployment and purges on every release. This does
         * not: the pipeline builds a container image and rolls it out with
         * kustomize, and nothing purges anything. A year would mean a copy
         * correction never reaching the edge.
         *
         * Five minutes of edge freshness with a day of `stale-while-
         * revalidate` inverts that: a fix is live in minutes, and the CDN
         * still answers instantly the whole time it refreshes in the
         * background. `max-age=0` keeps the browser revalidating, which costs
         * one cheap 304 — the router fetches RSC payloads for in-site
         * navigation anyway, so this is felt on first load and hard refresh,
         * not on every click.
         *
         * The matcher is scoped to the language segment ON PURPOSE. A broad
         * `/:path*` would also swallow `/_next/static`, whose `immutable`
         * year is correct and must not be touched — those filenames DO carry
         * a content hash.
         */
        source: '/:locale(es|en|pt)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        /* The language home pages, which the pattern above does not cover. */
        source: '/:locale(es|en|pt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

export default nextConfig
