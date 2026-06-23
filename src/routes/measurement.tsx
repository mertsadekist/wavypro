import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetail";
import { pageHead } from "@/lib/seo-head";
export const Route = createFileRoute("/measurement")({
  component: () => <ServiceDetailPage slugKey="measurement" fallbackTitle="مقايسة الستائر" />,
  head: () => pageHead(
    "/measurement",
    "مقايسة مجانية للستائر — ويفي برو",
    "احجز زيارة مقايسة مجانية في الرياض ومدن المملكة. فريقنا يأتي إليكم لقياس النوافذ وعرض عينات الأقمشة بدون التزام.",
  ),
});