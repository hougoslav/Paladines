// Fabrique data/equipements.js : toilettes publiques, fontaines d'eau potable et lieux sûrs
// ouverts jour et nuit (commissariats, urgences des hôpitaux) autour de Lille, d'après OpenStreetMap.
//
// Utilisation (Node 18 ou plus), depuis le dossier du projet, à partir d'un extrait converti
// par osmium au format OPL (voir .github/workflows/chemins.yml, qui le refait chaque mois) :
//   node outils/equipements.mjs equipements.opl
//
// Format : window.PALADINES_EQUIP = { date, t: [...], e: [...], s: [...] }
//   t (toilettes) : [lat, lng, options]   options : « p » payantes, « f » accessibles en fauteuil
//   e (eau)       : [lat, lng]
//   s (lieux sûrs): [lat, lng, type, nom, téléphone]   type : « police » ou « urgences »

import { readFile, writeFile } from "node:fs/promises";
import { lireOpl } from "./opl.mjs";

const r5 = (x) => Math.round(x * 1e5) / 1e5;

function centre(el, noeuds) {
  if (el.type === "node") return [el.lat, el.lon];
  const pts = el.nodes.map((n) => noeuds.get(n)).filter(Boolean);
  if (!pts.length) return null;
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
}

const prive = (t) => ["private", "no", "customers", "permit"].includes(t.access);

const osm = lireOpl(await readFile(process.argv[2], "utf8"));
const noeuds = new Map();
for (const el of osm.elements) if (el.type === "node") noeuds.set(el.id, [el.lat, el.lon]);

const t = [], e = [], s = [];
const vus = new Set();
for (const el of osm.elements) {
  const g = el.tags || {};
  if (!g.amenity && !g.healthcare) continue;
  const c = centre(el, noeuds);
  if (!c) continue;
  const p = [r5(c[0]), r5(c[1])];
  const cle = g.amenity + p.join(",");
  if (vus.has(cle)) continue;
  vus.add(cle);
  if (g.amenity === "toilets" && !prive(g)) {
    t.push([...p, (g.fee === "yes" ? "p" : "") + (g.wheelchair === "yes" ? "f" : "")]);
  } else if ((g.amenity === "drinking_water" || (g.amenity === "water_point" && g.drinking_water !== "no")) && !prive(g)) {
    e.push(p);
  } else if (g.amenity === "police" && !prive(g)) {
    s.push([...p, "police", g.name || "", g.phone || g["contact:phone"] || ""]);
  } else if ((g.amenity === "hospital" || g.healthcare === "hospital") && g.emergency === "yes") {
    s.push([...p, "urgences", g.name || "", g["emergency:phone"] || g.phone || g["contact:phone"] || ""]);
  }
}

const sortie = { date: new Date().toISOString().slice(0, 10), t, e, s };
await writeFile(
  new URL("../data/equipements.js", import.meta.url),
  "/*\n * Toilettes, eau potable et lieux sûrs ouverts jour et nuit (OpenStreetMap).\n" +
    " * Fichier généré par outils/equipements.mjs (chaque mois, .github/workflows/chemins.yml).\n */\n" +
    "window.PALADINES_EQUIP = " + JSON.stringify(sortie) + ";\n"
);
console.log(t.length + " toilettes, " + e.length + " points d'eau, " + s.length + " lieux sûrs");
