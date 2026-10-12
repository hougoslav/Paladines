/*
 * Service worker : permet à l'appli de marcher sans internet.
 * - Fichiers de l'appli : servis depuis le cache, puis mis à jour en arrière-plan.
 * - Plan des rues pour le guidage (data/chemins.json) : cache à part, revérifié à chaque version.
 * - Fonds de carte (OpenFreeMap, ou OpenStreetMap en secours) : gardés au fur et à mesure (300 au plus).
 * VERSION = « paladines-v<version>.<révision> » : changer la révision à chaque mise en
 * ligne force la mise à jour du cache ; la version affichée (et ses nouveautés) est en
 * haut de data/versions.mjs (montrée sur /equipe). Le nom doit être nouveau à chaque fois.
 *
 * Certains hébergeurs (Cloudflare Pages) redirigent /index.html vers / et /affiche.html
 * vers /affiche. Une page gardée en cache après une redirection est refusée par les
 * navigateurs (Safari : « Response served by service worker has redirections ») :
 * on la recopie donc sans redirection avant de la garder, et /index.html partage
 * l'entrée de /.
 */
const VERSION = "paladines-v22.1";
const CACHE_TUILES = "paladines-tuiles-2"; // nouveau nom : efface les tuiles CARTO refusées gardées en cache
const MAX_TUILES = 600;
// Plan des rues pour le guidage (≈ 1 Mo) : gardé à part, pour ne pas le retélécharger à chaque
// mise à jour de l'appli ; revérifié à chaque nouvelle version (sans le retélécharger s'il n'a pas changé).
const CACHE_PLAN = "paladines-plan";
const PLAN = "data/chemins.json";

const FICHIERS = [
  "./",
  "affiche.html",
  "manifest.webmanifest",
  "css/style.css",
  "css/theme.css",
  "css/verre.css",
  "js/app.js",
  "js/i18n.js",
  "js/chemins.js",
  "data/lieux.js",
  "data/coordonnees.js",
  "vendor/leaflet/leaflet.js",
  "vendor/leaflet/leaflet.css",
  "vendor/qrcode/qrcode.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/icon-180.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(precharger().then(() => self.skipWaiting()));
  // Le plan ne bloque pas l'installation : sans lui, l'appli marche, seul le guidage attend
  garderPlan();
});

async function precharger() {
  const cache = await caches.open(VERSION);
  await Promise.all(FICHIERS.map(async (f) => {
    const rep = await fetch(f, { cache: "reload" });
    if (!rep.ok) throw new Error("Impossible de garder " + f);
    await cache.put(f, await sansRedirection(rep));
  }));
}

async function garderPlan() {
  try {
    const rep = await fetch(PLAN, { cache: "no-cache" });
    if (rep.ok) await (await caches.open(CACHE_PLAN)).put(PLAN, rep);
  } catch (e) {
    /* hors ligne : on garde l'ancien plan */
  }
}

// Une réponse arrivée après une redirection, recopiée telle quelle mais sans la redirection
async function sansRedirection(rep) {
  if (!rep.redirected) return rep;
  return new Response(await rep.blob(), { status: rep.status, statusText: rep.statusText, headers: rep.headers });
}

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== VERSION && k !== CACHE_TUILES && k !== CACHE_PLAN).map((k) => caches.delete(k))))
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
  // OpenFreeMap : tuiles, polices et pictos gardés ; le style et la liste des tuiles (qui
  // changent chaque semaine) pris sur internet d'abord, la copie gardée servant hors ligne.
  if (url.hostname === "tiles.openfreemap.org") {
    e.respondWith(/\.pbf$|\/fonts\/|\/sprites\//.test(url.pathname) ? tuile(req) : reseauDabord(req));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/" + PLAN)) {
    e.respondWith(
      caches.open(CACHE_PLAN).then((cache) =>
        cache.match(PLAN).then((enCache) => enCache || fetch(req).then((rep) => {
          if (rep.ok) cache.put(PLAN, rep.clone());
          return rep;
        }))
      )
    );
    return;
  }
  // Les signalements et la page de l'équipe (/equipe) ne passent jamais par le cache
  if (url.pathname.indexOf("/api/") === 0 || url.pathname === "/equipe") return;

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

async function reseauDabord(req) {
  const cache = await caches.open(CACHE_TUILES);
  try {
    const rep = await fetch(req);
    if (rep.ok) await cache.put(req, rep.clone());
    return rep;
  } catch (err) {
    return (await cache.match(req)) || Response.error();
  }
}

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
