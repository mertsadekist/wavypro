import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSiteContent, asset } from "@/lib/site-content";
import { pageHead } from "@/lib/seo-head";

export const Route = createFileRoute("/works")({
  component: WorksPage,
  head: () => pageHead(
    "/works",
    "أعمالنا في تركيب وتفصيل الستائر — ويفي برو",
    "معرض مشاريعنا في تفصيل وتركيب الستائر للفلل والشقق والمكاتب في الرياض ومدن المملكة بمختلف الأنواع والأقمشة.",
  ),
});

function WorksPage() {
  const { data } = useSiteContent();
  const w = data?.works;
  const gallery = w?.gallery ?? data?.curtainsDetailed?.map((c) => ({ image: c.image || "", caption: c.name })) ?? [];
  return (
    <SiteLayout>
      <section className="container-x py-16">
        <div className="max-w-3xl">
          <div className="text-gold font-semibold mb-3">أعمالنا</div>
          <h1 className="text-4xl lg:text-5xl font-black text-ink">{w?.title || "مختارات من تنفيذنا"}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{w?.intro || "مجموعة من مشاريعنا في الرياض وجميع مدن المملكة."}</p>
        </div>
      </section>
      <section className="container-x pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((g, i) => (
          <figure key={i} className="group">
            <div className="aspect-square overflow-hidden rounded-2xl">
              {g.image && <img src={asset(g.image)} alt={g.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />}
            </div>
            {g.caption && <figcaption className="mt-3 font-bold text-ink">{g.caption}</figcaption>}
          </figure>
        ))}
      </section>
    </SiteLayout>
  );
}