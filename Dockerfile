
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache git
WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
ARG ENV

ENV ENV=${ENV}

WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /workspace

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /workspace/.next ./.next
COPY --from=builder /workspace/next.config.ts ./
COPY --from=builder /workspace/public ./public
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]