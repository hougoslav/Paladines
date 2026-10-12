// Lecture du format OPL d'osmium (une ligne par élément OpenStreetMap), pour les outils
// chemins.mjs et equipements.mjs. Rend le même format que l'API Overpass : { elements: [...] }.
//   n12 v1 … Tamenity=toilets x3.05 y50.63      (nœud)
//   w34 v1 … Thighway=residential,name=… Nn1,n2  (voie)
export function lireOpl(texte) {
  const decoder = (v) => v.replace(/%([0-9a-f]+)%/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
  const lireTags = (t) => {
    const tags = {};
    if (t) for (const kv of t.split(",")) { const i = kv.indexOf("="); tags[decoder(kv.slice(0, i))] = decoder(kv.slice(i + 1)); }
    return tags;
  };
  const elements = [];
  for (const ligne of texte.split("\n")) {
    if (!ligne) continue;
    const champs = ligne.split(" ");
    const type = champs[0][0], id = Number(champs[0].slice(1));
    const ch = {};
    for (const c of champs.slice(1)) ch[c[0]] = c.slice(1);
    if (type === "n") elements.push({ type: "node", id: id, lat: Number(ch.y), lon: Number(ch.x), tags: lireTags(ch.T) });
    else if (type === "w") elements.push({ type: "way", id: id, tags: lireTags(ch.T), nodes: ch.N ? ch.N.split(",").map((n) => Number(n.slice(1))) : [] });
  }
  return { elements: elements };
}
