(() => {
  "use strict";
  // ------------------------------------------------------------------ setup
  const BASE = document.documentElement.dataset.base || ""; // site.baseurl, set by Jekyll on <html>
  const ASSETS = BASE + "/assets/nds/";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const root = document.documentElement;
  root.classList.add("js");
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const motionOK = () => !matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tiny DOM builder: h("p", {class: "x"}, "text", childNode, [more]).
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  // External links open in a new tab so the console stays where the visitor left it.
  const linkAttrs = (href) => (/^https?:/.test(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href });
  // Inline markup -> nodes. Only **bold** and [label](url) are recognised; everything else is text.
  function md(src) {
    const out = [];
    const re = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g;
    let last = 0;
    for (let m; (m = re.exec(src)); last = re.lastIndex) {
      if (m.index > last) out.push(src.slice(last, m.index));
      out.push(m[1] ? h("strong", null, m[1]) : h("a", linkAttrs(m[3]), m[2]));
    }
    if (last < src.length) out.push(src.slice(last));
    return out;
  }
  function sprite(id, viewBox, cls) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (cls) svg.setAttribute("class", cls);
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }
  const keyGlyph = (k) => h("i", { class: `key key--${k}`, "aria-hidden": "true" }, k.toUpperCase());
  const cursorMark = () => h("i", { class: "row__cur", "aria-hidden": "true" });
  const endMark = () => h("span", { class: "pager__end", "aria-hidden": "true" });

  // ------------------------------------------------------------------ content
  const PUBS = [
    {
      venue: "ACL 2026",
      pixel: "venue-acl",
      tag: "Oral",
      logo: ASSETS + "venues/acl2026.png",
      title: "SHAPE: Unifying Safety, Helpfulness and Pedagogy for Educational LLMs",
      authors: "**Sihang Zhao**, Kangrui Yu, Youliang Yuan, Pinjia He, Hongyi Wen.",
      where: "Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics, 2026.",
      links: [
        ["HTML", BASE + "/assets/html/SHAPE-standalone.html"],
        ["Code", "https://github.com/MAPS-research/SHaPE"],
      ],
      bib: "@inproceedings{zhao2026shape,\n  title = {{SHAPE}: Unifying Safety, Helpfulness and Pedagogy for Educational {LLM}s},\n  author = {Zhao, Sihang and Yu, Kangrui and Yuan, Youliang and He, Pinjia and Wen, Hongyi},\n  booktitle = {Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics},\n  year = {2026},\n  venue_note = {Oral},\n}",
    },
    {
      venue: "CHI 2025",
      pixel: "venue-chi",
      logo: ASSETS + "venues/chi2025.svg",
      title: "Let AI read first: Enhancing reading abilities for individuals with dyslexia through artificial intelligence",
      authors: "**Sihang Zhao**, Shoucong Carol Xiong, Bo Pang, Xiaoying Tang, Pinjia He.",
      where: "Extended Abstracts of the CHI Conference on Human Factors in Computing Systems, 2025.",
      links: [],
      bib: "@inproceedings{zhao2025let,\n  title = {Let AI read first: Enhancing reading abilities for individuals with dyslexia through artificial intelligence},\n  author = {Zhao, Sihang and Xiong, Shoucong Carol and Pang, Bo and Tang, Xiaoying and He, Pinjia},\n  booktitle = {Proceedings of the extended abstracts of the CHI conference on human factors in computing systems},\n  pages = {1--16},\n  year = {2025},\n}",
    },
    {
      venue: "EMNLP 2024",
      pixel: "venue-emnlp",
      logo: ASSETS + "venues/emnlp2024.png",
      title: "Difficult task yes but simple task no: Unveiling the laziness in multimodal LLMs",
      authors: "**Sihang Zhao**, Youliang Yuan, Xiaoying Tang, Pinjia He.",
      where: "Findings of the Association for Computational Linguistics: EMNLP 2024, 2024.",
      links: [],
      bib: "@inproceedings{zhao2024difficult,\n  title = {Difficult task yes but simple task no: Unveiling the laziness in multimodal LLMs},\n  author = {Zhao, Sihang and Yuan, Youliang and Tang, Xiaoying and He, Pinjia},\n  booktitle = {Findings of the association for computational linguistics: emnlp 2024},\n  pages = {7535--7548},\n  year = {2024},\n}",
    },
  ];
  const pubLabel = (p) => (p.tag ? `${p.venue} [${p.tag}]` : p.venue);
  const PROJECTS = [
    {
      zh: "几维",
      en: "Kiwi",
      badge: "badge-kiwi",
      img: ASSETS + "projects/kiwi.png",
      href: "https://kiwiai.org",
      domain: "kiwiai.org",
      desc: "An open-source learning platform where teachers and students build learning activities from course materials, AI assistance, and custom apps. Kiwi Code, its next generation, is on the way!",
    },
    {
      zh: "书僮",
      en: "Scholars' Attendant",
      badge: "badge-book",
      img: ASSETS + "projects/scholars_attendant.png",
      href: "https://github.com/Nagi-having-fun/Scholars-Attendant",
      domain: "github.com/Nagi-having-fun",
      desc: "Your research & scientific reading assistant. Automatically detects paper URLs, extracts metadata, and provides a full analysis pipeline.",
    },
    {
      zh: "钟馗",
      en: "Zhong Kui",
      badge: "badge-sword",
      img: ASSETS + "projects/zhong_kui.png",
      href: "https://github.com/Nagi-having-fun/Zhong-Kui",
      domain: "github.com/Nagi-having-fun",
      desc: "Automatically detect and ward off unwanted content on social media feeds using keyword matching and LLM-powered classification.",
    },
    {
      zh: "八哥",
      en: "Ba-Ge",
      badge: "badge-myna",
      img: ASSETS + "projects/ba_ge.png",
      href: "https://github.com/Akutagawa1998/Ba-Ge",
      domain: "github.com/Akutagawa1998",
      desc: "A macOS menu bar assistant for English–Chinese lookup, formula pronunciation, and vocabulary tracking, with local dictionaries and AI fallback.",
    },
  ];
  const COURSES = [
    { title: "Recommendation Systems", code: "CSCI-SHU 381", section: "001", term: "Fall 2026" },
    { title: "Introduction to Computer Programming", code: "CSCI-SHU 11", section: "006", term: "Fall 2026" },
  ];
  const PEOPLE = [
    {
      note: true,
      name: "Read me first",
      icon: "ico-blog",
      text: [
        "It is now widely agreed that the meaning of a word can be captured by its context. In that spirit, I would like to introduce my friends here.",
        "If their research happens to speak to your curiosity (or you just want to make new friends), please do visit their homepages (I promise they are quite interesting and nice).",
      ],
    },
    {
      name: "Caifeng Zou",
      pic: "caifeng",
      icon: "pp-dog",
      home: "https://caifeng-zou.github.io/",
      text: [
        "Caifeng is a Computational Seismologist. She was my classmate in Imperial College London. While her basketball three-pointers are a tragic 1-for-20, she is quite good at badminton. I believe she knows all the best Chinese food in Pasadena.",
        "Just three days after a passionate manifesto on why academic homepages should be strictly professional and minimalist, she caved and featured her dog, Bella, front and center on her own site. So you can check [Caifeng & Bella here](https://caifeng-zou.github.io/).",
      ],
    },
    {
      name: "Qinyu Xu",
      pic: "qinyu",
      icon: "pp-matcha",
      home: "https://www.qinyuxu.io/",
      text: [
        "Qinyu is an ML Systems researcher. He is my desk-mate (in our office) in NYU. He's arguably better at frothing milk than I am, though my latte art definitely wins on aesthetics. He is obsessed with exploring urban and transit planning, so if the AI uprising ever wipes out your navigation apps while you're lost in NYC, you'll be very glad I introduced him on this page.",
        "Pay extra attention to [his homepage](https://www.qinyuxu.io/) and you may find something interesting.",
      ],
    },
    {
      name: "Jiahan Li",
      pic: "jiahan",
      icon: "pp-sludge",
      home: "https://ced3-han.github.io/",
      text: [
        "Jiahan is an expert in AI4S and Broad Application Generative Models. He is a fellow NYU PhD student from my cohort. His music library is so vast that his pure, unadulterated love for music (or/and K-pop girls) is beyond any shadow of a doubt.",
        "If you're in NYC on a Friday or Saturday night and have no idea where to go, and you are OK to drink, you can reach him [here](https://ced3-han.github.io/).",
      ],
    },
    {
      name: "Wenbo Lu",
      pic: "wenbo",
      icon: "pp-car",
      home: "https://wenboluu.github.io/",
      text: [
        "Wenbo works on Embodied AI and diffusion models. He's my PhD colleague and my go-to \"professor\" for everything from HPC to driving. It's a bit like when Prof. Saining Xie taught Prof. Kaiming He Linux and driving, though I suspect Saining never drove their car into a ditch at 2 AM.",
        "Thanks to his patience, Wenbo is my most-consulted resource after ChatGPT (he officially overtook Claude last week after Anthropic banned our accounts). I usually hit him up right before my 5-hour API limits refresh. If your own tokens are running low, you can contact him [here](https://wenboluu.github.io/).",
      ],
    },
    {
      name: "Zhuoran (Jolia) Chen",
      pic: "zhuoran-chen",
      icon: "pp-strawhat",
      home: "https://joliachen.github.io/",
      text: [
        "Though I have known my daughter [Jolia](https://joliachen.github.io/) only a short while, I know that one day, she will put on my straw hat that has stayed with me through countless storms and set out to become the Pirate King (or perhaps, the Embodied AI Queen).",
      ],
    },
  ];

  // ------------------------------------------------------------------ page builders (top screen)
  // Each returns { node, opts, primary }: opts are the D-pad-reachable buttons on the page;
  // primary is what A does from the list ("options" = move the cursor onto opts).
  const pagerBox = (...kids) => h("div", { class: "pager" }, h("div", { class: "pager__flow" }, ...kids, endMark()));
  const panel = (left, right, ...body) =>
    h(
      "article",
      { class: "detail" },
      h("header", { class: "detail__head ui" }, h("span", null, left), right ? h("span", null, right) : null),
      ...body
    );
  const hint = (...kids) => h("span", { class: "hint" }, ...kids);
  // Page buttons always open a new tab, same-site ones (paper HTML, course page) included, so the console keeps its place.
  const opt = (label, href, ext) =>
    h("a", { class: "opt", href, target: "_blank", rel: "noopener noreferrer" }, label, h("span", { class: "opt__ext" }, ext ? `↗ ${ext}` : "↗"));
  const projName = (p) => [h("span", { class: "zh-name", lang: "zh" }, p.zh), ` / ${p.en}`];

  const SECTIONS = {
    pubs: {
      title: "Publications",
      items: PUBS,
      row: (p) => [sprite(p.pixel, "0 0 16 16"), h("span", { class: "row__no" }, pubLabel(p)), h("span", { class: "row__txt" }, p.title)],
      page: (p) => {
        const logo = h("div", { class: "d-logo" }, h("img", { src: p.logo, alt: `${p.venue} logo`, width: 68, height: 68 }));
        const main = h(
          "div",
          { class: "detail__main" },
          h("h3", { class: "d-title clamp-3" }, p.title),
          h("p", { class: "clamp-2" }, md(p.authors)),
          h("p", { class: "d-soft clamp-2" }, p.where)
        );
        const bibView = h("div", { class: "detail__main", hidden: true }, h("pre", { class: "bib" }, p.bib));
        const bib = h("button", { class: "opt", type: "button", "aria-pressed": "false" }, "Bib");
        bib.addEventListener("click", () => {
          const on = bib.getAttribute("aria-pressed") !== "true";
          bib.setAttribute("aria-pressed", String(on));
          bibView.hidden = !on;
          main.hidden = on;
          logo.hidden = on;
        });
        // same buttons as the classic publications page: BIB always, HTML / CODE where they exist
        const opts = [bib, ...p.links.map(([t, u]) => opt(t, u))];
        const node = panel(
          pubLabel(p),
          null,
          h("div", { class: "detail__body" }, logo, main, bibView),
          h("footer", { class: "detail__foot" }, opts, hint(keyGlyph("a"), "Choose"))
        );
        return { node, opts, primary: "options" };
      },
    },
    blog: {
      title: "Blog",
      items: [],
      empty: "No posts yet. The first one is on its way.",
      page: () => ({
        node: h(
          "article",
          { class: "journal" },
          h("p", { class: "journal__title" }, "Journal"),
          h("p", { class: "journal__desc" }, "notes, ideas, and things I'm building"),
          h("p", { class: "journal__empty" }, "No posts yet. The first one is on its way.")
        ),
        opts: [],
        primary: null,
      }),
    },
    projects: {
      title: "Projects",
      items: PROJECTS,
      caseStyle: true,
      row: (p) => [
        sprite(p.badge, "0 0 16 16"),
        h("span", { class: "row__two" }, h("span", { class: "row__txt" }, projName(p)), h("span", { class: "row__sub" }, p.domain)),
      ],
      page: (p) => {
        const visit = opt("Visit", p.href, p.domain);
        const node = panel(
          "Project",
          p.en,
          h(
            "div",
            { class: "detail__body" },
            h("div", { class: "d-art" }, h("img", { src: p.img, alt: `Pixel-art card for ${p.en}`, width: 160, height: 160 })),
            h("div", { class: "detail__main" }, h("h3", { class: "d-title" }, projName(p)), h("p", null, p.desc))
          ),
          h("footer", { class: "detail__foot" }, visit, hint(keyGlyph("a"), "Visit"))
        );
        return { node, opts: [visit], primary: visit };
      },
    },
    teaching: {
      title: "Teaching",
      items: COURSES,
      row: (c) => [sprite("ico-teaching", "0 0 12 12"), h("span", { class: "row__no" }, c.code), h("span", { class: "row__txt" }, c.title)],
      page: (c) => {
        const open = opt("Course page", BASE + "/teaching/", "classic site");
        const node = h(
          "article",
          { class: "board" },
          h("p", { class: "board__term" }, c.term),
          h("h3", { class: "board__title" }, c.title),
          h("div", { class: "chalk-line" }),
          h("p", { class: "board__code" }, `${c.code} · Section ${c.section}`),
          h("div", { class: "board__foot" }, open, h("span", { class: "hint" }, keyGlyph("a"), "Open"))
        );
        return { node, opts: [open], primary: open };
      },
    },
    people: {
      title: "People",
      items: PEOPLE,
      row: (f) => [sprite(f.icon, "0 0 12 12"), h("span", { class: "row__txt" }, f.name)],
      page: (f) => {
        const home = f.home ? opt("Homepage", f.home, f.home.replace(/^https?:\/\/|\/$/g, "")) : null;
        const node = panel(
          f.note ? "People" : "Friend",
          f.name,
          h(
            "div",
            { class: "detail__body" },
            f.note ? null : h("img", { class: "d-photo", src: `${ASSETS}people/${f.pic}.jpg`, alt: f.name, width: 112, height: 112 }),
            h("div", { class: "detail__main" }, pagerBox(f.text.map((t) => h("p", null, md(t)))))
          ),
          h(
            "footer",
            { class: "detail__foot" },
            home,
            h("span", { class: "detail__pg", "data-pg-info": "" }),
            hint(home ? [keyGlyph("a"), "Homepage"] : null)
          )
        );
        return { node, opts: home ? [home] : [], primary: home };
      },
    },
  };
  const NAV = ["pubs", "blog", "projects", "teaching", "people"];

  // ------------------------------------------------------------------ pager (CSS overflow columns)
  function makePager(box, onChange) {
    const flow = $(".pager__flow", box);
    let page = 0,
      count = 1;
    const step = () => flow.clientWidth + (parseFloat(getComputedStyle(flow).columnGap) || 0);
    const xOf = (el) => {
      let x = 0;
      for (let n = el; n && n !== flow; n = n.offsetParent) x += n.offsetLeft;
      return x;
    };
    const api = {
      get page() {
        return page;
      },
      get count() {
        return count;
      },
      measure() {
        const end = $(".pager__end", flow);
        count = end && step() > 0 ? Math.floor((xOf(end) + 1) / step()) + 1 : 1;
        return api.go(Math.min(page, count - 1));
      },
      go(n) {
        page = Math.max(0, Math.min(count - 1, n));
        flow.style.setProperty("--page", page);
        if (onChange) onChange(api);
        return api;
      },
      next() {
        if (page >= count - 1) return false;
        api.go(page + 1);
        return true;
      },
      prev() {
        if (page <= 0) return false;
        api.go(page - 1);
        return true;
      },
      pageOf: (el) => Math.max(0, Math.floor(xOf(el) / step())),
    };
    flow.addEventListener("focusin", (e) => {
      const p = api.pageOf(e.target);
      if (p !== page) api.go(p);
    });
    return api;
  }

  // ------------------------------------------------------------------ screens and state
  const scrTop = $("#scr-top"),
    scrBot = $("#scr-bot");
  const TOP = Object.fromEntries($$(".layer", scrTop).map((l) => [l.dataset.layer, l]));
  const BOT = Object.fromEntries($$(".layer", scrBot).map((l) => [l.dataset.layer, l]));
  function showLayers(top, bottom) {
    for (const [name, el] of Object.entries(TOP)) el.hidden = name !== top;
    for (const [name, el] of Object.entries(BOT)) el.hidden = name !== bottom;
  }
  const S = {
    view: "menu",
    sec: "pubs",
    idx: 0,
    kbd: false,
    reading: null,
    lastSocial: null,
    lastTop: null,
    lastCard: null,
    lastNav: null,
    lastBottom: null,
  };

  // ------------------------------------------------------------------ the cursor
  // Exactly one element carries .is-cur. Keyboard moves also move DOM focus (so Enter and
  // screen readers follow); pointer hover only moves the cursor.
  let cur = null;
  const socials = $$(".soc"),
    cardLinks = $$(".cardlink"),
    cards = $$(".acard"),
    navBtns = $$(".mbtn");
  const topTargets = [...socials, ...cardLinks];
  const info = { title: $("#info-title"), desc: $("#info-desc"), act: $("#info-act") };
  function setCur(el, focus) {
    if (cur && cur !== el) cur.classList.remove("is-cur");
    cur = el || null;
    if (!cur) return;
    cur.classList.add("is-cur");
    if (socials.includes(cur)) S.lastSocial = cur;
    if (topTargets.includes(cur)) S.lastTop = cur;
    if (cards.includes(cur)) S.lastCard = S.lastBottom = cur;
    if (navBtns.includes(cur)) S.lastNav = S.lastBottom = cur;
    if (cur.dataset.title) {
      // menu targets describe themselves in the info box on the top screen
      info.title.textContent = cur.dataset.title;
      info.desc.textContent = cur.dataset.desc || "";
      info.act.textContent = cur.dataset.act || "Open";
    }
    if (focus) cur.focus({ preventScroll: true });
  }

  // WHY: after keyboard input, hover is ignored until the mouse really moves (see pointermove below)
  const onHover = (el, fn) =>
    el.addEventListener("pointerenter", () => {
      if (!S.kbd) fn();
    });

  // ------------------------------------------------------------------ view: menu (+ About reader on top)
  const readerFlow = $("#reader-flow");
  const READER = { research: ["Research interests", "#tpl-research"], news: ["News", "#tpl-news"], more: ["More about me", "#tpl-more"] };
  const readerPager = makePager($("#reader-pager"), (p) => {
    $("[data-pg-cur]", TOP.reader).textContent = p.page + 1;
    $("[data-pg-all]", TOP.reader).textContent = p.count;
    $("#reader-pg").textContent = `${p.page + 1}/${p.count}`;
    for (const b of $$("[data-pg]", TOP.reader)) b.disabled = b.dataset.pg === "next" ? p.page >= p.count - 1 : p.page <= 0;
  });
  for (const b of $$("[data-pg]", TOP.reader)) b.addEventListener("click", () => (b.dataset.pg === "next" ? readerPager.next() : readerPager.prev()));
  function openReader(card) {
    const key = card.dataset.sec;
    if (S.reading === key) {
      readerPager.next();
      return;
    } // A again = next page, like a dialog box
    S.reading = key;
    const [title, tpl] = READER[key];
    $("#reader-title").textContent = `About · ${title}`;
    readerFlow.replaceChildren($(tpl).content.cloneNode(true), endMark());
    for (const c of cards) c.classList.toggle("is-open", c === card);
    showLayers("reader", "menu");
    readerPager.go(0).measure();
  }
  // While a card is open on the top screen the D-pad reads it: left/right turn pages, up/down switch
  // cards. B closes it, and the D-pad goes back to moving the cursor on the touch screen.
  function readingMove(dir) {
    if (dir === "left") return readerPager.prev();
    if (dir === "right") return readerPager.next();
    const open = cards.findIndex((c) => c.dataset.sec === S.reading);
    const next = Math.max(0, Math.min(cards.length - 1, open + (dir === "down" ? 1 : -1)));
    setCur(cards[next], S.kbd);
    if (next !== open) openReader(cards[next]);
  }
  function closeReader() {
    S.reading = null;
    for (const c of cards) c.classList.remove("is-open");
    if (S.view === "menu") showLayers("card", "menu");
  }
  function goMenu(target) {
    S.view = "menu";
    showLayers(S.reading ? "reader" : "card", "menu");
    setCur(target || S.lastBottom || cards[0], S.kbd);
  }
  // the cursor may only rest on the top screen while the trainer card is showing
  function toTop(target) {
    if (S.reading) closeReader();
    setCur(target, S.kbd);
  }
  function menuMove(dir) {
    const f = S.kbd;
    const j = socials.indexOf(cur),
      l = cardLinks.indexOf(cur),
      c = cards.indexOf(cur),
      i = navBtns.indexOf(cur);
    if (j >= 0) {
      if (dir === "left" && j > 0) setCur(socials[j - 1], f);
      else if (dir === "right" && j < socials.length - 1) setCur(socials[j + 1], f);
      else if (dir === "down") setCur(cardLinks[0], f);
    } else if (l >= 0) {
      if (dir === "up") setCur(l > 0 ? cardLinks[l - 1] : S.lastSocial || socials[0], f);
      else if (dir === "down") setCur(l < cardLinks.length - 1 ? cardLinks[l + 1] : S.lastBottom || cards[0], f);
    } else if (c >= 0) {
      if (dir === "up") c > 0 ? setCur(cards[c - 1], f) : toTop(cardLinks[cardLinks.length - 1]);
      else if (dir === "down" && c < cards.length - 1) setCur(cards[c + 1], f);
      else if (dir === "right") setCur(S.lastNav || navBtns[0], f);
    } else if (i >= 0) {
      if (dir === "up") i > 0 ? setCur(navBtns[i - 1], f) : toTop(S.lastTop || cardLinks[cardLinks.length - 1]);
      else if (dir === "down" && i < navBtns.length - 1) setCur(navBtns[i + 1], f);
      else if (dir === "left") setCur(S.lastCard || cards[0], f);
    } else setCur(cards[0], f);
  }

  // ------------------------------------------------------------------ view: section list (bottom) + page (top)
  const rows = $("#rows-scroll"),
    rowsBox = $("#rows"),
    rowsEmpty = $("#rows-empty"),
    listLayer = BOT.list;
  const tabs = $$(".stab");
  let rowsOffset = 0;
  let page = null; // { node, opts, primary, pager } for the item on the top screen
  function openSection(key) {
    const sec = SECTIONS[key];
    if (S.reading) closeReader();
    S.view = "list";
    S.sec = key;
    S.idx = 0;
    listLayer.dataset.sec = key;
    for (const t of tabs) t.setAttribute("aria-current", String(t.dataset.secTab === key));
    rowsBox.classList.toggle("rows--case", !!sec.caseStyle);
    rowsBox.setAttribute("aria-label", sec.title);
    rows.replaceChildren(
      ...sec.items.map((it, i) => {
        const r = h(
          "button",
          { class: "row", type: "button", role: "option", "aria-selected": "false", "data-cur": `row-${i}` },
          cursorMark(),
          sec.row(it)
        );
        onHover(r, () => {
          if (i !== S.idx || cur !== r) selectRow(i, false);
        });
        r.addEventListener("click", () => {
          selectRow(i, false);
          primary();
        }); // click = A
        return r;
      })
    );
    rowsEmpty.hidden = sec.items.length > 0;
    rowsEmpty.textContent = sec.empty || "";
    rowsOffset = 0;
    rows.style.transform = "";
    $("#rows-up").hidden = $("#rows-down").hidden = true;
    showLayers("detail", "list");
    if (sec.items.length) selectRow(0, S.kbd);
    else {
      renderPage();
      setCur(null);
    }
  }
  function selectRow(i, focus) {
    const sec = SECTIONS[S.sec];
    S.idx = Math.max(0, Math.min(sec.items.length - 1, i));
    const all = $$(".row", rows);
    all.forEach((r, j) => r.setAttribute("aria-selected", String(j === S.idx)));
    setCur(all[S.idx], focus);
    keepRowVisible();
    renderPage();
  }
  function renderPage() {
    const sec = SECTIONS[S.sec];
    page = sec.page(sec.items[S.idx]);
    TOP.detail.replaceChildren(page.node);
    const box = $(".pager", page.node);
    page.pager = box
      ? makePager(box, (p) => {
          const infoEl = $("[data-pg-info]", page.node);
          if (infoEl)
            infoEl.replaceChildren(
              ...(p.count > 1
                ? [`${p.page + 1}/${p.count}`, p.page < p.count - 1 ? h("i", { class: "more-d" }) : "", " ", keyGlyph("y"), keyGlyph("x")]
                : [])
            );
        }).measure()
      : null;
    for (const o of page.opts) onHover(o, () => setCur(o, false));
  }
  function keepRowVisible() {
    const all = $$(".row", rows);
    const r = all[S.idx];
    if (!r) return;
    const view = rowsBox.clientHeight - 8;
    let off = rowsOffset;
    if (r.offsetTop - off < 0) off = r.offsetTop;
    if (r.offsetTop + r.offsetHeight - off > view) off = r.offsetTop + r.offsetHeight - view;
    rowsOffset = off;
    rows.style.transform = off ? `translateY(${-off}px)` : "";
    $("#rows-up").hidden = off <= 0;
    const last = all[all.length - 1];
    $("#rows-down").hidden = !(last && last.offsetTop + last.offsetHeight - off > view);
  }
  const rowEl = () => $$(".row", rows)[S.idx] || null;
  // A on a row: projects / teaching / people go straight to their link; publications move the
  // cursor up onto the page's BIB / HTML / CODE buttons.
  function primary() {
    if (!page) return;
    if (page.primary === "options") {
      if (page.opts.length) setCur(page.opts[0], S.kbd);
    } else if (page.primary) page.primary.click();
  }
  function listMove(dir) {
    const f = S.kbd;
    if (page && page.opts.includes(cur)) {
      // cursor is on the top screen's buttons
      const j = page.opts.indexOf(cur);
      if (dir === "left" && j > 0) setCur(page.opts[j - 1], f);
      else if (dir === "right" && j < page.opts.length - 1) setCur(page.opts[j + 1], f);
      else if (dir === "down") setCur(rowEl(), f);
      return;
    }
    if (dir === "left" || dir === "right") {
      const k = NAV.indexOf(S.sec) + (dir === "right" ? 1 : -1);
      return openSection(NAV[(k + NAV.length) % NAV.length]);
    }
    const n = SECTIONS[S.sec].items.length;
    if (n) selectRow((S.idx + (dir === "down" ? 1 : -1) + n) % n, f);
  }
  for (const t of tabs) t.addEventListener("click", () => openSection(t.dataset.secTab));

  // ------------------------------------------------------------------ actions: one per console button
  function act(btn) {
    if (btn === "start") return toggleAI();
    if (btn === "select") return setTheme(root.dataset.theme !== "night");
    if (btn === "home") return goHome();
    const dir = ["up", "down", "left", "right"].includes(btn) ? btn : null;
    // Whatever the cursor rests on in the top screen (reached by the D-pad, the mouse, Tab or the
    // circle-pad cursor) is clicked by A; B hands the cursor back to the touch screen.
    if (cur && scrTop.contains(cur) && (btn === "a" || btn === "b")) {
      if (btn === "a") return cur.click();
      return setCur(S.view === "list" ? rowEl() : S.lastBottom || cards[0], S.kbd);
    }
    switch (S.view) {
      case "menu":
        if (dir) return S.reading ? readingMove(dir) : menuMove(dir);
        if (btn === "a") return cards.includes(cur) ? openReader(cur) : cur && cur.click();
        if (btn === "b") return S.reading && closeReader();
        if (btn === "x") return S.reading && readerPager.next();
        if (btn === "y") return S.reading && readerPager.prev();
        return;
      case "list":
        if (dir) return listMove(dir);
        if (btn === "a") return primary();
        if (btn === "b") return goMenu(navBtns[NAV.indexOf(S.sec)]);
        if (btn === "x") return page && page.pager && page.pager.next();
        if (btn === "y") return page && page.pager && page.pager.prev();
        return;
      case "ai":
        if (btn === "b") return toggleAI();
    }
  }

  // menu wiring: hover moves the cursor; plain clicks open in-console views; modified clicks stay links
  for (const el of [...topTargets, ...cards, ...navBtns]) onHover(el, () => setCur(el, false));
  for (const c of cards)
    c.addEventListener("click", () => {
      setCur(c, false);
      openReader(c);
    });
  navBtns.forEach((b) => {
    b.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      setCur(b, false);
      openSection(b.dataset.view);
    });
  });
  for (const b of $$("[data-act]")) b.addEventListener("click", () => act(b.dataset.act));
  // keyboard Tab focus keeps the cursor in sync
  document.addEventListener("focusin", (e) => {
    const t = e.target.closest && e.target.closest("[data-cur], .opt");
    if (!t || t === cur) return;
    if (t.classList.contains("row")) selectRow($$(".row", rows).indexOf(t), false);
    else setCur(t, false);
  });

  // ------------------------------------------------------------------ SELECT = dark mode
  const selBtn = $("[data-btn=select]");
  function setTheme(night) {
    root.dataset.theme = night ? "night" : "day";
    selBtn.setAttribute("aria-pressed", String(night));
    try {
      localStorage.setItem("n3ds-theme", root.dataset.theme);
    } catch (e) {
      /* not persisted: fine */
    }
  }
  selBtn.setAttribute("aria-pressed", String(root.dataset.theme === "night"));

  // ------------------------------------------------------------------ START = AI mode (hook only)
  // Contract for the future AI terminal:
  //   window.addEventListener("ds:start", (e) => {
  //     e.preventDefault();                       // take over from the placeholder
  //     mount(e.detail.top, e.detail.bottom);      // the two screen layers to render into
  //     ... call e.detail.exit() to hand control back to the menu
  //   });
  let aiReturn = null;
  function toggleAI() {
    if (S.view === "ai") return goMenu(aiReturn);
    if (S.reading) closeReader();
    aiReturn = S.lastBottom;
    S.view = "ai";
    setCur(null);
    showLayers("ai", "ai");
    dispatchEvent(new CustomEvent("ds:start", { cancelable: true, detail: { top: TOP.ai, bottom: BOT.ai, exit: () => goMenu(aiReturn) } }));
  }

  // ------------------------------------------------------------------ HOME = classic web view
  const home = $("a.home");
  function goHome() {
    if (!motionOK()) {
      location.assign(home.href);
      return;
    }
    root.classList.add("is-leaving");
    setTimeout(() => location.assign(home.href), 220);
  }
  for (const a of [home, $("#homehint")]) {
    a.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      tap("home");
      goHome();
    });
  }
  addEventListener("pageshow", () => root.classList.remove("is-leaving"));

  // ------------------------------------------------------------------ input: keyboard + pointer
  const KEYMAP = {
    KeyW: "up",
    KeyA: "left",
    KeyS: "down",
    KeyD: "right",
    ArrowUp: "up",
    ArrowLeft: "left",
    ArrowDown: "down",
    ArrowRight: "right",
    KeyI: "x",
    KeyJ: "y",
    KeyK: "b",
    KeyL: "a",
    Escape: "b",
    KeyH: "home",
    Home: "home",
  };
  const REPEATABLE = new Set(["up", "down", "left", "right", "x", "y"]);
  const pressed = new Set();
  function setDown(btn, down) {
    for (const el of $$(`[data-btn="${btn}"]`)) el.classList.toggle("is-down", down);
    down ? pressed.add(btn) : pressed.delete(btn);
  }
  function tap(btn) {
    setDown(btn, true);
    setTimeout(() => setDown(btn, false), 140);
  }
  const typing = (t) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
    if ((e.code === "Enter" || e.code === "NumpadEnter") && !(e.target.closest && e.target.closest("a, button"))) {
      e.preventDefault();
      S.kbd = true;
      tap("a");
      act("a");
      return;
    }
    const btn = KEYMAP[e.code];
    if (!btn) return;
    e.preventDefault();
    S.kbd = true;
    setDown(btn, true);
    if (!e.repeat || REPEATABLE.has(btn)) act(btn);
  });
  document.addEventListener("keyup", (e) => {
    const btn = KEYMAP[e.code];
    if (btn) setDown(btn, false);
  });
  document.addEventListener(
    "pointerdown",
    () => {
      S.kbd = false;
    },
    true
  );
  document.addEventListener(
    "pointermove",
    (e) => {
      if (e.movementX || e.movementY) S.kbd = false;
    },
    true
  );
  addEventListener("blur", () => {
    for (const b of [...pressed]) setDown(b, false);
  });

  for (const el of $$(".dpad__arm, .fbtn")) {
    const btn = el.dataset.btn;
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      setDown(btn, true);
      act(btn);
    });
    for (const t of ["pointerup", "pointercancel", "lostpointercapture"]) el.addEventListener(t, () => setDown(btn, false));
  }
  $("[data-btn=start]").addEventListener("click", () => {
    tap("start");
    act("start");
  });
  selBtn.addEventListener("click", () => {
    tap("select");
    act("select");
  });

  // Circle Pad follows the pointer over the top screen (and can be dragged directly)
  const cpad = $("#cpad"),
    nub = $(".cpad__nub", cpad);
  const TRAVEL = 15,
    SNAP = 3; // design px; snapped to the sprite's 3 px pixels
  let raf = 0;
  function setNub(x, y) {
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    nub.style.setProperty("--nx", `${Math.round((x * TRAVEL) / SNAP) * SNAP}px`);
    nub.style.setProperty("--ny", `${Math.round((y * TRAVEL) / SNAP) * SNAP}px`);
  }
  function track(e, rect, scale) {
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setNub(x * scale, y * scale));
  }
  function release() {
    cancelAnimationFrame(raf);
    cpad.classList.remove("is-live");
    setNub(0, 0);
  }
  scrTop.addEventListener("pointermove", (e) => {
    cpad.classList.add("is-live");
    track(e, scrTop.getBoundingClientRect(), 1);
  });
  scrTop.addEventListener("pointerleave", release);
  // ------------------------------------------------------------------ circle-pad cursor (top screen)
  // Dragging the Circle Pad steers a pixel arrow over the top screen, which is how touch users reach
  // links there: whatever it rests on takes the cursor and A clicks it. It hides after a few idle seconds.
  const vcur = $("#vcursor");
  const VC = { x: 232, y: 136, dx: 0, dy: 0, held: false, last: 0, frame: 0, hide: 0 };
  const VC_SPEED = 260; // design px per second at full tilt
  function vcPlace() {
    vcur.style.setProperty("--vx", `${Math.round(VC.x)}px`);
    vcur.style.setProperty("--vy", `${Math.round(VC.y)}px`);
  }
  function vcPick() {
    const r = scrTop.getBoundingClientRect();
    const s = r.width / 480; // the screen is scaled with the console: design px -> viewport px
    const hit = document.elementFromPoint(r.left + (VC.x + 1) * s, r.top + (VC.y + 1) * s);
    const el = hit && hit.closest("a, button");
    if (el && scrTop.contains(el) && el !== cur) setCur(el, false);
  }
  function vcTick(t) {
    const dt = Math.min(0.05, (t - (VC.last || t)) / 1000);
    VC.last = t;
    const mag = Math.hypot(VC.dx, VC.dy);
    if (mag > 0.15) {
      // dead zone, then a soft curve so small tilts give fine control
      const step = (Math.pow((Math.min(mag, 1) - 0.15) / 0.85, 1.5) * VC_SPEED * dt) / mag;
      VC.x = Math.max(0, Math.min(474, VC.x + VC.dx * step));
      VC.y = Math.max(0, Math.min(282, VC.y + VC.dy * step));
      vcPlace();
      vcPick();
    }
    VC.frame = VC.held ? requestAnimationFrame(vcTick) : 0;
  }
  cpad.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    cpad.setPointerCapture(e.pointerId);
    cpad.classList.add("is-live");
    clearTimeout(VC.hide);
    vcur.hidden = false;
    vcPlace();
    VC.held = true;
    VC.last = 0;
    if (!VC.frame) VC.frame = requestAnimationFrame(vcTick);
  });
  cpad.addEventListener("pointermove", (e) => {
    if (!cpad.hasPointerCapture(e.pointerId)) return;
    const r = cpad.getBoundingClientRect();
    VC.dx = (((e.clientX - r.left) / r.width) * 2 - 1) * 1.6;
    VC.dy = (((e.clientY - r.top) / r.height) * 2 - 1) * 1.6;
    track(e, r, 1.6);
  });
  for (const t of ["pointerup", "pointercancel"])
    cpad.addEventListener(t, () => {
      release();
      VC.held = false;
      VC.dx = VC.dy = 0;
      clearTimeout(VC.hide);
      VC.hide = setTimeout(() => (vcur.hidden = true), 4000);
    });

  // the page never scrolls; undo any scroll a focus change might cause
  addEventListener("scroll", () => {
    if (scrollX || scrollY) scrollTo(0, 0);
  });

  // ------------------------------------------------------------------ boot
  showLayers("card", "menu");
  setCur(cards[0], false);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      if (S.reading) readerPager.measure();
      if (page && page.pager) page.pager.measure();
    });
})();
