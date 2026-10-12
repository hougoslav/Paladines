/*
 * Corrections des lieux faites par l'équipe sur /equipe (onglet « Lieux »), lues par l'appli
 * (Cloudflare Pages Functions : GET /api/corrections).
 *
 * Dans l'espace KV « SIGNALEMENTS » :
 *   « correction:<id> » : { ferme: { jusqu, texte } | absent, horaires, tel, note, maj }
 *   « ajout:<id> »      : un lieu ajouté par l'équipe (nom, cat, adresse, tel, horaires…)
 * Réponse publique (rien de personnel) : { corrections: { id: {...} }, ajouts: [...] }.
 * L'appli la garde sur le téléphone pour l'appliquer aussi sans internet.
 */
export async function onRequestGet({ env }) {
  const sortie = { corrections: {}, ajouts: [] };
  if (env.SIGNALEMENTS) {
    for (const prefixe of ["correction:", "ajout:"]) {
      const cles = [];
      let curseur;
      do {
        const p = await env.SIGNALEMENTS.list({ prefix: prefixe, cursor: curseur });
        p.keys.forEach((k) => cles.push(k.name));
        curseur = p.list_complete ? null : p.cursor;
      } while (curseur);
      await Promise.all(cles.map(async (k) => {
        try {
          const v = JSON.parse(await env.SIGNALEMENTS.get(k));
          if (!v) return;
          if (prefixe === "correction:") sortie.corrections[k.slice(prefixe.length)] = v;
          else sortie.ajouts.push(v);
        } catch (e) {
          /* entrée illisible : ignorée */
        }
      }));
    }
  }
  return new Response(JSON.stringify(sortie), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=300" }
  });
}
