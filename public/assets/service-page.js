/* ============================================================
 * service-page.js — renders a service detail page from content.json
 * Each page sets <body data-svc="fabrication|installation|maintenance|measurement|consultation">
 * and includes a <main id="svc-root"></main>
 * ============================================================ */
(function () {
  function esc(s) {
    return String(s == null ? "" : s);
  }

  function heroImageFor(key, site) {
    const map = {
      fabrication: "assets/images/curtains/wave.jpg",
      installation: "assets/images/team.jpg",
      maintenance: "assets/images/about-quote.jpg",
      measurement: "assets/images/hero-2.jpg",
      consultation: "assets/images/curtains/roman.jpg",
    };
    return map[key] || "assets/images/hero-1.jpg";
  }

  function listGrid(items) {
    if (!items || !items.length) return "";
    return `<ul class="svc-list-grid">${items.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
  }

  function audienceGrid(items) {
    if (!items || !items.length) return "";
    return `<div class="svc-aud-grid">${items.map((a, i) => `
      <div class="svc-aud">
        <div class="num">${String(i + 1).padStart(2, "0")} —</div>
        <h4>${esc(a.title)}</h4>
        ${a.desc ? `<p>${esc(a.desc)}</p>` : ""}
      </div>`).join("")}</div>`;
  }

  function spacesGrid(items) {
    if (!items || !items.length) return "";
    return `<div class="svc-spaces">${items.map(s => `
      <div class="sp"><h4>${esc(s.title)}</h4><p>${esc(s.desc)}</p></div>`).join("")}</div>`;
  }

  function pillRow(items) {
    if (!items || !items.length) return "";
    return `<div class="svc-pills">${items.map(t => `<span class="svc-pill">${esc(t)}</span>`).join("")}</div>`;
  }

  function spaceRecs(items) {
    if (!items || !items.length) return "";
    return `<div class="svc-aud-grid">${items.map((a, i) => `
      <div class="svc-aud">
        <div class="num">${String(i + 1).padStart(2, "0")} —</div>
        <h4>${esc(a.space)}</h4><p>${esc(a.rec)}</p>
      </div>`).join("")}</div>`;
  }

  function ctaStrip(data) {
    const label = data.ctaLabel || "احجز الآن";
    const href = data.ctaHref || "contact.html";
    return `
      <section class="svc-cta">
        <div class="svc-wrap">
          <h2>${esc(label)}</h2>
          <p>تواصل مع فريق ويفي برو الآن، واحصل على خدمة موثوقة بمعايير عالية تليق بقيمة مكانك.</p>
          <a class="btn" href="${esc(href)}">${esc(label)} ←</a>
        </div>
      </section>`;
  }

  function render(key) {
    const site = window.SITE || {};
    const data = site[key];
    if (!data) return;
    const root = document.getElementById("svc-root");
    if (!root) return;
    const heroImg = data.heroImage || heroImageFor(key, site);

    let html = "";

    // ===== Hero =====
    html += `
      <section class="svc-hero">
        <div class="svc-hero-wrap">
          <div>
            <span class="eyebrow">${esc(data.kicker || "خدماتنا")}</span>
            <h1>${data.title || ""}</h1>
            <p class="lead">${esc(data.intro || "")}</p>
            ${data.body ? `<p>${esc(data.body)}</p>` : ""}
            <a class="btn cta" href="${esc(data.ctaHref || "contact.html")}">${esc(data.ctaLabel || "احجز الآن")} ←</a>
          </div>
          <div class="svc-hero-media"><img src="${esc(heroImg)}" alt=""/></div>
        </div>
      </section>`;

    // ===== Audience =====
    if (data.audience && data.audience.length) {
      html += `<section class="svc-block alt"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">لمن صُممت هذه الخدمة</span>
          <h2>خدمة <em>تليق</em> بكل مساحة</h2>
        </div>
        ${audienceGrid(data.audience)}
      </div></section>`;
    }

    // ===== Spaces (installation only) =====
    if (data.spaces && data.spaces.length) {
      html += `<section class="svc-block"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">تركيب يراعي شكل المكان</span>
          <h2>كل مساحة تحتاج <em>طريقة مختلفة</em></h2>
        </div>
        ${spacesGrid(data.spaces)}
        ${data.preReview && data.preReview.length ? `
          <div style="margin-top:60px;text-align:center;">
            <span class="eyebrow" style="display:block;margin-bottom:14px;">قبل التنفيذ نراجع</span>
            ${pillRow(data.preReview)}
          </div>` : ""}
      </div></section>`;
    }

    // ===== Includes =====
    if (data.includes && data.includes.length) {
      html += `<section class="svc-block ${data.spaces ? 'alt' : ''}"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">ماذا تشمل الخدمة</span>
          <h2>تنفيذ <em>منظم</em> من البداية للنهاية</h2>
        </div>
        ${listGrid(data.includes)}
      </div></section>`;
    }

    // ===== Checklist (installation) =====
    if (data.checklist && data.checklist.length) {
      html += `<section class="svc-block alt"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">خطوات التركيب</span>
          <h2>سبع خطوات <em>تصنع الفرق</em></h2>
        </div>
        ${listGrid(data.checklist)}
      </div></section>`;
    }

    // ===== Benefits =====
    if (data.benefits && data.benefits.length) {
      html += `<section class="svc-block"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">${key === 'maintenance' ? 'لماذا العناية بعد التركيب؟' : 'لماذا تبدأ بالمقايسة؟'}</span>
          <h2>قرار <em>أذكى</em> ونتيجة أدق</h2>
        </div>
        ${listGrid(data.benefits)}
      </div></section>`;
    }

    // ===== Details (fabrication only) =====
    if (data.details && data.details.length) {
      html += `<section class="svc-block alt"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">تفاصيل صغيرة تصنع فرقاً كبيراً</span>
          <h2>اللمسات التي <em>تُحس قبل أن تُلاحَظ</em></h2>
        </div>
        ${listGrid(data.details)}
      </div></section>`;
    }

    // ===== WhyUs (fabrication) =====
    if (data.whyUs && data.whyUs.length) {
      html += `<section class="svc-block"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">لماذا ويفي برو</span>
          <h2>خبرة <em>تُترجم</em> إلى نتيجة</h2>
        </div>
        ${listGrid(data.whyUs)}
      </div></section>`;
    }

    // ===== Space Recommendations (consultation) =====
    if (data.spaceRecs && data.spaceRecs.length) {
      html += `<section class="svc-block alt"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">نرشح الستارة المناسبة لكل مساحة</span>
          <h2>توصيات <em>مدروسة</em> حسب المكان</h2>
        </div>
        ${spaceRecs(data.spaceRecs)}
      </div></section>`;
    }

    // ===== Suitable For (installation) =====
    if (data.suitableFor && data.suitableFor.length) {
      html += `<section class="svc-block"><div class="svc-wrap">
        <div class="svc-head">
          <span class="eyebrow">مناسب لكل المساحات</span>
          <h2>نخدم <em>كل القطاعات</em></h2>
        </div>
        ${pillRow(data.suitableFor)}
      </div></section>`;
    }

    // ===== Final CTA =====
    html += ctaStrip(data);

    root.innerHTML = html;
  }

  window.renderServicePage = function (key) {
    if (window.SITE) render(key);
    else document.addEventListener("site:ready", () => render(key), { once: true });
  };
})();
