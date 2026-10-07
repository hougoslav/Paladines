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
  const CRITERES_CARTE = ["femmes", "enfants", "animaux", "inconditionnel"];
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
    theme: stock.lire("theme", "auto"),
    favoris: stock.lire("favoris", []),
    filtres: new Set(),
    position: null, // { lat, lng, source: "gps" | "qr", nom }
    positionMessage: null,
    gpsDemande: false,
    navInterne: false,
    installation: null,
    carte: null,
    coucheLieux: null,
    marqueurMoi: null,
    carteCat: "toutes",
    carteOuvert: false
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
    if (etat.langue === "fr") return p[1] === "00" ? h + " h" : h + " h " + p[1];
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

  function demanderPosition() {
    if (!navigator.geolocation) {
      etat.positionMessage = "positionRefus";
      rafraichir();
      return;
    }
    etat.gpsDemande = true;
    etat.positionMessage = "positionEnCours";
    rafraichir();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        etat.position = { lat: pos.coords.latitude, lng: pos.coords.longitude, source: "gps" };
        etat.positionMessage = null;
        rafraichir();
        majMoiSurCarte(true);
      },
      () => {
        etat.positionMessage = "positionRefus";
        rafraichir();
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
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
      if (l.adresseMasquee || typeof l.lat === "number") return;
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

  /* ---------- Listes de lieux ---------- */
  function rangStatut(s) {
    return s.ouvert === true ? 0 : s.ouvert === null ? 1 : 2;
  }

  function preparer(liste, forcerOuvert) {
    const maintenant = new Date();
    const ref = etat.position;
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
        const r = rangStatut(a.s) - rangStatut(b.s);
        if (r) return r;
        if (a.d !== null || b.d !== null) {
          const da = a.d === null ? Infinity : a.d;
          const db = b.d === null ? Infinity : b.d;
          if (da !== db) return da - db;
        }
        return a.l.nom.localeCompare(b.l.nom, "fr");
      });
  }

  function htmlLieu(x, avecCategorie) {
    const l = x.l;
    const cat = categorie(l.cat);
    const tags = CRITERES_CARTE.filter((c) => l.criteres && l.criteres[c]).slice(0, 3).map((c) => t("f_" + c));
    return (
      '<li><a class="lieu" href="#lieu-' + l.id + '">' +
      '<span class="pastille" style="--c:' + cat.couleur + '">' + icone(cat.icone) + "</span>" +
      '<span class="lieu-corps">' +
      (avecCategorie ? '<span class="lieu-cat">' + esc(t("cat_" + l.cat)) + "</span>" : "") +
      '<span class="lieu-nom">' + esc(l.nom) + "</span>" +
      '<span class="statut statut--' + x.s.classe + '">' + esc(x.s.texte) + "</span>" +
      (x.d !== null ? '<span class="lieu-meta">' + icone("i-pied") + esc(formatDistance(x.d)) + "</span>" : "") +
      (tags.length ? '<span class="lieu-tags">' + tags.map(esc).join(" · ") + "</span>" : "") +
      "</span>" + icone("i-chevron", "chevron") + "</a></li>"
    );
  }

  function htmlListe(prepares, avecCategorie) {
    if (!prepares.length) return '<p class="vide">' + esc(t("aucun")) + "</p>";
    return (
      '<p class="compte">' + esc(prepares.length === 1 ? t("nbLieu1") : t("nbLieux", { n: prepares.length })) + "</p>" +
      '<ul class="liste">' + prepares.map((x) => htmlLieu(x, avecCategorie)).join("") + "</ul>"
    );
  }

  function htmlPosition() {
    let msg;
    let bouton = true;
    if (etat.positionMessage === "positionEnCours") {
      msg = t("positionEnCours");
      bouton = false;
    } else if (etat.position && etat.position.source === "gps") {
      msg = t("positionOk");
      bouton = false;
    } else if (etat.position && etat.position.source === "qr") {
      msg = t("positionQR", { nom: etat.position.nom || t("positionAffiche") });
    } else if (etat.positionMessage === "positionRefus") {
      msg = t("positionRefus", { nom: D.ville.nom });
    } else {
      msg = null;
    }
    return (
      '<div class="position">' +
      (msg ? '<p class="position-msg">' + icone("i-position") + esc(msg) + "</p>" : "") +
      (bouton ? '<button type="button" class="btn btn--doux" data-action="position">' + icone("i-position") + esc(t("positionDemande")) + "</button>" : "") +
      '<p class="position-prive">' + esc(t("positionPrive")) + "</p>" +
      "</div>"
    );
  }

  function htmlFiltres(sansOuvert) {
    const liste = (sansOuvert ? [] : ["ouvert"]).concat(CRITERES);
    return (
      '<div class="filtres" role="group" aria-label="' + esc(t("filtres")) + '">' +
      liste.map((f) => '<button type="button" class="puce" data-action="filtre" data-filtre="' + f + '" aria-pressed="' + etat.filtres.has(f) + '">' + esc(t("f_" + f)) + "</button>").join("") +
      "</div>"
    );
  }

  function htmlRetour() {
    return '<a class="retour" href="#accueil" data-action="retour">' + icone("i-retour") + esc(t("retour")) + "</a>";
  }

  /* ---------- Vues ---------- */
  function vueAccueil() {
    const maintenant = new Date();
    const alerte = D.alerte && D.alerte.actif
      ? '<div class="alerte" role="status">' + icone("i-alerte") + "<p>" + esc(D.alerte.texte[etat.langue] || D.alerte.texte.fr) + "</p></div>"
      : "";

    const tuiles = D.categories.map((c) => {
      const lieux = D.lieux.filter((l) => dansCat(l, c.id));
      const n = lieux.filter((l) => statut(l, maintenant).ouvert === true).length;
      const nb = n === 0 ? t("ouverts0") : n === 1 ? t("ouverts1") : t("ouvertsN", { n: n });
      return (
        '<li><a class="tuile" href="#cat-' + c.id + '" style="--c:' + c.couleur + '">' +
        '<span class="pastille">' + icone(c.icone) + "</span>" +
        '<span class="tuile-nom">' + esc(t("cat_" + c.id)) + "</span>" +
        '<span class="tuile-desc">' + esc(t("catd_" + c.id)) + "</span>" +
        '<span class="tuile-nb' + (n ? " tuile-nb--ouvert" : "") + '">' + esc(nb) + "</span>" +
        "</a></li>"
      );
    }).join("");

    const rapides = [
      { num: "115", txt: t("urg115") },
      { num: "3919", txt: t("urg3919") },
      { num: "17", txt: t("urg17") }
    ].map((u) => '<a class="urg-rapide" href="' + telLien(u.num) + '"><span class="urg-rapide-num">' + u.num + '</span><span class="urg-rapide-txt">' + esc(u.txt) + "</span></a>").join("");

    return (
      '<section class="hero">' +
      '<p class="proto">' + esc(t("prototype")) + "</p>" +
      '<h1 class="hero-titre"><span>' + esc(t("bonjour")) + "</span> " + esc(t("besoin")) + "</h1>" +
      '<a class="cta-proche" href="#proche">' +
      '<span class="cta-ic">' + icone("i-position") + "</span>" +
      '<span class="cta-txt"><strong>' + esc(t("procheCta")) + "</strong><small>" + esc(t("procheSous")) + "</small></span>" +
      icone("i-chevron", "chevron") + "</a>" +
      "</section>" +
      alerte +
      '<section class="bloc" aria-labelledby="h-cherche">' +
      '<h2 id="h-cherche" class="titre-bloc">' + esc(t("jeCherche")) + "</h2>" +
      '<ul class="grille-cat">' + tuiles + "</ul>" +
      "</section>" +
      '<section class="bloc urgences-rapides" aria-labelledby="h-urg">' +
      '<h2 id="h-urg" class="titre-bloc titre-bloc--urg">' + icone("i-tel") + esc(t("urgence")) + "</h2>" +
      '<div class="urg-rapides">' + rapides + "</div>" +
      '<a class="lien-fleche" href="#urgences">' + esc(t("tousNumeros")) + icone("i-chevron", "chevron") + "</a>" +
      "</section>" +
      '<nav class="liens-bas" aria-label="Plus">' +
      '<a href="#infos-securite">' + icone("i-bouclier") + esc(t("securite")) + "</a>" +
      '<a href="#reglages">' + icone("i-installer") + esc(t("installerCourt")) + "</a>" +
      '<a href="#apropos">' + icone("i-info") + esc(t("apropos")) + "</a>" +
      "</nav>" +
      '<p class="maj">' + esc(t("donneesDu", { date: formatDate(D.majDonnees) })) + "</p>"
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
      htmlPosition() +
      htmlFiltres(false) +
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
      htmlPosition() +
      htmlFiltres(true) +
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
    if (!l.adresseMasquee && (l.adresse || aCoord(l))) {
      // L'adresse écrite est plus fiable que des coordonnées approchées pour guider jusqu'à la porte
      const destination = l.adresse ? encodeURIComponent(l.adresse) : l.lat + "," + l.lng;
      actions.push('<a class="action" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + destination + '&amp;travelmode=walking">' + icone("i-itineraire") + "<span>" + esc(t("itineraire")) + "</span></a>");
    }
    if (l.tel) actions.push('<a class="action" href="' + telLien(l.tel) + '">' + icone("i-tel") + "<span>" + esc(t("appeler")) + "</span></a>");
    actions.push('<button type="button" class="action" data-action="partager" data-id="' + l.id + '">' + icone("i-partager") + "<span>" + esc(t("partager")) + "</span></button>");
    actions.push('<button type="button" class="action" data-action="garder" data-id="' + l.id + '" aria-pressed="' + fav + '">' + icone(fav ? "i-etoile-pleine" : "i-etoile") + "<span>" + esc(fav ? t("garde") : t("garder")) + "</span></button>");
    if (peutLire) actions.push('<button type="button" class="action" data-action="ecouter" data-id="' + l.id + '" aria-pressed="false">' + icone("i-son") + "<span>" + esc(t("ecouter")) + "</span></button>");

    const criteres = CRITERES.filter((c) => l.criteres && l.criteres[c]);
    const langues = (l.langues || []).map((c) => t("nomsLangues")[c] || c);
    const raisons = ["ferme", "horaires", "adresse", "accueil", "autre"];

    return (
      htmlRetour() +
      '<article class="fiche-lieu" style="--c:' + cat.couleur + '">' +
      '<p class="badge-fictif">' + esc(t("fictif")) + "</p>" +
      '<header class="tete">' +
      '<span class="pastille pastille--grande">' + icone(cat.icone) + "</span>" +
      '<div><p class="lieu-cat">' + esc(t("cat_" + l.cat)) + "</p><h1>" + esc(l.nom) + "</h1>" +
      '<p class="statut statut--' + s.classe + '">' + esc(s.texte) + "</p></div>" +
      "</header>" +
      '<div class="adresse">' +
      (l.adresseMasquee
        ? '<p class="adresse-masquee">' + icone("i-bouclier") + esc(t("adresseMasquee")) + "</p>"
        : !l.adresse
        ? '<p class="adresse-masquee">' + icone("i-tel") + esc(t("sansAdresse")) + "</p>"
        : '<p class="adresse-txt">' + esc(l.adresse) + "</p>" +
          '<button type="button" class="btn btn--doux btn--mini" data-action="copier" data-texte="' + esc(l.adresse) + '">' + icone("i-copier") + esc(t("copier")) + "</button>") +
      (etat.position && aCoord(l) ? '<p class="lieu-meta">' + icone("i-pied") + esc(formatDistance(distanceM(etat.position, l))) + "</p>" : "") +
      (l.tel ? '<p class="tel-txt">' + icone("i-tel") + '<a href="' + telLien(l.tel) + '">' + esc(l.tel) + "</a></p>" : "") +
      "</div>" +
      '<div class="actions">' + actions.join("") + "</div>" +
      '<section class="section"><h2>' + esc(t("horaires")) + "</h2>" + horaires + "</section>" +
      '<section class="section"><h2>' + esc(t("surPlace")) + '</h2><ul class="puces-txt">' + l.services.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></section>" +
      '<section class="section"><h2>' + esc(t("conditions")) + "</h2><p>" + esc(l.conditions) + "</p></section>" +
      (criteres.length ? '<section class="section"><h2>' + esc(t("bonASavoir")) + '</h2><ul class="criteres">' + criteres.map((c) => "<li>" + icone("i-check") + esc(t("f_" + c)) + "</li>").join("") + "</ul></section>" : "") +
      (langues.length ? '<section class="section"><h2>' + esc(t("languesParlees")) + "</h2><p>" + esc(langues.join(", ")) + "</p></section>" : "") +
      '<div class="verifie"><p>' + icone("i-info") + esc(t("verifie", { date: formatDate(l.verifie) })) + "</p>" +
      "<p>" + esc(t("appelerAvant")) + "</p>" +
      (l.sources && l.sources.length
        ? '<p class="sources">' + esc(t("sources")) + " : " + l.sources.map((u) => '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(hote(u)) + "</a>").join(", ") + "</p>"
        : "") +
      "</div>" +
      '<details class="signaler"><summary>' + icone("i-drapeau") + esc(t("signaler")) + "</summary>" +
      '<form id="form-signaler" data-id="' + l.id + '"><fieldset><legend>' + esc(t("signalerQuoi")) + "</legend>" +
      raisons.map((r, i) => '<label><input type="radio" name="raison" id="raison-' + r + '" value="' + r + '"' + (i === 0 ? " required" : "") + "> " + esc(t("sig_" + r)) + "</label>").join("") +
      '</fieldset><button type="submit" class="btn">' + esc(t("envoyer")) + '</button><p class="merci" role="status" hidden>' + esc(t("signalerMerci")) + "</p></form></details>" +
      "</article>"
    );
  }

  function vueUrgences() {
    return (
      htmlRetour() +
      '<header class="tete tete--urg"><span class="pastille pastille--grande">' + icone("i-tel") + "</span>" +
      "<div><h1>" + esc(t("urgTitre")) + '</h1><p class="sous-titre">' + esc(t("urgIntro")) + "</p></div></header>" +
      '<ul class="liste-urg">' +
      D.urgences.map((u) =>
        '<li class="urg' + (u.couleur === "urgent" ? " urg--fort" : "") + '">' +
        '<a class="urg-num" href="' + telLien(u.num) + '">' + u.num + "</a>" +
        '<div class="urg-corps"><p>' + esc(t("urg_" + u.id)) + "</p>" +
        '<div class="urg-actions"><a class="btn btn--mini" href="' + telLien(u.num) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" +
        (u.sms ? '<a class="btn btn--mini" href="sms:' + u.num + '">' + icone("i-sms") + esc(t("envoyerSms")) + "</a>" : "") +
        "</div></div></li>"
      ).join("") +
      "</ul>" +
      '<p class="rappel">' + icone("i-info") + esc(t("urgEnLigne")) + "</p>"
    );
  }

  function vueInfos(ouvrir) {
    const peutLire = "speechSynthesis" in window;
    return (
      htmlRetour() +
      '<header class="tete tete--infos"><span class="pastille pastille--grande">' + icone("i-info") + "</span>" +
      "<div><h1>" + esc(t("infosTitre")) + '</h1><p class="sous-titre">' + esc(t("infosIntro")) + "</p></div></header>" +
      '<div class="fiches">' +
      t("fiches").map((f) =>
        '<details class="fiche" id="fiche-' + f.id + '"' + (f.id === ouvrir ? " open" : "") + ">" +
        "<summary>" + esc(f.titre) + icone("i-chevron", "chevron") + "</summary>" +
        "<ul>" + f.points.map((p) => "<li>" + esc(p) + "</li>").join("") + "</ul>" +
        (peutLire ? '<button type="button" class="btn btn--doux btn--mini" data-action="ecouter-fiche" data-id="' + f.id + '" aria-pressed="false">' + icone("i-son") + "<span>" + esc(t("ecouter")) + "</span></button>" : "") +
        "</details>"
      ).join("") +
      "</div>"
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

  function htmlInstallation() {
    if (estInstallee()) return '<p class="ok">' + icone("i-check") + esc(t("installee")) + "</p>";
    if (etat.installation) {
      return '<button type="button" class="btn" data-action="installer">' + icone("i-installer") + esc(t("installer")) + "</button>";
    }
    return "<p>" + esc(/iphone|ipad|ipod/i.test(navigator.userAgent) ? t("installerIOS") : t("installerAutre")) + "</p>";
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
      '<section class="section"><h2>' + esc(t("couleurs")) + '</h2><div class="choix">' +
      [["auto", "themeAuto"], ["light", "themeClair"], ["dark", "themeSombre"]].map((x) => choix("theme", x[0], etat.theme === x[0], esc(t(x[1])))).join("") +
      '</div><p class="aide">' + esc(t("themeAstuce")) + "</p></section>" +
      '<section class="section" id="installer"><h2>' + esc(t("installer")) + '</h2><p class="aide">' + esc(t("installerAide")) + "</p>" + htmlInstallation() + "</section>" +
      '<section class="section"><h2>' + esc(t("effacer")) + '</h2><p class="aide">' + esc(t("effacerAide")) + "</p>" +
      '<div class="effacer"><button type="button" class="btn btn--doux" data-action="effacer">' + esc(t("effacerBouton")) + "</button>" +
      '<div class="effacer-confirmer" hidden><button type="button" class="btn btn--danger" data-action="effacer-oui">' + esc(t("confirmerEffacer")) + '</button><button type="button" class="btn btn--doux" data-action="effacer-non">' + esc(t("annuler")) + "</button></div>" +
      '<p class="ok" role="status" hidden>' + icone("i-check") + esc(t("effacerOk")) + "</p></div></section>" +
      '<nav class="liens-bas" aria-label="Plus">' +
      '<a href="#infos-securite">' + icone("i-bouclier") + esc(t("securite")) + "</a>" +
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
    ["Aucun compte, aucune donnée envoyée", "Pas d'inscription, pas de nom. La position reste sur le téléphone et n'est jamais enregistrée."],
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
      "<p>Paladines est une première version, faite pour en discuter en groupe. Elle est centrée sur <strong>Lille</strong>. Les lieux sont de <strong>vrais lieux</strong>, relevés sur internet en octobre 2026 : ils doivent encore être confirmés par téléphone avec chaque structure avant un vrai lancement. Les numéros d'urgence sont nationaux.</p>" +
      "<h2>Le principe</h2>" +
      "<p>Une femme à la rue scanne un QR code (affiche, autocollant dans des toilettes, carte remise par une maraude). Elle arrive sur cette page, sans rien installer, et trouve tout de suite les lieux ouverts près d'elle pour dormir, manger, se laver, se soigner ou être aidée.</p>" +
      "<h2>Idées ajoutées</h2>" +
      '<ol class="idees">' + IDEES.map((x) => "<li><strong>" + esc(x[0]) + "</strong><span>" + esc(x[1]) + "</span></li>").join("") + "</ol>" +
      "<h2>Outils</h2>" +
      '<p><a class="btn" href="affiche.html">' + icone("i-qr") + "Créer une affiche avec QR code</a></p>" +
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
    setTimeout(() => etat.carte.invalidateSize(), 0);
  }

  function creerCarte() {
    const ref = etat.position || D.ville;
    const carte = L.map("carte", { zoomControl: false }).setView([ref.lat, ref.lng], D.ville.zoom);
    L.control.zoom({ position: "bottomright" }).addTo(carte);
    carte.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    const fond = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      crossOrigin: "anonymous", // pour que le service worker puisse garder les tuiles hors ligne
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    });
    const msg = document.querySelector("#vue-carte .carte-msg");
    let erreurs = 0;
    fond.on("tileerror", () => {
      erreurs++;
      // Le message « positions en cours de chargement » est plus utile : on le laisse
      if (erreurs >= 2 && D.lieux.some(aCoord)) {
        msg.textContent = t("fondIndispo");
        msg.hidden = false;
      }
    });
    fond.on("tileload", () => {
      erreurs = 0;
      msg.hidden = true;
    });
    fond.addTo(carte);
    etat.carte = carte;
    etat.coucheLieux = L.layerGroup().addTo(carte);
  }

  function rendreBarreCarte() {
    const barre = document.getElementById("barre-carte");
    const cats = [{ id: "toutes" }].concat(D.categories);
    barre.innerHTML =
      '<button type="button" class="puce puce--ouvert" data-action="carte-ouvert" aria-pressed="' + etat.carteOuvert + '">' + esc(t("f_ouvert")) + "</button>" +
      cats.map((c) =>
        '<button type="button" class="puce" data-action="carte-cat" data-valeur="' + c.id + '" aria-pressed="' + (etat.carteCat === c.id) + '"' +
        (c.couleur ? ' style="--c:' + c.couleur + '"' : "") + ">" +
        (c.icone ? icone(c.icone) : "") + esc(c.id === "toutes" ? t("carteToutes") : t("cat_" + c.id)) + "</button>"
      ).join("");
    document.getElementById("btn-localiser").setAttribute("aria-label", t("centrerSurMoi"));
    document.getElementById("btn-localiser").title = t("centrerSurMoi");
  }

  function majMarqueurs() {
    if (!etat.coucheLieux) return;
    const maintenant = new Date();
    etat.coucheLieux.clearLayers();
    const msg = document.querySelector("#vue-carte .carte-msg");
    if (!D.lieux.some(aCoord)) {
      msg.textContent = t("carteSansPositions");
      msg.hidden = false;
    } else if (msg.textContent === t("carteSansPositions")) {
      msg.hidden = true;
    }
    D.lieux
      .filter((l) => aCoord(l) && (etat.carteCat === "toutes" || dansCat(l, etat.carteCat)))
      .forEach((l) => {
        const s = statut(l, maintenant);
        if (etat.carteOuvert && s.ouvert !== true) return;
        const cat = categorie(l.cat);
        const ic = L.divIcon({
          className: "marqueur-boite",
          html: '<span class="marqueur' + (s.ouvert === true ? "" : " marqueur--ferme") + '" style="--c:' + cat.couleur + '">' + icone(cat.icone) + "</span>",
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -20]
        });
        L.marker([l.lat, l.lng], { icon: ic, title: l.nom, alt: l.nom })
          .bindPopup(
            '<p class="popup-cat">' + esc(t("cat_" + l.cat)) + '</p><p class="popup-nom">' + esc(l.nom) + "</p>" +
            '<p class="statut statut--' + s.classe + '">' + esc(s.texte) + "</p>" +
            '<a class="btn btn--mini" href="#lieu-' + l.id + '">' + esc(t("voirFiche")) + "</a>"
          )
          .addTo(etat.coucheLieux);
      });
  }

  function majMoiSurCarte(centrer) {
    if (!etat.carte || !etat.position) return;
    const ll = [etat.position.lat, etat.position.lng];
    if (!etat.marqueurMoi) {
      etat.marqueurMoi = L.marker(ll, {
        icon: L.divIcon({ className: "marqueur-boite", html: '<span class="moi"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        title: t("vousEtesIci"),
        keyboard: false
      }).addTo(etat.carte);
    } else {
      etat.marqueurMoi.setLatLng(ll);
    }
    if (centrer && !document.getElementById("vue-carte").hidden) etat.carte.setView(ll, Math.max(etat.carte.getZoom(), 15));
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
        majResultats();
        break;
      }
      case "position":
        demanderPosition();
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
      case "theme":
        etat.theme = el.dataset.valeur;
        stock.ecrire("theme", etat.theme);
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
      case "localiser":
        if (etat.position && etat.position.source === "gps") majMoiSurCarte(true);
        else demanderPosition();
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

  function surEnvoi(e) {
    if (e.target.id !== "form-signaler") return;
    e.preventDefault();
    // Prototype : rien n'est envoyé. Plus tard : envoyer { lieu, raison, date } à l'équipe qui met à jour les données.
    e.target.querySelector(".merci").hidden = false;
    e.target.querySelector("fieldset").disabled = true;
    e.target.querySelector('button[type="submit"]').hidden = true;
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
    // « Auto » suit le téléphone ; on ne retire que l'attribut posé par l'appli elle-même
    if (etat.theme !== "auto") {
      html.setAttribute("data-theme", etat.theme);
      html.dataset.themeAppli = "1";
    } else if (html.dataset.themeAppli) {
      html.removeAttribute("data-theme");
      delete html.dataset.themeAppli;
    }
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
    const correspond = { accueil: "accueil", cat: "accueil", proche: "accueil", lieu: null, carte: "carte", urgences: "urgences", infos: "infos", favoris: "favoris" };
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

    if (h.vue === "carte") {
      afficherCarte();
      return;
    }
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
      default: html = vueAccueil();
    }
    main.innerHTML = html;
    main.dataset.vue = h.vue;

    if (opts.rafraichir) return;
    const fiche = h.vue === "infos" && h.param ? document.getElementById("fiche-" + h.param) : null;
    if (fiche) fiche.scrollIntoView();
    else window.scrollTo(0, 0);
    if (etat.navInterne) {
      const titre = main.querySelector("h1");
      if (titre) {
        titre.setAttribute("tabindex", "-1");
        titre.focus({ preventScroll: true });
      }
    }
  }

  // Re-dessine la vue courante sans remonter en haut (après un réglage, la position…)
  function rafraichir() {
    if (vueCourante().vue === "carte") return;
    route({ rafraichir: true });
  }

  /* ---------- Démarrage ---------- */
  function demarrer() {
    lirePositionQR();
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

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      etat.installation = e;
      if (vueCourante().vue === "reglages") rafraichir();
    });
    window.addEventListener("appinstalled", () => {
      etat.installation = null;
      if (vueCourante().vue === "reglages") rafraichir();
    });

    // Rafraîchir les statuts « ouvert / fermé » chaque minute
    setInterval(() => {
      const v = vueCourante().vue;
      if (["accueil", "cat", "proche", "favoris"].indexOf(v) !== -1 && !document.activeElement.closest("#vue .filtres")) rafraichir();
      if (v === "carte") majMarqueurs();
    }, 60000);

    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => { /* pas de mode hors ligne, l'appli marche quand même */ });
    }
  }

  // Exposé pour les tests
  window.PALADINES = { statut: statut, distanceM: distanceM };

  demarrer();
})();
