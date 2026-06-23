import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { siteContentQuery, type SiteContent } from "@/lib/site-content";
import { LogOut, Save, Upload, Plus, Trash2, FileText, Settings, Phone, Home as HomeIcon, Layers, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "لوحة التحكم — ويفي برو" }] }),
});

type Tab = "general" | "nav" | "home" | "services" | "curtains" | "pages" | "articles";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("general");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(siteContentQuery);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { if (data && !draft) setDraft(JSON.parse(JSON.stringify(data))); }, [data, draft]);

  async function save() {
    if (!draft) return;
    setSaving(true); setMsg("");
    const { data: sess } = await supabase.auth.getSession();
    const r = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sess.session?.access_token}` },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (r.ok) { setMsg("تم الحفظ بنجاح ✓"); qc.invalidateQueries({ queryKey: ["site-content"] }); }
    else setMsg("فشل الحفظ");
    setTimeout(() => setMsg(""), 3000);
  }

  async function logout() { await supabase.auth.signOut(); navigate({ to: "/login" }); }

  if (isLoading || !draft) return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحميل...</div>;

  const update = (fn: (d: SiteContent) => void) => {
    const copy = JSON.parse(JSON.stringify(draft)) as SiteContent;
    fn(copy); setDraft(copy);
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "general", label: "الإعدادات العامة", icon: Settings },
    { key: "nav", label: "القائمة الرئيسية", icon: Layers },
    { key: "home", label: "الصفحة الرئيسية", icon: HomeIcon },
    { key: "services", label: "صفحات الخدمات", icon: Layers },
    { key: "curtains", label: "أنواع الستائر", icon: Layers },
    { key: "pages", label: "صفحات أخرى", icon: FileText },
    { key: "articles", label: "المقالات", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-accent/20 flex">
      <aside className="w-64 bg-ink text-white p-4 flex flex-col gap-1 sticky top-0 h-screen">
        <div className="px-3 py-4 mb-2">
          <div className="font-black text-gold text-xl">لوحة التحكم</div>
          <div className="text-white/60 text-xs mt-1">ويفي برو</div>
        </div>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${tab === t.key ? "bg-gold text-ink font-bold" : "text-white/80 hover:bg-white/10"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
        <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-gold">← عرض الموقع</Link>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-destructive w-full"><LogOut className="w-4 h-4" /> تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-accent/20 backdrop-blur py-3 z-10">
          <h1 className="text-2xl font-black text-ink">{tabs.find((t) => t.key === tab)?.label}</h1>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm text-gold font-semibold">{msg}</span>}
            {tab !== "articles" && <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold text-ink font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ التغييرات"}</button>}
          </div>
        </div>

        {tab === "general" && <GeneralTab draft={draft} update={update} />}
        {tab === "nav" && <NavTab draft={draft} update={update} />}
        {tab === "home" && <HomeTab draft={draft} update={update} />}
        {tab === "services" && <ServicesTab draft={draft} update={update} />}
        {tab === "curtains" && <CurtainsTab draft={draft} update={update} />}
        {tab === "pages" && <PagesTab draft={draft} update={update} />}
        {tab === "articles" && <ArticlesTab />}
      </main>
    </div>
  );
}

// ---------- Reusable inputs ----------
function Field({ label, children }: { label: string; children: any }) {
  return <div className="mb-4"><label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"w-full px-4 py-2.5 rounded-lg border border-border bg-card focus:outline-none focus:border-gold " + (props.className || "")} />;
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={"w-full px-4 py-2.5 rounded-lg border border-border bg-card focus:outline-none focus:border-gold " + (props.className || "")} />;
}
function Card({ children, title }: { children: any; title?: string }) {
  return <div className="bg-card border border-border rounded-2xl p-6 mb-5">{title && <h3 className="font-bold text-ink mb-4">{title}</h3>}{children}</div>;
}

async function uploadImage(file: File): Promise<string | null> {
  const path = `admin/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
  const { error } = await supabase.storage.from("uploads").upload(path, file, { upsert: false });
  if (error) { alert(error.message); return null; }
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}

