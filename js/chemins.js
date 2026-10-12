/*
 * Itinéraires à pied, calculés sur le téléphone (sans internet), à partir de data/chemins.json
 * (rues et chemins de Lille, OpenStreetMap, fabriqué par outils/chemins.mjs).
 *
 *   const plan = PaladinesChemins.lire(json);
 *   const trajet = PaladinesChemins.itineraire(plan, depart, arrivee);  // {lat, lng} chacun
 *   → { points: [[lat, lng]…], cumul: [m…], longueur, etapes: [{ type, nom, i, dist }…] } ou null
 *   PaladinesChemins.suivre(trajet, position, indiceDepuis) → { ecart, dist, i }
 *
 * Types d'étape : depart, tout-droit, gauche, droite, leg-gauche, leg-droite, demi-tour,
 * escalier, traversee, arrivee. « nom » est le nom de la rue prise (ou « #chemin », « #rue »…).
 */
(function (global) {
  "use strict";

  const KLAT = 110540;
  const CELLULE = 0.001; // degré : environ 110 m × 70 m
  const ACCROCHE_MAX = 600; // mètres : au-delà, le point est hors du plan

  function kLng(lat) {
    return Math.cos((lat * Math.PI) / 180) * 111320;
  }

  function metres(a, b) {
    return Math.hypot((b[0] - a[0]) * KLAT, (b[1] - a[1]) * kLng(a[0]));
  }

  // Cap de a vers b, en degrés (0 = nord, 90 = est)
  function cap(a, b) {
    const x = (b[1] - a[1]) * kLng(a[0]);
    const y = (b[0] - a[0]) * KLAT;
    return ((Math.atan2(x, y) * 180) / Math.PI + 360) % 360;
  }

  // Projection de p sur le segment [a, b] : { t (0 à 1), d (mètres) }
  function projeter(p, a, b) {
    const k = kLng(a[0]);
    const bx = (b[1] - a[1]) * k, by = (b[0] - a[0]) * KLAT;
    const px = (p[1] - a[1]) * k, py = (p[0] - a[0]) * KLAT;
    const l2 = bx * bx + by * by;
    const t = l2 ? Math.max(0, Math.min(1, (px * bx + py * by) / l2)) : 0;
    return { t: t, d: Math.hypot(px - t * bx, py - t * by) };
  }

  /* ---------- Lecture du plan ---------- */
  function lire(j) {
    const p = j.p;
    const pts = [];
    let lat = 0, lng = 0;
    for (let i = 0; i < p.length; i += 2) {
      lat += p[i];
      lng += p[i + 1];
      pts.push([lat / 1e5, lng / 1e5]);
    }
    const nbTroncons = j.a.length / 4;
    const troncons = new Array(nbTroncons);
    let nbSommets = 0;
    for (let e = 0; e < nbTroncons; e++) nbSommets = Math.max(nbSommets, j.a[e * 4] + 1, j.a[e * 4 + 1] + 1);
    let suite = nbSommets; // les points intermédiaires suivent les carrefours
    const voisins = Array.from({ length: nbSommets }, () => []);
    for (let e = 0; e < nbTroncons; e++) {
      const a = j.a[e * 4], b = j.a[e * 4 + 1], nom = j.a[e * 4 + 2], k = j.a[e * 4 + 3];
      const geo = [pts[a]].concat(pts.slice(suite, suite + k), [pts[b]]);
      suite += k;
      const cumul = [0];
      for (let i = 1; i < geo.length; i++) cumul.push(cumul[i - 1] + metres(geo[i - 1], geo[i]));
      troncons[e] = { a: a, b: b, nom: j.noms[nom], geo: geo, cumul: cumul, long: cumul[cumul.length - 1] };
      voisins[a].push(e);
      voisins[b].push(e);
    }
    // Grille : quels tronçons passent dans chaque case (pour trouver la rue la plus proche)
    const grille = new Map();
    troncons.forEach((t, e) => {
      for (let i = 1; i < t.geo.length; i++) {
        const p1 = t.geo[i - 1], p2 = t.geo[i];
        const x0 = Math.floor(Math.min(p1[1], p2[1]) / CELLULE), x1 = Math.floor(Math.max(p1[1], p2[1]) / CELLULE);
        const y0 = Math.floor(Math.min(p1[0], p2[0]) / CELLULE), y1 = Math.floor(Math.max(p1[0], p2[0]) / CELLULE);
        for (let x = x0; x <= x1; x++) {
          for (let y = y0; y <= y1; y++) {
            const cle = x + "," + y;
            let l = grille.get(cle);
            if (!l) grille.set(cle, (l = []));
            if (l[l.length - 1] !== e) l.push(e);
          }
        }
      }
    });
    return { sommets: pts.slice(0, nbSommets), troncons: troncons, voisins: voisins, grille: grille, date: j.date, zone: j.zone };
  }

  /* ---------- Accroche d'un point à la rue la plus proche ---------- */
  function accrocher(plan, point) {
    const p = [point.lat, point.lng];
    const cx = Math.floor(p[1] / CELLULE), cy = Math.floor(p[0] / CELLULE);
    let mieux = null;
    for (let r = 0; r <= 6; r++) {
      for (let x = cx - r; x <= cx + r; x++) {
        for (let y = cy - r; y <= cy + r; y++) {
          if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== r) continue;
          const l = plan.grille.get(x + "," + y);
          if (!l) continue;
          for (const e of l) {
            const t = plan.troncons[e];
            for (let i = 1; i < t.geo.length; i++) {
              const pr = projeter(p, t.geo[i - 1], t.geo[i]);
              if (!mieux || pr.d < mieux.d) {
                mieux = { e: e, i: i, t: pr.t, d: pr.d, pos: t.cumul[i - 1] + pr.t * (t.cumul[i] - t.cumul[i - 1]) };
              }
            }
          }
        }
      }
      // une case fait au moins 70 m : inutile d'aller plus loin une fois un tronçon proche trouvé
      if (mieux && mieux.d < r * 70) break;
    }
    if (!mieux || mieux.d > ACCROCHE_MAX) return null;
    const t = plan.troncons[mieux.e];
    const a = t.geo[mieux.i - 1], b = t.geo[mieux.i];
    mieux.point = [a[0] + (b[0] - a[0]) * mieux.t, a[1] + (b[1] - a[1]) * mieux.t];
    return mieux;
  }

  /* ---------- Plus court chemin (A*) ---------- */
  function Tas() {
    this.c = [];
    this.v = [];
  }
  Tas.prototype.ajouter = function (cle, val) {
    const c = this.c, v = this.v;
    let i = c.length;
    c.push(cle);
    v.push(val);
    while (i > 0) {
      const pa = (i - 1) >> 1;
      if (c[pa] <= c[i]) break;
      [c[pa], c[i]] = [c[i], c[pa]];
      [v[pa], v[i]] = [v[i], v[pa]];
      i = pa;
    }
  };
  Tas.prototype.prendre = function () {
    const c = this.c, v = this.v;
    const haut = v[0];
    const dc = c.pop(), dv = v.pop();
    if (c.length) {
      c[0] = dc;
      v[0] = dv;
      let i = 0;
      for (;;) {
        const g = 2 * i + 1, d = g + 1;
        let m = i;
        if (g < c.length && c[g] < c[m]) m = g;
        if (d < c.length && c[d] < c[m]) m = d;
        if (m === i) break;
        [c[m], c[i]] = [c[i], c[m]];
        [v[m], v[i]] = [v[i], v[m]];
        i = m;
      }
    }
    return haut;
  };

  // Morceau de tronçon entre deux positions (en mètres depuis son début), dans le sens du trajet
  function morceau(t, de, a) {
    const sens = a >= de ? 1 : -1;
    const lo = Math.min(de, a), hi = Math.max(de, a);
    const pts = [pointA(t, lo)];
    for (let i = 1; i < t.geo.length - 1; i++) if (t.cumul[i] > lo && t.cumul[i] < hi) pts.push(t.geo[i]);
    pts.push(pointA(t, hi));
    return sens === 1 ? pts : pts.reverse();
  }

  function pointA(t, pos) {
    for (let i = 1; i < t.geo.length; i++) {
      if (pos <= t.cumul[i] || i === t.geo.length - 1) {
        const l = t.cumul[i] - t.cumul[i - 1];
        const f = l ? Math.max(0, Math.min(1, (pos - t.cumul[i - 1]) / l)) : 0;
        const a = t.geo[i - 1], b = t.geo[i];
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      }
    }
    return t.geo[t.geo.length - 1];
  }

  function itineraire(plan, depart, arrivee) {
    const s = accrocher(plan, depart);
    const f = accrocher(plan, arrivee);
    if (!s || !f) return null;
    const tS = plan.troncons[s.e], tF = plan.troncons[f.e];
    const n = plan.sommets.length;
    const CIBLE = n; // sommet virtuel : l'arrivée
    const g = new Float64Array(n + 1).fill(Infinity);
    const venu = new Int32Array(n + 1).fill(-1); // tronçon par lequel on arrive
    const fait = new Uint8Array(n + 1);
    const but = f.point;
    const h = (i) => (i === CIBLE ? 0 : metres(plan.sommets[i], but));
    const tas = new Tas();
    const poser = (i, val, e) => {
      if (val < g[i]) {
        g[i] = val;
        venu[i] = e;
        tas.ajouter(val + h(i), i);
      }
    };
    poser(tS.a, s.pos, -2);
    poser(tS.b, tS.long - s.pos, -3);
    // Départ et arrivée sur le même tronçon : chemin direct possible
    let direct = s.e === f.e ? Math.abs(f.pos - s.pos) : Infinity;
    while (tas.c.length) {
      const u = tas.prendre();
      if (fait[u]) continue;
      fait[u] = 1;
      if (u === CIBLE) break;
      if (u === tF.a) poser(CIBLE, g[u] + f.pos, -4);
      if (u === tF.b) poser(CIBLE, g[u] + tF.long - f.pos, -5);
      for (const e of plan.voisins[u]) {
        const t = plan.troncons[e];
        const v = t.a === u ? t.b : t.a;
        if (!fait[v]) poser(v, g[u] + t.long, e);
      }
    }
    let points;
    if (direct <= g[CIBLE]) {
      points = morceau(tS, s.pos, f.pos);
    } else {
      if (!isFinite(g[CIBLE])) return null;
      // Remonter le chemin depuis l'arrivée
      const pieces = [];
      const premierSommet = venu[CIBLE] === -4 ? tF.a : tF.b;
      pieces.push({ pts: morceau(tF, venu[CIBLE] === -4 ? 0 : tF.long, f.pos), nom: tF.nom });
      let u = premierSommet;
      while (venu[u] >= 0) {
        const t = plan.troncons[venu[u]];
        const v = t.a === u ? t.b : t.a;
        pieces.push({ pts: morceau(t, t.a === v ? 0 : t.long, t.a === v ? t.long : 0), nom: t.nom });
        u = v;
      }
      pieces.push({ pts: morceau(tS, s.pos, venu[u] === -2 ? 0 : tS.long), nom: tS.nom });
      pieces.reverse();
      return construire(pieces, depart, arrivee);
    }
    return construire([{ pts: points, nom: tS.nom }], depart, arrivee);
  }

  /* ---------- Trajet et étapes ---------- */
  function construire(pieces, depart, arrivee) {
    const points = [];
    const noms = []; // nom de la rue de chaque segment (points[i] → points[i+1])
    pieces.forEach((pc) => {
      pc.pts.forEach((p, k) => {
        const dernier = points[points.length - 1];
        if (dernier && metres(dernier, p) < 0.5) return;
        if (points.length) noms.push(k === 0 ? noms[noms.length - 1] || pc.nom : pc.nom);
        points.push(p);
      });
    });
    if (points.length < 2) points.push(points[0] || [arrivee.lat, arrivee.lng]), noms.push(pieces[0].nom);
    const cumul = [0];
    for (let i = 1; i < points.length; i++) cumul.push(cumul[i - 1] + metres(points[i - 1], points[i]));
    const longueur = cumul[cumul.length - 1];
    return { points: points, noms: noms, cumul: cumul, longueur: longueur, etapes: etapes(points, noms, cumul), arrivee: [arrivee.lat, arrivee.lng] };
  }

  // Cap moyen sur ~20 m avant (ou après) le point i
  function capAutour(points, cumul, i, apres) {
    const base = cumul[i];
    let j = i;
    if (apres) {
      while (j < points.length - 1 && cumul[j] - base < 20) j++;
      return j === i ? null : cap(points[i], points[j]);
    }
    while (j > 0 && base - cumul[j] < 20) j--;
    return j === i ? null : cap(points[j], points[i]);
  }

  function angleEntre(avant, apres) {
    return ((apres - avant + 540) % 360) - 180;
  }

  function typeVirage(angle) {
    // angle : de -180 (gauche) à 180 (droite)
    const a = Math.abs(angle);
    if (a < 25) return "tout-droit";
    if (a < 60) return angle < 0 ? "leg-gauche" : "leg-droite";
    if (a < 150) return angle < 0 ? "gauche" : "droite";
    return "demi-tour";
  }

  function etapes(points, noms, cumul) {
    const liste = [{ type: "depart", nom: noms[0], i: 0, dist: 0 }];
    // Changement de rue, ou virage net dans la même rue
    for (let i = 1; i < points.length - 1; i++) {
      const avant = capAutour(points, cumul, i, false);
      const apres = capAutour(points, cumul, i, true);
      if (avant === null || apres === null) continue;
      const angle = angleEntre(avant, apres);
      const change = noms[i] !== noms[i - 1];
      const nom = noms[i];
      let type = null;
      if (nom === "#escalier" && change) type = "escalier";
      else if (nom === "#traversee" && change) type = "traversee";
      else if (change && nom !== "#traversee" && noms[i - 1] !== "#traversee") type = typeVirage(angle);
      else if (change) type = Math.abs(angle) >= 60 ? typeVirage(angle) : null; // sortie d'une traversée
      else if (Math.abs(angle) >= 60) type = typeVirage(angle);
      if (!type) continue;
      // Les petits écarts de nom (trottoir, bout de chemin) ne méritent pas une consigne
      if (type === "tout-droit" && (nom.charAt(0) === "#" || noms[i - 1].charAt(0) === "#")) continue;
      liste.push({ type: type, nom: nom, i: i, dist: cumul[i] });
    }
    fusionner(liste, points, cumul);
    // Rue nommée prise juste après un tronçon sans nom au départ : la donner au départ
    if (liste[0].nom.charAt(0) === "#" && liste[1] && liste[1].dist < 25 && liste[1].nom.charAt(0) !== "#") {
      liste[0].nom = liste[1].nom;
      liste.splice(1, 1);
    }
    liste.push({ type: "arrivee", nom: "", i: points.length - 1, dist: cumul[cumul.length - 1] });
    return liste;
  }

  // Deux consignes à moins de 25 m (passage d'un trottoir à l'autre, carrefour en deux temps) :
  // une seule, avec le virage d'ensemble mesuré avant la première et après la seconde
  function fusionner(liste, points, cumul) {
    const special = (e) => e.type === "escalier" || e.type === "traversee";
    for (let k = 1; k < liste.length - 1; k++) {
      const a = liste[k], b = liste[k + 1];
      if (!b || b.dist - a.dist >= 25) continue;
      if (a.type === "traversee" && b.type === "traversee") {
        liste.splice(k + 1, 1);
        k--;
        continue;
      }
      if (special(a) || special(b)) continue;
      const avant = capAutour(points, cumul, a.i, false);
      const apres = capAutour(points, cumul, b.i, true);
      if (avant === null || apres === null) continue;
      const type = typeVirage(angleEntre(avant, apres));
      const nomPareil = b.nom === noms0(liste, k);
      if (type === "tout-droit" && (nomPareil || b.nom.charAt(0) === "#")) liste.splice(k, 2);
      else liste.splice(k, 2, { type: type, nom: b.nom, i: a.i, dist: a.dist });
      k--;
    }
  }

  // Nom de la rue où l'on est avant la consigne k
  function noms0(liste, k) {
    return k > 0 ? liste[k - 1].nom : "";
  }

  /* ---------- Suivi pendant la marche ---------- */
  // Où en est-on sur le trajet ? On cherche près de la dernière position connue
  function suivre(trajet, position, depuis) {
    const p = [position.lat, position.lng];
    const pts = trajet.points;
    let mieux = null;
    const debut = Math.max(1, (depuis || 1) - 3);
    for (let i = debut; i < pts.length; i++) {
      // pas plus de 300 m en avant : évite de « sauter » sur un passage parallèle plus loin
      if (trajet.cumul[i - 1] - trajet.cumul[debut - 1] > 300 && mieux) break;
      const pr = projeter(p, pts[i - 1], pts[i]);
      if (!mieux || pr.d < mieux.ecart - 0.5) {
        mieux = { ecart: pr.d, i: i, dist: trajet.cumul[i - 1] + pr.t * (trajet.cumul[i] - trajet.cumul[i - 1]) };
      }
    }
    return mieux;
  }

  global.PaladinesChemins = { lire: lire, itineraire: itineraire, suivre: suivre, accrocher: accrocher, metres: metres, cap: cap };
})(typeof window !== "undefined" ? window : globalThis);
