import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent, asset } from "@/lib/site-content";
import { ShieldCheck } from "lucide-react";
import { pageHead } from "@/lib/seo-head";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => pageHead(
    "/services",
    "أنواع الستائر — دليل شامل | ويفي برو",
    "دليل كامل لأنواع الستائر: الأمريكية، الرول، الزيبرا، البلاك أوت، الرومان، الشتر الخشبي والمسرحية مع توصيات للأقمشة والاستخدام.",
  ),
});

function ServicesPage() {
  const { data } = useSiteContent();
  const list = data?.curtainsDetailed ?? [];
  return (
    <SiteLayout>
      <section className="container-x py-16">
        <div className="max-w-3xl">
          <div className="text-gold font-semibold mb-3">أنواع الستائر</div>
          <h1 className="text-4xl lg:text-5xl font-black text-ink">دليل شامل لأنواع الستائر</h1>
          <p className="mt-4 text-lg text-muted-foreground">اختر النوع الأنسب لمساحتك مع توصيات الخامة والاستخدام.</p>
        </div>
      </section>
      <section className="container-x pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c) => (
          <Link key={c.slug} to="/curtains/$slug" params={{ slug: c.slug }} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elegant hover:border-gold transition group block">
            {c.image && <div className="aspect-[4/3] overflow-hidden"><img src={asset(c.image)} alt={`ستائر ${c.name}`} className="w-full h-full object-cover hover:scale-110 transition duration-700" /></div>}
            <div className="p-6">
              <h2 className="font-bold text-ink text-xl mb-2">{c.name}</h2>
              {c.suitableFor && <p className="text-sm text-muted-foreground mb-3"><span className="font-semibold text-ink">مناسبة لـ:</span> {c.suitableFor}</p>}
              {c.features && <ul className="space-y-1 text-sm text-muted-foreground">{c.features.slice(0, 2).map((f, i) => <li key={i}>• {f}</li>)}</ul>}
              <div className="mt-4 text-gold font-bold text-sm group-hover:gap-2 inline-flex items-center gap-1 transition-all">اعرف التفاصيل ←</div>
            </div>
          </Link>
        ))}
      </section>
      {data?.quickPicker && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-ink mb-8 text-center">دليل الاختيار السريع</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {data.quickPicker.map((q, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="text-gold font-semibold mb-1">{q.need}</div>
                  <div className="text-ink">{q.types}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* WARRANTY */}
      {data?.site?.warranty && data.site.warranty.length > 0 && (
        <section className="bg-ink text-white py-16">
          <div className="container-x">
            <div className="text-center mb-10">
              <div className="text-gold font-semibold mb-2">ضماننا لكم</div>
              <h2 className="text-3xl lg:text-4xl font-black text-white">جودة <span className="text-gold">مضمونة</span> لسنوات</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {data.site.warranty.map((w, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center mx-auto mb-4"><ShieldCheck className="w-7 h-7 text-white" /></div>
                  <p className="font-bold text-white leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-x py-16 text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-gold text-white font-bold shadow-elegant">احجز مقايسة مجانية</Link>
      </section>
    </SiteLayout>
  );
}