import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Menu, X, Instagram, Facebook, Clock, MessageCircle, ChevronDown } from "lucide-react";
import { useSiteContent, toRoute, asset } from "@/lib/site-content";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.86a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24Z"/>
    </svg>
  );
}

function Header() {
  const { data } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const site = data?.site;
  const curtains = data?.curtainsDetailed ?? [];

  type NavLeaf = { label: string; to: string };
  type NavItem = NavLeaf | { label: string; key: string; children: NavLeaf[]; to?: string };

  const mainNav: NavItem[] = [
    { label: "الرئيسية", to: "/" },
    { label: "من نحن", to: "/about" },
    {
      label: "أنواع الستائر",
      key: "curtains",
      to: "/services",
      children: [
        { label: "كل الأنواع", to: "/services" },
        ...curtains.slice(0, 10).map((c: any) => ({ label: c.name, to: `/curtains/${c.slug}` })),
      ],
    },
    {
      label: "خدماتنا",
      key: "services",
      children: [
        { label: "التفصيل", to: "/fabrication" },
        { label: "التركيب", to: "/installation" },
        { label: "الصيانة", to: "/maintenance" },
        { label: "المقايسة", to: "/measurement" },
        { label: "الاستشارات", to: "/consultation" },
      ],
    },
    { label: "أعمالنا", to: "/works" },
    { label: "المدوّنة", to: "/blog" },
    { label: "تواصل", to: "/contact" },
  ];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setOpenGroup(null);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
      {/* Top utility bar */}
      <div className="hidden md:block bg-ink text-white/80 text-xs">
        <div className="container-x flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            {site?.phone && (
              <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-1.5 hover:text-gold transition" dir="ltr">
                <Phone className="w-3.5 h-3.5 text-gold" /> {site.phone}
              </a>
            )}
            {site?.email && (
              <a href={`mailto:${site.email}`} className="hidden lg:flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3.5 h-3.5 text-gold" /> {site.email}
              </a>
            )}
            {site?.hours && (
              <span className="hidden lg:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold" /> {site.hours}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {site?.social?.instagram && <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-gold"><Instagram className="w-3.5 h-3.5" /></a>}
            {site?.social?.facebook && <a href={site.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-gold"><Facebook className="w-3.5 h-3.5" /></a>}
            {site?.social?.tiktok && <a href={site.social.tiktok} target="_blank" rel="noopener" aria-label="TikTok" className="hover:text-gold"><TikTokIcon className="w-3.5 h-3.5" /></a>}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex items-center justify-between h-20 gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/uploads/wavy-logo.png" alt={site?.brand || "Wavy Pro"} className="h-14 w-auto" />
          <div className="hidden sm:block">
            <div className="font-bold text-ink text-lg leading-tight">{site?.brandShort || "ويفي برو"}</div>
            <div className="text-xs text-muted-foreground">{site?.tagline}</div>
          </div>
        </Link>

        <nav ref={groupRef} className="hidden lg:flex items-center gap-0.5">
          {mainNav.map((item, i) => {
            if (!("children" in item) || !item.children) {
              return (
                <Link
                  key={i}
                  to={(item as NavLeaf).to}
                  className="px-3 py-2 text-sm text-ink hover:text-gold transition-colors font-medium rounded-md"
                  activeProps={{ className: "text-gold bg-gold/5" }}
                  activeOptions={{ exact: (item as NavLeaf).to === "/" }}
                >
                  {item.label}
                </Link>
              );
            }
            const isOpen = openGroup === item.key;
            return (
              <div key={item.key} className="relative">
                <button
                  onClick={() => setOpenGroup(isOpen ? null : item.key!)}
                  className="px-3 py-2 text-sm text-ink hover:text-gold transition-colors font-medium rounded-md inline-flex items-center gap-1"
                >
                  {item.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-background border border-border rounded-xl shadow-xl py-2 z-50">
                    {item.children.map((c, j) => (
                      <Link
                        key={j}
                        to={c.to}
                        onClick={() => setOpenGroup(null)}
                        className="block px-4 py-2 text-sm text-ink hover:bg-gold/10 hover:text-gold transition"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {site?.whatsapp && (
            <a href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:opacity-90 transition" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
          )}
          {site?.phoneRaw && (
            <a href={`tel:${site.phoneRaw}`} className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-gold text-ink font-semibold text-sm hover:opacity-90 transition">
              <Phone className="w-4 h-4" /> اتصل بنا
            </a>
          )}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-ink" aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <div className="container-x py-4 flex flex-col gap-1">
            {mainNav.map((item, i) => {
              if (!("children" in item) || !item.children) {
                return (
                  <Link key={i} to={(item as NavLeaf).to} onClick={() => setOpen(false)} className="px-3 py-2.5 text-ink hover:text-gold font-medium border-b border-border/50">
                    {item.label}
                  </Link>
                );
              }
              const isOpen = mobileGroup === item.key;
              return (
                <div key={item.key} className="border-b border-border/50">
                  <button onClick={() => setMobileGroup(isOpen ? null : item.key!)} className="w-full flex items-center justify-between px-3 py-2.5 text-ink hover:text-gold font-medium">
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-2 pr-4 flex flex-col">
                      {item.children.map((c, j) => (
                        <Link key={j} to={c.to} onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-gold">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {site?.phoneRaw && (
              <a href={`tel:${site.phoneRaw}`} className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full gradient-gold text-ink font-semibold">
                <Phone className="w-4 h-4" /> {site.phone}
              </a>
            )}
            {site?.whatsapp && (
              <a href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-semibold">
                <MessageCircle className="w-4 h-4" /> واتساب
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { data } = useSiteContent();
  const s = data?.site;
  const nav = data?.nav ?? [];
  const curtains = data?.curtainsDetailed ?? [];
  return (
    <footer className="bg-ink text-white/90 mt-24">
      <div className="container-x py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="text-2xl font-bold text-gold mb-4" dangerouslySetInnerHTML={{ __html: s?.footerTagline || "" }} />
          <p className="text-white/70 leading-relaxed max-w-md">{s?.footerAbout}</p>
          <div className="flex gap-3 mt-6">
            {s?.social?.instagram && <a href={s.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-gold hover:text-ink hover:border-gold transition"><Instagram className="w-4 h-4" /></a>}
            {s?.social?.facebook && <a href={s.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-gold hover:text-ink hover:border-gold transition"><Facebook className="w-4 h-4" /></a>}
            {s?.social?.tiktok && <a href={s.social.tiktok} target="_blank" rel="noopener" aria-label="TikTok" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-gold hover:text-ink hover:border-gold transition"><TikTokIcon /></a>}
            {s?.social?.whatsapp && <a href={s.social.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition"><MessageCircle className="w-4 h-4" /></a>}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">أنواع الستائر</h4>
          <ul className="space-y-2">
            {curtains.slice(0, 8).map((c) => (
              <li key={c.slug}><Link to="/curtains/$slug" params={{ slug: c.slug }} className="text-white/70 hover:text-gold text-sm">{c.name}</Link></li>
            ))}
            <li><Link to="/services" className="text-gold/90 hover:text-gold text-sm font-semibold">عرض كل الأنواع ←</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
          <ul className="space-y-2">
            {nav.slice(0, 6).map((n) => (
              <li key={n.key}><Link to={toRoute(n.href)} className="text-white/70 hover:text-gold text-sm">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">تواصل</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {s?.phone && <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-1 text-gold shrink-0" /><a href={`tel:${s.phoneRaw}`} dir="ltr">{s.phone}</a></li>}
            {s?.phone2 && <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-1 text-gold shrink-0" /><a href={`tel:${s.phone2Raw}`} dir="ltr">{s.phone2}</a></li>}
            {s?.email && <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-1 text-gold shrink-0" /><a href={`mailto:${s.email}`}>{s.email}</a></li>}
            {s?.address && <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 text-gold shrink-0" /><span>{[s.address.line1, s.address.line2, s.address.line3].filter(Boolean).join(" — ")}</span></li>}
            {s?.hours && <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-1 text-gold shrink-0" /><span>{s.hours}</span></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-white/50 text-sm">{s?.copyright}</div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data } = useSiteContent();
  const wa = data?.site?.whatsapp;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {wa && (
        <a
          href={`https://wa.me/${wa.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener"
          aria-label="تواصل واتساب"
          className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl hover:scale-110 transition animate-pulse-slow"
          style={{ boxShadow: "0 10px 30px -5px rgba(37,211,102,0.5)" }}
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        </a>
      )}
    </div>
  );
}

export { asset };