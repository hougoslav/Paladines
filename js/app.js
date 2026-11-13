/*
 * Paladines : l'appli (v31, refaite de zéro).
 * Pas de framework : des écrans rendus en HTML selon l'ancre de l'URL (#cat-dormir, #lieu-l12…).
 * Les ancres restent neutres (#cat-ecoute plutôt que #violences) : rien de sensible dans l'historique.
 *
 *   1. Réglages et état
 *   2. Logique : horaires, positions, corrections de l'équipe, avis, fond de carte, guidage à pied,
 *      signalements (reprise telle quelle de la version précédente, éprouvée)
 *   3. Écrans : accueil, listes, fiche d'un lieu, urgences, infos, réglages…
 *   4. Carte : plein écran (onglet Carte) ou à côté des listes sur ordinateur
 *   5. Actions, routeur, démarrage
 */
(function () {
  "use strict";

  /* =====================================================================
   * 1. Réglages et état
   * ===================================================================== */
  const D = window.PALADINES_DATA;
  const TR = window.PALADINES_I18N;
  const LANGUES = ["fr", "en", "ar", "es", "ro", "uk", "fa", "ps", "ti"];
  const DROITE_A_GAUCHE = ["ar", "fa", "ps"]; // arabe, dari, pachto
  const JOURS = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]; // index = Date#getDay()
  const SEMAINE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  const FERME_BIENTOT_MIN = 30;
  const CRITERES = ["femmes", "enfants", "animaux", "inconditionnel", "sansRdv", "gratuit", "pmr"];
  // Chiffres latins partout (numéros, heures, distances) : les mêmes que sur les affiches et les téléphones
  const LOCALES = { fr: "fr-FR", en: "en-GB", ar: "ar-u-nu-latn", es: "es-ES", ro: "ro-RO", uk: "uk-UA", fa: "fa-AF-u-nu-latn", ps: "ps-AF-u-nu-latn", ti: "ti-ER" };
  const VOIX = { fr: "fr-FR", en: "en-GB", ar: "ar-SA", es: "es-ES", ro: "ro-RO", uk: "uk-UA", fa: "fa-IR", ps: "ps-AF", ti: "ti-ER" };
  // Écran d'ordinateur : menu en haut, carte à côté des listes
  const BUREAU = window.matchMedia ? window.matchMedia("(min-width: 1024px)") : { matches: false };

  /* Stockage local (peut être indisponible : navigation privée…) */
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
    favoris: stock.lire("favoris", []),
    filtres: new Set(),
    filtresOuverts: false,
    position: null, // { lat, lng, source: "gps" | "qr", nom }
    triDistance: true, // « Près de moi » : du plus proche au plus loin quand la position est connue
    positionMessage: null,
    gpsDemande: false,
    navInterne: false,
    installation: null,
    recherche: "",
    focusRecherche: false,
    meteo: null,
    // Carte
    carte: null,
    coucheLieux: null,
    coucheEq: null,
    marqueurMoi: null,
    carteCadree: false,
    carteCat: "toutes", // une grande catégorie (famille) ou « toutes »
    carteOuvert: false,
    carteFemmes: false,
    carteTexte: "",
    carteEq: { t: false, e: false, s: false },
    calquesOuverts: false,
    panneauOuvert: false, // panneau de la carte déplié (téléphone)
    ficheCarte: null, // lieu ou équipement touché sur la carte
    fondEnErreur: false,
    msgPartielVu: false,
    panneau: null, // ordinateur : les lieux de la liste, montrés sur la carte à côté
    panneauCle: "",
    guide: null,
    momentPause: false,
    momentIndex: 0 // la carte « En ce moment » en cours, gardée quand l'accueil se redessine
  };

  /* =====================================================================
   * 2. Logique (reprise de la version précédente)
   * ===================================================================== */
  function langueDuTelephone() {
    const prefs = navigator.languages || [navigator.language || "fr"];
    for (let i = 0; i < prefs.length; i++) {
      const pref = String(prefs[i]).toLowerCase();
      const code = /^prs/.test(pref) ? "fa" : pref.slice(0, 2); // « prs » : dari
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

  // Les grandes catégories de l'accueil (comme Soliguide) : chacune regroupe un ou plusieurs besoins
  function famille(id) {
    return D.familles.find((f) => f.id === id);
  }

  function dansFamille(l, f) {
    return f.cats.some((c) => dansCat(l, c));
  }

  /* Recherche dans les lieux : nom, structure, services, conditions, adresse et nom du besoin.
   * Le mot cherché reste en mémoire, jamais dans l'adresse de la page (discrétion). */
  function sansAccents(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function texteRecherche(l) {
    if (!l._texte) {
      const cats = [l.cat].concat(l.autresCats || []);
      l._texte = sansAccents([l.nom, l.structure, l.adresseMasquee ? "" : l.adresse, (l.services || []).join(" "), l.conditions]
        .concat(cats.map((c) => (TR.fr["cat_" + c] || "") + " " + (TR.fr["catd_" + c] || ""))).join(" "));
    }
    const cats = [l.cat].concat(l.autresCats || []);
    return l._texte + " " + sansAccents(cats.map((c) => t("cat_" + c) + " " + t("catd_" + c)).join(" "));
  }

  function chercher(q) {
    const mots = sansAccents(q).split(/[^\p{L}\p{N}]+/u).filter((m) => m.length > 1)
      .map((m) => (m.length > 3 ? m.replace(/[sx]$/, "") : m));
    if (!mots.length) return [];
    return D.lieux.filter((l) => {
      const txt = texteRecherche(l);
      return mots.every((m) => txt.indexOf(m) !== -1);
    });
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

  const AVIS_JOURS = 30;

  function avisDonne(id) {
    const date = stock.lire("avis", {})[id];
    return date && Date.now() - date < AVIS_JOURS * 864e5;
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

  // Une période « MM-JJ » à « MM-JJ » (qui peut passer le nouvel an, comme le plan hiver)
  function dansPeriode(x, maintenant) {
    const j = String(maintenant.getMonth() + 1).padStart(2, "0") + "-" + String(maintenant.getDate()).padStart(2, "0");
    return x.du <= x.au ? j >= x.du && j <= x.au : j >= x.du || j <= x.au;
  }

  const METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=50.63&longitude=3.06&daily=temperature_2m_min,temperature_2m_max,precipitation_sum&timezone=Europe%2FParis&forecast_days=3";

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
      className: "fond-tuiles", // couleurs adoucies dans css/app.css
      crossOrigin: "anonymous", // pour que le service worker puisse garder les tuiles hors ligne
      attribution: ATTRIB_OSM
    });
    const suivi = suiviErreurs();
    fond.on("tileerror", suivi.erreur);
    fond.on("tileload", suivi.ok);
    fond.addTo(carte);
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
      (voixDispo() && !fin
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

  function estInstallee() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  }

  function urlSite() {
    return location.href.split("#")[0].split("?")[0].replace(/index\.html$/, "");
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

  /* ---------- Lecture à voix haute ---------- */
  // Le téléphone a-t-il une voix pour cette langue ? (souvent pas pour le pachto ou le tigrinya)
  function voixDispo() {
    if (!("speechSynthesis" in window)) return false;
    const voix = speechSynthesis.getVoices();
    if (!voix.length) return true; // liste pas encore chargée : on suppose que oui
    const code = VOIX[etat.langue].slice(0, 2).toLowerCase();
    return voix.some((v) => String(v.lang).toLowerCase().indexOf(code) === 0);
  }

  const SVG_FERMER = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* =====================================================================
   * 3. Écrans
   * ===================================================================== */

  // Ce qu'un lieu offre aux femmes : { niveau: "reserve" | "creneau" | "specialise", texte }
  function pourFemmes(l) {
    if (l.femmes) return l.femmes;
    return l.criteres && l.criteres.femmes ? { niveau: "reserve", texte: "" } : null;
  }

  function badgeFemmes(l) {
    const f = pourFemmes(l);
    return f && f.niveau !== "specialise" ? '<span class="badge-femmes">' + esc(t("badge_" + f.niveau)) + "</span>" : "";
  }

  // Un lieu n'apparaît sur la carte et n'a de distance que si sa position est connue et publique
  function aCoord(l) {
    return !l.adresseMasquee && typeof l.lat === "number" && typeof l.lng === "number";
  }

  // Les grandes catégories de l'accueil : un nom court (celui du besoin quand il n'y en a qu'un)
  function nomFamille(f) {
    return f.cats.length === 1 ? t("cat_" + f.cats[0]) : t("fam_" + f.id);
  }
  function lienFamille(f) {
    return f.cats.length === 1 ? "#cat-" + f.cats[0] : "#rubrique-" + f.id;
  }

  function nbOuverts(lieux, maintenant) {
    return lieux.filter((l) => statut(l, maintenant).ouvert === true).length;
  }

  // « 3 ouverts », « Appeler avant » (horaires inconnus) ou « Fermé », en court et en long
  function resumeOuverts(lieux, maintenant) {
    const n = nbOuverts(lieux, maintenant);
    const inconnus = n === 0 && lieux.some((l) => statut(l, maintenant).ouvert === null);
    return {
      n: n,
      classe: n ? "ouvert" : inconnus ? "inconnu" : "ferme",
      court: n === 0 ? t(inconnus ? "nbInconnu" : "nbOuvert0") : n === 1 ? t("nbOuvert1") : t("nbOuvertN", { n: n }),
      long: n === 0 ? t(inconnus ? "ouvertsInconnus" : "ouverts0") : n === 1 ? t("ouverts1") : t("ouvertsN", { n: n })
    };
  }

  /* ---------- Morceaux communs ---------- */

  // Le bandeau bleu nuit, avec le plan des rues de Lille en filigrane (img/bandeau-lille.jpg)
  function bandeau(contenu, classe) {
    return '<header class="bande ' + (classe || "") + '"><div class="bande-in">' + contenu + "</div></header>";
  }

  function marque() {
    return '<a class="marque" href="#accueil"><svg class="marque-logo" viewBox="8 2 48 60" aria-hidden="true"><use href="#logo"></use></svg><span>Paladines</span></a>';
  }

  function retour(texte) {
    return '<a class="retour" href="#accueil" data-action="retour">' + icone("i-retour") + "<span>" + esc(texte || t("retour")) + "</span></a>";
  }

  // En-tête d'une page : retour (ou la marque), pictogramme, titre, sous-titre, puis ce qu'on veut
  function bandeauPage(o) {
    return bandeau(
      (o.marque ? '<div class="bande-haut">' + marque() + "</div>" : retour(o.retour)) +
      '<div class="page-tete">' +
      (o.icone ? '<span class="page-ic' + (o.iconeClasse ? " " + o.iconeClasse : "") + '">' + icone(o.icone) + "</span>" : "") +
      "<div><h1>" + esc(o.titre) + "</h1>" + (o.sous ? '<p class="page-sous">' + esc(o.sous) + "</p>" : "") + "</div></div>" +
      (o.apres || ""),
      "bande--page " + (o.classe || "")
    );
  }

  // Sur ordinateur, les listes et les fiches ont la carte de leurs lieux à droite
  function colonnes(contenu) {
    return '<div class="colonnes"><div class="col-principale">' + contenu + '</div><div class="col-carte" id="emplacement-carte"></div></div>';
  }

  function htmlRecherche() {
    return (
      '<form class="recherche" role="search" data-recherche>' +
      '<label class="visuellement-cache" for="q">' + esc(t("rechTitre")) + "</label>" + icone("i-loupe") +
      '<input id="q" name="q" type="search" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search" maxlength="60" placeholder="' + esc(t("rechExemple")) + '" value="' + esc(etat.recherche) + '">' +
      '<button type="submit" class="visuellement-cache">' + esc(t("rechBouton")) + "</button></form>"
    );
  }

  /* ---------- Accueil ---------- */
  function vueAccueil() {
    const maintenant = new Date();
    let date = "";
    try {
      date = new Intl.DateTimeFormat(LOCALES[etat.langue], { weekday: "long", day: "numeric", month: "long" }).format(maintenant);
    } catch (e) { /* pas de date, ce n'est pas grave */ }
    const nbLille = nbOuverts(D.lieux, maintenant);

    const haut =
      '<div class="bande-haut">' + marque() +
      '<button type="button" class="rond-verre" data-action="menu-langue" aria-haspopup="true" aria-expanded="false" aria-label="' + esc(t("langue")) + '">' + icone("i-globe") + "</button></div>" +
      (date ? '<p class="bande-date">' + esc(date) + "</p>" : "") +
      '<h1 class="bande-titre"><span>' + esc(t("bonjour")) + "</span> " + esc(t("besoin")) + "</h1>" +
      htmlRecherche() +
      '<a class="proche" href="#proche"><span class="proche-ic">' + icone("i-position") + "</span>" +
      '<span class="proche-txt"><strong>' + esc(t("procheCta")) + "</strong><small>" + esc(t(nbLille === 0 ? "liveLille0" : nbLille === 1 ? "liveLille1" : "liveLilleN", { n: nbLille })) + "</small></span>" +
      icone("i-chevron", "chevron") + "</a>";

    const femmes = resumeOuverts(D.lieux.filter(pourFemmes), maintenant);
    const tuiles = D.familles.map((f) => {
      const r = resumeOuverts(D.lieux.filter((l) => dansFamille(l, f)), maintenant);
      return (
        '<li><a class="tuile" href="' + lienFamille(f) + '" aria-label="' + esc(nomFamille(f) + " : " + r.long) + '">' +
        '<span class="tuile-ic">' + icone(f.icone) + "</span>" +
        '<span class="tuile-nom">' + esc(nomFamille(f)) + "</span>" +
        '<span class="tuile-nb tuile-nb--' + r.classe + '" aria-hidden="true">' + esc(r.court) + "</span></a></li>"
      );
    }).join("");

    return (
      bandeau(haut, "bande--accueil") +
      '<div class="feuille">' +
      htmlBandeauInstallation() +
      '<div class="accueil-grille">' +
      '<a class="carte-femmes" href="#pourvous"><span class="carte-femmes-ic">' + icone("i-coeur") + "</span>" +
      '<span class="carte-femmes-txt"><span class="etiquette">' + esc(t("femmesTitre")) + "</span><strong>" + esc(femmes.long) + "</strong><small>" + esc(t("femmesSous")) + "</small></span>" +
      icone("i-chevron", "chevron") + "</a>" +
      '<section class="besoins" aria-labelledby="h-besoins"><h2 id="h-besoins" class="visuellement-cache">' + esc(t("jeCherche")) + "</h2>" +
      '<ul class="grille">' + tuiles + "</ul>" +
      '<a class="lien-toutes" href="#rubrique-toutes">' + esc(t("fam_toutes")) + icone("i-chevron", "chevron") + "</a></section>" +
      "</div>" +
      htmlMoment(maintenant) +
      htmlLive(maintenant) +
      '<p class="note-bas">' + esc(t("prototype")) + "<br>" + esc(t("donneesDu", { date: formatDate(D.majDonnees) })) + "</p>" +
      "</div>"
    );
  }

  /* ---------- « En ce moment » : les infos utiles maintenant, en cartes qui défilent ----------
   * Météo de Lille (Open-Meteo, gardée 3 h), périodes de l'année (plan hiver…), lieux ouverts ou qui
   * ouvrent bientôt pour dormir, manger, se laver, lieux réservés aux femmes, réouvertures, la nuit.
   * Les cartes défilent seules (une barre se remplit sous la carte en cours) ; un doigt, la souris
   * ou le clavier les arrêtent ; on peut les faire glisser. Rien ne bouge si « réduire les animations ». */
  function infosDuMoment(maintenant) {
    const infos = [];
    const h = maintenant.getHours();
    const appeler115 = t("appeler") + " 115";

    const alerte = infoMeteo(maintenant);
    if (alerte) {
      const froid = alerte.lien === "tel:115"; // gel ou froid : appeler le 115 ; chaleur : se mettre au frais
      infos.push({
        type: alerte.type === "alerte" ? (froid ? "froid" : "chaleur") : "pluie",
        eti: t("imEtiMeteo"),
        icone: alerte.type !== "alerte" ? "i-pluie" : froid ? "i-flocon" : "i-soleil",
        texte: alerte.texte,
        lien: alerte.lien,
        action: alerte.lien === "tel:115" ? appeler115 : t("voirLieux")
      });
    } else if (etat.meteo) {
      const m = etat.meteo;
      const auj = isoJour(maintenant);
      const i = m.jours.indexOf(auj);
      if (i !== -1 && typeof m.max[i] === "number") {
        const nuit = h < 6 ? m.min[i] : m.min[i + 1];
        infos.push({
          type: "meteo",
          eti: t("imEtiMeteo"),
          icone: "i-soleil",
          texte: t("im_meteo", { max: Math.round(m.max[i]), min: Math.round(typeof nuit === "number" ? nuit : m.min[i]) })
        });
      }
    }

    (D.infos || []).filter((x) => dansPeriode(x, maintenant)).forEach((x) => {
      infos.push({
        type: x.type === "alerte" ? "hiver" : "info",
        eti: t("imEtiInfo"),
        icone: x.type === "alerte" ? "i-flocon" : "i-info",
        texte: x.texte[etat.langue] || x.texte.fr,
        lien: x.lien,
        action: x.lien === "tel:115" ? appeler115 : t("voirLieux")
      });
    });

    // Les lieux : le plus proche d'abord si la position est connue
    const proche = (a, b) => (etat.position && aCoord(a.l) && aCoord(b.l) ? distanceM(etat.position, a.l) - distanceM(etat.position, b.l) : 0);
    const candidats = (filtre) => D.lieux.filter(filtre).map((l) => ({ l: l, mo: momentLieu(l, maintenant) })).filter((x) => x.mo);
    const ouvertDabord = (liste) => liste.filter((x) => x.mo.ouvert).sort(proche)[0];
    const bientot = (liste, max) => liste.filter((x) => !x.mo.ouvert && x.mo.dans <= max).sort((a, b) => a.mo.dans - b.mo.dans)[0];
    const carteLieu = (type, eti, ic, cle, x, heure) => ({ type: type, eti: eti, icone: ic, texte: t(cle, { nom: x.l.nom, h: formatHeure(heure) }), lien: "#lieu-" + x.l.id, action: t("voirFiche") });

    const dormir = candidats((l) => dansCat(l, "dormir"));
    const dOuvert = ouvertDabord(dormir);
    const dSoir = bientot(dormir, 600);
    if (dOuvert) infos.push(carteLieu("dormir", t("imEtiMaintenant"), "i-lune", "im_dormirOuvert", dOuvert, dOuvert.mo.fin));
    else if (dSoir) infos.push(carteLieu("dormir", t("imEtiSoir"), "i-lune", "im_dormirSoir", dSoir, dSoir.mo.debut));

    const manger = candidats((l) => dansCat(l, "manger"));
    const mOuvert = ouvertDabord(manger);
    const mBientot = bientot(manger, 180);
    if (mOuvert) infos.push(carteLieu("manger", t("imEtiMaintenant"), "i-bol", "im_mangerOuvert", mOuvert, mOuvert.mo.fin));
    else if (mBientot) infos.push(carteLieu("manger", t("imEtiBientot"), "i-bol", "im_mangerBientot", mBientot, mBientot.mo.debut));

    const laver = D.lieux.filter((l) => dansCat(l, "hygiene") && statut(l, maintenant).ouvert === true).length;
    if (laver) infos.push({ type: "laver", eti: t("imEtiMaintenant"), icone: "i-goutte", texte: t(laver === 1 ? "im_laver1" : "im_laver", { n: laver }), lien: "#cat-hygiene", action: t("voirLieux") });

    const femmes = ouvertDabord(candidats((l) => { const f = pourFemmes(l); return f && f.niveau !== "specialise"; }));
    if (femmes) infos.push(carteLieu("femmes", t("femmesTitre"), "i-coeur", "im_femmes", femmes, femmes.mo.fin));

    // La nuit : combien de lieux restent ouverts
    if (h >= 21 || h < 7) {
      const n = D.lieux.filter((l) => (l.adresse || l.adresseMasquee) && statut(l, maintenant).ouvert === true).length;
      if (n) infos.push({ type: "nuit", eti: t("imEtiSoir"), icone: "i-lune", texte: t("im_nuit", { n: n }), lien: "#proche", action: t("voirLieux") });
    }

    // Réouvertures dans les 7 jours (par ex. les Restos du Cœur à la campagne d'hiver)
    const dans7 = isoJour(new Date(maintenant.getTime() + 7 * 864e5));
    const rouvrent = D.lieux.filter((l) => l.fermeTemp && l.fermeTemp.jusqu && fermeEnCeMoment(l) && l.fermeTemp.jusqu < dans7)
      .sort((a, b) => (a.fermeTemp.jusqu < b.fermeTemp.jusqu ? -1 : 1));
    if (rouvrent.length) {
      const premier = rouvrent[0];
      const memes = rouvrent.filter((l) => l.fermeTemp.jusqu === premier.fermeTemp.jusqu && (l.structure || l.nom) === (premier.structure || premier.nom));
      const lendemain = new Date(premier.fermeTemp.jusqu + "T12:00:00");
      lendemain.setDate(lendemain.getDate() + 1);
      infos.push({
        type: "rouvre",
        eti: t("imEtiBientot"),
        icone: "i-check",
        texte: t("im_rouvre", { nom: memes.length > 1 && premier.structure ? premier.structure : premier.nom, date: formatJour(lendemain) }),
        lien: memes.length > 1 ? "#cat-" + premier.cat : "#lieu-" + premier.id,
        action: memes.length > 1 ? t("voirLieux") : t("voirFiche")
      });
    }
    return infos;
  }

  function isoJour(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function formatJour(d) {
    try {
      return new Intl.DateTimeFormat(LOCALES[etat.langue], { weekday: "long", day: "numeric", month: "long" }).format(d);
    } catch (e) {
      return isoJour(d);
    }
  }

  function htmlMoment(maintenant) {
    const infos = infosDuMoment(maintenant);
    if (!infos.length) return "";
    const n = infos.length;
    const cartes = infos.map((x, i) => {
      const dedans =
        '<span class="moment-haut"><span class="moment-ic">' + icone(x.icone) + '</span><span class="moment-eti">' + esc(x.eti) + "</span></span>" +
        '<span class="moment-txt">' + esc(x.texte) + "</span>" +
        (x.lien ? '<span class="moment-action">' + esc(x.action) + icone("i-chevron", "chevron") + "</span>" : "");
      return (
        '<li class="moment-carte moment--' + x.type + '" aria-roledescription="info" aria-label="' + esc(t("im_numero", { i: i + 1, n: n })) + '">' +
        (x.lien ? '<a class="moment-lien" href="' + esc(x.lien) + '">' + dedans + "</a>" : '<div class="moment-lien">' + dedans + "</div>") +
        "</li>"
      );
    }).join("");
    return (
      '<section class="moment" aria-roledescription="carrousel" aria-labelledby="h-moment">' +
      '<div class="section-tete"><h2 id="h-moment">' + esc(t("enCeMoment")) + "</h2>" +
      (n > 1 ? '<button type="button" class="moment-pause" data-action="moment-pause" aria-pressed="' + etat.momentPause + '" aria-label="' + esc(t(etat.momentPause ? "imReprendre" : "imPause")) + '">' + icone(etat.momentPause ? "i-lecture" : "i-pause") + "</button>" : "") +
      "</div>" +
      '<ul class="moment-piste">' + cartes + "</ul>" +
      (n > 1 ? '<div class="moment-barres" aria-hidden="true">' + infos.map(() => "<span><i></i></span>").join("") + "</div>" : "") +
      "</section>"
    );
  }

  // Défilement des cartes « En ce moment » : la barre de la carte en cours se remplit, puis carte suivante
  function animerMoment() {
    const boite = document.querySelector("#vue .moment");
    if (!boite) return;
    const piste = boite.querySelector(".moment-piste");
    const cartes = Array.from(piste.children);
    const barres = Array.from(boite.querySelectorAll(".moment-barres > span"));
    if (cartes.length < 2) return;
    const calme = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let courant = 0;
    let retenu = false;
    let attente = null;

    const decalage = (carte) => {
      const p = piste.getBoundingClientRect();
      const r = carte.getBoundingClientRect();
      const marge = parseFloat(getComputedStyle(piste).paddingInlineStart) || 0;
      return getComputedStyle(piste).direction === "rtl" ? r.right - (p.right - marge) : r.left - (p.left + marge);
    };
    const montrer = (i) => {
      courant = i;
      etat.momentIndex = i;
      barres.forEach((b, k) => {
        b.className = k < i ? "passe" : k === i ? "actif" : "";
        // relancer l'animation de la barre en cours
        const trait = b.firstElementChild;
        trait.style.animation = "none";
        void trait.offsetWidth;
        trait.style.animation = "";
      });
      boite.classList.toggle("en-pause", calme || retenu || etat.momentPause);
    };
    const aller = (i) => {
      piste.scrollBy({ left: decalage(cartes[i]), behavior: calme ? "auto" : "smooth" });
      montrer(i);
    };
    const retenir = (oui) => {
      retenu = oui;
      boite.classList.toggle("en-pause", calme || retenu || etat.momentPause);
    };

    // Quand la barre est pleine : carte suivante (la première après la dernière)
    barres.forEach((b, k) => b.firstElementChild.addEventListener("animationend", () => {
      if (k === courant && document.body.contains(piste)) aller((courant + 1) % cartes.length);
    }));
    // Glisser du doigt : la carte la plus proche du bord devient la carte en cours
    piste.addEventListener("scroll", () => {
      clearTimeout(attente);
      attente = setTimeout(() => {
        let mieux = 0;
        cartes.forEach((c, k) => { if (Math.abs(decalage(c)) < Math.abs(decalage(cartes[mieux]))) mieux = k; });
        if (mieux !== courant) montrer(mieux);
      }, 120);
    }, { passive: true });
    piste.addEventListener("pointerdown", () => retenir(true));
    piste.addEventListener("pointerup", () => setTimeout(() => retenir(false), 2500));
    piste.addEventListener("mouseenter", () => retenir(true));
    piste.addEventListener("mouseleave", () => retenir(false));
    boite.addEventListener("focusin", () => retenir(true));
    boite.addEventListener("focusout", () => retenir(false));
    const depart = Math.min(etat.momentIndex, cartes.length - 1);
    if (depart) piste.scrollBy({ left: decalage(cartes[depart]), behavior: "auto" });
    montrer(depart);
  }

  /* ---------- « Ouvert près de vous » : le grand chiffre et le lieu le plus proche ---------- */
  function htmlLive(maintenant) {
    const ouverts = D.lieux.filter((l) => aCoord(l) && statut(l, maintenant).ouvert === true);
    let corps;
    if (etat.position) {
      const tri = ouverts.map((l) => ({ l: l, d: distanceM(etat.position, l) })).sort((a, b) => a.d - b.d);
      const rayon = tri.some((x) => x.d <= 500) ? 500 : tri.some((x) => x.d <= 1000) ? 1000 : 0;
      const n = rayon ? tri.filter((x) => x.d <= rayon).length : 0;
      const plus = tri[0];
      corps =
        '<div class="live-chiffre"><span class="live-n">' + n + "</span><p>" +
        esc(rayon ? t(n === 1 ? "live1MoinsDe" : "liveMoinsDe", { d: rayon === 500 ? "500 m" : "1 km" }) : t("liveLoin")) + "</p></div>" +
        (plus
          ? '<div class="live-plus"><p class="etiquette">' + esc(t("livePlusProche")) + "</p>" +
            '<a class="live-nom" href="#lieu-' + plus.l.id + '">' + esc(plus.l.nom) + "</a>" +
            '<p class="live-meta"><span dir="ltr">' + esc(distanceCourte(plus.d)) + "</span> · " + esc(statut(plus.l, maintenant).texte) + "</p>" +
            '<div class="live-boutons"><a class="bouton bouton--blanc" href="#guide-' + plus.l.id + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a>" +
            (plus.l.tel ? '<a class="bouton bouton--vert" href="' + telLien(plus.l.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
            "</div></div>"
          : "");
    } else {
      const n = nbOuverts(D.lieux, maintenant);
      corps =
        '<div class="live-chiffre"><span class="live-n">' + n + "</span><p>" + esc(t(n === 1 ? "liveMaintenant1" : "liveMaintenantN")) + "</p></div>" +
        '<div class="live-plus"><p class="live-meta">' + esc(etat.positionMessage ? t(etat.positionMessage, { nom: "" }) : t("liveSansPosition")) + "</p>" +
        '<div class="live-boutons"><button type="button" class="bouton bouton--blanc" data-action="proche-accueil">' + icone("i-position") + esc(t("liveTrouver")) + "</button>" +
        '<a class="bouton bouton--verre" href="#proche">' + esc(t("voirTout")) + "</a></div></div>";
    }
    return '<section class="live" aria-labelledby="h-live"><p class="etiquette" id="h-live">' + icone("i-position") + esc(t("liveTitre")) + "</p>" + corps + "</section>";
  }

  /* ---------- Proposer d'installer l'appli ---------- */
  function htmlInstallation() {
    if (estInstallee()) return '<p class="ok">' + icone("i-check") + esc(t("installee")) + "</p>";
    if (etat.installation) return '<button type="button" class="bouton bouton--nuit" data-action="installer">' + icone("i-installer") + esc(t("installer")) + "</button>";
    return '<p class="aide">' + esc(estIOS() ? t("installerIOS") : t("installerAutre")) + "</p>";
  }

  function htmlBandeauInstallation() {
    if (estInstallee() || dansUnCadre() || stock.lire("installMasque", false)) return "";
    if (!etat.installation && !estIOS()) return "";
    return (
      '<section class="carte installer" aria-labelledby="h-installer">' +
      '<p class="installer-titre" id="h-installer">' + icone("i-installer") + esc(t("installerTitre")) + "</p>" +
      "<p>" + esc(t("installerBandeau")) + "</p>" +
      (etat.installation ? "" : '<p class="aide">' + esc(t("installerIOS")) + "</p>") +
      '<div class="boutons">' +
      (etat.installation ? '<button type="button" class="bouton bouton--nuit" data-action="installer">' + esc(t("installerCourt")) + "</button>" : "") +
      '<button type="button" class="bouton bouton--gris" data-action="installer-plus-tard">' + esc(t("installerPlusTard")) + "</button>" +
      "</div></section>"
    );
  }

  /* ---------- Listes de lieux ---------- */
  function htmlFiltres(o) {
    const p = etat.position;
    const actif = !!(p && etat.triDistance);
    const nbAutres = CRITERES.filter((f) => etat.filtres.has(f)).length;
    let msg = "";
    if (etat.positionMessage === "positionEnCours") msg = t("positionEnCours");
    else if (etat.positionMessage === "gpsGarde" && p) msg = t("gpsGarde", { nom: p.nom || t("positionAffiche") });
    else if (etat.positionMessage) msg = t(etat.positionMessage);
    else if (actif) msg = p.source === "gps" ? t("positionOk") + " " + t("positionPrive") : t("positionQR", { nom: p.nom || t("positionAffiche") });
    return (
      '<div class="puces">' +
      '<button type="button" class="puce" data-action="proche" aria-pressed="' + actif + '">' + icone("i-position") + esc(t("presDeMoi")) + "</button>" +
      (o.ouvert ? '<button type="button" class="puce" data-action="filtre" data-filtre="ouvert" aria-pressed="' + etat.filtres.has("ouvert") + '">' + esc(t("f_ouvert")) + "</button>" : "") +
      '<button type="button" class="puce" data-action="filtres" aria-expanded="' + etat.filtresOuverts + '" aria-controls="filtres-plus">' + icone("i-reglages") + esc(t("filtres")) +
      '<span class="nb-filtres">' + (nbAutres ? " " + nbAutres : "") + "</span></button>" +
      "</div>" +
      (msg ? '<p class="position-msg" role="status">' + esc(msg) + "</p>" : "")
    );
  }

  function htmlFiltresPlus() {
    return (
      '<div id="filtres-plus" class="filtres-plus carte"' + (etat.filtresOuverts ? "" : " hidden") + ' role="group" aria-label="' + esc(t("filtres")) + '">' +
      CRITERES.map((f) => '<button type="button" class="puce puce--claire" data-action="filtre" data-filtre="' + f + '" aria-pressed="' + etat.filtres.has(f) + '">' + esc(t("f_" + f)) + "</button>").join("") +
      "</div>"
    );
  }

  function htmlLigne(x, avecCat, avecFemmes) {
    const l = x.l;
    const cat = categorie(l.cat);
    const f = avecFemmes ? pourFemmes(l) : null;
    return (
      '<li class="ligne"><a class="ligne-lien" href="#lieu-' + l.id + '">' +
      '<span class="ligne-ic">' + icone(cat.icone) + "</span>" +
      '<span class="ligne-corps">' +
      (avecCat ? '<span class="ligne-cat">' + esc(t("cat_" + l.cat)) + "</span>" : "") +
      '<span class="ligne-nom">' + esc(l.nom) + "</span>" + badgeFemmes(l) +
      (f && f.texte ? '<span class="ligne-femmes">' + esc(f.texte) + "</span>" : "") +
      '<span class="ligne-meta"><span class="statut statut--' + x.s.classe + '">' + esc(x.s.texte) + "</span>" +
      (x.d !== null ? '<span class="ligne-dist" dir="ltr">' + esc(distanceCourte(x.d)) + "</span>" : "") +
      "</span></span>" + icone("i-chevron", "chevron") + "</a>" +
      (l.tel ? '<a class="ligne-appel" href="' + telLien(l.tel) + '" aria-label="' + esc(t("appeler") + " " + l.nom) + '">' + icone("i-tel") + "</a>" : "") +
      "</li>"
    );
  }

  function htmlListe(prepares, avecCat, avecFemmes) {
    if (!prepares.length) return '<p class="vide">' + esc(t("aucun")) + "</p>";
    return (
      '<p class="compte">' + esc(prepares.length === 1 ? t("nbLieu1") : t("nbLieux", { n: prepares.length })) + " · " + esc(t("aConfirmer")) + "</p>" +
      '<ul class="liste">' + prepares.map((x) => htmlLigne(x, avecCat, avecFemmes)).join("") + "</ul>"
    );
  }

  // Une page de liste : bandeau avec les filtres, puis les lieux (et la carte à droite sur ordinateur)
  function pageListe(o) {
    return (
      bandeauPage({ titre: o.titre, sous: o.sous, icone: o.icone, iconeClasse: o.iconeClasse, retour: o.retour, apres: (o.avantFiltres || "") + htmlFiltres({ ouvert: !o.forcerOuvert }) }) +
      '<div class="feuille">' +
      colonnes(htmlFiltresPlus() + (o.avant || "") + '<div id="resultats">' + htmlListe(preparer(o.lieux, o.forcerOuvert), o.avecCat, o.avecFemmes) + "</div>" + (o.apres || "")) +
      "</div>"
    );
  }

  function vueCategorie(id) {
    const c = categorie(id);
    if (!c) return vueAccueil();
    const rappel = id === "dormir" || id === "ecoute" ? '<p class="carte rappel">' + icone("i-tel") + "<span>" + esc(t("rappel_" + id)) + "</span></p>" : "";
    const eq = id === "hygiene" ? '<a class="carte lien-ligne" href="#carte-toilettes">' + icone("i-wc") + "<span>" + esc(t("eq_voirCarte")) + "</span>" + icone("i-chevron", "chevron") + "</a>" : "";
    return pageListe({ titre: t("cat_" + id), sous: t("catd_" + id), icone: c.icone, lieux: D.lieux.filter((l) => dansCat(l, id)), avant: rappel + eq });
  }

  // Une grande catégorie de plusieurs besoins (Matériel, Technologie) ou toutes les catégories
  function vueRubrique(id) {
    const f = id === "toutes" ? { id: "toutes", icone: "i-grille", cats: D.categories.map((c) => c.id) } : famille(id);
    if (!f) return vueAccueil();
    const raccourcis = '<nav class="puces puces--sous" aria-label="' + esc(t("jeCherche")) + '">' +
      f.cats.map((c) => '<a class="puce" href="#cat-' + c + '">' + icone(categorie(c).icone) + esc(t("cat_" + c)) + "</a>").join("") + "</nav>";
    return pageListe({
      titre: id === "toutes" ? t("fam_toutes") : nomFamille(f),
      sous: t("famd_" + f.id),
      icone: f.icone,
      lieux: id === "toutes" ? D.lieux : D.lieux.filter((l) => dansFamille(l, f)),
      avecCat: true,
      avantFiltres: id === "toutes" ? "" : raccourcis
    });
  }

  function vueProche() {
    // Demander la position une seule fois, au moment où la personne en a besoin
    if (!etat.gpsDemande && !(etat.position && etat.position.source === "gps")) setTimeout(demanderPosition, 0);
    return pageListe({ titre: t("procheTitre"), sous: t("procheSous"), icone: "i-position", iconeClasse: "page-ic--bleu", lieux: D.lieux, forcerOuvert: true, avecCat: true });
  }

  function vueFavoris() {
    const liste = etat.favoris.map(lieu).filter(Boolean);
    if (!liste.length) {
      return bandeauPage({ titre: t("favorisTitre"), icone: "i-etoile" }) + '<div class="feuille"><p class="vide">' + esc(t("favorisVide")) + "</p></div>";
    }
    return pageListe({ titre: t("favorisTitre"), icone: "i-etoile", lieux: liste, avecCat: true });
  }

  function vuePourVous() {
    const niveaux = ["reserve", "creneau", "specialise"];
    const lieux = (niveau) => D.lieux.filter((l) => { const f = pourFemmes(l); return f && f.niveau === niveau; });
    const protections = D.lieux.filter((l) => l.protections);
    const sommaire = '<nav class="puces puces--sous" aria-label="' + esc(t("pvTitre")) + '">' +
      niveaux.filter((x) => lieux(x).length).map((x) => '<a class="puce" href="#pourvous-' + x + '">' + esc(t("pvCourt_" + x)) + " · " + lieux(x).length + "</a>").join("") +
      '<a class="puce" href="#pourvous-protections">' + esc(t("pvCourt_protections")) + "</a></nav>";
    const groupes = niveaux.map((niveau) => {
      const l = lieux(niveau);
      return l.length ? '<section class="groupe" id="pv-' + niveau + '"><h2 class="titre-section">' + esc(t("pv_" + niveau)) + "</h2>" + htmlListe(preparer(l), true, true) + "</section>" : "";
    }).join("");
    return (
      bandeauPage({ titre: t("pvTitre"), sous: t("pvSous"), icone: "i-coeur", iconeClasse: "page-ic--blanc", apres: sommaire + htmlFiltres({ ouvert: false }) }) +
      '<div class="feuille">' +
      colonnes(
        htmlFiltresPlus() + groupes +
        '<section class="groupe" id="pv-protections"><h2 class="titre-section">' + esc(t("pv_protections")) + "</h2>" +
        '<p class="carte texte">' + esc(t(protections.length ? "pvProtectionsIntro" : "pvProtectionsVide")) + "</p>" +
        (protections.length ? htmlListe(preparer(protections), true, false) : "") + "</section>"
      ) +
      "</div>"
    );
  }

  function htmlResultatsRecherche() {
    if (!etat.recherche.trim()) return '<p class="vide">' + esc(t("rechVide")) + "</p>";
    const prepares = preparer(chercher(etat.recherche));
    if (!prepares.length) return '<p class="vide">' + esc(t("rechAucun")) + "</p>";
    return htmlListe(prepares, true);
  }

  function vueRecherche() {
    const familles = '<section class="groupe"><h2 class="titre-section">' + esc(t("rechOu")) + '</h2><nav class="puces puces--claires">' +
      '<a class="puce" href="#pourvous">' + icone("i-coeur") + esc(t("femmesTitre")) + "</a>" +
      D.familles.map((f) => '<a class="puce" href="' + lienFamille(f) + '">' + icone(f.icone) + esc(nomFamille(f)) + "</a>").join("") + "</nav></section>";
    return (
      bandeauPage({ titre: t("rechBouton"), icone: "i-loupe", apres: htmlRecherche() + htmlFiltres({ ouvert: true }) }) +
      '<div class="feuille">' + colonnes(htmlFiltresPlus() + '<div id="resultats">' + htmlResultatsRecherche() + "</div>" + familles) + "</div>"
    );
  }

  /* ---------- Fiche d'un lieu ---------- */
  function vueLieu(id) {
    const l = lieu(id);
    if (!l) return bandeauPage({ titre: t("introuvable") }) + '<div class="feuille"></div>';
    const cat = categorie(l.cat);
    const maintenant = new Date();
    const s = statut(l, maintenant);
    const fav = etat.favoris.indexOf(l.id) !== -1;
    const aujourdhui = JOURS[maintenant.getDay()];
    const femmes = pourFemmes(l);
    const acces = l.adresseMasquee && l.acces ? lieu(l.acces) : null;
    const allerA = l.adresseMasquee ? (acces && aCoord(acces) ? acces.id : null) : l.adresse || aCoord(l) ? l.id : null;
    const distance = etat.position && aCoord(l) ? distanceM(etat.position, l) : null;

    let horaires;
    if (l.horaires === "24/7") horaires = "<p>" + esc(t("h24")) + "</p>";
    else if (!l.horaires) {
      horaires = "<p>" + esc(t("horairesInconnus")) + "</p>" + (l.horairesTexte ? '<p class="aide">' + esc(t("horairesSource")) + " : " + esc(l.horairesTexte) + "</p>" : "");
    } else {
      horaires = '<table class="horaires"><tbody>' + SEMAINE.map((j) =>
        "<tr" + (j === aujourdhui ? ' class="auj"' : "") + '><th scope="row">' + esc(t("jours")[j]) + (j === aujourdhui ? " · " + esc(t("aujourdhui")) : "") +
        "</th><td>" + (plages(l, j).length ? plages(l, j).map((x) => esc(formatHeure(x[0]) + " – " + formatHeure(x[1]))).join("<br>") : esc(t("ferme"))) + "</td></tr>"
      ).join("") + "</tbody></table>";
    }

    const criteres = CRITERES.filter((c) => l.criteres && l.criteres[c]);
    const langues = (l.langues || []).map((c) => t("nomsLangues")[c] || c);

    const actions =
      '<div class="fiche-actions">' +
      (allerA ? '<a class="bouton bouton--blanc" href="#guide-' + allerA + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a>" : "") +
      (l.tel ? '<a class="bouton bouton--vert" href="' + telLien(l.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
      "</div>";
    // Garder et Envoyer : en haut à droite, comme dans une barre d'iPhone
    const ronds =
      '<div class="bande-ronds">' +
      '<button type="button" class="rond-verre" data-action="garder" data-id="' + l.id + '" aria-pressed="' + fav + '" aria-label="' + esc(fav ? t("garde") : t("garder")) + '">' + icone(fav ? "i-etoile-pleine" : "i-etoile") + "</button>" +
      '<button type="button" class="rond-verre" data-action="partager" data-id="' + l.id + '" aria-label="' + esc(t("partager")) + '">' + icone("i-partager") + "</button>" +
      "</div>";

    const adresse =
      '<div class="carte infos-lieu">' +
      (l.adresseMasquee
        ? '<div class="info">' + icone("i-bouclier") + "<span>" + esc(t("adresseMasquee")) +
          (acces ? '<br><span class="aide">' + esc(t("ouDemander")) + ' <a href="#lieu-' + acces.id + '">' + esc(acces.nom) + "</a></span>" : "") + "</span></div>"
        : !l.adresse
        ? '<div class="info">' + icone("i-tel") + "<span>" + esc(t("sansAdresse")) + "</span></div>"
        : '<div class="info">' + icone("i-carte") + '<span><span class="adresse-txt" dir="ltr">' + esc(l.adresse) + "</span>" +
          (distance !== null ? '<br><span class="aide">' + esc(formatDistance(distance)) + "</span>" : "") + "</span>" +
          '<button type="button" class="bouton-mini" data-action="copier" data-texte="' + esc(l.adresse) + '">' + esc(t("copier")) + "</button></div>") +
      (l.tel ? '<div class="info">' + icone("i-tel") + '<a class="lien-tel" dir="ltr" href="' + telLien(l.tel) + '">' + esc(l.tel) + "</a></div>" : "") +
      "</div>";

    return (
      bandeau(
        '<div class="bande-haut">' + retour() + ronds + "</div>" +
        '<p class="fiche-cat">' + esc(t("cat_" + l.cat)) + " · " + esc(t("fictif")) + "</p>" +
        '<h1 class="fiche-nom">' + esc(l.nom) + "</h1>" +
        '<p class="pastille-statut statut--' + s.classe + '"><i aria-hidden="true"></i>' + esc(s.texte) + "</p>" +
        actions,
        "bande--page bande--fiche"
      ) +
      '<div class="feuille">' +
      colonnes(
        (fermeEnCeMoment(l) && l.fermeTemp.texte ? '<p class="carte note note--ferme">' + icone("i-alerte") + '<span lang="fr">' + esc(l.fermeTemp.texte) + "</span></p>" : "") +
        (l.noteEquipe ? '<p class="carte note">' + icone("i-info") + "<span><strong>" + esc(t("noteEquipe")) + '</strong> <span lang="fr">' + esc(l.noteEquipe) + "</span></span></p>" : "") +
        adresse +
        (femmes && femmes.texte ? '<section class="carte bloc-femmes"><h2>' + icone("i-coeur") + esc(t("encartFemmes")) + "</h2>" + badgeFemmes(l) + "<p>" + esc(femmes.texte) + "</p></section>" : "") +
        '<section class="carte bloc"><h2>' + esc(t("horaires")) + "</h2>" + horaires + "</section>" +
        '<section class="carte bloc"><h2>' + esc(t("surPlace")) + '</h2><ul class="puces-txt">' + l.services.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></section>" +
        (l.conditions ? '<section class="carte bloc"><h2>' + esc(t("conditions")) + "</h2><p>" + esc(l.conditions) + "</p></section>" : "") +
        (criteres.length ? '<section class="carte bloc"><h2>' + esc(t("bonASavoir")) + '</h2><ul class="criteres">' + criteres.map((c) => "<li>" + icone("i-check") + esc(t("f_" + c)) + "</li>").join("") + "</ul></section>" : "") +
        (langues.length ? '<section class="carte bloc"><h2>' + esc(t("languesParlees")) + "</h2><p>" + esc(langues.join(", ")) + "</p></section>" : "") +
        htmlAvis(l) +
        '<details class="carte signaler"><summary>' + icone("i-drapeau") + esc(t("signaler")) + icone("i-chevron", "chevron") + "</summary>" +
        htmlFormSignaler(l.id, ["ferme", "horaires", "adresse", "accueil", "autre"]) + "</details>" +
        '<div class="note-bas note-bas--gauche"><p>' + esc(t("verifie", { date: formatDate(l.verifie) })) + " " + esc(t("appelerAvant")) + "</p>" +
        (l.sources && l.sources.length ? "<p>" + esc(t("sources")) + " : " + l.sources.map((u) => '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(hote(u)) + "</a>").join(", ") + "</p>" : "") +
        "</div>"
      ) +
      "</div>"
    );
  }

  function htmlAvis(l) {
    if (avisDonne(l.id)) return '<section class="carte avis"><p class="ok">' + icone("i-check") + esc(t("avisMerci")) + "</p></section>";
    return (
      '<section class="carte avis"><h2>' + esc(t("avisQuestion")) + "</h2>" +
      '<div class="boutons">' +
      '<button type="button" class="bouton bouton--gris" data-action="avis" data-id="' + l.id + '" data-valeur="oui">👍 ' + esc(t("avisOui")) + "</button>" +
      '<button type="button" class="bouton bouton--gris" data-action="avis" data-id="' + l.id + '" data-valeur="non">👎 ' + esc(t("avisNon")) + "</button>" +
      "</div></section>"
    );
  }

  /* Formulaire « Signaler » : sur chaque fiche (lieu) ou pour toute l'appli (lieu vide) */
  function htmlFormSignaler(idLieu, raisons) {
    return (
      '<form class="form-signaler" data-lieu="' + esc(idLieu) + '"><fieldset><legend>' + esc(t("signalerQuoi")) + "</legend>" +
      raisons.map((r, i) => '<label class="choix-ligne"><input type="radio" name="raison" value="' + r + '"' + (i === 0 ? " required" : "") + "> " + esc(t("sig_" + r)) + "</label>").join("") +
      '<label class="champ"><span>' + esc(t("signalerPrecisez")) + '</span><textarea name="message" rows="3" maxlength="500"></textarea></label>' +
      '<p class="aide">' + esc(t("signalerAnonyme")) + "</p>" +
      // Champ piège invisible : seuls les robots le remplissent
      '<input type="text" name="site" class="piege" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '</fieldset><button type="submit" class="bouton bouton--nuit">' + esc(t("envoyer")) + "</button>" +
      '<p class="merci" role="status" hidden></p></form>'
    );
  }

  function vueSignaler() {
    return (
      bandeauPage({ titre: t("signalerProbleme"), sous: t("signalerIntro"), icone: "i-drapeau" }) +
      '<div class="feuille feuille--etroite"><div class="carte signaler signaler--page">' + htmlFormSignaler("", ["manque", "bug", "traduction", "autre"]) + "</div></div>"
    );
  }

  /* ---------- Urgences et « Je ne me sens pas en sécurité » ---------- */
  function vueUrgences() {
    return (
      bandeauPage({
        marque: true,
        titre: t("navUrgences"),
        sous: t("urgIntro"),
        apres: '<a class="bouton-securite" href="#aide">' + icone("i-bouclier") + "<span>" + esc(t("aideBouton")) + "</span>" + icone("i-chevron", "chevron") + "</a>"
      }) +
      '<div class="feuille feuille--etroite">' +
      '<ul class="urgences">' + D.urgences.map((u) =>
        '<li class="carte urgence' + (u.couleur === "urgent" ? " urgence--forte" : "") + '">' +
        '<a class="urgence-num" dir="ltr" href="' + telLien(u.num) + '">' + u.num + "</a>" +
        '<p class="urgence-txt">' + esc(t("urg_" + u.id)) + "</p>" +
        '<span class="urgence-actions">' +
        (u.sms ? '<a class="rond-action rond-action--gris" href="sms:' + u.num + '" aria-label="' + esc(t("envoyerSms") + " " + u.num) + '">' + icone("i-sms") + "</a>" : "") +
        '<a class="rond-action" href="' + telLien(u.num) + '" aria-label="' + esc(t("appeler") + " " + u.num) + '">' + icone("i-tel") + "</a></span></li>"
      ).join("") + "</ul>" +
      '<p class="carte rappel">' + icone("i-info") + "<span>" + esc(t("urgEnLigne")) + "</span></p>" +
      "</div>"
    );
  }

  function vueAide() {
    const surs = lieuxSursProches(3);
    const sms = "sms:114?&body=" + encodeURIComponent(t("aideSmsTexte"));
    return (
      bandeauPage({ titre: t("aideTitre"), sous: t("aideIntro"), icone: "i-bouclier", iconeClasse: "page-ic--rouge", retour: t("navUrgences") }) +
      '<div class="feuille feuille--etroite"><ol class="etapes">' +
      '<li class="carte etape"><h2>' + esc(t("aideDanger")) + "</h2>" +
      '<a class="bouton bouton--vert bouton--large" href="' + telLien("17") + '">' + icone("i-tel") + esc(t("aideAppeler17")) + "</a></li>" +
      '<li class="carte etape"><h2>' + esc(t("aideParler")) + "</h2><p>" + esc(t("aideSmsExplique")) + "</p>" +
      '<a class="bouton bouton--nuit bouton--large" href="' + esc(sms) + '">' + icone("i-sms") + esc(t("aideSms114")) + "</a></li>" +
      '<li class="carte etape"><h2>' + esc(t("aideLieuSur")) + "</h2><p>" + esc(t("aideLieuSurExplique")) + "</p>" +
      (surs.length
        ? '<ul class="surs">' + surs.map((x) =>
            '<li><span class="ligne-ic">' + icone(ICONE_EQ[x.type]) + '</span><span class="surs-txt"><strong>' + esc(x.nom) + "</strong>" +
            "<small>" + esc(t("eq_" + x.type)) + (etat.position ? ' · <span dir="ltr">' + esc(distanceCourte(distanceM(etat.position, x))) + "</span>" : "") + "</small></span>" +
            '<a class="bouton bouton--bleu bouton--petit" href="#guide-' + x.id + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a></li>"
          ).join("") + "</ul>"
        : "") +
      (etat.position ? "" : '<button type="button" class="bouton bouton--gris" data-action="proche-aide">' + icone("i-position") + esc(t("aidePlusProche")) + "</button>") +
      "</li>" +
      '<li class="carte etape"><h2>' + esc(t("aideCommerce")) + "</h2><p>" + esc(t("aideCommerceExplique")) + "</p>" +
      '<a class="bouton bouton--vert" href="' + telLien("3237") + '">' + icone("i-tel") + esc(t("aidePharmacie")) + ' <span dir="ltr">3237</span></a></li>' +
      '<li class="carte etape"><h2>' + esc(t("aideEcoute")) + "</h2><p>" + esc(t("urg_3919")) + "</p>" +
      '<a class="bouton bouton--vert" href="' + telLien("3919") + '">' + icone("i-tel") + esc(t("appeler")) + ' <span dir="ltr">3919</span></a></li>' +
      "</ol></div>"
    );
  }

  /* ---------- Infos pratiques ---------- */
  const FICHES = {
    "115": { ic: "i-lit", tel: ["115"] },
    proteger: { ic: "i-bouclier", tel: ["3919", "17"], sms: "114" },
    sante: { ic: "i-croix", cat: "sante" },
    regles: { ic: "i-goutte", cat: "hygiene" },
    adresse: { ic: "i-papier", cat: "droits" },
    papiers: { ic: "i-sac", cat: "bagagerie", lien: "https://www.reconnect.fr", lienTxt: "reconnectLien" },
    securite: { ic: "i-bouclier", aide: true }
  };

  function vueInfos(ouvrir) {
    const actions = (f) => {
      const x = FICHES[f.id] || {};
      const liens = (x.tel || []).map((n) => '<a class="bouton bouton--vert bouton--petit" href="' + telLien(n) + '">' + icone("i-tel") + esc(t("appeler")) + ' <span dir="ltr">' + n + "</span></a>")
        .concat(x.sms ? ['<a class="bouton bouton--gris bouton--petit" href="sms:' + x.sms + '">' + icone("i-sms") + esc(t("envoyerSms")) + ' <span dir="ltr">' + x.sms + "</span></a>"] : [])
        .concat(x.cat ? ['<a class="bouton bouton--gris bouton--petit" href="#cat-' + x.cat + '">' + icone(categorie(x.cat).icone) + esc(t("cat_" + x.cat)) + "</a>"] : [])
        .concat(x.lien ? ['<a class="bouton bouton--gris bouton--petit" href="' + esc(x.lien) + '" target="_blank" rel="noopener noreferrer">' + icone("i-papier") + esc(t(x.lienTxt)) + "</a>"] : []);
      if (x.aide) liens.push('<a class="bouton bouton--rouge bouton--petit" href="#aide">' + icone("i-bouclier") + esc(t("aideBouton")) + "</a>");
      return liens.length ? '<div class="boutons">' + liens.join("") + "</div>" : "";
    };
    const plus = [
      ["#favoris", "i-etoile", t("favorisTitre")],
      ["#reglages", "i-globe", t("langue") + " · " + TR[etat.langue].nomLangue],
      ["#reglages-installer", "i-installer", t("installerCourt")],
      ["#signaler", "i-drapeau", t("signalerProbleme")],
      ["#apropos", "i-info", t("apropos")]
    ];
    return (
      bandeauPage({ marque: true, titre: t("infosTitre"), sous: t("infosSous") }) +
      '<div class="feuille feuille--etroite">' +
      '<div class="fiches">' + t("fiches").map((f) =>
        '<details class="carte fiche" id="fiche-' + f.id + '"' + (f.id === ouvrir ? " open" : "") + ">" +
        '<summary><span class="ligne-ic">' + icone((FICHES[f.id] || {}).ic || "i-info") + "</span>" +
        '<span class="fiche-tete"><span class="fiche-titre">' + esc(f.titre) + '</span><span class="fiche-resume">' + esc(f.points[0]) + "</span></span>" +
        icone("i-chevron", "chevron") + "</summary>" +
        '<ul class="puces-txt">' + f.points.slice(1).map((p) => "<li>" + esc(p) + "</li>").join("") + "</ul>" + actions(f) +
        "</details>"
      ).join("") + "</div>" +
      '<h2 class="titre-section">' + esc(t("plus")) + "</h2>" +
      '<nav class="carte liens">' + plus.map((p) => '<a href="' + p[0] + '">' + icone(p[1]) + "<span>" + esc(p[2]) + "</span>" + icone("i-chevron", "chevron") + "</a>").join("") + "</nav>" +
      "</div>"
    );
  }

  /* ---------- Réglages ---------- */
  function htmlOuvrirTelephone() {
    if (dansUnCadre() || !/^https?:$/.test(location.protocol)) return "";
    return (
      '<section class="carte bloc"><h2>' + esc(t("ouvrirTelephone")) + "</h2>" +
      '<div class="qr-telephone"><div class="qr" id="qr-site" aria-hidden="true"></div>' +
      "<p>" + esc(t("ouvrirTelephoneAide")) + '<br><strong class="lien-site">' + esc(urlSite()) + "</strong></p></div></section>"
    );
  }

  function vueReglages() {
    return (
      bandeauPage({ titre: t("reglages"), icone: "i-reglages" }) +
      '<div class="feuille feuille--etroite">' +
      '<section class="bloc-nu"><h2 class="titre-section">' + esc(t("langue")) + '</h2><div class="carte langues">' +
      LANGUES.map((l) => '<button type="button" class="langue" data-action="langue" data-valeur="' + l + '" lang="' + l + '"' + (DROITE_A_GAUCHE.indexOf(l) !== -1 ? ' dir="rtl"' : "") + ' aria-pressed="' + (etat.langue === l) + '">' +
        "<span>" + esc(TR[l].nomLangue) + "</span>" + (etat.langue === l ? icone("i-check") : "") + "</button>").join("") +
      "</div></section>" +
      '<section class="carte bloc" id="installer"><h2>' + esc(t("installer")) + '</h2><p class="aide">' + esc(t("installerAide")) + "</p>" + htmlInstallation() + "</section>" +
      htmlOuvrirTelephone() +
      '<section class="carte bloc"><h2>' + esc(t("effacer")) + '</h2><p class="aide">' + esc(t("effacerAide")) + "</p>" +
      '<div class="effacer"><button type="button" class="bouton bouton--gris bouton--danger" data-action="effacer">' + esc(t("effacerBouton")) + "</button>" +
      '<div class="effacer-confirmer boutons" hidden><button type="button" class="bouton bouton--rouge" data-action="effacer-oui">' + esc(t("confirmerEffacer")) + '</button><button type="button" class="bouton bouton--gris" data-action="effacer-non">' + esc(t("annuler")) + "</button></div>" +
      '<p class="ok" role="status" hidden>' + icone("i-check") + esc(t("effacerOk")) + "</p></div></section>" +
      "</div>"
    );
  }

  /* ---------- À propos ---------- */
  function vueApropos() {
    return (
      bandeauPage({ titre: "À propos de Paladines", icone: "i-info" }) +
      '<div class="feuille feuille--etroite"><article class="carte texte apropos" lang="fr" dir="ltr">' +
      "<p><strong>Paladines est faite pour les femmes à la rue à Lille</strong> : trouver vite un lieu ouvert et sûr près d'elles, repérer les lieux réservés aux femmes, les créneaux rien que pour elles, la santé des femmes et l'écoute en cas de violences.</p>" +
      "<p>C'est un prototype, fait pour en discuter. Les 213 lieux sont de vrais lieux de Lille, Lomme et Hellemmes, relevés sur internet et sur les sites officiels : ils doivent encore être confirmés par téléphone avant un vrai lancement. Les numéros d'urgence sont nationaux.</p>" +
      "<h2>Le principe</h2>" +
      "<p>Une femme scanne un QR code (affiche, carte remise par une maraude) et arrive ici, sans compte et sans rien installer. Elle voit tout de suite les lieux ouverts près d'elle, les infos du moment (froid, plan hiver…), et peut être guidée à pied jusqu'au lieu, même sans internet. Sa position ne quitte jamais son téléphone.</p>" +
      "<h2>Outils</h2>" +
      '<div class="boutons"><a class="bouton bouton--nuit" href="affiche.html">' + icone("i-qr") + "Créer une affiche avec QR code</a>" +
      '<a class="bouton bouton--gris" href="pro.html">' + icone("i-info") + "Guide pour les professionnelles</a>" +
      '<a class="bouton bouton--gris" href="/equipe" target="_blank" rel="noopener">' + icone("i-drapeau") + "Espace de l'équipe</a></div>" +
      "<p class=\"aide\">Espace de l'équipe : signalements, corrections des lieux, statistiques (mot de passe demandé). Les questions à trancher et la feuille de route sont dans <code>docs/IDEES.md</code> ; la liste des lieux et leurs sources dans <code>docs/LIEUX-LILLE.md</code>.</p>" +
      "</article></div>"
    );
  }

  /* =====================================================================
   * 4. Carte
   * Onglet Carte : la carte en plein écran, des filtres en haut, un panneau en bas (à gauche sur
   * ordinateur) avec la recherche, les catégories et les lieux ; un lieu touché s'ouvre dans ce panneau.
   * Sur ordinateur, la même carte se place à droite des listes et des fiches (majPanneau).
   * ===================================================================== */
  function creerCarte() {
    const ref = etat.position || D.ville;
    const carte = L.map("carte", { zoomControl: false }).setView([ref.lat, ref.lng], D.ville.zoom);
    L.control.zoom({ position: "bottomright" }).addTo(carte);
    carte.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    ajouterFond(carte);
    carte.on("click", () => {
      if (!etat.guide) fermerFicheCarte();
    });
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

  function afficherCarte() {
    rangerCarte();
    etat.panneau = null;
    etat.panneauCle = "";
    document.body.classList.remove("avec-panneau");
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
    rendreHautCarte();
    rendrePanneauCarte();
    majMarqueurs();
    majMoiSurCarte(false);
    setTimeout(() => {
      etat.carte.invalidateSize();
      cadrerCarte();
    }, 0);
  }

  // Remettre la carte à sa place, hors de l'écran qui va être redessiné
  function rangerCarte() {
    const zone = document.getElementById("vue-carte");
    if (zone.parentElement !== document.body) document.body.insertBefore(zone, document.querySelector(".onglets"));
  }

  // Ce que cachent le panneau et les boutons : pour cadrer la carte sur la partie visible
  function margesCarte() {
    const p = document.getElementById("panneau-carte");
    const c = document.getElementById("carte").getBoundingClientRect();
    const r = p && !etat.panneau && p.offsetParent ? p.getBoundingClientRect() : null;
    if (r && r.width > c.width * 0.6) return { haut: 70, bas: Math.max(40, c.bottom - r.top + 12), gauche: 30, droite: 30 };
    if (r) return { haut: 40, bas: 40, gauche: r.right - c.left + 24, droite: 40 };
    return { haut: 40, bas: 40, gauche: 40, droite: 40 };
  }

  function cadrerCarte() {
    if (etat.carteCadree || !etat.carte) return;
    if (etat.position) {
      centrerSur([etat.position.lat, etat.position.lng], 15);
      etat.carteCadree = true;
      return;
    }
    const pts = D.lieux.filter(aCoord).map((l) => [l.lat, l.lng]);
    if (pts.length >= 2) {
      const m = margesCarte();
      etat.carte.fitBounds(pts, { paddingTopLeft: [m.gauche, m.haut], paddingBottomRight: [m.droite, m.bas], maxZoom: 15 });
      etat.carteCadree = true;
    }
  }

  // Centrer un point dans la partie visible de la carte (au-dessus ou à côté du panneau)
  function centrerSur(ll, zoom) {
    const carte = etat.carte;
    const z = zoom || Math.max(carte.getZoom(), 15);
    const m = margesCarte();
    const decal = L.point((m.gauche - m.droite) / 2, (m.haut - m.bas) / 2);
    carte.setView(carte.unproject(carte.project(ll, z).subtract(decal), z), z);
  }

  function majMsgCarte() {
    const msg = document.querySelector("#vue-carte .carte-msg");
    if (!msg) return;
    let txt = "";
    if (!D.lieux.some(aCoord)) txt = t("carteSansPositions");
    else if (etat.fondEnErreur) txt = t(dansUnCadre() ? "fondApercu" : "fondIndispo");
    msg.textContent = txt;
    msg.hidden = !txt;
  }

  // Les lieux montrés : ceux de la liste (ordinateur), ou ceux qui passent les filtres de la carte
  function lieuxCarte() {
    if (etat.panneau) return D.lieux.filter((l) => etat.panneau.has(l.id));
    const maintenant = new Date();
    const f = etat.carteCat === "toutes" ? null : famille(etat.carteCat);
    const texte = etat.carteTexte.trim() ? new Set(chercher(etat.carteTexte).map((l) => l.id)) : null;
    return D.lieux.filter((l) =>
      (!f || dansFamille(l, f)) &&
      (!etat.carteOuvert || statut(l, maintenant).ouvert === true) &&
      (!etat.carteFemmes || pourFemmes(l)) &&
      (!texte || texte.has(l.id))
    );
  }

  function majMarqueurs() {
    if (!etat.coucheLieux) return;
    const maintenant = new Date();
    etat.coucheLieux.clearLayers();
    majMsgCarte();
    const points = [];
    (etat.guide ? [lieu(etat.guide.id)].filter(Boolean) : lieuxCarte()).forEach((l) => {
      const pt = pointCarte(l);
      // Pendant le guidage : seulement le lieu où l'on va (jamais une adresse protégée)
      if (!pt || (etat.guide && pt.acces)) return;
      points.push({ l: l, s: statut(l, maintenant), acces: pt.acces, lat: pt.lat, lng: pt.lng, dx: 0, dy: 0 });
    });
    ecarter(points);
    points.forEach((p) => {
      const cat = categorie(p.l.cat);
      const ic = L.divIcon({
        className: "marqueur-boite",
        html: '<span class="marqueur' + (p.s.ouvert === true ? "" : " marqueur--ferme") + (p.acces ? " marqueur--protege" : "") + (etat.ficheCarte === p.l.id ? " marqueur--choisi" : "") + '" data-id="' + p.l.id + '">' + icone(cat.icone) + "</span>",
        iconSize: [36, 36],
        iconAnchor: [18 - p.dx, 18 - p.dy]
      });
      L.marker([p.lat, p.lng], { icon: ic, title: p.l.nom, alt: p.l.nom, interactive: !etat.guide, keyboard: !etat.guide })
        .on("click", () => ouvrirFicheCarte(p.l))
        .addTo(etat.coucheLieux);
    });
    majEquip();
  }

  function majEquip() {
    if (!etat.coucheEq) return;
    etat.coucheEq.clearLayers();
    const montrer = [];
    if (etat.guide) {
      const x = equip(etat.guide.id);
      if (x) montrer.push(x);
    } else if (!etat.panneau) {
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
        .on("click", () => ouvrirFicheCarte(x))
        .addTo(etat.coucheEq);
    });
  }

  function majMarqueurChoisi() {
    document.querySelectorAll(".marqueur--choisi").forEach((m) => m.classList.remove("marqueur--choisi"));
    if (!etat.ficheCarte) return;
    const m = document.querySelector('#carte [data-id="' + etat.ficheCarte + '"]');
    if (m) m.classList.add("marqueur--choisi");
  }

  /* ---------- Les filtres en haut de la carte ---------- */
  function rendreHautCarte() {
    const haut = document.getElementById("carte-haut");
    haut.innerHTML =
      '<div class="carte-puces">' +
      '<button type="button" class="puce-carte" data-action="carte-ouvert" aria-pressed="' + etat.carteOuvert + '">' + icone("i-horloge") + esc(t("f_ouvert")) + "</button>" +
      '<button type="button" class="puce-carte" data-action="carte-femmes" aria-pressed="' + etat.carteFemmes + '">' + icone("i-coeur") + esc(t("carteFemmes")) + "</button></div>" +
      '<div class="carte-ronds">' +
      '<button type="button" id="btn-localiser" class="rond-carte rond-carte--bleu" data-action="localiser" aria-label="' + esc(t("centrerSurMoi")) + '" title="' + esc(t("centrerSurMoi")) + '">' + icone("i-position") + "</button>" +
      '<button type="button" class="rond-carte" data-action="calques" aria-expanded="' + etat.calquesOuverts + '" aria-controls="menu-calques" aria-label="' + esc(t("calquesTitre")) + '" title="' + esc(t("calquesTitre")) + '">' + icone("i-calques") + "</button>" +
      '<div id="menu-calques" class="menu-calques"' + (etat.calquesOuverts ? "" : " hidden") + '><p class="menu-titre">' + esc(t("calquesTitre")) + "</p>" +
      [["t", "i-wc", "eq_puceToilettes"], ["e", "i-goutte", "eq_puceEau"], ["s", "i-bouclier", "eq_puceSurs"]].map((x) =>
        '<button type="button" class="calque" data-action="carte-eq" data-valeur="' + x[0] + '" aria-pressed="' + etat.carteEq[x[0]] + '">' + icone(x[1]) + "<span>" + esc(t(x[2])) + "</span>" + icone("i-check", "coche") + "</button>"
      ).join("") +
      "</div></div>";
  }

  /* ---------- Le panneau : recherche, catégories, lieux, ou le lieu touché ---------- */
  function htmlPoignee() {
    return '<button type="button" class="poignee" data-action="panneau-basculer" aria-expanded="' + etat.panneauOuvert + '" aria-label="' + esc(t(etat.panneauOuvert ? "panneauReduire" : "panneauAgrandir")) + '"><span></span></button>';
  }

  function htmlListeCarte() {
    const maintenant = new Date();
    const liste = lieuxCarte().filter(aCoord)
      .map((l) => ({ l: l, s: statut(l, maintenant), d: etat.position ? distanceM(etat.position, l) : null }))
      .sort((a, b) => (a.d !== null && b.d !== null ? a.d - b.d : rangStatut(a.s) - rangStatut(b.s) || a.l.nom.localeCompare(b.l.nom, "fr")));
    if (!liste.length) return '<li class="vide">' + esc(t("aucun")) + "</li>";
    return liste.slice(0, 40).map((x) =>
      '<li><button type="button" class="pc-ligne" data-action="carte-lieu" data-id="' + x.l.id + '">' +
      '<span class="ligne-ic">' + icone(categorie(x.l.cat).icone) + "</span>" +
      '<span class="ligne-corps"><span class="ligne-nom">' + esc(x.l.nom) + "</span>" +
      '<span class="ligne-meta"><span class="statut statut--' + x.s.classe + '">' + esc(x.s.texte) + "</span>" +
      (x.d !== null ? '<span class="ligne-dist" dir="ltr">' + esc(distanceCourte(x.d)) + "</span>" : "") + "</span></span></button></li>"
    ).join("");
  }

  function htmlFicheLieuCarte(l) {
    const s = statut(l, new Date());
    const acces = l.adresseMasquee && l.acces ? lieu(l.acces) : null;
    const ici = acces || l;
    return (
      '<div class="pl-tete"><span class="ligne-ic">' + icone(categorie(l.cat).icone) + "</span>" +
      '<div class="pl-titre"><p class="ligne-cat">' + esc(t("cat_" + l.cat)) + "</p><h2>" + esc(l.nom) + "</h2></div>" +
      '<button type="button" class="pl-fermer" data-action="fermer-fiche-carte" aria-label="' + esc(t("fermer")) + '">' + SVG_FERMER + "</button></div>" +
      '<p class="statut statut--' + s.classe + '">' + esc(s.texte) + "</p>" +
      (etat.position && aCoord(ici) ? '<p class="aide">' + esc(formatDistance(distanceM(etat.position, ici))) + "</p>" : "") +
      badgeFemmes(l) +
      (acces ? '<p class="aide">' + esc(t("accesProtege", { lieu: acces.nom })) + "</p>" : "") +
      '<div class="pl-actions">' +
      (acces || l.adresse ? '<a class="bouton bouton--bleu" href="#guide-' + ici.id + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a>" : "") +
      (l.tel ? '<a class="bouton bouton--vert" href="' + telLien(l.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
      '<a class="bouton bouton--gris" href="#lieu-' + l.id + '">' + esc(t("voirFiche")) + "</a></div>"
    );
  }

  function htmlFicheEquip(x) {
    const details = [];
    if (x.groupe === "t") {
      details.push(t(x.payant ? "eq_payantes" : "eq_gratuites"));
      if (x.fauteuil) details.push(t("eq_fauteuil"));
    } else if (x.groupe === "e") details.push(t("eq_eauGratuite"));
    return (
      '<div class="pl-tete"><span class="ligne-ic">' + icone(ICONE_EQ[x.type]) + "</span>" +
      '<div class="pl-titre">' + (x.nom !== t("eq_" + x.type) ? '<p class="ligne-cat">' + esc(t("eq_" + x.type)) + "</p>" : "") + "<h2>" + esc(x.nom) + "</h2></div>" +
      '<button type="button" class="pl-fermer" data-action="fermer-fiche-carte" aria-label="' + esc(t("fermer")) + '">' + SVG_FERMER + "</button></div>" +
      (x.type === "urgences" ? '<p class="statut statut--ouvert">' + esc(t("h24")) + "</p>" : "") +
      (details.length ? '<p class="aide">' + esc(details.join(" · ")) + "</p>" : "") +
      (etat.position ? '<p class="aide">' + esc(formatDistance(distanceM(etat.position, x))) + "</p>" : "") +
      '<p class="aide">' + esc(t("eq_source")) + "</p>" +
      '<div class="pl-actions"><a class="bouton bouton--bleu" href="#guide-' + x.id + '">' + icone("i-itineraire") + esc(t("yAller")) + "</a>" +
      (x.tel ? '<a class="bouton bouton--vert" href="' + telLien(x.tel) + '">' + icone("i-tel") + esc(t("appeler")) + "</a>" : "") +
      "</div>"
    );
  }

  function rendrePanneauCarte() {
    const p = document.getElementById("panneau-carte");
    if (!p) return;
    p.dataset.ouvert = String(etat.panneauOuvert);
    const sel = etat.ficheCarte;
    const x = sel ? equip(sel) : null;
    const l = sel && !x ? lieu(sel) : null;
    p.classList.toggle("panneau-carte--lieu", !!(x || l));
    if (x || l) {
      p.innerHTML = htmlPoignee() + (x ? htmlFicheEquip(x) : htmlFicheLieuCarte(l));
      return;
    }
    p.innerHTML =
      htmlPoignee() +
      '<div class="pc-cherche">' + icone("i-loupe") +
      '<label class="visuellement-cache" for="q-carte">' + esc(t("carteChercher")) + "</label>" +
      '<input id="q-carte" type="search" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search" maxlength="60" placeholder="' + esc(t("carteChercher")) + '" value="' + esc(etat.carteTexte) + '"></div>' +
      '<div class="pc-cats" role="group" aria-label="' + esc(t("jeCherche")) + '">' +
      D.familles.map((f) =>
        '<button type="button" class="pc-cat" data-action="carte-cat" data-valeur="' + f.id + '" aria-pressed="' + (etat.carteCat === f.id) + '">' +
        '<span class="pc-cat-ic">' + icone(f.icone) + "</span><span>" + esc(nomFamille(f)) + "</span></button>"
      ).join("") + "</div>" +
      '<h2 class="pc-titre">' + esc(etat.position ? t("liveTitre") : t("carteLieux")) + "</h2>" +
      '<ul class="pc-liste" id="pc-liste">' + htmlListeCarte() + "</ul>";
  }

  function majListeCarte() {
    const ul = document.getElementById("pc-liste");
    if (ul) ul.innerHTML = htmlListeCarte();
  }

  function ouvrirFicheCarte(x) {
    // Ordinateur, carte à côté d'une liste : ouvrir la fiche du lieu
    if (etat.panneau) {
      if (!equip(x.id)) location.hash = "#lieu-" + x.id;
      return;
    }
    etat.ficheCarte = x.id;
    rendrePanneauCarte();
    majMarqueurChoisi();
    const pt = equip(x.id) ? { lat: x.lat, lng: x.lng } : pointCarte(x);
    if (pt) centrerSur([pt.lat, pt.lng]);
  }

  function fermerFicheCarte() {
    if (!etat.ficheCarte) return;
    etat.ficheCarte = null;
    if (!document.getElementById("vue-carte").hidden && !etat.panneau) rendrePanneauCarte();
    majMarqueurChoisi();
  }

  /* ---------- Ordinateur : la carte à droite des listes et des fiches ---------- */
  function lieuxDeLaVue(h) {
    switch (h.vue) {
      case "cat": return D.lieux.filter((l) => dansCat(l, h.param));
      case "rubrique": {
        const f = famille(h.param);
        return h.param === "toutes" ? D.lieux : f ? D.lieux.filter((l) => dansFamille(l, f)) : null;
      }
      case "recherche": return chercher(etat.recherche);
      case "proche": return D.lieux;
      case "pourvous": return D.lieux.filter((l) => pourFemmes(l) || l.protections);
      case "favoris": return etat.favoris.map(lieu).filter(Boolean);
      case "lieu": {
        const l = lieu(h.param);
        return l ? [l] : null;
      }
      default: return null;
    }
  }

  function majPanneau() {
    const h = vueCourante();
    if (h.vue === "carte" || h.vue === "guide") return;
    const zone = document.getElementById("vue-carte");
    const emplacement = document.getElementById("emplacement-carte");
    const base = BUREAU.matches && window.L && emplacement ? lieuxDeLaVue(h) : null;
    document.body.classList.toggle("avec-panneau", !!base);
    if (!base) {
      etat.panneau = null;
      etat.panneauCle = "";
      rangerCarte();
      zone.hidden = true;
      return;
    }
    const lieux = h.vue === "lieu" ? base : preparer(base, h.vue === "proche").map((x) => x.l);
    etat.panneau = new Set(lieux.map((l) => l.id));
    if (zone.parentElement !== emplacement) emplacement.appendChild(zone);
    zone.hidden = false;
    if (!etat.carte) creerCarte();
    const cle = h.vue + h.param + "|" + lieux.map((l) => l.id).join(",");
    const nouvelle = cle !== etat.panneauCle;
    if (nouvelle) {
      etat.panneauCle = cle;
      etat.ficheCarte = h.vue === "lieu" ? h.param : null; // la fiche d'un lieu : son repère est mis en avant
    }
    majMarqueurs();
    majMoiSurCarte(false);
    setTimeout(() => {
      etat.carte.invalidateSize();
      if (!nouvelle) return;
      const pts = lieux.map(pointCarte).filter(Boolean).map((p) => [p.lat, p.lng]);
      if (pts.length === 1) etat.carte.setView(pts[0], 16);
      else if (pts.length) etat.carte.fitBounds(pts, { padding: [40, 40], maxZoom: 16 });
    }, 0);
  }

  /* =====================================================================
   * 5. Actions, routeur, démarrage
   * ===================================================================== */
  function basculerFavori(id, bouton) {
    const i = etat.favoris.indexOf(id);
    if (i === -1) etat.favoris.push(id);
    else etat.favoris.splice(i, 1);
    stock.ecrire("favoris", etat.favoris);
    const fav = i === -1;
    bouton.setAttribute("aria-pressed", String(fav));
    bouton.setAttribute("aria-label", fav ? t("garde") : t("garder"));
    bouton.innerHTML = icone(fav ? "i-etoile-pleine" : "i-etoile");
  }

  function basculerFiltre(f) {
    if (etat.filtres.has(f)) etat.filtres.delete(f);
    else etat.filtres.add(f);
    document.querySelectorAll('#vue [data-action="filtre"][data-filtre="' + f + '"]').forEach((b) => b.setAttribute("aria-pressed", String(etat.filtres.has(f))));
    const nb = document.querySelector("#vue .nb-filtres");
    if (nb) {
      const n = CRITERES.filter((x) => etat.filtres.has(x)).length;
      nb.textContent = n ? " " + n : "";
    }
    majResultats();
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
      case "sauter":
        e.preventDefault();
        document.getElementById("vue").focus();
        break;
      case "menu-langue": {
        const menu = document.getElementById("menu-langue");
        if (menu.hidden) {
          e.stopPropagation();
          ouvrirMenuLangue(el);
        } else fermerMenus();
        break;
      }
      case "langue":
        changerLangue(el.dataset.valeur);
        break;
      case "filtre":
        basculerFiltre(el.dataset.filtre);
        break;
      case "filtres": {
        etat.filtresOuverts = !etat.filtresOuverts;
        el.setAttribute("aria-expanded", String(etat.filtresOuverts));
        const plus = document.getElementById("filtres-plus");
        if (plus) plus.hidden = !etat.filtresOuverts;
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
        } else demanderPosition();
        break;
      case "proche-accueil":
      case "proche-aide":
        demanderPosition();
        break;
      case "garder":
        basculerFavori(id, el);
        break;
      case "partager":
        partager(lieu(id));
        break;
      case "copier":
        copier(el.dataset.texte, el);
        break;
      case "avis":
        donnerAvis(id, el.dataset.valeur);
        el.closest(".avis").innerHTML = '<p class="ok">' + icone("i-check") + esc(t("avisMerci")) + "</p>";
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
        el.closest(".installer").remove();
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
      case "moment-pause": {
        etat.momentPause = !etat.momentPause;
        el.setAttribute("aria-pressed", String(etat.momentPause));
        el.setAttribute("aria-label", t(etat.momentPause ? "imReprendre" : "imPause"));
        el.innerHTML = icone(etat.momentPause ? "i-lecture" : "i-pause");
        el.closest(".moment").classList.toggle("en-pause", etat.momentPause);
        break;
      }
      // Carte
      case "carte-cat":
        etat.carteCat = etat.carteCat === el.dataset.valeur ? "toutes" : el.dataset.valeur;
        document.querySelectorAll('#panneau-carte [data-action="carte-cat"]').forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.valeur === etat.carteCat)));
        majMarqueurs();
        majListeCarte();
        break;
      case "carte-ouvert":
        etat.carteOuvert = !etat.carteOuvert;
        el.setAttribute("aria-pressed", String(etat.carteOuvert));
        majMarqueurs();
        majListeCarte();
        break;
      case "carte-femmes":
        etat.carteFemmes = !etat.carteFemmes;
        el.setAttribute("aria-pressed", String(etat.carteFemmes));
        majMarqueurs();
        majListeCarte();
        break;
      case "calques":
        etat.calquesOuverts = !etat.calquesOuverts;
        el.setAttribute("aria-expanded", String(etat.calquesOuverts));
        document.getElementById("menu-calques").hidden = !etat.calquesOuverts;
        if (etat.calquesOuverts) e.stopPropagation();
        break;
      case "carte-eq":
        etat.carteEq[el.dataset.valeur] = !etat.carteEq[el.dataset.valeur];
        el.setAttribute("aria-pressed", String(etat.carteEq[el.dataset.valeur]));
        majEquip();
        break;
      case "carte-lieu": {
        const l = lieu(id);
        if (l) ouvrirFicheCarte(l);
        break;
      }
      case "fermer-fiche-carte":
        fermerFicheCarte();
        break;
      case "panneau-basculer":
        if (ignorerClicPoignee) {
          ignorerClicPoignee = false;
          break;
        }
        basculerPanneau(!etat.panneauOuvert);
        break;
      case "localiser":
        if (etat.guide) {
          etat.guide.suivre = true;
          etat.guide.suivreApres = 0;
          if (etat.position) etat.carte.setView([etat.position.lat, etat.position.lng], Math.max(etat.carte.getZoom(), 17));
          rendreGuide();
        } else if (etat.position && etat.position.source === "gps") centrerSur([etat.position.lat, etat.position.lng]);
        else demanderPosition();
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
        const g = etat.guide && etat.guide.id;
        arreterGuide();
        if (g) demarrerGuide(g);
        break;
      }
      default:
        break;
    }
  }

  // Le panneau de la carte : déplié (la liste) ou replié (recherche et catégories)
  let ignorerClicPoignee = false;
  function basculerPanneau(ouvert) {
    etat.panneauOuvert = ouvert;
    const p = document.getElementById("panneau-carte");
    p.dataset.ouvert = String(ouvert);
    const poignee = p.querySelector(".poignee");
    if (poignee) {
      poignee.setAttribute("aria-expanded", String(ouvert));
      poignee.setAttribute("aria-label", t(ouvert ? "panneauReduire" : "panneauAgrandir"));
    }
  }

  function surSaisie(e) {
    const cible = e.target;
    if (cible.id === "q" && vueCourante().vue !== "recherche") {
      // Comme sur iPhone : dès qu'on tape, la page de recherche s'ouvre et garde le clavier
      etat.recherche = cible.value.slice(0, 60);
      etat.focusRecherche = true;
      location.hash = "#recherche";
      return;
    }
    if (cible.id === "q") {
      clearTimeout(surSaisie.minuterie);
      surSaisie.minuterie = setTimeout(() => {
        etat.recherche = cible.value.trim().slice(0, 60);
        majResultats();
      }, 200);
      return;
    }
    if (cible.id === "q-carte") {
      clearTimeout(surSaisie.minuterie);
      surSaisie.minuterie = setTimeout(() => {
        etat.carteTexte = cible.value.slice(0, 60);
        majMarqueurs();
        majListeCarte();
      }, 200);
    }
  }

  async function surEnvoi(e) {
    const form = e.target;
    if (form.hasAttribute && form.hasAttribute("data-recherche")) {
      e.preventDefault();
      etat.recherche = form.elements.q.value.trim().slice(0, 60);
      if (vueCourante().vue === "recherche") {
        majResultats();
        form.elements.q.blur();
      } else location.hash = "#recherche";
      return;
    }
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
    const resultat = navigator.onLine === false ? "attente" : await posterSignalement(s);
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

  /* ---------- Langue ---------- */
  function changerLangue(l) {
    if (LANGUES.indexOf(l) === -1) return;
    etat.langue = l;
    stock.ecrire("langue", l);
    fermerMenus();
    appliquerReglages();
    rafraichir();
    if (etat.carte && !document.getElementById("vue-carte").hidden) {
      rendreHautCarte();
      rendrePanneauCarte();
      majMarqueurs();
    }
  }

  function remplirMenuLangue() {
    document.getElementById("menu-langue").innerHTML =
      '<p class="menu-titre">' + esc(t("langue")) + "</p>" +
      LANGUES.map((l) =>
        '<button type="button" role="menuitemradio" lang="' + l + '"' + (DROITE_A_GAUCHE.indexOf(l) !== -1 ? ' dir="rtl"' : "") +
        ' data-action="langue" data-valeur="' + l + '" aria-checked="' + (etat.langue === l) + '"><span>' + esc(TR[l].nomLangue) + "</span>" + (etat.langue === l ? icone("i-check") : "") + "</button>"
      ).join("");
  }

  function ouvrirMenuLangue(declencheur) {
    const menu = document.getElementById("menu-langue");
    menu.hidden = false;
    declencheur.setAttribute("aria-expanded", "true");
    const actif = menu.querySelector('[aria-checked="true"]');
    if (actif) actif.focus();
  }

  function fermerMenus() {
    const menu = document.getElementById("menu-langue");
    if (menu && !menu.hidden) {
      menu.hidden = true;
      document.querySelectorAll('[data-action="menu-langue"]').forEach((b) => b.setAttribute("aria-expanded", "false"));
    }
    const calques = document.getElementById("menu-calques");
    if (calques && !calques.hidden) {
      calques.hidden = true;
      etat.calquesOuverts = false;
      const b = document.querySelector('[data-action="calques"]');
      if (b) b.setAttribute("aria-expanded", "false");
    }
  }

  function appliquerReglages() {
    const html = document.documentElement;
    html.lang = etat.langue;
    html.dir = DROITE_A_GAUCHE.indexOf(etat.langue) !== -1 ? "rtl" : "ltr";
    document.querySelectorAll("[data-t]").forEach((el) => {
      el.textContent = t(el.dataset.t);
    });
    document.querySelectorAll("[data-t-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.tLabel));
      el.title = t(el.dataset.tLabel);
    });
    document.querySelectorAll(".code-langue").forEach((el) => {
      el.textContent = etat.langue.toUpperCase();
    });
    remplirMenuLangue();
  }

  function majNav(vue) {
    const correspond = {
      accueil: "accueil", cat: "accueil", rubrique: "accueil", recherche: "accueil", proche: "accueil", pourvous: "accueil",
      carte: "carte", guide: "carte",
      urgences: "urgences", aide: "urgences",
      infos: "infos", favoris: "infos", reglages: "infos", signaler: "infos", apropos: "infos"
    };
    const actif = correspond[vue] || null;
    document.querySelectorAll(".onglets a").forEach((a) => {
      if (a.dataset.onglet === actif) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function majHorsLigne() {
    document.getElementById("bandeau-horsligne").hidden = navigator.onLine !== false;
  }

  function majResultats() {
    const h = vueCourante();
    const zone = document.getElementById("resultats");
    if (zone && h.vue === "recherche") zone.innerHTML = htmlResultatsRecherche();
    else if (zone && ["cat", "rubrique", "proche", "favoris"].indexOf(h.vue) !== -1) zone.innerHTML = htmlListe(preparer(lieuxDeLaVue(h), h.vue === "proche"), h.vue !== "cat");
    else return rafraichir();
    majPanneau();
  }

  /* ---------- Routeur ---------- */
  function vueCourante() {
    const h = decodeURIComponent(location.hash.replace(/^#/, "")) || "accueil";
    const i = h.indexOf("-");
    return { vue: i === -1 ? h : h.slice(0, i), param: i === -1 ? "" : h.slice(i + 1) };
  }

  function route(options) {
    const opts = options || {};
    const h = vueCourante();
    const main = document.getElementById("vue");
    majNav(h.vue);
    fermerMenus();

    if (h.vue === "carte" || h.vue === "guide") {
      document.body.classList.add("sur-carte");
      if (h.vue === "carte") {
        arreterGuide();
        // « #carte-toilettes » : la carte avec les toilettes et l'eau potable ; « #carte-surs » : les lieux sûrs
        if (h.param === "toilettes") etat.carteEq.t = etat.carteEq.e = true;
        if (h.param === "surs") etat.carteEq.s = true;
      }
      afficherCarte();
      if (h.vue === "guide" && etat.carte) demarrerGuide(h.param);
      return;
    }
    document.body.classList.remove("sur-carte");
    arreterGuide();
    fermerFicheCarte();
    rangerCarte();
    document.getElementById("vue-carte").hidden = true;
    main.hidden = false;

    let html;
    switch (h.vue) {
      case "cat": html = vueCategorie(h.param); break;
      case "rubrique": html = vueRubrique(h.param); break;
      case "recherche": html = vueRecherche(); break;
      case "proche": html = vueProche(); break;
      case "pourvous": html = vuePourVous(); break;
      case "favoris": html = vueFavoris(); break;
      case "lieu": html = vueLieu(h.param); break;
      case "urgences": html = vueUrgences(); break;
      case "aide": html = vueAide(); break;
      case "infos": html = vueInfos(h.param); break;
      case "reglages": html = vueReglages(); break;
      case "signaler": html = vueSignaler(); break;
      case "apropos": html = vueApropos(); break;
      default: html = vueAccueil();
    }
    const afficher = () => {
      main.innerHTML = html;
      main.dataset.vue = h.vue;
      if (h.vue === "accueil" || h.vue === "") animerMoment();
      if (h.vue === "reglages") dessinerQrSite();
      majPanneau();
      if (etat.focusRecherche) {
        etat.focusRecherche = false;
        const q = document.getElementById("q");
        if (q) {
          q.focus({ preventScroll: true });
          q.setSelectionRange(q.value.length, q.value.length);
          return;
        }
      }
      if (opts.rafraichir) return;
      const ancre = !h.param ? null : h.vue === "pourvous" ? "pv-" + h.param : h.vue === "infos" ? "fiche-" + h.param : h.vue === "reglages" ? h.param : null;
      const cible = ancre && document.getElementById(ancre);
      if (cible) cible.scrollIntoView();
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

  // Re-dessine l'écran sans remonter en haut (après un réglage, la position…)
  function rafraichir() {
    const v = vueCourante().vue;
    if (v === "carte" || v === "guide") {
      if (!etat.guide && !etat.ficheCarte) majListeCarte();
      return;
    }
    route({ rafraichir: true });
  }

  /* ---------- Démarrage ---------- */
  function demarrer() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
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
    document.addEventListener("input", surSaisie);
    document.addEventListener("submit", surEnvoi);
    // Fermer les menus en touchant ailleurs
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#menu-langue, [data-action='menu-langue'], #menu-calques, [data-action='calques']")) fermerMenus();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const menu = document.getElementById("menu-langue");
      if (!menu.hidden || etat.calquesOuverts) return fermerMenus();
      if (etat.ficheCarte && !document.getElementById("vue-carte").hidden) fermerFicheCarte();
    });
    // Panneau de la carte : glisser la poignée vers le haut ou le bas
    let depart = null;
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("#panneau-carte .poignee")) depart = e.clientY;
    });
    document.addEventListener("pointerup", (e) => {
      if (depart === null) return;
      const dy = e.clientY - depart;
      depart = null;
      if (Math.abs(dy) > 24) {
        ignorerClicPoignee = true;
        basculerPanneau(dy < 0);
      }
    });
    document.addEventListener("focusin", (e) => {
      if (e.target.id === "q-carte" && !BUREAU.matches) basculerPanneau(true);
    });
    if (BUREAU.addEventListener) BUREAU.addEventListener("change", () => route({ rafraichir: true }));

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

    // « Ouvert », « ferme bientôt » : à jour chaque minute (l'accueil toutes les 5 minutes)
    let minutes = 0;
    setInterval(() => {
      minutes++;
      const v = vueCourante().vue;
      const occupe = document.activeElement && document.activeElement.closest("#vue form, #vue .filtres-plus, #vue details[open]");
      if (["cat", "rubrique", "proche", "favoris", "lieu", "pourvous"].indexOf(v) !== -1 && !occupe) rafraichir();
      if (v === "accueil" && minutes % 5 === 0 && !occupe) rafraichir();
      if (v === "carte" && !etat.guide) {
        majMarqueurs();
        if (!etat.ficheCarte) majListeCarte();
      }
    }, 60000);

    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => { /* pas de mode hors ligne, l'appli marche quand même */ });
    }
  }

  // Exposé pour les tests
  window.PALADINES = { statut: statut, distanceM: distanceM };

  demarrer();
})();
