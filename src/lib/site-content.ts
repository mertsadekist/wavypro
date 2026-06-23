import { queryOptions, useQuery } from "@tanstack/react-query";

export interface NavItem { key: string; label: string; href: string }
export interface Slide { kicker?: string; title: string; sub?: string; ctaLabel?: string; ctaHref?: string; image?: string }
export interface Service { key: string; title: string; desc: string; href: string; image?: string }
export interface Curtain { slug: string; name: string; image?: string; suitableFor?: string; features?: string[]; considerations?: string }
export interface Fabric { name: string; image?: string; desc?: string }

export interface SiteContent {
  site: {
    brand: string; brandShort?: string; tagline?: string;
    phone?: string; phone2?: string; phoneRaw?: string; phone2Raw?: string;
    whatsapp?: string; email?: string;
    address?: { line1?: string; line2?: string; line3?: string };
    hours?: string;
    cities?: string[];
    warranty?: string[];
    social?: { instagram?: string; facebook?: string; tiktok?: string; whatsapp?: string };
    footerTagline?: string; footerAbout?: string; copyright?: string;
  };
  nav: NavItem[];
  home: {
    slides: Slide[];
    counters: { value: string; label: string }[];
    aboutStrip: { eyebrow: string; title: string; body: string; image1?: string; image2?: string; features: string[] };
    services: Service[];
    steps?: { title: string; desc: string }[];
    clients?: { name: string; logo?: string }[];
    worksPreview?: { image: string; caption?: string }[];
  };
  curtainsDetailed: Curtain[];
  quickPicker?: { need: string; types: string }[];
  fabrics?: Fabric[];
  fabrication?: ServicePage;
  installation?: ServicePage;
  maintenance?: ServicePage;
  measurement?: ServicePage;
  consultation?: ServicePage;
  about?: AboutPage;
  contact?: ContactPage;
  works?: WorksPage;
}

export interface ServicePage {
  kicker?: string; title: string; intro?: string; body?: string;
  ctaLabel?: string; ctaHref?: string; image?: string;
  audience?: { title: string; desc: string }[];
  features?: { title: string; desc: string }[];
  steps?: { title: string; desc: string }[];
  includes?: string[];
  details?: string[];
  whyUs?: string[];
  benefits?: string[];
  suitableFor?: string[];
  preReview?: string[];
  checklist?: string[];
  spaces?: { title: string; desc: string }[];
  spaceRecs?: { space: string; rec: string }[];
}
export interface AboutPage {
  title?: string; intro?: string; body?: string; image?: string;
  vision?: { title: string; desc: string };
  mission?: { title: string; desc: string };
  values?: { title: string; desc: string }[];
}
export interface ContactPage { title?: string; intro?: string; mapEmbed?: string }
export interface WorksPage { title?: string; intro?: string; gallery?: { image: string; caption?: string }[] }

export const siteContentQuery = queryOptions<SiteContent>({
  queryKey: ["site-content"],
  queryFn: async () => {
    const res = await fetch("/api/content");
    if (!res.ok) throw new Error("Failed to load site content");
    return res.json();
  },
  staleTime: 30_000,
});

export function useSiteContent() {
  return useQuery(siteContentQuery);
}

/** Convert old HTML-style hrefs (`about.html`) to React routes (`/about`). */
export function toRoute(href?: string): string {
  if (!href) return "/";
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return href;
  const clean = href.replace(/\.html$/, "");
  if (clean === "index") return "/";
  return "/" + clean;
}

/** Convert relative asset paths to absolute (from /public). */
export function asset(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return "/" + path;
}