function ImageInput({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex gap-2 items-start">
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="رابط الصورة" />
      <label className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-gold cursor-pointer text-sm whitespace-nowrap">
        <Upload className="w-4 h-4" /> {busy ? "..." : "رفع"}
        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          setBusy(true); const url = await uploadImage(f); setBusy(false);
          if (url) onChange(url);
        }} />
      </label>
      {value && <img src={value.startsWith("http") || value.startsWith("/") ? value : "/" + value} alt="" className="w-12 h-12 object-cover rounded-lg border border-border" />}
    </div>
  );
}

// ---------- Tabs ----------
function GeneralTab({ draft, update }: any) {
  const s = draft.site;
  return (
    <>
      <Card title="معلومات العلامة">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="اسم العلامة"><Input value={s.brand} onChange={(e) => update((d: any) => { d.site.brand = e.target.value; })} /></Field>
          <Field label="الاسم المختصر"><Input value={s.brandShort || ""} onChange={(e) => update((d: any) => { d.site.brandShort = e.target.value; })} /></Field>
          <Field label="الشعار التعريفي"><Input value={s.tagline || ""} onChange={(e) => update((d: any) => { d.site.tagline = e.target.value; })} /></Field>
          <Field label="ساعات العمل"><Input value={s.hours || ""} onChange={(e) => update((d: any) => { d.site.hours = e.target.value; })} /></Field>
        </div>
      </Card>
      <Card title="أرقام التواصل">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="الهاتف الأساسي (عرض)"><Input value={s.phone || ""} onChange={(e) => update((d: any) => { d.site.phone = e.target.value; })} dir="ltr" /></Field>
          <Field label="الهاتف الأساسي (raw للاتصال)"><Input value={s.phoneRaw || ""} onChange={(e) => update((d: any) => { d.site.phoneRaw = e.target.value; })} dir="ltr" /></Field>
          <Field label="هاتف بديل (عرض)"><Input value={s.phone2 || ""} onChange={(e) => update((d: any) => { d.site.phone2 = e.target.value; })} dir="ltr" /></Field>
          <Field label="هاتف بديل (raw)"><Input value={s.phone2Raw || ""} onChange={(e) => update((d: any) => { d.site.phone2Raw = e.target.value; })} dir="ltr" /></Field>
          <Field label="البريد الإلكتروني"><Input value={s.email || ""} onChange={(e) => update((d: any) => { d.site.email = e.target.value; })} dir="ltr" /></Field>
          <Field label="رقم واتساب (raw)"><Input value={s.whatsapp || ""} onChange={(e) => update((d: any) => { d.site.whatsapp = e.target.value; })} dir="ltr" /></Field>
        </div>
      </Card>
      <Card title="العنوان">
        <Field label="السطر 1"><Input value={s.address?.line1 || ""} onChange={(e) => update((d: any) => { d.site.address = { ...d.site.address, line1: e.target.value }; })} /></Field>
        <Field label="السطر 2"><Input value={s.address?.line2 || ""} onChange={(e) => update((d: any) => { d.site.address = { ...d.site.address, line2: e.target.value }; })} /></Field>
        <Field label="السطر 3"><Input value={s.address?.line3 || ""} onChange={(e) => update((d: any) => { d.site.address = { ...d.site.address, line3: e.target.value }; })} /></Field>
      </Card>
      <Card title="وسائل التواصل الاجتماعي">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Instagram"><Input value={s.social?.instagram || ""} onChange={(e) => update((d: any) => { d.site.social = { ...d.site.social, instagram: e.target.value }; })} dir="ltr" /></Field>
          <Field label="Facebook"><Input value={s.social?.facebook || ""} onChange={(e) => update((d: any) => { d.site.social = { ...d.site.social, facebook: e.target.value }; })} dir="ltr" /></Field>
          <Field label="TikTok"><Input value={s.social?.tiktok || ""} onChange={(e) => update((d: any) => { d.site.social = { ...d.site.social, tiktok: e.target.value }; })} dir="ltr" /></Field>
          <Field label="WhatsApp Link"><Input value={s.social?.whatsapp || ""} onChange={(e) => update((d: any) => { d.site.social = { ...d.site.social, whatsapp: e.target.value }; })} dir="ltr" /></Field>
        </div>
      </Card>
      <Card title="نصوص التذييل (Footer)">
        <Field label="شعار التذييل (يدعم HTML)"><Input value={s.footerTagline || ""} onChange={(e) => update((d: any) => { d.site.footerTagline = e.target.value; })} /></Field>
        <Field label="وصف التذييل"><TextArea rows={3} value={s.footerAbout || ""} onChange={(e) => update((d: any) => { d.site.footerAbout = e.target.value; })} /></Field>
        <Field label="حقوق النشر"><Input value={s.copyright || ""} onChange={(e) => update((d: any) => { d.site.copyright = e.target.value; })} /></Field>
      </Card>
    </>
  );
}

