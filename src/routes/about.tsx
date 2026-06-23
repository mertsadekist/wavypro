import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent, asset } from "@/lib/site-content";
import { Check, Eye, Target, ShieldCheck } from "lucide-react";
import { pageHead } from "@/lib/seo-head";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => pageHead(
    "/about",
    "من نحن — ويفي برو للستائر",
    "تعرّف على ويفي برو للستائر: شركة سعودية متخصصة في تفصيل وتركيب الستائر بأكثر من 20 عاماً من الخبرة وفريق متخصص في كل أنواع الأقمشة والتصاميم.",
  ),
});

function AboutPage() {
  const { data } = useSiteContent();
  const a = data?.home?.aboutStrip;
  const about = data?.about;
  const clients = data?.home?.clients ?? [];
  return (
    <SiteLayout>
      {/* INTRO */}
      <section className="container-x py-16 lg:py-24">
        <div className="max-w-3xl">
          <div className="text-gold font-semibold mb-3">من نحن</div>
          <h1 className="text-4xl lg:text-6xl font-black text-ink leading-tight [&_em]:text-gold [&_em]:not-italic" dangerouslySetInnerHTML={{ __html: about?.title || a?.title || "" }} />
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{about?.intro || a?.body}</p>
        </div>
        {(about?.image || a?.image1) && (
          <div className="mt-12 aspect-[21/9] rounded-3xl overflow-hidden shadow-elegant">
            <img src={asset(about?.image || a?.image1)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </section>

      {/* VISION + MISSION */}
      {(about?.vision || about?.mission) && (
        <section className="container-x pb-4">
          <div className="grid md:grid-cols-2 gap-6">
            {about?.vision && (
              <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-elegant hover:border-gold transition">
                <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center mb-5"><Eye className="w-7 h-7 text-white" /></div>
                <h2 className="text-2xl font-black text-ink mb-3">{about.vision.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{about.vision.desc}</p>
              </div>
            )}
            {about?.mission && (
              <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-elegant hover:border-gold transition">
                <div className="w-14 h-14 rounded-2xl gradient-gold grid place-items-center mb-5"><Target className="w-7 h-7 text-white" /></div>
                <h2 className="text-2xl font-black text-ink mb-3">{about.mission.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{about.mission.desc}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* VALUES */}
      {about?.values && about.values.length > 0 && (
        <section className="container-x py-16">
          <div className="text-center mb-12">
            <div className="text-gold font-semibold mb-2">قيمنا</div>
            <h2 className="text-3xl lg:text-4xl font-black text-ink">ما الذي <span className="text-gold">نلتزم به</span> تجاهكم</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {about.values.map((v, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-elegant hover:border-gold transition">
                <div className="w-11 h-11 rounded-xl bg-gold/10 grid place-items-center mb-4"><ShieldCheck className="w-6 h-6 text-gold" /></div>
                <h3 className="font-bold text-ink text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHAT MAKES US SPECIAL */}
      {a?.features && (
        <section className="container-x pb-4">
          <h2 className="text-2xl font-black text-ink mb-6">ما يميّزنا</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {a.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 p-5 bg-card border border-border rounded-xl"><Check className="w-5 h-5 text-gold shrink-0" /> {f}</li>
            ))}
          </ul>
        </section>
      )}

      {/* COMMERCIAL CLIENTS — centered & large */}
      {clients.length > 0 && (
        <section className="bg-accent/30 py-20 mt-12">
          <div className="container-x text-center">
            <div className="text-gold font-semibold mb-2">عملاؤنا التجاريون</div>
            <h2 className="text-3xl lg:text-5xl font-black text-ink mb-3">يثق بنا <span className="text-gold">أكبر الأسماء</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">نفخر بخدمة نخبة من العلامات التجارية والمؤسسات في مختلف القطاعات داخل المملكة.</p>
            <div className="flex flex-wrap items-center justify-center gap-5 max-w-5xl mx-auto">
              {clients.map((c, i) => (
                <div key={i} className="px-8 py-5 bg-card rounded-2xl border border-border text-ink font-bold text-lg md:text-xl hover:border-gold hover:text-gold hover:shadow-elegant transition">
                  {c.logo ? <img src={asset(c.logo)} alt={c.name} className="h-12 w-auto grayscale hover:grayscale-0 transition" /> : c.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
