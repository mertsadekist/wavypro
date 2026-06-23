/* ============================================================
 * content-loader.js
 * Loads content.json + site-content from localStorage (overrides).
 * Hydrates:
 *   1) <meta data-cms="path">      → sets content attribute
 *   2) <title data-cms="path">     → sets textContent
 *   3) <[data-cms="path"]>         → sets innerHTML or src/href based on type
 *   4) <[data-cms-attr="attr:path"]> → sets any attribute
 *   5) window.SITE                 → for chrome.js & page scripts
 * ============================================================ */
(function () {
  const STORAGE_KEY = "wavypro_content_v1";

  function deepGet(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }

  function deepMerge(target, source) {
    if (source == null) return target;
    for (const k of Object.keys(source)) {
      const sv = source[k];
      if (sv && typeof sv === "object" && !Array.isArray(sv)) {
        target[k] = deepMerge(target[k] && typeof target[k] === "object" ? target[k] : {}, sv);
      } else {
        target[k] = sv;
      }
    }
    return target;
  }

  async function fetchBase() {
    // Try live API first (MySQL-backed); fall back to static content.json
    try {
      const r = await fetch("/api/content", { cache: "no-store", credentials: "same-origin" });
      if (r.ok) {
        const txt = await r.text();
        if (txt && txt.trim()) return JSON.parse(txt);
      }
    } catch (e) {}
    try {
      const r = await fetch("/content.json", { cache: "no-store" });
      if (r.ok) return await r.json();
    } catch (e) {}
    return {};
  }

  function loadLocalOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function applyToNode(el, value) {
    if (value == null) return;
    const tag = el.tagName;

    if (tag === "META") {
      el.setAttribute("content", String(value));
      return;
    }
    if (tag === "TITLE") {
      el.textContent = String(value);
      document.title = String(value);
      return;
    }
    if (tag === "IMG") {
      el.setAttribute("src", String(value));
      return;
    }
    if (tag === "A") {
      // If value looks like a URL or starts with tel:/mailto:/#/http
      if (/^(https?:|tel:|mailto:|#|\/|[a-z0-9_-]+\.html)/i.test(String(value).trim())) {
        el.setAttribute("href", String(value));
        return;
      }
      // otherwise treat as text
      el.innerHTML = String(value);
      return;
    }
    // default: innerHTML (supports <em>, <br/>, etc. in content)
    el.innerHTML = String(value);
  }

  function hydrate(root, site) {
    // data-cms="path"
    root.querySelectorAll("[data-cms]").forEach((el) => {
      const path = el.getAttribute("data-cms");
      const v = deepGet(site, path);
      if (v !== undefined) applyToNode(el, v);
    });
    // data-cms-attr="href:site.social.instagram"  (multi: comma-separated)
    root.querySelectorAll("[data-cms-attr]").forEach((el) => {
      const spec = el.getAttribute("data-cms-attr");
      spec.split(",").forEach((pair) => {
        const [attr, path] = pair.split(":").map((s) => s && s.trim());
        if (!attr || !path) return;
        const v = deepGet(site, path);
        if (v !== undefined) el.setAttribute(attr, String(v));
      });
    });
  }

  async function boot() {
    const base = await fetchBase();
    const over = loadLocalOverrides();
    const site = over ? deepMerge(JSON.parse(JSON.stringify(base)), over) : base;
    window.SITE = site;
    window.SITE_BASE = base;

    hydrate(document, site);

    // fire event so page scripts & chrome.js can render
    document.dispatchEvent(new CustomEvent("site:ready", { detail: site }));
  }

  // Expose helpers for admin panel
  window.SiteCMS = {
    STORAGE_KEY,
    saveOverrides(obj) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    },
    loadOverrides: loadLocalOverrides,
    clearOverrides() {
      localStorage.removeItem(STORAGE_KEY);
    },
    async fetchBase() { return await fetchBase(); },
    deepMerge
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
