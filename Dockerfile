# syntax=docker/dockerfile:1

###############################################################################
# Wavy Pro — TanStack Start (React 19) + Nitro node-server
# Multi-stage build for Coolify / any Docker host.
# The PUBLIC website needs NO environment variables (content is served from
# public/content.json). The VITE_* args below are only for the admin panel.
###############################################################################

# ---------- 1) Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# Build-time public config for Vite (baked into the client bundle).
# Only needed so the /admin login page can talk to Supabase. Optional.
# In Coolify add these under "Build Variables".
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_PUBLISHABLE_KEY=""
ARG VITE_SUPABASE_PROJECT_ID=""
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

# Install deps with a reproducible lockfile.
# --include=dev forces devDependencies to install even when the platform sets
# NODE_ENV=production at build time (Coolify does). vite and
# @lovable.dev/vite-tanstack-config are dev deps required by `vite build`.
# `npm run build` itself still runs in production mode.
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Build the app -> produces ./.output (self-contained Nitro server)
COPY . .
RUN npm run build

# ---------- 2) Runtime stage ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    NITRO_PORT=3000

# Nitro's node-server output bundles all dependencies — no node_modules needed.
COPY --from=build /app/.output ./.output

EXPOSE 3000

# Health check so Coolify/Docker can confirm the app is up before routing traffic.
# Uses busybox wget (bundled in alpine). Adjust the port if you change PORT.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/" || exit 1

# Run from inside .output so process.cwd()/public/content.json resolves correctly.
WORKDIR /app/.output
CMD ["node", "server/index.mjs"]
