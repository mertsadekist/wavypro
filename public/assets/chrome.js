/* Shared chrome: nav + footer + side rail — reads from window.SITE (content.json) */
function navHTML(active, site) {
  const brand = (site && site.site && site.site.brandShort) || "ويفي برو";

  // Build menu structure: top-level items + dropdowns (services, types)
  // The dropdowns are hard-defined here so the design stays consistent;
  // the rest of the nav can still come from CMS if needed.
  const types = (site && site.home && Array.isArray(site.home.curtainTypes))
    ? site.home.curtainTypes
    : null;

  // Curtain types submenu (from content.json if available, fallback to defaults)
  const typesItems = types && types.length
    ? types.slice(0, 13).map(t => ({
        label: t.name || t.title || t.label,
        href: "services.html#" + (t.slug || t.key || "")
      }))
    : [
        { label: "الستائر الأمريكية", href: "services.html#american" },
        { label: "ستائر الويفي (Wave)", href: "services.html#wave" },
        { label: "ستائر الرول", href: "services.html#roll" },
        { label: "ستائر الزيبرا", href: "services.html#zebra" },
        { label: "ستائر البلاك أوت", href: "services.html#blackout" },
        { label: "الستائر الخشبية", href: "services.html#wood" },
        { label: "ستائر الشتر", href: "services.html#shutter" },
        { label: "ستائر السكاي لايت", href: "services.html#skylight" },
        { label: "الستائر المعدنية", href: "services.html#metal" },
        { label: "ستائر المسرح", href: "services.html#theater" },
        { label: "الستائر الكلاسيكية", href: "services.html#classic" },
        { label: "الستائر العازلة", href: "services.html#thermal" },
        { label: "ستائر الشيفون", href: "services.html#chiffon" },
      ];

  // Services submenu — five core service pages
  const servicesItems = [
    { label: "تفصيل الستائر",   href: "fabrication.html",  desc: "تفصيل احترافي في ورشنا الخاصة" },
    { label: "تركيب الستائر",   href: "installation.html", desc: "فريق تركيب متخصص خلال 3 أيام" },
    { label: "صيانة الستائر",   href: "maintenance.html",  desc: "صيانة دورية وضمان مدى الحياة" },
    { label: "المقايسة",         href: "measurement.html",  desc: "زيارة وقياس مجاني للمساحة" },
    { label: "الاستشارات",       href: "consultation.html", desc: "استشارات تصميم وتنسيق الديكور" },
  ];

  // Top-level menu structure
  const menu = [
    { id: "home",     label: "الرئيسية",       href: "index.html" },
    { id: "about",    label: "من نحن",         href: "about.html" },
    {
      id: "services",
      label: "أنواع الستائر",
      href: "services.html",
      mega: { kind: "types", items: typesItems }
    },
    {
      id: "our-services",
      label: "خدماتنا",
      href: "#",
      mega: { kind: "services", items: servicesItems }
    },
    { id: "works",    label: "أعمالنا",        href: "works.html" },
    { id: "blog",     label: "المدوّنة",       href: "blog.html" },
    { id: "contact",  label: "تواصل",          href: "contact.html" },
  ];

  // Render — items with `mega` get a dropdown
  const links = menu.map(item => {
    const activeCls = item.id === active ? "active" : "";

    if (!item.mega) {
      return `<div class="nav-item">
        <a href="${item.href}" class="${activeCls}">${item.label}</a>
      </div>`;
    }

    // Dropdown rendering
    if (item.mega.kind === "types") {
      // Two-column compact list of types
      const cols = item.mega.items.map(t =>
        `<a class="mega-link" href="${t.href}">
          <span class="mega-link-dot"></span>
          <span>${t.label}</span>
        </a>`
      ).join("");
      return `<div class="nav-item nav-item-mega">
        <a href="${item.href}" class="${activeCls} has-caret">
          ${item.label}
          <svg class="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </a>
        <div class="mega-panel mega-panel-types">
          <div class="mega-head">
            <div class="mega-title">13 نوعاً من الستائر</div>
            <div class="mega-sub">اختر النوع الأنسب لمساحتك — من الكلاسيكي إلى العصري</div>
          </div>
          <div class="mega-grid mega-grid-types">${cols}</div>
          <div class="mega-foot">
            <a href="services.html" class="mega-foot-link">
              عرض كل الأنواع تفصيلياً
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </a>
          </div>
        </div>
      </div>`;
    }

    if (item.mega.kind === "services") {
      const cols = item.mega.items.map(s =>
        `<a class="mega-card" href="${s.href}">
          <div class="mega-card-title">${s.label}</div>
          <div class="mega-card-desc">${s.desc}</div>
          <svg class="mega-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </a>`
      ).join("");
      return `<div class="nav-item nav-item-mega">
        <a href="${item.href}" class="${activeCls} has-caret" onclick="return false;">
          ${item.label}
          <svg class="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </a>
        <div class="mega-panel mega-panel-services">
          <div class="mega-head">
            <div class="mega-title">خدماتنا الخمس</div>
            <div class="mega-sub">من المقايسة حتى الصيانة — فريق واحد يهتم بكل تفصيلة</div>
          </div>
          <div class="mega-grid mega-grid-services">${cols}</div>
        </div>
      </div>`;
    }

    return "";
  }).join("");

  return `
    <nav class="nav">
      <div class="nav-inner">
        <a href="index.html" class="logo">
          <img src="assets/logo.png" alt="${brand}" style="height: 56px; width: auto; display: block;"/>
        </a>
        <div class="nav-links">
          ${links}
        </div>
        <div class="nav-right">
          <a href="contact.html" class="nav-cta">مقايسة مجانية</a>
          <button class="nav-burger" aria-label="القائمة" onclick="document.body.classList.toggle('mobile-nav-open')">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

function footerHTML(active, site) {
  const s = (site && site.site) || {};
  const brand = s.brandShort || "ويفي برو";
  const tagline = s.footerTagline || "نحوّل مساحتكم<br/>إلى إلهام";
  const about = s.footerAbout || "";
  const addr = s.address || {};
  const phone = s.phone || "";
  const phoneRaw = s.phoneRaw || "";
  const email = s.email || "";
  const hours = s.hours || "";
  const social = s.social || {};
  const copyright = s.copyright || "";
  const phone2 = s.phone2 || "";
  const emailHref = email ? `mailto:${email}` : "#";
  const whatsappHref = social.whatsapp || "#";
  const igHref = social.instagram || "#";
  const fbHref = social.facebook || "#";
  const tkHref = social.tiktok || "#";

  // Curtain types for footer (from CMS or defaults)
  const footerTypes = [
    { label: "الستائر الأمريكية", href: "services.html#american" },
    { label: "ستائر الويفي", href: "services.html#wave" },
    { label: "ستائر الرول", href: "services.html#roll" },
    { label: "ستائر البلاك أوت", href: "services.html#blackout" },
    { label: "ستائر الزيبرا", href: "services.html#zebra" },
    { label: "الستائر الخشبية", href: "services.html#wood" },
    { label: "ستائر الشتر", href: "services.html#shutter" },
    { label: "ستائر المسرح", href: "services.html#theater" },
  ];
  const typeLinks = footerTypes.map(t => `<a href="${t.href}">${t.label}</a>`).join("");

  return `
    <footer class="footer">
      <div class="footer-gold-line"></div>
      <div class="footer-grid">
        <div>
          <img src="assets/logo.png" alt="${brand}" style="height: 90px; width: auto; display: block; margin-bottom: 28px;"/>
          <h3>${tagline}</h3>
          <p style="max-width: 360px;">${about}</p>
          <div class="social">
            <a href="${igHref}" aria-label="Instagram" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="${fbHref}" aria-label="Facebook" target="_blank" rel="noopener">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="${tkHref}" aria-label="TikTok" target="_blank" rel="noopener">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.971-1.166-1.956-1.282-2.645h.004C16.368 1.06 16.4 0 16.4 0h-3.4v13.174c0 .207 0 .41-.008.612.001.025-.001.048-.003.075v.008a3.386 3.386 0 01-.15 1.04 3.395 3.395 0 01-3.229 2.31A3.393 3.393 0 019.61 10.43a3.397 3.397 0 011.34-.044V6.925a6.79 6.79 0 00-5.252 1.988 7.165 7.165 0 00-1.588 2.2 6.784 6.784 0 00-.684 2.929c-.043 1.82.642 3.584 1.903 4.902a6.972 6.972 0 002.3 1.619 7.086 7.086 0 003.1.698c2.066-.003 4.048-.823 5.51-2.282a7.758 7.758 0 002.284-5.508V7.65a9.29 9.29 0 003.432 1.088V5.338c-.78.101-1.57-.02-2.287-.349l.653.573z"/></svg>
            </a>
            <a href="${whatsappHref}" aria-label="WhatsApp" target="_blank" rel="noopener">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.84 12.84 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4>أنواع الستائر</h4>
          <div class="footer-types">${typeLinks}</div>
        </div>

        <div>
          <h4>تواصل معنا</h4>
          <p>
            <a href="${emailHref}">${email}</a><br/>
            <strong style="color: var(--white);">${phone}</strong><br/>
            ${phone2 ? `<strong style="color: var(--white);">${phone2}</strong><br/>` : ""}
            <span style="color: var(--gold-light); font-size: 12px;">${hours}</span>
          </p>
          <p style="margin-top:16px;">
            ${addr.line2 || ""}<br/>${addr.line3 || ""}
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="links">
          <a href="about.html" class="${active==='about'?'active':''}">من نحن</a>
          <a href="works.html" class="${active==='works'?'active':''}">أعمالنا</a>
          <a href="contact.html" class="${active==='contact'?'active':''}">تواصل معنا</a>
        </div>
        <div>${copyright}</div>
      </div>
    </footer>
  `;
}

function sideRailHTML(site) {
  const s = (site && site.site) || {};
  const wa = (s.social && s.social.whatsapp) || "https://wa.me/966510250908";
  const tel = s.phoneRaw ? `tel:${s.phoneRaw.replace(/\s/g, "")}` : "tel:+966510250908";
  return `
    <a class="float-wa" href="${wa}" target="_blank" rel="noopener" aria-label="تواصل واتساب">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.84 12.84 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>
      <span class="float-wa-pulse"></span>
    </a>
    <div class="side-rail">
      <a href="${tel}" aria-label="اتصل بنا">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
      </a>
      <a href="contact.html" aria-label="مقايسة مجانية">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </a>
    </div>
  `;
}

function doRenderChrome(active) {
  const site = window.SITE || {};
  const navSlot = document.getElementById("nav-slot");
  const footerSlot = document.getElementById("footer-slot");
  const railSlot = document.getElementById("rail-slot");
  if (navSlot) navSlot.innerHTML = navHTML(active, site);
  if (footerSlot) footerSlot.innerHTML = footerHTML(active, site);
  if (railSlot) railSlot.innerHTML = sideRailHTML(site);
}

window.renderChrome = function(active) {
  // If SITE is already hydrated, render immediately; otherwise wait.
  if (window.SITE) {
    doRenderChrome(active);
  } else {
    document.addEventListener("site:ready", () => doRenderChrome(active), { once: true });
  }
};
