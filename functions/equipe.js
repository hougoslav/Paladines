/*
 * Page de l'équipe (Cloudflare Pages Functions : /equipe), protégée par le mot de passe
 * MOT_DE_PASSE. On le tape une fois dans une page de connexion ; le téléphone reste ensuite
 * connecté 90 jours (cookie signé). Changer MOT_DE_PASSE déconnecte tout le monde.
 * Pas de fenêtre « Basic Auth » du navigateur : sur iPhone, ouverte depuis l'écran
 * d'accueil, elle laissait un écran noir plusieurs secondes et redemandait le mot de passe.
 * - Onglet « À traiter » : signalements envoyés depuis l'appli, à marquer « traité » une fois réglés.
 * - Onglet « Historique » : les signalements traités (date de réception et de traitement),
 *   à remettre à traiter ou à supprimer définitivement.
 * - Onglet « Statistiques » : version en ligne, versions précédentes, visites par mois.
 * Les données sont dans l'espace KV « SIGNALEMENTS » : un signalement par clé (sa date),
 * et un compteur par mois sous « visites:AAAA-MM » (voir api/visite.js).
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
const ONGLETS = ["signalements", "historique", "statistiques"];
const DUREE_GARDE = 60 * 60 * 24 * 365; // comme api/signalement.js : un signalement s'efface un an après sa réception

export async function onRequestGet({ request, env }) {
  if (!(await connecte(request, env))) return pageConnexion(env, "");
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés : liez un espace KV nommé SIGNALEMENTS.", 503);

  const demande = new URL(request.url).searchParams.get("onglet");
  const onglet = ONGLETS.indexOf(demande) !== -1 ? demande : "signalements";
  const { signalements, visites } = await toutLire(env.SIGNALEMENTS);
  const aTraiter = signalements.filter((x) => !x.s.traite);
  const traites = signalements.filter((x) => x.s.traite).sort((a, b) => (a.s.traite < b.s.traite ? 1 : -1));
  const corps = onglet === "statistiques" ? htmlStatistiques(visites)
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
  const cle = f.get("cle");
  if (typeof cle !== "string" || cle.indexOf("visites:") === 0) return versEquipe();
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

function versEquipe(cookie, onglet) {
  const h = { Location: "/equipe" + (onglet && onglet !== "signalements" ? "?onglet=" + onglet : ""), "Cache-Control": "no-store" };
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
  await Promise.all(cles.map(async (k) => {
    const v = await kv.get(k);
    if (v === null) return;
    if (k.indexOf("visites:") === 0) {
      visites[k.slice(8)] = parseInt(v, 10) || 0;
      return;
    }
    try {
      signalements.push({ cle: k, s: JSON.parse(v) });
    } catch (e) {
      /* entrée illisible : ignorée */
    }
  }));
  signalements.sort((a, b) => (a.cle < b.cle ? 1 : -1));
  return { signalements, visites };
}

/* ---------- Onglet « Signalements » ---------- */
function htmlSignalements(items) {
  if (!items.length) return "<p>Aucun signalement à traiter. Les signalements déjà traités sont dans l'onglet « Historique ».</p>";
  return "<p>" + items.length + " signalement" + (items.length > 1 ? "s" : "") + " à traiter.</p><ul class=\"cartes\">" +
    items.map(({ cle, s }) =>
      "<li>" + htmlUnSignalement(s) +
      bouton("traite", cle, "Marquer comme traité", "principal") + "</li>"
    ).join("") + "</ul>";
}

/* ---------- Onglet « Historique » ---------- */
function htmlHistorique(items, total) {
  const intro = '<p class="discret">' + total + " signalement" + (total > 1 ? "s" : "") + " reçu" + (total > 1 ? "s" : "") +
    " en tout, dont " + items.length + " traité" + (items.length > 1 ? "s" : "") + ". Chaque signalement s'efface seul un an après sa réception.</p>";
  if (!items.length) return intro + "<p>Aucun signalement traité pour l'instant.</p>";
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
    (s.lieu ? ' — <a href="/#lieu-' + esc(s.lieu) + '" target="_blank" rel="noopener">' + esc(s.lieu) + "</a>" : " — <em>en général</em>") + "</p>" +
    (s.message ? "<blockquote>" + esc(s.message) + "</blockquote>" : "");
}

