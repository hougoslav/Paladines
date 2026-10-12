/*
 * « Ce lieu vous a aidée ? » (Cloudflare Pages Functions : POST /api/avis).
 *
 * On ajoute seulement 1 à un compteur par lieu et par mois (« avis:<lieu>:AAAA-MM » dans
 * l'espace KV SIGNALEMENTS) : { oui, non }. Ni adresse IP, ni identifiant, ni texte libre.
 * Un téléphone ne donne qu'un avis par lieu tous les 30 jours (gardé sur le téléphone).
 * L'équipe voit les totaux sur /equipe (onglet « Statistiques »).
 */
export async function onRequestPost({ request, env }) {
  let d;
  try {
    d = await request.json();
  } catch (e) {
    return new Response("Requête invalide", { status: 400 });
  }
  const lieu = d && typeof d.lieu === "string" ? d.lieu : "";
  if (!/^[a-z0-9-]{1,40}$/.test(lieu) || (d.avis !== "oui" && d.avis !== "non")) return new Response("Requête invalide", { status: 400 });
  if (env.SIGNALEMENTS) {
    const cle = "avis:" + lieu + ":" + moisParis(new Date());
    try {
      const v = JSON.parse((await env.SIGNALEMENTS.get(cle)) || "{}");
      v[d.avis] = (v[d.avis] || 0) + 1;
      await env.SIGNALEMENTS.put(cle, JSON.stringify(v), { expirationTtl: 60 * 60 * 24 * 400 });
    } catch (e) {
      /* limite d'écriture atteinte : avis non compté */
    }
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

function moisParis(d) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" }).formatToParts(d);
  return p.find((x) => x.type === "year").value + "-" + p.find((x) => x.type === "month").value;
}
