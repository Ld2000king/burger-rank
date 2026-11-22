// Intro sets. Each set is a stack of layers that fans out when you swipe up.
// layer: [svg, label, height, compact y, exploded y, x drift, tilt]   (all in a 260-wide box)
const BURGER_SVG = {
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
const TROPHY_SVG = {
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
const CAM = {
  reels: `<svg viewBox="0 0 260 86"><g fill="#2B2B33"><circle cx="96" cy="44" r="40"/><circle cx="178" cy="50" r="34"/></g><g fill="#8A8A96"><circle cx="96" cy="24" r="8"/><circle cx="78" cy="54" r="8"/><circle cx="114" cy="54" r="8"/><circle cx="96" cy="44" r="5"/><circle cx="178" cy="34" r="6.5"/><circle cx="164" cy="58" r="6.5"/><circle cx="192" cy="58" r="6.5"/><circle cx="178" cy="50" r="4"/></g></svg>`,
  body: `<svg viewBox="0 0 260 80"><rect x="44" y="2" width="150" height="76" rx="14" fill="#2B2B33"/><rect x="58" y="14" width="50" height="8" rx="4" fill="#4A4A55"/><path d="M194 24l50-18v68l-50-18z" fill="#3A3A44"/><circle cx="210" cy="40" r="6" fill="#7FB3FF"/><circle cx="176" cy="20" r="6" fill="#E5483A"/></svg>`,
  head: `<svg viewBox="0 0 260 24"><rect x="100" y="2" width="60" height="20" rx="6" fill="#55555F"/></svg>`,
  legs: `<svg viewBox="0 0 260 90"><g stroke="#55555F" stroke-width="8" stroke-linecap="round"><path d="M130 6L62 86M130 6v80M130 6l68 80"/></g></svg>`,
};
const PAD = {
  shoulders: `<svg viewBox="0 0 260 20"><rect x="44" y="2" width="58" height="16" rx="8" fill="#55555F"/><rect x="158" y="2" width="58" height="16" rx="8" fill="#55555F"/></svg>`,
  face: `<svg viewBox="0 0 260 74"><path d="M56 2h148c22 0 36 20 38 46l2 24H16l2-24C20 22 34 2 56 2Z" fill="#33333D"/><path d="M62 24h10v10h10v10H72v10H62V44H52V34h10z" fill="#9A9AA6"/><circle cx="196" cy="22" r="7" fill="#E8B730"/><circle cx="212" cy="38" r="7" fill="#E5483A"/><circle cx="180" cy="38" r="7" fill="#3E6FB0"/><circle cx="196" cy="54" r="7" fill="#6AA84F"/><circle cx="108" cy="52" r="11" fill="#55555F"/><circle cx="152" cy="52" r="11" fill="#55555F"/><rect x="118" y="18" width="24" height="7" rx="3.5" fill="#55555F"/></svg>`,
  grips: `<svg viewBox="0 0 260 60"><path d="M16 2h228l-2 26c-2 18-14 32-30 26l-30-20H78L48 54C32 60 20 46 18 28Z" fill="#2A2A33"/></svg>`,
};
const SETS = {
  trophy: { stack: 178, expl: 372, layers: (() => { const SVG = TROPHY_SVG; return [
  [SVG.trophy, "", 104, 0, 0, 0, -4],
  [SVG.c1, "", 40, 82, 116, -10, 4],
  [SVG.c2, "", 40, 90, 164, 8, -3],
  [SVG.c3, "", 40, 98, 212, -6, 3],
  [SVG.c4, "", 40, 106, 260, 6, -2],
  [SVG.podium, "", 56, 122, 316, 0, 0],
]; })() },
  burger: { stack: 216, expl: 384, layers: (() => { const SVG = BURGER_SVG; return [
  [SVG.topBun, "לחמנייה", 104, 0, 0, 0, -5],
  [SVG.lettuce, "חסה", 32, 90, 124, -8, 4],
  [SVG.tomato, "עגבנייה", 24, 106, 172, 6, -3],
  [SVG.cheese, "גבינה", 32, 116, 212, -4, 3],
  [SVG.patty, "קציצה", 48, 126, 262, 5, -2],
  [SVG.bottomBun, "לחמנייה", 50, 166, 334, 0, 2],
]; })() },
  books: { stack: 154, expl: 330, layers: [
    [`<svg viewBox="0 0 260 34"><rect x="32" y="2" width="196" height="30" rx="4" fill="#7A4FA0"/><rect x="42" y="7" width="176" height="3" rx="1.5" fill="#fff" opacity=".45"/><rect x="42" y="24" width="176" height="3" rx="1.5" fill="#fff" opacity=".3"/><rect x="206" y="2" width="8" height="30" fill="#000" opacity=".14"/><text x="130" y="21" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" opacity=".9">שירה</text></svg>`, "", 34, 0, 0, 6, -3],
    [`<svg viewBox="0 0 260 34"><rect x="20" y="2" width="220" height="30" rx="4" fill="#E0A21B"/><rect x="30" y="7" width="200" height="3" rx="1.5" fill="#fff" opacity=".45"/><rect x="30" y="24" width="200" height="3" rx="1.5" fill="#fff" opacity=".3"/><rect x="218" y="2" width="8" height="30" fill="#000" opacity=".14"/><text x="130" y="21" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" opacity=".9">מתכונים</text></svg>`, "", 34, 30, 74, -8, 2],
    [`<svg viewBox="0 0 260 34"><rect x="28" y="2" width="204" height="30" rx="4" fill="#2F8F5B"/><rect x="38" y="7" width="184" height="3" rx="1.5" fill="#fff" opacity=".45"/><rect x="38" y="24" width="184" height="3" rx="1.5" fill="#fff" opacity=".3"/><rect x="210" y="2" width="8" height="30" fill="#000" opacity=".14"/><text x="130" y="21" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" opacity=".9">טיולים</text></svg>`, "", 34, 60, 148, 4, -2],
    [`<svg viewBox="0 0 260 34"><rect x="12" y="2" width="236" height="30" rx="4" fill="#C2442E"/><rect x="22" y="7" width="216" height="3" rx="1.5" fill="#fff" opacity=".45"/><rect x="22" y="24" width="216" height="3" rx="1.5" fill="#fff" opacity=".3"/><rect x="226" y="2" width="8" height="30" fill="#000" opacity=".14"/><text x="130" y="21" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" opacity=".9">קולנוע</text></svg>`, "", 34, 90, 222, -6, 1.5],
    [`<svg viewBox="0 0 260 34"><rect x="23" y="2" width="214" height="30" rx="4" fill="#3E6FB0"/><rect x="33" y="7" width="194" height="3" rx="1.5" fill="#fff" opacity=".45"/><rect x="33" y="24" width="194" height="3" rx="1.5" fill="#fff" opacity=".3"/><rect x="215" y="2" width="8" height="30" fill="#000" opacity=".14"/><text x="130" y="21" text-anchor="middle" direction="rtl" font-family="Heebo,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff" opacity=".9">משחקים</text></svg>`, "", 34, 120, 296, 0, 0],
  ] },
  camera: { stack: 256, expl: 352, layers: [
    [CAM.reels, "סלילים", 86, 0, 0, 0, -3],
    [CAM.body, "מצלמה", 80, 70, 110, 0, 2],
    [CAM.head, "ראש", 24, 146, 214, 0, 0],
    [CAM.legs, "חצובה", 90, 166, 262, 0, 0],
  ] },
  cards: { stack: 102, expl: 360, layers: [
    [`<svg viewBox="0 0 260 70"><rect x="55" y="3" width="150" height="64" rx="10" fill="#FFFFFF" stroke="#D9D2C7" stroke-width="2"/><text x="130" y="48" text-anchor="middle" font-size="34" fill="#D93A2D" font-family="system-ui,sans-serif">♥</text><text x="68" y="24" font-size="14" fill="#D93A2D" font-family="system-ui,sans-serif">♥</text><text x="192" y="60" text-anchor="end" font-size="14" fill="#D93A2D" font-family="system-ui,sans-serif">♥</text></svg>`, "", 70, 0, 0, -14, -8],
    [`<svg viewBox="0 0 260 70"><rect x="55" y="3" width="150" height="64" rx="10" fill="#FFFFFF" stroke="#D9D2C7" stroke-width="2"/><text x="130" y="48" text-anchor="middle" font-size="34" fill="#1C1814" font-family="system-ui,sans-serif">♠</text><text x="68" y="24" font-size="14" fill="#1C1814" font-family="system-ui,sans-serif">♠</text><text x="192" y="60" text-anchor="end" font-size="14" fill="#1C1814" font-family="system-ui,sans-serif">♠</text></svg>`, "", 70, 8, 72, 12, 6],
    [`<svg viewBox="0 0 260 70"><rect x="55" y="3" width="150" height="64" rx="10" fill="#FFF7E0" stroke="#D9D2C7" stroke-width="2"/><text x="130" y="48" text-anchor="middle" font-size="34" fill="#D99A12" font-family="system-ui,sans-serif">★</text><text x="68" y="24" font-size="14" fill="#D99A12" font-family="system-ui,sans-serif">★</text><text x="192" y="60" text-anchor="end" font-size="14" fill="#D99A12" font-family="system-ui,sans-serif">★</text></svg>`, "", 70, 16, 144, -8, -4],
    [`<svg viewBox="0 0 260 70"><rect x="55" y="3" width="150" height="64" rx="10" fill="#FFFFFF" stroke="#D9D2C7" stroke-width="2"/><text x="130" y="48" text-anchor="middle" font-size="34" fill="#D93A2D" font-family="system-ui,sans-serif">♦</text><text x="68" y="24" font-size="14" fill="#D93A2D" font-family="system-ui,sans-serif">♦</text><text x="192" y="60" text-anchor="end" font-size="14" fill="#D93A2D" font-family="system-ui,sans-serif">♦</text></svg>`, "", 70, 24, 216, 10, 5],
    [`<svg viewBox="0 0 260 70"><rect x="55" y="3" width="150" height="64" rx="10" fill="#FFFFFF" stroke="#D9D2C7" stroke-width="2"/><text x="130" y="48" text-anchor="middle" font-size="34" fill="#1C1814" font-family="system-ui,sans-serif">♣</text><text x="68" y="24" font-size="14" fill="#1C1814" font-family="system-ui,sans-serif">♣</text><text x="192" y="60" text-anchor="end" font-size="14" fill="#1C1814" font-family="system-ui,sans-serif">♣</text></svg>`, "", 70, 32, 290, 0, -2],
  ] },
  controller: { stack: 130, expl: 250, layers: [
    [PAD.shoulders, "", 20, 0, 0, 0, -3],
    [PAD.face, "", 74, 14, 70, 0, 2],
    [PAD.grips, "", 60, 70, 190, 0, -1],
  ] },
};
export const SET_NAMES = Object.keys(SETS);
export const pickSet = name => SETS[name] || SETS[SET_NAMES[(Math.random() * SET_NAMES.length) | 0]];
