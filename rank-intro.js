// Rank intro — swipe up and the stack (trophy, topic cards, podium) rises and fans out.
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const SVG = {
  trophy: `<svg viewBox="0 0 260 104"><defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#D99A12"/></linearGradient></defs>
    <path d="M96 14h68v28c0 22-15 38-34 38S96 64 96 42Z" fill="url(#tg)"/><path d="M96 22H78c0 18 8 28 22 30M164 22h18c0 18-8 28-22 30" fill="none" stroke="#D99A12" stroke-width="6" stroke-linecap="round"/>
    <rect x="122" y="78" width="16" height="12" fill="#D99A12"/><rect x="104" y="88" width="52" height="12" rx="4" fill="#B97F0A"/>
    <path d="M130 28l4.5 9 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5z" fill="#fff" opacity=".9"/><ellipse cx="112" cy="30" rx="5" ry="12" fill="#fff" opacity=".35"/></svg>`,
  c1: `<svg viewBox="0 0 260 40"><rect x="18" y="2" width="224" height="36" rx="12" fill="#FDE7C8" stroke="rgba(0,0,0,.08)"/><text x="130" y="26" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="16" font-weight="700" fill="#5A3510">🍔 המבורגרים</text></svg>`,
  c2: `<svg viewBox="0 0 260 40"><rect x="18" y="2" width="224" height="36" rx="12" fill="#DCE6FF" stroke="rgba(0,0,0,.08)"/><text x="130" y="26" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="16" font-weight="700" fill="#1F2E5C">🎬 סרטים</text></svg>`,
  c3: `<svg viewBox="0 0 260 40"><rect x="18" y="2" width="224" height="36" rx="12" fill="#FFDCD3" stroke="rgba(0,0,0,.08)"/><text x="130" y="26" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="16" font-weight="700" fill="#6B1E12">🍕 פיצה</text></svg>`,
  c4: `<svg viewBox="0 0 260 40"><rect x="18" y="2" width="224" height="36" rx="12" fill="#D9F2E1" stroke="rgba(0,0,0,.08)"/><text x="130" y="26" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="16" font-weight="700" fill="#17472A">📚 ספרים</text></svg>`,
  podium: `<svg viewBox="0 0 260 56"><rect x="94" y="2" width="72" height="54" rx="8" fill="#E8B730"/><rect x="20" y="18" width="72" height="38" rx="8" fill="#B9C0C8"/><rect x="168" y="28" width="72" height="28" rx="8" fill="#CD8A4E"/>
    <g font-family="Heebo,system-ui,sans-serif" font-weight="700" fill="#fff" text-anchor="middle"><text x="130" y="34" font-size="22">1</text><text x="56" y="44" font-size="18">2</text><text x="204" y="49" font-size="16">3</text></g></svg>`,
};
// [svg, label, height, compact y, exploded y, x drift, tilt]
const LAYERS = [
  ["trophy", "", 104, 0, 0, 0, -4],
  ["c1", "", 40, 82, 116, -10, 4],
  ["c2", "", 40, 90, 164, 8, -3],
  ["c3", "", 40, 98, 212, -6, 3],
  ["c4", "", 40, 106, 260, 6, -2],
  ["podium", "", 56, 122, 316, 0, 0],
];
const STACK_H = 178, EXPL_H = 372;

