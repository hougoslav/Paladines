// Calcule la position GPS de chaque lieu à partir de son adresse, avec la Base Adresse
// Nationale (service public gratuit), et écrit le résultat dans data/coordonnees.js.
//
// Utilisation (Node 18 ou plus), depuis le dossier du projet :
//   node outils/geocoder.mjs
//
// À relancer après chaque modification d'adresse dans data/lieux.js.

import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const SERVICES = [
  "https://data.geopf.fr/geocodage/search?limit=1&q=",
  "https://api-adresse.data.gouv.fr/search/?limit=1&q=",
];

const code = await readFile(new URL("../data/lieux.js", import.meta.url), "utf8");
const bac = { window: {} };
vm.runInNewContext(code, bac);
const { lieux } = bac.window.PALADINES_DATA;

async function geocoder(adresse) {
  for (const service of SERVICES) {
    try {
      const rep = await fetch(service + encodeURIComponent(adresse));
      if (!rep.ok) continue;
      const f = (await rep.json()).features?.[0];
      if (!f) return null;
      return { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], score: f.properties.score, label: f.properties.label };
    } catch {
      // essayer le service suivant
    }
  }
  return null;
}

const coords = {};
for (const l of lieux) {
  if (l.adresseMasquee || !(l.adresseGeo || l.adresse)) continue;
  const adresse = l.adresseGeo || l.adresse;
  const r = await geocoder(adresse);
  if (!r || r.score < 0.45) {
    console.warn(`⚠️  ${l.id} ${l.nom} : adresse non trouvée (« ${adresse} »)`);
    continue;
  }
  coords[l.id] = [Math.round(r.lat * 1e5) / 1e5, Math.round(r.lng * 1e5) / 1e5];
  console.log(`${l.id}  ${r.score.toFixed(2)}  ${r.label}`);
  await new Promise((ok) => setTimeout(ok, 150)); // rester poli avec le service
}

const entete = `/*
 * Positions GPS des lieux : { id: [latitude, longitude] }.
 * Fichier généré par \`node outils/geocoder.mjs\` (Base Adresse Nationale). Ne pas modifier à la main.
 */
`;
await writeFile(new URL("../data/coordonnees.js", import.meta.url), entete + "window.PALADINES_COORDS = " + JSON.stringify(coords, null, 1) + ";\n");
console.log(`\n${Object.keys(coords).length} positions écrites dans data/coordonnees.js`);
