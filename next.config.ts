import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * The language lives in the URL (§28). The root redirects to the default
   * one. A temporary redirect is used while the site is unpublished; once it
   * is live, this becomes `permanent: true`.
   */
  async redirects() {
    return [{ source: '/', destination: '/es', permanent: false }]
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    /**
     * Next only serves the qualities declared here; any other one errors. 70
     * was added for the hero photograph: it is the LCP element, and at the
     * default quality it weighed 332 KB on Retina screens — over the 250 KB
     * budget §29 sets — with the LCP at 2.44s against a 2.5s limit. Lowering
     * the master did not help (330 KB to 318 KB): what decides here is the
     * AVIF encoder, not the source.
     */
    qualities: [70, 75],
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
        /* Brand media: delivered once, replaced rarely, never hashed. */
        source: '/:all*(jpg|jpeg|png|svg|webp|avif|mp4|webm|woff2)',
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
