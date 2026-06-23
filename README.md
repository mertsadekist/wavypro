# Wavy Pro — ويفي برو للستائر

Arabic (RTL) curtains business website. **TanStack Start (React 19) + Vite 7 + Tailwind v4**, rendered server-side via **Nitro `node-server`**.

The public website is fully **self-contained**: all content is served from
`public/content.json` and the blog from `public/articles.json` — **no database is
required at runtime**. Supabase is used only by the optional `/admin` panel
(content editing, image upload) and is loaded lazily, so the public site keeps
working even with no Supabase config.

---

## Tech stack

| | |
|---|---|
| Framework | TanStack Start (file-based routes in `src/routes`) |
| Build | Vite 7 → Nitro `node-server` preset → `.output/server/index.mjs` |
| Styling | Tailwind v4, design tokens in `src/styles.css` (terracotta `#a03f22` + cream `#d7c8a8`) |
| Content | `public/content.json` (site) + `public/articles.json` (blog) |
| Analytics | Google Tag Manager `GTM-53SR34FG` (injected in `src/routes/__root.tsx`) |

---

## Local development

```bash
npm install
npm run dev        # http://localhost:8080 (or next free port)
npm run build      # produces ./.output
```

---

## Deploy on Coolify (Docker)

This repo ships a production **`Dockerfile`** (multi-stage, self-contained).

1. **New Resource → Application → Public/Private Repository**, select this repo.
2. **Build Pack:** `Dockerfile`.
3. **Port:** `3000` (the container listens on `PORT`, default `3000`).
4. **Environment variables** (all optional — public site works without them):

   Runtime (Environment Variables):
   ```
   NODE_ENV=production
   PORT=3000
   SUPABASE_URL=...                 # admin/upload only
   SUPABASE_PUBLISHABLE_KEY=...     # admin/upload only
   SUPABASE_SERVICE_ROLE_KEY=...    # admin/upload only (secret)
   ```

   Build Variables (only if you want the `/admin` login to work — baked into the client bundle):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   VITE_SUPABASE_PROJECT_ID=...
   ```
5. **Deploy.** Coolify builds the image and runs `node server/index.mjs`.
6. Point your domain at the app and enable HTTPS in Coolify.

> Copy the exact values from your local `.env` (kept out of git). See `.env.example` for the template.

### Persisting admin edits (optional)

Content edits made through `/admin` write to files **inside the container**
(`/app/.output/public/content.json`, `articles.json`, `uploads/`) and are lost on
redeploy. To persist them, add Coolify **Persistent Storage** mounts:

| Container path | Purpose |
|---|---|
| `/app/.output/public/content.json` | site content |
| `/app/.output/public/articles.json` | blog posts |
| `/app/.output/public/uploads` | uploaded images |

For most cases it's simpler to edit `public/content.json` in the repo and redeploy.

---

## Build & run with Docker locally

```bash
docker build -t wavypro .
docker run -p 3000:3000 wavypro
# open http://localhost:3000
```

---

## Project layout

```
src/routes/            # pages (index, about, services, contact, blog, api/*)
src/components/site/    # Header, Footer, layout, service detail
src/lib/site-content.ts # content fetch hook + types
public/content.json     # ALL site content (edited via /admin or directly)
public/articles.json    # blog posts
public/uploads/         # logo + hero/service/project images
public/assets/images/   # curtain type & fabric images
Dockerfile              # production image for Coolify
```
