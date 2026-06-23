/* ============================================================
 * blog.js — منطق المدوّنة (قائمة + مقال منفرد)
 * يقرأ window.SITE.blog ويعرض حسب نوع الصفحة
 * ============================================================ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fmtDate = (d) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return d; }
  };

  // ============================================================
  // BLOG LIST PAGE
  // ============================================================
  function renderList() {
    const blog = (window.SITE && window.SITE.blog) || {};
    const settings = blog.settings || {};
    const cats = blog.categories || [];
    const allPosts = (blog.posts || []).slice().sort((a, b) =>
      (b.date || "").localeCompare(a.date || ""));

    // Hero
    $("#blog-hero-title").innerHTML = settings.title || "مدوّنة <em>ويفي برو</em>";
    $("#blog-hero-sub").textContent = settings.subtitle || "";

    // Featured (first featured post, fallback to first post)
    const featured = allPosts.find(p => p.featured) || allPosts[0];
    const slot = $("#blog-featured-slot");
    if (featured && slot) {
      const cat = cats.find(c => c.slug === featured.category);
      slot.innerHTML = `
        <article class="blog-featured-wrap">
          <a class="img" href="post.html?slug=${encodeURIComponent(featured.slug)}">
            <img src="${esc(featured.cover || "assets/images/hero-1.jpg")}" alt="${esc(featured.title)}" loading="lazy"/>
          </a>
          <div class="info">
            <span class="tag">${esc((cat && cat.name) || "مميّز")}</span>
            <h2><a href="post.html?slug=${encodeURIComponent(featured.slug)}">${esc(featured.title)}</a></h2>
            <p>${esc(featured.excerpt || "")}</p>
            <div class="meta">
              <span>${fmtDate(featured.date)}</span>
              <span>${esc(featured.author || "ويفي برو")}</span>
              <span>${featured.readingMinutes || 5} د قراءة</span>
            </div>
            <a class="btn" href="post.html?slug=${encodeURIComponent(featured.slug)}">اقرأ المقال ←</a>
          </div>
        </article>`;
    }

    // Categories
    const catBox = $("#blog-cats");
    if (catBox && cats.length) {
      catBox.innerHTML = `
        <button class="blog-cat active" data-cat="all">الكل</button>
        ${cats.map(c => `<button class="blog-cat" data-cat="${esc(c.slug)}">${esc(c.name)}</button>`).join("")}`;
    }

    // State
    let activeCat = "all";
    let query = "";
    let page = 1;
    const perPage = settings.perPage || 9;

    function filtered() {
      // exclude the featured post from grid (already shown)
      let arr = allPosts.filter(p => !featured || p.slug !== featured.slug);
      if (activeCat !== "all") arr = arr.filter(p => p.category === activeCat);
      if (query) {
        const q = query.toLowerCase();
        arr = arr.filter(p =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.excerpt || "").toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
        );
      }
      return arr;
    }

    function cardHTML(p) {
      const cat = cats.find(c => c.slug === p.category);
      return `
        <article class="blog-card">
          <a class="img" href="post.html?slug=${encodeURIComponent(p.slug)}">
            <img src="${esc(p.cover || "assets/images/hero-1.jpg")}" alt="${esc(p.title)}" loading="lazy"/>
            ${cat ? `<span class="cat">${esc(cat.name)}</span>` : ""}
          </a>
          <h3><a href="post.html?slug=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
          <p>${esc(p.excerpt || "")}</p>
          <div class="meta">
            <span>${fmtDate(p.date)}</span>
            <span>${p.readingMinutes || 5} د قراءة</span>
          </div>
        </article>`;
    }

    function renderGrid() {
      const arr = filtered();
      const total = Math.max(1, Math.ceil(arr.length / perPage));
      if (page > total) page = total;
      const slice = arr.slice((page - 1) * perPage, page * perPage);
      const grid = $("#blog-grid");
      if (!arr.length) {
        grid.innerHTML = `
          <div class="blog-empty" style="grid-column:1/-1">
            <h3>لا توجد مقالات مطابقة</h3>
            <p>جرّب تغيير الفئة أو مسح كلمة البحث.</p>
          </div>`;
      } else {
        grid.innerHTML = slice.map(cardHTML).join("");
      }
      // Pager
      const pager = $("#blog-pager");
      if (total <= 1) { pager.innerHTML = ""; return; }
      let html = `<button data-go="prev" ${page === 1 ? "disabled" : ""}>السابق</button>`;
      for (let i = 1; i <= total; i++) {
        html += `<button data-go="${i}" class="${i === page ? "active" : ""}">${i}</button>`;
      }
      html += `<button data-go="next" ${page === total ? "disabled" : ""}>التالي</button>`;
      pager.innerHTML = html;
    }

    // events
    $("#blog-cats").addEventListener("click", (e) => {
      const b = e.target.closest(".blog-cat");
      if (!b) return;
      $$(".blog-cat").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      activeCat = b.dataset.cat;
      page = 1;
      renderGrid();
    });
    const searchInput = $("#blog-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        query = e.target.value.trim();
        page = 1;
        renderGrid();
      });
    }
    $("#blog-pager").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-go]");
      if (!b) return;
      const v = b.dataset.go;
      const total = Math.ceil(filtered().length / perPage);
      if (v === "prev") page = Math.max(1, page - 1);
      else if (v === "next") page = Math.min(total, page + 1);
      else page = parseInt(v, 10) || 1;
      renderGrid();
      window.scrollTo({ top: $("#blog-list").offsetTop - 80, behavior: "smooth" });
    });

    renderGrid();
  }

  // ============================================================
  // POST PAGE
  // ============================================================
  function bodyToHTML(blocks) {
    if (!Array.isArray(blocks)) return "";
    return blocks.map(b => {
      if (b.type === "p") return `<p>${esc(b.text)}</p>`;
      if (b.type === "h2") return `<h2>${esc(b.text)}</h2>`;
      if (b.type === "h3") return `<h3>${esc(b.text)}</h3>`;
      if (b.type === "img") return `<img src="${esc(b.src)}" alt="${esc(b.alt || "")}"/>`;
      if (b.type === "quote") return `<blockquote>${esc(b.text)}</blockquote>`;
      if (b.type === "list") return `<ul>${(b.items || []).map(it => `<li>${esc(it)}</li>`).join("")}</ul>`;
      if (b.type === "ol") return `<ol>${(b.items || []).map(it => `<li>${esc(it)}</li>`).join("")}</ol>`;
      if (b.type === "html") return String(b.html || "");
      return "";
    }).join("\n");
  }

  function renderPost() {
    const blog = (window.SITE && window.SITE.blog) || {};
    const posts = blog.posts || [];
    const cats = blog.categories || [];
    const params = new URLSearchParams(location.search);
    const slug = params.get("slug");
    const post = posts.find(p => p.slug === slug);

    const root = $("#post-root");
    if (!root) return;
    if (!post) {
      root.innerHTML = `
        <section class="post-hero">
          <div class="post-hero-wrap" style="text-align:center;padding:60px 0">
            <h1 class="post-title">المقال غير موجود</h1>
            <p style="color:var(--ink-soft);margin-bottom:30px">عذراً، لم نجد المقال المطلوب.</p>
            <a class="btn" href="blog.html">العودة للمدوّنة ←</a>
          </div>
        </section>`;
      return;
    }

    const cat = cats.find(c => c.slug === post.category);

    // SEO injection (per-post)
    if (post.seo) {
      const seo = post.seo;
      document.title = seo.title || post.title;
      const setMeta = (name, content, isProp) => {
        if (!content) return;
        const sel = isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let el = document.head.querySelector(sel);
        if (!el) {
          el = document.createElement("meta");
          if (isProp) el.setAttribute("property", name);
          else el.setAttribute("name", name);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };
      setMeta("description", seo.description);
      setMeta("keywords", seo.keywords);
      setMeta("og:title", seo.title || post.title, true);
      setMeta("og:description", seo.description, true);
      setMeta("og:image", seo.ogImage || post.cover, true);
      setMeta("og:type", "article", true);
      setMeta("twitter:card", "summary_large_image");
      // canonical
      const url = `${location.origin}${location.pathname}?slug=${encodeURIComponent(post.slug)}`;
      let canon = document.head.querySelector('link[rel="canonical"]');
      if (!canon) { canon = document.createElement("link"); canon.setAttribute("rel", "canonical"); document.head.appendChild(canon); }
      canon.setAttribute("href", url);
    }

    // Render
    const tagsHTML = (post.tags || []).map(t => `<span>${esc(t)}</span>`).join("");
    const shareUrl = encodeURIComponent(location.href);
    const shareText = encodeURIComponent(post.title);

    root.innerHTML = `
      <section class="post-hero">
        <div class="post-hero-wrap">
          <a class="post-back" href="blog.html">← العودة للمدوّنة</a>
          ${cat ? `<span class="post-cat">${esc(cat.name)}</span>` : ""}
          <h1 class="post-title">${esc(post.title)}</h1>
          <div class="post-meta">
            <span>${esc(post.author || "ويفي برو")}</span>
            <span>${fmtDate(post.date)}</span>
            <span>${post.readingMinutes || 5} دقائق قراءة</span>
          </div>
        </div>
      </section>
      ${post.cover ? `<div class="post-cover"><img src="${esc(post.cover)}" alt="${esc(post.title)}"/></div>` : ""}
      <article class="post-body">
        ${bodyToHTML(post.body)}
      </article>
      <div class="post-foot">
        <div class="post-tags">${tagsHTML}</div>
        <div class="post-share">
          <span>شارك:</span>
          <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}" target="_blank" rel="noopener" title="X / Twitter">𝕏</a>
          <a href="https://wa.me/?text=${shareText}%20${shareUrl}" target="_blank" rel="noopener" title="واتساب">✆</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" title="فيسبوك">f</a>
          <a href="javascript:void(0)" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent='✓';" title="نسخ الرابط">⎘</a>
        </div>
      </div>
      ${renderRelated(post, posts, cats)}
    `;

    // JSON-LD Article schema
    const ld = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "image": post.cover ? [(location.origin + "/" + post.cover).replace(/\/+/g, "/").replace(":/", "://")] : [],
      "datePublished": post.date,
      "author": [{ "@type": "Organization", "name": post.author || "ويفي برو" }],
      "description": (post.seo && post.seo.description) || post.excerpt
    };
    const ldEl = document.createElement("script");
    ldEl.type = "application/ld+json";
    ldEl.textContent = JSON.stringify(ld);
    document.head.appendChild(ldEl);
  }

  function renderRelated(post, posts, cats) {
    const related = posts
      .filter(p => p.slug !== post.slug && p.category === post.category)
      .slice(0, 3);
    if (!related.length) return "";
    return `
      <section class="post-related">
        <div class="post-related-wrap">
          <h3>مقالات ذات صلة</h3>
          <div class="grid">
            ${related.map(p => {
              const cat = cats.find(c => c.slug === p.category);
              return `
              <article class="blog-card">
                <a class="img" href="post.html?slug=${encodeURIComponent(p.slug)}">
                  <img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy"/>
                  ${cat ? `<span class="cat">${esc(cat.name)}</span>` : ""}
                </a>
                <h3><a href="post.html?slug=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
                <p>${esc(p.excerpt || "")}</p>
                <div class="meta"><span>${fmtDate(p.date)}</span><span>${p.readingMinutes || 5} د قراءة</span></div>
              </article>`;
            }).join("")}
          </div>
        </div>
      </section>`;
  }

  // ============================================================
  // Public API
  // ============================================================
  function whenReady(fn) {
    if (window.SITE) fn();
    else document.addEventListener("site:ready", fn, { once: true });
  }
  window.renderBlogList = () => whenReady(renderList);
  window.renderBlogPost = () => whenReady(renderPost);
})();
