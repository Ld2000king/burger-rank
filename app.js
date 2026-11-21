import { mountBurgerIntro } from "./burger-intro.js";
import "./bite.js";

/* ---------- icons (Lucide, 2px stroke) ---------- */
const P = {
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  settings:'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  back:'<path d="m9 18 6-6-6-6"/>',
  trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  pencil:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  coins:'<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
};
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const BURGER_ART = `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="108" rx="40" ry="5" fill="currentColor" opacity=".08"/><path d="M18 84h84a6 6 0 0 1-6 14H24a6 6 0 0 1-6-14Z" fill="#E3A857"/><rect x="16" y="68" width="88" height="14" rx="7" fill="#6B3A22"/><path d="M16 66h88l-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6z" fill="#F1C232"/><rect x="14" y="58" width="92" height="8" rx="4" fill="#6AA84F"/><path d="M18 56c0-20 19-34 42-34s42 14 42 34Z" fill="#E3A857"/><g fill="#FFF3D6"><ellipse cx="44" cy="38" rx="3" ry="1.6"/><ellipse cx="60" cy="32" rx="3" ry="1.6"/><ellipse cx="76" cy="40" rx="3" ry="1.6"/><ellipse cx="52" cy="46" rx="3" ry="1.6"/><ellipse cx="70" cy="48" rx="3" ry="1.6"/></g></svg>`;

