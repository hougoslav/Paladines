// Captures de l'appli pour la bande-annonce (390×844, ×3), avec un fond de carte dessiné
// à partir de data/chemins.json (les serveurs de cartes ne sont pas joignables ici).
const { chromium } = require(process.env.PW);
const OUT = __dirname + "/ecrans/";
const GARE = { latitude: 50.6365, longitude: 3.0707, accuracy: 6 };
const HEURE = new Date("2026-10-14T15:40:00+02:00"); // un mercredi après-midi

const avantApp = () => {
  // Garder la carte Leaflet dans window.__carte, cacher le message « fond indisponible »
  let _L;
  Object.defineProperty(window, "L", {
    configurable: true,
    get() { return _L; },
    set(v) {
      _L = v;
      const orig = v.map;
      v.map = function () { const m = orig.apply(this, arguments); window.__carte = m; return m; };
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const st = document.createElement("style");
    st.textContent = ".carte-msg{display:none!important} .badge-fictif{display:none!important} .carte{background:#eceee9!important}";
    document.head.appendChild(st);
  });
};

// Rues dessinées comme le fond « Positron » : blanches sur gris très clair, bord gris
async function dessinerRues(p) {
  await p.evaluate(async () => {
    const j = await (await fetch("data/chemins.json")).json();
    const plan = window.PaladinesChemins.lire(j);
    const m = window.__carte;
    const pane = m.createPane("rues");
    pane.style.zIndex = 250;
    const r = L.canvas({ pane: "rues", padding: 0.5 });
    const lignes = plan.troncons.map((t) => t.geo);
    const nommees = plan.troncons.filter((t) => t.nom && t.nom.charAt(0) !== "#").map((t) => t.geo);
    L.polyline(lignes, { renderer: r, color: "#d6d9d2", weight: 5, interactive: false }).addTo(m);
    L.polyline(lignes, { renderer: r, color: "#ffffff", weight: 3, interactive: false }).addTo(m);
    L.polyline(nommees, { renderer: r, color: "#ffffff", weight: 5, interactive: false }).addTo(m);
  });
  await p.waitForTimeout(900);
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, serviceWorkers: "block",
    geolocation: GARE, permissions: ["geolocation"], locale: "fr-FR", timezoneId: "Europe/Paris"
  });
  const p = await ctx.newPage();
  await p.clock.setFixedTime(HEURE);
  const err = [];
  p.on("pageerror", (e) => err.push(e.message));
  await p.route(/openfreemap|openstreetmap|open-meteo|api\//, (r) => r.abort());
  await p.addInitScript(avantApp);
  const langue = async (l) => { await p.evaluate((x) => localStorage.setItem("paladines.langue", JSON.stringify(x)), l); };
  const aller = async (h, ms) => { await p.goto("http://localhost:8787/#" + h); await p.waitForTimeout(ms || 700); };
  const capt = async (n) => { await p.screenshot({ path: OUT + n + ".png" }); console.log("✓", n); };

  await aller("accueil"); await langue("fr"); await p.reload(); await p.waitForTimeout(800);
  await capt("01-accueil");
  await aller("proche", 1500); await capt("02-proche");
  await aller("lieu-l26"); await capt("03-fiche");
  await aller("aide", 1200); await capt("07-aide");

  // Carte : lieux, puis carte simple d'un lieu
  await aller("carte", 1200); await dessinerRues(p);
  await p.evaluate(() => window.__carte.setView([50.6345, 3.0605], 14));
  await p.waitForTimeout(800); await capt("04-carte");
  await p.evaluate(() => document.querySelector('.marqueur[data-id="l26"]').closest(".leaflet-marker-icon").click());
  await p.waitForTimeout(600); await capt("04b-carte-fiche");

  // Toilettes, eau, lieux sûrs : page neuve
  const neuve = async (h) => {
    const q = await ctx.newPage(); await q.clock.setFixedTime(HEURE);
    q.on("pageerror", (e) => err.push(e.message));
    await q.route(/openfreemap|openstreetmap|open-meteo|api\//, (r) => r.abort());
    await q.addInitScript(avantApp);
    await q.goto("http://localhost:8787/#" + h); await q.waitForTimeout(1500);
    return q;
  };
  let q = await neuve("carte-toilettes"); await dessinerRues(q);
  await q.evaluate(() => { document.querySelector('[data-action="carte-eq"][data-valeur="s"]').click(); window.__carte.setView([50.6352, 3.0615], 15); });
  await q.waitForTimeout(1200); await q.screenshot({ path: OUT + "06-equipements.png" }); console.log("✓ 06"); await q.close();

  // Guidage : de la gare vers l'accueil de jour Eole, arrêté ~70 m avant un virage
  q = await neuve("carte"); await dessinerRues(q);
  const pt = await q.evaluate(async () => {
    const plan = window.PaladinesChemins.lire(await (await fetch("data/chemins.json")).json());
    const tr = window.PaladinesChemins.itineraire(plan, { lat: 50.6365, lng: 3.0707 }, { lat: 50.63666, lng: 3.05714 });
    const e = tr.etapes.find((x) => x.type === "droite" && x.dist > 650) || tr.etapes[1];
    const cible = e.dist - 55;
    const at = (d) => {
      let i = 1; while (i < tr.points.length - 1 && tr.cumul[i] < d) i++;
      const f = (d - tr.cumul[i - 1]) / ((tr.cumul[i] - tr.cumul[i - 1]) || 1);
      const a = tr.points[i - 1], c = tr.points[i];
      return { lat: a[0] + (c[0] - a[0]) * f, lng: a[1] + (c[1] - a[1]) * f };
    };
    const pas = [];
    for (let d = 20; d < cible; d += 60) pas.push(at(d));
    pas.push(at(cible));
    return { pas: pas, etapes: tr.etapes.map((x) => x.type + " " + x.nom + " " + Math.round(x.dist)) };
  });
  console.log(pt.etapes.join(" | "));
  await q.evaluate(() => { location.hash = "#guide-l26"; });
  await q.waitForTimeout(2500);
  await ctx.setGeolocation({ latitude: 50.6365, longitude: 3.0707, accuracy: 6 });
  await q.waitForTimeout(1500);
  for (const x of pt.pas) { await ctx.setGeolocation({ latitude: x.lat, longitude: x.lng, accuracy: 6 }); await q.waitForTimeout(450); }
  const der = pt.pas[pt.pas.length - 1];
  await q.evaluate((x) => window.__carte.setView([x.lat - 0.0012, x.lng - 0.0006], 16.4, { animate: false }), der);
  await q.waitForTimeout(2000);
  console.log(await q.evaluate(() => { const c = document.querySelector(".leaflet-rues-pane canvas"); const pane = document.querySelector(".leaflet-rues-pane"); return c ? [c.width, c.height, getComputedStyle(pane).display, getComputedStyle(pane).zIndex, c.style.transform, window.__carte.getZoom()].join(" ") : "pas de canvas"; }));
  await q.screenshot({ path: OUT + "05-guide.png" }); console.log("✓ 05"); await q.close();

  // Autres langues
  for (const l of ["ar", "uk", "ti", "es"]) {
    await langue(l); await aller("accueil"); await p.reload(); await p.waitForTimeout(800);
    await capt("08-" + l);
  }
  await langue("fr");
  console.log("erreurs", err);
  await b.close();
})();
