/* ============================================================
 * seo-injector.js — يحقن meta tags ديناميكياً من content.json
 * يقرأ window.SITE.seo.pages[pageKey] ويبني tags الكاملة
 * ============================================================ */
(function () {
  function tag(selector, attr, value) {
    if (value == null) return;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement(selector.startsWith("link") ? "link" : "meta");
      const m = selector.match(/\[([^=]+)="([^"]+)"\]/);
      if (m) el.setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, String(value));
  }

  function inject(pageKey) {
    const site = window.SITE || {};
    const seo = site.seo || {};
    const page = (seo.pages && seo.pages[pageKey]) || {};
    const baseUrl = (seo.baseUrl || "").replace(/\/$/, "");
    const url = baseUrl + (page.canonical || "/");
    const img = page.ogImage || seo.defaultImage || "";
    const ogImg = img.startsWith("http") ? img : (baseUrl + "/" + img.replace(/^\//, ""));
    const brand = (site.site && site.site.brand) || "ويفي برو";

    if (page.title) document.title = page.title;
    tag('meta[name="description"]', "content", page.description);
    tag('meta[name="keywords"]', "content", page.keywords);
    tag('meta[name="author"]', "content", brand);
    tag('meta[name="robots"]', "content", "index, follow, max-image-preview:large");
    tag('meta[name="theme-color"]', "content", "#5B1727");
    tag('link[rel="canonical"]', "href", url);

    tag('meta[property="og:type"]', "content", "website");
    tag('meta[property="og:site_name"]', "content", brand);
    tag('meta[property="og:locale"]', "content", "ar_SA");
    tag('meta[property="og:title"]', "content", page.title);
    tag('meta[property="og:description"]', "content", page.description);
    tag('meta[property="og:url"]', "content", url);
    tag('meta[property="og:image"]', "content", ogImg);

    tag('meta[name="twitter:card"]', "content", "summary_large_image");
    tag('meta[name="twitter:title"]', "content", page.title);
    tag('meta[name="twitter:description"]', "content", page.description);
    tag('meta[name="twitter:image"]', "content", ogImg);
  }

  window.injectSEO = function (pageKey) {
    if (window.SITE) inject(pageKey);
    else document.addEventListener("site:ready", () => inject(pageKey), { once: true });
  };
})();
