import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetail";
import { pageHead } from "@/lib/seo-head";
export const Route = createFileRoute("/fabrication")({
  component: () => <ServiceDetailPage slugKey="fabrication" fallbackTitle="تفصيل الستائر" />,
  head: () => pageHead(
    "/fabrication",
    "تفصيل الستائر بالمقاس في الرياض — ويفي برو",
    "خدمة تفصيل الستائر حسب مقاس النوافذ بأجود الأقمشة، مع توصيات للأقمشة المعتمة والشفافة وتنفيذ احترافي.",
  ),
});