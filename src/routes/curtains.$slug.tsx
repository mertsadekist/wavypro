import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent, asset } from "@/lib/site-content";
import { CURTAIN_RICH } from "@/lib/curtains-content";
import { ArrowLeft, Check, Sparkles, Hammer, Droplets, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/curtains/$slug")({
  component: CurtainDetailPage,
  head: ({ params }) => {
    const rich = CURTAIN_RICH[params.slug];
    const url = `https://webforge-quest.lovable.app/curtains/${params.slug}`;
    const title = rich?.seoTitle || `ستائر ${params.slug} — ويفي برو`;
    const description = rich?.seoDescription || "تفاصيل هذا النوع من الستائر مع توصيات الأقمشة والتركيب والعناية من ويفي برو.";
    const scripts: { type: string; children: string }[] = [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description,
        brand: { "@type": "Brand", name: "ويفي برو للستائر" },
        category: "Curtains",
        url,
      }),
    }];
    if (rich?.faq?.length) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: rich.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      });
    }
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
});

function CurtainDetailPage() {
  const { slug } = Route.useParams();
  const { data } = useSiteContent();
  const curtain = data?.curtainsDetailed?.find((c) => c.slug === slug);
  const rich = CURTAIN_RICH[slug];
  if (!curtain) {
    return (
      <SiteLayout>
        <div className="container-x py-32 text-center">
          <h1 className="text-3xl font-black text-ink mb-4">النوع غير موجود</h1>
          <Link to="/services" className="text-gold font-bold">عرض كل الأنواع ←</Link>
        </div>
      </SiteLayout>
    );
  }
  const related = rich?.related?.map((s) => data?.curtainsDetailed?.find((c) => c.slug === s)).filter(Boolean) ?? [];
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-accent/40 via-background to-background">
        <div className="container-x py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link to="/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold mb-4 text-sm">
              <ArrowLeft className="w-4 h-4 rotate-180" /> أنواع الستائر
            </Link>
            <div className="text-gold font-semibold mb-3">نوع ستائر</div>
            <h1 className="text-4xl lg:text-5xl font-black text-ink leading-tight">{curtain.name}</h1>
            {curtain.suitableFor && (
              <p className="mt-4 text-muted-foreground"><span className="font-semibold text-ink">مناسبة لـ:</span> {curtain.suitableFor}</p>
            )}
            {rich?.longDescription && <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{rich.longDescription}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-gold text-ink font-bold shadow-elegant hover:scale-105 transition">احجز مقايسة مجانية <ArrowLeft className="w-4 h-4" /></Link>
              <Link to="/measurement" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-ink text-ink font-bold hover:bg-ink hover:text-white transition">تعرّف على المقايسة</Link>
            </div>
          </div>
          {curtain.image && (
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
              <img src={asset(curtain.image)} alt={curtain.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      {rich?.benefits && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink text-center mb-10">لماذا تختار {curtain.name}؟</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {rich.benefits.map((b, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border hover:border-gold transition">
                <Sparkles className="w-6 h-6 text-gold mb-3" />
                <p className="text-ink leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* USE CASES */}
      {rich?.bestUseCases && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-ink text-center mb-10">أفضل استخدامات</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {rich.bestUseCases.map((u, i) => (
                <span key={i} className="px-6 py-3 bg-card rounded-full border border-border text-ink font-medium">{u}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FABRICS + INSTALLATION + CARE */}
      <section className="container-x py-16 grid md:grid-cols-3 gap-6">
        {rich?.fabricRecommendations && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 rounded-xl gradient-gold grid place-items-center text-ink mb-4"><Check className="w-6 h-6" /></div>
            <h3 className="font-black text-ink text-xl mb-4">الأقمشة الموصى بها</h3>
            <ul className="space-y-2">
              {rich.fabricRecommendations.map((f, i) => <li key={i} className="flex gap-2 text-muted-foreground"><Check className="w-4 h-4 text-gold mt-1 shrink-0" />{f}</li>)}
            </ul>
          </div>
        )}
        {rich?.installationTips && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 rounded-xl gradient-gold grid place-items-center text-ink mb-4"><Hammer className="w-6 h-6" /></div>
            <h3 className="font-black text-ink text-xl mb-4">نصائح التركيب</h3>
            <ul className="space-y-2">
              {rich.installationTips.map((f, i) => <li key={i} className="flex gap-2 text-muted-foreground"><Check className="w-4 h-4 text-gold mt-1 shrink-0" />{f}</li>)}
            </ul>
          </div>
        )}
        {rich?.careTips && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 rounded-xl gradient-gold grid place-items-center text-ink mb-4"><Droplets className="w-6 h-6" /></div>
            <h3 className="font-black text-ink text-xl mb-4">العناية والصيانة</h3>
            <ul className="space-y-2">
              {rich.careTips.map((f, i) => <li key={i} className="flex gap-2 text-muted-foreground"><Check className="w-4 h-4 text-gold mt-1 shrink-0" />{f}</li>)}
            </ul>
          </div>
        )}
      </section>

      {/* CONSIDERATIONS */}
      {curtain.considerations && (
        <section className="bg-ink text-white py-12">
          <div className="container-x text-center max-w-3xl">
            <h3 className="text-2xl font-black text-gold mb-4">ما يجب مراعاته قبل الاختيار</h3>
            <p className="text-white/80 leading-relaxed text-lg">{curtain.considerations}</p>
          </div>
        </section>
      )}

      {/* FAQ */}
      {rich?.faq && (
        <section className="container-x py-16">
          <h2 className="text-3xl font-black text-ink text-center mb-10">أسئلة شائعة</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {rich.faq.map((f, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex gap-3 items-start mb-2">
                  <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-1" />
                  <h3 className="font-bold text-ink text-lg">{f.q}</h3>
                </div>
                <p className="text-muted-foreground pr-8">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-black text-ink text-center mb-10">أنواع ذات صلة</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((c: any) => (
                <Link key={c.slug} to="/curtains/$slug" params={{ slug: c.slug }} className="bg-card rounded-2xl overflow-hidden border border-border hover:border-gold hover:shadow-elegant transition group">
                  {c.image && <div className="aspect-[4/3] overflow-hidden"><img src={asset(c.image)} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></div>}
                  <div className="p-5">
                    <h3 className="font-bold text-ink text-lg">{c.name}</h3>
                    <div className="mt-2 text-gold font-semibold text-sm">اعرف المزيد ←</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x py-16">
        <div className="gradient-gold rounded-3xl p-10 lg:p-14 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-ink">جاهز لاختيار {curtain.name}؟</h2>
          <p className="mt-4 text-ink/80 text-lg">احجز مقايسة مجانية وسنزوركم في أي مدينة بالمملكة.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ink text-white font-bold hover:scale-105 transition">تواصل معنا الآن <ArrowLeft className="w-4 h-4" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}