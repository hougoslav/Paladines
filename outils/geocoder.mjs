// Calcule la position GPS de chaque lieu à partir de son adresse, avec la Base Adresse
// Nationale (service public gratuit), et écrit le résultat dans data/coordonnees.js.
//
// Utilisation (Node 18 ou plus), depuis le dossier du projet :
//   node outils/geocoder.mjs
//
// À relancer après chaque modification d'adresse dans data/lieux.js. GitHub le fait tout seul
// (.github/workflows/positions.yml) à chaque changement de data/lieux.js.
//
// Un résultat n'est gardé que s'il tombe dans la bonne rue (même type de voie, même nom) et,
// si l'adresse a un numéro, au bon numéro. Sinon on réessaie avec l'autre code postal de Lille
// (59000 / 59800), puis sans code postal. À défaut, le lieu est placé au milieu de la bonne rue ;
// si même la rue est introuvable, la position déjà connue est gardée.
// Un lieu qui a lat/lng dans data/lieux.js (position vérifiée à la main) n'est jamais recalculé.

import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const SERVICES = [
  "https://data.geopf.fr/geocodage/search?limit=5&lat=50.63&lon=3.06&q=",
  "https://api-adresse.data.gouv.fr/search/?limit=5&lat=50.63&lon=3.06&q=",
];

const TYPES_VOIE = ["rue", "avenue", "boulevard", "place", "chemin", "quai", "parvis", "cite", "allee", "impasse", "square", "cour", "passage", "route", "pont", "port", "sentier", "voie", "residence"];
const MOTS_VIDES = new Set(["de", "du", "des", "la", "le", "les", "l", "d", "et", "a", "au", "aux", "en", "sur", "president"]);

const code = await readFile(new URL("../data/lieux.js", import.meta.url), "utf8");
const bac = { window: {} };
vm.runInNewContext(code, bac);
const { lieux } = bac.window.PALADINES_DATA;

// On part des positions déjà connues : une adresse non trouvée garde sa position actuelle
const actuel = { window: {} };
try {
  vm.runInNewContext(await readFile(new URL("../data/coordonnees.js", import.meta.url), "utf8"), actuel);
} catch {
  // pas encore de fichier
}

function normaliser(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

// « 32-34 rue de Thumesnil, 59000 Lille » → { numero: "32", type: "rue", mots: ["thumesnil"], cp: "59000" }
function decouper(adresse) {
  const [voie, reste = ""] = adresse.split(",");
  const n = normaliser(voie).split(" ");
  const numero = /^\d+$/.test(n[0]) ? n.shift() : null;
  while (n.length && /^(\d+|bis|ter)$/.test(n[0])) n.shift(); // « 32 34 », « 12 bis »
  const type = TYPES_VOIE.includes(n[0]) ? n.shift() : null;
  const cp = (reste.match(/\b59\d{3}\b/) || [])[0] || null;
  const ville = normaliser(reste.replace(/\b\d{5}\b/, "")) || "lille";
  return { voie: voie.trim(), numero, type, mots: n.filter((m) => !MOTS_VIDES.has(m)), cp, ville };
}

// Le résultat est-il dans la bonne rue ?
function bonneRue(f, a) {
  const p = f.properties;
  if (p.type !== "housenumber" && p.type !== "street") return false;
  // La bonne ville (« Lille » n'est pas « Lillers ») : même nom, ou même code postal (Lomme, Hellemmes)
  const villes = normaliser(p.city || "").split(" ");
  if (!a.ville.split(" ").some((v) => villes.includes(v)) && p.postcode !== a.cp) return false;
  const rue = normaliser(p.street || p.name || "");
  if (a.type && !rue.startsWith(a.type)) return false;
  const mots = rue.split(" ");
  return a.mots.every((m) => mots.includes(m));
}

// … et au bon numéro ?
function bonNumero(f, a) {
  const p = f.properties;
  return !a.numero || (p.type === "housenumber" && String(p.housenumber).replace(/\D.*$/, "") === a.numero);
}

async function chercher(requete) {
  for (const service of SERVICES) {
    try {
      const rep = await fetch(service + encodeURIComponent(requete));
      if (!rep.ok) continue;
      return (await rep.json()).features || [];
    } catch {
      // essayer le service suivant
    }
  }
  return [];
}

async function geocoder(adresse) {
  const a = decouper(adresse);
  const essais = [adresse];
  const debut = (a.numero ? a.numero + " " : "") + a.voie.replace(/^[\d\s-]+(bis|ter)?\s*/i, "");
  if (a.cp === "59000") essais.push(debut + ", 59800 Lille");
  if (a.cp === "59800") essais.push(debut + ", 59000 Lille");
  essais.push(debut + ", " + (a.ville === "lille" ? "Lille" : a.ville));
  let rueSeule = null; // la bonne rue sans le numéro : position approximative, en dernier recours
  for (const requete of essais) {
    const trouves = (await chercher(requete)).filter((x) => bonneRue(x, a));
    const f = trouves.find((x) => bonNumero(x, a));
    if (f) return resultat(f, requete, false);
    rueSeule = rueSeule || (trouves[0] && resultat(trouves[0], requete, true));
    await new Promise((ok) => setTimeout(ok, 150));
  }
  return rueSeule;
}

function resultat(f, requete, approx) {
  return { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], score: f.properties.score, label: f.properties.label, requete, approx };
}

const coords = { ...(actuel.window.PALADINES_COORDS || {}) };
const aVerifier = [];
for (const l of lieux) {
  if (l.adresseMasquee || !(l.adresseGeo || l.adresse)) continue;
  if (typeof l.lat === "number") {
    delete coords[l.id]; // position vérifiée à la main dans data/lieux.js
    console.log(`${l.id}  main  position de data/lieux.js`);
    continue;
  }
  const adresse = l.adresseGeo || l.adresse;
  const r = await geocoder(adresse);
  if (!r) {
    aVerifier.push(`${l.id} ${l.nom} (« ${adresse} »)` + (coords[l.id] ? " : ancienne position gardée" : " : PAS DE POSITION"));
    continue;
  }
  coords[l.id] = [Math.round(r.lat * 1e5) / 1e5, Math.round(r.lng * 1e5) / 1e5];
  if (r.approx) aVerifier.push(`${l.id} ${l.nom} (« ${adresse} ») : numéro introuvable, placé au milieu de la rue`);
  console.log(`${l.id}  ${r.score.toFixed(2)}  ${r.label}` + (r.approx ? "   (rue seulement)" : "") + (r.requete !== adresse ? `   (trouvé avec « ${r.requete} »)` : ""));
  await new Promise((ok) => setTimeout(ok, 150)); // rester poli avec le service
}

if (aVerifier.length) console.warn(`\n⚠️  Adresses à vérifier (rue ou numéro introuvables) :\n  ${aVerifier.join("\n  ")}`);

const entete = `/*
 * Positions GPS des lieux : { id: [latitude, longitude] }.
 * Fichier généré par \`node outils/geocoder.mjs\` (Base Adresse Nationale).
 * Les lieux qui ont lat/lng dans data/lieux.js n'y figurent pas (position vérifiée à la main).
 */
`;
await writeFile(new URL("../data/coordonnees.js", import.meta.url), entete + "window.PALADINES_COORDS = " + JSON.stringify(coords, null, 1) + ";\n");
console.log(`\n${Object.keys(coords).length} positions écrites dans data/coordonnees.js`);
