// "Assembly" loading animations: each one builds an object piece by piece.
// One is picked at random every time the loading screen shows.
const P = (d, inner, cls = "") => `<g class="bp ${cls}" style="--d:${d}s">${inner}</g>`;

const BUILDS = [
  // Burger: bottom bun → patty → cheese → lettuce → top bun
  () => `
    ${P(0, `<path d="M24 104h92a8 8 0 0 1-8 16H32a8 8 0 0 1-8-16Z" fill="#E3A857"/>`)}
    ${P(.22, `<rect x="20" y="86" width="100" height="16" rx="8" fill="#6B3A22"/>`)}
    ${P(.44, `<path d="M20 84h100l-10 8-10-8-10 8-10-8-10 8-10-8-10 8-10-8-10 8z" fill="#F1C232"/>`)}
    ${P(.66, `<rect x="16" y="74" width="108" height="9" rx="4.5" fill="#6AA84F"/>`)}
    ${P(.88, `<path d="M22 72c0-24 22-40 48-40s48 16 48 40Z" fill="#E3A857"/><g fill="#FFF3D6"><ellipse cx="54" cy="48" rx="3.5" ry="1.8"/><ellipse cx="70" cy="42" rx="3.5" ry="1.8"/><ellipse cx="86" cy="50" rx="3.5" ry="1.8"/><ellipse cx="62" cy="58" rx="3.5" ry="1.8"/><ellipse cx="80" cy="60" rx="3.5" ry="1.8"/></g>`)}`,

  // Book stack: five books land one on top of the other
  () => [["#3E6FB0", 100, 0, -1], ["#C2442E", 112, -6, 2], ["#2F8F5B", 94, 6, -2], ["#E0A21B", 106, -3, 1.5], ["#7A4FA0", 96, 4, -1]]
    .map(([c, w, dx, r], i) => {
      const y = 104 - i * 18, x = 70 - w / 2 + dx;
      return P(i * .22, `<g transform="rotate(${r} 70 ${y + 8})"><rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="${c}"/><rect x="${x + 6}" y="${y + 3}" width="${w - 12}" height="2.5" rx="1.25" fill="#fff" opacity=".45"/><rect x="${x + w - 16}" y="${y}" width="6" height="16" fill="#000" opacity=".15"/></g>`);
    }).join(""),

  // Movie camera: body → lens → two film reels → recording light
  () => `
    ${P(0, `<rect x="26" y="70" width="70" height="44" rx="8" fill="#2B2B33"/><rect x="34" y="78" width="26" height="6" rx="3" fill="#4A4A55"/>`)}
    ${P(.25, `<path d="M96 80l22-10v44l-22-10z" fill="#3A3A44"/><circle cx="104" cy="92" r="3" fill="#7FB3FF"/>`, "slide")}
    ${P(.5, `<circle cx="46" cy="50" r="20" fill="#2B2B33"/><g fill="#8A8A96"><circle cx="46" cy="40" r="4"/><circle cx="37" cy="55" r="4"/><circle cx="55" cy="55" r="4"/></g><circle cx="46" cy="50" r="3" fill="#8A8A96"/>`)}
    ${P(.75, `<circle cx="84" cy="48" r="16" fill="#2B2B33"/><g fill="#8A8A96"><circle cx="84" cy="40" r="3.2"/><circle cx="77" cy="52" r="3.2"/><circle cx="91" cy="52" r="3.2"/></g><circle cx="84" cy="48" r="2.5" fill="#8A8A96"/>`)}
    ${P(1.0, `<circle cx="88" cy="78" r="4" fill="#E5483A"/>`, "pop")}`,

  // Card album: five cards fan out from the bottom
  () => [["#FFFFFF", "♥", "#D93A2D", -28], ["#FFFFFF", "♠", "#1C1814", -14], ["#FFF7E0", "★", "#D99A12", 0], ["#FFFFFF", "♦", "#D93A2D", 14], ["#FFFFFF", "♣", "#1C1814", 28]]
    .map(([bg, s, c, r], i) => P(i * .2, `<rect x="48" y="38" width="44" height="64" rx="6" fill="${bg}" stroke="#D9D2C7" stroke-width="1.5"/><text x="70" y="78" text-anchor="middle" font-size="26" fill="${c}" font-family="system-ui,sans-serif">${s}</text><text x="54" y="51" font-size="10" fill="${c}" font-family="system-ui,sans-serif">${s}</text>`, "fan").replace('style="', `style="--r:${r}deg;`)).join(""),

  // Game controller: body → d-pad → sticks → buttons
  () => `
    ${P(0, `<path d="M38 60h64c14 0 22 12 24 28l3 18c1 8-6 14-13 10l-14-9H38l-14 9c-7 4-14-2-13-10l3-18c2-16 10-28 24-28Z" fill="#33333D"/>`)}
    ${P(.25, `<path d="M40 74h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="#9A9AA6"/>`, "pop")}
    ${P(.45, `<circle cx="58" cy="100" r="7" fill="#55555F"/><circle cx="82" cy="100" r="7" fill="#55555F"/>`, "pop")}
    ${P(.65, `<circle cx="98" cy="72" r="5" fill="#E8B730"/>`, "pop")}
    ${P(.75, `<circle cx="108" cy="82" r="5" fill="#E5483A"/>`, "pop")}
    ${P(.85, `<circle cx="88" cy="82" r="5" fill="#3E6FB0"/>`, "pop")}
    ${P(.95, `<circle cx="98" cy="92" r="5" fill="#6AA84F"/>`, "pop")}`,
];

export function buildAnimHTML() {
  const pick = BUILDS[(Math.random() * BUILDS.length) | 0];
  return `<svg class="build" viewBox="0 0 140 140" aria-hidden="true"><ellipse cx="70" cy="126" rx="48" ry="5" fill="currentColor" opacity=".08"/>${pick()}</svg>`;
}
