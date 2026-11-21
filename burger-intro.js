// Burger intro — swipe up and the burger rises and comes apart into its layers.
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const SVG = {
  topBun: `<svg viewBox="0 0 260 104"><defs><linearGradient id="bgt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C477"/><stop offset="1" stop-color="#D4852F"/></linearGradient></defs>
    <path d="M8 94C8 40 60 6 130 6s122 34 122 88q0 10-10 10H18Q8 104 8 94Z" fill="url(#bgt)"/>
    <ellipse cx="88" cy="34" rx="42" ry="12" fill="#fff" opacity=".22" transform="rotate(-12 88 34)"/>
    <g fill="#FFF3D6">${[[70,46,-20],[104,28,10],[140,40,-5],[176,26,25],[196,56,-30],[120,64,15],[86,72,30],[160,70,-15],[54,70,10],[212,80,20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g></svg>`,
  lettuce: `<svg viewBox="0 0 260 32"><path d="M2 12${Array.from({ length: 11 }, () => "q12-12 24 0").join("")}V22${Array.from({ length: 11 }, () => "q-12 12-24 0").join("")}Z" fill="#7BC25A" stroke="#4F8F34" stroke-width="2" stroke-linejoin="round"/></svg>`,
  tomato: `<svg viewBox="0 0 260 24"><rect x="10" y="2" width="118" height="20" rx="10" fill="#E5483A"/><rect x="132" y="2" width="118" height="20" rx="10" fill="#D93A2D"/><ellipse cx="69" cy="10" rx="40" ry="4" fill="#FF8A73" opacity=".7"/><ellipse cx="191" cy="10" rx="40" ry="4" fill="#FF8A73" opacity=".6"/></svg>`,
  cheese: `<svg viewBox="0 0 260 32"><path d="M4 2H256V12H236L226 28L216 12H150L142 24L134 12H70L58 30L46 12H4Z" fill="#F7C531" stroke="#E0A821" stroke-width="2" stroke-linejoin="round"/></svg>`,
  patty: `<svg viewBox="0 0 260 48"><defs><linearGradient id="bgp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4329"/><stop offset="1" stop-color="#4A2414"/></linearGradient></defs><rect x="6" y="2" width="248" height="44" rx="22" fill="url(#bgp)"/><g fill="#3A1A0D" opacity=".55">${[[40,18],[70,30],[100,14],[130,28],[160,18],[190,32],[220,20],[56,36],[150,38],[205,12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join("")}</g><rect x="20" y="6" width="220" height="6" rx="3" fill="#fff" opacity=".1"/></svg>`,
  bottomBun: `<svg viewBox="0 0 260 50"><defs><linearGradient id="bgb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0B868"/><stop offset="1" stop-color="#C97B2B"/></linearGradient></defs><path d="M12 2H248q10 0 7 10C250 36 228 48 200 48H60C32 48 10 36 5 12Q2 2 12 2Z" fill="url(#bgb)"/></svg>`,
};
// [svg, label, height, compact y, exploded y, x drift, tilt]
const LAYERS = [
  ["topBun", "לחמנייה", 104, 0, 0, 0, -5],
  ["lettuce", "חסה", 32, 90, 124, -8, 4],
  ["tomato", "עגבנייה", 24, 106, 172, 6, -3],
  ["cheese", "גבינה", 32, 116, 212, -4, 3],
  ["patty", "קציצה", 48, 126, 262, 5, -2],
  ["bottomBun", "לחמנייה", 50, 166, 334, 0, 2],
];
const STACK_H = 216, EXPL_H = 384;

export function mountBurgerIntro(host, opts) {
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
      ${LAYERS.map(([k, label], i) => `<span class="bu-layer" data-i="${i}">${SVG[k]}<span class="bu-label bu-${i % 2 ? "l" : "r"}">${label}</span></span>`).join("")}
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
