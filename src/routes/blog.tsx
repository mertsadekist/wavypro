import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useQuery } from "@tanstack/react-query";
import { pageHead } from "@/lib/seo-head";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => pageHead(
    "/blog",
    "مدوّنة الستائر — أدلة ومقالات | ويفي برو",
    "مقالات وأدلة احترافية عن أنواع الستائر، اختيار الأقمشة، الترتيب والعناية، وأحدث التصاميم.",
  ),
});

interface Article { id: string; slug: string; title: string; excerpt?: string; cover_url?: string; created_at: string }

function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: async () => {
      const r = await fetch("/api/articles");
      const j = await r.json();
      return (j.articles || []) as Article[];
    },
  });
  return (
    <SiteLayout>
      <section className="container-x py-16">
        <div className="max-w-3xl">
          <div className="text-gold font-semibold mb-3">المدوّنة</div>
          <h1 className="text-4xl lg:text-5xl font-black text-ink">مقالات وأفكار عن عالم الستائر</h1>
        </div>
      </section>
      <section className="container-x pb-20">
        {isLoading && <div className="text-center text-muted-foreground">جاري التحميل...</div>}
        {data && data.length === 0 && <div className="text-center text-muted-foreground py-20">لا توجد مقالات بعد.</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((a) => (
            <Link key={a.id} to="/post/$slug" params={{ slug: a.slug }} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elegant hover:border-gold transition group">
              {a.cover_url && <div className="aspect-[16/10] overflow-hidden"><img src={a.cover_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></div>}
              <div className="p-6">
                <h2 className="font-bold text-ink text-xl mb-2">{a.title}</h2>
                {a.excerpt && <p className="text-muted-foreground line-clamp-3">{a.excerpt}</p>}
                <div className="mt-4 text-sm text-gold font-semibold">قراءة المقال ←</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}