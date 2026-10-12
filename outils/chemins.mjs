// Fabrique data/chemins.json : les rues et chemins à pied de Lille (OpenStreetMap), pour que
// l'appli calcule un itinéraire et guide pas à pas, même sans internet.
//
// Utilisation (Node 18 ou plus), depuis le dossier du projet :
//   node outils/chemins.mjs               (télécharge les données avec l'API Overpass)
//   node outils/chemins.mjs osm.json      (à partir d'un fichier Overpass déjà téléchargé)
//   node outils/chemins.mjs rues.opl      (à partir d'un extrait OSM converti par osmium, format OPL)
//   node outils/chemins.mjs --zone        (affiche la zone « ouest,sud,est,nord » pour osmium)
//
// GitHub le refait tout seul chaque mois (.github/workflows/chemins.yml), à partir de l'extrait
// Geofabrik de la région découpé avec osmium (l'API Overpass refuse souvent une zone aussi grande).
//
// Zone : tous les lieux de data/lieux.js et data/coordonnees.js, plus une marge de 1,5 km.
// Format du fichier (court, pour peser peu sur le téléphone) :
//   p    : points [lat, lng] en 1/100 000 de degré, écrits en écarts avec le point précédent ;
//          d'abord les carrefours (sommets du graphe), puis les points intermédiaires des tronçons
//   a    : tronçons, 4 nombres chacun : sommet de départ, sommet d'arrivée, nom, nombre de points
//          intermédiaires (pris dans l'ordre à la suite des carrefours dans p)
//   noms : noms des rues ; « #chemin », « #escalier », « #traversee », « #rue » pour les voies sans nom

import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const MARGE = 0.015; // ≈ 1,5 km
const TOLERANCE = 3; // mètres : points intermédiaires inutiles enlevés en dessous
const SERVEURS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
];
const TYPES = "footway|pedestrian|path|steps|living_street|residential|service|unclassified|tertiary|tertiary_link|secondary|secondary_link|primary|primary_link|trunk|trunk_link|cycleway|track|corridor|road|bridleway";

/* ---------- Zone ---------- */
async function zone() {
  const bac = { window: {} };
  vm.runInNewContext(await readFile(new URL("../data/lieux.js", import.meta.url), "utf8"), bac);
  vm.runInNewContext(await readFile(new URL("../data/coordonnees.js", import.meta.url), "utf8"), bac);
  const pts = [];
  for (const l of bac.window.PALADINES_DATA.lieux) if (typeof l.lat === "number") pts.push([l.lat, l.lng]);
  for (const v of Object.values(bac.window.PALADINES_COORDS || {})) if (Array.isArray(v)) pts.push(v);
  if (!pts.length) throw new Error("Aucune position de lieu");
  const lat = pts.map((p) => p[0]), lng = pts.map((p) => p[1]);
  const r = (x) => Math.round(x * 1e4) / 1e4;
  return { s: r(Math.min(...lat) - MARGE), w: r(Math.min(...lng) - MARGE * 1.6), n: r(Math.max(...lat) + MARGE), e: r(Math.max(...lng) + MARGE * 1.6) };
}

async function telecharger(b) {
  const q = `[out:json][timeout:240];way["highway"~"^(${TYPES})$"](${b.s},${b.w},${b.n},${b.e});out body;>;out skel qt;`;
  for (const url of SERVEURS) {
    try {
      const rep = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Paladines (appli d'aide, Lille)" },
        body: "data=" + encodeURIComponent(q)
      });
      if (!rep.ok) throw new Error("HTTP " + rep.status);
      return await rep.json();
    } catch (e) {
      console.warn("Overpass indisponible (" + url + ") : " + e.message);
    }
  }
  throw new Error("Aucun serveur Overpass n'a répondu");
}

