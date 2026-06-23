import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CURTAIN_RICH } from "@/lib/curtains-content";

const BASE_URL = "https://wavyprogroup.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/fabrication", changefreq: "monthly", priority: "0.85" },
          { path: "/installation", changefreq: "monthly", priority: "0.85" },
          { path: "/maintenance", changefreq: "monthly", priority: "0.85" },
          { path: "/measurement", changefreq: "monthly", priority: "0.85" },
          { path: "/consultation", changefreq: "monthly", priority: "0.85" },
          { path: "/works", changefreq: "weekly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.9" },
          { path: "/contact", changefreq: "monthly", priority: "0.8" },
        ];

        for (const slug of Object.keys(CURTAIN_RICH)) {
          entries.push({ path: `/curtains/${slug}`, changefreq: "monthly", priority: "0.7" });
        }

        try {
          const raw = readFileSync(join(process.cwd(), "public", "articles.json"), "utf8");
          const posts = JSON.parse(raw) as Array<{
            slug: string;
            published?: boolean;
            updated_at?: string;
            created_at?: string;
          }>;
          for (const p of posts ?? []) {
            if (p.published === false) continue;
            entries.push({
              path: `/post/${p.slug}`,
              changefreq: "monthly",
              priority: "0.7",
              lastmod: (p.updated_at || p.created_at || "").slice(0, 10) || undefined,
            });
          }
        } catch {
          // ignore — still serve static portion
        }

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});