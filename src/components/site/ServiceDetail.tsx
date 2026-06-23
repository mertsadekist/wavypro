import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent, asset, type ServicePage } from "@/lib/site-content";
import { ArrowLeft, Check, Sparkles, ShieldCheck } from "lucide-react";

export function ServiceDetailPage({ slugKey, fallbackTitle }: { slugKey: "fabrication" | "installation" | "maintenance" | "measurement" | "consultation"; fallbackTitle: string }) {
  const { data, isLoading } = useSiteContent();
  const page = data?.[slugKey] as ServicePage | undefined;
  if (isLoading) return <SiteLayout><div className="container-x py-32 text-center text-muted-foreground">جاري التحميل...</div></SiteLayout>;
  const p: ServicePage = page || { title: fallbackTitle };
  return (
    <SiteLayout>
      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {p.kicker && <div className="text-gold font-semibold mb-3">{p.kicker}</div>}
          <h1 className="text-4xl lg:text-5xl font-black text-ink leading-tight" dangerouslySetInnerHTML={{ __html: p.title }} />
          {p.intro && <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{p.intro}</p>}
          {p.body && <p className="mt-4 text-muted-foreground leading-relaxed">{p.body}</p>}
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-gold text-ink font-bold shadow-elegant">
            {p.ctaLabel || "احجز الآن"} <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        {p.image && (
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
            <img src={asset(p.image)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </section>
      {p.audience && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-ink text-center mb-10">لمن هذه الخدمة</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {p.audience.filter(a => a.title).map((a, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border border-border">
                  <h3 className="font-bold text-ink mb-2">{a.title}</h3>
                  {a.desc && <p className="text-muted-foreground text-sm">{a.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {p.includes && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink mb-10 text-center">ماذا تشمل الخدمة</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {p.includes.map((it, i) => (
              <div key={i} className="flex gap-3 p-5 bg-card rounded-xl border border-border">
                <Check className="w-5 h-5 text-gold shrink-0 mt-1" />
                <span className="text-ink">{it}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {p.spaces && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-ink text-center mb-10">المساحات التي نخدمها</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {p.spaces.map((s, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border border-border hover:border-gold transition">
                  <h3 className="font-bold text-ink mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {p.preReview && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink mb-10 text-center">ما نراجعه قبل التركيب</h2>
          <ul className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {p.preReview.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-ink"><span className="w-7 h-7 rounded-full gradient-gold text-ink text-sm font-bold grid place-items-center shrink-0">{i+1}</span>{s}</li>
            ))}
          </ul>
        </section>
      )}
      {p.checklist && (
        <section className="bg-ink text-white py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-gold text-center mb-10">قائمة التحقق أثناء التنفيذ</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {p.checklist.map((c, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-1" />
                  <span className="text-white/90">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {p.details && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink mb-10 text-center">تفاصيل تصنع الفرق</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {p.details.map((d, i) => (
              <div key={i} className="flex gap-3 p-5 bg-accent/30 rounded-xl">
                <Sparkles className="w-5 h-5 text-gold shrink-0 mt-1" />
                <span className="text-ink">{d}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {p.benefits && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-ink text-center mb-10">الفوائد</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {p.benefits.map((b, i) => (
                <div key={i} className="bg-card p-5 rounded-xl border border-border flex gap-3"><Check className="w-5 h-5 text-gold shrink-0 mt-1" /><span className="text-ink">{b}</span></div>
              ))}
            </div>
          </div>
        </section>
      )}
      {p.spaceRecs && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink mb-10 text-center">توصيات حسب المساحة</h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {p.spaceRecs.map((s, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border">
                <div className="text-gold font-bold mb-2">{s.space}</div>
                <p className="text-muted-foreground">{s.rec}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {p.suitableFor && (
        <section className="bg-accent/30 py-12">
          <div className="container-x text-center">
            <h3 className="text-2xl font-black text-ink mb-6">مناسبة لـ</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {p.suitableFor.map((s, i) => <span key={i} className="px-5 py-2 bg-card rounded-full border border-border text-ink font-medium">{s}</span>)}
            </div>
          </div>
        </section>
      )}
      {p.whyUs && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink mb-10 text-center">لماذا ويفي برو</h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {p.whyUs.map((w, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border flex gap-3"><Sparkles className="w-5 h-5 text-gold shrink-0 mt-1" /><span className="text-ink">{w}</span></div>
            ))}
          </div>
        </section>
      )}
      {p.features && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink mb-10 text-center">المميزات</h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {p.features.map((f, i) => (
              <div key={i} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-ink">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {p.steps && (
        <section className="bg-ink text-white py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-gold mb-10 text-center">آلية العمل</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {p.steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full gradient-gold text-ink font-black text-xl grid place-items-center mb-4">{i + 1}</div>
                  <h3 className="font-bold text-white">{s.title}</h3>
                  <p className="text-white/70 text-sm mt-2">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="container-x py-16 text-center">
        <div className="gradient-gold rounded-3xl p-10">
          <h3 className="text-2xl lg:text-3xl font-black text-ink">جاهز للبدء؟</h3>
          <p className="text-ink/80 mt-2">احجز زيارة مجانية الآن وسنصل إليكم في أي مدينة بالمملكة.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ink text-white font-bold hover:scale-105 transition">{p.ctaLabel || "تواصل معنا"} <ArrowLeft className="w-4 h-4" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}