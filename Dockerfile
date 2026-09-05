FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache git
WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Development. Carries the FULL dependency tree on purpose: `next dev` needs the
# CLI and every dev dependency, none of which survive the standalone trace. The
# compose file mounts the working copy over /workspace and runs `npm run dev`
# against this stage.
FROM node:20-alpine AS dev
WORKDIR /workspace
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /workspace/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS builder
ARG ENV
ENV ENV=${ENV}

WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production. `output: 'standalone'` in next.config.ts makes the build trace the
# modules the server actually imports and emit them next to a server.js of its
# own, so this stage carries 43 MB of dependencies instead of 646 MB.
#
# THE THREE COPIES BELOW ARE NOT INTERCHANGEABLE, and getting one wrong fails
# silently — the site answers 200 with pieces missing:
#
# 1. `.next/standalone` is the server plus its traced dependencies. It lands at
#    the root, which is why server.js ends up at /workspace/server.js.
# 2. `.next/static` is NOT part of the standalone output. Without it every
#    hashed asset 404s: the page renders as unstyled markup. Verified by
#    running the standalone output before writing this — the CSS did 404.
# 3. `public/` is NOT copied either, with one confusing exception: the tracer
#    pulled in `Logo_voltop.svg` on its own because `opengraph-image.tsx` reads
#    it from disk. One file out of seventeen. Everything else is referenced by
#    URL, which the tracer cannot see, so the directory is copied whole.
FROM node:20-alpine AS runner
WORKDIR /workspace

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /workspace/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /workspace/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
# The standalone server binds to localhost by default, which inside a container
# means nothing outside it can reach the port.
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
