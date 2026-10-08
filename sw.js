/*
 * Service worker : permet à l'appli de marcher sans internet.
 * - Fichiers de l'appli : servis depuis le cache, puis mis à jour en arrière-plan.
 * - Fonds de carte : gardés au fur et à mesure (300 au plus).
 * Changer VERSION à chaque mise en ligne force la mise à jour du cache.
 *
 * Certains hébergeurs (Cloudflare Pages) redirigent /index.html vers / et /affiche.html
 * vers /affiche. Une page gardée en cache après une redirection est refusée par les
 * navigateurs (Safari : « Response served by service worker has redirections ») :
 * on la recopie donc sans redirection avant de la garder, et /index.html partage
 * l'entrée de /.
 */
const VERSION = "paladines-v7";
const CACHE_TUILES = "paladines-tuiles";
const MAX_TUILES = 300;

const FICHIERS = [
  "./",
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
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/icon-180.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(precharger().then(() => self.skipWaiting()));
});

async function precharger() {
  const cache = await caches.open(VERSION);
  await Promise.all(FICHIERS.map(async (f) => {
    const rep = await fetch(f, { cache: "reload" });
    if (!rep.ok) throw new Error("Impossible de garder " + f);
    await cache.put(f, await sansRedirection(rep));
  }));
}

// Une réponse arrivée après une redirection, recopiée telle quelle mais sans la redirection
async function sansRedirection(rep) {
  if (!rep.redirected) return rep;
  return new Response(await rep.blob(), { status: rep.status, statusText: rep.statusText, headers: rep.headers });
}

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
  // /index.html et / sont la même page.
  const cle = req.mode === "navigate" ? url.origin + url.pathname.replace(/index\.html$/, "") : req;
  e.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(cle).then((enCache) => {
        const reseau = fetch(req)
          .then((rep) => {
            if (rep.ok) sansRedirection(rep.clone()).then((copie) => cache.put(cle, copie));
            return rep;
          })
          .catch(() => enCache || (req.mode === "navigate" ? cache.match("./") : Response.error()));
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
