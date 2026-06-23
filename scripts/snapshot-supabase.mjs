// One-off snapshot: pull site_content + articles from Supabase into local JSON files
// so the public site can run fully decoupled from any runtime database.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

// Load .env manually (no dotenv dependency required)
const envRaw = readFileSync(join(process.cwd(), ".env"), "utf8");
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 1) site_content -> public/content.json
const { data: sc, error: scErr } = await sb
  .from("site_content")
  .select("content")
  .eq("id", 1)
  .maybeSingle();

if (scErr) {
  console.error("site_content error:", scErr.message);
} else if (sc?.content && Object.keys(sc.content).length > 0) {
  writeFileSync(
    join(process.cwd(), "public", "content.json"),
    JSON.stringify(sc.content, null, 2),
    "utf8",
  );
  console.log("✓ content.json refreshed from Supabase");
} else {
  console.log("• site_content empty — keeping existing public/content.json");
}

// 2) articles -> public/articles.json
const { data: arts, error: artErr } = await sb
  .from("articles")
  .select("*")
  .order("created_at", { ascending: false });

if (artErr) {
  console.error("articles error:", artErr.message);
  writeFileSync(
    join(process.cwd(), "public", "articles.json"),
    JSON.stringify([], null, 2),
    "utf8",
  );
  console.log("• wrote empty articles.json (query failed)");
} else {
  writeFileSync(
    join(process.cwd(), "public", "articles.json"),
    JSON.stringify(arts || [], null, 2),
    "utf8",
  );
  console.log(`✓ articles.json written (${(arts || []).length} articles)`);
}

console.log("Done.");
