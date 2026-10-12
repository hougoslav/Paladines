/*
 * Compteur de visites anonyme (Cloudflare Pages Functions : /api/visite).
 *
 * L'appli appelle POST /api/visite au plus une fois par jour et par téléphone. On ajoute
 * seulement 1 au compteur du mois (« visites:AAAA-MM » dans l'espace KV SIGNALEMENTS) :
 * ni adresse IP, ni position, ni identifiant, ni page vue. Le total est montré sur /equipe.
 * Deux visites à la même seconde peuvent n'en compter qu'une : les chiffres sont approximatifs.
 */
export async function onRequestPost({ env }) {
  if (env.SIGNALEMENTS) {
    const cle = "visites:" + moisParis(new Date());
    try {
      const n = parseInt(await env.SIGNALEMENTS.get(cle), 10) || 0;
      await env.SIGNALEMENTS.put(cle, String(n + 1));
    } catch (e) {
      /* limite d'écriture atteinte : visite non comptée, rien de grave */
    }
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

function moisParis(d) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" }).formatToParts(d);
  return p.find((x) => x.type === "year").value + "-" + p.find((x) => x.type === "month").value;
}
