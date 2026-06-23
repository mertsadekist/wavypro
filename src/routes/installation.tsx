import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetail";
import { pageHead } from "@/lib/seo-head";
export const Route = createFileRoute("/installation")({
  component: () => <ServiceDetailPage slugKey="installation" fallbackTitle="تركيب الستائر" />,
  head: () => pageHead(
    "/installation",
    "تركيب الستائر بكل أنواعها — ويفي برو",
    "تركيب الستائر بأعلى احترافية: مسارات معدنية، براغي مخفية، تركيب نظيف وسريع لكل أنواع الستائر في الرياض والمملكة.",
  ),
});