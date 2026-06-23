import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent } from "@/lib/site-content";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Instagram, Facebook, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo-head";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    ...pageHead(
      "/contact",
      "تواصل معنا — ويفي برو للستائر",
      "تواصل مع ويفي برو في الرياض عبر الهاتف أو الواتساب أو البريد الإلكتروني — أوقات العمل والعنوان وحجز المقايسة المجانية.",
    ),
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "ويفي برو للستائر",
        url: "https://webforge-quest.lovable.app/contact",
        telephone: "+966 57 532 9272",
        email: "info@wavyprogroup.com",
        address: { "@type": "PostalAddress", addressLocality: "الرياض", addressCountry: "SA" },
        openingHours: ["Sa-Th 08:00-22:00", "Fr 16:00-22:00"],
        areaServed: ["الرياض", "الخرج", "المجمعة", "القصيم", "الدمام"],
      }),
    }],
  }),
});

const formSchema = z.object({
  name: z.string().trim().min(2, "الرجاء إدخال الاسم").max(80),
  phone: z.string().trim().min(8, "رقم غير صحيح").max(20).regex(/^[+0-9\s-]+$/, "رقم غير صحيح"),
  city: z.string().max(40).optional(),
  service: z.string().max(80).optional(),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً").max(800),
});

function ContactPage() {
  const { data } = useSiteContent();
  const s = data?.site;
  const c = data?.contact;
  const cities = s?.cities ?? ["الرياض", "الخرج", "المجمعة", "القصيم", "الدمام"];
  const [form, setForm] = useState({ name: "", phone: "", city: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const waNumber = (s?.whatsapp || s?.phoneRaw || "").replace(/[^0-9]/g, "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    const text = `*طلب جديد من الموقع*\n\nالاسم: ${parsed.data.name}\nالجوال: ${parsed.data.phone}${parsed.data.city ? `\nالمدينة: ${parsed.data.city}` : ""}${parsed.data.service ? `\nالخدمة: ${parsed.data.service}` : ""}\n\nالرسالة:\n${parsed.data.message}`;
    if (waNumber) {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    }
    setSubmitted(true);
    toast.success("تم إرسال طلبك، سنتواصل معكم قريباً");
    setForm({ name: "", phone: "", city: "", service: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  }

  const services = ["تفصيل ستائر", "تركيب ستائر", "صيانة", "مقايسة مجانية", "استشارة"];

  const contactCards = [
    s?.phone && { icon: Phone, label: "اتصل بنا", value: s.phone, href: `tel:${s.phoneRaw}`, color: "bg-blue-500" },
    s?.whatsapp && { icon: MessageCircle, label: "واتساب", value: "راسلنا الآن", href: `https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`, color: "bg-[#25D366]" },
    s?.email && { icon: Mail, label: "البريد الإلكتروني", value: s.email, href: `mailto:${s.email}`, color: "bg-orange-500" },
    s?.phone2 && { icon: Phone, label: "رقم بديل", value: s.phone2, href: `tel:${s.phone2Raw}`, color: "bg-purple-500" },
  ].filter(Boolean) as Array<{ icon: any; label: string; value: string; href: string; color: string }>;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden text-white py-20 lg:py-28" style={{ background: "linear-gradient(225deg, var(--ink) 0%, var(--ink) 70%, color-mix(in oklab, var(--ink) 95%, black) 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, hsl(var(--gold)) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(var(--gold)) 0%, transparent 50%)" }} />
        <div className="container-x relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 text-gold text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4" /> نسعد بتواصلكم
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">{c?.title || "تواصل معنا"}</h1>
            <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-2xl">{c?.intro || "نحن هنا للإجابة على استفساراتكم وحجز المقايسة المجانية وتقديم استشارة متخصصة في أنواع الستائر وأقمشتها."}</p>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT CARDS */}
      <section className="container-x -mt-12 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, i) => (
            <a key={i} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group bg-card border border-border rounded-2xl p-5 hover:border-gold hover:shadow-elegant hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 rounded-xl ${card.color} grid place-items-center mb-4 group-hover:scale-110 transition`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-muted-foreground mb-1">{card.label}</div>
              <div className="font-bold text-ink truncate" dir={card.label.includes("واتساب") ? undefined : "ltr"} style={{ unicodeBidi: "plaintext" }}>{card.value}</div>
            </a>
          ))}
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="container-x py-20 grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-elegant">
            <div className="mb-8">
              <div className="text-gold font-semibold mb-2">أرسل لنا رسالة</div>
              <h2 className="text-2xl lg:text-3xl font-black text-ink">احجز <span className="text-gold">مقايسة مجانية</span></h2>
              <p className="text-muted-foreground mt-2 text-sm">سنتواصل معكم خلال ساعات العمل لتأكيد الطلب وترتيب الزيارة.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">الاسم الكامل *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} className={`w-full px-4 py-3 rounded-xl border bg-background text-ink focus:outline-none focus:ring-2 focus:ring-gold/40 ${errors.name ? "border-destructive" : "border-border"}`} placeholder="مثال: محمد أحمد" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">رقم الجوال *</label>
                  <input type="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} className={`w-full px-4 py-3 rounded-xl border bg-background text-ink focus:outline-none focus:ring-2 focus:ring-gold/40 ${errors.phone ? "border-destructive" : "border-border"}`} placeholder="05xxxxxxxx" />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">المدينة</label>
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-ink focus:outline-none focus:ring-2 focus:ring-gold/40">
                  <option value="">اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">الخدمة المطلوبة</label>
                <div className="flex flex-wrap gap-2">
                  {services.map((sv) => (
                    <button type="button" key={sv} onClick={() => setForm({ ...form, service: sv })} className={`px-4 py-2 rounded-full text-sm border transition ${form.service === sv ? "bg-gold border-gold text-ink font-bold" : "bg-background border-border text-ink hover:border-gold"}`}>
                      {sv}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">رسالتك *</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={800} rows={5} className={`w-full px-4 py-3 rounded-xl border bg-background text-ink focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none ${errors.message ? "border-destructive" : "border-border"}`} placeholder="اكتب تفاصيل طلبك، عدد النوافذ، المدينة، الموعد المفضل..." />
                <div className="flex justify-between mt-1">
                  {errors.message ? <p className="text-xs text-destructive">{errors.message}</p> : <span />}
                  <span className="text-xs text-muted-foreground">{form.message.length}/800</span>
                </div>
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full gradient-gold text-ink font-bold shadow-elegant hover:scale-[1.02] transition">
                {submitted ? (<><CheckCircle2 className="w-5 h-5" /> تم الإرسال</>) : (<><Send className="w-5 h-5" /> إرسال الطلب عبر واتساب</>)}
              </button>
              <p className="text-xs text-muted-foreground text-center">بالضغط على إرسال أنت توافق على تواصلنا معك عبر الرقم المُدخل.</p>
            </form>
          </div>
        </div>

        {/* Sidebar info */}
        <aside className="lg:col-span-2 space-y-4">
          {s?.address && (
            <div className="p-6 bg-ink text-white rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-gold grid place-items-center shrink-0"><MapPin className="w-5 h-5 text-ink" /></div>
                <div>
                  <div className="text-gold text-sm font-semibold mb-1">عنواننا</div>
                  <div className="font-bold text-white">{s.address.line1}</div>
                  <div className="text-white/80 text-sm mt-1">{s.address.line2}</div>
                  <div className="text-white/60 text-xs mt-1">{s.address.line3}</div>
                </div>
              </div>
            </div>
          )}
          {s?.hours && (
            <div className="p-6 bg-card border border-border rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 grid place-items-center shrink-0"><Clock className="w-5 h-5 text-gold" /></div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">أوقات العمل</div>
                  <div className="font-bold text-ink">{s.hours}</div>
                </div>
              </div>
            </div>
          )}
          <div className="p-6 bg-card border border-border rounded-3xl">
            <div className="text-sm text-muted-foreground mb-3">تابعنا</div>
            <div className="flex flex-wrap gap-3">
              {s?.social?.whatsapp && <a href={s.social.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp" className="w-11 h-11 rounded-xl bg-[#25D366] text-white grid place-items-center hover:scale-110 transition"><MessageCircle className="w-5 h-5" /></a>}
              {s?.social?.instagram && <a href={s.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white grid place-items-center hover:scale-110 transition"><Instagram className="w-5 h-5" /></a>}
              {s?.social?.facebook && <a href={s.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="w-11 h-11 rounded-xl bg-blue-600 text-white grid place-items-center hover:scale-110 transition"><Facebook className="w-5 h-5" /></a>}
            </div>
          </div>
          <div className="p-6 gradient-gold rounded-3xl text-white">
            <div className="font-black text-xl mb-3">مناطق الخدمة</div>
            <p className="text-white/85 text-sm leading-relaxed mb-4">فريقنا يصل إليكم لتنفيذ المقايسة والتركيب بكل احترافية في:</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <span key={city} className="px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold">{city}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* MAP */}
      <section className="container-x pb-20">
        <div className="rounded-3xl overflow-hidden border border-border shadow-elegant">
          <iframe
            title="موقعنا على الخريطة"
            src="https://www.google.com/maps?q=Riyadh+Saudi+Arabia&output=embed"
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full block"
          />
        </div>
      </section>
    </SiteLayout>
  );
}