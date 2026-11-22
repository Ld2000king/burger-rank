import { mountRankIntro } from "./rank-intro.js";
import { TOPICS, CUSTOM, topicOf, customTopic } from "./topics.js";
import { createBackend, myGroupIds, rid, JoinError } from "./backend.js";
import "./tap.js";

/* ---------- icons (Lucide, 2px stroke) ---------- */
const P = {
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  settings:'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  back:'<path d="m9 18 6-6-6-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  pencil:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  userPlus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
};
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const BURGER_ART = `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="110" rx="46" ry="4" fill="currentColor" opacity=".08"/><rect x="44" y="60" width="32" height="48" rx="4" fill="#E8B730"/><rect x="12" y="76" width="32" height="32" rx="4" fill="#B9C0C8"/><rect x="76" y="86" width="32" height="22" rx="4" fill="#CD8A4E"/><text x="60" y="92" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" font-family="Heebo,sans-serif">1</text><text x="28" y="98" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="Heebo,sans-serif">2</text><text x="92" y="102" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Heebo,sans-serif">3</text><path d="M60 18l6 12 13 2-9.5 9 2.3 13L60 48l-11.8 6 2.3-13-9.5-9 13-2z" fill="#E8B730"/></svg>`;

/* ---------- helpers ---------- */
const T = () => topicOf(S.groups[S.gid]);
const CRIT = () => T().criteria;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ls = {
  get(k, d) { try { const v = localStorage.getItem("ranks:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("ranks:" + k, JSON.stringify(v)); } catch {} },
};
const fmt = n => (Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1));
const avg = a => (a.length ? Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 10) / 10 : null);
const scoreOf = scores => avg(CRIT().map(c => scores?.[c.id]).filter(v => v != null)) ?? 0;
const initial = s => (String(s || "?").trim()[0] || "?").toUpperCase();
const plural = (n, one, many) => (n === 1 ? one : `${n} ${many}`);
const joinUrl = code => `${location.origin}${location.pathname}?join=${code}`;

/* ---------- state ---------- */
let be = null;
const S = { name: ls.get("name", ""), gid: ls.get("gid", null), groups: {}, data: null, sort: "rank", q: "", loading: true };
let unwatch = null, justAdded = null;

function places() {
  if (!S.data) return [];
  const members = Object.fromEntries(S.data.members.map(m => [m.id, m]));
  return S.data.places.map(p => {
    const rs = S.data.ratings.filter(r => r.pid === p.id && r.scores);
    const crit = Object.fromEntries(CRIT().map(c => [c.id, avg(rs.map(r => r.scores[c.id]).filter(v => v != null))]));
    return { ...p, raters: rs.map(r => ({ ...r, who: r.uid === be.uid ? "אני" : members[r.uid]?.name || "חבר שעזב" })), crit, total: avg(rs.map(r => scoreOf(r.scores))) ?? 0, mine: rs.find(r => r.uid === be.uid) || null };
  });
}
function ranked() { return places().filter(p => p.raters.length).sort((a, b) => b.total - a.total || b.raters.length - a.raters.length || a.name.localeCompare(b.name)); }
function rankMap() { const m = {}; ranked().forEach((p, i) => (m[p.id] = i + 1)); return m; }

/* ---------- theme ---------- */
function applyTheme() {
  const t = ls.get("theme", "auto");
  const dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector("meta[name=theme-color]")?.setAttribute("content", dark ? "#14110F" : "#FBF7F1");
}
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);

/* ---------- toast / dialog / sheet ---------- */
let toastT;
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2400); }
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
const sheetHead = t => `<div class="sheet-head"><h2>${t}</h2><button type="button" class="icon-btn" data-close aria-label="סגירה">${ic("x")}</button></div>`;

