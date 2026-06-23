import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetail";
import { pageHead } from "@/lib/seo-head";
export const Route = createFileRoute("/consultation")({
  component: () => <ServiceDetailPage slugKey="consultation" fallbackTitle="استشارات اختيار الستائر" />,
  head: () => pageHead(
    "/consultation",
    "استشارات اختيار الستائر والأقمشة — ويفي برو",
    "استشارة متخصصة لاختيار نوع الستائر والقماش الأنسب لكل غرفة، تنسيق مع ألوان الديكور، وحلول عملية للخصوصية والإضاءة.",
  ),
});