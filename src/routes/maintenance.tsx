import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetail";
import { pageHead } from "@/lib/seo-head";
export const Route = createFileRoute("/maintenance")({
  component: () => <ServiceDetailPage slugKey="maintenance" fallbackTitle="صيانة الستائر" />,
  head: () => pageHead(
    "/maintenance",
    "صيانة وإصلاح الستائر في الرياض — ويفي برو",
    "صيانة الستائر التالفة، تبديل المسارات والبكر، غسيل وكي احترافي للأقمشة، وإعادة تفصيل القطع المتضررة.",
  ),
});