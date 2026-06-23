// Run a .sql file against a self-hosted Supabase via the pg-meta /pg/query endpoint.
// Usage: node scripts/run-sql-pgmeta.mjs <sqlFile>
import { readFileSync } from "node:fs";

const BASE = process.env.NEW_SUPABASE_URL;
const SVC = process.env.NEW_SERVICE_ROLE_KEY;
const file = process.argv[2];
if (!BASE || !SVC || !file) {
  console.error("Need NEW_SUPABASE_URL, NEW_SERVICE_ROLE_KEY env and a sql file arg");
  process.exit(1);
}
const sql = readFileSync(file, "utf8");

const res = await fetch(`${BASE}/pg/query`, {
  method: "POST",
  headers: {
    apikey: SVC,
    Authorization: `Bearer ${SVC}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});
const text = await res.text();
console.log("HTTP", res.status);
console.log(text.slice(0, 1500));
if (!res.ok) process.exit(1);
