/*
 * Signalements envoyés depuis l'appli (Cloudflare Pages Functions : /api/signalement).
 *
 * - POST (l'appli) : garde { lieu, raison, message, langue, date } dans le stockage KV
 *   « SIGNALEMENTS ». Rien d'autre : ni adresse IP, ni position, ni nom.
 * - GET (l'équipe) : page qui liste les signalements, protégée par le mot de passe
 *   MOT_DE_PASSE (le navigateur le demande ; n'importe quel nom d'utilisateur).
 * - POST avec action=supprimer (l'équipe) : retire un signalement traité.
 *
 * Réglages à faire une fois dans Cloudflare Pages (voir README) : lier un espace KV
 * sous le nom SIGNALEMENTS et créer la variable secrète MOT_DE_PASSE.
 */

const RAISONS = ["ferme", "horaires", "adresse", "accueil", "manque", "bug", "traduction", "autre"];
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
const LANGUES = ["fr", "en", "ar"];
const MAX_MESSAGE = 500;
const DUREE_GARDE = 60 * 60 * 24 * 365; // un an, puis effacé tout seul

export async function onRequestPost({ request, env }) {
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés", 503);

  const type = request.headers.get("content-type") || "";
  if (type.indexOf("application/x-www-form-urlencoded") === 0) return supprimer(request, env);

  let d;
  try {
    d = await request.json();
  } catch (e) {
    return texte("Requête invalide", 400);
  }
  if (!d || typeof d !== "object") return texte("Requête invalide", 400);
  // Champ piège invisible : seuls les robots le remplissent
  if (d.site) return reponse(null, 204);

  const lieu = typeof d.lieu === "string" ? d.lieu : "";
  const raison = d.raison;
  const message = typeof d.message === "string" ? d.message.trim().slice(0, MAX_MESSAGE) : "";
  if (!/^[a-z0-9-]{0,60}$/.test(lieu) || RAISONS.indexOf(raison) === -1) return texte("Requête invalide", 400);

  const date = new Date().toISOString();
  const cle = date + "-" + crypto.randomUUID().slice(0, 8);
  await env.SIGNALEMENTS.put(cle, JSON.stringify({
    lieu: lieu,
    raison: raison,
    message: message,
    langue: LANGUES.indexOf(d.langue) !== -1 ? d.langue : "",
    date: date
  }), { expirationTtl: DUREE_GARDE });
  return reponse(null, 204);
}

export async function onRequestGet({ request, env }) {
  if (!autorise(request, env)) return demanderMotDePasse();
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés : liez un espace KV nommé SIGNALEMENTS.", 503);

  const cles = [];
  let curseur;
  do {
    const page = await env.SIGNALEMENTS.list({ cursor: curseur });
    page.keys.forEach((k) => cles.push(k.name));
    curseur = page.list_complete ? null : page.cursor;
  } while (curseur);
  cles.sort().reverse();

  const items = (await Promise.all(cles.map(async (k) => {
    const v = await env.SIGNALEMENTS.get(k);
    if (!v) return null;
    try {
      return { cle: k, s: JSON.parse(v) };
    } catch (e) {
      return null;
    }
  }))).filter(Boolean);

  return reponse(pageEquipe(items), 200, "text/html; charset=utf-8");
}

async function supprimer(request, env) {
  if (!autorise(request, env)) return demanderMotDePasse();
  // Seule la page de l'équipe, sur ce site, peut supprimer
  const origine = request.headers.get("origin");
  if (origine && origine !== new URL(request.url).origin) return texte("Interdit", 403);
  const f = await request.formData();
  const cle = f.get("cle");
  if (f.get("action") === "supprimer" && typeof cle === "string") await env.SIGNALEMENTS.delete(cle);
  return new Response(null, { status: 303, headers: { Location: "/api/signalement", "Cache-Control": "no-store" } });
}

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
  const h = { "Cache-Control": "no-store" };
  if (type) h["Content-Type"] = type;
  return new Response(corps, { status: statut, headers: h });
}

function texte(msg, statut) {
  return reponse(msg, statut, "text/plain; charset=utf-8");
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function pageEquipe(items) {
  const date = (iso) => new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "medium", timeStyle: "short" });
  const lignes = items.map(({ cle, s }) =>
    "<li><p class=\"quand\">" + esc(date(s.date)) + (s.langue ? " · " + esc(s.langue.toUpperCase()) : "") + "</p>" +
    "<p><strong>" + esc(LIBELLES[s.raison] || s.raison) + "</strong>" +
    (s.lieu ? ' — <a href="/#lieu-' + esc(s.lieu) + '" target="_blank" rel="noopener">' + esc(s.lieu) + "</a>" : " — <em>en général</em>") + "</p>" +
    (s.message ? "<blockquote>" + esc(s.message) + "</blockquote>" : "") +
    '<form method="post"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="cle" value="' + esc(cle) + '">' +
    '<button type="submit">Traité : supprimer</button></form></li>'
  ).join("");
  return "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<meta name=\"robots\" content=\"noindex\"><title>Paladines</title><style>" +
    "body{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:16px;background:#fff;color:#1b1b2f}" +
    "ul{list-style:none;padding:0}li{border:1px solid #ccd;border-radius:10px;padding:12px 16px;margin:12px 0}" +
    ".quand{color:#556;margin:0;font-size:14px}blockquote{margin:8px 0;padding:8px 12px;background:#f2f2f8;border-radius:6px;white-space:pre-wrap;overflow-wrap:anywhere}" +
    "button{min-height:44px;padding:0 14px;border-radius:8px;border:1px solid #889;background:#fff;font:inherit;cursor:pointer}" +
    "@media (prefers-color-scheme:dark){body{background:#12131f;color:#eee}li{border-color:#334}.quand{color:#aab}blockquote{background:#1e2032}button{background:#1e2032;color:#eee}a{color:#9cf}}" +
    "</style></head><body><h1>Signalements reçus</h1>" +
    "<p>" + items.length + " signalement" + (items.length > 1 ? "s" : "") + ". Ils s'effacent seuls au bout d'un an.</p>" +
    (items.length ? "<ul>" + lignes + "</ul>" : "<p>Aucun signalement pour l'instant.</p>") +
    "</body></html>";
}
