import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, User, Tag, ChevronDown, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/post/$slug")({
  component: PostPage,
  head: ({ params }) => {
    const url = `https://webforge-quest.lovable.app/post/${params.slug}`;
    const title = `${params.slug.replace(/-/g, " ")} — مدوّنة ويفي برو`;
    const description = `مقال من مدوّنة ويفي برو للستائر حول ${params.slug.replace(/-/g, " ")}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          url,
          publisher: { "@type": "Organization", name: "ويفي برو للستائر" },
        }),
      }],
    };
  },
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const r = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`);
      if (!r.ok) throw new Error("Not found");
      const j = await r.json();
      return j.article;
    },
  });
  const { data: allArticles } = useQuery({
    queryKey: ["articles-list"],
    queryFn: async () => {
      const r = await fetch(`/api/articles`);
      if (!r.ok) return [];
      const j = await r.json();
      return j.articles || [];
    },
  });

  const bodyRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  useEffect(() => {
    if (!bodyRef.current || !data?.body_html) return;
    const headings = Array.from(bodyRef.current.querySelectorAll("h2, h3"));
    const items = headings.map((h, i) => {
      const text = h.textContent || "";
      const id = `section-${i}-${text.replace(/\s+/g, "-").slice(0, 40)}`;
      h.id = id;
      return { id, text, level: h.tagName === "H2" ? 2 : 3 };
    });
    setToc(items);
  }, [data?.body_html]);

  const tags = useMemo(() => {
    if (!data?.title) return [] as string[];
    const base = ["ستائر", "الرياض", "ويفي برو"];
    const t: string[] = [];
    const title = String(data.title);
    ["غرفة النوم", "صالون", "مجلس", "بلاك أوت", "ويفي", "رول", "زيبرا", "أمريكية", "خشبية", "تركيب", "تفصيل", "صيانة"]
      .forEach((w) => { if (title.includes(w)) t.push(w); });
    return Array.from(new Set([...t, ...base])).slice(0, 8);
  }, [data?.title]);

  const faqs = useMemo(() => ([
    { q: "كم تستغرق مدة تفصيل وتركيب الستائر؟", a: "في الغالب من 3 إلى 7 أيام عمل من تأكيد الطلب، حسب نوع القماش والكمية ومتى تكون المقاسات جاهزة." },
    { q: "هل تقدمون مقايسة مجانية في الرياض؟", a: "نعم، نوفر زيارة مقايسة مجانية داخل الرياض مع تقديم عرض سعر مفصّل واقتراح الأنسب لمساحتك." },
    { q: "ما الفرق بين ستائر البلاك أوت والستائر العادية؟", a: "ستائر البلاك أوت تحجب الضوء كلياً وتوفر خصوصية أعلى وعزل حراري أفضل، بينما العادية تسمح بدخول جزء من الإضاءة." },
    { q: "هل تقدمون ضمان على التركيب؟", a: "نعم، نقدّم ضمان على التركيب وخدمة صيانة دورية ضمن سياسة ما بعد البيع." },
  ]), []);

  const suggested = useMemo(() => {
    if (!allArticles) return [];
    return (allArticles as any[]).filter((a) => a.slug !== slug).slice(0, 3);
  }, [allArticles, slug]);

  const publishedDate = data?.created_at ? new Date(data.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <SiteLayout>
      <article className="container-x py-16 max-w-6xl">
        {isLoading && <div className="text-muted-foreground">جاري التحميل...</div>}
        {error && <div><h1 className="text-3xl font-black text-ink mb-4">المقال غير موجود</h1><Link to="/blog" className="text-gold">العودة للمدونة</Link></div>}
        {data && (
          <>
            <Link to="/blog" className="text-gold text-sm mb-4 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> المدوّنة</Link>
            <header className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-black text-ink leading-tight">{data.title}</h1>
              {data.excerpt && <p className="mt-4 text-xl text-muted-foreground">{data.excerpt}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-y border-border py-4">
                <span className="inline-flex items-center gap-2"><User className="w-4 h-4 text-gold" /> الكاتب: <strong className="text-ink">ويفي برو</strong></span>
                {publishedDate && <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-gold" /> {publishedDate}</span>}
              </div>
            </header>
            {data.cover_url && <img src={data.cover_url} alt={data.title} className="mt-8 w-full aspect-[16/9] object-cover rounded-2xl" />}

            <div className="mt-10 grid lg:grid-cols-[1fr_280px] gap-10">
              <div>
                {toc.length > 1 && (
                  <nav aria-label="جدول المحتويات" className="lg:hidden mb-8 rounded-2xl border border-border bg-card p-5">
                    <div className="font-bold text-ink mb-3">جدول المحتويات</div>
                    <ol className="space-y-2 text-sm">
                      {toc.map((it) => (
                        <li key={it.id} className={it.level === 3 ? "ps-4" : ""}>
                          <a href={`#${it.id}`} className="text-ink/80 hover:text-gold">{it.text}</a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div ref={bodyRef} className="prose prose-lg max-w-none text-ink/85 leading-loose" dangerouslySetInnerHTML={{ __html: data.body_html || "" }} />

                {tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-gold" />
                    {tags.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-muted text-ink/80 text-sm">#{t}</span>
                    ))}
                  </div>
                )}

                <section className="mt-14" aria-labelledby="faqs">
                  <h2 id="faqs" className="text-2xl lg:text-3xl font-black text-ink">الأسئلة الشائعة</h2>
                  <div className="mt-6 space-y-3">
                    {faqs.map((f, i) => (
                      <details key={i} className="group rounded-2xl border border-border bg-card p-5 open:shadow-elegant">
                        <summary className="flex items-center justify-between cursor-pointer font-bold text-ink list-none">
                          <span>{f.q}</span>
                          <ChevronDown className="w-5 h-5 text-gold transition group-open:rotate-180" />
                        </summary>
                        <p className="mt-3 text-muted-foreground leading-loose">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>

                {suggested.length > 0 && (
                  <section className="mt-14" aria-labelledby="suggested">
                    <h2 id="suggested" className="text-2xl lg:text-3xl font-black text-ink">مقالات مقترحة</h2>
                    <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {suggested.map((a: any) => (
                        <Link key={a.id} to="/post/$slug" params={{ slug: a.slug }} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-elegant transition">
                          {a.cover_url && <img src={a.cover_url} alt={a.title} className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition" />}
                          <div className="p-5">
                            <h3 className="font-bold text-ink leading-snug group-hover:text-gold transition">{a.title}</h3>
                            {a.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {toc.length > 0 && (
                    <nav aria-label="جدول المحتويات" className="rounded-2xl border border-border bg-card p-5">
                      <div className="font-bold text-ink mb-3">جدول المحتويات</div>
                      <ol className="space-y-2 text-sm">
                        {toc.map((it) => (
                          <li key={it.id} className={it.level === 3 ? "ps-4" : ""}>
                            <a href={`#${it.id}`} className="text-ink/80 hover:text-gold transition">{it.text}</a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}
                  <div className="rounded-2xl border border-border bg-ink text-white p-5">
                    <div className="font-bold mb-2">مقايسة مجانية</div>
                    <p className="text-sm text-white/70 mb-4">احصل على عرض سعر مفصّل لستائر منزلك من ويفي برو.</p>
                    <Link to="/contact" className="inline-block px-4 py-2 rounded-full gradient-gold text-ink font-bold text-sm">تواصل معنا</Link>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </article>
    </SiteLayout>
  );
}