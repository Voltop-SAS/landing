# ─────────────────────────────────────────────────────────────────────────────
# The server only ever uses this file. docker-compose.yml is development.
#
# The three deploy pipelines name `runner` explicitly with `--target`, so stage
# ORDER here carries no meaning: adding a stage, or reordering these, cannot
# change what production ships. That was not true until the pipelines were
# fixed — they built with a bare `docker build .`, which takes whatever stage
# comes last, and `runner` was correct only by position.
# ─────────────────────────────────────────────────────────────────────────────

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

# ─── Credentials for the lead form, baked into the image ─────────────────────
# Read at RUNTIME by the lead form's route handler, not at build time, which is
# why they belong to this stage and not to `builder`. ARG scope is per-stage, so
# they have to be declared here even though the build command passes them once.
#
# WHAT THIS COSTS, so nobody rediscovers it during an audit: an ARG turned into
# ENV is stored in the image configuration. Anyone who can pull the image can
# read the secret key back with `docker history` or `docker inspect`, and it
# also lands in the registry's layer metadata. The alternative is a Kubernetes
# Secret referenced from the overlay in the manifests repo, which keeps the
# value out of the image entirely; that route was weighed and this one chosen
# deliberately, so treat registry pull access as equivalent to holding the key.
#
# THE SENDER AND THE RECIPIENTS ARE NOT HERE, and should not become environment
# variables: they change for
# reasons that are not technical — a domain gets verified, someone joins the
# commercial team — and each such change would otherwise mean editing a secret
# store, rebuilding this image and redeploying to alter twelve characters. They
# live in `core/business/infrastructure/email/leadDelivery.ts`, which is the file
# `/admin` will later replace with an editable setting.
#
# THE `_SES` SUFFIX IS NOT DECORATION. The pair belongs to an IAM identity that
# can send mail and nothing else, and the standard `AWS_ACCESS_KEY_ID` name would
# put it in the SDK's ambient credential chain, where any other AWS client in the
# process would pick it up. Named this way, only the mailer reads it.
ARG AWS_ACCESS_KEY_ID_SES
ARG AWS_SECRET_ACCESS_KEY_SES
ARG AWS_REGION
ARG GOOGLE_SERVICE_ACCOUNT_KEY
ENV AWS_ACCESS_KEY_ID_SES=${AWS_ACCESS_KEY_ID_SES}
ENV AWS_SECRET_ACCESS_KEY_SES=${AWS_SECRET_ACCESS_KEY_SES}
ENV AWS_REGION=${AWS_REGION}
ENV GOOGLE_SERVICE_ACCOUNT_KEY=${GOOGLE_SERVICE_ACCOUNT_KEY}

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
