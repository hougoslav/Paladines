/*
 * Service worker : permet à l'appli de marcher sans internet.
 * - Fichiers de l'appli : servis depuis le cache, puis mis à jour en arrière-plan.
 * - Fonds de carte : gardés au fur et à mesure (300 au plus).
 * Changer VERSION à chaque mise en ligne force la mise à jour du cache.
 */
const VERSION = "paladines-v2";
const CACHE_TUILES = "paladines-tuiles";
const MAX_TUILES = 300;

const FICHIERS = [
  "./",
  "index.html",
  "affiche.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/app.js",
  "js/i18n.js",
  "data/lieux.js",
  "data/coordonnees.js",
  "vendor/leaflet/leaflet.js",
  "vendor/leaflet/leaflet.css",
  "vendor/qrcode/qrcode.js",
  "fonts/atkinson-400.woff2",
  "fonts/atkinson-700.woff2",
  "fonts/bricolage-var.woff2",
  "icons/icon.svg",
  "icons/icon-192.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== VERSION && k !== CACHE_TUILES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.hostname === "tile.openstreetmap.org") {
    e.respondWith(tuile(req));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Les QR codes ajoutent ?pres=…&nom=… : on sert la même page depuis le cache.
  const cle = req.mode === "navigate" ? url.origin + url.pathname : req;
  e.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(cle).then((enCache) => {
        const reseau = fetch(req)
          .then((rep) => {
            if (rep.ok) cache.put(cle, rep.clone());
            return rep;
          })
          .catch(() => enCache || (req.mode === "navigate" ? cache.match("index.html") : Response.error()));
        return enCache || reseau;
      })
    )
  );
});

async function tuile(req) {
  const cache = await caches.open(CACHE_TUILES);
  const enCache = await cache.match(req);
  if (enCache) return enCache;
  const rep = await fetch(req);
  if (rep.ok) {
    await cache.put(req, rep.clone());
    const cles = await cache.keys();
    if (cles.length > MAX_TUILES) await Promise.all(cles.slice(0, cles.length - MAX_TUILES).map((k) => cache.delete(k)));
  }
  return rep;
}
