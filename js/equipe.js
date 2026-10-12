/*
 * Page de l'équipe (/equipe, functions/equipe.js) : ce qui se dessine dans le navigateur.
 * - Remplace les identifiants des lieux (« l07 ») par leur nom, partout sur la page.
 * - Onglet « Lieux » : un formulaire par lieu (fermeture temporaire, horaires, téléphone,
 *   message sur la fiche) et un formulaire pour ajouter un lieu. Les formulaires sont envoyés
 *   à /equipe, qui vérifie le mot de passe et enregistre.
 * Les lieux viennent de /data/lieux.js et les noms des besoins de /js/i18n.js.
 */
(function () {
  "use strict";
  const D = window.PALADINES_DATA;
  if (!D) return;
  const T = (window.PALADINES_I18N || {}).fr || {};
  const SEMAINE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  const NOMS_JOURS = { lun: "Lun.", mar: "Mar.", mer: "Mer.", jeu: "Jeu.", ven: "Ven.", sam: "Sam.", dim: "Dim." };
  const bloc = document.getElementById("donnees-lieux");
  const donnees = bloc ? JSON.parse(bloc.textContent) : { corrections: {}, ajouts: [] };
  const tous = D.lieux.concat(donnees.ajouts || []);
  const parId = {};
  tous.forEach((l) => { parId[l.id] = l; });

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nomCat = (c) => T["cat_" + c] || c;

  // Noms des lieux à la place des identifiants
  document.querySelectorAll("[data-nom-lieu]").forEach((el) => {
    const l = parId[el.dataset.nomLieu];
    if (l) el.textContent = l.nom;
  });

  const zone = document.getElementById("lieux-equipe");
  if (!zone) return;

  // [["09:00","12:00"],["14:00","17:30"]] → « 9h-12h, 14h-17h30 »
  const heure = (h) => { const [a, m] = h.split(":"); return +a + "h" + (m === "00" ? "" : m); };
  const texteJour = (horaires, j) => (horaires && horaires !== "24/7" && horaires[j] ? horaires[j].map((p) => heure(p[0]) + "-" + heure(p[1])).join(", ") : "");

  function champsHoraires(horaires) {
    return (
      '<fieldset><legend>Horaires</legend>' +
      '<label class="case"><input type="checkbox" name="h24"' + (horaires === "24/7" ? " checked" : "") + "> Ouvert 24 h/24, 7 j/7</label>" +
      '<div class="jours">' + SEMAINE.map((j) =>
        '<span id="j-' + j + '">' + NOMS_JOURS[j] + '</span><input name="h_' + j + '" aria-labelledby="j-' + j + '" value="' + esc(texteJour(horaires, j)) + '" placeholder="fermé">'
      ).join("") + "</div>" +
      '<p class="discret">Exemple : 9h-12h, 14h-17h30. Laisser vide si fermé ce jour-là. Tout vide : horaires inconnus (« Appeler avant »).</p>' +
      "</fieldset>"
    );
  }

  function formLieu(l) {
    const c = donnees.corrections[l.id] || {};
    const horaires = "horaires" in c ? c.horaires : l.horaires;
    const tel = "tel" in c ? c.tel : l.tel || "";
    const badges = (c.ferme ? '<span class="badge badge--ferme">Fermé</span>' : "") + (Object.keys(c).length ? '<span class="badge">Corrigé</span>' : "") +
      (l.ajoutEquipe ? '<span class="badge">Ajouté</span>' : "");
    return (
      '<li><details class="lieu-equipe" id="lieu-' + esc(l.id) + '"' + (donnees.ok === l.id || location.hash === "#lieu-" + l.id ? " open" : "") + ">" +
      '<summary class="lieu-titre">' + esc(l.nom) + '<span class="badges">' + badges + '</span><br><span class="discret">' + esc(nomCat(l.cat)) + (l.adresse ? " · " + esc(l.adresse) : "") + "</span></summary>" +
      (donnees.ok === l.id ? '<p class="ok-msg" role="status">Enregistré.</p>' : "") +
      '<form method="post" class="form-lieu">' +
      '<input type="hidden" name="action" value="corriger"><input type="hidden" name="id" value="' + esc(l.id) + '">' +
      '<input type="hidden" name="horaires_origine" value="' + esc(JSON.stringify(l.horaires === undefined ? null : l.horaires)) + '">' +
      '<input type="hidden" name="tel_origine" value="' + esc(l.tel || "") + '">' +
      '<fieldset><legend>Fermé pour quelques jours</legend>' +
      '<label class="case"><input type="checkbox" name="ferme"' + (c.ferme ? " checked" : "") + "> Fermé en ce moment</label>" +
      '<label>Jusqu\'au (inclus, facultatif)<input type="date" name="jusqu" value="' + esc(c.ferme ? c.ferme.jusqu : "") + '"></label>' +
      '<label>Raison (facultatif)<input name="raison" maxlength="120" value="' + esc(c.ferme ? c.ferme.texte : "") + '" placeholder="Travaux, congés…"></label>' +
      "</fieldset>" +
      champsHoraires(horaires) +
      '<label>Téléphone<input name="tel" type="tel" maxlength="30" value="' + esc(tel) + '"></label>' +
      '<label>Message sur la fiche (facultatif, 200 caractères)<textarea name="note" maxlength="200" placeholder="Ex. : distribution déplacée au 12 rue…">' + esc(c.note || "") + "</textarea></label>" +
      '<button type="submit" class="principal">Enregistrer</button></form>' +
      (Object.keys(c).length && !l.ajoutEquipe
        ? '<form method="post" onsubmit="return confirm(\'Revenir aux infos d\\\'origine de ce lieu ?\')"><input type="hidden" name="action" value="annuler-correction"><input type="hidden" name="id" value="' + esc(l.id) + '"><button type="submit">Revenir aux infos d\'origine</button></form>'
        : "") +
      (l.ajoutEquipe
        ? '<form method="post" onsubmit="return confirm(\'Supprimer ce lieu de l\\\'appli ?\')"><input type="hidden" name="action" value="supprimer-ajout"><input type="hidden" name="id" value="' + esc(l.id) + '"><button type="submit" class="danger">Supprimer ce lieu</button></form>'
        : "") +
      "</details></li>"
    );
  }

  function formAjout() {
    return (
      '<details class="carte"><summary class="lieu-titre">+ Ajouter un lieu</summary>' +
      '<form method="post" class="form-lieu"><input type="hidden" name="action" value="ajouter">' +
      '<label>Nom<input name="nom" required maxlength="120"></label>' +
      '<label>Besoin<select name="cat" required>' + D.categories.map((c) => '<option value="' + c.id + '">' + esc(nomCat(c.id)) + "</option>").join("") + "</select></label>" +
      '<label>Adresse (la position est trouvée toute seule)<input name="adresse" maxlength="160" placeholder="12 rue Solférino, 59000 Lille"></label>' +
      '<label>Téléphone<input name="tel" type="tel" maxlength="30"></label>' +
      champsHoraires(null) +
      '<label>Sur place (une chose par ligne)<textarea name="services" maxlength="600"></textarea></label>' +
      '<label>Conditions d\'accès<textarea name="conditions" maxlength="400" placeholder="Sans rendez-vous, gratuit…"></textarea></label>' +
      '<label class="case"><input type="checkbox" name="femmes"> Réservé aux femmes</label>' +
      '<p class="discret">Pas d\'adresse protégée ici : pour un hébergement à l\'adresse secrète, passez par l\'équipe technique.</p>' +
      '<button type="submit" class="principal">Ajouter le lieu</button></form></details>'
    );
  }

  zone.innerHTML =
    formAjout() +
    '<h2>Lieux (' + tous.length + ')</h2>' +
    '<input type="search" class="chercher" placeholder="Chercher un lieu" aria-label="Chercher un lieu">' +
    '<ul class="cartes liste-lieux">' + tous.map(formLieu).join("") + "</ul>";

  const chercher = zone.querySelector(".chercher");
  const normal = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  chercher.addEventListener("input", () => {
    const q = normal(chercher.value.trim());
    zone.querySelectorAll(".liste-lieux > li").forEach((li) => {
      li.hidden = q && normal(li.textContent).indexOf(q) === -1;
    });
  });
  const cible = document.getElementById(location.hash.slice(1));
  if (cible) cible.scrollIntoView();
})();