// Format OPL d'osmium : une ligne par élément, « n12 … T… x3.05 y50.63 » ou « w34 … Thighway=…,name=… Nn1,n2 »
function lireOpl(texte) {
  const decoder = (v) => v.replace(/%([0-9a-f]+)%/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
  const elements = [];
  for (const ligne of texte.split("\n")) {
    if (!ligne) continue;
    const champs = ligne.split(" ");
    const type = champs[0][0], id = Number(champs[0].slice(1));
    const ch = {};
    for (const c of champs.slice(1)) ch[c[0]] = c.slice(1);
    if (type === "n") elements.push({ type: "node", id: id, lat: Number(ch.y), lon: Number(ch.x) });
    else if (type === "w") {
      const tags = {};
      if (ch.T) for (const kv of ch.T.split(",")) { const i = kv.indexOf("="); tags[decoder(kv.slice(0, i))] = decoder(kv.slice(i + 1)); }
      elements.push({ type: "way", id: id, tags: tags, nodes: ch.N ? ch.N.split(",").map((n) => Number(n.slice(1))) : [] });
    }
  }
  return { elements: elements };
}

/* ---------- Tri des voies ---------- */
function praticable(t) {
  if (t.foot === "no" || t.area === "yes" && t.highway !== "pedestrian") return false;
  const pieton = ["yes", "designated", "permissive"].includes(t.foot);
  if (["private", "no"].includes(t.access) && !pieton) return false;
  if (/^trunk/.test(t.highway) && !pieton && !/^(both|left|right|yes|separate)$/.test(t.sidewalk || "")) return false;
  if (t.highway === "service" && t.access === "customers") return true;
  return true;
}

function nomVoie(t) {
  if (t.name) return t.name;
  if (t.highway === "steps") return "#escalier";
  if (t.footway === "crossing" || t.cycleway === "crossing" || t.path === "crossing") return "#traversee";
  if (/^(footway|pedestrian|path|cycleway|track|corridor|bridleway)$/.test(t.highway)) return "#chemin";
  return "#rue";
}

/* ---------- Géométrie ---------- */
function metres(a, b) {
  const k = Math.cos((a[0] * Math.PI) / 180) * 111320;
  return Math.hypot((b[0] - a[0]) * 110540, (b[1] - a[1]) * k);
}

// Distance d'un point à un segment, en mètres (approximation plane, suffisante en ville)
function ecart(p, a, b) {
  const k = Math.cos((a[0] * Math.PI) / 180) * 111320;
  const ax = a[1] * k, ay = a[0] * 110540, bx = b[1] * k - ax, by = b[0] * 110540 - ay;
  const px = p[1] * k - ax, py = p[0] * 110540 - ay;
  const l2 = bx * bx + by * by;
  const t = l2 ? Math.max(0, Math.min(1, (px * bx + py * by) / l2)) : 0;
  return Math.hypot(px - t * bx, py - t * by);
}

// Douglas-Peucker : garde la forme du tronçon avec moins de points
function simplifier(pts) {
  if (pts.length < 3) return pts;
  const garder = new Uint8Array(pts.length);
  garder[0] = garder[pts.length - 1] = 1;
  const pile = [[0, pts.length - 1]];
  while (pile.length) {
    const [i, j] = pile.pop();
    let max = 0, k = -1;
    for (let m = i + 1; m < j; m++) {
      const d = ecart(pts[m], pts[i], pts[j]);
      if (d > max) { max = d; k = m; }
    }
    if (max > TOLERANCE) {
      garder[k] = 1;
      pile.push([i, k], [k, j]);
    }
  }
  return pts.filter((_, i) => garder[i]);
}

/* ---------- Graphe ---------- */
function construire(osm) {
  const coords = new Map();
  const voies = [];
  for (const el of osm.elements) {
    if (el.type === "node") coords.set(el.id, [el.lat, el.lon]);
    else if (el.type === "way" && el.tags && praticable(el.tags)) voies.push(el);
  }
  // Un nœud partagé par deux voies (ou bout de voie) devient un carrefour
  const usage = new Map();
  for (const v of voies) {
    v.nodes.forEach((n, i) => {
      const bout = i === 0 || i === v.nodes.length - 1 ? 2 : 1;
      usage.set(n, (usage.get(n) || 0) + bout);
    });
  }
  const sommets = new Map(); // id OSM → indice
  const listeSommets = [];
  const noms = [], indiceNom = new Map();
  const troncons = [];
  const sommet = (id) => {
    if (!sommets.has(id)) { sommets.set(id, listeSommets.length); listeSommets.push(coords.get(id)); }
    return sommets.get(id);
  };
  const nom = (n) => {
    if (!indiceNom.has(n)) { indiceNom.set(n, noms.length); noms.push(n); }
    return indiceNom.get(n);
  };
  for (const v of voies) {
    const ns = v.nodes.filter((n) => coords.has(n));
    if (ns.length < 2) continue;
    const iNom = nom(nomVoie(v.tags));
    let debut = 0;
    for (let i = 1; i < ns.length; i++) {
      if (i < ns.length - 1 && usage.get(ns[i]) < 2) continue;
      const morceau = ns.slice(debut, i + 1).map((n) => coords.get(n));
      if (ns[debut] !== ns[i]) {
        const geo = simplifier(morceau);
        troncons.push({ a: sommet(ns[debut]), b: sommet(ns[i]), nom: iNom, milieu: geo.slice(1, -1) });
      }
      debut = i;
    }
  }
  return { listeSommets, troncons, noms };
}

// Ne garder que le plus grand ensemble de rues reliées entre elles
function plusGrandeComposante(g) {
  const parent = g.listeSommets.map((_, i) => i);
  const racine = (i) => { while (parent[i] !== i) i = parent[i] = parent[parent[i]]; return i; };
  for (const t of g.troncons) parent[racine(t.a)] = racine(t.b);
  const taille = new Map();
  g.listeSommets.forEach((_, i) => { const r = racine(i); taille.set(r, (taille.get(r) || 0) + 1); });
  const grande = [...taille.entries()].sort((x, y) => y[1] - x[1])[0][0];
  const nouveau = new Map();
  const sommets = [];
  g.listeSommets.forEach((p, i) => { if (racine(i) === grande) { nouveau.set(i, sommets.length); sommets.push(p); } });
  const troncons = g.troncons.filter((t) => nouveau.has(t.a)).map((t) => ({ ...t, a: nouveau.get(t.a), b: nouveau.get(t.b) }));
  return { listeSommets: sommets, troncons, noms: g.noms };
}

function encoder(g, b) {
  const p = [];
  let plat = 0, plng = 0;
  const ajouter = (pt) => {
    const lat = Math.round(pt[0] * 1e5), lng = Math.round(pt[1] * 1e5);
    p.push(lat - plat, lng - plng);
    plat = lat; plng = lng;
  };
  g.listeSommets.forEach(ajouter);
  const a = [];
  for (const t of g.troncons) {
    a.push(t.a, t.b, t.nom, t.milieu.length);
    t.milieu.forEach(ajouter);
  }
  return { v: 1, date: new Date().toISOString().slice(0, 10), zone: [b.s, b.w, b.n, b.e], noms: g.noms, p, a };
}

const b = await zone();
if (process.argv[2] === "--zone") {
  console.log([b.w, b.s, b.e, b.n].join(","));
  process.exit(0);
}
console.log("Zone :", b);
const source = process.argv[2];
const osm = !source ? await telecharger(b) : source.endsWith(".opl") ? lireOpl(await readFile(source, "utf8")) : JSON.parse(await readFile(source, "utf8"));
const g = plusGrandeComposante(construire(osm));
const sortie = encoder(g, b);
const texte = JSON.stringify(sortie);
await writeFile(new URL("../data/chemins.json", import.meta.url), texte);
console.log(g.listeSommets.length + " carrefours, " + g.troncons.length + " tronçons, " + g.noms.length + " noms, " + Math.round(texte.length / 1024) + " Ko");
