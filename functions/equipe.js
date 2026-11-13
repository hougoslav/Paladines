/*
 * Page de l'équipe (Cloudflare Pages Functions : /equipe), protégée par le mot de passe
 * MOT_DE_PASSE. On le tape une fois dans une page de connexion ; le téléphone reste ensuite
 * connecté 90 jours (cookie signé). Changer MOT_DE_PASSE déconnecte tout le monde.
 * Pas de fenêtre « Basic Auth » du navigateur : sur iPhone, ouverte depuis l'écran
 * d'accueil, elle laissait un écran noir plusieurs secondes et redemandait le mot de passe.
 * - Onglet « À traiter » : signalements envoyés depuis l'appli, à marquer « traité » une fois réglés.
 * - Onglet « Historique » : les signalements traités (date de réception et de traitement),
 *   à remettre à traiter ou à supprimer définitivement.
 * - Onglet « Lieux » : corriger un lieu sans toucher au code (fermeture temporaire, horaires,
 *   téléphone, message sur la fiche) et ajouter un lieu. Lu par l'appli via /api/corrections.
 * - Onglet « Statistiques » : version en ligne, avis « Ce lieu vous a aidée ? », versions, visites.
 * Les données sont dans l'espace KV « SIGNALEMENTS » : un signalement par clé (sa date),
 * un compteur par mois sous « visites:AAAA-MM » (voir api/visite.js), les avis sous
 * « avis:<lieu>:AAAA-MM » (api/avis.js), les corrections sous « correction:<id> » et les lieux
 * ajoutés sous « ajout:<id> » (api/corrections.js).
 * Les noms des lieux viennent de /data/lieux.js, lu dans le navigateur par /js/equipe.js.
 */
import { VERSIONS } from "../data/versions.mjs";

const LIBELLES = {
  ferme: "Le lieu est fermé définitivement",
  horaires: "Les horaires sont faux",
  adresse: "L'adresse est fausse",
  accueil: "Elle a été mal accueillie",
  manque: "Il manque un lieu",
  bug: "Quelque chose ne marche pas",
  traduction: "Une traduction est fausse",
  autre: "Autre chose"
};
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const NB_MOIS = 12;
const ONGLETS = ["signalements", "historique", "lieux", "statistiques"];
const SEMAINE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const PREFIXES = ["visites:", "avis:", "correction:", "ajout:"];
const CATEGORIES = ["dormir", "manger", "hygiene", "sante", "ecoute", "pause", "vetements", "bagagerie", "droits", "recharge", "wifi"];
const DUREE_GARDE = 60 * 60 * 24 * 365; // comme api/signalement.js : un signalement s'efface un an après sa réception

export async function onRequestGet({ request, env }) {
  if (!(await connecte(request, env))) return pageConnexion(env, "");
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés : liez un espace KV nommé SIGNALEMENTS.", 503);

  const demande = new URL(request.url).searchParams.get("onglet");
  const onglet = ONGLETS.indexOf(demande) !== -1 ? demande : "signalements";
  const { signalements, visites, avis, corrections, ajouts } = await toutLire(env.SIGNALEMENTS);
  const aTraiter = signalements.filter((x) => !x.s.traite);
  const traites = signalements.filter((x) => x.s.traite).sort((a, b) => (a.s.traite < b.s.traite ? 1 : -1));
  const corps = onglet === "statistiques" ? htmlStatistiques(visites, aTraiter.length, traites.length, avis)
    : onglet === "lieux" ? htmlLieux(corrections, ajouts, new URL(request.url).searchParams.get("ok"))
    : onglet === "historique" ? htmlHistorique(traites, signalements.length)
    : htmlSignalements(aTraiter);
  return reponse(page(onglet, aTraiter.length, corps), 200, "text/html; charset=utf-8");
}

