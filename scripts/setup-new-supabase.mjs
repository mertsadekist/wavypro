// Finish migration to a NEW Supabase instance: create the admin auth user and
// verify the "uploads" storage bucket. Run AFTER applying new-instance-setup.sql.
//
// Usage (PowerShell):
//   $env:NEW_SUPABASE_URL="https://<api-url>"
//   $env:NEW_SERVICE_ROLE_KEY="<service_role_key>"
//   $env:ADMIN_EMAIL="admin@wavyprogroup.com"
//   $env:ADMIN_PASSWORD="<strong-password>"
//   node scripts/setup-new-supabase.mjs
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEW_SUPABASE_URL;
const KEY = process.env.NEW_SERVICE_ROLE_KEY;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!URL || !KEY) {
  console.error("Missing NEW_SUPABASE_URL or NEW_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 1) Ensure the "uploads" storage bucket exists (public)
const { data: buckets } = await admin.storage.listBuckets();
if (!buckets?.some((b) => b.id === "uploads")) {
  const { error } = await admin.storage.createBucket("uploads", { public: true });
  console.log(error ? `bucket error: ${error.message}` : "✓ created bucket 'uploads'");
} else {
  console.log("• bucket 'uploads' already exists");
}

// 2) Create the admin auth user (idempotent-ish)
if (EMAIL && PASSWORD) {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) {
    console.log(`admin user: ${error.message} (may already exist)`);
  } else {
    console.log(`✓ created admin user: ${data.user?.email}`);
  }
} else {
  console.log("• skipped admin user (set ADMIN_EMAIL & ADMIN_PASSWORD to create)");
}

console.log("Done.");
