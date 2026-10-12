/*
 * Page de l'équipe (Cloudflare Pages Functions : /equipe), protégée par le mot de passe
 * MOT_DE_PASSE (le navigateur le demande ; n'importe quel nom d'utilisateur).
 * - Onglet « Signalements » : messages envoyés depuis l'appli, à supprimer une fois traités.
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

export async function onRequestGet({ request, env }) {
  if (!autorise(request, env)) return demanderMotDePasse();
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés : liez un espace KV nommé SIGNALEMENTS.", 503);

  const onglet = new URL(request.url).searchParams.get("onglet") === "statistiques" ? "statistiques" : "signalements";
  const { signalements, visites } = await toutLire(env.SIGNALEMENTS);
  const corps = onglet === "statistiques" ? htmlStatistiques(visites) : htmlSignalements(signalements);
  return reponse(page(onglet, signalements.length, corps), 200, "text/html; charset=utf-8");
}

export async function onRequestPost({ request, env }) {
  if (!autorise(request, env)) return demanderMotDePasse();
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés", 503);
  // Seule la page de l'équipe, sur ce site, peut supprimer
  const origine = request.headers.get("origin");
  if (origine && origine !== new URL(request.url).origin) return texte("Interdit", 403);
  const f = await request.formData();
  const cle = f.get("cle");
  if (f.get("action") === "supprimer" && typeof cle === "string" && cle.indexOf("visites:") !== 0) await env.SIGNALEMENTS.delete(cle);
  return new Response(null, { status: 303, headers: { Location: "/equipe", "Cache-Control": "no-store" } });
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
  const date = (iso) => new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" });
  if (!items.length) return "<p>Aucun signalement pour l'instant.</p>";
  return "<p>" + items.length + " signalement" + (items.length > 1 ? "s" : "") + ". Ils s'effacent seuls au bout d'un an.</p><ul class=\"cartes\">" +
    items.map(({ cle, s }) =>
      "<li><p class=\"discret\">" + esc(date(s.date)) + (s.langue ? " · " + esc(s.langue.toUpperCase()) : "") + "</p>" +
      "<p><strong>" + esc(LIBELLES[s.raison] || s.raison) + "</strong>" +
      (s.lieu ? ' — <a href="/#lieu-' + esc(s.lieu) + '" target="_blank" rel="noopener">' + esc(s.lieu) + "</a>" : " — <em>en général</em>") + "</p>" +
      (s.message ? "<blockquote>" + esc(s.message) + "</blockquote>" : "") +
      '<form method="post"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="cle" value="' + esc(cle) + '">' +
      '<button type="submit">Traité : supprimer</button></form></li>'
    ).join("") + "</ul>";
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
    '<a href="/equipe' + (id === "statistiques" ? "?onglet=statistiques" : "") + '"' + (onglet === id ? ' aria-current="page"' : "") + ">" + libelle + "</a>";
  return "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<meta name=\"robots\" content=\"noindex\"><title>Paladines</title>" +
    '<link rel="icon" href="/icons/equipe.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/icons/equipe-180.png">' +
    "<style>" + CSS + "</style></head><body>" +
    '<header class="entete">' + LOGO + "<h1>Paladines · équipe</h1></header>" +
    '<nav class="onglets" aria-label="Rubriques">' +
    lien("signalements", "Signalements" + (nbSignalements ? " (" + nbSignalements + ")" : "")) +
    lien("statistiques", "Statistiques") +
    "</nav><main>" + corps + "</main></body></html>";
}

// Logo engrenage (même dessin que icons/equipe.svg), en haut à gauche comme la lanterne de l'appli
const LOGO = '<svg class="logo" aria-hidden="true" viewBox="0 0 100 100"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ccd2"/><stop offset="1" stop-color="#7d828c"/></linearGradient><linearGradient id="e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4e57"/><stop offset="1" stop-color="#2b2e35"/></linearGradient><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ebef"/><stop offset="1" stop-color="#a7abb3"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(#f)"/><path fill="url(#e)" fill-rule="evenodd" d="M45.09 17.37L45.69 10.23L54.31 10.23L54.91 17.37L57.96 17.97L61.24 11.61L69.20 14.91L67.02 21.73L69.61 23.46L75.07 18.83L81.17 24.93L76.54 30.39L78.27 32.98L85.09 30.80L88.39 38.76L82.03 42.04L82.63 45.09L89.77 45.69L89.77 54.31L82.63 54.91L82.03 57.96L88.39 61.24L85.09 69.20L78.27 67.02L76.54 69.61L81.17 75.07L75.07 81.17L69.61 76.54L67.02 78.27L69.20 85.09L61.24 88.39L57.96 82.03L54.91 82.63L54.31 89.77L45.69 89.77L45.09 82.63L42.04 82.03L38.76 88.39L30.80 85.09L32.98 78.27L30.39 76.54L24.93 81.17L18.83 75.07L23.46 69.61L21.73 67.02L14.91 69.20L11.61 61.24L17.97 57.96L17.37 54.91L10.23 54.31L10.23 45.69L17.37 45.09L17.97 42.04L11.61 38.76L14.91 30.80L21.73 32.98L23.46 30.39L18.83 24.93L24.93 18.83L30.39 23.46L32.98 21.73L30.80 14.91L38.76 11.61L42.04 17.97ZM25.00 50a25 25 0 1 0 50 0a25 25 0 1 0 -50 0Z"/><path fill="url(#m)" fill-rule="evenodd" d="M47.91 29.10L48.36 25.05L51.64 25.05L52.09 29.10L53.39 29.28L54.88 25.48L58.04 26.33L57.42 30.36L58.64 30.86L61.06 27.58L63.89 29.21L62.25 32.95L63.30 33.75L66.48 31.20L68.80 33.52L66.25 36.70L67.05 37.75L70.79 36.11L72.42 38.94L69.14 41.36L69.64 42.58L73.67 41.96L74.52 45.12L70.72 46.61L70.90 47.91L74.95 48.36L74.95 51.64L70.90 52.09L70.72 53.39L74.52 54.88L73.67 58.04L69.64 57.42L69.14 58.64L72.42 61.06L70.79 63.89L67.05 62.25L66.25 63.30L68.80 66.48L66.48 68.80L63.30 66.25L62.25 67.05L63.89 70.79L61.06 72.42L58.64 69.14L57.42 69.64L58.04 73.67L54.88 74.52L53.39 70.72L52.09 70.90L51.64 74.95L48.36 74.95L47.91 70.90L46.61 70.72L45.12 74.52L41.96 73.67L42.58 69.64L41.36 69.14L38.94 72.42L36.11 70.79L37.75 67.05L36.70 66.25L33.52 68.80L31.20 66.48L33.75 63.30L32.95 62.25L29.21 63.89L27.58 61.06L30.86 58.64L30.36 57.42L26.33 58.04L25.48 54.88L29.28 53.39L29.10 52.09L25.05 51.64L25.05 48.36L29.10 47.91L29.28 46.61L25.48 45.12L26.33 41.96L30.36 42.58L30.86 41.36L27.58 38.94L29.21 36.11L32.95 37.75L33.75 36.70L31.20 33.52L33.52 31.20L36.70 33.75L37.75 32.95L36.11 29.21L38.94 27.58L41.36 30.86L42.58 30.36L41.96 26.33L45.12 25.48L46.61 29.28ZM41.00 50a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z"/><path fill="url(#e)" d="M44.00 50a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z"/></svg>';

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
  "@media (forced-colors:active){.barre{background:CanvasText}}";

/* ---------- Mot de passe de l'équipe ---------- */
function autorise(request, env) {
  if (!env.MOT_DE_PASSE) return false;
  const entete = request.headers.get("authorization") || "";
  if (entete.indexOf("Basic ") !== 0) return false;
  let decode;
  try {
    decode = atob(entete.slice(6));
  } catch (e) {
    return false;
  }
  return egal(decode.slice(decode.indexOf(":") + 1), env.MOT_DE_PASSE);
}

// Comparaison en temps constant
function egal(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function demanderMotDePasse() {
  return new Response("Mot de passe requis", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Paladines équipe", charset="UTF-8"', "Cache-Control": "no-store" }
  });
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
