FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# ── Dependencies ──────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/cms/package.json apps/cms/
COPY packages/shared/package.json packages/shared/ 2>/dev/null || true
RUN pnpm install --frozen-lockfile --filter @marienbad/cms...

# ── Build ─────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules
COPY apps/cms apps/cms
COPY packages packages
COPY pnpm-workspace.yaml turbo.json ./
RUN cd apps/cms && pnpm build

# ── Production ────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 payload
COPY --from=builder --chown=payload:nodejs /app/apps/cms/dist ./dist
COPY --from=builder --chown=payload:nodejs /app/apps/cms/node_modules ./node_modules
COPY --from=builder --chown=payload:nodejs /app/apps/cms/package.json ./
USER payload
EXPOSE 3001
ENV PORT=3001
CMD ["node", "dist/server.js"]
