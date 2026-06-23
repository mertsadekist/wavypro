import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "تسجيل الدخول — لوحة التحكم" }] }),
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-accent/30 p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-card border border-border rounded-2xl shadow-elegant p-8">
        <h1 className="text-2xl font-black text-ink mb-2">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mb-6">سجل دخولك لإدارة الموقع</p>
        <label className="block text-sm font-semibold text-ink mb-2">البريد الإلكتروني</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background mb-4 focus:outline-none focus:border-gold" dir="ltr" />
        <label className="block text-sm font-semibold text-ink mb-2">كلمة المرور</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background mb-4 focus:outline-none focus:border-gold" dir="ltr" />
        {err && <div className="text-sm text-destructive mb-4">{err}</div>}
        <button disabled={loading} className="w-full py-3 rounded-xl gradient-gold text-ink font-bold disabled:opacity-50">{loading ? "..." : "تسجيل الدخول"}</button>
      </form>
    </div>
  );
}