/* ---------- photo / share ---------- */
function compress(file) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, 640 / Math.max(img.width, img.height)); const c = document.createElement("canvas"); c.width = img.width * k; c.height = img.height * k; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", .7)); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(); };
    img.src = url;
  });
}
async function share(text, url) {
  try { if (navigator.share) { await navigator.share({ title: "Ranks", text, url }); return; } } catch (e) { if (e?.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(url ? `${text}\n${url}` : text); toast("הועתק — אפשר להדביק בוואטסאפ"); } catch { toast("לא הצלחנו לשתף. העתיקו את הקוד ידנית"); }
}
const inviteText = g => { const t = topicOf(g); return `בואו לדרג איתי ${t.name} בקבוצה "${g.name}" ${t.emoji}\nקוד הצטרפות: ${g.code}`; };

/* ---------- groups ---------- */
async function loadGroups() {
  const ids = myGroupIds.get();
  const infos = await Promise.all(ids.map(id => be.groupInfo(id).catch(() => null)));
  S.groups = {}; ids.forEach((id, i) => { if (infos[i]) S.groups[id] = infos[i]; });
  if (!S.groups[S.gid]) S.gid = Object.keys(S.groups)[0] || null;
  ls.set("gid", S.gid);
}
function selectGroup(gid) {
  S.gid = gid; ls.set("gid", gid); S.data = null; S.loading = !!gid;
  unwatch?.(); unwatch = null;
  if (gid) unwatch = be.watchGroup(gid, d => {
    S.loading = false;
    if (!d) { toast("לא הצלחנו לטעון את הקבוצה. בדקו את החיבור"); render(); return; }
    S.data = d; if (d.group) S.groups[gid] = d.group;
    render();
  });
  render();
}
async function createGroup(name, topic) {
  const id = await be.createGroup(name, S.name, topic);
  S.groups[id] = await be.groupInfo(id); selectGroup(id); return id;
}
async function joinGroup(code) {
  const id = await be.joinByCode(code.trim().toUpperCase(), S.name);
  S.groups[id] = await be.groupInfo(id); selectGroup(id); return id;
}
const joinErrorText = e => (e instanceof JoinError ? "לא מצאנו קבוצה עם הקוד הזה. בדקו אותו ונסו שוב" : "לא הצלחנו להצטרף. בדקו את החיבור ונסו שוב");

/* ---------- main screen ---------- */
const app = document.getElementById("app");
const MEDAL = ["gold", "silver", "bronze"];
function podiumHTML(top) {
  const slot = (p, i) => p ? `<button class="pod pod-${i + 1}${justAdded === p.id ? " new" : ""}" data-open="${p.id}">
      <span class="pod-avatar ${MEDAL[i]}">${p.photo ? `<img src="${p.photo}" alt="">` : `<b>${esc(initial(p.name))}</b>`}<i>${i + 1}</i></span>
      <span class="pod-name">${esc(p.name)}</span>
      <span class="pod-score">${fmt(p.total)}</span>
      <span class="pod-step ${MEDAL[i]}"><span>${["מקום ראשון", "מקום שני", "מקום שלישי"][i]}</span></span></button>`
    : `<div class="pod pod-${i + 1} pod-empty"><span class="pod-avatar"><b>?</b><i>${i + 1}</i></span><span class="pod-name">פנוי</span><span class="pod-score">&nbsp;</span><span class="pod-step"><span>${["מקום ראשון", "מקום שני", "מקום שלישי"][i]}</span></span></div>`;
  return `<section class="podium-wrap" aria-label="פודיום">${slot(top[1], 1)}${slot(top[0], 0)}${slot(top[2], 2)}</section>`;
}
function rowHTML(p, rank) {
  return `<li><button class="card${justAdded === p.id ? " new" : ""}" data-open="${p.id}">
    <span class="rank">${rank ?? "–"}</span>
    <span class="thumb">${p.photo ? `<img src="${p.photo}" alt="" loading="lazy">` : ic("img")}</span>
    <span class="card-body"><span class="card-title">${esc(p.name)}</span><span class="card-sub">${p.city ? ic("pin") + esc(p.city) + " · " : ""}${p.mine ? plural(p.raters.length, "דירוג אחד", "דירוגים") : `<b class="need">חסר הדירוג שלך</b>`}</span></span>
    <span class="score"><b>${p.raters.length ? fmt(p.total) : "–"}</b><small>/10</small></span></button></li>`;
}
function render() {
  const isDark = document.documentElement.dataset.theme === "dark";
  const g = S.groups[S.gid];
  const head = `<header class="top"><div class="brand"><img src="icons/icon-192.png" alt="">Ranks</div>
    <div class="top-actions"><button class="icon-btn" data-act="theme" aria-label="${isDark ? "מצב בהיר" : "מצב כהה"}">${ic(isDark ? "sun" : "moon")}</button><button class="icon-btn" data-act="settings" aria-label="הגדרות">${ic("settings")}</button></div></header>`;
  if (!g) {
    app.innerHTML = `${head}<div class="empty">${BURGER_ART}<h2>עוד אין לכם קבוצה</h2><p>צרו קבוצה והזמינו חברים, או הצטרפו לקבוצה של חבר עם הקוד שהוא שלח.</p>
      <div class="actions"><button class="btn btn-primary" data-act="create">${ic("plus")}יצירת קבוצה</button><button class="btn" data-act="join">${ic("key")}הצטרפות עם קוד</button></div></div>`;
    return;
  }
  const all = places(), rk = rankMap(), top = ranked().slice(0, 3), topIds = new Set(top.map(p => p.id));
  const q = S.q.trim().toLowerCase();
  let list = all.filter(p => !q || (p.name + " " + (p.city || "")).toLowerCase().includes(q));
  if (S.sort === "rank") list = list.filter(p => !topIds.has(p.id) || q).sort((a, b) => (rk[a.id] ?? 1e9) - (rk[b.id] ?? 1e9));
  if (S.sort === "mine") list = list.filter(p => !p.mine);
  if (S.sort === "recent") list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const members = S.data?.members || [];
  let body;
  if (S.loading) body = `<div class="empty"><p>טוענים את הטבלה…</p></div>`;
  else if (!all.length) body = `<div class="empty">${BURGER_ART}<h2>הטבלה עוד ריקה</h2><p>הוסיפו את הדירוג הראשון. כל חבר בקבוצה מדרג גם, והממוצע עולה לפודיום.</p></div>`;
  else body = `${S.sort === "rank" && !q ? podiumHTML(top) : ""}
    <label class="search">${ic("search")}<input type="search" placeholder="חיפוש ${T().item}" value="${esc(S.q)}" aria-label="חיפוש"></label>
    <div class="chips" role="group" aria-label="תצוגה">${[["rank", "דירוג"], ["mine", "חסר הדירוג שלי"], ["recent", "אחרונים"]].map(([k, l]) => `<button class="chip" data-sort="${k}" aria-pressed="${S.sort === k}">${l}</button>`).join("")}</div>
    ${list.length ? `<ul class="list">${list.map(p => rowHTML(p, rk[p.id])).join("")}</ul>` : `<div class="empty" style="padding-top:var(--s3)"><p>${S.sort === "mine" ? `דירגתם את כל ה${T().items} בקבוצה. יפה!` : q ? `לא מצאנו את "${esc(S.q)}"` : "כל המקומות כבר על הפודיום"}</p></div>`}`;
  app.innerHTML = `${head}
    <button class="group-pick" data-act="groups"><span class="gp-ic">${ic("users")}</span><span class="gp-body"><span class="gp-label">${T().emoji} ${esc(T().name)}</span><span class="gp-name">${esc(g.name)}</span></span>${ic("down")}</button>
    <h1 class="title">טבלת הדירוג</h1>
    <p class="lead">${all.length} ${T().items} · ${plural(members.length, "חבר אחד", "חברים")}${be.kind === "local" ? " · שמור רק במכשיר הזה" : ""}</p>
    ${body}
    <div class="dock"><div class="inner"><button class="btn btn-primary" data-act="add">${ic("plus")}דרגו ${T().item}</button><button class="icon-btn dock-ic" data-act="invite" aria-label="הזמנת חברים">${ic("userPlus")}</button></div></div>`;
  justAdded = null;
  const inp = app.querySelector(".search input");
  if (inp) inp.oninput = e => { S.q = e.target.value; const pos = e.target.selectionStart; render(); const n = app.querySelector(".search input"); n?.focus(); n?.setSelectionRange(pos, pos); };
}
app.addEventListener("click", e => {
  const o = e.target.closest("[data-open]"); if (o) return openDetail(o.dataset.open);
  const s = e.target.closest("[data-sort]"); if (s) { S.sort = s.dataset.sort; return render(); }
  const a = e.target.closest("[data-act]")?.dataset.act;
  if (a === "add") openRate();
  if (a === "invite") openInvite();
  if (a === "groups") openGroups();
  if (a === "create") needName(openCreate);
  if (a === "join") needName(() => openJoin());
  if (a === "theme") { ls.set("theme", document.documentElement.dataset.theme === "dark" ? "light" : "dark"); applyTheme(); render(); }
  if (a === "settings") openSettings();
});

/* ---------- name ---------- */
function needName(next) { if (S.name) return next(); openName(next); }
function openName(next) {
  openSheet(`${sheetHead("איך קוראים לך?")}<p class="lead" style="margin-top:-16px">ככה החברים יראו מי דירג מה.</p>
    <form id="nf"><label class="field"><span>השם שלך</span><input class="input" name="n" maxlength="24" value="${esc(S.name)}" autocomplete="given-name" required></label><button class="btn btn-primary" type="submit">שמירה</button></form>`, sh => {
    const f = sh.querySelector("#nf"); setTimeout(() => f.elements.n.focus(), 300);
    f.onsubmit = async e => {
      e.preventDefault(); const n = f.elements.n.value.trim(); if (!n) return f.elements.n.focus();
      S.name = n; ls.set("name", n);
      for (const id of Object.keys(S.groups)) be.setMyName(id, n).catch(() => {});
      closeSheet(); render(); next && setTimeout(next, 320);
    };
  });
}

/* ---------- topic picker ---------- */
function topicPickerHTML(tp) {
  return `<p class="group-label">מה מדרגים?</p><div class="topics">${[...TOPICS, CUSTOM].map(t => `<button type="button" class="topic" data-topic="${t.id}" aria-pressed="${tp.id === t.id}"><span class="em">${t.emoji}</span>${t.name}</button>`).join("")}</div>
    ${tp.id === "custom" ? `<div class="custom-topic"><label class="field"><span>מה מדרגים?</span><input class="input" data-cname maxlength="24" placeholder="למשל: שווארמה" value="${esc(tp.name)}"></label>
      <p class="group-label">על מה נותנים ציון? (עד 5)</p>${[0, 1, 2, 3, 4].map(i => `<input class="input crit-in" data-crit="${i}" maxlength="18" placeholder="${["טעם", "שירות", "מחיר", "", ""][i] ? "למשל: " + ["טעם", "שירות", "מחיר"][i] : "קטגוריה נוספת (לא חובה)"}" value="${esc(tp.crit[i] || "")}">`).join("")}</div>`
      : `<p class="crit-preview">ציון על: ${TOPICS.find(t => t.id === tp.id).criteria.map(c => c.label).join(" · ")}</p>`}`;
}
// tp = { id, name, crit[] } — returns a full topic or null if custom is incomplete
function topicFromPick(tp) {
  if (tp.id !== "custom") return TOPICS.find(t => t.id === tp.id);
  if (!tp.name.trim() || !tp.crit.some(c => c.trim())) return null;
  return customTopic(tp.name, tp.crit);
}
function wireTopicPicker(root, tp, redraw, onChange) {
  root.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => { tp.id = b.dataset.topic; redraw(); });
  const cn = root.querySelector("[data-cname]"); if (cn) cn.oninput = e => { tp.name = e.target.value; onChange(); };
  root.querySelectorAll("[data-crit]").forEach(i => i.oninput = e => { tp.crit[+i.dataset.crit] = e.target.value; onChange(); });
}

