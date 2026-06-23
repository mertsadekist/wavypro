import { createFileRoute } from "@tanstack/react-router";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ARTICLES_PATH = join(process.cwd(), "public", "articles.json");

type Article = {
  id?: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  cover_url?: string | null;
  body_html?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

function readArticles(): Article[] {
  try {
    const data = JSON.parse(readFileSync(ARTICLES_PATH, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeArticles(list: Article[]) {
  writeFileSync(ARTICLES_PATH, JSON.stringify(list, null, 2), "utf8");
}

function slugify(s: string) {
  return (
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s ]+/g, "-")
      .replace(/[^a-z0-9؀-ۿ-]+/g, "")
      .slice(0, 120) || `post-${Date.now()}`
  );
}

export const Route = createFileRoute("/api/articles")({
  server: {
    handlers: {
      // Blog is served from the local articles.json snapshot — no database.
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");
        const all = url.searchParams.get("all") === "1";
        const articles = readArticles();

        if (slug) {
          const article = articles.find((a) => a.slug === slug);
          if (!article || (!article.published && !all)) {
            return Response.json({ ok: false, error: "Not found" }, { status: 404 });
          }
          return Response.json({ ok: true, article });
        }

        const list = all ? articles : articles.filter((a) => a.published !== false);
        return Response.json({ ok: true, articles: list });
      },
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({} as any));
        const title = String(body.title || "").trim();
        if (!title) return Response.json({ ok: false, error: "Title required" }, { status: 400 });
        const articles = readArticles();
        const article: Article = {
          id: Date.now(),
          slug: String(body.slug || slugify(title)),
          title,
          excerpt: String(body.excerpt || ""),
          cover_url: body.cover_url || null,
          body_html: String(body.body_html || ""),
          published: body.published !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        articles.unshift(article);
        try {
          writeArticles(articles);
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "Write failed" },
            { status: 500 },
          );
        }
        return Response.json({ ok: true, article });
      },
      PUT: async ({ request }) => {
        const body = await request.json().catch(() => ({} as any));
        if (!body.id) return Response.json({ ok: false, error: "id required" }, { status: 400 });
        const articles = readArticles();
        const idx = articles.findIndex((a) => String(a.id) === String(body.id));
        if (idx === -1) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
        const allowed = ["slug", "title", "excerpt", "cover_url", "body_html", "published"] as const;
        for (const k of allowed) {
          if (k in body) (articles[idx] as any)[k] = body[k];
        }
        articles[idx].updated_at = new Date().toISOString();
        try {
          writeArticles(articles);
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "Write failed" },
            { status: 500 },
          );
        }
        return Response.json({ ok: true, article: articles[idx] });
      },
      DELETE: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 });
        const articles = readArticles();
        const next = articles.filter((a) => String(a.id) !== String(id));
        try {
          writeArticles(next);
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "Write failed" },
            { status: 500 },
          );
        }
        return Response.json({ ok: true });
      },
    },
  },
});