export function mountRankIntro(host, opts) {
  const name = esc(opts.name || "APP");
  const headline = opts.headline ?? "ברוכים הבאים";
  const subtitle = esc(opts.subtitle ?? "");
  const buttons = opts.buttons ?? [{ id: "enter", label: "כניסה", dark: true }];
  const root = document.createElement("div");
  root.className = "bi-root bu-root";
  root.innerHTML = `
    <div class="bi-a"><h1 class="bi-head bi-head-a">${headline}</h1></div>
    <div class="bi-b bu-b"><h1 class="bi-head">${esc(opts.welcome ?? "ברוכים הבאים")}<br/><em><bdi>${name}.</bdi></em></h1>${subtitle ? `<p class="bi-sub">${subtitle}</p>` : ""}</div>
    <button type="button" class="bu-burger" aria-label="פתיחה">
      <span class="bu-shadow"></span>
      ${LAYERS.map(([k, label], i) => `<span class="bu-layer" data-i="${i}">${SVG[k]}${label ? `<span class="bu-label bu-${i % 2 ? "l" : "r"}">${label}</span>` : ""}</span>`).join("")}
    </button>
    <div class="bi-hint">${esc(opts.hint ?? "החליקו למעלה")}</div>
    <div class="bi-actions">${buttons.map(b => `<button type="button" class="bi-btn${b.dark ? " bi-btn-dark" : ""}" data-id="${esc(b.id)}">${esc(b.label)}</button>`).join("")}</div>`;
  host.appendChild(root);

  const $ = s => root.querySelector(s);
  const burger = $(".bu-burger"), layerA = $(".bi-a"), hint = $(".bi-hint"), shadow = $(".bu-shadow");
  const els = [...root.querySelectorAll(".bu-layer")];
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, w = 0, k = 1, state = "idle", p = 0, startY = 0, startP = 0, raf = 0, moved = false, downOnBurger = false, bob = 0, bobStart = 0;
  const timers = [];

  function geom(t) {
    const top0 = H - STACK_H * k * 0.62;                       // idle: peeking from the bottom
    const top1 = Math.max(24, H * 0.06); // open: upper half
    return { top: top0 + (top1 - top0) * t, left: (W - w) / 2 };
  }
  function place(t, now = 0) {
    const g = geom(t), e = clamp(t, -0.2, 1.25);
    burger.style.transform = `translate3d(${g.left}px,${g.top}px,0)`;
    els.forEach((el, i) => {
      const [, , h, y0, y1, dx, rot] = LAYERS[i];
      const b = bob ? Math.sin((now - bobStart) / 1000 * 1.8 + i * 0.8) * 3 * bob : 0;
      const y = (y0 + (y1 - y0) * e) * k + b;
      el.style.height = `${h * k}px`;
      el.style.transform = `translate3d(${dx * e * k}px,${y}px,0) rotate(${rot * e + (bob ? Math.sin((now - bobStart) / 1000 * 1.3 + i) * bob : 0)}deg)`;
    });
    const bottom = (LAYERS[5][3] + (LAYERS[5][4] - LAYERS[5][3]) * e + LAYERS[5][2]) * k;
    shadow.style.transform = `translate3d(0,${bottom + 10 * k}px,0) scaleX(${1 - 0.25 * clamp(t, 0, 1)})`;
    shadow.style.opacity = String(0.9 - 0.5 * clamp(t, 0, 1));
    layerA.style.opacity = String(clamp(1 - t * 1.6, 0, 1));
    layerA.style.filter = `blur(${clamp(t, 0, 1) * 6}px)`;
    hint.style.opacity = String(clamp(1 - t * 3, 0, 1));
  }
  function resize() {
    const r = root.getBoundingClientRect(); W = r.width; H = r.height;
    w = Math.min(W * 0.58, W - 150, 250, (H * 0.44) / EXPL_H * 260); k = w / 260;
    burger.style.width = `${w}px`; burger.style.height = `${EXPL_H * k}px`;
    $(".bu-b").style.paddingTop = `${geom(1).top + (EXPL_H + 18) * k + 16}px`;
    hint.style.bottom = `${STACK_H * k * 0.62 + 20}px`;
    place(p, performance.now());
  }
  function animateTo(target, after) {
    cancelAnimationFrame(raf);
    let v = 0, prev = performance.now();
    const step = now => {
      const dt = Math.min((now - prev) / 1000, 0.032); prev = now;
      v += (150 * (target - p) - 15 * v) * dt; p += v * dt; place(p, now);
      if (Math.abs(target - p) < 0.002 && Math.abs(v) < 0.02) { p = target; place(p, now); after && after(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function commit() { if (state === "fly" || state === "done") return; state = "fly"; root.classList.add("bi-flying"); animateTo(1, open); }
  function open() {
    state = "done"; root.classList.add("bi-popped");
    bobStart = performance.now();
    const loop = now => { bob = clamp((now - bobStart) / 800, 0, 1); place(p, now); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    timers.push(setTimeout(() => root.classList.add("bi-ready"), 1100));
  }
  function onDown(e) {
    if (state !== "idle" || e.target.closest(".bi-actions")) return;
    cancelAnimationFrame(raf); state = "drag"; startY = e.clientY; startP = p; moved = false;
    downOnBurger = !!e.target.closest(".bu-burger");
    try { root.setPointerCapture(e.pointerId); } catch {}
  }
  function onMove(e) {
    if (state !== "drag") return;
    const dy = startY - e.clientY; if (Math.abs(dy) > 6) moved = true;
    let t = startP + dy / (geom(0).top - geom(1).top);
    if (t < 0) t *= 0.25; if (t > 1) t = 1 + (t - 1) * 0.2;
    p = t; place(p, performance.now());
  }
  function onUp() { if (state !== "drag") return; state = "idle"; if (p > 0.32 || (!moved && downOnBurger)) commit(); else animateTo(0); }
  function onClick(e) { const b = e.target.closest("[data-id]"); if (b) opts.onEnter(b.dataset.id); }
  function onKey(e) { if ((e.key === "Enter" || e.key === " ") && e.target === burger) { e.preventDefault(); commit(); } }

  root.addEventListener("pointerdown", onDown); root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerup", onUp); root.addEventListener("pointercancel", onUp);
  root.addEventListener("click", onClick); burger.addEventListener("keydown", onKey);
  const ro = new ResizeObserver(resize); ro.observe(root); resize();
  if (reduced) { p = 1; place(1); state = "done"; root.classList.add("bi-in", "bi-flying", "bi-popped", "bi-ready"); }
  else requestAnimationFrame(() => root.classList.add("bi-in"));
  return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); ro.disconnect(); root.remove(); };
}
