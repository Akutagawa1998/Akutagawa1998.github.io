(() => {
  "use strict";
  // Pokémon companions around the console. Decorative only (aria-hidden, no pointer events).
  // - The floater (Mew by day, Gengar by night) drifts around the console and behind it, and dodges the
  //   pointer at the pointer's own speed. If the pointer gets too close anyway, it warps away.
  // - The walker (Espeon by day, Umbreon by night) paces the bottom edge of the window.
  // SELECT's dark mode swaps the sprites in CSS (nds.css, "Pokémon companions"); this file only moves them.
  const root = document.documentElement;
  const box = document.getElementById("n3ds");
  const flyEl = document.querySelector(".pal--fly");
  const walkEl = document.querySelector(".pal--walk");
  if (!box || !flyEl || !walkEl) return;

  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const SPRITE_PX = 3; // one sprite pixel = 3 console px, the console's own pixel size (--p)
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // ------------------------------------------------------------------ world: window, console, pixel grid
  let W = 0,
    H = 0,
    k = 1,
    dpr = 1,
    px = SPRITE_PX,
    con = null,
    panels = [];
  const snap = (v) => Math.round(v * dpr) / dpr; // whole device pixels keep the sprite crisp

  const fly = { el: flyEl, w: 0, h: 0, x: 0, y: 0, vx: 0, vy: 0, tx: NaN, ty: NaN, rest: 0, flip: 1, warping: false, t: rand(0, 9) };
  const walk = { el: walkEl, w: 0, h: 0, x: 0, dir: -1, mode: "walk", timer: rand(4, 9), step: 0 };
  const ptr = { on: false, x: 0, y: 0, vx: 0, vy: 0, t: 0 };

  function measure() {
    W = innerWidth;
    H = innerHeight;
    dpr = devicePixelRatio || 1;
    k = parseFloat(getComputedStyle(root).getPropertyValue("--k")) || 1;
    // WHY: a whole number of device pixels per sprite pixel, so every sprite pixel renders the same size
    px = Math.max(1, Math.round(SPRITE_PX * k * dpr)) / dpr;
    root.style.setProperty("--pal-px", px + "px");
    con = box.getBoundingClientRect();
    panels = [...document.querySelectorAll(".legend, .homehint")].map((el) => el.getBoundingClientRect()).filter((r) => r.width);
    for (const a of [fly, walk]) {
      const cs = getComputedStyle(a.el); // exact (offsetWidth rounds 52.5 to 53)
      a.w = parseFloat(cs.width);
      a.h = parseFloat(cs.height);
    }
  }

  // Open ground around the console, where the floater is in view: rectangles for its top-left corner.
  function bands() {
    const out = [];
    const add = (x0, y0, x1, y1) => x1 - x0 > 8 && y1 - y0 > 8 && out.push([x0, y0, x1, y1]);
    add(0, 0, con.left - fly.w, H - fly.h); // left of the console
    add(con.right, 0, W - fly.w, H - fly.h); // right
    add(0, 0, W - fly.w, con.top - fly.h); // above
    add(0, con.bottom, W - fly.w, H - fly.h); // below
    return out;
  }
  const inBand = (b, x, y) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3];
  const overPanel = (x, y) => panels.some((r) => x < r.right && x + fly.w > r.left && y < r.bottom && y + fly.h > r.top);

  // Next spot to drift to: mostly elsewhere on the same side, now and then across (behind the console).
  // far: the spot farthest from the pointer, where a warp lands.
  function pick(far) {
    const list = bands();
    if (!list.length) return [rand(0, Math.max(0, W - fly.w)), rand(0, Math.max(0, H - fly.h))];
    const home = list.find((b) => inBand(b, fly.x, fly.y));
    const area = (b) => (b[2] - b[0]) * (b[3] - b[1]);
    const total = list.reduce((sum, b) => sum + area(b), 0);
    let best = null,
      bestD = -1;
    for (let i = 0; i < 12; i++) {
      let b = home;
      if (far || !home || Math.random() < 0.3) {
        let r = Math.random() * total;
        b = list.find((c) => (r -= area(c)) <= 0) || list[list.length - 1];
      }
      const x = rand(b[0], b[2]),
        y = rand(b[1], b[3]);
      if (overPanel(x, y)) continue;
      if (!far) return [x, y];
      const d = Math.hypot(x + fly.w / 2 - ptr.x, y + fly.h / 2 - ptr.y);
      if (d > bestD) {
        best = [x, y];
        bestD = d;
      }
    }
    return best || [clamp(fly.x, 0, W - fly.w), clamp(fly.y, 0, H - fly.h)];
  }

  // ------------------------------------------------------------------ floater
  const edge = (gap, m) => (gap < m ? 1 - Math.max(0, gap) / m : 0); // 0 away from a window edge .. 1 touching it

  function stepFly(dt) {
    const f = fly;
    if (f.warping) return;
    f.t += dt;
    const idle = 55 * k; // CSS px/s
    // wholly behind the console: it cannot see the pointer there (and nobody sees it, so it hurries)
    const hidden = f.x >= con.left && f.x + f.w <= con.right && f.y >= con.top && f.y + f.h <= con.bottom;
    let ax = 0,
      ay = 0,
      speed = 0,
      flee = false;
    if (ptr.on && !hidden) {
      const dx = f.x + f.w / 2 - ptr.x,
        dy = f.y + f.h / 2 - ptr.y,
        d = Math.hypot(dx, dy) || 1,
        pv = Math.hypot(ptr.vx, ptr.vy),
        R0 = 2.2 * Math.max(f.w, f.h),
        R = Math.max(R0, pv * 0.2); // a fast pointer is noticed earlier: 0.2 s of its travel
      if (d < R0 * 0.45) return warp(); // caught up anyway (a flick, or a corner)
      if (d < R) {
        flee = true;
        // away from the pointer, pushed off nearby window edges so it slides along them instead of pinning
        const m = R0 * 0.6;
        ax = dx / d + edge(f.x, m) - edge(W - f.w - f.x, m);
        ay = dy / d + edge(f.y, m) - edge(H - f.h - f.y, m);
        // WHY: the dodge runs at the pointer's own speed (never slower than a brisk drift)
        speed = clamp(pv, idle * 1.5, 2400);
        f.rest = 0;
        f.tx = NaN; // plan a new drift once the chase is over
      }
    }
    if (!flee) {
      if (Number.isNaN(f.tx)) [f.tx, f.ty] = pick(false);
      if (f.rest > 0) f.rest -= dt;
      else {
        const dx = f.tx - f.x,
          dy = f.ty - f.y,
          d = Math.hypot(dx, dy);
        if (d < 6) {
          f.rest = rand(0.6, 2.4);
          [f.tx, f.ty] = pick(false);
        } else {
          ax = dx / d;
          ay = dy / d;
          speed = idle * (hidden ? 2.5 : 1) * Math.min(1, 0.3 + d / 80);
        }
      }
    }
    const n = Math.hypot(ax, ay) || 1,
      ease = Math.min(1, dt * (flee ? 30 : 2.5)); // reaches the pointer's speed in ~4 frames; drifts lazily
    f.vx += ((ax / n) * speed - f.vx) * ease;
    f.vy += ((ay / n) * speed - f.vy) * ease;
    f.x = clamp(f.x + f.vx * dt, 0, Math.max(0, W - f.w));
    f.y = clamp(f.y + f.vy * dt, 0, Math.max(0, H - f.h));
    if (f.vx > 15)
      f.flip = -1; // the sprites face left: mirror while heading right
    else if (f.vx < -15) f.flip = 1;
    drawFly();
  }
  function drawFly() {
    const f = fly,
      bob = Math.round(Math.sin(f.t * 2.4) * 1.4) * px; // hovering, in whole sprite pixels
    f.el.style.transform = `translate3d(${snap(f.x)}px, ${snap(f.y + bob)}px, 0) scaleX(${f.flip})`;
  }
  function warp() {
    const f = fly;
    f.warping = true;
    f.el.classList.add("is-warp"); // stepped fade out
    setTimeout(() => {
      [f.x, f.y] = pick(true);
      f.vx = f.vy = 0;
      f.rest = rand(0.8, 1.6);
      f.tx = NaN;
      drawFly();
      f.el.classList.remove("is-warp");
      f.warping = false;
    }, 200);
  }

  // ------------------------------------------------------------------ walker
  function stepWalk(dt) {
    const w = walk,
      max = Math.max(0, W - w.w);
    w.timer -= dt;
    if (w.mode === "walk") {
      w.x += w.dir * 60 * k * dt;
      w.step += dt;
      if (w.x <= 0 || w.x >= max) {
        w.x = clamp(w.x, 0, max);
        w.dir = w.x <= 0 ? 1 : -1; // turn at the window edge
      }
      if (w.timer <= 0) {
        w.mode = "rest";
        w.timer = rand(1.2, 3.2);
      }
    } else if (w.timer <= 0) {
      w.mode = "walk";
      w.timer = rand(5, 12);
      if (Math.random() < 0.4) w.dir = -w.dir;
    }
    drawWalk();
  }
  function drawWalk() {
    const w = walk,
      hop = w.mode === "walk" && Math.floor(w.step / 0.14) % 2 ? px : 0; // a two-beat trot, one sprite pixel high
    w.el.style.transform = `translate3d(${snap(w.x)}px, ${snap(H - w.h - hop)}px, 0) scaleX(${w.dir > 0 ? -1 : 1})`;
  }

  // ------------------------------------------------------------------ pointer: position + smoothed velocity
  addEventListener(
    "pointermove",
    (e) => {
      const dt = (e.timeStamp - ptr.t) / 1000;
      if (ptr.on && dt > 0 && dt < 0.2) {
        const a = Math.min(1, dt / 0.05); // ~50 ms smoothing
        ptr.vx += ((e.clientX - ptr.x) / dt - ptr.vx) * a;
        ptr.vy += ((e.clientY - ptr.y) / dt - ptr.vy) * a;
      } else ptr.vx = ptr.vy = 0;
      Object.assign(ptr, { on: true, x: e.clientX, y: e.clientY, t: e.timeStamp });
    },
    { passive: true }
  );
  addEventListener("pointerdown", (e) => Object.assign(ptr, { on: true, x: e.clientX, y: e.clientY, t: e.timeStamp, vx: 0, vy: 0 }), {
    passive: true,
  });
  for (const t of ["pointerup", "pointercancel"]) {
    addEventListener(t, (e) => e.pointerType !== "mouse" && (ptr.on = false), { passive: true }); // a lifted finger is gone
  }
  addEventListener("pointerout", (e) => !e.relatedTarget && (ptr.on = false)); // the mouse left the window

  // ------------------------------------------------------------------ loop
  let raf = 0,
    last = 0;
  function frame(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; // a background tab resumes without a jump
    last = now;
    if (now - ptr.t > 60) {
      const decay = Math.exp(-dt * 12); // the pointer has stopped
      ptr.vx *= decay;
      ptr.vy *= decay;
    }
    stepFly(dt);
    stepWalk(dt);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    cancelAnimationFrame(raf);
    last = 0;
    measure();
    // start in view: the floater beside the console (left side first), the walker near the left edge
    const b = bands()[0];
    [fly.x, fly.y] = b ? [(b[0] + b[2]) / 2, b[1] + (b[3] - b[1]) * 0.3] : [0, 0];
    walk.x = Math.min(W * 0.12, Math.max(0, W - walk.w));
    drawFly();
    drawWalk();
    flyEl.classList.add("is-live");
    walkEl.classList.add("is-live");
    if (!still.matches) raf = requestAnimationFrame(frame); // reduced motion: they stay put
  }

  addEventListener("resize", () => {
    measure(); // the head script has already updated --k (its listener was added first)
    fly.x = clamp(fly.x, 0, Math.max(0, W - fly.w));
    fly.y = clamp(fly.y, 0, Math.max(0, H - fly.h));
    fly.tx = NaN;
    walk.x = clamp(walk.x, 0, Math.max(0, W - walk.w));
    drawFly();
    drawWalk();
  });
  // SELECT swaps the sprites (CSS): re-measure, and let the newcomers fade in where the others were
  new MutationObserver(() => {
    measure();
    for (const el of [flyEl, walkEl]) {
      el.style.transition = "none";
      el.classList.add("is-warp");
      void el.offsetWidth;
      el.style.transition = "";
      el.classList.remove("is-warp");
    }
    drawFly();
    drawWalk();
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  still.addEventListener("change", start);
  start();
})();
