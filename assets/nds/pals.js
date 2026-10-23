(() => {
  "use strict";
  // Pokémon companions around the console. Decorative only (aria-hidden, no pointer events).
  // - The floater (Mew by day, Gengar by night) drifts around the console and dodges the pointer at the
  //   pointer's own speed. If the pointer gets too close anyway, it warps away.
  // - The walker (Espeon by day, Umbreon by night) paces the bottom edge of the window.
  // Nothing ever covers them: the console and the panels beside it are walls. The floater turns off a wall
  // in a random direction, the walker turns back.
  // SELECT's dark mode swaps the sprites in CSS (nds.css, "Pokémon companions"); this file only moves them.
  const root = document.documentElement;
  const box = document.getElementById("n3ds");
  const flyEl = document.querySelector(".pal--fly");
  const walkEl = document.querySelector(".pal--walk");
  if (!box || !flyEl || !walkEl) return;

  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const SPRITE_PX = 3; // one sprite pixel = 3 console px, the console's own pixel size (--p)
  const FRAME = 9; // the panels' pixel frames reach 3 x 3px outside their boxes
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // ------------------------------------------------------------------ world: window, walls, pixel grid
  let W = 0,
    H = 0,
    k = 1,
    dpr = 1,
    px = SPRITE_PX,
    walls = [], // [left, top, right, bottom], with a gap around: the console first, then the panels
    lane = []; // [left, right] of the panels across the walker's path along the bottom edge
  const snap = (v) => Math.round(v * dpr) / dpr; // whole device pixels keep the sprite crisp

  const fly = {
    el: flyEl,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    hd: rand(-Math.PI, Math.PI), // heading (radians)
    curve: 0, // how fast the heading drifts (rad/s), redrawn every curveT seconds
    curveT: 0,
    cruise: rand(3, 8), // seconds of drifting until the next rest
    rest: 0,
    dodge: 0, // seconds left on a heading taken off a wall during a chase
    flip: 1,
    warping: false,
    room: true, // false: no open ground anywhere, so it stays out of sight
    t: rand(0, 9),
  };
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
    for (const a of [fly, walk]) {
      const cs = getComputedStyle(a.el); // exact (offsetWidth rounds 52.5 to 53)
      a.w = parseFloat(cs.width);
      a.h = parseFloat(cs.height);
    }
    const g = FRAME + 2 * px; // clear of the frames, and of the floater's one-pixel bob
    walls = [box, ...document.querySelectorAll(".legend, .homehint")]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width) // the legend only shows on wide screens
      .map((r) => [r.left - g, r.top - g, r.right + g, r.bottom + g]);
    // the walker walks over the console's foot, so only the panels cross its path
    lane = walls
      .slice(1)
      .filter((r) => r[3] > H - walk.h - px && r[1] < H)
      .map((r) => [r[0], r[2]]);
    // WHY: the floater keeps above the walker's strip, so the two never cover each other either
    walls.push([0, H - walk.h - px - g, W, H]);
  }

  // ------------------------------------------------------------------ open ground for the floater
  const free = (x, y) =>
    x >= 0 && y >= px && x <= W - fly.w && y <= H - fly.h - px && !walls.some((r) => x < r[2] && x + fly.w > r[0] && y < r[3] && y + fly.h > r[1]);

  // Around the console: rectangles for the floater's top-left corner (panels still to be avoided).
  function bands() {
    const con = walls[0],
      x1 = W - fly.w,
      y0 = px,
      y1 = H - fly.h - px,
      out = [];
    const add = (a, b, c, d) => c - a > 8 && d - b > 8 && out.push([a, b, c, d]);
    add(0, y0, con[0] - fly.w, y1); // left of the console
    add(con[2], y0, x1, y1); // right
    add(0, y0, x1, con[1] - fly.h); // above
    add(0, con[3], x1, y1); // below
    return out;
  }

  // A free spot, or null when there is none. far: the one farthest from the pointer, where a warp lands.
  function pick(far) {
    const list = bands();
    const area = (b) => (b[2] - b[0]) * (b[3] - b[1]);
    const total = list.reduce((sum, b) => sum + area(b), 0);
    let best = null,
      bestD = -1;
    for (let i = 0; i < 16 && total > 0; i++) {
      let r = Math.random() * total;
      const b = list.find((c) => (r -= area(c)) <= 0) || list[list.length - 1];
      const x = rand(b[0], b[2]),
        y = rand(b[1], b[3]);
      if (!free(x, y)) continue; // under a panel, or down in the walker's strip
      if (!far) return [x, y];
      const d = Math.hypot(x + fly.w / 2 - ptr.x, y + fly.h / 2 - ptr.y);
      if (d > bestD) {
        best = [x, y];
        bestD = d;
      }
    }
    return best;
  }

  // After the world changed (start, resize, a sprite swap): whatever a wall now covers moves into the open.
  // With no open ground anywhere (a small window) the floater stays out of sight rather than behind something.
  function settle() {
    const f = fly,
      w = walk;
    if (!free(f.x, f.y)) {
      const spot = pick(false);
      if (spot) [f.x, f.y] = spot;
    }
    f.room = free(f.x, f.y);
    f.el.classList.toggle("is-off", !f.room);
    w.x = clamp(w.x, 0, Math.max(0, W - w.w));
    for (const [a, b] of lane) if (w.x < b && w.x + w.w > a) w.x = Math.max(0, a - w.w);
  }

  // ------------------------------------------------------------------ floater
  const edge = (gap, m) => (gap < m ? 1 - Math.max(0, gap) / m : 0); // 0 away from a window edge .. 1 touching it

  // Move along one axis, stopping short of walls and window edges. Swept (where it was against where it
  // would be), so a fast dodge cannot jump through a thin panel. Returns the outward normal of whatever
  // stopped it (-1 or 1), or 0.
  function slide(axis, d) {
    const f = fly,
      X = axis === "x",
      size = X ? f.w : f.h,
      from = X ? f.x : f.y;
    let to = from + d,
      n = 0;
    for (const r of walls) {
      if (X ? f.y >= r[3] || f.y + f.h <= r[1] : f.x >= r[2] || f.x + f.w <= r[0]) continue; // not in its way
      const lo = X ? r[0] : r[1],
        hi = X ? r[2] : r[3];
      if (d > 0 && from + size <= lo + 0.01 && to + size > lo) {
        to = lo - size;
        n = -1;
      } else if (d < 0 && from >= hi - 0.01 && to < hi) {
        to = hi;
        n = 1;
      }
    }
    const min = X ? 0 : px,
      max = X ? W - f.w : H - f.h - px;
    if (d < 0 && to < min) {
      to = min;
      n = 1;
    } else if (d > 0 && to > max) {
      to = max;
      n = -1;
    }
    if (X) f.x = to;
    else f.y = to;
    return n;
  }

  // Blocked: a random new heading off what stopped it (nx, ny: its outward normal; a corner gives the diagonal).
  // In a chase it may veer off sideways, but not back toward the pointer; false when there is no such way out.
  const VEER = -0.25; // least cosine between a dodge heading and straight away from the pointer
  function turn(nx, ny, away) {
    const base = Math.atan2(ny, nx),
      spread = away ? 1.53 : 1.2; // up to 88 / 69 degrees off straight back
    for (let i = 0; i < 24; i++) {
      const hd = base + rand(-spread, spread);
      if (!away || Math.cos(hd) * away[0] + Math.sin(hd) * away[1] > VEER) {
        fly.hd = hd;
        return true;
      }
    }
    return false;
  }

  function stepFly(dt) {
    const f = fly;
    if (f.warping || !f.room) return;
    f.t += dt;
    const idle = 55 * k; // CSS px/s
    let ax = 0,
      ay = 0,
      speed = 0,
      away = null; // in a chase: the unit vector away from the pointer
    if (ptr.on) {
      const dx = f.x + f.w / 2 - ptr.x,
        dy = f.y + f.h / 2 - ptr.y,
        d = Math.hypot(dx, dy) || 1,
        pv = Math.hypot(ptr.vx, ptr.vy),
        R0 = 2.2 * Math.max(f.w, f.h),
        R = Math.max(R0, pv * 0.2); // a fast pointer is noticed earlier: 0.2 s of its travel
      if (d < R0 * 0.45) return warp(); // caught up anyway (a flick, or a corner)
      if (d < R) {
        away = [dx / d, dy / d];
        // away from the pointer, pushed off nearby window edges so it slides along them instead of pinning
        const m = R0 * 0.6;
        ax = away[0] + edge(f.x, m) - edge(W - f.w - f.x, m);
        ay = away[1] + edge(f.y, m) - edge(H - f.h - f.y, m);
        // just turned off a wall: keep that heading a moment (no zigzag), unless the pointer has come round
        if (f.dodge > 0 && Math.cos(f.hd) * away[0] + Math.sin(f.hd) * away[1] > VEER) {
          f.dodge -= dt;
          ax = Math.cos(f.hd);
          ay = Math.sin(f.hd);
        } else f.dodge = 0;
        // WHY: the dodge runs at the pointer's own speed (never slower than a brisk drift)
        speed = clamp(pv, idle * 1.5, 2400);
        f.rest = 0;
      }
    }
    if (!away) {
      // drifting: lazy curves and now and then a rest (walls turn it, below)
      if (f.rest > 0) {
        f.rest -= dt;
        if (f.rest <= 0) f.hd = rand(-Math.PI, Math.PI); // set off somewhere new
      } else {
        if ((f.curveT -= dt) <= 0) {
          f.curve = rand(-0.9, 0.9);
          f.curveT = rand(0.8, 2.5);
        }
        f.hd += f.curve * dt;
        if ((f.cruise -= dt) <= 0) {
          f.rest = rand(0.6, 2.4);
          f.cruise = rand(3, 8);
        }
        ax = Math.cos(f.hd);
        ay = Math.sin(f.hd);
        speed = idle;
      }
    }
    const n = Math.hypot(ax, ay) || 1,
      ease = Math.min(1, dt * (away ? 30 : 2.5)); // reaches the pointer's speed in ~4 frames; drifts lazily
    f.vx += ((ax / n) * speed - f.vx) * ease;
    f.vy += ((ay / n) * speed - f.vy) * ease;
    const nx = slide("x", f.vx * dt),
      ny = slide("y", f.vy * dt);
    if (nx || ny) {
      // ran into a wall or a window edge: turn off it at random, at once and at the same speed
      const s = Math.hypot(f.vx, f.vy);
      if (!turn(nx, ny, away)) return warp(); // cornered: every way out leads toward the pointer
      f.vx = Math.cos(f.hd) * s;
      f.vy = Math.sin(f.hd) * s;
      if (away) f.dodge = rand(0.4, 0.8);
    }
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
      const spot = pick(true);
      if (spot) [f.x, f.y] = spot;
      f.vx = f.vy = 0;
      f.rest = rand(0.8, 1.6);
      f.dodge = 0;
      drawFly();
      f.el.classList.remove("is-warp");
      f.warping = false;
    }, 200);
  }

  // ------------------------------------------------------------------ walker
  function stepWalk(dt) {
    const w = walk;
    w.timer -= dt;
    if (w.mode === "walk") {
      w.step += dt;
      const from = w.x,
        max = Math.max(0, W - w.w);
      let to = from + w.dir * 60 * k * dt,
        blocked = false;
      for (const [a, b] of lane) {
        // a panel ahead: stop short of it rather than walk under it
        if (w.dir > 0 && from + w.w <= a + 0.01 && to + w.w > a) {
          to = a - w.w;
          blocked = true;
        } else if (w.dir < 0 && from >= b - 0.01 && to < b) {
          to = b;
          blocked = true;
        }
      }
      if ((w.dir < 0 && to < 0) || (w.dir > 0 && to > max)) {
        to = clamp(to, 0, max);
        blocked = true;
      }
      w.x = to;
      if (blocked) w.dir = -w.dir; // turn back
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
    if (b) [fly.x, fly.y] = [(b[0] + b[2]) / 2, b[1] + (b[3] - b[1]) * 0.3];
    walk.x = Math.min(W * 0.12, Math.max(0, W - walk.w));
    settle();
    drawFly();
    drawWalk();
    flyEl.classList.add("is-live");
    walkEl.classList.add("is-live");
    if (!still.matches) raf = requestAnimationFrame(frame); // reduced motion: they stay put
  }

  addEventListener("resize", () => {
    measure(); // the head script has already updated --k (its listener was added first)
    fly.x = clamp(fly.x, 0, Math.max(0, W - fly.w));
    fly.y = clamp(fly.y, px, Math.max(px, H - fly.h - px));
    settle();
    drawFly();
    drawWalk();
  });
  // SELECT swaps the sprites (CSS): re-measure, and let the newcomers fade in where the others were
  new MutationObserver(() => {
    measure();
    settle();
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
