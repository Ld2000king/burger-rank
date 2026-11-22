const CACHE = "ranks-v4";
const ASSETS = ["./", "index.html", "styles.css", "rank-intro.css", "app.js", "backend.js", "firebase-config.js", "rank-intro.js", "intro-sets.js", "topics.js", "tap.js", "build-anim.js", "manifest.webmanifest", "icons/icon-192.png", "icons/favicon-64.png", "icons/apple-touch-icon.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // never cache Firebase/Google API traffic; only app files, fonts and the Firebase SDK
  const cacheable = u.origin === location.origin || u.host.startsWith("fonts.g") || u.pathname.startsWith("/firebasejs/");
  if (!cacheable) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html"))));
});
