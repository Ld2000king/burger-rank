// Burger-bite tap feedback: a toothed bite out of the tapped edge + flying crumbs, then it heals.
const SEL = ".btn,.opt,.chip,.bi-btn,.seg button,.icon-btn,.card,.hero";
const DUR = 560;
const CRUMBS = ["#E3A857", "#F3C27A", "#6B3A22", "#7BC25A", "#F1C232"];
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function startBite(el, x, delay = 0) {
  el.classList.remove("biting");
  void el.offsetWidth; // restart
  el.style.setProperty("--bx", `${x}px`);
  el.style.animationDelay = `${-delay}ms`;
  el.classList.add("biting");
  clearTimeout(el._biteT);
  el._biteT = setTimeout(() => { el.classList.remove("biting"); el.style.animationDelay = ""; }, DUR - delay + 20);
}
function crumbs(px, py) {
  for (let i = 0; i < 7; i++) {
    const c = document.createElement("i");
    c.className = "crumb";
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, d = 18 + Math.random() * 26, s = 3 + Math.random() * 4;
    c.style.cssText = `left:${px}px;top:${py}px;width:${s}px;height:${s}px;background:${CRUMBS[i % CRUMBS.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--r:${(Math.random() - .5) * 360}deg;animation-delay:${80 + Math.random() * 60}ms`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 900);
  }
}
let last = null;
document.addEventListener("pointerdown", e => {
  if (reduced()) return;
  const el = e.target.closest(SEL);
  if (!el || el.disabled) return;
  const r = el.getBoundingClientRect();
  const x = Math.min(Math.max(e.clientX - r.left, 18), r.width - 18);
  startBite(el, x);
  crumbs(r.left + x, r.top + 2);
  last = { el, x, t: performance.now(), cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  try { navigator.vibrate?.(8); } catch {}
}, { capture: true, passive: true });

// If the tap re-rendered the screen (e.g. a selected option), carry the bite over to the new element.
document.addEventListener("click", () => {
  const l = last; if (!l) return;
  requestAnimationFrame(() => {
    if (l.el.isConnected) return;
    const n = document.elementFromPoint(l.cx, l.cy)?.closest(SEL);
    const elapsed = performance.now() - l.t;
    if (n && elapsed < DUR) startBite(n, l.x, elapsed);
  });
}, true);