/* ---------- data ---------- */
const CRITERIA = [
  { id: "taste", label: "טעם", hint: "הביס הראשון, האיזון" },
  { id: "patty", label: "קציצה", hint: "עסיסיות, צלייה, מידת עשייה" },
  { id: "bun", label: "לחמנייה", hint: "רכה, טרייה, מחזיקה" },
  { id: "toppings", label: "תוספות ורטבים", hint: "רטבים, ירקות, גבינה" },
  { id: "value", label: "תמורה למחיר", hint: "שווה את הכסף?" },
];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ls = {
  get(k, d) { try { const v = localStorage.getItem("bunrank:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("bunrank:" + k, JSON.stringify(v)); } catch {} },
};
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const safe = s => String(s).replace(/[^A-Za-z0-9_-]/g, "_");

/* Store: burgers {id,name,place,date,price,photo,by,createdAt} + ratings {id,bid,uid,scores,notes,at}.
   Shared mode = artifact db (everyone with the link sees one table). Local mode = IndexedDB on this device. */
const Store = (() => {
  let mode = "local", remote = null, user = null, me = "me";
  let burgers = [], ratings = [], names = {};
  const listeners = new Set();
  const emit = () => listeners.forEach(f => f());
  // local IndexedDB
  let idb = null;
  try { idb = new Promise((res, rej) => { const r = indexedDB.open("bunrank", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); idb.catch(() => {}); } catch {}
  const idbGet = async k => { try { const d = await idb; return await new Promise(res => { const q = d.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); }); } catch { return undefined; } };
  const idbPut = async (k, v) => { try { const d = await idb; d.transaction("kv", "readwrite").objectStore("kv").put(v, k); } catch {} };
  async function loadLocal() {
    const v = await idbGet("store");
    if (v) { burgers = v.burgers || []; ratings = v.ratings || []; }
    else { // migrate v1 (scores inside burger)
      const old = (await idbGet("burgers")) || [];
      burgers = old.map(({ scores, notes, eaters, ...b }) => ({ ...b, by: "me" }));
      ratings = old.map(b => ({ id: b.id + "__me", bid: b.id, uid: "me", scores: b.scores, notes: b.notes || "", at: b.createdAt }));
    }
  }
  const saveLocal = () => idbPut("store", { burgers, ratings });
  const docsOf = snap => {
    const arr = Array.isArray(snap) ? snap : snap?.docs || [];
    return arr.map(d => { const data = typeof d.data === "function" ? d.data() : d.data ?? d; return { ...data, id: d.id ?? data.id }; }).filter(x => x && x.id);
  };
  async function resolveNames() {
    if (!user?.profiles) return;
    const ids = [...new Set([...ratings.map(r => r.uid), ...burgers.map(b => b.by)])].filter(id => id && !(id in names));
    if (!ids.length) return;
    try { const ps = await user.profiles(ids); for (const id of ids) names[id] = ps?.[id]?.name || ""; emit(); } catch {}
  }
  return {
    get mode() { return mode; }, get me() { return me; },
    on(f) { listeners.add(f); },
    name(id) { return id === me ? "אני" : names[id] || "חבר"; },
    async init() {
      await loadLocal();
      const getCap = n => Promise.race([window.claude?.use ? window.claude.use(n).catch(() => null) : Promise.resolve(null), new Promise(r => setTimeout(() => r(null), 10000))]);
      if (!window.claude?.use) await new Promise(r => setTimeout(r, 400)); // let the host inject claude.use
      const db = window.claude?.use ? await getCap("db") : null;
      if (!db) { emit(); return; }
      user = await getCap("user");
      try { me = (await user?.id?.()) || "me"; } catch {}
      remote = db; mode = "shared";
      let gotB = false, gotR = false;
      const ready = new Promise(res => {
        const t = setTimeout(res, 10000);
        const check = () => { if (gotB && gotR) { clearTimeout(t); res(); } };
        db.collection("burgers").onSnapshot(s => { burgers = docsOf(s); gotB = true; check(); emit(); resolveNames(); }, () => { gotB = true; check(); });
        db.collection("ratings").onSnapshot(s => { ratings = docsOf(s); gotR = true; check(); emit(); resolveNames(); }, () => { gotR = true; check(); });
      });
      await ready;
      // first time in shared mode: bring this device's local burgers along
      if (!ls.get("migrated", false)) {
        const local = await idbGet("store");
        ls.set("migrated", true);
        if (local?.burgers?.length && !burgers.length) {
          for (const b of local.burgers) await this.saveBurger({ ...b, by: me }, local.ratings.find(r => r.bid === b.id) || null).catch(() => {});
        }
      }
      emit();
    },
    list() {
      return burgers.map(b => {
        const rs = ratings.filter(r => r.bid === b.id && r.scores);
        const scores = {};
        for (const c of CRITERIA) { const v = rs.map(r => r.scores[c.id]).filter(x => x != null); scores[c.id] = v.length ? Math.round((v.reduce((a, x) => a + x, 0) / v.length) * 10) / 10 : null; }
        return { ...b, scores, raters: rs, mine: rs.find(r => r.uid === me) || null };
      });
    },
    async saveBurger(b, myScores, myNotes) {
      const rec = { id: b.id, name: b.name, place: b.place || "", date: b.date || "", price: b.price || "", photo: b.photo || null, by: b.by || me, createdAt: b.createdAt || Date.now() };
      const scores = myScores?.scores || myScores;
      const notes = myScores?.notes ?? myNotes ?? "";
      const rid = safe(b.id) + "__" + safe(me);
      const rat = scores ? { id: rid, bid: b.id, uid: me, scores, notes, at: Date.now() } : null;
      if (mode === "shared") {
        await remote.collection("burgers").doc(rec.id).set(rec);
        if (rat) await remote.collection("ratings").doc(rid).set(rat);
      } else {
        burgers = [...burgers.filter(x => x.id !== rec.id), rec];
        if (rat) ratings = [...ratings.filter(r => r.id !== rid), rat];
        await saveLocal(); emit();
      }
      return rec;
    },
    async removeBurger(id) {
      const rs = ratings.filter(r => r.bid === id);
      if (mode === "shared") {
        for (const r of rs) await remote.collection("ratings").doc(r.id).delete().catch(() => {});
        await remote.collection("burgers").doc(id).delete();
      } else { burgers = burgers.filter(b => b.id !== id); ratings = ratings.filter(r => r.bid !== id); await saveLocal(); emit(); }
    },
    canDelete(b) { return mode === "local" || b.by === me || this.isOwner; },
    async loadOwner() { try { this.isOwner = !!(await user?.isOwner?.()); } catch {} },
    async resetLocal() { burgers = []; ratings = []; await saveLocal(); emit(); },
  };
})();

const S = { burgers: [], sort: "score", q: "", prefs: ls.get("prefs", ["taste", "patty"]), loading: true };
const weightOf = id => (S.prefs.includes(id) ? 2 : 1);
function total(b) {
  let sum = 0, w = 0;
  for (const c of CRITERIA) { const v = b.scores?.[c.id]; if (v == null) continue; sum += v * weightOf(c.id); w += weightOf(c.id); }
  return w ? Math.round((sum / w) * 10) / 10 : 0;
}
const fmt = n => (Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1));
const fmtDate = d => { try { return new Date(d).toLocaleDateString("he-IL", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- theme ---------- */
function applyTheme() {
  const t = ls.get("theme", "auto");
  const dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name=theme-color]')?.setAttribute("content", dark ? "#14110F" : "#FBF7F1");
}
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);

/* ---------- toast / dialog / sheet ---------- */
let toastT;
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2200); }
function confirmDialog({ title, text, ok, danger }) {
  return new Promise(res => {
    const el = document.createElement("div"); el.className = "dialog";
    el.innerHTML = `<div class="scrim on"></div><div class="dialog-box" role="alertdialog" aria-modal="true" style="position:relative;z-index:1"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="actions"><button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-a="ok">${esc(ok)}</button><button class="btn btn-ghost" data-a="no">ביטול</button></div></div>`;
    el.addEventListener("click", e => { const a = e.target.closest("[data-a]")?.dataset.a; if (a || e.target.classList.contains("scrim")) { el.remove(); res(a === "ok"); } });
    document.body.appendChild(el); el.querySelector("[data-a=ok]").focus();
  });
}
function openSheet(html, onMount) {
  closeSheet(true);
  const scrim = document.createElement("div"); scrim.className = "scrim"; scrim.id = "scrim";
  const sh = document.createElement("div"); sh.className = "sheet"; sh.id = "sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true");
  sh.innerHTML = `<div class="grab"></div>${html}`;
  document.body.append(scrim, sh); document.body.style.overflow = "hidden";
  scrim.onclick = () => closeSheet();
  sh.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeSheet(); });
  requestAnimationFrame(() => { scrim.classList.add("on"); sh.classList.add("on"); });
  onMount && onMount(sh);
}
function closeSheet(instant) {
  const sh = document.getElementById("sheet"), sc = document.getElementById("scrim");
  if (!sh) return; document.body.style.overflow = "";
  if (instant) { sh.remove(); sc?.remove(); return; }
  sh.classList.remove("on"); sc?.classList.remove("on"); setTimeout(() => { sh.remove(); sc?.remove(); }, 300);
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

/* ---------- photo ---------- */
function compress(file) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const max = 720, k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement("canvas"); c.width = img.width * k; c.height = img.height * k; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", .72)); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(); };
    img.src = url;
  });
}