/* ---------- create / join / invite / switch ---------- */
function openCreate() {
  const tp = { id: "burger", name: "", crit: [] };
  let gname = "";
  const draw = sh => {
    sh.querySelector("#tp").innerHTML = topicPickerHTML(tp);
    wireTopicPicker(sh, tp, () => draw(sh), () => check(sh));
    check(sh);
  };
  const check = sh => { sh.querySelector("[type=submit]").disabled = !(gname.trim() && topicFromPick(tp)); };
  openSheet(`${sheetHead("קבוצה חדשה")}<form id="cf"><label class="field"><span>שם הקבוצה</span><input class="input" name="n" maxlength="32" placeholder="למשל: החבר׳ה מהצבא" required></label><div id="tp"></div><button class="btn btn-primary" type="submit" disabled>יצירת הקבוצה</button></form>`, sh => {
    const f = sh.querySelector("#cf"); setTimeout(() => f.elements.n.focus(), 300);
    f.elements.n.oninput = e => { gname = e.target.value; check(sh); };
    draw(sh);
    f.onsubmit = async e => {
      e.preventDefault(); const topic = topicFromPick(tp); if (!gname.trim() || !topic) return;
      const b = f.querySelector("[type=submit]"); b.disabled = true;
      try { await createGroup(gname.trim(), topic); closeSheet(); setTimeout(() => openInvite(true), 320); }
      catch { b.disabled = false; toast("לא הצלחנו ליצור את הקבוצה. בדקו את החיבור ונסו שוב"); }
    };
  });
}
function openJoin(code = "") {
  openSheet(`${sheetHead("הצטרפות לקבוצה")}<form id="jf"><label class="field"><span>קוד הצטרפות</span><input class="input code-input" name="c" maxlength="6" value="${esc(code)}" placeholder="ABC123" autocapitalize="characters" autocomplete="off" dir="ltr" required></label><button class="btn btn-primary" type="submit">הצטרפות</button></form>`, sh => {
    const f = sh.querySelector("#jf"); setTimeout(() => f.elements.c.focus(), 300);
    f.elements.c.oninput = e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); };
    f.onsubmit = async e => {
      e.preventDefault(); const c = f.elements.c.value.trim(); if (c.length < 6) { toast("הקוד הוא 6 תווים"); return; }
      const b = f.querySelector("[type=submit]"); b.disabled = true;
      try { await joinGroup(c); closeSheet(); toast(`הצטרפת ל"${S.groups[S.gid].name}"`); }
      catch (err) { b.disabled = false; toast(joinErrorText(err)); }
    };
  });
}
function openInvite(fresh) {
  const g = S.groups[S.gid]; if (!g) return;
  openSheet(`${sheetHead(fresh ? "הקבוצה מוכנה!" : "הזמנת חברים")}<p class="lead" style="margin-top:-16px">שלחו לחברים את הקישור או את הקוד. כל מי שמצטרף מדרג, והממוצע של כולם קובע את הפודיום.</p>
    <div class="code-box" dir="ltr" aria-label="קוד הצטרפות">${esc(g.code)}</div>
    ${be.kind === "local" ? `<p class="warn">${ic("alert")}<span>הקבוצה שמורה כרגע רק במכשיר הזה. חברים יוכלו להצטרף אחרי שנחבר את מסד הנתונים.</span></p>` : ""}
    <div class="actions"><button class="btn btn-primary" data-i="share">${ic("share")}שליחת הזמנה</button><button class="btn" data-i="copy">${ic("copy")}העתקת הקוד</button></div>`, sh => {
    sh.addEventListener("click", async e => {
      const a = e.target.closest("[data-i]")?.dataset.i;
      if (a === "share") share(inviteText(g), joinUrl(g.code));
      if (a === "copy") { try { await navigator.clipboard.writeText(g.code); toast("הקוד הועתק"); } catch { toast("לא הצלחנו להעתיק. הקוד: " + g.code); } }
    });
  });
}
function openGroups() {
  const ids = Object.keys(S.groups);
  openSheet(`${sheetHead("הקבוצות שלי")}<div class="group">${ids.map(id => `<button class="group-row" data-g="${id}"><span style="display:flex;align-items:center;gap:8px">${ic("users")}${esc(S.groups[id].name)}</span>${id === S.gid ? ic("check") : ""}</button>`).join("")}</div>
    <div class="actions"><button class="btn" data-x="create">${ic("plus")}יצירת קבוצה חדשה</button><button class="btn" data-x="join">${ic("key")}הצטרפות עם קוד</button></div>`, sh => {
    sh.addEventListener("click", e => {
      const g = e.target.closest("[data-g]")?.dataset.g; if (g) { closeSheet(); selectGroup(g); return; }
      const x = e.target.closest("[data-x]")?.dataset.x;
      if (x === "create") needName(openCreate);
      if (x === "join") needName(() => openJoin());
    });
  });
}

