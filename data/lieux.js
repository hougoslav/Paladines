/*
 * Données de l'application Paladines.
 *
 * ⚠️ PROTOTYPE : tous les LIEUX ci-dessous sont FICTIFS (noms, adresses,
 * téléphones en 01 99 00 xx xx, numéros réservés à la fiction).
 * Seuls les NUMÉROS D'URGENCE nationaux sont réels.
 *
 * Ce fichier est un simple script (et pas un .json) pour que l'appli
 * fonctionne même en ouvrant index.html directement, sans serveur.
 * Plus tard, ces données pourront venir d'une API (ex. Soliguide) ou d'un
 * petit back-office rempli par les associations partenaires.
 */

window.PALADINES_DATA = {
  // Date de dernière mise à jour des données (affichée dans l'appli)
  majDonnees: "2026-10-01",

  // Ville par défaut : centre de la carte si la géolocalisation est refusée
  ville: { nom: "Paris", lat: 48.8641, lng: 2.3601, zoom: 13 },

  // Bandeau d'alerte saisonnière (mettre actif: false pour le masquer)
  alerte: {
    actif: true,
    type: "froid",
    texte: {
      fr: "Exemple d'alerte : Plan Grand Froid. Des places en plus ouvrent ce soir. Appelez le 115.",
      en: "Example alert: extreme cold plan. Extra beds open tonight. Call 115.",
      ar: "مثال تنبيه: خطة البرد الشديد. أماكن إضافية مفتوحة الليلة. اتصلي بالرقم 115."
    }
  },

  // Catégories affichées sur l'accueil (l'ordre compte)
  categories: [
    { id: "dormir",    icone: "i-lit",      couleur: "#3E5BA9" },
    { id: "manger",    icone: "i-bol",      couleur: "#C2671D" },
    { id: "hygiene",   icone: "i-goutte",   couleur: "#1F8A9E" },
    { id: "sante",     icone: "i-croix",    couleur: "#B23A48" },
    { id: "accueil",   icone: "i-tasse",    couleur: "#6B4FA0" },
    { id: "ecoute",    icone: "i-bouclier", couleur: "#A3326E" },
    { id: "vetements", icone: "i-cintre",   couleur: "#4E7D3A" },
    { id: "bagagerie", icone: "i-sac",      couleur: "#7A6A3A" },
    { id: "droits",    icone: "i-papier",   couleur: "#3D6E8F" },
    { id: "recharge",  icone: "i-prise",    couleur: "#8A5A00" }
  ],

  /*
   * Lieux (FICTIFS).
   * horaires : clés lun..dim, chaque jour = liste de plages ["HH:MM","HH:MM"].
   *   Une plage qui finit avant de commencer passe minuit (ex. ["19:00","08:00"]).
   *   "24/7" = ouvert tout le temps. null = horaires non connus.
   * criteres : femmes (femmes uniquement), enfants, animaux, gratuit,
   *   sansRdv, pmr (accessible fauteuil), inconditionnel (sans condition
   *   de papiers ni de ressources).
   */
  lieux: [
    {
      id: "p01", cat: "dormir",
      nom: "Halte de nuit Les Veilleuses",
      adresse: "14 rue de l'Exemple, 75010 Paris",
      lat: 48.8762, lng: 2.3589,
      tel: "01 99 00 10 01",
      horaires: { lun: [["19:00", "08:00"]], mar: [["19:00", "08:00"]], mer: [["19:00", "08:00"]], jeu: [["19:00", "08:00"]], ven: [["19:00", "08:00"]], sam: [["19:00", "08:00"]], dim: [["19:00", "08:00"]] },
      services: ["Lits pour la nuit", "Douches", "Petit-déjeuner", "Casiers fermés à clé"],
      conditions: "Réservé aux femmes, avec ou sans enfants. Arriver avant 22 h. Orientation possible par le 115.",
      criteres: { femmes: true, enfants: true, gratuit: true, sansRdv: true, inconditionnel: true },
      langues: ["fr", "en", "ar"],
      verifie: "2026-09-28"
    },
    {
      id: "p02", cat: "dormir",
      nom: "Centre d'hébergement Clair de Lune",
      adresse: "3 passage Fictif, 75011 Paris",
      lat: 48.8589, lng: 2.3792,
      tel: "01 99 00 10 02",
      horaires: "24/7",
      services: ["Chambres de 2 à 4 personnes", "Accompagnement social", "Laverie"],
      conditions: "Admission par le 115 ou par une travailleuse sociale. Séjour de 1 à 3 mois.",
      criteres: { femmes: true, enfants: true, animaux: true, gratuit: true, pmr: true },
      langues: ["fr", "en"],
      verifie: "2026-09-15"
    },
    {
      id: "p03", cat: "dormir",
      nom: "Abri d'urgence Saint-Exemple",
      adresse: "52 boulevard Imaginaire, 75018 Paris",
      lat: 48.8867, lng: 2.3488,
      tel: "01 99 00 10 03",
      horaires: { lun: [["20:00", "07:30"]], mar: [["20:00", "07:30"]], mer: [["20:00", "07:30"]], jeu: [["20:00", "07:30"]], ven: [["20:00", "07:30"]], sam: [["20:00", "07:30"]], dim: [["20:00", "07:30"]] },
      services: ["Dortoir femmes séparé", "Repas du soir", "Infirmière le mardi"],
      conditions: "Mixte, avec un espace réservé aux femmes. Premier arrivé, premier servi.",
      criteres: { gratuit: true, sansRdv: true, inconditionnel: true, animaux: true },
      langues: ["fr", "ar", "ps"],
      verifie: "2026-09-30"
    },
    {
      id: "p04", cat: "manger",
      nom: "Cantine solidaire La Tablée",
      adresse: "8 rue des Exemples, 75003 Paris",
      lat: 48.8634, lng: 2.3601,
      tel: "01 99 00 20 01",
      horaires: { lun: [["11:30", "14:00"]], mar: [["11:30", "14:00"]], mer: [["11:30", "14:00"]], jeu: [["11:30", "14:00"]], ven: [["11:30", "14:00"]] },
      services: ["Repas chaud complet", "Option végétarienne et halal", "Café offert"],
      conditions: "Sans inscription. Ticket remis à l'entrée.",
      criteres: { gratuit: true, sansRdv: true, enfants: true, pmr: true, inconditionnel: true },
      langues: ["fr", "en"],
      verifie: "2026-09-20"
    },
    {
      id: "p05", cat: "manger",
      nom: "Distribution du soir — Les Paniers",
      adresse: "Parvis fictif, place de l'Exemple, 75010 Paris",
      lat: 48.8722, lng: 2.3640,
      tel: null,
      horaires: { lun: [["19:30", "21:00"]], mer: [["19:30", "21:00"]], ven: [["19:30", "21:00"]], dim: [["12:00", "13:30"]] },
      services: ["Repas à emporter", "Boissons chaudes", "Petits pots pour bébé"],
      conditions: "Distribution dehors. Venir un peu en avance.",
      criteres: { gratuit: true, sansRdv: true, enfants: true, animaux: true, inconditionnel: true },
      langues: ["fr"],
      verifie: "2026-09-25"
    },
    {
      id: "p06", cat: "manger",
      nom: "Épicerie solidaire Le Garde-Manger",
      adresse: "21 rue Fictive, 75019 Paris",
      lat: 48.8828, lng: 2.3790,
      tel: "01 99 00 20 03",
      horaires: { mar: [["14:00", "18:00"]], jeu: [["14:00", "18:00"]], sam: [["10:00", "13:00"]] },
      services: ["Courses à petit prix", "Produits d'hygiène", "Lait infantile"],
      conditions: "Sur orientation d'une assistante sociale. Participation de 10 % du prix.",
      criteres: { enfants: true, pmr: true },
      langues: ["fr", "es"],
      verifie: "2026-08-30"
    },
    {
      id: "p07", cat: "hygiene",
      nom: "Bains-douches municipaux Exemple",
      adresse: "40 rue de l'Hypothèse, 75011 Paris",
      lat: 48.8616, lng: 2.3708,
      tel: "01 99 00 30 01",
      horaires: { mar: [["07:30", "12:00"], ["13:00", "18:00"]], mer: [["07:30", "12:00"], ["13:00", "18:00"]], jeu: [["07:30", "12:00"], ["13:00", "18:00"]], ven: [["07:30", "12:00"], ["13:00", "18:00"]], sam: [["07:30", "18:00"]], dim: [["08:00", "12:00"]] },
      services: ["Douches individuelles", "Serviette et savon fournis", "Créneaux réservés aux femmes le matin"],
      conditions: "Gratuit. Durée : 20 minutes.",
      criteres: { gratuit: true, sansRdv: true, pmr: true, inconditionnel: true },
      langues: ["fr"],
      verifie: "2026-09-10"
    },
    {
      id: "p08", cat: "hygiene",
      nom: "Espace hygiène Les Essentielles",
      adresse: "6 impasse du Prototype, 75010 Paris",
      lat: 48.8701, lng: 2.3528,
      tel: "01 99 00 30 02",
      horaires: { lun: [["09:00", "17:00"]], mar: [["09:00", "17:00"]], mer: [["09:00", "17:00"]], jeu: [["09:00", "17:00"]], ven: [["09:00", "17:00"]] },
      services: ["Protections périodiques gratuites", "Douches", "Machine à laver", "Coiffure solidaire le jeudi"],
      conditions: "Réservé aux femmes. Sans rendez-vous.",
      criteres: { femmes: true, gratuit: true, sansRdv: true, inconditionnel: true, enfants: true },
      langues: ["fr", "en", "ar", "uk"],
      verifie: "2026-09-29"
    },
    {
      id: "p09", cat: "sante",
      nom: "Permanence de soins (PASS) — Hôpital Exemple",
      adresse: "1 avenue Fictive, 75010 Paris",
      lat: 48.8740, lng: 2.3685,
      tel: "01 99 00 40 01",
      horaires: { lun: [["09:00", "16:30"]], mar: [["09:00", "16:30"]], mer: [["09:00", "16:30"]], jeu: [["09:00", "16:30"]], ven: [["09:00", "16:30"]] },
      services: ["Médecin généraliste", "Médicaments gratuits", "Aide pour ouvrir ses droits santé"],
      conditions: "Pour les personnes sans couverture santé. Avec ou sans papiers.",
      criteres: { gratuit: true, sansRdv: true, pmr: true, inconditionnel: true },
      langues: ["fr", "en", "ar"],
      verifie: "2026-09-18"
    },
    {
      id: "p10", cat: "sante",
      nom: "Centre de santé des femmes Iris",
      adresse: "17 rue de la Maquette, 75020 Paris",
      lat: 48.8660, lng: 2.3895,
      tel: "01 99 00 40 02",
      horaires: { lun: [["10:00", "18:00"]], mer: [["10:00", "18:00"]], jeu: [["13:00", "19:00"]], sam: [["10:00", "13:00"]] },
      services: ["Gynécologue et sage-femme", "Suivi de grossesse", "Contraception", "Dépistages"],
      conditions: "Avec ou sans rendez-vous. Consultations gratuites pour les femmes sans couverture santé.",
      criteres: { femmes: true, gratuit: true, sansRdv: true, enfants: true, inconditionnel: true },
      langues: ["fr", "en", "es"],
      verifie: "2026-09-22"
    },
    {
      id: "p11", cat: "sante",
      nom: "Bus santé mobile",
      adresse: "Stationne devant le square Exemple, 75019 Paris",
      lat: 48.8810, lng: 2.3700,
      tel: null,
      horaires: { mar: [["18:00", "21:00"]], jeu: [["18:00", "21:00"]] },
      services: ["Soins infirmiers", "Soins des pieds", "Écoute psychologique"],
      conditions: "Sans rendez-vous, anonyme.",
      criteres: { gratuit: true, sansRdv: true, animaux: true, inconditionnel: true },
      langues: ["fr", "en"],
      verifie: "2026-09-05"
    },
    {
      id: "p12", cat: "accueil",
      nom: "Accueil de jour La Parenthèse",
      adresse: "25 rue de l'Essai, 75010 Paris",
      lat: 48.8752, lng: 2.3510,
      tel: "01 99 00 50 01",
      horaires: { lun: [["08:30", "17:00"]], mar: [["08:30", "17:00"]], mer: [["08:30", "17:00"]], jeu: [["08:30", "17:00"]], ven: [["08:30", "17:00"]], sam: [["10:00", "16:00"]] },
      services: ["Se reposer au chaud", "Café et collation", "Douches", "Recharge téléphone", "Travailleuse sociale", "Ateliers bien-être"],
      conditions: "Lieu réservé aux femmes. Sans condition, sans rendez-vous.",
      criteres: { femmes: true, gratuit: true, sansRdv: true, enfants: true, pmr: true, inconditionnel: true },
      langues: ["fr", "en", "ar", "ro"],
      verifie: "2026-10-01"
    },
    {
      id: "p13", cat: "accueil",
      nom: "Espace solidaire Le Phare",
      adresse: "9 rue du Brouillon, 75012 Paris",
      lat: 48.8478, lng: 2.3786,
      tel: "01 99 00 50 02",
      horaires: { lun: [["09:00", "13:00"]], mar: [["09:00", "13:00"]], jeu: [["09:00", "13:00"]], ven: [["09:00", "13:00"]], dim: [["10:00", "15:00"]] },
      services: ["Petit-déjeuner", "Machine à laver", "Domiciliation", "Accès internet"],
      conditions: "Mixte. Un espace calme est réservé aux femmes.",
      criteres: { gratuit: true, sansRdv: true, animaux: true, inconditionnel: true },
      langues: ["fr", "en"],
      verifie: "2026-09-12"
    },
    {
      id: "p14", cat: "ecoute",
      nom: "Centre d'écoute Violences Femmes Exemple",
      adresse: "Adresse communiquée par téléphone",
      lat: 48.8695, lng: 2.3450,
      tel: "01 99 00 60 01",
      horaires: { lun: [["09:00", "19:00"]], mar: [["09:00", "19:00"]], mer: [["09:00", "19:00"]], jeu: [["09:00", "19:00"]], ven: [["09:00", "19:00"]] },
      services: ["Écoute et conseils", "Aide pour porter plainte", "Juriste", "Psychologue", "Mise à l'abri"],
      conditions: "Confidentiel et gratuit. L'adresse exacte est donnée par téléphone pour protéger les femmes accueillies.",
      criteres: { femmes: true, gratuit: true, enfants: true, inconditionnel: true },
      langues: ["fr", "en", "ar", "es"],
      adresseMasquee: true,
      verifie: "2026-09-27"
    },
    {
      id: "p15", cat: "ecoute",
      nom: "Permanence juridique (CIDFF fictif)",
      adresse: "Mairie Exemple, 2 place de la Démo, 75011 Paris",
      lat: 48.8575, lng: 2.3800,
      tel: "01 99 00 60 02",
      horaires: { mar: [["14:00", "17:00"]], jeu: [["09:30", "12:30"]] },
      services: ["Informations sur vos droits", "Divorce, séparation, garde d'enfants", "Titre de séjour et violences"],
      conditions: "Gratuit et confidentiel. Sans rendez-vous le jeudi.",
      criteres: { gratuit: true, pmr: true, inconditionnel: true },
      langues: ["fr", "en"],
      verifie: "2026-09-08"
    },
    {
      id: "p16", cat: "vetements",
      nom: "Vestiaire solidaire La Penderie",
      adresse: "33 rue du Test, 75009 Paris",
      lat: 48.8770, lng: 2.3430,
      tel: "01 99 00 70 01",
      horaires: { mer: [["14:00", "17:30"]], sam: [["10:00", "12:30"]] },
      services: ["Vêtements femme et enfant", "Sous-vêtements neufs", "Chaussures", "Sacs de couchage en hiver"],
      conditions: "Gratuit. Un passage par mois.",
      criteres: { gratuit: true, sansRdv: true, enfants: true, inconditionnel: true },
      langues: ["fr"],
      verifie: "2026-09-14"
    },
    {
      id: "p17", cat: "bagagerie",
      nom: "Bagagerie solidaire Les Consignes",
      adresse: "5 rue de l'Ébauche, 75010 Paris",
      lat: 48.8790, lng: 2.3620,
      tel: "01 99 00 80 01",
      horaires: { lun: [["07:30", "09:30"], ["19:00", "21:00"]], mar: [["07:30", "09:30"], ["19:00", "21:00"]], mer: [["07:30", "09:30"], ["19:00", "21:00"]], jeu: [["07:30", "09:30"], ["19:00", "21:00"]], ven: [["07:30", "09:30"], ["19:00", "21:00"]], sam: [["08:00", "10:00"]], dim: [["08:00", "10:00"]] },
      services: ["Casier personnel", "Garder ses papiers en sécurité", "Dépôt le soir, reprise le matin"],
      conditions: "Inscription sur place, gratuite. Place selon disponibilité.",
      criteres: { gratuit: true, inconditionnel: true },
      langues: ["fr", "en"],
      verifie: "2026-09-21"
    },
    {
      id: "p18", cat: "droits",
      nom: "Point d'accès aux droits Exemple",
      adresse: "11 rue du Modèle, 75018 Paris",
      lat: 48.8890, lng: 2.3560,
      tel: "01 99 00 90 01",
      horaires: { lun: [["09:00", "12:00"], ["14:00", "17:00"]], mar: [["09:00", "12:00"]], jeu: [["09:00", "12:00"], ["14:00", "17:00"]], ven: [["09:00", "12:00"]] },
      services: ["Domiciliation (adresse pour le courrier)", "Aide pour la carte Vitale, le RSA, la CAF", "Écrivain public", "Coffre-fort numérique pour vos papiers"],
      conditions: "Avec ou sans rendez-vous. Apportez les papiers que vous avez, même s'il en manque.",
      criteres: { gratuit: true, sansRdv: true, pmr: true, inconditionnel: true },
      langues: ["fr", "en", "ar"],
      verifie: "2026-09-19"
    },
    {
      id: "p19", cat: "recharge",
      nom: "Médiathèque Exemple",
      adresse: "18 rue de l'Échantillon, 75003 Paris",
      lat: 48.8660, lng: 2.3560,
      tel: "01 99 00 95 01",
      horaires: { mar: [["10:00", "19:00"]], mer: [["10:00", "19:00"]], jeu: [["10:00", "19:00"]], ven: [["10:00", "19:00"]], sam: [["10:00", "18:00"]] },
      services: ["Wifi gratuit", "Prises pour recharger", "Ordinateurs", "Toilettes", "Au chaud et au calme"],
      conditions: "Ouvert à toutes et tous, sans inscription.",
      criteres: { gratuit: true, sansRdv: true, pmr: true, inconditionnel: true, enfants: true },
      langues: ["fr", "en"],
      verifie: "2026-09-02"
    },
    {
      id: "p20", cat: "recharge",
      nom: "Borne de recharge solidaire — Gare Exemple",
      adresse: "Hall 2, gare fictive, 75010 Paris",
      lat: 48.8808, lng: 2.3552,
      tel: null,
      horaires: "24/7",
      services: ["Recharge téléphone (câbles fournis)", "Wifi gratuit"],
      conditions: "En accès libre.",
      criteres: { gratuit: true, sansRdv: true, pmr: true, inconditionnel: true, animaux: true },
      langues: [],
      verifie: "2026-09-26"
    }
  ],

  // Numéros d'urgence NATIONAUX (réels, France)
  urgences: [
    { num: "115",  id: "115",  sms: false, couleur: "urgent" },
    { num: "3919", id: "3919", sms: false, couleur: "urgent" },
    { num: "17",   id: "17",   sms: false },
    { num: "112",  id: "112",  sms: false },
    { num: "114",  id: "114",  sms: true },
    { num: "15",   id: "15",   sms: false },
    { num: "3114", id: "3114", sms: false },
    { num: "119",  id: "119",  sms: false }
  ]
};