/* ---------- share ---------- */
async function share(text) {
  try { if (navigator.share) { await navigator.share({ title: "BunRank", text }); return; } } catch (e) { if (e?.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(text); toast("הטקסט הועתק — אפשר להדביק בוואטסאפ"); } catch { toast("לא הצלחנו לשתף מכאן. נסו מהאפליקציה המותקנת"); }
}
function shareText(list) {
  const top = [...list].sort((a, b) => total(b) - total(a)).slice(0, 5);
  return "טבלת ההמבורגרים שלנו 🍔\n" + top.map((b, i) => `${i + 1}. ${b.name}${b.place ? " · " + b.place : ""} — ${fmt(total(b))}/10`).join("\n");
}

/* ---------- main screen ---------- */
const app = document.getElementById("app");
function sorted() {
  const q = S.q.trim().toLowerCase();
  let l = S.burgers.filter(b => !q || (b.name + " " + (b.place || "")).toLowerCase().includes(q));
  const by = { score: (a, b) => total(b) - total(a), recent: (a, b) => (b.date || "").localeCompare(a.date || "") || b.createdAt - a.createdAt, value: (a, b) => (b.scores.value ?? 0) - (a.scores.value ?? 0) || total(b) - total(a) }[S.sort];
  return l.sort(by);
}
function rankMap() { const m = {}; [...S.burgers].sort((a, b) => total(b) - total(a)).forEach((b, i) => (m[b.id] = i + 1)); return m; }
let justAdded = null;
function refresh() { S.burgers = Store.list(); render(); }
function render() {
  const ranks = rankMap(), list = sorted();
  const isDark = document.documentElement.dataset.theme === "dark";
  let body;
  if (S.loading) {
    body = `<div class="empty"><p>טוענים את הטבלה…</p></div>`;
  } else if (!S.burgers.length) {
    body = `<div class="empty">${BURGER_ART}<h2>עוד לא דירגתם אף המבורגר</h2><p>אכלתם המבורגר לאחרונה? דרגו אותו ותתחילו את הטבלה${Store.mode === "shared" ? " — כל מי שיש לו את הקישור יראה אותה וידרג איתכם" : ""}.</p></div>`;
  } else if (!list.length) {
    body = `<div class="empty"><h2>לא מצאנו את "${esc(S.q)}"</h2><p>נסו שם אחר של מקום או של המבורגר.</p><button class="btn" data-act="clear-q" style="width:auto">ניקוי החיפוש</button></div>`;
  } else {
    const showHero = S.sort === "score" && !S.q && list.length > 0;
    const first = showHero ? list[0] : null, rest = showHero ? list.slice(1) : list;
    body = `${first ? `<div class="podium"><button class="hero${justAdded === first.id ? " card new" : ""}" data-open="${first.id}" style="padding:0">
        <div class="hero-img">${first.photo ? `<img src="${first.photo}" alt="${esc(first.name)}">` : ic("img")}</div>
        <div class="hero-body"><div class="card-body"><span class="badge">${ic("award")} מקום ראשון</span><span class="card-title">${esc(first.name)}</span><span class="card-sub">${first.place ? ic("pin") + esc(first.place) : fmtDate(first.date)}</span></div>
        <div class="score"><b>${fmt(total(first))}</b><small>${first.raters.length > 1 ? first.raters.length + " דירוגים" : "מתוך 10"}</small></div></div></button></div>` : ""}
      <ul class="list">${rest.map(b => `<li><button class="card${justAdded === b.id ? " new" : ""}" data-open="${b.id}">
        <span class="rank${ranks[b.id] === 1 ? " r1" : ""}">${ranks[b.id]}</span>
        <span class="thumb">${b.photo ? `<img src="${b.photo}" alt="" loading="lazy">` : ic("img")}</span>
        <span class="card-body"><span class="card-title">${esc(b.name)}</span><span class="card-sub">${b.place ? ic("pin") + esc(b.place) : fmtDate(b.date)}</span></span>
        <span class="score"><b>${fmt(total(b))}</b><small>${b.raters.length > 1 ? b.raters.length + " דירוגים" : "/10"}</small></span></button></li>`).join("")}</ul>`;
  }
  app.innerHTML = `
    <header class="top"><div class="brand"><img src="icons/icon-192.png" alt="">BunRank</div>
      <div class="top-actions"><button class="icon-btn" data-act="theme" aria-label="${isDark ? "מצב בהיר" : "מצב כהה"}">${ic(isDark ? "sun" : "moon")}</button><button class="icon-btn" data-act="settings" aria-label="הגדרות">${ic("settings")}</button></div></header>
    <h1 class="title">ההמבורגרים שלנו</h1>
    <p class="lead">${S.burgers.length ? `${S.burgers.length === 1 ? "המבורגר אחד" : S.burgers.length + " המבורגרים"} · ${(k => k === 1 ? "מדרג אחד" : k + " מדרגים")(new Set(S.burgers.flatMap(b => b.raters.map(r => r.uid))).size)}${Store.mode === "shared" ? " · טבלה משותפת" : ""}` : "כל ההמבורגרים שאכלתם, מדורגים מהטוב ביותר"}</p>
    ${S.burgers.length ? `<label class="search">${ic("search")}<input type="search" placeholder="חיפוש מקום או המבורגר" value="${esc(S.q)}" aria-label="חיפוש"></label>
    <div class="chips" role="group" aria-label="מיון">${[["score", "הכי טובים"], ["recent", "אחרונים"], ["value", "הכי שווים"]].map(([k, l]) => `<button class="chip" data-sort="${k}" aria-pressed="${S.sort === k}">${l}</button>`).join("")}</div>` : ""}
    ${body}
    <div class="dock"><div class="inner"><button class="btn btn-primary" data-act="add">${ic("plus")}דרגו המבורגר</button>${S.burgers.length ? `<button class="icon-btn" style="width:56px;height:56px;border-radius:var(--radius);flex:none" data-act="share" aria-label="שיתוף הטבלה">${ic("share")}</button>` : ""}</div></div>`;
  justAdded = null;
  const inp = app.querySelector(".search input");
  if (inp) inp.oninput = e => { S.q = e.target.value; const pos = e.target.selectionStart; render(); const n = app.querySelector(".search input"); n.focus(); n.setSelectionRange(pos, pos); };
}
app.addEventListener("click", e => {
  const o = e.target.closest("[data-open]"); if (o) return openDetail(o.dataset.open);
  const s = e.target.closest("[data-sort]"); if (s) { S.sort = s.dataset.sort; return render(); }
  const a = e.target.closest("[data-act]")?.dataset.act;
  if (a === "add") openEditor();
  if (a === "theme") { ls.set("theme", document.documentElement.dataset.theme === "dark" ? "light" : "dark"); applyTheme(); render(); }
  if (a === "settings") openSettings();
  if (a === "share") share(shareText(S.burgers));
  if (a === "clear-q") { S.q = ""; render(); }
});

/* ---------- editor ---------- */
function sliderHTML(c, v) {
  return `<div class="slider"><div class="slider-top"><span>${c.label}${weightOf(c.id) > 1 ? `<em>חשוב לכם</em>` : ""}</span><b data-out="${c.id}">${v}</b></div>
    <input type="range" min="1" max="10" step="1" value="${v}" name="${c.id}" aria-label="${c.label}"></div>`;
}
function openEditor(id) {
  const b = id ? S.burgers.find(x => x.id === id) : null;
  const mine = b?.mine;
  const d = b || { name: "", place: "", date: today(), price: "", photo: null };
  const sc = mine?.scores || Object.fromEntries(CRITERIA.map(c => [c.id, 7]));
  const others = b ? b.raters.filter(r => r.uid !== Store.me).length : 0;
  let photo = d.photo;
  openSheet(`<form id="ed" novalidate>
    <div class="sheet-head"><h2>${!b ? "דירוג חדש" : mine ? "הדירוג שלי" : "דרגו גם אתם"}</h2><button type="button" class="icon-btn" data-close aria-label="סגירה">${ic("x")}</button></div>
    ${b && others ? `<p class="lead" style="margin-top:-16px">${others === 1 ? "חבר אחד כבר דירג" : others + " חברים כבר דירגו"}. הציון שלכם ייכנס לממוצע.</p>` : ""}
    <label class="field"><span>תמונה</span><div class="photo-pick" id="pp">${photo ? `<img src="${photo}" alt="">` : `${ic("camera")}<span>צלמו או בחרו תמונה</span>`}<input type="file" accept="image/*" aria-label="הוספת תמונה"></div></label>
    <label class="field"><span>שם ההמבורגר</span><input class="input" name="name" required placeholder="למשל: דאבל צ׳יזבורגר" value="${esc(d.name)}" autocomplete="off"></label>
    <label class="field"><span>מקום</span><input class="input" name="place" placeholder="שם המסעדה" value="${esc(d.place)}" list="places" autocomplete="off"></label>
    <datalist id="places">${[...new Set(S.burgers.map(x => x.place).filter(Boolean))].map(p => `<option value="${esc(p)}">`).join("")}</datalist>
    <div class="row2"><label class="field"><span>תאריך</span><input class="input" type="date" name="date" value="${esc(d.date)}"></label>
    <label class="field"><span>מחיר (₪)</span><input class="input" name="price" inputmode="decimal" placeholder="68" value="${esc(d.price)}"></label></div>
    <div class="total-live"><span style="font-weight:600">הציון שלי</span><b id="tl">${fmt(total({ scores: sc }))}</b></div>
    ${CRITERIA.map(c => sliderHTML(c, sc[c.id] ?? 7)).join("")}
    <label class="field"><span>הערות</span><textarea class="input" name="notes" placeholder="מה היה מיוחד? מה הייתם משנים?">${esc(mine?.notes || "")}</textarea></label>
    <button class="btn btn-primary" type="submit">${!b ? "הוספה לטבלה" : mine ? "שמירת השינויים" : "שמירת הדירוג שלי"}</button>
  </form>`, sh => {
    const f = sh.querySelector("#ed");
    const readScores = () => Object.fromEntries(CRITERIA.map(c => [c.id, +f.elements[c.id].value]));
    f.addEventListener("input", e => { if (e.target.type === "range") { sh.querySelector(`[data-out=${e.target.name}]`).textContent = e.target.value; sh.querySelector("#tl").textContent = fmt(total({ scores: readScores() })); } });
    f.querySelector("input[type=file]").addEventListener("change", async e => {
      const file = e.target.files[0]; if (!file) return;
      try { photo = await compress(file); const pp = sh.querySelector("#pp"); pp.querySelector("img")?.remove(); pp.querySelectorAll(":scope>svg,:scope>span").forEach(n => n.remove()); pp.insertAdjacentHTML("afterbegin", `<img src="${photo}" alt="">`); }
      catch { toast("לא הצלחנו לקרוא את התמונה. נסו תמונה אחרת"); }
    });
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const name = f.elements.name.value.trim();
      if (!name) { f.elements.name.focus(); f.elements.name.style.borderColor = "var(--danger)"; toast("חסר שם להמבורגר"); return; }
      const btn = f.querySelector("[type=submit]"); btn.disabled = true;
      try {
        const rec = await Store.saveBurger({ ...(b || { id: uid(), createdAt: Date.now() }), name, place: f.elements.place.value.trim(), date: f.elements.date.value || today(), price: f.elements.price.value.trim(), photo }, readScores(), f.elements.notes.value.trim());
        justAdded = rec.id; closeSheet(); refresh();
        toast(b ? (mine ? "השינויים נשמרו" : "הדירוג שלכם נוסף") : `נכנס לטבלה במקום ${rankMap()[rec.id] || 1}`);
        requestAnimationFrame(() => app.querySelector(`[data-open="${rec.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
      } catch { btn.disabled = false; toast("הדירוג לא נשמר. בדקו את החיבור ונסו שוב"); }
    });
  });
}

/* ---------- detail ---------- */
function openDetail(id) {
  const b = S.burgers.find(x => x.id === id); if (!b) return;
  const r = rankMap()[id];
  const n = b.raters.length;
  openSheet(`<div class="sheet-head"><h2>${esc(b.name)}</h2><button class="icon-btn" data-close aria-label="סגירה">${ic("x")}</button></div>
    <div class="d-img">${b.photo ? `<img src="${b.photo}" alt="${esc(b.name)}">` : ic("img")}</div>
    <div class="total-live"><span><span style="display:block;font-weight:600">${n > 1 ? `ממוצע של ${n} דירוגים` : "ציון כולל"}</span><span style="color:var(--text-muted);font-size:14px">מקום ${r} מתוך ${S.burgers.length}</span></span><b>${fmt(total(b))}</b></div>
    <div class="meta">${b.place ? `<span>${ic("pin")}${esc(b.place)}</span>` : ""}${b.date ? `<span>${ic("cal")}${fmtDate(b.date)}</span>` : ""}${b.price ? `<span>${ic("coins")}₪${esc(b.price)}</span>` : ""}</div>
    <div class="bars">${CRITERIA.map(c => `<div class="bar-row"><span>${c.label}</span><span class="bar"><i style="width:${(b.scores[c.id] ?? 0) * 10}%"></i></span><b>${b.scores[c.id] != null ? fmt(b.scores[c.id]) : "–"}</b></div>`).join("")}</div>
    ${n ? `<p class="group-label">מי דירג</p><div class="group">${b.raters.map(x => `<div class="group-row" style="flex-wrap:wrap;padding-block:12px"><span style="display:flex;align-items:center;gap:8px">${ic("users")}<span>${esc(Store.name(x.uid))}</span></span><b>${fmt(total(x))}</b>${x.notes ? `<span style="flex-basis:100%;color:var(--text-muted);font-size:14px;line-height:1.5;white-space:pre-wrap">${esc(x.notes)}</span>` : ""}</div>`).join("")}</div>` : ""}
    <div class="actions"><button class="btn ${b.mine ? "" : "btn-primary"}" data-d="edit">${ic(b.mine ? "pencil" : "plus")}${b.mine ? "עריכת הדירוג שלי" : "דרגו גם אתם"}</button><button class="btn" data-d="share">${ic("share")}שיתוף</button>${Store.canDelete(b) ? `<button class="btn btn-ghost btn-danger" data-d="del">${ic("trash")}מחיקה</button>` : ""}</div>`, sh => {
    sh.addEventListener("click", async e => {
      const a = e.target.closest("[data-d]")?.dataset.d;
      if (a === "edit") openEditor(id);
      if (a === "share") share(`${b.name}${b.place ? " ב" + b.place : ""} — ${fmt(total(b))}/10 🍔\nמקום ${r} בטבלה שלנו`);
      if (a === "del" && await confirmDialog({ title: "למחוק את ההמבורגר?", text: `"${b.name}" וכל הדירוגים שלו יימחקו מהטבלה${Store.mode === "shared" ? " אצל כולם" : ""}. אי אפשר לבטל.`, ok: "מחיקה", danger: true })) {
        try { await Store.removeBurger(id); closeSheet(); refresh(); toast("נמחק מהטבלה"); } catch { toast("לא הצלחנו למחוק. נסו שוב"); }
      }
    });
  });
}

/* ---------- settings ---------- */
function openSettings() {
  const t = ls.get("theme", "auto");
  openSheet(`<div class="sheet-head"><h2>הגדרות</h2><button class="icon-btn" data-close aria-label="סגירה">${ic("x")}</button></div>
    <p class="group-label">מראה</p>
    <div class="group"><div class="group-row"><span>צבעים</span><div class="seg">${[["auto", "אוטומטי"], ["light", "בהיר"], ["dark", "כהה"]].map(([k, l]) => `<button data-theme-set="${k}" aria-pressed="${t === k}">${l}</button>`).join("")}</div></div></div>
    <p class="group-label">מה חשוב לכם (מקבל משקל כפול בציון)</p>
    <div class="grid2" style="margin-bottom:var(--s3)">${CRITERIA.map(c => `<button class="opt" data-pref="${c.id}" aria-pressed="${S.prefs.includes(c.id)}"><span class="tick">${ic("check")}</span><b>${c.label}</b><small>${c.hint}</small></button>`).join("")}</div>
    <p class="group-label">גיבוי</p>
    <div class="group"><button class="group-row" data-s="export"><span>העתקת גיבוי (בלי תמונות)</span>${ic("copy")}</button><button class="group-row" data-s="import"><span>שחזור מגיבוי</span>${ic("back")}</button></div>
    <p class="group-label">אחר</p>
    <div class="group"><button class="group-row" data-s="onboarding"><span>הצגת שאלון הפתיחה מחדש</span>${ic("back")}</button></div>`, sh => {
    sh.addEventListener("click", async e => {
      const th = e.target.closest("[data-theme-set]");
      if (th) { ls.set("theme", th.dataset.themeSet); applyTheme(); sh.querySelectorAll("[data-theme-set]").forEach(x => x.setAttribute("aria-pressed", x === th)); render(); }
      const pf = e.target.closest("[data-pref]");
      if (pf) { const k = pf.dataset.pref; S.prefs = S.prefs.includes(k) ? S.prefs.filter(x => x !== k) : [...S.prefs, k]; ls.set("prefs", S.prefs); pf.setAttribute("aria-pressed", S.prefs.includes(k)); render(); }
      const a = e.target.closest("[data-s]")?.dataset.s;
      if (a === "export") { try { await navigator.clipboard.writeText(JSON.stringify(S.burgers.map(b => ({ id: b.id, name: b.name, place: b.place, date: b.date, price: b.price, scores: b.mine?.scores || b.scores, notes: b.mine?.notes || "" })))); toast("הגיבוי הועתק"); } catch { toast("לא הצלחנו להעתיק. נסו שוב"); } }
      if (a === "import") openImport();
      if (a === "onboarding") { closeSheet(); startOnboarding(); }
    });
  });
}
function openImport() {
  openSheet(`<div class="sheet-head"><h2>שחזור מגיבוי</h2><button class="icon-btn" data-close aria-label="סגירה">${ic("x")}</button></div>
    <label class="field"><span>הדביקו כאן את טקסט הגיבוי</span><textarea class="input" id="imp" style="height:160px" dir="ltr"></textarea></label>
    <button class="btn btn-primary" id="impgo">הוספת הדירוגים</button>`, sh => {
    sh.querySelector("#impgo").onclick = async () => {
      try {
        const arr = JSON.parse(sh.querySelector("#imp").value); if (!Array.isArray(arr)) throw 0;
        const ids = new Set(S.burgers.map(b => b.id)); const add = arr.filter(b => b && b.name && b.scores && !ids.has(b.id));
        for (const b of add) await Store.saveBurger({ ...b, photo: null }, b.scores, b.notes || "");
        closeSheet(); refresh(); toast(`נוספו ${add.length} המבורגרים`);
      } catch { toast("הטקסט הזה לא נראה כמו גיבוי. העתיקו אותו שוב"); }
    };
  });
}

/* ---------- onboarding (goodonboarding) ---------- */
const GOALS = [["🏆", "למצוא את ההמבורגר הכי טוב שיש"], ["👥", "להכריע סוף סוף מי צודק בחבר׳ה"], ["📍", "לזכור איפה היה טעים ואיפה לא"], ["💸", "לדעת איפה שווה את הכסף"], ["🗺️", "לנסות כל שבוע מקום חדש"]];
const PAINS = [
  ["שוכחים איך קראו למקום ההוא", "כל המבורגר נשמר עם שם, מקום, תאריך ותמונה"],
  ["כל אחד זוכר את זה אחרת", "ציון מ-1 עד 10 על כל פרט, כתוב ושמור"],
  ["ויכוחים בלי סוף מי הכי טוב", "טבלה שמסתדרת לבד, מהטוב ביותר למטה"],
  ["משלמים הרבה על המבורגר בינוני", "ציון ״תמורה למחיר״ ומיון של הכי שווים"],
  ["לא סומכים על ביקורות ברשת", "הדירוג הוא שלכם בלבד, לפי מה שחשוב לכם"],
];
function startOnboarding() {
  const st = { step: 0, goal: ls.get("ob-goal", null), pains: [], prefs: [...S.prefs], burger: null };
  const ob = document.createElement("div"); ob.className = "ob"; ob.setAttribute("role", "dialog"); ob.setAttribute("aria-label", "שאלון פתיחה");
  document.body.appendChild(ob); document.body.style.overflow = "hidden";
  const STEPS = 7;
  const draw = () => {
    const s = st.step, pct = Math.round(((s + 1) / STEPS) * 100);
    let body = "", foot = "";
    if (s === 0) {
      body = `<h1>מה הכי מעניין אתכם?</h1><p class="lead">נבנה לכם את הטבלה לפי זה.</p><div class="opts">${GOALS.map(([em, l], i) => `<button class="opt" data-goal="${i}" aria-pressed="${st.goal === i}"><span class="em">${em}</span>${l}<span class="tick">${ic("check")}</span></button>`).join("")}</div>`;
      foot = `<button class="btn btn-primary" data-next ${st.goal == null ? "disabled" : ""}>המשך</button>`;
    } else if (s === 1) {
      body = `<h1>מה מעצבן היום?</h1><p class="lead">אפשר לבחור כמה.</p><div class="opts">${PAINS.map(([p], i) => `<button class="opt" data-pain="${i}" aria-pressed="${st.pains.includes(i)}">${p}<span class="tick">${ic("check")}</span></button>`).join("")}</div>`;
      foot = `<button class="btn btn-primary" data-next>${st.pains.length ? "ככה בדיוק" : "דילוג"}</button>`;
    } else if (s === 2) {
      const picked = st.pains.length ? st.pains : [0, 2];
      body = `<h1>הנה מה שמשתנה</h1><p class="lead">לכל דבר שבחרתם, יש פתרון.</p><div class="sol">${picked.map(i => `<div class="sol-item"><div class="pain">${PAINS[i][0]}</div><div class="fix">${ic("check")}${PAINS[i][1]}</div></div>`).join("")}</div>`;
      foot = `<button class="btn btn-primary" data-next>מעולה, הלאה</button>`;
    } else if (s === 3) {
      body = `<h1>מה הכי חשוב לכם בהמבורגר?</h1><p class="lead">מה שתבחרו יקבל משקל כפול בציון הכולל. אפשר לשנות אחר כך.</p><div class="grid2">${CRITERIA.map(c => `<button class="opt" data-pref="${c.id}" aria-pressed="${st.prefs.includes(c.id)}"><span class="tick">${ic("check")}</span><b>${c.label}</b><small>${c.hint}</small></button>`).join("")}</div>`;
      foot = `<button class="btn btn-primary" data-next>בנו לי את הטבלה</button>`;
    } else if (s === 4) {
      body = `<div class="processing"><div class="stack"><i></i><i></i><i></i><i></i><i></i></div><h1 style="font-size:24px">בונים לכם את טבלת הדירוג…</h1><p class="lead" style="margin:0">${st.prefs.length ? "עם דגש על " + st.prefs.map(id => CRITERIA.find(c => c.id === id).label).join(" ו") : "כל הפרמטרים שווים"}</p></div>`;
      setTimeout(() => { if (st.step === 4) { st.step = 5; draw(); } }, 1700);
    } else if (s === 5) {
      const sc = st.demo || (st.demo = Object.fromEntries(CRITERIA.map(c => [c.id, 7])));
      body = `<h1>דרגו את ההמבורגר האחרון שאכלתם</h1><p class="lead">לוקח חצי דקה. תמונה ופרטים אפשר להוסיף אחר כך.</p>
        <label class="field"><span>שם ההמבורגר</span><input class="input" id="dn" placeholder="למשל: הקלאסי" value="${esc(st.dname || "")}"></label>
        <label class="field"><span>מקום</span><input class="input" id="dp" placeholder="שם המסעדה" value="${esc(st.dplace || "")}"></label>
        <div class="total-live"><span style="font-weight:600">ציון כולל</span><b id="dtl">${fmt(totalWith(sc, st.prefs))}</b></div>
        ${CRITERIA.map(c => `<div class="slider"><div class="slider-top"><span>${c.label}${st.prefs.includes(c.id) ? "<em>חשוב לכם</em>" : ""}</span><b data-out="${c.id}">${sc[c.id]}</b></div><input type="range" min="1" max="10" value="${sc[c.id]}" name="${c.id}" aria-label="${c.label}"></div>`).join("")}`;
      foot = `<button class="btn btn-primary" data-demo ${st.dname ? "" : "disabled"}>הכניסו לטבלה</button><button class="btn btn-ghost" data-skip>אדרג אחר כך</button>`;
    } else if (s === 6) {
      const b = st.burger;
      body = `<div class="result">${b ? `<span class="badge">${ic("award")} מקום ${rankMap()[b.id] || 1} בטבלה</span><div class="result-card"><span class="card-title" style="font-size:22px;white-space:normal">${esc(b.name)}</span>${b.place ? `<span class="card-sub" style="justify-content:center">${ic("pin")}${esc(b.place)}</span>` : ""}<div class="big">${fmt(total(b))}</div><p class="lead" style="margin:0">מתוך 10</p></div><h1 style="font-size:24px">הטבלה שלכם נפתחה</h1><p class="lead">כל המבורגר הבא יתמקם בה לבד. עכשיו אפשר להתחיל להתווכח עם נתונים.</p>` : `${BURGER_ART.replace("<svg", '<svg width="120" height="120"')}<h1 style="font-size:26px;margin-top:var(--s3)">הכול מוכן</h1><p class="lead">בפעם הבאה שאתם אוכלים המבורגר, לחצו על ״דרגו המבורגר״.</p>`}</div>`;
      foot = `<button class="btn btn-primary" data-done>לטבלה שלי</button>${b ? `<button class="btn" data-share>${ic("share")}שלחו לחבר׳ה</button>` : ""}`;
    }
    ob.innerHTML = `<div class="ob-top">${s > 0 && s !== 4 && s !== 6 ? `<button class="icon-btn" data-back aria-label="חזרה">${ic("back")}</button>` : `<span style="width:48px"></span>`}<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div></div><div class="ob-body enter">${body}</div>${foot ? `<div class="ob-foot">${foot}</div>` : ""}`;
    if (s === 5) {
      const upd = () => { const btn = ob.querySelector("[data-demo]"); btn.disabled = !ob.querySelector("#dn").value.trim(); };
      ob.querySelector("#dn").oninput = e => { st.dname = e.target.value; upd(); };
      ob.querySelector("#dp").oninput = e => { st.dplace = e.target.value; };
      ob.querySelectorAll("input[type=range]").forEach(r => r.oninput = () => { st.demo[r.name] = +r.value; ob.querySelector(`[data-out=${r.name}]`).textContent = r.value; ob.querySelector("#dtl").textContent = fmt(totalWith(st.demo, st.prefs)); });
    }
  };
  const finish = () => { ls.set("onboarded", true); ob.remove(); document.body.style.overflow = ""; refresh(); };
  ob.addEventListener("click", async e => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.goal != null) { st.goal = +t.dataset.goal; ls.set("ob-goal", st.goal); draw(); return; }
    if (t.dataset.pain != null) { const i = +t.dataset.pain; st.pains = st.pains.includes(i) ? st.pains.filter(x => x !== i) : [...st.pains, i]; draw(); return; }
    if (t.dataset.pref != null) { const k = t.dataset.pref; st.prefs = st.prefs.includes(k) ? st.prefs.filter(x => x !== k) : [...st.prefs, k]; draw(); return; }
    if ("back" in t.dataset) { st.step = st.step === 5 ? 3 : st.step - 1; draw(); return; }
    if ("next" in t.dataset) { if (st.step === 3) { S.prefs = st.prefs; ls.set("prefs", S.prefs); } st.step++; draw(); return; }
    if ("demo" in t.dataset) {
      try { const rec = await Store.saveBurger({ id: uid(), createdAt: Date.now(), name: st.dname.trim(), place: (st.dplace || "").trim(), date: today(), price: "", photo: null }, { ...st.demo }, "");
        S.burgers = Store.list(); st.burger = S.burgers.find(x => x.id === rec.id); justAdded = rec.id; st.step = 6; draw(); } catch { toast("לא הצלחנו לשמור. בדקו את החיבור ונסו שוב"); } return;
    }
    if ("skip" in t.dataset) { st.burger = null; st.step = 6; draw(); return; }
    if ("share" in t.dataset) { const b = st.burger; share(`דירגתי את ${b.name}${b.place ? " ב" + b.place : ""}: ${fmt(total(b))}/10 🍔\nבואו נבנה טבלה של ההמבורגרים הכי טובים שאכלנו`); return; }
    if ("done" in t.dataset) finish();
  });
  draw();
}
function totalWith(scores, prefs) { let s = 0, w = 0; for (const c of CRITERIA) { const k = prefs.includes(c.id) ? 2 : 1; s += scores[c.id] * k; w += k; } return Math.round((s / w) * 10) / 10; }

/* ---------- boot ---------- */
async function boot() {
  applyTheme();
  render();
  Store.on(() => { if (!S.loading) refresh(); });
  Store.init().then(async () => { await Store.loadOwner(); S.loading = false; refresh(); });
  // dev reset: add ?reset to the URL (clears this device only)
  if (location.search.includes("reset")) { try { localStorage.clear(); sessionStorage.clear(); } catch {} await Store.resetLocal(); S.prefs = ["taste", "patty"]; }
  const onboarded = ls.get("onboarded", false);
  let seen = false; try { seen = sessionStorage.getItem("bunrank-intro-seen") === "1"; } catch {}
  const after = () => { if (!ls.get("onboarded", false)) startOnboarding(); };
  if (!seen) {
    const host = document.createElement("div"); document.body.appendChild(host);
    const unmount = mountBurgerIntro(host, {
      name: "BunRank",
      headline: 'מי ההמבורגר<br/>הכי <span class="bi-accent">טוב?</span>',
      welcome: "ברוכים הבאים",
      subtitle: "מדרגים כל המבורגר שאכלתם, ורואים סוף סוף מי באמת מספר אחת.",
      hint: "החליקו למעלה",
      buttons: onboarded ? [{ id: "go", label: "לטבלה שלי", dark: true }] : [{ id: "go", label: "בואו נתחיל", dark: true }],
      onEnter: () => { try { sessionStorage.setItem("bunrank-intro-seen", "1"); } catch {} unmount(); host.remove(); after(); },
    });
  } else after();
}
boot();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