function bouton(action, cle, libelle, classe, confirmer) {
  return '<form method="post"' + (confirmer ? " onsubmit=\"return confirm('" + confirmer.replace(/'/g, "\\'") + "')\"" : "") + ">" +
    '<input type="hidden" name="action" value="' + action + '"><input type="hidden" name="cle" value="' + esc(cle) + '">' +
    '<button type="submit"' + (classe ? ' class="' + classe + '"' : "") + ">" + esc(libelle) + "</button></form>";
}

function dateHeure(iso) {
  return new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" });
}

function nomMois(iso) {
  const [a, m] = moisParis(new Date(iso)).split("-").map(Number);
  const nom = MOIS[m - 1] + " " + a;
  return nom.charAt(0).toUpperCase() + nom.slice(1);
}

/* ---------- Onglet « Statistiques » ---------- */
function htmlStatistiques(visites) {
  const actuelle = VERSIONS[0];
  return (
    "<h2>Version en ligne</h2>" +
    '<div class="carte carte--actuelle">' + htmlVersion(actuelle, true) + "</div>" +
    "<h2>Visites par mois</h2>" + htmlVisites(visites) +
    "<h2>Versions précédentes</h2>" +
    '<ul class="cartes">' + VERSIONS.slice(1).map((v) => "<li><details><summary>" + resumeVersion(v) + "</summary>" + listeNouveautes(v) + "</details></li>").join("") + "</ul>"
  );
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

/* ---------- Mise en page ---------- */
function page(onglet, nbSignalements, corps) {
  const lien = (id, libelle) =>
    '<a href="/equipe' + (id !== "signalements" ? "?onglet=" + id : "") + '"' + (onglet === id ? ' aria-current="page"' : "") + ">" + libelle + "</a>";
  return debut() +
    '<nav class="onglets" aria-label="Rubriques">' +
    lien("signalements", "À traiter" + (nbSignalements ? ' <span class="compte" aria-label="' + nbSignalements + ' à traiter">' + nbSignalements + "</span>" : "")) +
    lien("historique", "Historique") +
    lien("statistiques", "Statistiques") +
    "</nav><main>" + corps + "</main>" +
    '<form method="post" class="sortie"><input type="hidden" name="action" value="deconnexion"><button type="submit">Se déconnecter</button></form>' +
    "</body></html>";
}

function debut() {
  return "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">" +
    "<meta name=\"robots\" content=\"noindex\"><title>Paladines</title>" +
    '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">' +
    '<meta name="theme-color" content="#14233a">' +
    '<link rel="icon" href="/icons/equipe.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/icons/equipe-180.png">' +
    "<style>" + CSS + "</style></head><body>" +
    '<header class="entete">' + LOGO + "<h1>Paladines · équipe</h1></header>";
}

function pageConnexion(env, erreur) {
  const corps = !env.MOT_DE_PASSE
    ? "<p>Le mot de passe de l'équipe n'est pas encore réglé : ajoutez le secret MOT_DE_PASSE dans Cloudflare.</p>"
    : '<form method="post" class="connexion"><input type="hidden" name="action" value="connexion">' +
      '<label for="mdp">Mot de passe de l\'équipe</label>' +
      '<input id="mdp" type="password" name="mot_de_passe" autocomplete="current-password" required autofocus>' +
      (erreur ? '<p class="erreur" role="alert">' + esc(erreur) + "</p>" : "") +
      '<button type="submit" class="principal">Entrer</button>' +
      '<p class="discret">Ce téléphone restera connecté 90 jours.</p></form>';
  return reponse(debut() + "<main>" + corps + "</main></body></html>", erreur ? 401 : 200, "text/html; charset=utf-8");
}

// Logo engrenage (même dessin que icons/equipe.svg), en haut à gauche comme la lanterne de l'appli
const LOGO = '<svg class="logo" aria-hidden="true" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#14233a"/><path fill="#f4b63f" stroke="#f4b63f" stroke-width="28" stroke-linejoin="round" d="M220.3 133.1L229.7 90.1L282.3 90.1L291.7 133.1L317.7 143.8L354.7 120.1L391.9 157.3L368.2 194.3L378.9 220.3L421.9 229.7L421.9 282.3L378.9 291.7L368.2 317.7L391.9 354.7L354.7 391.9L317.7 368.2L291.7 378.9L282.3 421.9L229.7 421.9L220.3 378.9L194.3 368.2L157.3 391.9L120.1 354.7L143.8 317.7L133.1 291.7L90.1 282.3L90.1 229.7L133.1 220.3L143.8 194.3L120.1 157.3L157.3 120.1L194.3 143.8Z"/><circle cx="256" cy="256" r="58" fill="#14233a"/></svg>';

const CSS =
  ":root{--fond:#f1f3f6;--surface:#fff;--encre:#14233a;--douce:#546175;--trait:#d7dde6;--accent:#24528f;--barre:#24528f;--rail:#e4e8ef;color-scheme:light}" +
  "@media (prefers-color-scheme:dark){:root{--fond:#0e1626;--surface:#16213a;--encre:#eef1f6;--douce:#a9b5c7;--trait:#2a3958;--accent:#9cc3ff;--barre:#7fb0f5;--rail:#22304d;color-scheme:dark}}" +
  "*{box-sizing:border-box}body{font:16px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;max-width:760px;margin:0 auto;padding:16px;background:var(--fond);color:var(--encre)}" +
  ".entete{display:flex;align-items:center;gap:12px;margin:4px 0 16px}.logo{width:44px;height:44px;flex:none}.entete h1{margin:0}" +
  "h1{font-size:1.5rem;margin:8px 0 16px}h2{font-size:1.15rem;margin:28px 0 10px}a{color:var(--accent)}" +
  ".onglets{display:flex;gap:8px;border-bottom:1px solid var(--trait);margin-bottom:16px}" +
  ".onglets a{display:flex;align-items:center;min-height:44px;padding:0 14px;text-decoration:none;color:var(--douce);font-weight:600;border-bottom:3px solid transparent;margin-bottom:-1px}" +
  ".onglets a[aria-current]{color:var(--encre);border-bottom-color:var(--accent)}" +
  ".cartes{list-style:none;padding:0;margin:0}.cartes>li,.carte{background:var(--surface);border:1px solid var(--trait);border-radius:12px;padding:12px 16px;margin:10px 0}" +
  ".carte--actuelle{border-color:var(--accent)}.version-titre{margin:0}" +
  ".discret{color:var(--douce);font-size:.875rem;margin:0}" +
  "blockquote{margin:8px 0;padding:8px 12px;background:var(--fond);border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}" +
  "button{min-height:44px;padding:0 14px;border-radius:8px;border:1px solid var(--trait);background:var(--surface);color:var(--encre);font:inherit;cursor:pointer}" +
  "summary{min-height:44px;padding:10px 0;cursor:pointer}" +
  ".nouveautes{margin:8px 0 4px;padding-left:20px}.nouveautes li{margin:4px 0}" +
  ".total{margin:8px 0 12px}" +
  ".visites{width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--trait);border-radius:12px;overflow:hidden}" +
  ".visites caption{text-align:left;padding:0 0 6px}" +
  ".visites th,.visites td{padding:6px 12px;text-align:left;border-top:1px solid var(--trait);font-weight:normal}" +
  ".visites thead th{font-weight:600;color:var(--douce);font-size:.875rem;border-top:0}" +
  ".visites tbody th{white-space:nowrap;width:1%}" +
  ".visites td{display:flex;align-items:center;gap:10px}" +
  ".barre-zone{flex:1;height:12px;background:var(--rail);border-radius:4px;overflow:hidden}" +
  ".barre{display:block;height:100%;background:var(--barre);border-radius:0 4px 4px 0}" +
  ".nb{min-width:3ch;text-align:right;font-variant-numeric:tabular-nums}" +
  ".connexion{display:grid;gap:10px;max-width:360px;background:var(--surface);border:1px solid var(--trait);border-radius:12px;padding:16px}" +
  ".connexion label{font-weight:600}" +
  ".connexion input{width:100%;min-width:0;min-height:44px;padding:8px 12px;border:1px solid var(--trait);border-radius:8px;background:var(--fond);color:var(--encre);font:inherit}" +
  ".principal{background:#14233a;border-color:#14233a;color:#fff;font-weight:600}" +
  "@media (prefers-color-scheme:dark){.principal{background:#f4b63f;border-color:#f4b63f;color:#1d1606}}" +
  ".erreur{color:#b42318;margin:0;font-weight:600}@media (prefers-color-scheme:dark){.erreur{color:#ff8a80}}" +
  ".sortie{margin:32px 0 8px}" +
  ".onglets{gap:0;overflow-x:auto}.onglets a{flex:none;padding:0 10px}" +
  ".compte{display:inline-block;min-width:20px;margin-left:4px;padding:0 6px;border-radius:10px;background:var(--accent);color:var(--surface);font-size:.75rem;line-height:20px;text-align:center}" +
  "@media (max-width:360px){body{padding:12px}.onglets a{padding:0 5px;font-size:.875rem}}" +
  ".statut{margin:0 0 4px;font-weight:600;color:#146c45}@media (prefers-color-scheme:dark){.statut{color:#63d49c}}" +
  ".traite{border-left:4px solid #146c45}@media (prefers-color-scheme:dark){.traite{border-left-color:#63d49c}}" +
  ".actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}" +
  ".danger{color:#b42318;border-color:#b42318}@media (prefers-color-scheme:dark){.danger{color:#ff8a80;border-color:#ff8a80}}" +
  "@media (forced-colors:active){.barre{background:CanvasText}}";

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