/* ---------- rate a place ---------- */
function sliderHTML(c, v) {
  return `<div class="slider"><div class="slider-top"><span>${c.label}</span><b data-out="${c.id}">${v}</b></div><input type="range" min="1" max="10" step="1" value="${v}" name="${c.id}" aria-label="${c.label}"></div>`;
}
function openRate(pid) {
  const all = places();
  const p = pid ? all.find(x => x.id === pid) : null;
  const mine = p?.mine;
  const sc = mine?.scores || Object.fromEntries(CRIT().map(c => [c.id, 7]));
  let photo = p?.photo || null;
  const others = p ? p.raters.filter(r => r.uid !== be.uid).length : 0;
  openSheet(`<form id="ed" novalidate>${sheetHead(!p ? `דירוג ${T().item}` : mine ? "הדירוג שלי" : "דרגו גם אתם")}
    ${p && others ? `<p class="lead" style="margin-top:-16px">${plural(others, "חבר אחד כבר דירג", "חברים כבר דירגו")}. הציון שלך ייכנס לממוצע.</p>` : ""}
    <label class="field"><span>שם ה${T().item}</span><input class="input" name="name" required placeholder="${T().ex ? "למשל: " + esc(T().ex) : ""}" value="${esc(p?.name || "")}" list="places" autocomplete="off" ${p ? "readonly" : ""}></label>
    <datalist id="places">${all.map(x => `<option value="${esc(x.name)}">`).join("")}</datalist>
    <p class="hint-line" id="exists" hidden></p>
    <label class="field"><span>${esc(T().sub || "פרט נוסף")} (לא חובה)</span><input class="input" name="city" placeholder="" value="${esc(p?.city || "")}" autocomplete="off"></label>
    <label class="field"><span>תמונה (לא חובה)</span><div class="photo-pick" id="pp">${photo ? `<img src="${photo}" alt="">` : `${ic("camera")}<span>צלמו או בחרו תמונה</span>`}<input type="file" accept="image/*" aria-label="הוספת תמונה"></div></label>
    ${T().dish ? `<label class="field"><span>${esc(T().dish)} (לא חובה)</span><input class="input" name="dish" value="${esc(mine?.dish || "")}" autocomplete="off"></label>` : ""}
    <div class="total-live"><span style="font-weight:600">הציון שלי</span><b id="tl">${fmt(scoreOf(sc))}</b></div>
    ${CRIT().map(c => sliderHTML(c, sc[c.id] ?? 7)).join("")}
    <label class="field"><span>הערות</span><textarea class="input" name="notes" placeholder="מה היה מיוחד? מה הייתם משנים?">${esc(mine?.notes || "")}</textarea></label>
    <button class="btn btn-primary" type="submit">${!p ? "הוספה לטבלה" : mine ? "שמירת השינויים" : "שמירת הדירוג שלי"}</button></form>`, sh => {
    const f = sh.querySelector("#ed");
    const readScores = () => Object.fromEntries(CRIT().map(c => [c.id, +f.elements[c.id].value]));
    const findExisting = () => { const n = f.elements.name.value.trim().toLowerCase(); return n ? all.find(x => x.name.trim().toLowerCase() === n) : null; };
    f.addEventListener("input", e => {
      if (e.target.type === "range") { sh.querySelector(`[data-out=${e.target.name}]`).textContent = e.target.value; sh.querySelector("#tl").textContent = fmt(scoreOf(readScores())); }
      if (e.target.name === "name" && !p) { const ex = findExisting(), h = sh.querySelector("#exists"); h.hidden = !ex; if (ex) h.textContent = `"${ex.name}" כבר בטבלה — הדירוג שלך ייכנס לממוצע שלו.`; }
    });
    f.querySelector("input[type=file]").addEventListener("change", async e => {
      const file = e.target.files[0]; if (!file) return;
      try { photo = await compress(file); const pp = sh.querySelector("#pp"); pp.querySelector("img")?.remove(); pp.querySelectorAll(":scope>svg,:scope>span").forEach(n => n.remove()); pp.insertAdjacentHTML("afterbegin", `<img src="${photo}" alt="">`); }
      catch { toast("לא הצלחנו לקרוא את התמונה. נסו תמונה אחרת"); }
    });
    f.onsubmit = async e => {
      e.preventDefault();
      const name = f.elements.name.value.trim();
      if (!name) { f.elements.name.focus(); f.elements.name.style.borderColor = "var(--danger)"; toast("חסר שם"); return; }
      const btn = f.querySelector("[type=submit]"); btn.disabled = true;
      try {
        const target = p || findExisting();
        const place = target
          ? { id: target.id, name: target.name, city: f.elements.city.value.trim() || target.city || "", photo: photo || target.photo || null, addedBy: target.addedBy, createdAt: target.createdAt }
          : { id: rid(), name, city: f.elements.city.value.trim(), photo, addedBy: be.uid, createdAt: Date.now() };
        await be.savePlace(S.gid, place);
        await be.saveRating(S.gid, { id: `${place.id}__${be.uid}`, pid: place.id, uid: be.uid, scores: readScores(), dish: f.elements.dish?.value.trim() || "", notes: f.elements.notes.value.trim(), at: Date.now() });
        justAdded = place.id; closeSheet();
        setTimeout(() => { const r = rankMap()[place.id]; toast(mine ? "השינויים נשמרו" : r <= 3 ? `עלה לפודיום — מקום ${r}!` : `נכנס לטבלה במקום ${r}`); app.querySelector(`[data-open="${place.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 150);
      } catch { btn.disabled = false; toast("הדירוג לא נשמר. בדקו את החיבור ונסו שוב"); }
    };
  });
}

/* ---------- place detail ---------- */
function openDetail(pid) {
  const p = places().find(x => x.id === pid); if (!p) return;
  const r = rankMap()[pid], n = p.raters.length;
  openSheet(`${sheetHead(esc(p.name))}
    ${p.photo ? `<div class="d-img"><img src="${p.photo}" alt="${esc(p.name)}"></div>` : ""}
    <div class="total-live"><span><span style="display:block;font-weight:600">${n > 1 ? `ממוצע של ${n} דירוגים` : n ? "דירוג אחד" : "עוד לא דורג"}</span><span style="color:var(--text-muted);font-size:14px">${r ? `מקום ${r} מתוך ${ranked().length}` : ""}${p.city ? ` · ${esc(p.city)}` : ""}</span></span><b>${n ? fmt(p.total) : "–"}</b></div>
    <div class="bars">${CRIT().map(c => `<div class="bar-row"><span>${c.label}</span><span class="bar"><i style="width:${(p.crit[c.id] ?? 0) * 10}%"></i></span><b>${p.crit[c.id] != null ? fmt(p.crit[c.id]) : "–"}</b></div>`).join("")}</div>
    ${n ? `<p class="group-label">מי דירג</p><div class="group">${p.raters.sort((a, b) => scoreOf(b.scores) - scoreOf(a.scores)).map(x => `<div class="group-row rater"><span class="r-who"><span class="avatar">${esc(initial(x.who))}</span><span><b>${esc(x.who)}</b>${x.dish ? `<small>${esc(x.dish)}</small>` : ""}</span></span><b>${fmt(scoreOf(x.scores))}</b>${x.notes ? `<span class="r-note">${esc(x.notes)}</span>` : ""}</div>`).join("")}</div>` : ""}
    <div class="actions"><button class="btn ${p.mine ? "" : "btn-primary"}" data-d="rate">${ic(p.mine ? "pencil" : "plus")}${p.mine ? "עריכת הדירוג שלי" : "דרגו גם אתם"}</button><button class="btn" data-d="share">${ic("share")}שיתוף</button>${p.addedBy === be.uid ? `<button class="btn btn-ghost btn-danger" data-d="del">${ic("trash")}מחיקה מהטבלה</button>` : ""}</div>`, sh => {
    sh.addEventListener("click", async e => {
      const a = e.target.closest("[data-d]")?.dataset.d;
      if (a === "rate") openRate(pid);
      if (a === "share") share(`${p.name} — ${fmt(p.total)}/10 ${T().emoji} ${r ? `(מקום ${r} בקבוצה "${S.groups[S.gid].name}")` : ""}`);
      if (a === "del" && await confirmDialog({ title: `למחוק את "${p.name}"?`, text: `"${p.name}" יימחק מהטבלה של כל הקבוצה. אי אפשר לבטל.`, ok: "מחיקה", danger: true })) {
        try { await be.deletePlace(S.gid, pid); closeSheet(); toast("נמחק מהטבלה"); } catch { toast("לא הצלחנו למחוק. נסו שוב"); }
      }
    });
  });
}

/* ---------- settings ---------- */
function openSettings() {
  const t = ls.get("theme", "auto"), g = S.groups[S.gid];
  openSheet(`${sheetHead("הגדרות")}
    <p class="group-label">אני</p>
    <div class="group"><button class="group-row" data-s="name"><span>השם שלי</span><span style="color:var(--text-muted)">${esc(S.name || "לא הוגדר")}</span></button></div>
    <p class="group-label">מראה</p>
    <div class="group"><div class="group-row"><span>צבעים</span><div class="seg">${[["auto", "אוטומטי"], ["light", "בהיר"], ["dark", "כהה"]].map(([k, l]) => `<button data-theme-set="${k}" aria-pressed="${t === k}">${l}</button>`).join("")}</div></div></div>
    ${g ? `<p class="group-label">הקבוצה "${esc(g.name)}"</p><div class="group"><button class="group-row" data-s="invite"><span>הזמנת חברים</span>${ic("userPlus")}</button><button class="group-row btn-danger" data-s="leave"><span>יציאה מהקבוצה</span>${ic("logout")}</button></div>` : ""}
    <p class="group-label">אחר</p>
    <div class="group"><button class="group-row" data-s="onboarding"><span>הצגת שאלון הפתיחה מחדש</span>${ic("back")}</button></div>
    <p class="lead" style="font-size:13px">${be.kind === "firebase" ? "מחובר — הקבוצות מסונכרנות עם החברים." : "הנתונים שמורים רק במכשיר הזה."}</p>`, sh => {
    sh.addEventListener("click", async e => {
      const th = e.target.closest("[data-theme-set]");
      if (th) { ls.set("theme", th.dataset.themeSet); applyTheme(); sh.querySelectorAll("[data-theme-set]").forEach(x => x.setAttribute("aria-pressed", x === th)); render(); }
      const a = e.target.closest("[data-s]")?.dataset.s;
      if (a === "name") openName();
      if (a === "invite") openInvite();
      if (a === "onboarding") { closeSheet(); startOnboarding(); }
      if (a === "leave" && await confirmDialog({ title: "לצאת מהקבוצה?", text: "הדירוגים שלך יישארו בקבוצה. אפשר לחזור עם הקוד.", ok: "יציאה", danger: true })) {
        try { await be.leaveGroup(S.gid); delete S.groups[S.gid]; closeSheet(); selectGroup(Object.keys(S.groups)[0] || null); toast("יצאת מהקבוצה"); } catch { toast("לא הצלחנו לצאת. נסו שוב"); }
      }
    });
  });
}

/* ---------- onboarding (goodonboarding) ---------- */
const GOALS = [["🏆", "לגלות מה הכי טוב באמת"], ["👥", "להכריע סוף סוף מי צודק בחבר׳ה"], ["📝", "לזכור מה אהבנו ומה לא"], ["💸", "לדעת מה שווה את הכסף"], ["🎯", "לבחור מה לנסות בפעם הבאה"]];
const PAINS = [
  ["שוכחים איך קראו לזה", "כל דבר נשמר בטבלה של הקבוצה, עם תמונה והערות"],
  ["כל אחד בקבוצה זוכר את זה אחרת", "כל חבר מדרג בעצמו, והציון הוא הממוצע של כולם"],
  ["ויכוחים בלי סוף מי הכי טוב", "פודיום: מקום ראשון, שני ושלישי, שמתעדכן לבד"],
  ["מבזבזים זמן וכסף על דברים בינוניים", "רואים מראש מה החבר׳ה דירגו גבוה"],
  ["לא סומכים על ביקורות ברשת", "רק החברים שלכם מדרגים, אף אחד אחר"],
];
function startOnboarding(joinCode = null) {
  const st = { step: 0, goal: ls.get("ob-goal", null), pains: [], name: S.name, mode: joinCode ? "join" : "create", gname: "", tp: { id: "burger", name: "", crit: [] }, code: joinCode || "", demo: null, place: null };
  const ob = document.createElement("div"); ob.className = "ob"; ob.setAttribute("role", "dialog"); ob.setAttribute("aria-label", "שאלון פתיחה");
  document.body.appendChild(ob); document.body.style.overflow = "hidden";
  const STEPS = 8;
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
      const picked = st.pains.length ? st.pains : [1, 2];
      body = `<h1>הנה מה שמשתנה</h1><p class="lead">לכל דבר שבחרתם, יש פתרון.</p><div class="sol">${picked.map(i => `<div class="sol-item"><div class="pain">${PAINS[i][0]}</div><div class="fix">${ic("check")}${PAINS[i][1]}</div></div>`).join("")}</div>`;
      foot = `<button class="btn btn-primary" data-next>מעולה, הלאה</button>`;
    } else if (s === 3) {
      body = `<h1>איך קוראים לך?</h1><p class="lead">ככה החברים יראו מי דירג מה.</p><label class="field"><span>השם שלך</span><input class="input" id="on" maxlength="24" value="${esc(st.name)}" autocomplete="given-name"></label>`;
      foot = `<button class="btn btn-primary" data-next ${st.name.trim() ? "" : "disabled"}>המשך</button>`;
    } else if (s === 4) {
      body = `<h1>עם מי מדרגים?</h1><p class="lead">צרו קבוצה חדשה, או הצטרפו לקבוצה של חבר.</p>
        <div class="seg seg-wide" role="tablist"><button data-mode="create" aria-pressed="${st.mode === "create"}">קבוצה חדשה</button><button data-mode="join" aria-pressed="${st.mode === "join"}">יש לי קוד</button></div>
        ${st.mode === "create" ? `<label class="field" style="margin-top:var(--s3)"><span>שם הקבוצה</span><input class="input" id="og" maxlength="32" placeholder="למשל: החבר׳ה מהצבא" value="${esc(st.gname)}"></label>${topicPickerHTML(st.tp)}`
          : `<label class="field" style="margin-top:var(--s3)"><span>קוד הצטרפות</span><input class="input code-input" id="oc" maxlength="6" placeholder="ABC123" dir="ltr" autocapitalize="characters" value="${esc(st.code)}"></label>`}`;
      const ok = st.mode === "create" ? st.gname.trim() && topicFromPick(st.tp) : st.code.length === 6;
      foot = `<button class="btn btn-primary" data-group ${ok ? "" : "disabled"}>${st.mode === "create" ? "יצירת הקבוצה" : "הצטרפות"}</button>`;
    } else if (s === 5) {
      body = `<div class="processing"><div class="stack"><i></i><i></i><i></i><i></i><i></i></div><h1 style="font-size:24px">מכינים את הפודיום…</h1><p class="lead" style="margin:0">${esc(S.groups[S.gid]?.name || "")}</p></div>`;
      setTimeout(() => { if (st.step === 5) { st.step = 6; draw(); } }, 1500);
    } else if (s === 6) {
      const sc = st.demo || (st.demo = Object.fromEntries(CRIT().map(c => [c.id, 7])));
      body = `<h1>הדירוג הראשון שלכם</h1><p class="lead">לוקח חצי דקה. תמונה ופרטים אפשר להוסיף אחר כך.</p>
        <label class="field"><span>שם ה${T().item}</span><input class="input" id="dp" placeholder="${T().ex ? "למשל: " + esc(T().ex) : ""}" value="${esc(st.dplace || "")}"></label>
        <div class="total-live"><span style="font-weight:600">הציון שלי</span><b id="dtl">${fmt(scoreOf(sc))}</b></div>
        ${CRIT().map(c => `<div class="slider"><div class="slider-top"><span>${c.label}</span><b data-out="${c.id}">${sc[c.id]}</b></div><input type="range" min="1" max="10" value="${sc[c.id]}" name="${c.id}" aria-label="${c.label}"></div>`).join("")}`;
      foot = `<button class="btn btn-primary" data-demo ${st.dplace ? "" : "disabled"}>הכניסו לטבלה</button><button class="btn btn-ghost" data-skip>אדרג אחר כך</button>`;
    } else if (s === 7) {
      const g = S.groups[S.gid], p = st.place;
      body = `<div class="result">${p ? `<span class="badge">${ic("award")} מקום ${rankMap()[p.id] || 1} בפודיום</span><div class="result-card"><span class="card-title" style="font-size:22px;white-space:normal">${esc(p.name)}</span><div class="big">${fmt(scoreOf(st.demo))}</div><p class="lead" style="margin:0">מתוך 10</p></div>` : `${BURGER_ART.replace("<svg", '<svg width="120" height="120"')}`}
        <h1 style="font-size:24px">עכשיו תורם של החברים</h1><p class="lead">שלחו להם את הקוד <b dir="ltr">${esc(g?.code || "")}</b>. כל אחד מדרג, והממוצע קובע מי עולה לפודיום.</p></div>`;
      foot = `<button class="btn btn-primary" data-invite>${ic("share")}הזמנת חברים</button><button class="btn" data-done>לטבלה</button>`;
    }
    ob.innerHTML = `<div class="ob-top">${s > 0 && s < 5 ? `<button class="icon-btn" data-back aria-label="חזרה">${ic("back")}</button>` : `<span style="width:48px"></span>`}<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div></div><div class="ob-body enter">${body}</div>${foot ? `<div class="ob-foot">${foot}</div>` : ""}`;
    const on = ob.querySelector("#on"); if (on) on.oninput = e => { st.name = e.target.value; ob.querySelector("[data-next]").disabled = !st.name.trim(); };
    const og = ob.querySelector("#og");
    if (og) {
      const chk = () => { ob.querySelector("[data-group]").disabled = !(st.gname.trim() && topicFromPick(st.tp)); };
      og.oninput = e => { st.gname = e.target.value; chk(); };
      wireTopicPicker(ob, st.tp, () => { const y = ob.querySelector(".ob-body").scrollTop; draw(); ob.querySelector(".ob-body").scrollTop = y; ob.querySelector(".ob-body").classList.remove("enter"); }, chk);
    }
    const oc = ob.querySelector("#oc"); if (oc) oc.oninput = e => { e.target.value = st.code = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); ob.querySelector("[data-group]").disabled = st.code.length !== 6; };
    if (s === 6) {
      ob.querySelector("#dp").oninput = e => { st.dplace = e.target.value; ob.querySelector("[data-demo]").disabled = !st.dplace.trim(); };
      ob.querySelectorAll("input[type=range]").forEach(r => r.oninput = () => { st.demo[r.name] = +r.value; ob.querySelector(`[data-out=${r.name}]`).textContent = r.value; ob.querySelector("#dtl").textContent = fmt(scoreOf(st.demo)); });
    }
  };
  const finish = () => { ls.set("onboarded", true); ob.remove(); document.body.style.overflow = ""; render(); };
  ob.addEventListener("click", async e => {
    const t = e.target.closest("button"); if (!t || t.disabled) return;
    if (t.dataset.goal != null) { st.goal = +t.dataset.goal; ls.set("ob-goal", st.goal); draw(); return; }
    if (t.dataset.pain != null) { const i = +t.dataset.pain; st.pains = st.pains.includes(i) ? st.pains.filter(x => x !== i) : [...st.pains, i]; draw(); return; }
    if (t.dataset.mode) { st.mode = t.dataset.mode; draw(); return; }
    if ("back" in t.dataset) { st.step--; draw(); return; }
    if ("next" in t.dataset) {
      if (st.step === 3) { S.name = st.name.trim(); ls.set("name", S.name); if (Object.keys(S.groups).length) { st.step = 7; draw(); return; } }
      st.step++; draw(); return;
    }
    if ("group" in t.dataset) {
      t.disabled = true;
      try {
        if (st.mode === "create") await createGroup(st.gname.trim(), topicFromPick(st.tp)); else await joinGroup(st.code);
        // joined a group that already has places → go straight to the table
        if (st.mode === "join" && S.data?.places?.length) { st.step = 7; } else st.step = 5;
        draw();
      } catch (err) { t.disabled = false; toast(st.mode === "join" ? joinErrorText(err) : "לא הצלחנו ליצור את הקבוצה. בדקו את החיבור ונסו שוב"); }
      return;
    }
    if ("demo" in t.dataset) {
      t.disabled = true;
      try {
        const name = st.dplace.trim(), ex = places().find(x => x.name.trim().toLowerCase() === name.toLowerCase());
        const place = ex ? { id: ex.id, name: ex.name, city: ex.city || "", photo: ex.photo || null, addedBy: ex.addedBy, createdAt: ex.createdAt } : { id: rid(), name, city: "", photo: null, addedBy: be.uid, createdAt: Date.now() };
        await be.savePlace(S.gid, place);
        await be.saveRating(S.gid, { id: `${place.id}__${be.uid}`, pid: place.id, uid: be.uid, scores: { ...st.demo }, dish: "", notes: "", at: Date.now() });
        st.place = place; justAdded = place.id; st.step = 7; setTimeout(draw, 120);
      } catch { t.disabled = false; toast("לא הצלחנו לשמור. בדקו את החיבור ונסו שוב"); }
      return;
    }
    if ("skip" in t.dataset) { st.place = null; st.step = 7; draw(); return; }
    if ("invite" in t.dataset) { const g = S.groups[S.gid]; if (g) share(inviteText(g), joinUrl(g.code)); return; }
    if ("done" in t.dataset) finish();
  });
  draw();
}

/* ---------- boot ---------- */
async function boot() {
  applyTheme();
  render();
  be = await createBackend();
  await loadGroups();
  selectGroup(S.gid);
  const params = new URLSearchParams(location.search);
  const join = (params.get("join") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || null;
  if (join) history.replaceState(null, "", location.pathname);
  const afterIntro = () => {
    if (!ls.get("onboarded", false) || !S.name) return startOnboarding(join);
    if (join) {
      const already = Object.values(S.groups).find(g => g.code === join);
      if (already) { selectGroup(already.id); toast(`את/ה כבר ב"${already.name}"`); }
      else openJoin(join);
    }
  };
  let seen = false; try { seen = sessionStorage.getItem("ranks-intro-seen") === "1"; } catch {}
  if (seen) return afterIntro();
  const host = document.createElement("div"); document.body.appendChild(host);
  const unmount = mountRankIntro(host, {
    name: "Ranks",
    headline: 'מה הכי<br/><span class="bi-accent">טוב?</span>',
    welcome: "ברוכים הבאים",
    subtitle: join ? "הוזמנתם לקבוצה. בואו נדרג ביחד." : "מדרגים כל דבר עם החברים — אוכל, סרטים, מקומות — והממוצע קובע מי על הפודיום.",
    hint: "החליקו למעלה",
    buttons: [{ id: "go", label: ls.get("onboarded", false) && S.name ? "לטבלה שלנו" : "בואו נתחיל", dark: true }],
    onEnter: () => { try { sessionStorage.setItem("ranks-intro-seen", "1"); } catch {} unmount(); host.remove(); afterIntro(); },
  });
}
boot();

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("./sw.js").catch(() => {});