export async function onRequestPost({ request, env }) {
  // Seules les pages de ce site peuvent envoyer ces formulaires
  const origine = request.headers.get("origin");
  if (origine && origine !== new URL(request.url).origin) return texte("Interdit", 403);
  const f = await request.formData();
  const action = f.get("action");

  if (action === "connexion") {
    const mdp = f.get("mot_de_passe");
    if (!env.MOT_DE_PASSE || typeof mdp !== "string" || !egal(mdp, env.MOT_DE_PASSE)) return pageConnexion(env, "Mot de passe incorrect.");
    return versEquipe(await cookieSession(env));
  }
  if (action === "deconnexion") return versEquipe(NOM_COOKIE + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");

  if (!(await connecte(request, env))) return pageConnexion(env, "");
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés", 503);

  // Onglet « Lieux » : corrections et lieux ajoutés
  if (action === "corriger" || action === "ajouter") {
    const res = action === "corriger" ? lireCorrection(f) : lireAjout(f);
    if (res.erreur) return texte(res.erreur + " Revenez en arrière pour corriger.", 400);
    if (res.supprimer) await env.SIGNALEMENTS.delete(res.cle);
    else await env.SIGNALEMENTS.put(res.cle, JSON.stringify(res.valeur));
    return versEquipe(null, "lieux", res.id);
  }
  if (action === "annuler-correction" || action === "supprimer-ajout") {
    const id = f.get("id");
    if (typeof id === "string" && /^[a-z0-9]{1,20}$/.test(id)) await env.SIGNALEMENTS.delete((action === "supprimer-ajout" ? "ajout:" : "correction:") + id);
    return versEquipe(null, "lieux", id);
  }

  const cle = f.get("cle");
  if (typeof cle !== "string" || PREFIXES.some((x) => cle.indexOf(x) === 0)) return versEquipe();
  if (action === "supprimer") {
    await env.SIGNALEMENTS.delete(cle);
    return versEquipe(null, "historique");
  }
  if (action === "traite" || action === "retablir") {
    const v = await env.SIGNALEMENTS.get(cle);
    if (v) {
      const s = JSON.parse(v);
      if (action === "traite") s.traite = new Date().toISOString();
      else delete s.traite;
      // Garder la même date d'effacement (un an après la réception)
      const fin = Math.floor(Date.parse(s.date) / 1000) + DUREE_GARDE;
      if (fin > Date.now() / 1000 + 60) await env.SIGNALEMENTS.put(cle, JSON.stringify(s), { expiration: fin });
      else await env.SIGNALEMENTS.delete(cle);
    }
    return versEquipe(null, action === "traite" ? "signalements" : "historique");
  }
  return versEquipe();
}

function versEquipe(cookie, onglet, id) {
  const h = {
    Location: "/equipe" + (onglet && onglet !== "signalements" ? "?onglet=" + onglet + (id ? "&ok=" + encodeURIComponent(id) + "#lieu-" + encodeURIComponent(id) : "") : ""),
    "Cache-Control": "no-store"
  };
  if (cookie) h["Set-Cookie"] = cookie;
  return new Response(null, { status: 303, headers: h });
}

/* ---------- Lecture des données ---------- */
async function toutLire(kv) {
  const cles = [];
  let curseur;
  do {
    const p = await kv.list({ cursor: curseur });
    p.keys.forEach((k) => cles.push(k.name));
    curseur = p.list_complete ? null : p.cursor;
  } while (curseur);

  const visites = {};
  const signalements = [];
  const avis = {};
  const corrections = {};
  const ajouts = [];
  const limiteAvis = moisParis(new Date(Date.now() - 365 * 864e5));
  await Promise.all(cles.map(async (k) => {
    const v = await kv.get(k);
    if (v === null) return;
    if (k.indexOf("visites:") === 0) {
      visites[k.slice(8)] = parseInt(v, 10) || 0;
      return;
    }
    try {
      const j = JSON.parse(v);
      if (k.indexOf("avis:") === 0) {
        const [, lieu, mois] = k.split(":");
        if (mois < limiteAvis) return;
        const a = (avis[lieu] = avis[lieu] || { oui: 0, non: 0 });
        a.oui += j.oui || 0;
        a.non += j.non || 0;
      } else if (k.indexOf("correction:") === 0) corrections[k.slice(11)] = j;
      else if (k.indexOf("ajout:") === 0) ajouts.push(j);
      else signalements.push({ cle: k, s: j });
    } catch (e) {
      /* entrée illisible : ignorée */
    }
  }));
  signalements.sort((a, b) => (a.cle < b.cle ? 1 : -1));
  return { signalements, visites, avis, corrections, ajouts };
}

/* ---------- Onglet « Signalements » ---------- */
function htmlSignalements(items) {
  if (!items.length) return "<p class=\"vide\">Aucun signalement à traiter. Les signalements déjà traités sont dans l'onglet « Historique ».</p>";
  return "<ul class=\"cartes\">" +
    items.map(({ cle, s }) =>
      "<li>" + htmlUnSignalement(s) +
      bouton("traite", cle, "Marquer comme traité", "principal") + "</li>"
    ).join("") + "</ul>";
}

/* ---------- Onglet « Historique » ---------- */
function htmlHistorique(items, total) {
  const intro = '<p class="discret">' + total + " signalement" + (total > 1 ? "s" : "") + " reçu" + (total > 1 ? "s" : "") +
    " en tout, dont " + items.length + " traité" + (items.length > 1 ? "s" : "") + ". Chaque signalement s'efface seul un an après sa réception.</p>";
  if (!items.length) return intro + "<p class=\"vide\">Aucun signalement traité pour l'instant.</p>";
  // Regroupés par mois de traitement
  let mois = "";
  let html = intro;
  items.forEach(({ cle, s }) => {
    const m = nomMois(s.traite);
    if (m !== mois) {
      html += (mois ? "</ul>" : "") + "<h2>" + esc(m) + '</h2><ul class="cartes">';
      mois = m;
    }
    html += '<li class="traite"><p class="statut">Traité le ' + esc(dateHeure(s.traite)) + "</p>" + htmlUnSignalement(s) +
      '<div class="actions">' + bouton("retablir", cle, "Remettre à traiter") +
      bouton("supprimer", cle, "Supprimer définitivement", "danger", "Supprimer définitivement ce signalement ?") + "</div></li>";
  });
  return html + "</ul>";
}

function htmlUnSignalement(s) {
  return "<p class=\"discret\">Reçu le " + esc(dateHeure(s.date)) + (s.langue ? " · " + esc(s.langue.toUpperCase()) : "") + "</p>" +
    "<p><strong>" + esc(LIBELLES[s.raison] || s.raison) + "</strong>" +
    (s.lieu ? ' — <a href="/#lieu-' + esc(s.lieu) + '" target="_blank" rel="noopener" data-nom-lieu="' + esc(s.lieu) + '">' + esc(s.lieu) + "</a>" : " — <em>en général</em>") + "</p>" +
    (s.message ? "<blockquote>" + esc(s.message) + "</blockquote>" : "") +
    (s.lieu ? '<p><a class="lien-corriger" href="/equipe?onglet=lieux#lieu-' + esc(s.lieu) + '">Corriger ce lieu</a></p>' : "");
}

// Les boutons de l'appli : « principal » en bleu nuit, les autres en gris, « danger » écrit en rouge
function bouton(action, cle, libelle, classe, confirmer) {
  const classes = "bouton bouton--petit" + (classe === "principal" ? "" : " bouton--gris") + (classe === "danger" ? " bouton--danger" : "");
  return '<form method="post"' + (confirmer ? " onsubmit=\"return confirm('" + confirmer.replace(/'/g, "\\'") + "')\"" : "") + ">" +
    '<input type="hidden" name="action" value="' + action + '"><input type="hidden" name="cle" value="' + esc(cle) + '">' +
    '<button type="submit" class="' + classes + '">' + esc(libelle) + "</button></form>";
}

function dateHeure(iso) {
  return new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" });
}

function nomMois(iso) {
  const [a, m] = moisParis(new Date(iso)).split("-").map(Number);
  const nom = MOIS[m - 1] + " " + a;
  return nom.charAt(0).toUpperCase() + nom.slice(1);
}

/* ---------- Onglet « Lieux » ----------
 * Le serveur ne connaît pas la liste des lieux (data/lieux.js est un script pour le navigateur) :
 * il envoie les corrections et les lieux ajoutés, et /js/equipe.js dessine les formulaires. */
function htmlLieux(corrections, ajouts, ok) {
  const donnees = JSON.stringify({ corrections: corrections, ajouts: ajouts, ok: ok || "" }).replace(/</g, "\\u003c");
  return (
    '<p class="discret">Corrigez un lieu sans toucher au code : fermeture pour quelques jours, nouveaux horaires, autre numéro, ' +
    "ou un court message affiché sur sa fiche. Les téléphones reçoivent les corrections en quelques minutes, et les gardent sans internet.</p>" +
    '<script type="application/json" id="donnees-lieux">' + donnees + "</script>" +
    '<div id="lieux-equipe"><p class="discret">Chargement des lieux…</p></div>'
  );
}

// « 9h-12h, 14h30-17h » ou « 09:00-12:00 » → [["09:00","12:00"], ["14:30","17:00"]] ; null si illisible
function lirePlages(texte) {
  const t = (texte || "").trim();
  if (!t) return [];
  const heure = (x) => {
    const m = /^(\d{1,2})(?:[h:.](\d{2})?)?$/i.exec(x.trim());
    if (!m || +m[1] > 24 || +(m[2] || 0) > 59) return null;
    return String(+m[1] % 24).padStart(2, "0") + ":" + (m[2] || "00");
  };
  const plages = [];
  for (const morceau of t.split(/[,;]|\bet\b/)) {
    if (!morceau.trim()) continue;
    const [a, b] = morceau.split(/[-–àa]/).map((x) => x && x.trim()).filter(Boolean);
    const d = a && heure(a), f = b && heure(b);
    if (!d || !f) return null;
    plages.push([d, f]);
  }
  return plages;
}

function lireHoraires(f) {
  if (f.get("h24")) return { horaires: "24/7" };
  const h = {};
  let vide = true;
  for (const j of SEMAINE) {
    const p = lirePlages(f.get("h_" + j));
    if (p === null) return { erreur: "Horaires illisibles pour « " + j + " » : écrivez par exemple 9h-12h, 14h-17h30." };
    if (p.length) { h[j] = p; vide = false; }
  }
  return { horaires: vide ? null : h };
}

function champ(f, nom, max) {
  const v = f.get(nom);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function lireCorrection(f) {
  const id = f.get("id");
  if (typeof id !== "string" || !/^[a-z0-9]{1,20}$/.test(id)) return { erreur: "Lieu inconnu." };
  const h = lireHoraires(f);
  if (h.erreur) return h;
  const c = {};
  if (f.get("ferme")) {
    const jusqu = champ(f, "jusqu", 10);
    c.ferme = { jusqu: /^\d{4}-\d{2}-\d{2}$/.test(jusqu) ? jusqu : "", texte: champ(f, "raison", 120) };
  }
  // On ne garde que ce qui a changé par rapport aux infos d'origine
  if (JSON.stringify(h.horaires) !== champ(f, "horaires_origine", 2000)) c.horaires = h.horaires;
  const tel = champ(f, "tel", 30);
  if (tel !== champ(f, "tel_origine", 30)) c.tel = tel;
  const note = champ(f, "note", 200);
  if (note) c.note = note;
  if (!Object.keys(c).length) return { cle: "correction:" + id, supprimer: true, id: id };
  c.maj = new Date().toISOString();
  return { cle: "correction:" + id, valeur: c, id: id };
}

function lireAjout(f) {
  const nom = champ(f, "nom", 120);
  const cat = champ(f, "cat", 20);
  if (!nom || CATEGORIES.indexOf(cat) === -1) return { erreur: "Il faut un nom et un besoin." };
  const h = lireHoraires(f);
  if (h.erreur) return h;
  const id = "n" + crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const lieu = {
    id: id, cat: cat, autresCats: [], nom: nom,
    adresse: champ(f, "adresse", 160), lat: null, lng: null,
    tel: champ(f, "tel", 30), horaires: h.horaires,
    services: champ(f, "services", 600).split("\n").map((x) => x.trim()).filter(Boolean),
    conditions: champ(f, "conditions", 400),
    criteres: f.get("femmes") ? { femmes: true } : {},
    langues: [], adresseMasquee: false, verifie: aujourdhui, sources: [], ajoutEquipe: aujourdhui
  };
  return { cle: "ajout:" + id, valeur: lieu, id: id };
}

/* ---------- Onglet « Statistiques » ---------- */
function htmlStatistiques(visites, nbATraiter, nbTraites, avis) {
  const actuelle = VERSIONS[0];
  return (
    htmlChiffresCles(visites, nbATraiter, nbTraites, actuelle) +
    "<h2>Ce lieu vous a aidée ?</h2>" + htmlAvis(avis) +
    "<h2>Ce que la v" + actuelle.v + " apporte</h2>" +
    '<div class="carte carte--actuelle">' + htmlVersion(actuelle, true) + "</div>" +
    "<h2>Visites par mois</h2>" + htmlVisites(visites) +
    "<h2>Versions précédentes</h2>" +
    '<ul class="cartes">' + VERSIONS.slice(1).map((v) => "<li><details><summary>" + resumeVersion(v) + "</summary>" + listeNouveautes(v) + "</details></li>").join("") + "</ul>"
  );
}

// Chiffres clés en haut de l'onglet : quatre tuiles
function htmlChiffresCles(visites, nbATraiter, nbTraites, actuelle) {
  const [a, m] = moisParis(new Date()).split("-").map(Number);
  const cle = (an, mo) => { const d = new Date(Date.UTC(an, mo - 1, 1)); return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0"); };
  const ceMois = visites[cle(a, m)] || 0;
  const avant = visites[cle(a, m - 1)] || 0;
  const nomAvant = MOIS[(m + 10) % 12];
  // Le mois en cours n'est pas fini : on montre le mois précédent plutôt qu'un pourcentage trompeur
  const note = nomAvant.charAt(0).toUpperCase() + nomAvant.slice(1) + " : " + avant.toLocaleString("fr-FR");
  const total = Object.values(visites).reduce((x, n) => x + n, 0);
  const tuile = (libelle, valeur, detail, lien) =>
    (lien ? '<a class="kpi" href="' + lien + '">' : '<div class="kpi">') +
    '<span class="kpi-libelle">' + esc(libelle) + '</span><span class="kpi-valeur">' + esc(valeur) + '</span><span class="kpi-note">' + esc(detail) + "</span>" +
    (lien ? "</a>" : "</div>");
  return '<section class="kpis" aria-label="Chiffres clés">' +
    tuile("Visites ce mois-ci", ceMois.toLocaleString("fr-FR"), note) +
    tuile("Visites au total", total.toLocaleString("fr-FR"), "Depuis le début du comptage") +
    tuile("Signalements à traiter", String(nbATraiter), nbTraites + " déjà traité" + (nbTraites > 1 ? "s" : ""), "/equipe") +
    tuile("Version en ligne", "v" + actuelle.v, dateCourte(actuelle.date)) +
    "</section>";
}

// Avis des 12 derniers mois, les lieux avec le plus de « non » en premier (à vérifier d'abord)
function htmlAvis(avis) {
  const lignes = Object.keys(avis).map((id) => ({ id: id, ...avis[id] })).sort((a, b) => b.non - a.non || b.oui - a.oui);
  if (!lignes.length) return '<p class="discret">Pas encore d\'avis. Sur chaque fiche, la personne peut répondre « Oui » ou « Non », une fois par mois et par lieu, sans rien écrire.</p>';
  return '<p class="discret">12 derniers mois. Un avis par téléphone, par lieu et par mois, sans rien sur la personne. Beaucoup de « Non » : lieu à appeler pour vérifier.</p>' +
    '<table class="visites table-avis"><thead><tr><th scope="col">Lieu</th><th scope="col">Oui</th><th scope="col">Non</th></tr></thead><tbody>' +
    lignes.map((x) => '<tr><th scope="row"><a href="/equipe?onglet=lieux#lieu-' + esc(x.id) + '" data-nom-lieu="' + esc(x.id) + '">' + esc(x.id) + '</a></th><td class="oui">' + x.oui + '</td><td class="' + (x.non > x.oui ? "danger" : "") + '">' + x.non + "</td></tr>").join("") +
    "</tbody></table>";
}

function resumeVersion(v) {
  return "<strong>v" + v.v + "</strong> · " + esc(v.titre) + ' <span class="discret">· ' + esc(dateCourte(v.date)) + "</span>";
}

function htmlVersion(v) {
  return "<p class=\"version-titre\">" + resumeVersion(v) + "</p>" + listeNouveautes(v);
}

function listeNouveautes(v) {
  return "<ul class=\"nouveautes\">" + v.nouveautes.map((n) => "<li>" + esc(n) + "</li>").join("") + "</ul>";
}

function htmlVisites(visites) {
  // Les 12 derniers mois, du plus récent au plus ancien, mois sans visite compris
  const [a, m] = moisParis(new Date()).split("-").map(Number);
  const mois = [];
  for (let i = 0; i < NB_MOIS; i++) {
    const d = new Date(Date.UTC(a, m - 1 - i, 1));
    const cle = d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
    mois.push({ cle: cle, nom: MOIS[d.getUTCMonth()] + " " + d.getUTCFullYear(), n: visites[cle] || 0 });
  }
  const max = Math.max(1, ...mois.map((x) => x.n));
  const total = Object.values(visites).reduce((s, n) => s + n, 0);
  return (
    '<p class="discret">Un téléphone compte une fois par jour au plus, quand l\'appli est ouverte avec internet. ' +
    "Aucune donnée sur la personne n'est envoyée : seul le compteur du mois augmente. Chiffres approximatifs.</p>" +
    '<p class="total"><strong>' + total.toLocaleString("fr-FR") + "</strong> visite" + (total > 1 ? "s" : "") + " depuis le début du comptage</p>" +
    '<table class="visites"><caption class="discret">Visites des 12 derniers mois</caption>' +
    '<thead><tr><th scope="col">Mois</th><th scope="col">Visites</th></tr></thead><tbody>' +
    mois.map((x) =>
      '<tr title="' + esc(x.nom) + " : " + x.n + ' visite(s)"><th scope="row">' + esc(x.nom) + "</th>" +
      '<td><span class="barre-zone"><span class="barre" style="width:' + (x.n ? Math.max(1, Math.round((x.n / max) * 100)) : 0) + '%"></span></span>' +
      '<span class="nb">' + x.n.toLocaleString("fr-FR") + "</span></td></tr>"
    ).join("") +
    "</tbody></table>"
  );
}

function moisParis(d) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" }).formatToParts(d);
  return p.find((x) => x.type === "year").value + "-" + p.find((x) => x.type === "month").value;
}

function dateCourte(iso) {
  const [a, m, j] = iso.split("-").map(Number);
  return j + " " + MOIS[m - 1] + " " + a;
}

/* ---------- Mise en page ----------
 * Le même style que l'appli : sa feuille /css/app.css (bandeau bleu nuit avec le plan des rues de Lille,
 * feuille gris clair, cartes blanches, boutons, onglets en capsule de verre), plus les quelques règles
 * propres à l'équipe (CSS plus bas : chiffres clés, tableaux, formulaires des lieux). */
const RUBRIQUES = {
  signalements: { libelle: "À traiter", icone: "i-drapeau" },
  historique: { libelle: "Historique", icone: "i-horloge", sous: "Les signalements déjà traités" },
  lieux: { libelle: "Lieux", icone: "i-carte", sous: "Corriger un lieu ou en ajouter un" },
  statistiques: { libelle: "Statistiques", icone: "i-stats", sous: "Visites, avis et versions de l'appli" }
};

function page(onglet, nbSignalements, corps) {
  const r = RUBRIQUES[onglet];
  const sous = onglet !== "signalements" ? r.sous
    : nbSignalements ? nbSignalements + " signalement" + (nbSignalements > 1 ? "s" : "") + " à traiter" : "Rien à traiter";
  const lien = (id) =>
    '<a href="/equipe' + (id !== "signalements" ? "?onglet=" + id : "") + '"' + (onglet === id ? ' aria-current="page"' : "") + ">" +
    icone(RUBRIQUES[id].icone) + "<span>" + RUBRIQUES[id].libelle + "</span>" +
    (id === "signalements" && nbSignalements ? '<b class="onglet-nb">' + nbSignalements + '<span class="visuellement-cache"> à traiter</span></b>' : "") + "</a>";
  return debut(r.libelle, sous, icone(r.icone)) +
    '<main class="feuille feuille--etroite">' + corps +
    '<form method="post" class="sortie"><input type="hidden" name="action" value="deconnexion">' +
    '<button type="submit" class="bouton bouton--gris">' + icone("i-sortie") + "Se déconnecter</button></form></main>" +
    '<nav class="onglets" aria-label="Rubriques">' + ONGLETS.map(lien).join("") + "</nav>" +
    // Noms des lieux et formulaires de l'onglet « Lieux » : dessinés dans le navigateur avec /data/lieux.js
    '<script src="/data/lieux.js"></script><script src="/js/i18n.js"></script><script src="/js/equipe.js"></script>' +
    "</body></html>";
}

// Début de page : en-tête, puis le bandeau de l'appli (la lanterne, le titre de la rubrique)
function debut(titre, sous, pictogramme, classeIc) {
  return "<!doctype html><html lang=\"fr\" dir=\"ltr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">" +
    "<meta name=\"robots\" content=\"noindex\"><title>Paladines</title>" +
    '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">' +
    '<meta name="apple-mobile-web-app-title" content="Équipe"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' +
    '<meta name="theme-color" content="#0b1b36">' +
    '<link rel="icon" href="/icons/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/icons/icon-180.png">' +
    '<link rel="stylesheet" href="/css/app.css"><style>' + CSS + "</style></head>" +
    '<body class="equipe"><div class="teinte-haut" aria-hidden="true"></div><div class="fond-page" aria-hidden="true"></div>' + SPRITE +
    '<header class="bande bande--page"><div class="bande-in">' +
    '<div class="bande-haut"><a class="marque" href="/equipe"><svg class="marque-logo" viewBox="8 2 48 60" aria-hidden="true"><use href="#logo"></use></svg><span>Paladines · équipe</span></a></div>' +
    '<div class="page-tete"><span class="page-ic' + (classeIc ? " " + classeIc : "") + '">' + pictogramme + "</span>" +
    "<div><h1>" + esc(titre) + "</h1>" + (sous ? '<p class="page-sous">' + esc(sous) + "</p>" : "") + "</div></div>" +
    "</div></header>";
}

function pageConnexion(env, erreur) {
  const corps = !env.MOT_DE_PASSE
    ? "<p class=\"carte\">Le mot de passe de l'équipe n'est pas encore réglé : ajoutez le secret MOT_DE_PASSE dans Cloudflare.</p>"
    : '<form method="post" class="carte connexion"><input type="hidden" name="action" value="connexion">' +
      '<label for="mdp">Mot de passe de l\'équipe</label>' +
      '<input id="mdp" type="password" name="mot_de_passe" autocomplete="current-password" required autofocus>' +
      (erreur ? '<p class="erreur" role="alert">' + esc(erreur) + "</p>" : "") +
      '<button type="submit" class="bouton bouton--large">Entrer</button>' +
      '<p class="discret">Ce téléphone restera connecté 90 jours.</p></form>';
  const lanterne = '<svg class="logo-tete" viewBox="8 2 48 60" aria-hidden="true"><use href="#logo"></use></svg>';
  return reponse(debut("Espace de l'équipe", "Signalements, lieux et statistiques", lanterne, "page-ic--blanc") +
    '<main class="feuille feuille--etroite">' + corps + "</main></body></html>", erreur ? 401 : 200, "text/html; charset=utf-8");
}

function icone(id) {
  return '<svg class="ic" aria-hidden="true"><use href="#' + id + '"></use></svg>';
}

// Les pictogrammes de l'appli (index.html) dont la page a besoin, et la lanterne
const SPRITE = '<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true"><defs>' +
  '<symbol id="logo" viewBox="8 2 48 60"><path fill-rule="evenodd" d="M28 7A4 4 0 1 1 36 7A4 4 0 1 1 28 7ZM30.4 7A1.6 1.6 0 1 0 33.6 7A1.6 1.6 0 1 0 30.4 7ZM13.4 24A1.4 1.4 0 0 1 12 22.6L12 21.94A1.6 1.6 0 0 1 12.82 20.54L30.05 10.89A4 4 0 0 1 33.95 10.89L51.18 20.54A1.6 1.6 0 0 1 52 21.94L52 22.6A1.4 1.4 0 0 1 50.6 24ZM16.15 30.03A2.5 2.5 0 0 1 18.6 27L45.4 27A2.5 2.5 0 0 1 47.85 30.03L44.02 47.77A6 6 0 0 1 38.16 52.5L25.84 52.5A6 6 0 0 1 19.98 47.77ZM22 58A2.5 2.5 0 0 1 24.5 55.5L39.5 55.5A2.5 2.5 0 0 1 42 58A2.5 2.5 0 0 1 39.5 60.5L24.5 60.5A2.5 2.5 0 0 1 22 58ZM33.88 29.64C34.26 33.44 36.77 36.1 36.77 41.04C36.77 45.75 34.34 49.02 31.6 49.02C28.86 49.02 26.43 45.75 26.43 41.04C26.43 38 28.56 36.1 30.46 34.2C31.98 32.68 33.27 31.54 33.88 29.64Z"/></symbol>' +
  '<symbol id="i-drapeau" viewBox="0 0 24 24"><path d="M5 21V4M5 4.5h12l-2.5 4 2.5 4H5"/></symbol>' +
  '<symbol id="i-horloge" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></symbol>' +
  '<symbol id="i-carte" viewBox="0 0 24 24"><path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5Z"/><path d="M9 4.5v13M15 6.5v13"/></symbol>' +
  '<symbol id="i-stats" viewBox="0 0 24 24"><path d="M4 20h16M7 16v-4M12 16V7M17 16v-6"/></symbol>' +
  '<symbol id="i-sortie" viewBox="0 0 24 24"><path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10M15 8l4 4-4 4M19 12H9"/></symbol>' +
  "</defs></svg>";

// Ce qui n'existe pas dans l'appli (le reste vient de /css/app.css, avec les mêmes couleurs et mesures)
const CSS = `
.equipe .feuille h2{margin:10px 4px 0;font-family:var(--police-titre);font-size:1.25rem;font-weight:700;letter-spacing:-.02em}
.equipe .feuille>p{padding-inline:4px}
.equipe .carte{padding:16px}
.discret{color:var(--texte-2);font-size:.875rem}
.cartes{display:flex;flex-direction:column;gap:10px}
.cartes>li{display:flex;flex-direction:column;gap:8px;padding:16px;border-radius:var(--r);background:var(--carte);box-shadow:var(--ombre)}
.equipe .statut{color:var(--vert-texte)}
blockquote{margin:0;padding:10px 14px;border-radius:var(--r-petit);background:var(--fond);white-space:pre-wrap;overflow-wrap:anywhere}
.actions{display:flex;flex-wrap:wrap;gap:8px}
.lien-corriger{font-weight:600}
.kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.kpi{display:flex;flex-direction:column;gap:2px;min-width:0;padding:14px 16px;border-radius:var(--r);background:var(--carte);box-shadow:var(--ombre);color:var(--texte);text-decoration:none}
a.kpi:active{transform:scale(.98)}
.kpi-libelle,.kpi-note{color:var(--texte-2);font-size:.8125rem;overflow-wrap:anywhere}
.kpi-libelle{font-weight:600}
.kpi-valeur{font-family:var(--police-titre);font-size:1.75rem;font-weight:700;line-height:1.15;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
@media (min-width:640px){.kpis{grid-template-columns:repeat(4,minmax(0,1fr))}}
.visites{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden;border-radius:var(--r);background:var(--carte);box-shadow:var(--ombre)}
.visites caption{padding:0 4px 6px;text-align:start}
.visites th,.visites td{padding:10px 16px;border-top:1px solid var(--separateur);text-align:start;font-weight:400}
.visites thead th{border-top:0;color:var(--texte-2);font-size:.8125rem;font-weight:600}
.visites tbody th{width:1%;white-space:nowrap}
.visites td{display:flex;align-items:center;gap:10px}
.barre-zone{flex:1;height:8px;overflow:hidden;border-radius:4px;background:var(--gris-plein)}
.barre{display:block;height:100%;border-radius:4px;background:var(--nuit)}
.nb{min-width:3ch;text-align:end;font-variant-numeric:tabular-nums}
.table-avis tbody th{width:auto;white-space:normal;overflow-wrap:anywhere}
.table-avis td{display:table-cell;width:3.5em;text-align:end;font-variant-numeric:tabular-nums}
.table-avis td.oui{color:var(--vert-texte)}.table-avis td.danger{color:var(--rouge-texte);font-weight:700}
.nouveautes{padding-inline-start:20px;list-style:disc}.nouveautes li{margin:4px 0}
summary{min-height:44px;padding:10px 0;cursor:pointer}
.equipe label{font-weight:600}
.equipe input:not([type=checkbox]):not([type=hidden]),.equipe select{width:100%;min-width:0;min-height:44px;padding:8px 12px;border:0;border-radius:var(--r-petit);background:var(--gris-plein);color:var(--texte);font:inherit;font-weight:400}
.connexion{display:grid;gap:12px;padding:20px}
.erreur{color:var(--rouge-texte);font-weight:600}
#lieux-equipe{display:flex;flex-direction:column;gap:12px}
.form-lieu{display:grid;gap:12px;margin-top:8px}
.form-lieu fieldset{display:grid;gap:8px;min-width:0;margin:0;padding:12px;border:0;border-radius:var(--r-petit);background:var(--fond)}
.form-lieu legend{float:left;width:100%;padding:0;font-weight:700}
.form-lieu label{display:grid;gap:4px;font-size:.9375rem}
.equipe .form-lieu fieldset input:not([type=checkbox]){background:var(--carte)}
.form-lieu .case{display:flex;align-items:center;gap:10px;min-height:44px}
.form-lieu .case input{width:22px;height:22px;margin:0;accent-color:var(--nuit)}
.jours{display:grid;grid-template-columns:3.2em 1fr;gap:6px 8px;align-items:center}.jours span{font-weight:600}
.liste-lieux>li{padding-block:6px}
summary.lieu-titre{font-weight:600}
.badges{display:inline-flex;flex-wrap:wrap;gap:4px;margin-inline-start:6px;vertical-align:middle}
.badge{padding:1px 8px;border-radius:999px;background:var(--nuit);color:#fff;font-size:.75rem;font-weight:700}
.badge--ferme{background:var(--rouge)}
.ok-msg{color:var(--vert-texte);font-weight:700}
.onglets a{position:relative}
.onglet-nb{position:absolute;top:5px;inset-inline-start:calc(50% + 4px);min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--rouge);color:#fff;font-size:.6875rem;font-weight:700;line-height:18px;text-align:center}
@media (min-width:1024px){.onglet-nb{position:static}}
.sortie{margin-top:8px}
.logo-tete{width:1.6rem;height:2rem;fill:currentColor}
@media (forced-colors:active){.barre{background:CanvasText}}
`;

/* ---------- Connexion de l'équipe ----------
 * Cookie « expiration.signature » : la signature HMAC-SHA256 de l'expiration, avec le mot
 * de passe comme clé. Rien n'est stocké côté serveur. */
const NOM_COOKIE = "paladines_equipe";
const DUREE_SESSION = 60 * 60 * 24 * 90; // 90 jours

async function signer(env, texte) {
  const cle = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.MOT_DE_PASSE), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cle, new TextEncoder().encode("equipe:" + texte));
  return [...new Uint8Array(sig)].map((o) => o.toString(16).padStart(2, "0")).join("");
}

async function cookieSession(env) {
  const fin = String(Math.floor(Date.now() / 1000) + DUREE_SESSION);
  return NOM_COOKIE + "=" + fin + "." + (await signer(env, fin)) + "; Path=/; Max-Age=" + DUREE_SESSION + "; HttpOnly; Secure; SameSite=Lax";
}

async function connecte(request, env) {
  if (!env.MOT_DE_PASSE) return false;
  const m = (request.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + NOM_COOKIE + "=(\\d+)\\.([0-9a-f]{64})"));
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  return egal(m[2], await signer(env, m[1]));
}

// Comparaison en temps constant
function egal(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

/* ---------- Réponses ---------- */
function reponse(corps, statut, type) {
  const h = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  if (type) h["Content-Type"] = type;
  return new Response(corps, { status: statut, headers: h });
}

function texte(msg, statut) {
  return reponse(msg, statut, "text/plain; charset=utf-8");
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