function NavTab({ draft, update }: any) {
  const nav = draft.nav as any[];
  return (
    <Card title="عناصر القائمة">
      {nav.map((n, i) => (
        <div key={i} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end mb-3 pb-3 border-b border-border">
          <Field label="المفتاح"><Input value={n.key} onChange={(e) => update((d: any) => { d.nav[i].key = e.target.value; })} /></Field>
          <Field label="النص الظاهر"><Input value={n.label} onChange={(e) => update((d: any) => { d.nav[i].label = e.target.value; })} /></Field>
          <Field label="الرابط (مثل: about.html)"><Input value={n.href} onChange={(e) => update((d: any) => { d.nav[i].href = e.target.value; })} dir="ltr" /></Field>
          <button onClick={() => update((d: any) => { d.nav.splice(i, 1); })} className="p-2.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white mb-4"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={() => update((d: any) => { d.nav.push({ key: "new", label: "جديد", href: "index.html" }); })} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold hover:text-ink"><Plus className="w-4 h-4" /> إضافة عنصر</button>
    </Card>
  );
}

function HomeTab({ draft, update }: any) {
  const home = draft.home;
  return (
    <>
      <Card title="الشرائح الترويسية (Hero)">
        {home.slides?.map((slide: any, i: number) => (
          <div key={i} className="border border-border rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-ink">الشريحة {i + 1}</span>
              <button onClick={() => update((d: any) => { d.home.slides.splice(i, 1); })} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
            <Field label="السطر العلوي"><Input value={slide.kicker || ""} onChange={(e) => update((d: any) => { d.home.slides[i].kicker = e.target.value; })} /></Field>
            <Field label="العنوان (يدعم <em>)"><Input value={slide.title || ""} onChange={(e) => update((d: any) => { d.home.slides[i].title = e.target.value; })} /></Field>
            <Field label="الوصف"><TextArea rows={2} value={slide.sub || ""} onChange={(e) => update((d: any) => { d.home.slides[i].sub = e.target.value; })} /></Field>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="نص الزر"><Input value={slide.ctaLabel || ""} onChange={(e) => update((d: any) => { d.home.slides[i].ctaLabel = e.target.value; })} /></Field>
              <Field label="رابط الزر"><Input value={slide.ctaHref || ""} onChange={(e) => update((d: any) => { d.home.slides[i].ctaHref = e.target.value; })} dir="ltr" /></Field>
            </div>
            <Field label="الصورة"><ImageInput value={slide.image} onChange={(v) => update((d: any) => { d.home.slides[i].image = v; })} /></Field>
          </div>
        ))}
        <button onClick={() => update((d: any) => { d.home.slides = d.home.slides || []; d.home.slides.push({ kicker: "", title: "عنوان", sub: "", ctaLabel: "", ctaHref: "", image: "" }); })} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold text-gold"><Plus className="w-4 h-4" /> إضافة شريحة</button>
      </Card>

      <Card title="الإحصائيات (Counters)">
        <div className="grid md:grid-cols-4 gap-3">
          {home.counters?.map((c: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-3">
              <Field label="الرقم"><Input value={c.value} onChange={(e) => update((d: any) => { d.home.counters[i].value = e.target.value; })} /></Field>
              <Field label="النص"><Input value={c.label} onChange={(e) => update((d: any) => { d.home.counters[i].label = e.target.value; })} /></Field>
            </div>
          ))}
        </div>
      </Card>

      <Card title="قسم من نحن">
        <Field label="السطر العلوي"><Input value={home.aboutStrip?.eyebrow || ""} onChange={(e) => update((d: any) => { d.home.aboutStrip.eyebrow = e.target.value; })} /></Field>
        <Field label="العنوان"><Input value={home.aboutStrip?.title || ""} onChange={(e) => update((d: any) => { d.home.aboutStrip.title = e.target.value; })} /></Field>
        <Field label="الوصف"><TextArea rows={4} value={home.aboutStrip?.body || ""} onChange={(e) => update((d: any) => { d.home.aboutStrip.body = e.target.value; })} /></Field>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="الصورة 1"><ImageInput value={home.aboutStrip?.image1} onChange={(v) => update((d: any) => { d.home.aboutStrip.image1 = v; })} /></Field>
          <Field label="الصورة 2"><ImageInput value={home.aboutStrip?.image2} onChange={(v) => update((d: any) => { d.home.aboutStrip.image2 = v; })} /></Field>
        </div>
        <Field label="المميزات (سطر لكل ميزة)">
          <TextArea rows={6} value={(home.aboutStrip?.features || []).join("\n")} onChange={(e) => update((d: any) => { d.home.aboutStrip.features = e.target.value.split("\n").filter(Boolean); })} />
        </Field>
      </Card>

      <Card title="بطاقات الخدمات">
        {home.services?.map((s: any, i: number) => (
          <div key={i} className="grid md:grid-cols-[1fr_1fr_2fr_1fr_auto] gap-2 items-end mb-3 pb-3 border-b border-border">
            <Field label="المفتاح"><Input value={s.key} onChange={(e) => update((d: any) => { d.home.services[i].key = e.target.value; })} /></Field>
            <Field label="العنوان"><Input value={s.title} onChange={(e) => update((d: any) => { d.home.services[i].title = e.target.value; })} /></Field>
            <Field label="الوصف"><Input value={s.desc} onChange={(e) => update((d: any) => { d.home.services[i].desc = e.target.value; })} /></Field>
            <Field label="الرابط"><Input value={s.href} onChange={(e) => update((d: any) => { d.home.services[i].href = e.target.value; })} dir="ltr" /></Field>
            <button onClick={() => update((d: any) => { d.home.services.splice(i, 1); })} className="text-destructive p-2 mb-4"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => update((d: any) => { d.home.services.push({ key: "new", title: "خدمة جديدة", desc: "", href: "" }); })} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold text-gold"><Plus className="w-4 h-4" /> إضافة خدمة</button>
      </Card>
    </>
  );
}

function ServicePageEditor({ keyName, draft, update, label }: any) {
  const p = draft[keyName] || {};
  const set = (field: string, v: any) => update((d: any) => { d[keyName] = { ...(d[keyName] || {}), [field]: v }; });
  return (
    <Card title={label}>
      <Field label="السطر العلوي"><Input value={p.kicker || ""} onChange={(e) => set("kicker", e.target.value)} /></Field>
      <Field label="العنوان (يدعم <em>)"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="المقدمة"><TextArea rows={3} value={p.intro || ""} onChange={(e) => set("intro", e.target.value)} /></Field>
      <Field label="النص الكامل"><TextArea rows={5} value={p.body || ""} onChange={(e) => set("body", e.target.value)} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="نص زر الدعوة"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
        <Field label="رابط زر الدعوة"><Input value={p.ctaHref || ""} onChange={(e) => set("ctaHref", e.target.value)} dir="ltr" /></Field>
      </div>
      <Field label="الصورة"><ImageInput value={p.image} onChange={(v) => set("image", v)} /></Field>
    </Card>
  );
}

function ServicesTab({ draft, update }: any) {
  return (
    <>
      <ServicePageEditor keyName="fabrication" label="صفحة: تفصيل الستائر" draft={draft} update={update} />
      <ServicePageEditor keyName="installation" label="صفحة: تركيب الستائر" draft={draft} update={update} />
      <ServicePageEditor keyName="maintenance" label="صفحة: صيانة الستائر" draft={draft} update={update} />
      <ServicePageEditor keyName="measurement" label="صفحة: المقايسة" draft={draft} update={update} />
      <ServicePageEditor keyName="consultation" label="صفحة: الاستشارات" draft={draft} update={update} />
    </>
  );
}

function CurtainsTab({ draft, update }: any) {
  const list = draft.curtainsDetailed || [];
  return (
    <Card title="أنواع الستائر">
      {list.map((c: any, i: number) => (
        <div key={i} className="border border-border rounded-xl p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-ink">{c.name || "بدون اسم"}</span>
            <button onClick={() => update((d: any) => { d.curtainsDetailed.splice(i, 1); })} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="الاسم"><Input value={c.name || ""} onChange={(e) => update((d: any) => { d.curtainsDetailed[i].name = e.target.value; })} /></Field>
            <Field label="Slug"><Input value={c.slug || ""} onChange={(e) => update((d: any) => { d.curtainsDetailed[i].slug = e.target.value; })} dir="ltr" /></Field>
          </div>
          <Field label="الصورة"><ImageInput value={c.image} onChange={(v) => update((d: any) => { d.curtainsDetailed[i].image = v; })} /></Field>
          <Field label="مناسبة لـ"><TextArea rows={2} value={c.suitableFor || ""} onChange={(e) => update((d: any) => { d.curtainsDetailed[i].suitableFor = e.target.value; })} /></Field>
          <Field label="المميزات (سطر لكل ميزة)"><TextArea rows={3} value={(c.features || []).join("\n")} onChange={(e) => update((d: any) => { d.curtainsDetailed[i].features = e.target.value.split("\n").filter(Boolean); })} /></Field>
          <Field label="نقاط للمراعاة"><TextArea rows={2} value={c.considerations || ""} onChange={(e) => update((d: any) => { d.curtainsDetailed[i].considerations = e.target.value; })} /></Field>
        </div>
      ))}
      <button onClick={() => update((d: any) => { d.curtainsDetailed = d.curtainsDetailed || []; d.curtainsDetailed.push({ slug: "new", name: "نوع جديد", image: "", features: [] }); })} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold text-gold"><Plus className="w-4 h-4" /> إضافة نوع</button>
    </Card>
  );
}

function PagesTab({ draft, update }: any) {
  const about = draft.about || {};
  const contact = draft.contact || {};
  const works = draft.works || {};
  return (
    <>
      <Card title="صفحة: من نحن">
        <Field label="العنوان"><Input value={about.title || ""} onChange={(e) => update((d: any) => { d.about = { ...(d.about || {}), title: e.target.value }; })} /></Field>
        <Field label="المقدمة"><TextArea rows={3} value={about.intro || ""} onChange={(e) => update((d: any) => { d.about = { ...(d.about || {}), intro: e.target.value }; })} /></Field>
        <Field label="النص"><TextArea rows={5} value={about.body || ""} onChange={(e) => update((d: any) => { d.about = { ...(d.about || {}), body: e.target.value }; })} /></Field>
        <Field label="الصورة"><ImageInput value={about.image} onChange={(v) => update((d: any) => { d.about = { ...(d.about || {}), image: v }; })} /></Field>
      </Card>
      <Card title="صفحة: تواصل معنا">
        <Field label="العنوان"><Input value={contact.title || ""} onChange={(e) => update((d: any) => { d.contact = { ...(d.contact || {}), title: e.target.value }; })} /></Field>
        <Field label="المقدمة"><TextArea rows={3} value={contact.intro || ""} onChange={(e) => update((d: any) => { d.contact = { ...(d.contact || {}), intro: e.target.value }; })} /></Field>
      </Card>
      <Card title="صفحة: أعمالنا">
        <Field label="العنوان"><Input value={works.title || ""} onChange={(e) => update((d: any) => { d.works = { ...(d.works || {}), title: e.target.value }; })} /></Field>
        <Field label="المقدمة"><TextArea rows={3} value={works.intro || ""} onChange={(e) => update((d: any) => { d.works = { ...(d.works || {}), intro: e.target.value }; })} /></Field>
        <div className="mt-4">
          <div className="font-semibold text-ink mb-2">معرض الصور (اختياري — يُعرض بدلاً من ستائرنا)</div>
          {(works.gallery || []).map((g: any, i: number) => (
            <div key={i} className="grid md:grid-cols-[2fr_1fr_auto] gap-2 items-end mb-2">
              <Field label="الصورة"><ImageInput value={g.image} onChange={(v) => update((d: any) => { d.works = { ...(d.works || {}) }; d.works.gallery[i].image = v; })} /></Field>
              <Field label="التسمية"><Input value={g.caption || ""} onChange={(e) => update((d: any) => { d.works.gallery[i].caption = e.target.value; })} /></Field>
              <button onClick={() => update((d: any) => { d.works.gallery.splice(i, 1); })} className="text-destructive p-2 mb-4"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={() => update((d: any) => { d.works = d.works || {}; d.works.gallery = d.works.gallery || []; d.works.gallery.push({ image: "", caption: "" }); })} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold text-gold text-sm"><Plus className="w-4 h-4" /> إضافة صورة</button>
        </div>
      </Card>
    </>
  );
}

// ---------- Articles ----------
function ArticlesTab() {
  const qc = useQueryClient();
  const { data: articles, refetch } = useQuery({
    queryKey: ["articles", "all"],
    queryFn: async () => {
      const { data: sess } = await supabase.auth.getSession();
      const r = await fetch("/api/articles?all=1", { headers: { Authorization: `Bearer ${sess.session?.access_token}` } });
      const j = await r.json();
      return (j.articles || []) as any[];
    },
  });
  const [editing, setEditing] = useState<any | null>(null);

  async function authedFetch(url: string, opts: RequestInit = {}) {
    const { data: sess } = await supabase.auth.getSession();
    return fetch(url, { ...opts, headers: { ...(opts.headers || {}), "Content-Type": "application/json", Authorization: `Bearer ${sess.session?.access_token}` } });
  }
  async function save(a: any) {
    const method = a.id ? "PUT" : "POST";
    const r = await authedFetch("/api/articles", { method, body: JSON.stringify(a) });
    if (r.ok) { setEditing(null); refetch(); qc.invalidateQueries({ queryKey: ["articles"] }); }
    else alert((await r.json()).error || "فشل");
  }
  async function remove(id: string) {
    if (!confirm("هل أنت متأكد من حذف المقال؟")) return;
    const r = await authedFetch(`/api/articles?id=${id}`, { method: "DELETE" });
    if (r.ok) refetch();
  }

  if (editing) return <ArticleEditor article={editing} onCancel={() => setEditing(null)} onSave={save} />;

  return (
    <Card title="إدارة المقالات">
      <button onClick={() => setEditing({ title: "", slug: "", excerpt: "", cover_url: "", body_html: "", published: true })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-gold text-ink font-bold mb-5"><Plus className="w-4 h-4" /> مقال جديد</button>
      <div className="space-y-2">
        {articles?.length === 0 && <div className="text-muted-foreground text-center py-10">لا توجد مقالات بعد</div>}
        {articles?.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
            <div className="flex items-center gap-3">
              {a.cover_url && <img src={a.cover_url} alt="" className="w-14 h-14 object-cover rounded-lg" />}
              <div>
                <div className="font-bold text-ink">{a.title}</div>
                <div className="text-xs text-muted-foreground" dir="ltr">/post/{a.slug} {!a.published && "• مخفي"}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(a)} className="px-3 py-1.5 rounded-lg border border-border text-sm hover:border-gold">تعديل</button>
              <button onClick={() => remove(a.id)} className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-white"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ArticleEditor({ article, onSave, onCancel }: any) {
  const [a, setA] = useState(article);
  return (
    <Card title={a.id ? "تعديل مقال" : "مقال جديد"}>
      <Field label="العنوان"><Input value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} /></Field>
      <Field label="Slug (اتركه فارغاً للتوليد التلقائي)"><Input value={a.slug || ""} onChange={(e) => setA({ ...a, slug: e.target.value })} dir="ltr" /></Field>
      <Field label="المقتطف"><TextArea rows={2} value={a.excerpt || ""} onChange={(e) => setA({ ...a, excerpt: e.target.value })} /></Field>
      <Field label="صورة الغلاف"><ImageInput value={a.cover_url} onChange={(v) => setA({ ...a, cover_url: v })} /></Field>
      <Field label="محتوى HTML"><TextArea rows={15} value={a.body_html || ""} onChange={(e) => setA({ ...a, body_html: e.target.value })} className="font-mono text-sm" /></Field>
      <label className="flex items-center gap-2 mb-4"><input type="checkbox" checked={a.published !== false} onChange={(e) => setA({ ...a, published: e.target.checked })} /> منشور</label>
      <div className="flex gap-3">
        <button onClick={() => onSave(a)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold text-ink font-bold"><Save className="w-4 h-4" /> حفظ</button>
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-border">إلغاء</button>
      </div>
    </Card>
  );
}