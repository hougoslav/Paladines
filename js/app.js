/*
 * Paladines : logique de l'application.
 * Pas de framework : des vues rendues en HTML selon l'ancre de l'URL (#cat-dormir, #lieu-p01…).
 * Les ancres ne contiennent que des lettres, chiffres et tirets, et restent neutres
 * (par ex. #cat-ecoute plutôt que #violences) pour ne rien révéler dans l'historique.
 */
(function () {
  "use strict";

  const D = window.PALADINES_DATA;
  const TR = window.PALADINES_I18N;
  const LANGUES = ["fr", "en", "ar"];
  const JOURS = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]; // index = Date#getDay()
  const SEMAINE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  const URL_SORTIE = "https://www.google.com/search?q=m%C3%A9t%C3%A9o";
  const FERME_BIENTOT_MIN = 30;
  const CRITERES = ["femmes", "enfants", "animaux", "inconditionnel", "sansRdv", "gratuit", "pmr"];
  const LOCALES = { fr: "fr-FR", en: "en-GB", ar: "ar-u-nu-latn" };
  const VOIX = { fr: "fr-FR", en: "en-GB", ar: "ar-SA" };

  /* ---------- Stockage local (peut être indisponible : navigation privée…) ---------- */
  const stock = {
    lire(cle, defaut) {
      try {
        const v = localStorage.getItem("paladines." + cle);
        return v === null ? defaut : JSON.parse(v);
      } catch (e) {
        return defaut;
      }
    },
    ecrire(cle, valeur) {
      try {
        localStorage.setItem("paladines." + cle, JSON.stringify(valeur));
      } catch (e) {
        /* stockage indisponible : l'appli marche quand même */
      }
    },
    toutEffacer() {
      try {
        Object.keys(localStorage)
          .filter((k) => k.indexOf("paladines.") === 0)
          .forEach((k) => localStorage.removeItem(k));
      } catch (e) {
        /* rien à effacer */
      }
    }
  };

  const etat = {
    langue: stock.lire("langue", null) || langueDuTelephone(),
    taille: stock.lire("taille", 0),
    favoris: stock.lire("favoris", []),
    filtres: new Set(),
    position: null, // { lat, lng, source: "gps" | "qr", nom }
    triDistance: true, // « Près de moi » : trier du plus proche au plus loin quand la position est connue
    positionMessage: null,
    gpsDemande: false,
    navInterne: false,
    installation: null,
    carte: null,
    coucheLieux: null,
    marqueurMoi: null,
    carteCat: "toutes",
    carteOuvert: false,
    carteEq: { t: false, e: false, s: false },
    carteCadree: false,
    meteo: null
  };

  function langueDuTelephone() {
    const prefs = navigator.languages || [navigator.language || "fr"];
    for (let i = 0; i < prefs.length; i++) {
      const code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (LANGUES.indexOf(code) !== -1) return code;
    }
    return "fr";
  }

  /* ---------- Outils ---------- */
  function t(cle, vars) {
    const dico = TR[etat.langue] || TR.fr;
    let txt = dico[cle] !== undefined ? dico[cle] : TR.fr[cle] !== undefined ? TR.fr[cle] : cle;
    if (vars && typeof txt === "string") {
      txt = txt.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    }
    return txt;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function icone(id, cls) {
    return '<svg class="ic ' + (cls || "") + '" aria-hidden="true" focusable="false"><use href="#' + id + '"></use></svg>';
  }

  function categorie(id) {
    return D.categories.find((c) => c.id === id);
  }

  // Un lieu a une catégorie principale (cat) et peut servir à d'autres besoins (autresCats)
  function dansCat(l, id) {
    return l.cat === id || (l.autresCats || []).indexOf(id) !== -1;
  }

  function lieu(id) {
    return D.lieux.find((l) => l.id === id);
  }

  // Un lieu n'apparaît sur la carte et n'a de distance que si ses coordonnées sont connues et publiques
  function aCoord(l) {
    return !l.adresseMasquee && typeof l.lat === "number" && typeof l.lng === "number";
  }

  // Ce qu'un lieu offre aux femmes : { niveau: "reserve" | "creneau" | "specialise", texte }
  function pourFemmes(l) {
    if (l.femmes) return l.femmes;
    return l.criteres && l.criteres.femmes ? { niveau: "reserve", texte: "" } : null;
  }

  function badgeFemmes(l) {
    const f = pourFemmes(l);
    return f && f.niveau !== "specialise" ? '<span class="badge-femmes">' + esc(t("badge_" + f.niveau)) + "</span>" : "";
  }

  function hote(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return url;
    }
  }

  function telLien(num) {
    return "tel:" + String(num).replace(/[^\d+]/g, "");
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat(LOCALES[etat.langue], { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T12:00:00"));
    } catch (e) {
      return iso;
    }
  }

  /* ---------- Horaires ---------- */
  function enMinutes(hm) {
    const p = hm.split(":");
    return Number(p[0]) * 60 + Number(p[1]);
  }

  function formatHeure(hm) {
    const p = hm.split(":");
    const h = String(Number(p[0]));
    // Espaces insécables : « 20 h 30 » ne se coupe jamais en fin de ligne
    if (etat.langue === "fr") return p[1] === "00" ? h + "\u00a0h" : h + "\u00a0h\u00a0" + p[1];
    return h + ":" + p[1];
  }

  function plages(l, jour) {
    if (!l.horaires || l.horaires === "24/7") return [];
    return l.horaires[jour] || [];
  }

  function statutOuvert(fin, reste) {
    const bientot = reste <= FERME_BIENTOT_MIN;
    return {
      ouvert: true,
      classe: bientot ? "bientot" : "ouvert",
      texte: (bientot ? t("fermeBientot") : t("ouvert")) + " · " + t("fermeA", { h: formatHeure(fin) })
    };
  }

  /* Statut à un instant donné. Gère les plages qui passent minuit (ex. 19:00 → 08:00). */
  function statut(l, maintenant) {
    if (fermeEnCeMoment(l)) {
      return { ouvert: false, classe: "ferme", texte: t("fermeTemp") + (l.fermeTemp.jusqu ? " · " + t("jusquau", { date: formatDate(l.fermeTemp.jusqu) }) : "") };
    }
    if (l.horaires === "24/7") return { ouvert: true, classe: "ouvert", texte: t("h24") };
    if (!l.horaires) return { ouvert: null, classe: "inconnu", texte: t("horairesInconnus") };

    const jour = maintenant.getDay();
    const m = maintenant.getHours() * 60 + maintenant.getMinutes();
    const hier = JOURS[(jour + 6) % 7];
    const auj = JOURS[jour];

    for (const p of plages(l, hier)) {
      const d = enMinutes(p[0]);
      const f = enMinutes(p[1]);
      if (f <= d && m < f) return statutOuvert(p[1], f - m);
    }
    for (const p of plages(l, auj)) {
      const d = enMinutes(p[0]);
      const f = enMinutes(p[1]);
      if (f > d && m >= d && m < f) return statutOuvert(p[1], f - m);
      if (f <= d && m >= d) return statutOuvert(p[1], 1440 - m + f);
    }

    // Fermé : chercher la prochaine ouverture (jusqu'au même jour la semaine suivante)
    for (let i = 0; i <= 7; i++) {
      const cle = JOURS[(jour + i) % 7];
      const debuts = plages(l, cle)
        .map((p) => p[0])
        .filter((d) => i > 0 || enMinutes(d) > m)
        .sort((a, b) => enMinutes(a) - enMinutes(b));
      if (debuts.length) {
        const h = formatHeure(debuts[0]);
        let quand;
        if (i === 0) quand = t("ouvreA", { h: h });
        else if (i === 1) quand = t("ouvreJour", { jour: t("demain"), h: h });
        else quand = t("ouvreJour", { jour: t("jours")[cle], h: h });
        return { ouvert: false, classe: "ferme", texte: t("ferme") + " · " + quand };
      }
    }
    return { ouvert: false, classe: "ferme", texte: t("fermeToute") };
  }

  function texteHorairesJour(l, jour) {
    const p = plages(l, jour);
    if (!p.length) return t("ferme");
    return p.map((x) => formatHeure(x[0]) + " – " + formatHeure(x[1])).join(", ");
  }

  /* ---------- Position et distances ---------- */
  function lirePositionQR() {
    const p = new URLSearchParams(location.search);
    const pres = p.get("pres");
    if (!pres) return;
    const c = pres.split(",").map(Number);
    if (c.length === 2 && isFinite(c[0]) && isFinite(c[1]) && Math.abs(c[0]) <= 90 && Math.abs(c[1]) <= 180) {
      etat.position = { lat: c[0], lng: c[1], source: "qr", nom: (p.get("nom") || "").slice(0, 80) };
    }
  }

  function distanceM(a, b) {
    const R = 6371000;
    const rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad;
    const dLng = (b.lng - a.lng) * rad;
    const h = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.pow(Math.sin(dLng / 2), 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function formatDistance(m) {
    const nf = new Intl.NumberFormat(LOCALES[etat.langue], { maximumFractionDigits: 1 });
    const txt = m < 1000 ? Math.max(10, Math.round(m / 10) * 10) + " m" : nf.format(m / 1000) + " km";
    // 4,5 km/h, et +25 % car on ne marche jamais en ligne droite
    const min = Math.max(1, Math.round((m * 1.25) / 75));
    return txt + " · " + t("aPied", { min: min });
  }

  // Le GPS du navigateur ne marche que sur un site en https (ou en local)
  function gpsPossible() {
    return !!navigator.geolocation && (window.isSecureContext !== false || /^(localhost|127\.0\.0\.1)$/.test(location.hostname));
  }

  function demanderPosition() {
    etat.gpsDemande = true;
    if (!gpsPossible()) {
      etat.positionMessage = navigator.geolocation ? "gpsHttps" : "gpsIndispo";
      rafraichir();
      return;
    }
    etat.positionMessage = "positionEnCours";
    rafraichir();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        definirPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: "gps" }, true);
      },
      (err) => {
        etat.positionMessage = etat.position && etat.position.source !== "gps" ? "gpsGarde" : err && err.code === 1 ? "gpsRefuse" : "gpsIndispo";
        rafraichir();
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 }
    );
  }

  function definirPosition(pos, centrer) {
    etat.position = pos;
    etat.positionMessage = null;
    etat.triDistance = true;
    rafraichir();
    majMarqueurs();
    majMoiSurCarte(centrer);
    majMsgCarte();
  }

  /* ---------- Position des lieux ----------
   * 1. data/coordonnees.js (généré par outils/geocoder.mjs) ;
   * 2. sinon, l'appli cherche l'adresse dans la Base Adresse Nationale (service public, gratuit)
   *    et garde le résultat sur le téléphone. Seules les adresses des lieux sont envoyées,
   *    jamais la position de la personne.
   */
  const GEOCODEURS = [
    "https://data.geopf.fr/geocodage/search?limit=1&q=",
    "https://api-adresse.data.gouv.fr/search/?limit=1&q="
  ];

  function appliquerCoordonnees() {
    const connues = window.PALADINES_COORDS || {};
    const cache = stock.lire("geo", {});
    D.lieux.forEach((l) => {
      if (l.adresseMasquee || !adresseGeo(l) || typeof l.lat === "number") return;
      const enCache = cache[l.id] && cache[l.id].adresse === adresseGeo(l) ? cache[l.id].c : null;
      const c = connues[l.id] || enCache;
      if (c) {
        l.lat = c[0];
        l.lng = c[1];
      }
    });
  }

  function adresseGeo(l) {
    return l.adresseGeo || l.adresse;
  }

  function geocoder(adresse, i) {
    if (i >= GEOCODEURS.length) return Promise.resolve(null);
    return fetch(GEOCODEURS[i] + encodeURIComponent(adresse), { referrerPolicy: "no-referrer" })
      .then((rep) => (rep.ok ? rep.json() : Promise.reject(rep.status)))
      .then((json) => {
        const f = json.features && json.features[0];
        if (!f || f.properties.score < 0.45 || String(f.properties.postcode || "").indexOf("59") !== 0) return null;
        return [Math.round(f.geometry.coordinates[1] * 1e5) / 1e5, Math.round(f.geometry.coordinates[0] * 1e5) / 1e5];
      })
      .catch(() => geocoder(adresse, i + 1));
  }

  function geocoderManquants() {
    if (!window.fetch || navigator.onLine === false) return;
    const manquants = D.lieux.filter((l) => !l.adresseMasquee && adresseGeo(l) && typeof l.lat !== "number");
    if (!manquants.length) return;
    const cache = stock.lire("geo", {});
    let trouves = 0;
    // Une adresse après l'autre : le service limite le nombre d'appels par seconde
    manquants.reduce((suite, l) => suite.then(() => geocoder(adresseGeo(l), 0).then((c) => {
      if (!c) return;
      l.lat = c[0];
      l.lng = c[1];
      cache[l.id] = { adresse: adresseGeo(l), c: c };
      trouves++;
    })), Promise.resolve()).then(() => {
      if (!trouves) return;
      stock.ecrire("geo", cache);
      const v = vueCourante().vue;
      if (["accueil", "cat", "proche", "favoris", "lieu"].indexOf(v) !== -1) rafraichir();
      majMarqueurs();
    });
  }

  /* ---------- Corrections de l'équipe (onglet « Lieux » de /equipe, via /api/corrections) ----------
   * Fermeture temporaire, horaires, téléphone, message sur la fiche, lieux ajoutés. Gardées sur
   * le téléphone pour marcher sans internet ; les infos d'origine sont gardées pour pouvoir revenir. */
  const ORIGINES = {};

  function appliquerCorrections(donnees) {
    if (!donnees || typeof donnees !== "object") return;
    // Revenir aux infos d'origine, puis appliquer les corrections reçues
    Object.keys(ORIGINES).forEach((id) => {
      const l = lieu(id);
      if (l) Object.assign(l, ORIGINES[id]);
    });
    D.lieux = D.lieux.filter((l) => !l.ajoutEquipe);
    (donnees.ajouts || []).forEach((a) => {
      if (a && /^n[a-z0-9]{8}$/.test(a.id) && categorie(a.cat) && !lieu(a.id)) D.lieux.push(Object.assign({ services: [], criteres: {}, langues: [], sources: [], autresCats: [] }, a));
    });
    const corr = donnees.corrections || {};
    Object.keys(corr).forEach((id) => {
      const l = lieu(id);
      const c = corr[id];
      if (!l || !c) return;
      if (!ORIGINES[id]) ORIGINES[id] = { horaires: l.horaires, tel: l.tel, fermeTemp: l.fermeTemp, noteEquipe: l.noteEquipe };
      if ("horaires" in c) l.horaires = c.horaires;
      if ("tel" in c) l.tel = c.tel;
      l.noteEquipe = c.note || "";
      l.fermeTemp = c.ferme || null;
    });
  }

  function chargerCorrections() {
    appliquerCorrections(stock.lire("corrections", null));
    if (!window.fetch || navigator.onLine === false || location.protocol === "file:") return;
    fetch("/api/corrections")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j || JSON.stringify(j) === JSON.stringify(stock.lire("corrections", null))) return;
        stock.ecrire("corrections", j);
        appliquerCorrections(j);
        geocoderManquants();
        const v = vueCourante().vue;
        if (["accueil", "cat", "proche", "favoris", "lieu", "pourvous"].indexOf(v) !== -1) rafraichir();
        majMarqueurs();
      })
      .catch(() => { /* hors ligne : on garde les corrections déjà reçues */ });
  }

  // Fermé temporairement : jusqu'à la date donnée (incluse), ou tant que l'équipe ne l'a pas rouvert
  function fermeEnCeMoment(l) {
    const f = l.fermeTemp;
    if (!f) return false;
    if (!f.jusqu) return true;
    const auj = new Date();
    const iso = auj.getFullYear() + "-" + String(auj.getMonth() + 1).padStart(2, "0") + "-" + String(auj.getDate()).padStart(2, "0");
    return iso <= f.jusqu;
  }

  /* ---------- « Ce lieu vous a aidée ? » ----------
   * Un avis par lieu tous les 30 jours, gardé sur le téléphone ; seul « oui » ou « non » est envoyé. */
  const AVIS_JOURS = 30;

  function avisDonne(id) {
    const date = stock.lire("avis", {})[id];
    return date && Date.now() - date < AVIS_JOURS * 864e5;
  }

  function htmlAvis(l) {
    if (avisDonne(l.id)) return '<section class="avis-lieu"><p>' + icone("i-check") + esc(t("avisMerci")) + "</p></section>";
    return (
      '<section class="avis-lieu"><h2>' + esc(t("avisQuestion")) + "</h2>" +
      '<div class="avis-boutons">' +
      '<button type="button" class="btn btn--doux" data-action="avis" data-id="' + l.id + '" data-valeur="oui">👍 ' + esc(t("avisOui")) + "</button>" +
      '<button type="button" class="btn btn--doux" data-action="avis" data-id="' + l.id + '" data-valeur="non">👎 ' + esc(t("avisNon")) + "</button>" +
      "</div></section>"
    );
  }

  function donnerAvis(id, avis) {
    const deja = stock.lire("avis", {});
    deja[id] = Date.now();
    stock.ecrire("avis", deja);
    stock.ecrire("avisAttente", stock.lire("avisAttente", []).concat([{ lieu: id, avis: avis }]).slice(-50));
    envoyerAvis();
  }

  let avisEnCours = false;
  async function envoyerAvis() {
    if (avisEnCours || navigator.onLine === false || !window.fetch) return;
    const liste = stock.lire("avisAttente", []);
    if (!liste.length) return;
    avisEnCours = true;
    const restent = [];
    for (const a of liste) {
      try {
        const r = await fetch("/api/avis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a), referrerPolicy: "no-referrer" });
        if (r.status >= 500) restent.push(a);
      } catch (e) {
        restent.push(a);
      }
    }
    stock.ecrire("avisAttente", restent.concat(stock.lire("avisAttente", []).slice(liste.length)));
    avisEnCours = false;
  }

  /* ---------- Listes de lieux ---------- */
  function rangStatut(s) {
    return s.ouvert === true ? 0 : s.ouvert === null ? 1 : 2;
  }

  function preparer(liste, forcerOuvert) {
    const maintenant = new Date();
    const ref = etat.triDistance ? etat.position : null;
    return liste
      .map((l) => ({ l: l, s: statut(l, maintenant), d: ref && aCoord(l) ? distanceM(ref, l) : null }))
      .filter((x) => {
        if ((forcerOuvert || etat.filtres.has("ouvert")) && x.s.ouvert !== true) return false;
        for (const f of etat.filtres) {
          if (f !== "ouvert" && !(x.l.criteres && x.l.criteres[f])) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Position connue : du plus proche au plus loin (les lieux sans adresse à la fin).
        // Sinon : les lieux ouverts d'abord. Le filtre « Ouvert maintenant » garde seulement les ouverts.
        if (ref) {
          const da = distanceTri(a);
          const db = distanceTri(b);
          if (da !== db) return da - db;
        }
        const r = rangStatut(a.s) - rangStatut(b.s);
        if (r) return r;
        return a.l.nom.localeCompare(b.l.nom, "fr");
      });
  }

  // Un numéro à appeler (115, équipe mobile) est joignable de partout : en tête de liste
  function distanceTri(x) {
    if (x.d !== null) return x.d;
    return !x.l.adresse && !x.l.adresseMasquee ? -1 : Infinity;
  }

  function htmlLieu(x, avecCategorie, avecFemmes) {
    const l = x.l;
    const f = avecFemmes ? pourFemmes(l) : null;
    const cat = categorie(l.cat);
    return (
      '<li class="ligne-lieu"><a class="lieu" href="#lieu-' + l.id + '">' +
      '<span class="pastille" style="--c:' + cat.couleur + '">' + icone(cat.icone) + "</span>" +
      '<span class="lieu-corps">' +
      (avecCategorie ? '<span class="lieu-cat">' + esc(t("cat_" + l.cat)) + "</span>" : "") +
      '<span class="lieu-nom">' + esc(l.nom) + "</span>" +
      badgeFemmes(l) +
      (f && f.texte ? '<span class="lieu-femmes">' + esc(f.texte) + "</span>" : "") +
      '<span class="statut statut--' + x.s.classe + '">' + esc(x.s.texte) + "</span>" +
      (x.d !== null ? '<span class="lieu-meta">' + icone("i-pied") + esc(formatDistance(x.d)) + "</span>" : "") +
      "</span>" + icone("i-chevron", "chevron") + "</a>" +
      (l.tel ? '<a class="appel-rapide" href="' + telLien(l.tel) + '" aria-label="' + esc(t("appeler") + " " + l.nom + " : " + l.tel) + '">' + icone("i-tel") + "<span>" + esc(t("appeler")) + "</span></a>" : "") +
      "</li>"
    );
  }

  function htmlListe(prepares, avecCategorie, avecFemmes) {
    if (!prepares.length) return '<p class="vide">' + esc(t("aucun")) + "</p>";
    return (
      '<p class="compte">' + esc(prepares.length === 1 ? t("nbLieu1") : t("nbLieux", { n: prepares.length })) + ' <span class="compte-note">' + esc(t("aConfirmer")) + "</span></p>" +
      '<ul class="liste">' + prepares.map((x) => htmlLieu(x, avecCategorie, avecFemmes)).join("") + "</ul>"
    );
  }

  function nomPosition(p) {
    return p.nom || t("positionAffiche");
  }

  // Au-dessus des listes : « Près de moi » (tri par distance) et « Ouvert maintenant » en évidence,
  // les autres filtres repliés sous « Plus de filtres »
  function htmlOutils(options) {
    const o = options || {};
    const p = etat.position;
    const actif = !!(p && etat.triDistance);
    let msg = "";
    if (etat.positionMessage === "positionEnCours") msg = t("positionEnCours");
    else if (etat.positionMessage === "gpsGarde" && p) msg = t("gpsGarde", { nom: nomPosition(p) });
    else if (etat.positionMessage) msg = t(etat.positionMessage);
    else if (actif) msg = p.source === "gps" ? t("positionOk") : t("positionQR", { nom: nomPosition(p) });
    const puce = (f) => '<button type="button" class="puce" data-action="filtre" data-filtre="' + f + '" aria-pressed="' + etat.filtres.has(f) + '">' + esc(t("f_" + f)) + "</button>";
    const nbAutres = CRITERES.filter((f) => etat.filtres.has(f)).length;
    return (
      '<div class="outils">' +
      '<div class="outils-puces">' +
      '<button type="button" class="puce puce--proche" data-action="proche" aria-pressed="' + actif + '">' + icone("i-position") + esc(t("presDeMoi")) + "</button>" +
      (o.ouvert ? puce("ouvert") : "") +
      "</div>" +
      (o.filtres
        ? '<details class="plus-filtres"' + (nbAutres ? " open" : "") + "><summary>" + icone("i-reglages") + esc(t("plusFiltres")) +
          '<span class="nb-filtres">' + (nbAutres ? " (" + nbAutres + ")" : "") + "</span></summary>" +
          '<div class="filtres" role="group" aria-label="' + esc(t("filtres")) + '">' + CRITERES.map(puce).join("") + "</div></details>"
        : "") +
      (msg ? '<p class="position-msg" role="status">' + esc(msg) + "</p>" : "") +
      (actif && p.source === "gps" ? '<p class="position-prive">' + esc(t("positionPrive")) + "</p>" : "") +
      "</div>"
    );
  }

  function htmlRetour() {
    return '<a class="retour" href="#accueil" data-action="retour">' + icone("i-retour") + esc(t("retour")) + "</a>";
  }

  /* ---------- Vues ---------- */
  function vueAccueil() {
    const maintenant = new Date();

    // Une tuile : le besoin et combien de lieux sont ouverts (« Appeler avant » si les horaires sont inconnus)
    const tuile = (lien, nom, aide, ic, lieux, attrs) => {
      const n = lieux.filter((l) => statut(l, maintenant).ouvert === true).length;
      const inconnus = n === 0 && lieux.some((l) => statut(l, maintenant).ouvert === null);
      const nb = n === 0 ? t(inconnus ? "nbInconnu" : "nbOuvert0") : n === 1 ? t("nbOuvert1") : t("nbOuvertN", { n: n });
      const nbLong = n === 0 ? t(inconnus ? "ouvertsInconnus" : "ouverts0") : n === 1 ? t("ouverts1") : t("ouvertsN", { n: n });
      return (
        '<li><a href="' + lien + '" ' + attrs + ' aria-label="' + esc(nom + (aide ? " (" + aide + ")" : "") + " : " + nbLong) + '">' +
        '<span class="pastille">' + icone(ic) + "</span>" +
        '<span class="tuile-nom">' + esc(nom) + "</span>" +
        '<span class="tuile-nb' + (n ? " tuile-nb--ouvert" : inconnus ? " tuile-nb--inconnu" : "") + '" aria-hidden="true">' + esc(nb) + "</span>" +
        "</a></li>"
      );
    };
    // « Pour les femmes » en premier, dans sa couleur prune, puis les besoins
    const tuiles =
      tuile("#pourvous", t("femmesTitre"), t("femmesSous"), "i-coeur", D.lieux.filter(pourFemmes), 'class="tuile tuile--femmes"') +
      D.categories.map((c) =>
        tuile("#cat-" + c.id, t("cat_" + c.id), "", c.icone, D.lieux.filter((l) => dansCat(l, c.id)), 'class="tuile" style="--c:' + c.couleur + '"')
      ).join("");

    const rapides = [
      { num: "115", txt: t("urg115") },
      { num: "3919", txt: t("urg3919") },
      { num: "17", txt: t("urg17") }
    ].map((u) => '<a class="urg-rapide" href="' + telLien(u.num) + '"><span class="urg-rapide-num">' + u.num + '</span><span class="urg-rapide-txt">' + esc(u.txt) + "</span></a>").join("");

    return (
      '<section class="hero">' +
      '<p class="hero-pour">' + esc(t("heroPour")) + "</p>" +
      '<h1 class="hero-titre"><span>' + esc(t("bonjour")) + "</span> " + esc(t("besoin")) + "</h1>" +
      '<a class="cta-proche" href="#proche">' +
      '<span class="cta-ic">' + icone("i-position") + "</span>" +
      '<span class="cta-txt"><strong>' + esc(t("procheCta")) + "</strong><small>" + esc(t("procheSous")) + "</small></span>" +
      icone("i-chevron", "chevron") + "</a>" +
      "</section>" +
      htmlBandeauInstallation() +
      htmlInfosMoment(maintenant) +
      '<section class="bloc" aria-labelledby="h-cherche">' +
      '<h2 id="h-cherche" class="titre-bloc">' + esc(t("jeCherche")) + "</h2>" +
      '<ul class="grille-cat">' + tuiles + "</ul>" +
      "</section>" +
      '<section class="bloc urgences-rapides" aria-labelledby="h-urg">' +
      '<h2 id="h-urg" class="titre-bloc titre-bloc--urg">' + icone("i-tel") + esc(t("urgence")) + "</h2>" +
      '<a class="btn btn--danger btn--aide" href="#aide">' + icone("i-bouclier") + esc(t("aideBouton")) + "</a>" +
      '<div class="urg-rapides">' + rapides + "</div>" +
      '<a class="lien-fleche" href="#urgences">' + esc(t("tousNumeros")) + icone("i-chevron", "chevron") + "</a>" +
      "</section>" +
      '<p class="maj">' + esc(t("prototype")) + "<br>" + esc(t("donneesDu", { date: formatDate(D.majDonnees) })) + "</p>"
    );
  }


  /* ---------- Infos du moment ----------
   * Calculées à chaque affichage : la période de l'année (data/lieux.js, « infos »), la météo de Lille
   * (Open-Meteo, gardée 3 h sur le téléphone) et les lieux ouverts ou qui ouvrent bientôt.
   * Elles défilent toutes seules ; on peut mettre en pause ou glisser du doigt. */
  const METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=50.63&longitude=3.06&daily=temperature_2m_min,temperature_2m_max,precipitation_sum&timezone=Europe%2FParis&forecast_days=3";
  const DEFILEMENT_MS = 6000;

  // Ouvert maintenant ({ ouvert: true, fin }) ou prochaine ouverture aujourd'hui ({ ouvert: false, debut, dans } en minutes)
  function momentLieu(l, maintenant) {
    if (!l.horaires || l.horaires === "24/7") return null;
    const jour = maintenant.getDay();
    const m = maintenant.getHours() * 60 + maintenant.getMinutes();
    for (const p of plages(l, JOURS[(jour + 6) % 7])) {
      if (enMinutes(p[1]) <= enMinutes(p[0]) && m < enMinutes(p[1])) return { ouvert: true, fin: p[1] };
    }
    let prochain = null;
    for (const p of plages(l, JOURS[jour])) {
      const d = enMinutes(p[0]);
      const f = enMinutes(p[1]);
      if ((f > d && m >= d && m < f) || (f <= d && m >= d)) return { ouvert: true, fin: p[1] };
      if (d > m && (!prochain || d - m < prochain.dans)) prochain = { ouvert: false, debut: p[0], dans: d - m };
    }
    return prochain;
  }

  // Une période « MM-JJ » à « MM-JJ » (qui peut passer le nouvel an, comme le plan hiver)
  function dansPeriode(x, maintenant) {
    const j = String(maintenant.getMonth() + 1).padStart(2, "0") + "-" + String(maintenant.getDate()).padStart(2, "0");
    return x.du <= x.au ? j >= x.du && j <= x.au : j >= x.du || j <= x.au;
  }

  function infoMeteo(maintenant) {
    const d = etat.meteo;
    if (!d) return null;
    const auj = maintenant.getFullYear() + "-" + String(maintenant.getMonth() + 1).padStart(2, "0") + "-" + String(maintenant.getDate()).padStart(2, "0");
    const i = d.jours.indexOf(auj);
    if (i === -1) return null;
    // La nuit qui vient : le minimum du lendemain matin ; entre minuit et 6 h, on est dans la nuit du jour
    const nuit = maintenant.getHours() < 6 ? d.min[i] : d.min[i + 1];
    const max = d.max[i];
    if (typeof nuit === "number" && nuit <= 0) return { type: "alerte", icone: "i-alerte", texte: t("im_glace", { t: Math.round(nuit) }), lien: "tel:115" };
    if (typeof nuit === "number" && nuit <= 5) return { type: "alerte", icone: "i-alerte", texte: t("im_froid", { t: Math.round(nuit) }), lien: "tel:115" };
    if (typeof max === "number" && max >= 30) return { type: "alerte", icone: "i-alerte", texte: t("im_chaleur", { t: Math.round(max) }), lien: "#cat-accueil" };
    if (typeof d.pluie[i] === "number" && d.pluie[i] >= 5) return { type: "info", icone: "i-info", texte: t("im_pluie"), lien: "#cat-accueil" };
    return null;
  }

  function chargerMeteo() {
    const c = stock.lire("meteo", null);
    if (c && c.d) etat.meteo = c.d;
    if ((c && Date.now() - c.t < 3 * 3600 * 1000) || !navigator.onLine || !/^https?:$/.test(location.protocol)) return;
    fetch(METEO_URL, { referrerPolicy: "no-referrer" })
      .then((rep) => (rep.ok ? rep.json() : Promise.reject(rep.status)))
      .then((j) => {
        const d = { jours: j.daily.time, min: j.daily.temperature_2m_min, max: j.daily.temperature_2m_max, pluie: j.daily.precipitation_sum };
        stock.ecrire("meteo", { t: Date.now(), d: d });
        etat.meteo = d;
        if (vueCourante().vue === "accueil") rafraichir();
      })
      .catch(() => { /* pas de météo : les autres infos restent */ });
  }

  function infosDuMoment(maintenant) {
    const infos = [];
    const meteo = infoMeteo(maintenant);
    if (meteo) infos.push(meteo);
    (D.infos || []).filter((x) => dansPeriode(x, maintenant)).forEach((x) => {
      infos.push({ type: x.type || "info", icone: x.type === "alerte" ? "i-alerte" : "i-info", texte: x.texte[etat.langue] || x.texte.fr, lien: x.lien });
    });

    // Les lieux : le plus proche d'abord si la position est connue
    const proche = (a, b) => (etat.position && aCoord(a.l) && aCoord(b.l) ? distanceM(etat.position, a.l) - distanceM(etat.position, b.l) : 0);
    const candidats = (filtre) => D.lieux.filter(filtre).map((l) => ({ l: l, mo: momentLieu(l, maintenant) })).filter((x) => x.mo);
    const ouvertDabord = (liste) => liste.filter((x) => x.mo.ouvert).sort(proche)[0];
    const bientot = (liste, max) => liste.filter((x) => !x.mo.ouvert && x.mo.dans <= max).sort((a, b) => a.mo.dans - b.mo.dans)[0];
    const lieuInfo = (cat, cle, x, h) => ({ type: "lieu", icone: categorie(cat).icone, c: categorie(cat).couleur, texte: t(cle, { nom: x.l.nom, h: formatHeure(h) }), lien: "#lieu-" + x.l.id });

    const dormir = candidats((l) => dansCat(l, "dormir"));
    const dOuvert = ouvertDabord(dormir);
    const dSoir = bientot(dormir, 600);
    if (dOuvert) infos.push(lieuInfo("dormir", "im_dormirOuvert", dOuvert, dOuvert.mo.fin));
    else if (dSoir) infos.push(lieuInfo("dormir", "im_dormirSoir", dSoir, dSoir.mo.debut));

    const manger = candidats((l) => dansCat(l, "manger"));
    const mOuvert = ouvertDabord(manger);
    const mBientot = bientot(manger, 180);
    if (mOuvert) infos.push(lieuInfo("manger", "im_mangerOuvert", mOuvert, mOuvert.mo.fin));
    else if (mBientot) infos.push(lieuInfo("manger", "im_mangerBientot", mBientot, mBientot.mo.debut));

    const laver = D.lieux.filter((l) => dansCat(l, "hygiene") && statut(l, maintenant).ouvert === true).length;
    if (laver) infos.push({ type: "lieu", icone: categorie("hygiene").icone, c: categorie("hygiene").couleur, texte: t(laver === 1 ? "im_laver1" : "im_laver", { n: laver }), lien: "#cat-hygiene" });

    const femmes = ouvertDabord(candidats((l) => { const f = pourFemmes(l); return f && f.niveau !== "specialise"; }));
    if (femmes) infos.push({ type: "femmes", icone: "i-coeur", texte: t("im_femmes", { nom: femmes.l.nom, h: formatHeure(femmes.mo.fin) }), lien: "#lieu-" + femmes.l.id });
    return infos;
  }

  function htmlInfosMoment(maintenant) {
    const infos = infosDuMoment(maintenant);
    if (!infos.length) return "";
    const n = infos.length;
    const cartes = infos.map((x, i) => {
      const contenu = '<span class="im-ic"' + (x.c ? ' style="--c:' + x.c + '"' : "") + ">" + icone(x.icone) + "</span><span class=\"im-txt\">" + esc(x.texte) + "</span>" + (x.lien ? icone("i-chevron", "chevron") : "");
      const attrs = ' class="im-carte im--' + x.type + '" role="group" aria-roledescription="info" aria-label="' + esc(t("im_numero", { i: i + 1, n: n })) + '"';
      return x.lien ? "<a" + attrs + ' href="' + esc(x.lien) + '">' + contenu + "</a>" : "<div" + attrs + ">" + contenu + "</div>";
    }).join("");
    return (
      '<section class="infos-moment" aria-roledescription="carrousel" aria-label="' + esc(t("im_titre")) + '">' +
      '<div class="im-piste">' + cartes + "</div>" +
      (n > 1
        ? '<div class="im-ctrl">' +
          infos.map((x, i) => '<button type="button" class="im-point" data-action="im-aller" data-i="' + i + '" aria-label="' + esc(t("im_numero", { i: i + 1, n: n })) + '"></button>').join("") +
          "</div>"
        : "") +
      "</section>"
    );
  }

  // Défilement : toutes les 6 s, en pause quand on touche, survole ou lit l'info, ou si l'on préfère moins d'animations
  const im = { minuterie: null, index: 0, retenue: false };
  function demarrerDefilement() {
    clearInterval(im.minuterie);
    const boite = document.querySelector("#vue .infos-moment");
    if (!boite) return;
    const piste = boite.querySelector(".im-piste");
    const n = piste.children.length;
    const doux = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const sens = getComputedStyle(piste).direction === "rtl" ? -1 : 1;
    const courant = () => Math.round(Math.abs(piste.scrollLeft) / Math.max(1, piste.clientWidth));
    const marquer = () => {
      im.index = courant();
      boite.querySelectorAll(".im-point").forEach((b, k) => b.setAttribute("aria-current", String(k === im.index)));
    };
    im.aller = (i, anime) => {
      piste.scrollTo({ left: sens * i * piste.clientWidth, behavior: anime && doux ? "smooth" : "auto" });
      im.index = i;
      boite.querySelectorAll(".im-point").forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
    };
    // Après un rafraîchissement de l'accueil, reprendre là où l'on en était
    im.aller(Math.min(im.index, n - 1), false);
    let attente = null;
    piste.addEventListener("scroll", () => { clearTimeout(attente); attente = setTimeout(marquer, 100); }, { passive: true });
    const retenir = (oui) => () => { im.retenue = oui; };
    boite.addEventListener("pointerenter", retenir(true));
    boite.addEventListener("pointerleave", retenir(false));
    boite.addEventListener("focusin", retenir(true));
    boite.addEventListener("focusout", retenir(false));
    piste.addEventListener("touchstart", retenir(true), { passive: true });
    piste.addEventListener("touchend", () => setTimeout(retenir(false), 4000), { passive: true });
    if (n < 2 || !doux) return;
    im.minuterie = setInterval(() => {
      if (im.retenue || document.hidden || !document.body.contains(piste)) return;
      im.aller((courant() + 1) % n, true);
    }, DEFILEMENT_MS);
  }

  // « Pour les femmes » : les lieux réservés, les créneaux, la santé et les droits, les protections périodiques
  function vuePourVous(ancre) {
    const groupes = ["reserve", "creneau", "specialise"].map((niveau) => {
      const lieux = D.lieux.filter((l) => { const f = pourFemmes(l); return f && f.niveau === niveau; });
      return lieux.length
        ? '<section class="section" id="pv-' + niveau + '"><h2>' + esc(t("pv_" + niveau)) + "</h2>" + htmlListe(preparer(lieux), true, true) + "</section>"
        : "";
    }).join("");
    const protections = D.lieux.filter((l) => l.protections);
    const nb = (niveau) => D.lieux.filter((l) => { const f = pourFemmes(l); return f && f.niveau === niveau; }).length;
    const sommaire = ["reserve", "creneau", "specialise"].filter((x) => nb(x))
      .map((x) => '<a class="puce" href="#pourvous-' + x + '">' + esc(t("pvCourt_" + x)) + " (" + nb(x) + ")</a>").join("") +
      '<a class="puce" href="#pourvous-protections">' + esc(t("pvCourt_protections")) + "</a>";
    return (
      htmlRetour() +
      '<header class="tete tete--femmes"><span class="pastille pastille--grande">' + icone("i-coeur") + "</span>" +
      "<div><h1>" + esc(t("pvTitre")) + '</h1><p class="sous-titre">' + esc(t("pvSous")) + "</p></div></header>" +
      '<nav class="sommaire-femmes" aria-label="' + esc(t("pvTitre")) + '">' + sommaire + "</nav>" +
      htmlOutils() +
      groupes +
      '<section class="section" id="pv-protections"><h2>' + esc(t("pv_protections")) + "</h2>" +
      "<p>" + esc(t(protections.length ? "pvProtectionsIntro" : "pvProtectionsVide")) + "</p>" +
      (protections.length ? htmlListe(preparer(protections), true, false) : "") +
      "</section>"
    );
  }

  function vueCategorie(id) {
    const c = categorie(id);
    if (!c) return vueAccueil();
    const rappel = (id === "dormir" || id === "ecoute")
      ? '<p class="rappel">' + icone("i-tel") + esc(t("rappel_" + id)) + "</p>"
      : "";
    return (
      htmlRetour() +
      '<header class="tete" style="--c:' + c.couleur + '">' +
      '<span class="pastille pastille--grande">' + icone(c.icone) + "</span>" +
      "<div><h1>" + esc(t("cat_" + id)) + '</h1><p class="sous-titre">' + esc(t("catd_" + id)) + "</p></div>" +
      "</header>" +
      rappel +
      (id === "hygiene" ? '<a class="lien-fleche lien-eq" href="#carte-toilettes">' + icone("i-wc") + esc(t("eq_voirCarte")) + icone("i-chevron", "chevron") + "</a>" : "") +
      htmlOutils({ ouvert: true, filtres: true }) +
      '<div id="resultats">' + htmlListe(preparer(D.lieux.filter((l) => dansCat(l, id))), false) + "</div>"
    );
  }

  function vueProche() {
    if (!etat.gpsDemande && !(etat.position && etat.position.source === "gps")) {
      // Demander la position une seule fois, au moment où la personne en a besoin
      setTimeout(demanderPosition, 0);
    }
    return (
      htmlRetour() +
      '<header class="tete tete--proche"><span class="pastille pastille--grande">' + icone("i-horloge") + "</span>" +
      "<div><h1>" + esc(t("procheTitre")) + '</h1><p class="sous-titre">' + esc(t("procheSous")) + "</p></div></header>" +
      htmlOutils({ filtres: true }) +
      '<div id="resultats">' + htmlListe(preparer(D.lieux, true), true) + "</div>"
    );
  }

  function vueLieu(id) {
    const l = lieu(id);
    if (!l) return htmlRetour() + '<p class="vide">' + esc(t("introuvable")) + "</p>";
    const cat = categorie(l.cat);
    const s = statut(l, new Date());
    const fav = etat.favoris.indexOf(l.id) !== -1;
    const aujourdhui = JOURS[new Date().getDay()];
    const peutLire = "speechSynthesis" in window;

    let horaires;
    if (l.horaires === "24/7") horaires = "<p>" + esc(t("h24")) + "</p>";
    else if (!l.horaires) {
      horaires = "<p>" + esc(t("horairesInconnus")) + "</p>" +
        (l.horairesTexte ? '<p class="aide">' + esc(t("horairesSource")) + " : " + esc(l.horairesTexte) + "</p>" : "");
    }
    else {
      horaires = '<table class="horaires"><tbody>' + SEMAINE.map((j) =>
        "<tr" + (j === aujourdhui ? ' class="auj"' : "") + '><th scope="row">' + esc(t("jours")[j]) +
        (j === aujourdhui ? " <small>" + esc(t("aujourdhui")) + "</small>" : "") +
        "</th><td>" + (plages(l, j).length ? plages(l, j).map((x) => esc(formatHeure(x[0]) + " – " + formatHeure(x[1]))).join("<br>") : esc(t("ferme"))) + "</td></tr>"
      ).join("") + "</tbody></table>";
    }

    const actions = [];
    const principales = [];
    if (!l.adresseMasquee && (l.adresse || aCoord(l))) {
      // Guidage pas à pas dans l'appli, même sans internet (voir « Guidage à pied »)
      principales.push('<a class="action action--principale" href="#guide-' + l.id + '">' + icone("i-itineraire") + "<span>" + esc(t("itineraire")) + "</span></a>");
    }
    if (l.tel) principales.push('<a class="action action--principale action--appel" href="' + telLien(l.tel) + '">' + icone("i-tel") + "<span>" + esc(t("appeler")) + "</span></a>");
    actions.push('<button type="button" class="action" data-action="partager" data-id="' + l.id + '">' + icone("i-partager") + "<span>" + esc(t("partager")) + "</span></button>");
    actions.push('<button type="button" class="action" data-action="garder" data-id="' + l.id + '" aria-pressed="' + fav + '">' + icone(fav ? "i-etoile-pleine" : "i-etoile") + "<span>" + esc(fav ? t("garde") : t("garder")) + "</span></button>");
    if (peutLire) actions.push('<button type="button" class="action" data-action="ecouter" data-id="' + l.id + '" aria-pressed="false">' + icone("i-son") + "<span>" + esc(t("ecouter")) + "</span></button>");

    const criteres = CRITERES.filter((c) => l.criteres && l.criteres[c]);
    const femmes = pourFemmes(l);
    const langues = (l.langues || []).map((c) => t("nomsLangues")[c] || c);

    return (
      htmlRetour() +
      '<article class="fiche-lieu" style="--c:' + cat.couleur + '">' +
      '<p class="badge-fictif">' + esc(t("fictif")) + "</p>" +
      '<header class="tete">' +
      '<span class="pastille pastille--grande">' + icone(cat.icone) + "</span>" +
      '<div><p class="lieu-cat">' + esc(t("cat_" + l.cat)) + "</p><h1>" + esc(l.nom) + "</h1>" +
      '<p class="statut statut--' + s.classe + '">' + esc(s.texte) + "</p></div>" +
      "</header>" +
      (fermeEnCeMoment(l) && l.fermeTemp.texte ? '<p class="note-equipe note-equipe--ferme">' + icone("i-alerte") + '<span lang="fr">' + esc(l.fermeTemp.texte) + "</span></p>" : "") +
      (l.noteEquipe ? '<p class="note-equipe">' + icone("i-info") + '<span><strong>' + esc(t("noteEquipe")) + '</strong> <span lang="fr">' + esc(l.noteEquipe) + "</span></span></p>" : "") +
      '<div class="adresse">' +
      (l.adresseMasquee
        ? '<p class="adresse-masquee">' + icone("i-bouclier") + esc(t("adresseMasquee")) + "</p>" +
          (l.acces && lieu(l.acces) ? '<p class="acces-lien">' + esc(t("ouDemander")) + ' <a href="#lieu-' + l.acces + '">' + esc(lieu(l.acces).nom) + "</a></p>" : "")
        : !l.adresse
        ? '<p class="adresse-masquee">' + icone("i-tel") + esc(t("sansAdresse")) + "</p>"
        : '<p class="adresse-txt"><span dir="ltr">' + esc(l.adresse) + "</span></p>" +
          '<button type="button" class="btn btn--doux btn--mini" data-action="copier" data-texte="' + esc(l.adresse) + '">' + icone("i-copier") + esc(t("copier")) + "</button>") +
      (etat.position && aCoord(l) ? '<p class="lieu-meta">' + icone("i-pied") + esc(formatDistance(distanceM(etat.position, l))) + "</p>" : "") +
      (l.tel ? '<p class="tel-txt">' + icone("i-tel") + '<a dir="ltr" href="' + telLien(l.tel) + '">' + esc(l.tel) + "</a></p>" : "") +
      "</div>" +
      (principales.length ? '<div class="actions actions--principales">' + principales.join("") + "</div>" : "") +
      '<div class="actions">' + actions.join("") + "</div>" +
      (femmes && femmes.texte ? '<section class="encart-femmes"><h2>' + icone("i-coeur") + esc(t("encartFemmes")) + "</h2>" + badgeFemmes(l) + "<p>" + esc(femmes.texte) + "</p></section>" : "") +
      '<section class="section"><h2>' + esc(t("horaires")) + "</h2>" + horaires + "</section>" +
      '<section class="section"><h2>' + esc(t("surPlace")) + '</h2><ul class="puces-txt">' + l.services.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></section>" +
      '<section class="section"><h2>' + esc(t("conditions")) + "</h2><p>" + esc(l.conditions) + "</p></section>" +
      (criteres.length ? '<section class="section"><h2>' + esc(t("bonASavoir")) + '</h2><ul class="criteres">' + criteres.map((c) => "<li>" + icone("i-check") + esc(t("f_" + c)) + "</li>").join("") + "</ul></section>" : "") +
      (langues.length ? '<section class="section"><h2>' + esc(t("languesParlees")) + "</h2><p>" + esc(langues.join(", ")) + "</p></section>" : "") +
      htmlAvis(l) +
      '<div class="verifie"><p>' + icone("i-info") + esc(t("verifie", { date: formatDate(l.verifie) })) + "</p>" +
      "<p>" + esc(t("appelerAvant")) + "</p>" +
      (l.sources && l.sources.length
        ? '<p class="sources">' + esc(t("sources")) + " : " + l.sources.map((u) => '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(hote(u)) + "</a>").join(", ") + "</p>"
        : "") +
      "</div>" +
      '<details class="signaler"><summary>' + icone("i-drapeau") + esc(t("signaler")) + "</summary>" +
      htmlFormSignaler(l.id, ["ferme", "horaires", "adresse", "accueil", "autre"]) + "</details>" +
      "</article>"
    );
  }

  /* Formulaire « Signaler » : sur chaque fiche (lieu) ou pour toute l'appli (lieu vide) */
  function htmlFormSignaler(lieu, raisons) {
    return (
      '<form class="form-signaler" data-lieu="' + esc(lieu) + '"><fieldset><legend>' + esc(t("signalerQuoi")) + "</legend>" +
      raisons.map((r, i) => '<label><input type="radio" name="raison" value="' + r + '"' + (i === 0 ? " required" : "") + "> " + esc(t("sig_" + r)) + "</label>").join("") +
      '<label class="champ-message"><span>' + esc(t("signalerPrecisez")) + '</span><textarea name="message" rows="3" maxlength="500"></textarea></label>' +
      '<p class="aide">' + esc(t("signalerAnonyme")) + "</p>" +
      // Champ piège invisible : seuls les robots le remplissent
      '<input type="text" name="site" class="piege" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '</fieldset><button type="submit" class="btn">' + esc(t("envoyer")) + "</button>" +
      '<p class="merci" role="status" hidden></p></form>'
    );
  }

  function vueSignaler() {
    return (
      htmlRetour() +
      "<h1>" + esc(t("signalerProbleme")) + "</h1>" +
      '<p class="sous-titre">' + esc(t("signalerIntro")) + "</p>" +
      '<div class="signaler signaler--page">' + htmlFormSignaler("", ["manque", "bug", "traduction", "autre"]) + "</div>"
    );
  }

  function vueUrgences() {
    return (
      htmlRetour() +
      '<header class="tete tete--urg"><span class="pastille pastille--grande">' + icone("i-tel") + "</span>" +
      "<div><h1>" + esc(t("urgTitre")) + '</h1><p class="sous-titre">' + esc(t("urgIntro")) + "</p></div></header>" +
      '<a class="btn btn--danger btn--aide" href="#aide">' + icone("i-bouclier") + esc(t("aideBouton")) + "</a>" +
      '<ul class="liste-urg">' +
      D.urgences.map((u) =>
        '<li class="urg' + (u.couleur === "urgent" ? " urg--fort" : "") + '">' +
        '<a class="urg-num" dir="ltr" href="' + telLien(u.num) + '">' + u.num + "</a>" +
        '<div class="urg-corps"><p>' + esc(t("urg_" + u.id)) + "</p>" +
        '<div class="urg-actions"><a class="btn btn--mini" href="' + telLien(u.num) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" +
        (u.sms ? '<a class="btn btn--mini" href="sms:' + u.num + '">' + icone("i-sms") + esc(t("envoyerSms")) + "</a>" : "") +
        "</div></div></li>"
      ).join("") +
      "</ul>" +
      '<p class="rappel">' + icone("i-info") + esc(t("urgEnLigne")) + "</p>"
    );
  }

  // Infos pratiques : chaque fiche montre son pictogramme, son titre et l'essentiel en une ligne ;
  // en l'ouvrant, les conseils et les actions utiles (appeler, voir les lieux)
  const FICHES = {
    "115": { ic: "i-lit", tel: ["115"] },
    proteger: { ic: "i-bouclier", tel: ["3919", "17"], sms: "114" },
    sante: { ic: "i-croix", cat: "sante" },
    regles: { ic: "i-goutte", cat: "hygiene" },
    adresse: { ic: "i-papier", cat: "droits" },
    papiers: { ic: "i-sac", cat: "bagagerie", lien: "https://www.reconnect.fr", lienTxt: "reconnectLien" },
    securite: { ic: "i-sortie", aide: true }
  };

  function vueInfos(ouvrir) {
    const peutLire = "speechSynthesis" in window;
    const actions = (f) => {
      const x = FICHES[f.id] || {};
      const liens = (x.tel || []).map((n) => '<a class="btn btn--appel" href="' + telLien(n) + '">' + icone("i-tel") + esc(t("appeler")) + ' <span dir="ltr">' + n + "</span></a>")
        .concat(x.sms ? ['<a class="btn btn--doux" href="sms:' + x.sms + '">' + icone("i-sms") + esc(t("envoyerSms")) + ' <span dir="ltr">' + x.sms + "</span></a>"] : [])
        .concat(x.cat ? ['<a class="btn btn--doux" href="#cat-' + x.cat + '">' + icone(categorie(x.cat).icone) + esc(t("cat_" + x.cat)) + "</a>"] : [])
        .concat(x.lien ? ['<a class="btn btn--doux" href="' + esc(x.lien) + '" target="_blank" rel="noopener noreferrer">' + icone("i-papier") + esc(t(x.lienTxt)) + "</a>"] : []);
      if (x.aide) liens.push('<a class="btn btn--danger" href="#aide">' + icone("i-bouclier") + esc(t("aideBouton")) + "</a>");
      return liens.length ? '<div class="fiche-actions">' + liens.join("") + "</div>" : "";
    };
    return (
      htmlRetour() +
      "<h1>" + esc(t("infosTitre")) + "</h1>" +
      '<div class="fiches">' +
      t("fiches").map((f) =>
        '<details class="fiche" id="fiche-' + f.id + '"' + (f.id === ouvrir ? " open" : "") + ">" +
        '<summary><span class="pastille">' + icone((FICHES[f.id] || {}).ic || "i-info") + "</span>" +
        '<span class="fiche-tete"><span class="fiche-titre">' + esc(f.titre) + '</span><span class="fiche-resume">' + esc(f.points[0]) + "</span></span>" +
        icone("i-chevron", "chevron") + "</summary>" +
        '<ul class="fiche-points">' + f.points.slice(1).map((p) => "<li>" + esc(p) + "</li>").join("") + "</ul>" +
        actions(f) +
        (peutLire ? '<button type="button" class="btn btn--doux btn--mini" data-action="ecouter-fiche" data-id="' + f.id + '" aria-pressed="false">' + icone("i-son") + "<span>" + esc(t("ecouter")) + "</span></button>" : "") +
        "</details>"
      ).join("") +
      "</div>" +
      '<nav class="liens-bas" aria-label="' + esc(t("plus")) + '">' +
      '<a href="#reglages">' + icone("i-installer") + esc(t("installerCourt")) + "</a>" +
      '<a href="#signaler">' + icone("i-drapeau") + esc(t("signalerProbleme")) + "</a>" +
      '<a href="#apropos">' + icone("i-info") + esc(t("apropos")) + "</a>" +
      "</nav>"
    );
  }

  function vueFavoris() {
    const liste = D.lieux.filter((l) => etat.favoris.indexOf(l.id) !== -1);
    return (
      htmlRetour() +
      '<header class="tete tete--favoris"><span class="pastille pastille--grande">' + icone("i-etoile") + "</span>" +
      "<div><h1>" + esc(t("favorisTitre")) + "</h1></div></header>" +
      (liste.length ? htmlListe(preparer(liste), true) : '<p class="vide">' + esc(t("favorisVide")) + "</p>")
    );
  }

  function estIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  // Dans l'aperçu (page intégrée dans une autre), l'installation et le QR code n'ont pas de sens
  function dansUnCadre() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function htmlInstallation() {
    if (estInstallee()) return '<p class="ok">' + icone("i-check") + esc(t("installee")) + "</p>";
    if (etat.installation) {
      return '<button type="button" class="btn" data-action="installer">' + icone("i-installer") + esc(t("installer")) + "</button>";
    }
    return "<p>" + esc(estIOS() ? t("installerIOS") : t("installerAutre")) + "</p>";
  }

  // Bandeau sur l'accueil : seulement quand l'installation est possible et pas refusée
  function htmlBandeauInstallation() {
    if (estInstallee() || dansUnCadre() || stock.lire("installMasque", false)) return "";
    if (!etat.installation && !estIOS()) return "";
    return (
      '<section class="installer-bandeau" aria-labelledby="h-installer">' +
      '<strong id="h-installer">' + icone("i-installer") + esc(t("installerTitre")) + "</strong>" +
      "<p>" + esc(t("installerBandeau")) + "</p>" +
      (etat.installation ? "" : "<p>" + esc(t("installerIOS")) + "</p>") +
      '<div class="installer-actions">' +
      (etat.installation ? '<button type="button" class="btn" data-action="installer">' + icone("i-installer") + esc(t("installerCourt")) + "</button>" : "") +
      '<button type="button" class="btn btn--doux" data-action="installer-plus-tard">' + esc(t("installerPlusTard")) + "</button>" +
      "</div></section>"
    );
  }

  function urlSite() {
    return location.href.split("#")[0].split("?")[0].replace(/index\.html$/, "");
  }

  // QR code pour passer de l'ordinateur au téléphone
  function htmlOuvrirTelephone() {
    if (dansUnCadre() || !/^https?:$/.test(location.protocol)) return "";
    return (
      '<section class="section"><h2>' + esc(t("ouvrirTelephone")) + "</h2>" +
      '<div class="qr-telephone"><div class="qr" id="qr-site" aria-hidden="true"></div>' +
      "<p>" + esc(t("ouvrirTelephoneAide")) + '<br><span class="lien-site">' + esc(urlSite()) + "</span></p></div></section>"
    );
  }

  function dessinerQrSite() {
    const zone = document.getElementById("qr-site");
    if (!zone) return;
    const dessiner = () => {
      const qr = window.qrcode(0, "M");
      qr.addData(urlSite());
      qr.make();
      zone.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    };
    if (window.qrcode) return dessiner();
    const sc = document.createElement("script");
    sc.src = "vendor/qrcode/qrcode.js";
    sc.onload = dessiner;
    document.head.appendChild(sc);
  }

  function vueReglages() {
    const choix = (action, valeur, actif, libelle, attrs) =>
      '<button type="button" class="puce" data-action="' + action + '" data-valeur="' + valeur + '" aria-pressed="' + actif + '"' + (attrs || "") + ">" + libelle + "</button>";
    return (
      htmlRetour() +
      "<h1>" + esc(t("reglages")) + "</h1>" +
      '<section class="section"><h2>' + esc(t("langue")) + '</h2><div class="choix">' +
      LANGUES.map((l) => choix("langue", l, etat.langue === l, esc(TR[l].nomLangue), ' lang="' + l + '"')).join("") +
      "</div></section>" +
      '<section class="section"><h2>' + esc(t("tailleTexte")) + '</h2><div class="choix">' +
      [0, 1, 2].map((n) => choix("taille", n, etat.taille === n, '<span class="taille-' + n + '">A' + "+".repeat(n) + "</span>")).join("") +
      "</div></section>" +
      '<section class="section" id="installer"><h2>' + esc(t("installer")) + '</h2><p class="aide">' + esc(t("installerAide")) + "</p>" + htmlInstallation() + "</section>" +
      htmlOuvrirTelephone() +
      '<section class="section"><h2>' + esc(t("effacer")) + '</h2><p class="aide">' + esc(t("effacerAide")) + "</p>" +
      '<div class="effacer"><button type="button" class="btn btn--doux" data-action="effacer">' + esc(t("effacerBouton")) + "</button>" +
      '<div class="effacer-confirmer" hidden><button type="button" class="btn btn--danger" data-action="effacer-oui">' + esc(t("confirmerEffacer")) + '</button><button type="button" class="btn btn--doux" data-action="effacer-non">' + esc(t("annuler")) + "</button></div>" +
      '<p class="ok" role="status" hidden>' + icone("i-check") + esc(t("effacerOk")) + "</p></div></section>" +
      '<nav class="liens-bas" aria-label="' + esc(t("plus")) + '">' +
      '<a href="#infos-securite">' + icone("i-bouclier") + esc(t("securite")) + "</a>" +
      '<a href="#signaler">' + icone("i-drapeau") + esc(t("signalerProbleme")) + "</a>" +
      '<a href="#apropos">' + icone("i-info") + esc(t("apropos")) + "</a>" +
      "</nav>"
    );
  }

  /* Page pour l'équipe projet : volontairement en français. */
  const IDEES = [
    ["Bouton « Quitter » toujours visible", "Un appui ouvre la météo à la place de l'appli (ou Échap deux fois sur ordinateur). Pensé pour les femmes dont le téléphone est surveillé."],
    ["Rien d'alarmant dans l'historique", "Le titre de l'onglet reste « Paladines » et les adresses de pages sont neutres (#cat-ecoute et non « violences »)."],
    ["Adresses confidentielles", "Les centres pour femmes victimes de violences n'apparaissent pas sur la carte. Leur adresse est donnée par téléphone."],
    ["QR codes qui savent où ils sont collés", "Chaque affiche contient sa position. Même si le GPS est refusé, la liste est triée depuis l'affiche. Voir la page « Créer une affiche »."],
    ["Affiche à languettes", "Le 115 et le 3919 sont imprimés sur des languettes à détacher, pour celles qui n'ont pas de smartphone ou plus de batterie."],
    ["Marche sans internet, s'installe sans store", "C'est une PWA : une fois ouverte, l'appli et les lieux gardés restent disponibles hors connexion."],
    ["Aucun compte, aucune donnée personnelle", "Pas d'inscription, pas de nom. La position reste sur le téléphone et n'est jamais enregistrée. Seuls partent les signalements, anonymes, et un compteur de visites par mois."],
    ["Pour celles qui lisent peu ou pas le français", "Pictogrammes partout, arabe (écriture de droite à gauche) et anglais, bouton « Écouter » qui lit la fiche à voix haute."],
    ["Lisible par toutes", "Police Atkinson Hyperlegible, conçue pour les personnes malvoyantes. Taille du texte réglable. Mode sombre qui économise la batterie."],
    ["Statut en direct", "« Ouvert · ferme à 18 h », « Ferme bientôt », « Fermé · ouvre demain à 9 h », y compris pour les haltes de nuit qui passent minuit."],
    ["Filtres pensés pour la rue", "Femmes uniquement, enfants acceptés, animaux acceptés, sans condition de papiers, sans rendez-vous, accessible en fauteuil."],
    ["Besoins souvent oubliés", "Protections périodiques, bagagerie pour ses affaires et ses papiers, recharge du téléphone, domiciliation postale."],
    ["Infos fiables", "Date de vérification sur chaque fiche et bouton « Signaler une erreur », dont « J'ai été mal accueillie »."],
    ["Le bon numéro au bon endroit", "Rappel du 115 dans « Dormir », du 17, du 3919 et du SMS au 114 dans « Violences »."],
    ["Alerte saisonnière", "Un bandeau pour le Plan Grand Froid ou la canicule, modifiable dans le fichier de données."],
    ["Entraide", "Envoyer un lieu à une amie par SMS, et garder ses lieux pour les retrouver sans internet."]
  ];

  function vueApropos() {
    return (
      htmlRetour() +
      '<article class="apropos" lang="fr" dir="ltr">' +
      "<h1>À propos de ce prototype</h1>" +
      '<p class="apropos-pour"><strong>Paladines est faite pour les femmes à la rue à Lille</strong> : trouver vite un lieu sûr et ouvert, repérer les lieux réservés aux femmes, les créneaux rien que pour elles, la santé des femmes et l\'écoute en cas de violences.</p>' +
      "<p>Paladines est une première version, faite pour en discuter en groupe. Elle est centrée sur <strong>Lille</strong>. Les lieux sont de <strong>vrais lieux</strong>, relevés sur internet en octobre 2026 : ils doivent encore être confirmés par téléphone avec chaque structure avant un vrai lancement. Les numéros d'urgence sont nationaux.</p>" +
      "<h2>Le principe</h2>" +
      "<p>Une femme à la rue scanne un QR code (affiche, autocollant dans des toilettes, carte remise par une maraude). Elle arrive sur cette page, sans rien installer, et trouve tout de suite les lieux ouverts près d'elle pour dormir, manger, se laver, se soigner ou être aidée.</p>" +
      "<h2>Idées ajoutées</h2>" +
      '<ol class="idees">' + IDEES.map((x) => "<li><strong>" + esc(x[0]) + "</strong><span>" + esc(x[1]) + "</span></li>").join("") + "</ol>" +
      "<h2>Outils</h2>" +
      '<p><a class="btn" href="affiche.html">' + icone("i-qr") + "Créer une affiche avec QR code</a></p>" +
      '<p><a class="btn" href="/equipe" target="_blank" rel="noopener">' + icone("i-drapeau") + "Signalements et statistiques</a></p>" +
      "<p>Réservé à l'équipe : le mot de passe est demandé. Adresse directe : <code>paladines.pages.dev/equipe</code></p>" +
      "<p>Les questions à trancher, les sources de données possibles et la feuille de route sont dans <code>docs/IDEES.md</code>. La liste des lieux de Lille, leurs sources et ce qui reste à vérifier par téléphone sont dans <code>docs/LIEUX-LILLE.md</code>.</p>" +
      "</article>"
    );
  }

  /* ---------- Carte (Leaflet) ---------- */
  function afficherCarte() {
    document.getElementById("vue").hidden = true;
    const zone = document.getElementById("vue-carte");
    zone.hidden = false;
    const msg = zone.querySelector(".carte-msg");
    if (!window.L) {
      msg.textContent = t("carteIndispo");
      msg.hidden = false;
      return;
    }
    if (!etat.carte) creerCarte();
    rendreBarreCarte();
    majMarqueurs();
    majMoiSurCarte(false);
    majMsgCarte();
    setTimeout(() => {
      etat.carte.invalidateSize();
      cadrerCarte();
    }, 0);
  }

  function creerCarte() {
    const ref = etat.position || D.ville;
    const carte = L.map("carte", { zoomControl: false }).setView([ref.lat, ref.lng], D.ville.zoom);
    L.control.zoom({ position: "bottomright" }).addTo(carte);
    carte.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    ajouterFond(carte);
    carte.on("click", fermerFicheCarte);
    // Pendant le guidage, déplacer la carte arrête de suivre la marche (bouton pour recentrer)
    carte.on("dragstart", () => {
      if (!etat.guide) return;
      etat.guide.suivre = false;
      rendreGuide();
    });
    etat.carte = carte;
    etat.coucheLieux = L.layerGroup().addTo(carte);
    etat.coucheEq = L.layerGroup().addTo(carte);
  }

  /* Fond de carte : OpenFreeMap « Positron » (gratuit, sans clé ni limite, données OpenStreetMap).
   * Carte vectorielle nette et sobre, dessinée par MapLibre, chargé seulement à l'ouverture de la
   * carte (800 Ko). Sans WebGL, sans internet ou si OpenFreeMap ne répond pas : tuiles
   * OpenStreetMap à la place. (CARTO, Stadia… demandent une clé.) */
  const STYLE_CARTE = "https://tiles.openfreemap.org/styles/positron";
  const ATTRIB_OSM = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  let promesseMaplibre = null;

  function chargerScript(src) {
    return new Promise((ok, ko) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = ko;
      document.head.appendChild(s);
    });
  }

  function chargerMaplibre() {
    if (!promesseMaplibre) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "vendor/maplibre/maplibre-gl.css";
      document.head.appendChild(css);
      promesseMaplibre = chargerScript("vendor/maplibre/maplibre-gl.js").then(() => chargerScript("vendor/maplibre/leaflet-maplibre-gl.js"));
    }
    return promesseMaplibre;
  }

  function webglPossible() {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) {
      return false;
    }
  }

  // Deux erreurs de suite : message « fond indisponible » ; une réussite l'efface
  function suiviErreurs() {
    let erreurs = 0;
    return {
      erreur() {
        erreurs++;
        if (erreurs >= 2 && !etat.fondEnErreur) {
          etat.fondEnErreur = true;
          majMsgCarte();
        }
      },
      ok() {
        erreurs = 0;
        if (etat.fondEnErreur) {
          etat.fondEnErreur = false;
          majMsgCarte();
        }
      }
    };
  }

  function ajouterFond(carte) {
    if (!webglPossible()) return fondTuiles(carte);
    chargerMaplibre()
      .then(() => {
        if (!L.maplibreGL) throw new Error("MapLibre absent");
        const couche = L.maplibreGL({
          style: STYLE_CARTE,
          // mention affichée par l'extension Leaflet (sinon elle reprend celle du style)
          attributionControl: { customAttribution: '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> ' + ATTRIB_OSM }
        }).addTo(carte);
        const gl = couche.getMaplibreMap();
        const suivi = suiviErreurs();
        let charge = false;
        let abandon = false;
        gl.on("load", () => {
          charge = true;
          suivi.ok();
        });
        gl.on("data", (e) => {
          if (e.tile) suivi.ok();
        });
        gl.on("error", () => {
          if (abandon) return;
          if (charge) return suivi.erreur();
          // le style n'a pas pu se charger : tuiles OpenStreetMap à la place
          abandon = true;
          carte.removeLayer(couche);
          fondTuiles(carte);
        });
      })
      .catch(() => fondTuiles(carte));
  }

  function fondTuiles(carte) {
    const fond = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      className: "fond-tuiles", // couleurs adoucies dans css/verre.css
      crossOrigin: "anonymous", // pour que le service worker puisse garder les tuiles hors ligne
      attribution: ATTRIB_OSM
    });
    const suivi = suiviErreurs();
    fond.on("tileerror", suivi.erreur);
    fond.on("tileload", suivi.ok);
    fond.addTo(carte);
  }

  // Au premier affichage : montrer tous les lieux (ou la personne si sa position est connue)
  function cadrerCarte() {
    if (etat.carteCadree || !etat.carte) return;
    if (etat.position) {
      etat.carte.setView([etat.position.lat, etat.position.lng], 15);
      etat.carteCadree = true;
      return;
    }
    const pts = D.lieux.filter(aCoord).map((l) => [l.lat, l.lng]);
    if (pts.length >= 2) {
      etat.carte.fitBounds(pts, { padding: [40, 40], maxZoom: 15 });
      etat.carteCadree = true;
    }
  }

  // Un seul message à la fois sur la carte, du plus utile au moins utile
  function majMsgCarte() {
    const msg = document.querySelector("#vue-carte .carte-msg");
    if (!msg) return;
    let txt = "";
    const sansPosition = D.lieux.filter((l) => !l.adresseMasquee && adresseGeo(l) && !aCoord(l)).length;
    if (!D.lieux.some(aCoord)) txt = t("carteSansPositions");
    else if (etat.fondEnErreur) txt = t(dansUnCadre() ? "fondApercu" : "fondIndispo");
    else if (sansPosition && !etat.msgPartielVu) txt = t("positionsPartielles", { n: sansPosition });
    msg.textContent = txt;
    msg.hidden = !txt;
  }

  function rendreBarreCarte() {
    const barre = document.getElementById("barre-carte");
    const cats = [{ id: "toutes" }].concat(D.categories);
    barre.innerHTML =
      '<button type="button" class="puce puce--ouvert" data-action="carte-ouvert" aria-pressed="' + etat.carteOuvert + '">' + esc(t("f_ouvert")) + "</button>" +
      '<button type="button" class="puce puce--femmes" data-action="carte-femmes" aria-pressed="' + !!etat.carteFemmes + '">' + icone("i-coeur") + esc(t("carteFemmes")) + "</button>" +
      [["t", "i-wc", "eq_puceToilettes"], ["e", "i-goutte", "eq_puceEau"], ["s", "i-bouclier", "eq_puceSurs"]].map((x) =>
        '<button type="button" class="puce puce--eq" data-action="carte-eq" data-valeur="' + x[0] + '" aria-pressed="' + etat.carteEq[x[0]] + '">' + icone(x[1]) + esc(t(x[2])) + "</button>"
      ).join("") +
      cats.map((c) =>
        '<button type="button" class="puce" data-action="carte-cat" data-valeur="' + c.id + '" aria-pressed="' + (etat.carteCat === c.id) + '"' +
        (c.couleur ? ' style="--c:' + c.couleur + '"' : "") + ">" +
        (c.icone ? icone(c.icone) : "") + esc(c.id === "toutes" ? t("carteToutes") : t("cat_" + c.id)) + "</button>"
      ).join("");
    document.getElementById("btn-localiser").setAttribute("aria-label", t("centrerSurMoi"));
    document.getElementById("btn-localiser").title = t("centrerSurMoi");
  }

  // Où montrer un lieu sur la carte : à sa position, ou, pour une adresse protégée, au lieu
  // public où l'on peut demander à y aller (jamais à sa vraie adresse)
  function pointCarte(l) {
    if (aCoord(l)) return { lat: l.lat, lng: l.lng, acces: null };
    const a = l.adresseMasquee && l.acces ? lieu(l.acces) : null;
    return a && aCoord(a) ? { lat: a.lat, lng: a.lng, acces: a } : null;
  }

  // Plusieurs lieux à la même adresse : leurs repères sont écartés en cercle pour rester tous visibles
  function ecarter(points) {
    const groupes = {};
    points.forEach((p) => {
      const cle = p.lat.toFixed(4) + "," + p.lng.toFixed(4);
      (groupes[cle] = groupes[cle] || []).push(p);
    });
    Object.keys(groupes).forEach((cle) => {
      const g = groupes[cle];
      if (g.length < 2) return;
      g.forEach((p, i) => {
        const angle = (2 * Math.PI * i) / g.length - Math.PI / 2;
        p.dx = Math.round(Math.cos(angle) * 22);
        p.dy = Math.round(Math.sin(angle) * 22);
      });
    });
  }

  function majMarqueurs() {
    if (!etat.coucheLieux) return;
    const maintenant = new Date();
    etat.coucheLieux.clearLayers();
    majMsgCarte();
    majTelCarte();
    cadrerCarte();
    const points = [];
    D.lieux
      .filter((l) => etat.guide || etat.carteCat === "toutes" || dansCat(l, etat.carteCat))
      .forEach((l) => {
        const pt = pointCarte(l);
        const s = statut(l, maintenant);
        if (!pt) return;
        // Pendant le guidage : seulement le lieu où l'on va
        if (etat.guide ? l.id !== etat.guide.id || pt.acces : (etat.carteOuvert && s.ouvert !== true) || (etat.carteFemmes && !pourFemmes(l))) return;
        points.push({ l: l, s: s, acces: pt.acces, lat: pt.lat, lng: pt.lng, dx: 0, dy: 0 });
      });
    ecarter(points);
    points.forEach((p) => {
      const cat = categorie(p.l.cat);
      const ic = L.divIcon({
        className: "marqueur-boite",
        html: '<span class="marqueur' + (p.s.ouvert === true ? "" : " marqueur--ferme") + (p.acces ? " marqueur--protege" : "") + (etat.ficheCarte === p.l.id ? " marqueur--choisi" : "") + '" data-id="' + p.l.id + '" style="--c:' + cat.couleur + '">' + icone(cat.icone) + "</span>",
        iconSize: [38, 38],
        iconAnchor: [19 - p.dx, 19 - p.dy]
      });
      L.marker([p.lat, p.lng], { icon: ic, title: p.l.nom, alt: p.l.nom, interactive: !etat.guide })
        .on("click", () => ouvrirFicheCarte(p.l, p.acces))
        .addTo(etat.coucheLieux);
    });
    majEquip();
  }

  // Les services sans adresse (115, équipe mobile…) se joignent de partout : un bouton sur la carte les rappelle
  function majTelCarte() {
    const btn = document.getElementById("btn-tel-carte");
    const boite = document.getElementById("carte-tel");
    if (!btn || !boite) return;
    const liste = D.lieux.filter((l) => !l.adresse && !l.adresseMasquee && l.tel && (etat.carteCat === "toutes" || dansCat(l, etat.carteCat)) && (!etat.carteFemmes || pourFemmes(l)));
    const ouvert = !!etat.telCarteOuvert && liste.length > 0;
    btn.hidden = !liste.length;
    btn.querySelector("span").textContent = t("parTelephone", { n: liste.length });
    btn.setAttribute("aria-expanded", String(ouvert));
    boite.hidden = !ouvert;
    boite.innerHTML =
      '<p class="carte-tel-titre">' + esc(t("parTelephoneTitre")) + "</p>" +
      liste.map((l) =>
        '<div class="carte-tel-ligne"><a class="carte-tel-nom" href="#lieu-' + l.id + '">' + esc(l.nom) + "</a>" +
        '<a class="btn btn--mini btn--appel" href="' + telLien(l.tel) + '">' + icone("i-tel") + '<span dir="ltr">' + esc(l.tel) + "</span></a></div>"
      ).join("");
  }

  function lienItineraire(l) {
    const destination = l.adresse ? encodeURIComponent(l.adresse) : l.lat + "," + l.lng;
    return "https://www.google.com/maps/dir/?api=1&destination=" + destination + "&travelmode=walking";
  }

  function majMoiSurCarte(centrer) {
    if (!etat.carte || !etat.position) return;
    const ll = [etat.position.lat, etat.position.lng];
    if (!etat.marqueurMoi) {
      etat.marqueurMoi = L.marker(ll, {
        icon: L.divIcon({ className: "marqueur-boite", html: '<span class="moi"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        title: t("vousEtesIci"),
        keyboard: false,
        zIndexOffset: 1000
      }).addTo(etat.carte).bindTooltip(t("vousEtesIci"));
    } else {
      etat.marqueurMoi.setLatLng(ll);
    }
    if (centrer && !document.getElementById("vue-carte").hidden) etat.carte.setView(ll, Math.max(etat.carte.getZoom(), 15));
  }

  /* ---------- Toilettes, eau potable, lieux sûrs (data/equipements.js, OpenStreetMap) ----------
   * Identifiants : « eqt3 » (toilettes n° 3), « eqe12 » (eau), « eqs0 » (lieu sûr). */
  const EQ = window.PALADINES_EQUIP || { t: [], e: [], s: [] };
  const TYPES_EQ = { t: "toilettes", e: "eau" };

  function equip(id) {
    const m = /^eq([tes])(\d+)$/.exec(id || "");
    if (!m) return null;
    const x = (EQ[m[1]] || [])[Number(m[2])];
    if (!x) return null;
    const type = m[1] === "s" ? x[2] : TYPES_EQ[m[1]];
    return {
      id: id,
      groupe: m[1],
      type: type,
      lat: x[0],
      lng: x[1],
      nom: (m[1] === "s" && x[3]) || t("eq_" + type),
      tel: m[1] === "s" ? x[4] || "" : "",
      payant: m[1] === "t" && /p/.test(x[2] || ""),
      fauteuil: m[1] === "t" && /f/.test(x[2] || "")
    };
  }

  const ICONE_EQ = { toilettes: "i-wc", eau: "i-goutte", police: "i-bouclier", urgences: "i-croix" };

  function listeEquip(groupe) {
    return (EQ[groupe] || []).map((_, i) => equip("eq" + groupe + i));
  }

  // Les lieux sûrs ouverts jour et nuit, du plus proche au plus loin
  function lieuxSursProches(n) {
    const liste = listeEquip("s");
    if (!etat.position) return liste.slice(0, n);
    return liste.map((x) => ({ x: x, d: distanceM(etat.position, x) })).sort((a, b) => a.d - b.d).slice(0, n).map((y) => y.x);
  }

  function majEquip() {
    if (!etat.coucheEq) return;
    etat.coucheEq.clearLayers();
    const montrer = [];
    if (etat.guide) {
      const x = equip(etat.guide.id);
      if (x) montrer.push(x);
    } else {
      Object.keys(etat.carteEq).forEach((g) => { if (etat.carteEq[g]) montrer.push(...listeEquip(g)); });
    }
    montrer.forEach((x) => {
      const ic = L.divIcon({
        className: "marqueur-boite",
        html: '<span class="marqueur-eq marqueur-eq--' + x.type + (etat.ficheCarte === x.id ? " marqueur--choisi" : "") + '" data-id="' + x.id + '">' + icone(ICONE_EQ[x.type]) + "</span>",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      L.marker([x.lat, x.lng], { icon: ic, title: x.nom, alt: x.nom, interactive: !etat.guide })
        .on("click", () => ouvrirFicheEquip(x))
        .addTo(etat.coucheEq);
    });
  }

  function ouvrirFicheEquip(x) {
    const boite = document.getElementById("carte-fiche");
    const details = [];
    if (x.groupe === "t") {
      details.push(t(x.payant ? "eq_payantes" : "eq_gratuites"));
      if (x.fauteuil) details.push(t("eq_fauteuil"));
    } else if (x.groupe === "e") details.push(t("eq_eauGratuite"));
    etat.ficheCarte = x.id;
    boite.style.removeProperty("--c");
    boite.innerHTML =
      '<div class="cf-tete"><span class="pastille">' + icone(ICONE_EQ[x.type]) + "</span>" +
      '<div class="cf-titre">' + (x.nom !== t("eq_" + x.type) ? '<p class="cf-cat">' + esc(t("eq_" + x.type)) + "</p>" : "") + '<h2 class="cf-nom">' + esc(x.nom) + "</h2></div>" +
      '<button type="button" class="cf-fermer" data-action="fermer-fiche-carte" aria-label="' + esc(t("fermer")) + '">' + SVG_FERMER + "</button></div>" +
      (x.type === "urgences" ? '<p class="statut statut--ouvert">' + esc(t("h24")) + "</p>" : "") +
      (details.length ? '<p class="lieu-meta">' + esc(details.join(" · ")) + "</p>" : "") +
      (etat.position ? '<p class="lieu-meta">' + icone("i-pied") + esc(formatDistance(distanceM(etat.position, x))) + "</p>" : "") +
      '<p class="cf-source">' + esc(t("eq_source")) + "</p>" +
      '<div class="cf-actions">' +
      '<a class="btn btn--itin" href="#guide-' + x.id + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a>" +
      (x.tel ? '<a class="btn btn--appel" href="' + telLien(x.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
      "</div>";
    boite.hidden = false;
    document.getElementById("vue-carte").classList.add("fiche-ouverte");
    etat.telCarteOuvert = false;
    majTelCarte();
    majMarqueurChoisi();
  }

  /* ---------- « Je ne me sens pas en sécurité » ---------- */
  function vueAide() {
    const surs = lieuxSursProches(3);
    const sms = "sms:114?&body=" + encodeURIComponent(t("aideSmsTexte"));
    return (
      htmlRetour() +
      '<header class="tete tete--urg"><span class="pastille pastille--grande">' + icone("i-bouclier") + "</span>" +
      "<div><h1>" + esc(t("aideTitre")) + '</h1><p class="sous-titre">' + esc(t("aideIntro")) + "</p></div></header>" +
      '<ol class="aide-etapes">' +
      '<li class="aide-etape"><h2>' + esc(t("aideDanger")) + "</h2>" +
      '<a class="btn btn--appel btn--grand" href="' + telLien("17") + '">' + icone("i-tel") + esc(t("aideAppeler17")) + "</a></li>" +
      '<li class="aide-etape"><h2>' + esc(t("aideParler")) + "</h2><p>" + esc(t("aideSmsExplique")) + "</p>" +
      '<a class="btn btn--grand" href="' + esc(sms) + '">' + icone("i-sms") + esc(t("aideSms114")) + "</a></li>" +
      '<li class="aide-etape"><h2>' + esc(t("aideLieuSur")) + "</h2><p>" + esc(t("aideLieuSurExplique")) + "</p>" +
      (surs.length
        ? '<ul class="aide-surs">' + surs.map((x) =>
            '<li><span class="pastille">' + icone(ICONE_EQ[x.type]) + '</span><span class="aide-sur-txt"><strong>' + esc(x.nom) + "</strong>" +
            "<small>" + esc(t("eq_" + x.type)) + (etat.position ? " · " + esc(formatDistance(distanceM(etat.position, x))) : "") + "</small></span>" +
            '<a class="btn btn--itin btn--mini" href="#guide-' + x.id + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a></li>"
          ).join("") + "</ul>"
        : "") +
      (etat.position ? "" : '<button type="button" class="btn btn--doux" data-action="proche-aide">' + icone("i-position") + esc(t("aidePlusProche")) + "</button>") +
      "</li>" +
      '<li class="aide-etape"><h2>' + esc(t("aideCommerce")) + "</h2><p>" + esc(t("aideCommerceExplique")) + "</p>" +
      '<a class="btn btn--appel" href="' + telLien("3237") + '">' + icone("i-tel") + esc(t("aidePharmacie")) + ' <span dir="ltr">3237</span></a></li>' +
      '<li class="aide-etape"><h2>' + esc(t("aideEcoute")) + "</h2><p>" + esc(t("urg_3919")) + "</p>" +
      '<a class="btn btn--appel" href="' + telLien("3919") + '">' + icone("i-tel") + esc(t("appeler")) + ' <span dir="ltr">3919</span></a></li>' +
      "</ol>" +
      '<p class="rappel">' + icone("i-sortie") + esc(t("aideQuitter")) + "</p>"
    );
  }

  /* ---------- Fiche d'un lieu sur la carte ----------
   * Toucher un repère ouvre une carte simple en bas de l'écran : nom, ouvert ou non,
   * distance, et trois boutons (Y aller, Appeler, Fiche). Toucher la carte la referme. */
  function ouvrirFicheCarte(l, acces) {
    const boite = document.getElementById("carte-fiche");
    const s = statut(l, new Date());
    const cat = categorie(l.cat);
    const ici = acces || l;
    const allerA = acces ? acces.id : l.id;
    etat.ficheCarte = l.id;
    boite.style.setProperty("--c", cat.couleur);
    boite.innerHTML =
      '<div class="cf-tete"><span class="pastille">' + icone(cat.icone) + "</span>" +
      '<div class="cf-titre"><p class="cf-cat">' + esc(t("cat_" + l.cat)) + '</p><h2 class="cf-nom">' + esc(l.nom) + "</h2></div>" +
      '<button type="button" class="cf-fermer" data-action="fermer-fiche-carte" aria-label="' + esc(t("fermer")) + '">' + SVG_FERMER + "</button></div>" +
      '<p class="statut statut--' + s.classe + '">' + esc(s.texte) + "</p>" +
      (etat.position ? '<p class="lieu-meta">' + icone("i-pied") + esc(formatDistance(distanceM(etat.position, ici))) + "</p>" : "") +
      badgeFemmes(l) +
      (acces ? '<p class="popup-protege">' + icone("i-bouclier") + esc(t("accesProtege", { lieu: acces.nom })) + "</p>" : "") +
      '<div class="cf-actions">' +
      '<a class="btn btn--itin" href="#guide-' + allerA + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a>" +
      (l.tel ? '<a class="btn btn--appel" href="' + telLien(l.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
      '<a class="btn btn--doux" href="#lieu-' + l.id + '">' + esc(t("voirFiche")) + "</a>" +
      "</div>";
    boite.hidden = false;
    document.getElementById("vue-carte").classList.add("fiche-ouverte");
    etat.telCarteOuvert = false;
    majTelCarte();
    majMarqueurChoisi();
  }

  function fermerFicheCarte() {
    const boite = document.getElementById("carte-fiche");
    if (!boite || boite.hidden) return;
    boite.hidden = true;
    etat.ficheCarte = null;
    document.getElementById("vue-carte").classList.remove("fiche-ouverte");
    majMarqueurChoisi();
  }

  function majMarqueurChoisi() {
    document.querySelectorAll(".marqueur--choisi").forEach((m) => m.classList.remove("marqueur--choisi"));
    if (!etat.ficheCarte) return;
    const m = document.querySelector('.carte [data-id="' + etat.ficheCarte + '"]');
    if (m) m.classList.add("marqueur--choisi");
  }

  const SVG_FERMER = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* ---------- Guidage à pied, comme une appli GPS, sans internet ----------
   * Le chemin est calculé sur le téléphone (js/chemins.js) avec le plan des rues de Lille
   * (data/chemins.json, gardé par le service worker). La position GPS reste sur le téléphone.
   * Voix coupée par défaut (discrétion) ; une petite vibration avant chaque virage. */
  let promessePlan = null;

  function chargerPlan() {
    if (!promessePlan) {
      promessePlan = fetch("data/chemins.json")
        .then((r) => {
          if (!r.ok) throw new Error("plan absent");
          return r.json();
        })
        .then((j) => window.PaladinesChemins.lire(j))
        .catch((e) => {
          promessePlan = null; // on réessaiera
          throw e;
        });
    }
    return promessePlan;
  }

  const FLECHES = {
    "tout-droit": '<path d="M12 21V4M5 11l7-7 7 7"/>',
    depart: '<path d="M12 21V4M5 11l7-7 7 7"/>',
    droite: '<path d="M6 21v-8a4 4 0 0 1 4-4h10M14 3l6 6-6 6"/>',
    gauche: '<path d="M18 21v-8a4 4 0 0 0-4-4H4M10 3L4 9l6 6"/>',
    "leg-droite": '<path d="M8 21v-7l9-9M10 5h7v7"/>',
    "leg-gauche": '<path d="M16 21v-7L7 5M14 5H7v7"/>',
    "demi-tour": '<path d="M16 21V9a5 5 0 0 0-10 0v6M2 11l4 4 4-4"/>',
    escalier: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
    traversee: '<path d="M5 3v18M19 3v18M9 6h6M9 12h6M9 18h6"/>',
    arrivee: '<path d="M6 22V3M6 4h12l-3 4.5L18 13H6"/>'
  };

  function fleche(type) {
    return '<svg class="guide-fleche" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + (FLECHES[type] || FLECHES["tout-droit"]) + "</svg>";
  }

  function vraiNom(nom) {
    return nom && nom.charAt(0) !== "#";
  }

  // Texte d'une consigne ; html : nom de rue isolé pour le sens de lecture (arabe)
  function consigne(e, html) {
    const rue = (n) => (html ? "<bdi>" + esc(n) + "</bdi>" : n);
    const txt = (cle, vars) => (html ? esc(t(cle, vars)) : t(cle, vars));
    if (e.type === "arrivee") return html ? esc(t("g_arrivee", { lieu: "\u0001" })).replace("\u0001", rue(etat.guide.nomLieu)) : t("g_arrivee", { lieu: etat.guide.nomLieu });
    if (e.type === "escalier" || e.type === "traversee") return txt("g_" + e.type);
    if (e.type === "depart") {
      if (!vraiNom(e.nom)) return txt("g_suivre");
      return html ? esc(t("g_depart", { rue: "\u0001" })).replace("\u0001", rue(e.nom)) : t("g_depart", { rue: e.nom });
    }
    let s = txt("g_" + e.type);
    if (vraiNom(e.nom)) s += " " + (html ? esc(t("g_sur", { rue: "\u0001" })).replace("\u0001", rue(e.nom)) : t("g_sur", { rue: e.nom }));
    else if (e.nom === "#chemin") s += " " + txt("g_surChemin");
    return s;
  }

  function distanceCourte(m) {
    if (m < 1000) return Math.max(5, Math.round(m / (m < 100 ? 5 : 10)) * (m < 100 ? 5 : 10)) + " m";
    return new Intl.NumberFormat(LOCALES[etat.langue], { maximumFractionDigits: 1 }).format(m / 1000) + " km";
  }

  function demarrerGuide(id) {
    if (etat.guide && etat.guide.id === id) return;
    arreterGuide();
    const l = lieu(id);
    const x = l ? null : equip(id);
    const pt = l ? pointCarte(l) : x ? { lat: x.lat, lng: x.lng } : null;
    const zone = document.getElementById("vue-carte");
    zone.classList.add("en-guide");
    document.body.classList.add("en-guide");
    fermerFicheCarte();
    const g = (etat.guide = {
      id: id,
      nomLieu: l ? l.nom : x ? x.nom : "",
      tel: l ? l.tel : x ? x.tel : "",
      fiche: !!l,
      dest: pt ? { lat: pt.lat, lng: pt.lng } : null,
      etat: pt ? "position" : "erreur",
      erreur: pt ? null : "guideSansLieu",
      trajet: null,
      i: 1,
      dist: 0,
      hors: 0,
      annonces: {},
      suivre: true,
      voix: stock.lire("guideVoix", false),
      couches: L.layerGroup().addTo(etat.carte)
    });
    majMarqueurs();
    etat.carteCadree = true;
    if (pt) etat.carte.setView([pt.lat, pt.lng], 16);
    rendreGuide();
    if (!pt) return;
    chargerPlan().catch(() => {});
    garderEcranAllume(true);
    if (!gpsPossible()) return erreurGuide("guideSansGps");
    g.suivi = navigator.geolocation.watchPosition(
      (pos) => surPositionGuide(pos),
      (err) => {
        if (etat.guide !== g) return;
        if (!g.trajet || (err && err.code === 1)) erreurGuide("guideSansGps");
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
    );
  }

  function erreurGuide(cle) {
    const g = etat.guide;
    if (!g) return;
    g.etat = "erreur";
    g.erreur = cle;
    rendreGuide();
  }

  function arreterGuide() {
    const g = etat.guide;
    if (!g) return;
    if (g.suivi != null) navigator.geolocation.clearWatch(g.suivi);
    if (g.couches) g.couches.remove();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    garderEcranAllume(false);
    etat.guide = null;
    document.getElementById("vue-carte").classList.remove("en-guide");
    document.body.classList.remove("en-guide");
    document.getElementById("guide-haut").hidden = true;
    document.getElementById("guide-bas").hidden = true;
    if (etat.coucheLieux) majMarqueurs();
  }

  // L'écran reste allumé pendant le guidage (navigateurs qui le permettent)
  let verrouEcran = null;
  function garderEcranAllume(oui) {
    if (!("wakeLock" in navigator)) return;
    if (!oui) {
      if (verrouEcran) verrouEcran.release().catch(() => {});
      verrouEcran = null;
      return;
    }
    navigator.wakeLock.request("screen").then((v) => { verrouEcran = v; }).catch(() => {});
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && etat.guide && !verrouEcran) garderEcranAllume(true);
  });

  function surPositionGuide(pos) {
    const g = etat.guide;
    if (!g) return;
    const ici = { lat: pos.coords.latitude, lng: pos.coords.longitude, source: "gps" };
    const precision = pos.coords.accuracy || 20;
    etat.position = ici;
    majMoiSurCarte(false);
    if (!g.trajet) {
      if (g.etat === "calcul") return;
      g.etat = "calcul";
      rendreGuide();
      calculerTrajet(ici);
      return;
    }
    if (g.etat === "arrivee") return;
    const s = window.PaladinesChemins.suivre(g.trajet, ici, g.i);
    if (!s || s.ecart > Math.max(30, precision * 1.2)) {
      // Écartée du chemin deux fois de suite : nouveau chemin depuis ici
      g.hors++;
      if (g.hors >= 2 && Date.now() - (g.dernierCalcul || 0) > 6000) {
        g.etat = "recalcul";
        rendreGuide();
        calculerTrajet(ici);
        return;
      }
    } else {
      g.hors = 0;
      g.i = s.i;
      g.dist = Math.max(g.dist, s.dist);
    }
    const reste = g.trajet.longueur - g.dist;
    if (reste < 15 || window.PaladinesChemins.metres([ici.lat, ici.lng], [g.dest.lat, g.dest.lng]) < 20) {
      g.etat = "arrivee";
      annoncer("arrivee", consigne({ type: "arrivee" }, false));
      if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
      g.couches.clearLayers();
      g.ligne = null;
    } else dessinerTrajet();
    if (g.suivre && Date.now() > (g.suivreApres || 0)) etat.carte.setView([ici.lat, ici.lng], Math.max(etat.carte.getZoom(), 17), { animate: true });
    rendreGuide();
  }

  function calculerTrajet(depart) {
    const g = etat.guide;
    chargerPlan()
      .then((plan) => {
        if (etat.guide !== g) return;
        const tr = window.PaladinesChemins.itineraire(plan, depart, g.dest);
        g.dernierCalcul = Date.now();
        if (!tr) return erreurGuide("guideHorsZone");
        const premier = !g.trajet;
        g.trajet = tr;
        g.i = 1;
        g.dist = 0;
        g.hors = 0;
        g.annonces = {};
        g.etat = "actif";
        dessinerTrajet();
        if (premier) {
          // D'abord tout le chemin, puis la carte suit la marche
          etat.carte.fitBounds(tr.points, { paddingTopLeft: [30, 150], paddingBottomRight: [30, 170], maxZoom: 17 });
          g.suivreApres = Date.now() + 3500;
        }
        rendreGuide();
      })
      .catch(() => {
        if (etat.guide === g) erreurGuide("guideSansPlan");
      });
  }

  function dessinerTrajet() {
    const g = etat.guide;
    if (!g || !g.trajet) return;
    const tr = g.trajet;
    // Partie qui reste à faire : depuis la position sur le chemin
    const k = Math.max(1, g.i);
    const debut = tr.cumul[k] - tr.cumul[k - 1] > 0 ? (g.dist - tr.cumul[k - 1]) / (tr.cumul[k] - tr.cumul[k - 1]) : 0;
    const a = tr.points[k - 1], b = tr.points[k];
    const reste = [[a[0] + (b[0] - a[0]) * debut, a[1] + (b[1] - a[1]) * debut]].concat(tr.points.slice(k));
    if (!g.ligne) {
      g.bord = L.polyline(reste, { color: "#ffffff", weight: 11, opacity: 0.95, interactive: false }).addTo(g.couches);
      g.ligne = L.polyline(reste, { color: "#1e63d6", weight: 7, opacity: 1, interactive: false }).addTo(g.couches);
    } else {
      g.bord.setLatLngs(reste);
      g.ligne.setLatLngs(reste);
    }
  }

  function prochaineEtape(g) {
    const liste = g.trajet.etapes;
    for (let n = 0; n < liste.length; n++) {
      if (liste[n].type === "depart" && g.dist < 10) return n;
      if (liste[n].type !== "depart" && liste[n].dist > g.dist + 3) return n;
    }
    return liste.length - 1;
  }

  function annoncer(cle, texte) {
    const g = etat.guide;
    if (!g || g.annonces[cle]) return;
    g.annonces[cle] = true;
    if (!g.voix || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = VOIX[etat.langue];
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }

  function rendreGuide() {
    const g = etat.guide;
    const haut = document.getElementById("guide-haut");
    const bas = document.getElementById("guide-bas");
    if (!g) return;
    haut.hidden = false;
    bas.hidden = false;
    haut.className = "guide-haut" + (g.etat === "arrivee" ? " guide-haut--arrivee" : "") + (g.etat === "erreur" ? " guide-haut--erreur" : "");
    const boutonsBas = (fin) =>
      '<div class="guide-boutons">' +
      ("speechSynthesis" in window && !fin
        ? '<button type="button" class="btn btn--doux guide-voix" data-action="guide-voix" aria-pressed="' + !!g.voix + '">' + icone("i-son") + esc(t("guideVoix")) + "</button>"
        : "") +
      '<button type="button" class="btn ' + (fin ? "" : "btn--doux ") + 'guide-arreter" data-action="guide-arreter">' + (fin ? "" : SVG_FERMER) + esc(t(fin ? "guideTerminer" : "guideArreter")) + "</button></div>";

    if (g.etat === "erreur") {
      haut.innerHTML = '<p class="guide-msg">' + icone("i-alerte") + esc(t(g.erreur)) + "</p>";
      bas.innerHTML =
        '<p class="guide-dest">' + esc(g.nomLieu) + "</p>" +
        '<div class="guide-boutons">' +
        (g.erreur !== "guideSansLieu" ? '<button type="button" class="btn" data-action="guide-reessayer">' + esc(t("guideReessayer")) + "</button>" : "") +
        (g.tel ? '<a class="btn btn--appel" href="' + telLien(g.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
        '<button type="button" class="btn btn--doux" data-action="guide-arreter">' + esc(t("guideArreter")) + "</button></div>" +
        (g.dest && g.erreur !== "guideSansPlan" ? '<a class="guide-autre" target="_blank" rel="noopener noreferrer" href="' + esc(lienItineraire(g.dest)) + '">' + esc(t("guideAutreAppli")) + "</a>" : "");
      return;
    }
    if (g.etat === "position" || g.etat === "calcul" || (g.etat === "recalcul" && !g.trajet)) {
      haut.innerHTML = '<p class="guide-msg"><span class="guide-attente" aria-hidden="true"></span>' + esc(t(g.etat === "position" ? "guidePosition" : "guideCalcul")) + "</p>";
      bas.innerHTML = '<p class="guide-dest">' + esc(g.nomLieu) + "</p>" + boutonsBas(false);
      return;
    }
    if (g.etat === "arrivee") {
      haut.innerHTML = fleche("arrivee") + '<div class="guide-texte"><p class="guide-dist">' + esc(t("guideArrivee")) + '</p><p class="guide-consigne">' + esc(g.nomLieu) + "</p></div>";
      bas.innerHTML = (g.fiche ? '<a class="btn btn--doux" href="#lieu-' + g.id + '">' + esc(t("voirFiche")) + "</a>" : "") + boutonsBas(true);
      return;
    }
    const tr = g.trajet;
    const n = prochaineEtape(g);
    const e = tr.etapes[n];
    const d = Math.max(0, e.dist - g.dist);
    const texte = consigne(e, false);
    if (e.type !== "depart") {
      if (d <= 40) {
        annoncer("pres" + n, texte);
        if (navigator.vibrate && !g.annonces["vib" + n]) {
          g.annonces["vib" + n] = true;
          navigator.vibrate(120);
        }
      } else if (d <= 200 && d > 120) annoncer("loin" + n, t("guideDans", { dist: distanceCourte(d), consigne: texte }));
    } else annoncer("depart", texte);
    const suite = tr.etapes[n + 1];
    const reste = tr.longueur - g.dist;
    const min = Math.max(1, Math.round(reste / 75)); // 4,5 km/h
    const arrivee = new Date(Date.now() + min * 60000).toLocaleTimeString(LOCALES[etat.langue], { hour: "2-digit", minute: "2-digit" });
    haut.innerHTML =
      fleche(e.type) +
      '<div class="guide-texte">' +
      (e.type === "depart" ? "" : '<p class="guide-dist" dir="ltr">' + esc(distanceCourte(d)) + "</p>") +
      '<p class="guide-consigne">' + consigne(e, true) + "</p>" +
      (suite && e.type !== "depart" && suite.dist - e.dist < 60 ? '<p class="guide-puis">' + esc(t("guidePuis")) + " : " + consigne(suite, true) + "</p>" : "") +
      "</div>";
    bas.innerHTML =
      '<div class="guide-resume"><p class="guide-temps">' + esc(t("guideResteMin", { min: min })) + "</p>" +
      '<p class="guide-detail"><span dir="ltr">' + esc(distanceCourte(reste)) + "</span> · " + esc(t("guideArriveeA", { h: arrivee })) + "</p>" +
      '<p class="guide-dest">' + esc(g.nomLieu) + "</p></div>" +
      boutonsBas(false);
    document.getElementById("btn-localiser").classList.toggle("btn-localiser--visible", !g.suivre);
  }

  /* ---------- Lecture à voix haute ---------- */
  function lire(texte, bouton) {
    if (!("speechSynthesis" in window)) return;
    const enCours = bouton.getAttribute("aria-pressed") === "true";
    speechSynthesis.cancel();
    document.querySelectorAll('[data-action^="ecouter"][aria-pressed="true"]').forEach((b) => majBoutonLecture(b, false));
    if (enCours) return;
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = VOIX[etat.langue];
    u.rate = 0.92;
    u.onend = u.onerror = () => majBoutonLecture(bouton, false);
    speechSynthesis.speak(u);
    majBoutonLecture(bouton, true);
  }

  function majBoutonLecture(b, actif) {
    b.setAttribute("aria-pressed", String(actif));
    b.querySelector("span").textContent = actif ? t("arreter") : t("ecouter");
  }

  function texteLieu(l) {
    const s = statut(l, new Date());
    const parties = [l.nom, s.texte];
    if (!l.adresseMasquee && l.adresse) parties.push(l.adresse);
    if (l.horaires && l.horaires !== "24/7") parties.push(t("horaires") + " " + t("aujourdhui") + " : " + texteHorairesJour(l, JOURS[new Date().getDay()]));
    parties.push(t("surPlace") + " : " + l.services.join(", "));
    parties.push(l.conditions);
    if (l.tel) parties.push(t("appeler") + " : " + l.tel.split(" ").join(", "));
    return parties.join(". ");
  }

  /* ---------- Actions ---------- */
  function copier(texte, bouton) {
    const fini = () => {
      const ancien = bouton.innerHTML;
      bouton.innerHTML = icone("i-check") + esc(t("copie"));
      setTimeout(() => (bouton.innerHTML = ancien), 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(fini, () => selectionner(bouton));
    } else {
      selectionner(bouton);
    }
  }

  function selectionner(bouton) {
    const cible = bouton.parentElement.querySelector(".adresse-txt");
    if (!cible) return;
    const r = document.createRange();
    r.selectNodeContents(cible);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }

  function partager(l) {
    const texte = l.nom + "\n" + (l.adresseMasquee || !l.adresse ? "" : l.adresse + "\n") + (l.tel ? l.tel + "\n" : "");
    const url = location.href.split("#")[0] + "#lieu-" + l.id;
    if (navigator.share) {
      navigator.share({ title: l.nom, text: texte, url: url }).catch(() => { /* annulé */ });
    } else {
      location.href = "sms:?&body=" + encodeURIComponent(texte + url);
    }
  }

  function basculerFavori(id, bouton) {
    const i = etat.favoris.indexOf(id);
    if (i === -1) etat.favoris.push(id);
    else etat.favoris.splice(i, 1);
    stock.ecrire("favoris", etat.favoris);
    const fav = i === -1;
    bouton.setAttribute("aria-pressed", String(fav));
    bouton.innerHTML = icone(fav ? "i-etoile-pleine" : "i-etoile") + "<span>" + esc(fav ? t("garde") : t("garder")) + "</span>";
  }

  function quitter() {
    try {
      sessionStorage.clear();
    } catch (e) {
      /* rien */
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    location.replace(URL_SORTIE);
  }

  function surClic(e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    switch (action) {
      case "retour":
        if (etat.navInterne) {
          e.preventDefault();
          history.back();
        }
        break;
      case "filtre": {
        const f = el.dataset.filtre;
        if (etat.filtres.has(f)) etat.filtres.delete(f);
        else etat.filtres.add(f);
        el.setAttribute("aria-pressed", String(etat.filtres.has(f)));
        const nb = document.querySelector("#vue .nb-filtres");
        if (nb) {
          const n = CRITERES.filter((x) => etat.filtres.has(x)).length;
          nb.textContent = n ? " (" + n + ")" : "";
        }
        majResultats();
        break;
      }
      case "proche":
        // « Près de moi » : active ou coupe le tri par distance ; demande le GPS si besoin
        if (etat.position && etat.triDistance) {
          etat.triDistance = false;
          etat.positionMessage = null;
          rafraichir();
        } else if (etat.position) {
          etat.triDistance = true;
          rafraichir();
        } else {
          demanderPosition();
        }
        break;
      case "garder":
        basculerFavori(id, el);
        break;
      case "partager":
        partager(lieu(id));
        break;
      case "ecouter":
        lire(texteLieu(lieu(id)), el);
        break;
      case "ecouter-fiche": {
        const f = t("fiches").find((x) => x.id === id);
        lire(f.titre + ". " + f.points.join(" "), el);
        break;
      }
      case "copier":
        copier(el.dataset.texte, el);
        break;
      case "langue":
        changerLangue(el.dataset.valeur);
        break;
      case "taille":
        etat.taille = Number(el.dataset.valeur);
        stock.ecrire("taille", etat.taille);
        appliquerReglages();
        rafraichir();
        break;
      case "installer":
        if (etat.installation) {
          etat.installation.prompt();
          etat.installation.userChoice.then(() => {
            etat.installation = null;
            rafraichir();
          });
        }
        break;
      case "installer-plus-tard":
        stock.ecrire("installMasque", true);
        el.closest(".installer-bandeau").remove();
        break;
      case "effacer":
        el.hidden = true;
        el.parentElement.querySelector(".effacer-confirmer").hidden = false;
        break;
      case "effacer-non": {
        const boite = el.closest(".effacer");
        boite.querySelector(".effacer-confirmer").hidden = true;
        boite.querySelector('[data-action="effacer"]').hidden = false;
        break;
      }
      case "effacer-oui": {
        stock.toutEffacer();
        etat.favoris = [];
        const boite = el.closest(".effacer");
        boite.querySelector(".effacer-confirmer").hidden = true;
        boite.querySelector(".ok").hidden = false;
        break;
      }
      case "carte-eq":
        etat.carteEq[el.dataset.valeur] = !etat.carteEq[el.dataset.valeur];
        rendreBarreCarte();
        majEquip();
        break;
      case "proche-aide":
        demanderPosition();
        break;
      case "avis":
        donnerAvis(id, el.dataset.valeur);
        el.closest(".avis-lieu").innerHTML = "<p>" + icone("i-check") + esc(t("avisMerci")) + "</p>";
        break;
      case "fermer-fiche-carte":
        fermerFicheCarte();
        break;
      case "guide-arreter":
        arreterGuide();
        if (etat.navInterne) history.back();
        else location.hash = "#carte";
        break;
      case "guide-voix":
        if (!etat.guide) break;
        etat.guide.voix = !etat.guide.voix;
        stock.ecrire("guideVoix", etat.guide.voix);
        if (!etat.guide.voix && "speechSynthesis" in window) speechSynthesis.cancel();
        etat.guide.annonces = {};
        rendreGuide();
        break;
      case "guide-reessayer": {
        const id = etat.guide && etat.guide.id;
        arreterGuide();
        if (id) demarrerGuide(id);
        break;
      }
      case "carte-cat":
        etat.carteCat = el.dataset.valeur;
        rendreBarreCarte();
        majMarqueurs();
        break;
      case "carte-ouvert":
        etat.carteOuvert = !etat.carteOuvert;
        rendreBarreCarte();
        majMarqueurs();
        break;
      case "carte-femmes":
        etat.carteFemmes = !etat.carteFemmes;
        rendreBarreCarte();
        majMarqueurs();
        break;
      case "localiser":
        if (etat.guide) {
          etat.guide.suivre = true;
          etat.guide.suivreApres = 0;
          if (etat.position) etat.carte.setView([etat.position.lat, etat.position.lng], Math.max(etat.carte.getZoom(), 17));
          rendreGuide();
        } else if (etat.position && etat.position.source === "gps") majMoiSurCarte(true);
        else demanderPosition();
        break;
      case "im-aller":
        if (im.aller) im.aller(Number(el.dataset.i), true);
        break;
      case "tel-carte":
        etat.telCarteOuvert = !etat.telCarteOuvert;
        majTelCarte();
        break;
      case "masquer-msg-carte":
        etat.msgPartielVu = true;
        majMsgCarte();
        break;
      case "sauter":
        e.preventDefault();
        document.getElementById("vue").focus();
        break;
      default:
        break;
    }
  }

  function majResultats() {
    const zone = document.getElementById("resultats");
    if (!zone) return;
    const h = vueCourante();
    if (h.vue === "cat") zone.innerHTML = htmlListe(preparer(D.lieux.filter((l) => dansCat(l, h.param))), false);
    else if (h.vue === "proche") zone.innerHTML = htmlListe(preparer(D.lieux, true), true);
  }

  /* ---------- Signalements ----------
   * Envoyés à /api/signalement (functions/api/signalement.js) : le lieu, la raison, le message
   * facultatif et la langue. Jamais la position ni rien qui identifie la personne.
   * Sans internet, le message attend sur le téléphone et part au retour de la connexion. */
  const MAX_ATTENTE = 10;

  async function posterSignalement(s) {
    try {
      const rep = await fetch("/api/signalement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
        cache: "no-store",
        referrerPolicy: "no-referrer"
      });
      if (rep.ok) return "envoye";
      return rep.status >= 500 ? "attente" : "refuse";
    } catch (e) {
      return "attente";
    }
  }

  function mettreEnAttente(s) {
    const liste = stock.lire("signalements", []).concat([s]).slice(-MAX_ATTENTE);
    stock.ecrire("signalements", liste);
  }

  let envoiEnCours = false;
  async function envoyerEnAttente() {
    if (envoiEnCours || navigator.onLine === false) return;
    const liste = stock.lire("signalements", []);
    if (!liste.length) return;
    envoiEnCours = true;
    const restent = [];
    for (const s of liste) {
      if ((await posterSignalement(s)) === "attente") restent.push(s);
    }
    // Relire : un message a pu être ajouté pendant l'envoi
    const ajoutes = stock.lire("signalements", []).slice(liste.length);
    stock.ecrire("signalements", restent.concat(ajoutes).slice(-MAX_ATTENTE));
    envoiEnCours = false;
  }

  async function surEnvoi(e) {
    const form = e.target;
    if (!form.classList || !form.classList.contains("form-signaler")) return;
    e.preventDefault();
    const champs = form.querySelector("fieldset");
    const bouton = form.querySelector('button[type="submit"]');
    const msg = form.querySelector(".merci");
    const s = {
      lieu: form.dataset.lieu || "",
      raison: form.elements.raison.value,
      message: form.elements.message.value.trim(),
      langue: etat.langue,
      site: form.elements.site.value
    };
    champs.disabled = true;
    bouton.disabled = true;

    let resultat = navigator.onLine === false ? "attente" : await posterSignalement(s);
    if (resultat === "attente") mettreEnAttente(s);

    if (resultat === "refuse") {
      msg.classList.add("merci--erreur");
      msg.textContent = t("signalerErreur");
      champs.disabled = false;
      bouton.disabled = false;
    } else {
      msg.classList.remove("merci--erreur");
      msg.textContent = t(resultat === "envoye" ? "signalerMerci" : "signalerAttente");
      bouton.hidden = true;
    }
    msg.hidden = false;
  }

  /* ---------- Compteur de visites ----------
   * Au plus une fois par jour et par téléphone, avec internet : /api/visite ajoute 1 au
   * compteur du mois. Rien n'est envoyé sur la personne ; seule la date du jour reste ici. */
  function compterVisite() {
    if (!/^https?:$/.test(location.protocol) || navigator.onLine === false) return;
    const d = new Date();
    const jour = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    if (stock.lire("visite", "") === jour) return;
    fetch("/api/visite", { method: "POST", cache: "no-store", referrerPolicy: "no-referrer", keepalive: true })
      .then((rep) => { if (rep.ok) stock.ecrire("visite", jour); })
      .catch(() => { /* pas compté, ce n'est pas grave */ });
  }

  /* ---------- Langue, réglages, chrome ---------- */
  function changerLangue(l) {
    if (LANGUES.indexOf(l) === -1) return;
    etat.langue = l;
    stock.ecrire("langue", l);
    fermerMenuLangue();
    appliquerReglages();
    rafraichir();
    if (etat.carte && !document.getElementById("vue-carte").hidden) {
      rendreBarreCarte();
      majMarqueurs();
    }
  }

  function appliquerReglages() {
    const html = document.documentElement;
    html.lang = etat.langue;
    html.dir = etat.langue === "ar" ? "rtl" : "ltr";
    html.style.fontSize = [100, 115, 132][etat.taille] + "%";
    // Un seul style : bleu nuit et jaune (« Paladines »)
    html.setAttribute("data-theme", "paladines");
    document.querySelectorAll("[data-t]").forEach((el) => {
      el.textContent = t(el.dataset.t);
    });
    document.querySelectorAll("[data-t-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.tLabel));
      el.title = t(el.dataset.tLabel);
    });
    document.getElementById("code-langue").textContent = etat.langue.toUpperCase();
    document.querySelectorAll("#menu-langue [data-valeur]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.valeur === etat.langue)));
  }

  function ouvrirMenuLangue() {
    document.getElementById("menu-langue").hidden = false;
    document.getElementById("btn-langue").setAttribute("aria-expanded", "true");
    const actif = document.querySelector('#menu-langue [aria-checked="true"]');
    if (actif) actif.focus();
  }

  function fermerMenuLangue() {
    document.getElementById("menu-langue").hidden = true;
    document.getElementById("btn-langue").setAttribute("aria-expanded", "false");
  }

  function majNav(vue) {
    const correspond = { accueil: "accueil", cat: "accueil", proche: "accueil", pourvous: "accueil", lieu: null, carte: "carte", guide: "carte", urgences: "urgences", aide: "urgences", infos: "infos", favoris: "favoris" };
    const actif = correspond[vue];
    document.querySelectorAll(".onglets a").forEach((a) => {
      if (a.dataset.onglet === actif) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function majHorsLigne() {
    document.getElementById("bandeau-horsligne").hidden = navigator.onLine !== false;
  }

  function estInstallee() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  }

  /* ---------- Routeur ---------- */
  function vueCourante() {
    const h = decodeURIComponent(location.hash.replace(/^#/, "")) || "accueil";
    const i = h.indexOf("-");
    return { vue: i === -1 ? h : h.slice(0, i), param: i === -1 ? "" : h.slice(i + 1) };
  }

  function route(options) {
    const opts = options || {};
    if (!opts.rafraichir && "speechSynthesis" in window) speechSynthesis.cancel();
    const h = vueCourante();
    const main = document.getElementById("vue");
    majNav(h.vue);

    if (h.vue === "carte" || h.vue === "guide") {
      if (h.vue === "carte") {
        arreterGuide();
        // « #carte-toilettes » : la carte avec les toilettes et l'eau potable
        if (h.param === "toilettes") etat.carteEq.t = etat.carteEq.e = true;
        if (h.param === "surs") etat.carteEq.s = true;
      }
      afficherCarte();
      if (h.vue === "guide" && etat.carte) demarrerGuide(h.param);
      return;
    }
    arreterGuide();
    fermerFicheCarte();
    document.getElementById("vue-carte").hidden = true;
    main.hidden = false;

    let html;
    switch (h.vue) {
      case "cat": html = vueCategorie(h.param); break;
      case "proche": html = vueProche(); break;
      case "lieu": html = vueLieu(h.param); break;
      case "urgences": html = vueUrgences(); break;
      case "infos": html = vueInfos(h.param); break;
      case "favoris": html = vueFavoris(); break;
      case "reglages": html = vueReglages(); break;
      case "apropos": html = vueApropos(); break;
      case "signaler": html = vueSignaler(); break;
      case "pourvous": html = vuePourVous(h.param); break;
      case "aide": html = vueAide(); break;
      default: html = vueAccueil();
    }
    const afficher = () => {
      main.innerHTML = html;
      main.dataset.vue = h.vue;
      demarrerDefilement();
      if (h.vue === "reglages") dessinerQrSite();

      if (opts.rafraichir) return;
      const fiche = h.vue === "infos" && h.param ? document.getElementById("fiche-" + h.param)
        : h.vue === "pourvous" && h.param ? document.getElementById("pv-" + h.param) : null;
      if (fiche) fiche.scrollIntoView();
      else window.scrollTo(0, 0);
      if (etat.navInterne) {
        const titre = main.querySelector("h1");
        if (titre) {
          titre.setAttribute("tabindex", "-1");
          titre.focus({ preventScroll: true });
        }
      }
    };
    // Changement d'écran en fondu court (navigateurs récents), sauf si le téléphone demande moins d'animations
    const fondu = !opts.rafraichir && etat.navInterne && document.startViewTransition &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (fondu) document.startViewTransition(afficher);
    else afficher();
  }

  // Re-dessine la vue courante sans remonter en haut (après un réglage, la position…)
  function rafraichir() {
    if (["carte", "guide"].indexOf(vueCourante().vue) !== -1) return;
    route({ rafraichir: true });
  }

  /* ---------- Démarrage ---------- */
  function demarrer() {
    chargerMeteo();
    lirePositionQR();
    chargerCorrections();
    appliquerCoordonnees();
    appliquerReglages();
    route();

    window.addEventListener("hashchange", () => {
      etat.navInterne = true;
      route();
    });
    document.addEventListener("click", surClic);
    document.addEventListener("submit", surEnvoi);

    document.getElementById("btn-quitter").addEventListener("click", quitter);
    let dernierEchap = 0;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!document.getElementById("carte-fiche").hidden) {
        fermerFicheCarte();
        return;
      }
      if (!document.getElementById("menu-langue").hidden) {
        fermerMenuLangue();
        document.getElementById("btn-langue").focus();
        return;
      }
      const now = Date.now();
      if (now - dernierEchap < 800) quitter();
      dernierEchap = now;
    });

    document.getElementById("btn-langue").addEventListener("click", (e) => {
      e.stopPropagation();
      if (document.getElementById("menu-langue").hidden) ouvrirMenuLangue();
      else fermerMenuLangue();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#menu-langue") && !e.target.closest("#btn-langue")) fermerMenuLangue();
    });

    window.addEventListener("online", majHorsLigne);
    window.addEventListener("offline", majHorsLigne);
    majHorsLigne();
    window.addEventListener("online", geocoderManquants);
    geocoderManquants();
    window.addEventListener("online", envoyerEnAttente);
    envoyerEnAttente();
    window.addEventListener("online", envoyerAvis);
    window.addEventListener("online", chargerCorrections);
    envoyerAvis();
    compterVisite();

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      etat.installation = e;
      if (["reglages", "accueil"].indexOf(vueCourante().vue) !== -1) rafraichir();
    });
    window.addEventListener("appinstalled", () => {
      etat.installation = null;
      if (vueCourante().vue === "reglages") rafraichir();
    });

    // Rafraîchir les statuts « ouvert / fermé » chaque minute
    setInterval(() => {
      const v = vueCourante().vue;
      if (["accueil", "cat", "proche", "favoris"].indexOf(v) !== -1 && !document.activeElement.closest("#vue .filtres")) rafraichir();
      if (v === "carte" || v === "guide") majMarqueurs();
    }, 60000);

    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => { /* pas de mode hors ligne, l'appli marche quand même */ });
    }
  }

  // Exposé pour les tests
  window.PALADINES = { statut: statut, distanceM: distanceM };

  demarrer();
})();
