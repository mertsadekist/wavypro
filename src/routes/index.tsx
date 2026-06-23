import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent, toRoute, asset } from "@/lib/site-content";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const HOME_TITLE = "ويفي برو للستائر — تفصيل وتركيب الستائر في الرياض";
const HOME_DESC = "متخصصون في تفصيل، تركيب، صيانة، ومقايسة جميع أنواع الستائر في الرياض وجميع مدن المملكة بخبرة تمتد لأكثر من 20 عاماً.";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:url", content: "https://webforge-quest.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://webforge-quest.lovable.app/" }],
  }),
});

function HomePage() {
  const { data, isLoading } = useSiteContent();
  const [slideIdx, setSlideIdx] = useState(0);
  const slides = data?.home?.slides ?? [];
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);
  if (isLoading || !data || !data.home) return <SiteLayout><div className="container-x py-32 text-center text-muted-foreground">جاري التحميل...</div></SiteLayout>;
  const home = data.home;
  const aboutStrip = home.aboutStrip ?? { eyebrow: "", title: "", body: "", features: [] as string[] };
  const hero = slides[slideIdx] ?? slides[0];
  const goPrev = () => setSlideIdx((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setSlideIdx((i) => (i + 1) % slides.length);
  return (
    <SiteLayout>
      {/* HERO — full-width designed banners (slider) */}
      <section className="relative">
        <h1 className="sr-only">{HOME_TITLE}</h1>
        <div className="relative w-full overflow-hidden aspect-[1672/941] bg-accent/30">
          {slides.map((sl, i) => {
            const href = toRoute(sl.ctaHref || "/works");
            return (
              <Link
                to={href}
                key={i}
                aria-hidden={i !== slideIdx}
                tabIndex={i === slideIdx ? 0 : -1}
                aria-label={sl.title?.replace(/<[^>]+>/g, "") || "اكتشف أعمالنا"}
                className={`absolute inset-0 transition-opacity duration-1000 ${i === slideIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {sl.image && (
                  <img
                    src={asset(sl.image)}
                    alt={sl.title?.replace(/<[^>]+>/g, "") || "ستائر فاخرة من ويفي برو"}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )}
              </Link>
            );
          })}

          {slides.length > 1 && (
            <>
              <button onClick={goPrev} aria-label="السابق" className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur text-ink grid place-items-center hover:bg-gold hover:text-white transition"><ChevronRight className="w-5 h-5" /></button>
              <button onClick={goNext} aria-label="التالي" className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur text-ink grid place-items-center hover:bg-gold hover:text-white transition"><ChevronLeft className="w-5 h-5" /></button>
              <div className="absolute bottom-3 sm:bottom-5 inset-x-0 flex items-center justify-center gap-2 z-10">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setSlideIdx(i)} aria-label={`الشريحة ${i + 1}`} className={`h-2 rounded-full transition-all ${i === slideIdx ? "w-8 bg-gold" : "w-2 bg-white/70 border border-ink/10"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* COUNTERS */}
      <section className="bg-ink text-white py-12">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-8">
          {home.counters?.map((c, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-gold">{c.value}</div>
              <div className="text-white/70 mt-2 text-sm">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="container-x py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            {aboutStrip.image1 && <img src={asset(aboutStrip.image1)} alt="" className="rounded-2xl aspect-[3/4] object-cover" />}
            {aboutStrip.image2 && <img src={asset(aboutStrip.image2)} alt="" className="rounded-2xl aspect-[3/4] object-cover mt-8" />}
          </div>
          <div>
            <div className="text-gold font-semibold mb-3">{aboutStrip.eyebrow}</div>
            <h2 className="text-3xl lg:text-4xl font-black text-ink leading-tight" dangerouslySetInnerHTML={{ __html: aboutStrip.title }} />
            <p className="mt-5 text-muted-foreground leading-relaxed">{aboutStrip.body}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {aboutStrip.features?.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-ink"><Check className="w-4 h-4 text-gold" /> {f}</li>
              ))}
            </ul>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all">اعرف المزيد عنا <ArrowLeft className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-accent/30 py-20">
        <div className="container-x">
          <div className="text-center mb-12">
            <div className="text-gold font-semibold mb-2">خدماتنا</div>
            <h2 className="text-3xl lg:text-4xl font-black text-ink">منظومة متكاملة من <span className="text-gold">البداية إلى ما بعد التركيب</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {home.services?.map((s) => {
              const img = (data as any)?.[s.key]?.image || `assets/images/svc-${s.key}.jpg`;
              return (
                <Link key={s.key} to={toRoute(s.href)} className="group flex flex-col items-center text-center bg-card border border-border rounded-2xl p-6 hover:shadow-elegant hover:border-gold transition">
                  <div className="relative mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-gold/20 group-hover:ring-gold/50 transition">
                      <img src={asset(img)} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                  </div>
                  <h3 className="font-bold text-ink mb-2 text-lg">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CURTAINS GRID */}
      <section className="container-x py-20">
        <div className="text-center mb-12">
          <div className="text-gold font-semibold mb-2">أنواع الستائر</div>
          <h2 className="text-3xl lg:text-4xl font-black text-ink">نوع لكل <span className="text-gold">مساحة وذوق</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.curtainsDetailed?.slice(0, 8).map((c) => (
            <Link key={c.slug} to="/curtains/$slug" params={{ slug: c.slug }} className="group block">
              <div className="aspect-square overflow-hidden rounded-2xl mb-3">
                {c.image && <img src={asset(c.image)} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />}
              </div>
              <h3 className="font-bold text-ink text-lg group-hover:text-gold transition">{c.name}</h3>
              {c.suitableFor && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.suitableFor}</p>}
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-white font-bold hover:bg-gold hover:text-ink transition">عرض كل الأنواع <ArrowLeft className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* STEPS / PROCESS */}
      {home.steps && home.steps.length > 0 && (
        <section className="bg-ink text-white py-20">
          <div className="container-x">
            <div className="text-center mb-12">
              <div className="text-gold font-semibold mb-2">خطوات العمل</div>
              <h2 className="text-3xl lg:text-4xl font-black text-white">من أول تواصل <span className="text-gold">حتى التسليم</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {home.steps.map((s, i) => (
                <div key={i} className="relative">
                  <div className="w-14 h-14 rounded-full gradient-gold text-ink font-black text-xl grid place-items-center mb-4">{i + 1}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WORKS PREVIEW */}
      {home.worksPreview && home.worksPreview.length > 0 && (
        <section className="container-x py-20">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-gold font-semibold mb-2">أعمالنا</div>
              <h2 className="text-3xl lg:text-4xl font-black text-ink">مشاريع <span className="text-gold">منجزة بفخر</span></h2>
            </div>
            <Link to="/works" className="inline-flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all">شاهد كل الأعمال <ArrowLeft className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {home.worksPreview.map((w, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "lg:row-span-2 lg:col-span-2 aspect-square lg:aspect-auto" : "aspect-square"}`}>
                <img src={asset(w.image)} alt={w.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                {w.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                    {w.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CLIENTS */}
      {home.clients && home.clients.length > 0 && (
        <section className="bg-accent/30 py-16">
          <div className="container-x">
            <div className="text-center mb-10">
              <div className="text-gold font-semibold mb-2">عملاؤنا</div>
              <h2 className="text-2xl lg:text-3xl font-black text-ink">يثق بنا <span className="text-gold">أكبر الأسماء</span></h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {home.clients.map((c, i) => (
                <div key={i} className="px-6 py-3 bg-card rounded-xl border border-border text-ink font-bold text-sm md:text-base hover:border-gold hover:text-gold transition">
                  {c.logo ? <img src={asset(c.logo)} alt={c.name} className="h-10 w-auto grayscale hover:grayscale-0 transition" /> : c.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x pb-20">
        <div className="gradient-gold rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
          <h2 className="text-3xl lg:text-5xl font-black text-ink">جاهزون لتحويل مساحتكم؟</h2>
          <p className="mt-4 text-ink/80 text-lg max-w-2xl mx-auto">احجز زيارة مقايسة مجانية، نأتي إليكم في أي مدينة بالمملكة.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ink text-white font-bold hover:scale-105 transition">تواصل معنا الآن <ArrowLeft className="w-4 h-4" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}