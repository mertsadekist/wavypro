import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getUserFromRequest } from "@/lib/admin-auth.server";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getUserFromRequest(request);
        if (!user) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ ok: false, error: "No file" }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
          return Response.json({ ok: false, error: "Max 10MB" }, { status: 413 });
        }
        const ext = ALLOWED[file.type];
        if (!ext) return Response.json({ ok: false, error: "Unsupported type" }, { status: 415 });
        const name = `${crypto.randomUUID()}.${ext}`;
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { error } = await supabaseAdmin.storage
          .from("uploads")
          .upload(name, bytes, { contentType: file.type, upsert: false });
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        const { data } = supabaseAdmin.storage.from("uploads").getPublicUrl(name);
        return Response.json({ ok: true, url: data.publicUrl });
      },
    },
  },
});