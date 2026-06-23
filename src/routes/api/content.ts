import { createFileRoute } from "@tanstack/react-router";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_PATH = join(process.cwd(), "public", "content.json");

function readContent(): unknown {
  try {
    return JSON.parse(readFileSync(CONTENT_PATH, "utf8"));
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      // Public site content is served entirely from the local content.json
      // file — no runtime database. This can never 500 on a missing DB.
      GET: async () => {
        const payload = readContent();
        return new Response(JSON.stringify(payload), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      },
      // Saving writes back to the local content.json file. Note: on most
      // shared/cPanel hosts the application directory is writable, so this
      // persists; if the filesystem is read-only the write will fail and we
      // surface a clear error.
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        try {
          writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2), "utf8");
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "Write failed" },
            { status: 500 },
          );
        }
        return Response.json({ ok: true, saved_at: new Date().toISOString() });
      },
    },
  },
});
