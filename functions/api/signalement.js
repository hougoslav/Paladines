/*
 * Signalements envoyés depuis l'appli (Cloudflare Pages Functions : /api/signalement).
 *
 * POST : garde { lieu, raison, message, langue, date } dans le stockage KV « SIGNALEMENTS ».
 * Rien d'autre : ni adresse IP, ni position, ni nom. L'équipe les lit sur /equipe
 * (functions/equipe.js). Réglages Cloudflare : voir README.
 */

const RAISONS = ["ferme", "horaires", "adresse", "accueil", "manque", "bug", "traduction", "autre"];
const LANGUES = ["fr", "en", "ar", "es", "ro", "uk", "fa", "ps", "ti"];
const MAX_MESSAGE = 500;
const DUREE_GARDE = 60 * 60 * 24 * 365; // un an, puis effacé tout seul

export async function onRequestPost({ request, env }) {
  if (!env.SIGNALEMENTS) return texte("Signalements non configurés", 503);

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

// Ancienne adresse de la page de l'équipe
export function onRequestGet() {
  return new Response(null, { status: 302, headers: { Location: "/equipe", "Cache-Control": "no-store" } });
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
