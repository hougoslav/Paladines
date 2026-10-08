/*
 * Données de l'application Paladines — LILLE.
 *
 * Lieux relevés sur internet le 7 octobre 2026 (sources sur chaque lieu : surtout
 * l'annuaire officiel solidarites.lille.fr, le guide « Info sans abris » 2025 de la
 * Métropole, les guides CMAO et les sites des associations), puis contre-vérifiés.
 * ⚠️ Ils n'ont PAS encore été confirmés par téléphone avec chaque structure :
 * à faire avant un vrai lancement (voir docs/LIEUX-LILLE.md).
 *
 * Ce fichier est un simple script (et pas un .json) pour que l'appli fonctionne
 * même en ouvrant index.html directement, sans serveur.
 */

window.PALADINES_DATA = {
  // Date de dernière mise à jour des données (affichée dans l'appli)
  majDonnees: "2026-10-07",

  // Centre de la carte si la position est inconnue
  ville: { nom: "Lille", lat: 50.6330, lng: 3.0580, zoom: 13 },

  // Bandeau d'alerte saisonnière (mettre actif: false pour le masquer)
  alerte: {
    actif: true,
    type: "froid",
    texte: {
      fr: "Plan hiver : du 1er novembre au 31 mars, des places d'hébergement en plus ouvrent. Appelez le 115.",
      en: "Winter plan: from 1 November to 31 March, extra shelter beds open. Call 115.",
      ar: "خطة الشتاء: من 1 نوفمبر إلى 31 مارس تُفتح أماكن إيواء إضافية. اتصلي بالرقم 115."
    }
  },

  // Repères pour « Je suis près de… » quand le GPS est refusé (positions vérifiées en double)
  reperes: [
    {
      "id": "gare-flandres",
      "nom": "Gare Lille Flandres",
      "lat": 50.63639,
      "lng": 3.07083
    },
    {
      "id": "gare-europe",
      "nom": "Gare Lille Europe",
      "lat": 50.6393,
      "lng": 3.07542
    },
    {
      "id": "grand-place",
      "nom": "Grand Place",
      "lat": 50.63689,
      "lng": 3.06337
    },
    {
      "id": "republique",
      "nom": "Métro République – Beaux-Arts",
      "lat": 50.63167,
      "lng": 3.06083
    },
    {
      "id": "gambetta",
      "nom": "Métro Gambetta (Wazemmes)",
      "lat": 50.62639,
      "lng": 3.05222
    },
    {
      "id": "porte-des-postes",
      "nom": "Métro Porte des Postes",
      "lat": 50.61833,
      "lng": 3.05
    },
    {
      "id": "porte-d-arras",
      "nom": "Métro Porte d'Arras (Lille-Sud)",
      "lat": 50.61748,
      "lng": 3.06226
    },
    {
      "id": "fives",
      "nom": "Métro Fives",
      "lat": 50.63304,
      "lng": 3.09059
    },
    {
      "id": "lille-grand-palais",
      "nom": "Métro Lille Grand Palais",
      "lat": 50.62944,
      "lng": 3.075
    },
    {
      "id": "chu",
      "nom": "Métro CHU – Centre Oscar Lambret",
      "lat": 50.61309,
      "lng": 3.03643
    },
    {
      "id": "mairie-de-lille",
      "nom": "Métro Mairie de Lille",
      "lat": 50.63256,
      "lng": 3.0709
    },
    {
      "id": "bois-blancs",
      "nom": "Métro Bois-Blancs",
      "lat": 50.63429,
      "lng": 3.03053
    },
    {
      "id": "montebello",
      "nom": "Métro Montebello",
      "lat": 50.62201,
      "lng": 3.04552
    },
    {
      "id": "marbrerie",
      "nom": "Métro Marbrerie",
      "lat": 50.63006,
      "lng": 3.0979
    },
    {
      "id": "cathedrale",
      "nom": "Cathédrale de la Treille (Vieux-Lille)",
      "lat": 50.64008,
      "lng": 3.06253
    }
  ],

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
    { id: "recharge",  icone: "i-prise",    couleur: "#8A5A00" },
    { id: "wifi",      icone: "i-wifi",     couleur: "#11806A" }
  ],

  /*
   * Lieux.
   * cat : besoin principal ; autresCats : autres besoins couverts (le lieu apparaît aussi dans ces listes).
   * horaires : clés lun..dim, chaque jour = liste de plages ["HH:MM","HH:MM"].
   *   Une plage qui finit avant de commencer passe minuit (ex. ["21:00","08:00"]).
   *   "24/7" = ouvert tout le temps. null = horaires non confirmés : l'appli affiche
   *   « appeler avant » et le texte de la source (horairesTexte).
   *   Quand deux sources se contredisent, les plages ne gardent que les heures communes.
   * lat/lng : null ici ; positions dans data/coordonnees.js (node outils/geocoder.mjs)
   *   ou calculées par l'appli au premier chargement. adresseGeo : adresse simplifiée
   *   pour ce calcul quand l'adresse affichée contient des précisions.
   * criteres : femmes (réservé aux femmes), enfants, animaux, gratuit, sansRdv, pmr,
   *   inconditionnel (sans condition de papiers ni de ressources).
   * adresseMasquee : lieu protégé (femmes victimes de violences, etc.) : jamais sur la carte.
   * confiance : avis des agents de recherche (haute / moyenne / basse), non affiché.
   */
  lieux: [
    {
      "id": "l01",
      "cat": "dormir",
      "autresCats": [],
      "nom": "115 – Samu social (hébergement d'urgence)",
      "structure": "CMAO (Coordination Mobile d'Accueil et d'Orientation) : 115, Samu social et SIAO de la métropole lilloise",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "115",
      "horaires": "24/7",
      "horairesTexte": "Numéro gratuit, 24h/24, 7j/7",
      "services": [
        "Appel gratuit, de jour comme de nuit.",
        "On cherche avec vous une place pour dormir.",
        "Une personne vous écoute et vous conseille.",
        "Le Samu social peut venir vous voir dans la rue.",
        "On vous oriente vers les accueils de jour."
      ],
      "conditions": "Appelez le 115, de jour comme de nuit. L'appel est gratuit. Le 115 cherche une place avec vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://www.lillemetropole.fr/sites/default/files/2025-03/Guide%20info%20sans%20abris%20(Version%20facile%20%C3%A0%20lire%20et%20%C3%A0%20comprendre%20-%20FALC).pdf",
        "https://cmao-asso.fr/",
        "https://cmao-asso.fr/le-115/",
        "https://solidarites.lille.fr/aide/452/2-pour-toutes-les-personnes-sans-domicile.htm"
      ]
    },
    {
      "id": "l02",
      "cat": "dormir",
      "autresCats": [
        "hygiene",
        "bagagerie"
      ],
      "nom": "Halte de nuit abej SOLIDARITÉ",
      "structure": "abej SOLIDARITÉ",
      "adresse": "22 parvis Saint-Michel, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 09 30",
      "horaires": {
        "lun": [
          [
            "21:00",
            "08:00"
          ]
        ],
        "mar": [
          [
            "21:00",
            "08:00"
          ]
        ],
        "mer": [
          [
            "21:00",
            "08:00"
          ]
        ],
        "jeu": [
          [
            "21:00",
            "08:00"
          ]
        ],
        "ven": [
          [
            "21:00",
            "08:00"
          ]
        ],
        "sam": [
          [
            "21:00",
            "08:00"
          ]
        ],
        "dim": [
          [
            "21:00",
            "08:00"
          ]
        ]
      },
      "horairesTexte": "Tous les soirs de 21h à 8h, 7 jours sur 7",
      "services": [
        "Un abri pour la nuit, dans une salle de repos.",
        "Repas chaud et petit-déjeuner.",
        "Douches et laverie.",
        "Bagagerie : vos affaires sont gardées en sécurité.",
        "Des travailleurs sociaux sont là toute la nuit.",
        "Des chambres plus petites pour les femmes."
      ],
      "conditions": "Pour les personnes sans abri. Vous pouvez venir directement ou passer par le 115. Les animaux sont acceptés. Environ 40 places.",
      "criteres": {
        "animaux": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://abej-solidarite.fr/structure/halte-de-nuit/",
        "https://www.lillemetropole.fr/sites/default/files/2025-03/Guide%20info%20sans%20abris%20(Version%20facile%20%C3%A0%20lire%20et%20%C3%A0%20comprendre%20-%20FALC).pdf",
        "https://www.moncompagnonderoute.fr/fr/structures/halte-de-nuit-abej-solidarit-rzk3hcn89ogtmyiq519enzqs",
        "https://annuaire.action-sociale.org/?p=residence-abej-halte-de-nuit-590056461&details=caracteristiques"
      ]
    },
    {
      "id": "l03",
      "cat": "dormir",
      "autresCats": [
        "sante"
      ],
      "nom": "Sleep'in – accueil de nuit (CAARUD)",
      "structure": "Cedragir",
      "adresse": "247 boulevard Victor Hugo, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 04 53 80",
      "horaires": {
        "lun": [
          [
            "20:30",
            "08:00"
          ]
        ],
        "mar": [
          [
            "20:30",
            "08:00"
          ]
        ],
        "mer": [
          [
            "20:30",
            "08:00"
          ]
        ],
        "jeu": [
          [
            "20:30",
            "08:00"
          ]
        ],
        "ven": [
          [
            "20:30",
            "08:00"
          ]
        ],
        "sam": [
          [
            "20:30",
            "08:00"
          ]
        ],
        "dim": [
          [
            "20:30",
            "08:00"
          ]
        ]
      },
      "horairesTexte": "Hébergement : tous les jours de 20h30 à 8h. Réservation par téléphone le jour même à 9h. Matériel de réduction des risques : 20h30-9h30. Entretiens éducatifs : mercredi, jeudi, vendredi 8h30-12h.",
      "services": [
        "Un lit pour la nuit.",
        "Pour les personnes qui consomment des drogues.",
        "Matériel stérile et conseils pour réduire les risques.",
        "Soutien médical et social."
      ],
      "conditions": "Réservé aux personnes qui consomment des drogues. Appelez le jour même à 9h pour réserver. Arrivez avant 21h30, ou prévenez et arrivez avant minuit. Anonyme et gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/38/3-cedragir-le-sleep-in.htm",
        "https://www.drogues-info-service.fr/Adresses-utiles/5298",
        "https://www.cedragir.fr/CAARUD"
      ]
    },
    {
      "id": "l04",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Maison Corinne Masiero",
      "structure": "abej SOLIDARITÉ et Cedragir",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 09 10",
      "horaires": null,
      "horairesTexte": "Pas d'accueil direct : on entre seulement après une orientation (Sleep'in, Halte de nuit, 115 ou CAARUD partenaire). Selon la presse (2025), une équipe est présente 24h/24, 7j/7 pour les femmes hébergées.",
      "services": [
        "Une chambre à vous, dans une maison pour 10 femmes.",
        "Cuisine partagée et salles de bain communes.",
        "Une équipe (infirmière, éducatrices) présente jour et nuit.",
        "Vous pouvez rester plusieurs mois (environ 9 mois en moyenne)."
      ],
      "conditions": "Réservé aux femmes sans domicile qui consomment des drogues. Il faut être orientée par le Sleep'in, la Halte de nuit, le Samu social (115) ou un CAARUD partenaire.",
      "criteres": {
        "femmes": true
      },
      "langues": [],
      "adresseMasquee": true,
      "acces": "l02",
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.mediacites.fr/solutions/lille/2025/10/09/une-maison-corinne-masiero-pour-les-femmes-sdf-toxicomanes-bientot-perennisee-pres-de-lille/",
        "https://france3-regions.franceinfo.fr/hauts-de-france/nord-0/lille/la-maison-corinne-masiero-un-accueil-pour-les-femmes-sdf-et-consommatrices-de-drogue-bientot-perennise-3231293.html",
        "https://www.francebleu.fr/emissions/l-info-d-ici-ici-nord/lille-des-femmes-sans-domicile-et-consommatrices-de-drogue-trouvent-refuge-dans-la-maison-corinne-masiero-9576818",
        "https://www.moncompagnonderoute.fr/fr/structures/maison-corinne-masiero-abej-solidarit-vuhh16lw5kr083xqj23gaou0"
      ]
    },
    {
      "id": "l05",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Hébergement d'urgence femmes seules – Eole",
      "structure": "Association Eole",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 07 87",
      "horaires": null,
      "horairesTexte": "Non précisé : l'accès se fait par le 115.",
      "services": [
        "Un hébergement d'urgence pour femmes seules.",
        "Une équipe sociale vous accompagne et vous oriente."
      ],
      "conditions": "Orientation par le 115. Réservé aux femmes seules.",
      "criteres": {
        "femmes": true
      },
      "langues": [],
      "adresseMasquee": true,
      "acces": "l26",
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://prod.eole-asso.fr/actions/hebergement-urgence-femmes",
        "https://eole-asso.fr/annuaire",
        "https://annuaire.action-sociale.org/?p=chu-eole-lille-590064606&details=caracteristiques"
      ]
    },
    {
      "id": "l06",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Hébergement d'urgence familles – Eole",
      "structure": "Association Eole",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 07 87",
      "horaires": null,
      "horairesTexte": "Non précisé : l'accès se fait par le SIAO / 115.",
      "services": [
        "Hébergement d'urgence pour parents avec enfants.",
        "Logements en foyer ou en appartements dans la métropole.",
        "Aide pour les droits, la santé et le rôle de parent."
      ],
      "conditions": "Pour les femmes ou les hommes avec enfants. Orientation par le SIAO / 115.",
      "criteres": {
        "enfants": true
      },
      "langues": [],
      "adresseMasquee": true,
      "acces": "l26",
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://prod.eole-asso.fr/actions/hebergement-urgence-familles",
        "https://www.sante.fr/autre-centre-daccueil/lille/centre-daccueil-durgence-familles-eole-lille",
        "https://annuaire.action-sociale.org/?p=chu-eole-lille-590064598&details=caracteristiques"
      ]
    },
    {
      "id": "l07",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Les Moulins de l'Espoir (Armée du Salut)",
      "structure": "Fondation de l'Armée du Salut",
      "adresse": "48 rue de Valenciennes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 52 69 09",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Hébergement (CHRS) pour personnes seules et familles.",
        "Studios avec coin cuisine et salle de bain.",
        "Accompagnement pour les papiers et pour trouver un logement."
      ],
      "conditions": "Pas d'accueil sur place sans orientation. Pour avoir une place : appelez le 115 ou demandez à une assistante sociale (demande au SIAO).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/179/3-la-fondation-de-l-armee-du-salut-les-moulins-de-l-espoir.htm",
        "https://www.groupe3f.fr/actualites/3f-residences-inaugure-le-chrs-les-moulins-de-lespoir-lille-59",
        "https://www.jeveuxaider.gouv.fr/organisations/1364-fondation-de-larmee-du-salut-chrs-de-lille-les-moulins-de-lespoir",
        "https://armeedusalut.fr/sites/default/files/mini-sites-fichiers/Pr%C3%A9sentation%20Espoir.pdf"
      ]
    },
    {
      "id": "l08",
      "cat": "manger",
      "autresCats": [],
      "nom": "RestoChaud (Restos du Cœur) – repas chaud du soir",
      "structure": "Les Restos du Cœur de la région lilloise (AD59A)",
      "adresse": "217 rue des Postes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": {
        "lun": [
          [
            "18:30",
            "20:15"
          ]
        ],
        "mar": [
          [
            "18:30",
            "20:15"
          ]
        ],
        "mer": [
          [
            "18:30",
            "20:15"
          ]
        ],
        "jeu": [
          [
            "18:30",
            "20:15"
          ]
        ],
        "ven": [
          [
            "18:30",
            "20:15"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi, 18h30-20h15 (selon la Ville de Lille). Le site des Restos du Cœur indique 18h30-20h30.",
      "services": [
        "Repas chaud gratuit le soir, assis à table.",
        "Pâtisseries et fruits.",
        "Produits d'hygiène.",
        "Le jeudi après-midi : accueil pour discuter et se détendre."
      ],
      "conditions": "Pour les personnes sans logement, isolées ou en grande difficulté.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/213/3-les-restos-du-coeur-de-la-region-lilloise-lille-centre.htm",
        "https://www.ad59a-restosducoeur.org/le-restochaud",
        "https://info.lenord.fr/restos-du-cur-des-repas-chauds-tous-les-jours-pour-les-sans-abris"
      ]
    },
    {
      "id": "l09",
      "cat": "manger",
      "autresCats": [],
      "nom": "Petit-déjeuner du samedi – Entraide protestante",
      "structure": "Entraide de l'Église protestante unie de Lille",
      "adresse": "68 rue du Marché, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 54 77 28",
      "horaires": {
        "sam": [
          [
            "08:30",
            "10:00"
          ]
        ]
      },
      "horairesTexte": "Petit-déjeuner chaque samedi, 8h30-10h (une autre source dit 8h-10h), de septembre à fin juin. Aide alimentaire le jeudi 14h-17h. Vente solidaire de vêtements le 2e samedi du mois, 11h-17h30.",
      "services": [
        "Petit-déjeuner chaque samedi matin.",
        "Ambiance amicale et fraternelle.",
        "Colis alimentaires le jeudi après-midi.",
        "Vêtements à petits prix, le 2e samedi du mois."
      ],
      "conditions": "Petit-déjeuner pour les personnes à la rue, précaires ou seules. Pas de petit-déjeuner en juillet et août.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/207/3-entraide-eglise-protestante-unie-de-lille.htm",
        "https://circonflexmag.fr/vestiaire-solidaire-de-lille-bien-plus-que-des-vetements-un-lieu-de-reconfort/"
      ]
    },
    {
      "id": "l10",
      "cat": "manger",
      "autresCats": [],
      "nom": "Repas solidaire du mardi – Ephatha",
      "structure": "Association Ephatha",
      "adresse": "19 rue Saint-Louis, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 19 52 08",
      "horaires": null,
      "horairesTexte": "Chaque mardi à 12h30, toute l'année sauf pendant les vacances d'été.",
      "services": [
        "Repas fait maison, gratuit.",
        "Repas autour d'une grande table, comme à la maison.",
        "Moment convivial pour ne pas rester seule."
      ],
      "conditions": "Ouvert à toutes et à tous. Gratuit. Venez le mardi pour 12h30. Pas de repas pendant les vacances d'été.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/257/3-ephatha.htm",
        "https://www.pariszigzag.fr/lille-actu/friperie-ephatha/",
        "https://www.jeveuxaider.gouv.fr/missions-benevolat/56949/benevolat-ephatha-3"
      ]
    },
    {
      "id": "l11",
      "cat": "manger",
      "autresCats": [],
      "nom": "La Tente des Glaneurs – fruits et légumes du dimanche",
      "structure": "Association La Tente des Glaneurs",
      "adresse": "Cour de la mairie de quartier de Wazemmes, 100 rue de l'Abbé Aerts (entrée rue Racine), 59000 Lille",
      "adresseGeo": "100 rue de l'Abbé Aerts, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 81 56 21 28",
      "horaires": null,
      "horairesTexte": "Chaque dimanche après-midi. L'heure varie selon les sources : 15h (Ville de Lille), 14h30 (site de l'association), ou 12h-15h (annuaire).",
      "services": [
        "Fruits, légumes et pain gratuits.",
        "Des fleurs aussi.",
        "Ce sont les invendus du marché de Wazemmes.",
        "Distribution en paniers, une fois par semaine."
      ],
      "conditions": "Pour les personnes en difficulté. Accès libre et gratuit. Apportez un sac solide. Venez un peu en avance.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/227/3-la-tente-des-glaneurs.htm",
        "https://latentedesglaneurs.fr/",
        "https://www.franceinfo.fr/france/ilsontlasolution/depuis-treize-ans-la-tente-des-glaneurs-cultive-la-solidarite-au-marche-de-wazemmes_5869868.html"
      ]
    },
    {
      "id": "l12",
      "cat": "manger",
      "autresCats": [],
      "nom": "Soupe du soir en hiver – salle paroissiale du Sacré-Cœur",
      "structure": "Conférences Saint-Vincent-de-Paul, paroisses Sacré-Cœur et Saint-Michel",
      "adresse": "40 rue Boucher de Perthes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 54 70 43",
      "horaires": null,
      "horairesTexte": "En hiver seulement : du lundi au samedi, 18h30-20h (saison 2024-2025 : d'octobre à avril). Une autre source dit « tous les soirs, 18h30-20h ». Dates 2026-2027 non publiées.",
      "services": [
        "Soupe, pain et dessert le soir.",
        "Accueil chaleureux par des bénévoles."
      ],
      "conditions": "Seulement en hiver (d'octobre à avril les années précédentes). Les dates 2026-2027 ne sont pas encore publiées : appelez avant. Accès libre.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/225/3-conferences-st-vincent-de-paul-paroisses-sacre-coeur-et-saint-michel.htm",
        "https://paroissendpentecote-lille.fr/accueil-avec-une-soupe/",
        "https://solidarites.lille.fr/aide/475/2-repas-du-soir.htm"
      ]
    },
    {
      "id": "l13",
      "cat": "hygiene",
      "autresCats": [
        "recharge",
        "wifi"
      ],
      "nom": "Douches solidaires de l'association La Deûle",
      "structure": "Association La Deûle",
      "adresse": "108 quai Géry Legrand, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 09 13 02",
      "horaires": null,
      "horairesTexte": "Lundi, mercredi, samedi et dimanche : 9h-12h (pour tout le monde). Vendredi 9h-12h : réservé aux femmes et aux enfants.",
      "services": [
        "Douche gratuite, avec serviette, savon et shampoing.",
        "Café offert.",
        "Recharger son téléphone.",
        "Wifi gratuit, ordinateurs, imprimante.",
        "Petites baignoires pour les bébés et jeux pour enfants.",
        "Le vendredi : petit-déjeuner et lessive possibles pour les femmes."
      ],
      "conditions": "Pour tout le monde, sans condition. Le vendredi matin : seulement les femmes et les enfants. Une seule source trouvée : appelez avant de venir.",
      "criteres": {
        "enfants": true,
        "gratuit": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/626/3-association-la-deule.htm",
        "https://www.lille.fr/Actualites/Droits-des-personnes-sans-abris-la-Ville-et-le-CCAS-engages",
        "https://ladeule.com/",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm"
      ]
    },
    {
      "id": "l14",
      "cat": "hygiene",
      "autresCats": [],
      "nom": "Au Lavoir – laverie solidaire",
      "structure": "Association Au Lavoir",
      "adresse": "32-34 rue de Thumesnil, 59000 Lille",
      "adresseGeo": "32 rue de Thumesnil, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 29 67 54",
      "horaires": {
        "lun": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi, 9h-17h.",
      "services": [
        "Laver et sécher son linge : 10 machines et 10 sèche-linge.",
        "Le prix dépend de vos revenus.",
        "Une machine est réservée aux personnes à la rue.",
        "Coin café et espace de jeux pour les enfants.",
        "Écoute et aide d'une conseillère."
      ],
      "conditions": "Payant mais pas cher : le prix dépend de vos revenus (environ 2 € au petit tarif). Adhésion de 5 € par an et fiche d'inscription. Une machine est réservée aux personnes à la rue.",
      "criteres": {
        "enfants": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/425/3-au-lavoir.htm",
        "https://www.lille.fr/lille-moulins/Actualites/Au-Lavoir",
        "https://resolis.org/?initiative=au-lavoir-une-laverie-sociale-et-solidaire-a-lille",
        "https://www.lagazettefrance.fr/article/au-lavoir-un-nouveau-concept-delaverie-au-service-d-e2-80-99un-quartier"
      ]
    },
    {
      "id": "l15",
      "cat": "sante",
      "autresCats": [
        "droits"
      ],
      "nom": "Médecins Solidarité Lille (MSL)",
      "structure": "Association Médecins Solidarité Lille",
      "adresse": "112 chemin des Postes, 59120 Loos",
      "lat": null,
      "lng": null,
      "tel": "03 20 49 04 77",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi : 9h-12h et 14h-17h.",
      "services": [
        "Médecin généraliste",
        "Consultation gynécologie",
        "Dentiste",
        "Infirmière",
        "Assistante sociale : aide pour avoir une couverture santé"
      ],
      "conditions": "Pour toute personne qui a des problèmes d'argent ou de papiers pour se soigner. Gratuit. Sans rendez-vous.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://solidarites.lille.fr/acteur/16/2-medecins-solidarite-lille-msl.htm",
        "https://solidarites.lille.fr/aide/398/2-pour-les-situations-administratives-compliquees-pour-acceder-aux-soins.htm",
        "https://www.sante-solidarite.org/fichs/11301.pdf"
      ]
    },
    {
      "id": "l16",
      "cat": "sante",
      "autresCats": [
        "droits"
      ],
      "nom": "PASS de l'hôpital Saint-Vincent-de-Paul (soins sans couverture santé)",
      "structure": "GHICL (Groupement des hôpitaux de l'Institut catholique de Lille)",
      "adresse": "Hôpital Saint-Vincent-de-Paul, boulevard de Belfort, 59000 Lille",
      "adresseGeo": "Boulevard de Belfort, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 87 48 48",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Voir un médecin à l'hôpital même sans sécurité sociale",
        "Assistante sociale : aide pour la sécurité sociale ou l'AME",
        "Médicaments selon la situation",
        "Aide pour trouver logement, nourriture, hygiène avec les partenaires"
      ],
      "conditions": "Pour toute personne avec un problème de santé qui a du mal à se soigner (pas de sécurité sociale, pas d'argent, papiers compliqués). Appeler avant de venir.",
      "criteres": {
        "gratuit": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.ghicl.fr/reseaux/pass.html",
        "https://www.ghicl.fr/fichs/11667.pdf",
        "https://solidarites.lille.fr/aide/398/2-pour-les-situations-administratives-compliquees-pour-acceder-aux-soins.htm",
        "https://www.sante.fr/trouver-aide-sante-mentale/les-permanences-dacces-aux-soins-de-sante-pass"
      ]
    },
    {
      "id": "l17",
      "cat": "sante",
      "autresCats": [],
      "nom": "CeGIDD de Lille (dépistage gratuit)",
      "structure": "Département du Nord - Service de prévention santé de Lille",
      "adresse": "13 rue Camille Guérin, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 69 80",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Avec ou sans rendez-vous du lundi au vendredi, 9h-12h et 14h-17h (dernière entrée à 16h, sauf urgence). Sans rendez-vous : priorité aux urgences (risque VIH, violences, contraception d'urgence, symptômes). Très fréquenté : venir tôt ou prendre rendez-vous.",
      "services": [
        "Test gratuit VIH, hépatites, IST",
        "Traitement gratuit des IST",
        "Traitement d'urgence après un risque VIH",
        "PrEP (médicament pour ne pas attraper le VIH)",
        "Vaccins hépatite et HPV",
        "Psychologue",
        "Assistante sociale"
      ],
      "conditions": "Gratuit. Avec ou sans rendez-vous. Venir tôt. Derrière l'Institut Pasteur (métro Lille Grand Palais).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://www.sante.fr/cegidd-lille",
        "https://www.doctolib.fr/centre-gratuit-information-depistage-diagnostic/lille/cegidd-de-lille",
        "https://services.lenord.fr/sante-sexuelle--informations-et-conseils",
        "https://solidarites.lille.fr/aide/368/2-je-souhaite-effectuer-un-depistage-sida-mst-cancer-covid-19-....htm"
      ]
    },
    {
      "id": "l18",
      "cat": "sante",
      "autresCats": [
        "ecoute"
      ],
      "nom": "Planning familial du Nord – centre de santé sexuelle",
      "structure": "Planning Familial du Nord (association)",
      "adresse": "16 avenue Kennedy, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 74 80",
      "horaires": {
        "lun": [
          [
            "14:00",
            "18:45"
          ]
        ],
        "mar": [
          [
            "14:00",
            "18:45"
          ]
        ],
        "mer": [
          [
            "14:00",
            "18:45"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:45"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:45"
          ]
        ],
        "sam": [
          [
            "09:00",
            "11:45"
          ]
        ]
      },
      "horairesTexte": "Accueil par une conseillère sans rendez-vous : lundi au vendredi 14h-18h45, samedi 9h-11h45.",
      "services": [
        "Contraception (ordonnance)",
        "Pilule du lendemain",
        "Test de grossesse",
        "Informations et aide pour une IVG",
        "Infos sur les IST",
        "Écoute et aide si vous subissez des violences"
      ],
      "conditions": "Information gratuite et anonyme. Une conseillère reçoit sans rendez-vous. Lieu discret, au rez-de-chaussée.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.planning-familial.org/fr/le-planning-familial-du-nord-59",
        "https://www.santeenfrance.fr/etablissement/49741-ctre-planif-familial-marguerite-surmon",
        "https://www.doctolib.fr/cabinet-medical/lille/planning-familial-du-nord-lille",
        "https://annuaire-entreprises.data.gouv.fr/etablissement/47966720600011"
      ]
    },
    {
      "id": "l19",
      "cat": "sante",
      "autresCats": [],
      "nom": "Urgences dentaires du CHU (centre Abel Caumartin)",
      "structure": "CHU de Lille - Service d'odontologie",
      "adresse": "1 place de Verdun, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 44 43 55",
      "horaires": {
        "lun": [
          [
            "08:15",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "mar": [
          [
            "08:15",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "mer": [
          [
            "08:15",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "08:15",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "ven": [
          [
            "08:15",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Urgences dentaires du lundi au vendredi (sauf jours fériés) : arrivée entre 8h15 et 11h, et entre 13h45 et 16h. Le soir 18h-23h, 7 jours sur 7 : conseil par téléphone au 06 73 59 21 85.",
      "services": [
        "Urgences dentaires (mal aux dents, infection)",
        "Soins dentaires"
      ],
      "conditions": "Hôpital public. Pour une urgence, venir pendant les heures d'arrivée. Métro CHU - Centre Oscar Lambret (ligne 1).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.chu-lille.fr/services/odontologie/",
        "https://solidarites.lille.fr/acteur/114/3-centre-de-soins-dentaires-abel-caumartin-du-chu-de-lille.htm",
        "https://www.hopital.fr/index.php/annuaire-etablissement/centre-de-soins-dentaires-abel-caumartin-lille,1664"
      ]
    },
    {
      "id": "l20",
      "cat": "sante",
      "autresCats": [
        "hygiene"
      ],
      "nom": "CAARUD Spiritek (réduction des risques)",
      "structure": "Association Spiritek",
      "adresse": "49 rue du Molinel, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 36 28 40",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Matériel stérile (seringues, pipes...)",
        "Informations pour consommer avec moins de risques",
        "Douche et laverie",
        "Écoute et accompagnement"
      ],
      "conditions": "Pour les personnes qui consomment des drogues. Appeler avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.drogues-info-service.fr/Adresses-utiles/1738",
        "https://www.sante.fr/centre-daccueil-et-daccompagnement-la-reduction-des-risques-pour-usagers-de-drogues-caarud/lille/caarud-association-spiritek",
        "https://www.santeenfrance.fr/etablissement/49951-caarud-spiritek",
        "https://www.epsm-al.fr/article/spiritek-un-caarud-lillois-sur-tous-les-fronts"
      ]
    },
    {
      "id": "l21",
      "cat": "sante",
      "autresCats": [],
      "nom": "Diogène – équipe mobile santé mentale et précarité",
      "structure": "EPSM de l'agglomération lilloise / EPSM Lille Métropole / CHU de Lille",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "03 59 09 04 28",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Équipe qui vient vers les personnes à la rue",
        "Aide pour la santé mentale (stress, angoisse, troubles psychiques)",
        "Psychiatre, infirmiers, psychologues",
        "Orientation vers des soins"
      ],
      "conditions": "C'est une équipe qui se déplace : elle vient vers les personnes à la rue. Appelez, ou demandez à une maraude ou un travailleur social de la contacter.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.epsm-al.fr/structure/diogene",
        "https://solidarites.lille.fr/acteur/126/3-diogene.htm",
        "https://www.epsm-lille-metropole.fr/lequipe-mobile-sante-mentale-et-precarite-diogene",
        "https://choisirleservicepublic.gouv.fr/offre-emploi/-psychologue-hf-au-sein-de-l-em3p-diogene-reference-2026-2205718/"
      ]
    },
    {
      "id": "l22",
      "cat": "sante",
      "autresCats": [],
      "nom": "Maternité Jeanne de Flandre (CHU de Lille)",
      "structure": "CHU de Lille",
      "adresse": "Hôpital Jeanne de Flandre, avenue Eugène Avinée, 59000 Lille",
      "adresseGeo": "Avenue Eugène Avinée, 59000 Lille",
      "lat": 50.60509,
      "lng": 3.0349,
      "tel": "03 20 44 69 08",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Suivi de grossesse avec sage-femme ou médecin",
        "Accouchement",
        "Gynécologie"
      ],
      "conditions": "Pour s'inscrire : par téléphone, au bureau des rendez-vous ou en ligne. Apporter si possible : carte Vitale ou attestation, carte mutuelle, pièce d'identité, résultats d'examens.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://maternite.chru-lille.fr/ma-grossesse/le-suivi-de-ma-grossesse/",
        "https://maternite.chru-lille.fr/ma-grossesse/inscription-maternite-3/",
        "https://www.hopital.fr/index.php/annuaire-etablissement/hopital-jeanne-de-flandre-lille,1312",
        "https://www.perinatalite.chu-lille.fr/wp-content/uploads/sites/16/2025/07/livret-accueil-version-2025.pdf"
      ]
    },
    {
      "id": "l23",
      "cat": "sante",
      "autresCats": [],
      "nom": "Pôle ressources santé de Lille-Sud",
      "structure": "Ville de Lille",
      "adresse": "Centre de santé de Lille-Sud, 462 rue du Faubourg d'Arras, 59000 Lille",
      "adresseGeo": "462 rue du Faubourg d'Arras, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 96 19 51",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Informations sur la santé",
        "Aide pour les droits santé (sécurité sociale, complémentaire santé solidaire, AME)",
        "Prévention, dépistages, bilans de santé",
        "Ateliers"
      ],
      "conditions": "Pour les habitants qui ont besoin d'aide pour se soigner. Métro Porte d'Arras (ou bus L14, 858).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Vivre-a-Lille/Ma-sante/Poles-ressources-sante"
      ]
    },
    {
      "id": "l24",
      "cat": "sante",
      "autresCats": [],
      "nom": "Pôle ressources santé de Fives",
      "structure": "Ville de Lille",
      "adresse": "Centre social Mosaïque, 30 rue Cabanis, 59800 Lille",
      "adresseGeo": "30 rue Cabanis, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 56 72 61",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Informations sur la santé",
        "Aide pour les droits santé (sécurité sociale, complémentaire santé solidaire, AME)",
        "Prévention, dépistages",
        "Ateliers et forums santé"
      ],
      "conditions": "Pour les habitants qui ont besoin d'aide pour se soigner. Métro Fives.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Vivre-a-Lille/Ma-sante/Poles-ressources-sante",
        "https://openagenda.com/en/metropole-europeenne-de-lille/events/forum-ma-sante-mes-droits"
      ]
    },
    {
      "id": "l25",
      "cat": "accueil",
      "autresCats": [
        "hygiene",
        "sante",
        "recharge",
        "vetements"
      ],
      "nom": "Accueil de jour abej SOLIDARITÉ (Solférino)",
      "structure": "abej SOLIDARITÉ",
      "adresse": "14 rue du Four à Chaux, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 09 10",
      "horaires": {
        "lun": [
          [
            "08:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "08:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "08:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "08:00",
            "18:00"
          ]
        ],
        "mar": [
          [
            "13:30",
            "18:00"
          ]
        ],
        "dim": [
          [
            "08:00",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Site abej (2026) : lundi au vendredi 8h-18h (mardi à partir de 13h30), dimanche 8h-12h. Ville de Lille : lundi au vendredi 8h-12h et 13h30-16h, fermé le mardi matin.",
      "services": [
        "Se poser au chaud : café, soupe, petit-déjeuner.",
        "Un espace de repos réservé aux femmes, avec casiers.",
        "Douches, toilettes et laverie.",
        "Vêtements.",
        "Recharger son téléphone gratuitement.",
        "Centre de santé : médecin, infirmière, psychologue, dermatologue.",
        "Dépistages (IST, VIH) et vaccins.",
        "Aide d'un travailleur social pour les droits et le logement."
      ],
      "conditions": "Pour les personnes à la rue de plus de 25 ans. Accès libre. Nouvelle adresse depuis décembre 2025 (avant : 228 rue de Solférino).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://abej-solidarite.fr/structure/accueil-solferino/",
        "https://abej-solidarite.fr/2026/01/23/le-nouvel-accueil-de-jour-un-lieu-repense-avec-celles-et-ceux-qui-lhabitent/",
        "https://www.lille.fr/Actualites/Nouvelle-adresse-memes-combats",
        "https://solidarites.lille.fr/acteur/167/3-abej-solidarite-accueil-de-jour.htm"
      ]
    },
    {
      "id": "l26",
      "cat": "accueil",
      "autresCats": [
        "hygiene",
        "bagagerie",
        "manger",
        "droits"
      ],
      "nom": "Accueil de jour Eole – femmes seules, couples et familles",
      "structure": "Association Eole",
      "adresse": "8 rue de Tenremonde, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 88 00",
      "horaires": {
        "lun": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "14:00"
          ]
        ],
        "ven": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "sam": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "dim": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Ville de Lille : tous les jours 9h30-12h30 et 13h30-17h, le jeudi fermeture à 14h. Site d'Eole : 7h30-17h en semaine, 8h30-17h le week-end.",
      "services": [
        "Ouvert 7 jours sur 7.",
        "Repas chaud le midi et petite collation.",
        "Douches, laverie et produits d'hygiène.",
        "Bagagerie : laisser vos sacs en sécurité.",
        "Domiciliation : une adresse pour recevoir votre courrier.",
        "Colis alimentaires.",
        "Aide pour la santé, le logement et le travail."
      ],
      "conditions": "Pour les femmes seules, avec ou sans enfants, les couples et les familles sans logement. Pas pour les hommes seuls. Sans condition et sans orientation.",
      "criteres": {
        "enfants": true,
        "sansRdv": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/105/3-association-eole-accueil-de-jour-femmes-seules-et-familles.htm",
        "https://prod.eole-asso.fr/actions/accueil-de-jour-femmes-familles",
        "https://solidarites.lille.fr/aide/248/2-accueil-de-jour-pour-les-femmes-et-familles-sans-domicile.htm",
        "https://www.sante-solidarite.org/fichs/13413.pdf"
      ]
    },
    {
      "id": "l27",
      "cat": "accueil",
      "autresCats": [
        "hygiene",
        "recharge",
        "droits"
      ],
      "nom": "Accueil de jour Magdala",
      "structure": "Association Magdala",
      "adresse": "31 rue des Sarrazins, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 29 62",
      "horaires": {
        "lun": [
          [
            "09:00",
            "11:45"
          ]
        ],
        "mar": [
          [
            "09:00",
            "11:45"
          ]
        ],
        "mer": [
          [
            "09:00",
            "11:45"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "11:45"
          ]
        ],
        "ven": [
          [
            "09:00",
            "11:45"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi 9h-11h45. Douches le matin, l'après-midi sur rendez-vous.",
      "services": [
        "Café, soupe ou chocolat chaud.",
        "Douches le matin (l'après-midi sur rendez-vous).",
        "Recharger son téléphone, utiliser un ordinateur.",
        "Domiciliation : une adresse pour le courrier.",
        "Parler avec un travailleur social.",
        "Permanences santé et avocat."
      ],
      "conditions": "Pour les personnes en grande précarité, isolées ou à la rue. Douche l'après-midi sur rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://magdala.asso.fr/accompagnement-social/nos-lieux/accueil-de-jour/",
        "https://solidarites.lille.fr/acteur/230/3-association-magdala-accueil-de-jour.htm",
        "https://www.lillemetropole.fr/sites/default/files/2025-03/Guide%20info%20sans%20abris%20(Version%20facile%20%C3%A0%20lire%20et%20%C3%A0%20comprendre%20-%20FALC).pdf"
      ]
    },
    {
      "id": "l28",
      "cat": "accueil",
      "autresCats": [
        "hygiene",
        "vetements"
      ],
      "nom": "Accueil de jour Frédéric Ozanam",
      "structure": "Société Saint-Vincent-de-Paul",
      "adresse": "81 rue Barthélémy Delespaul, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 06 00 60",
      "horaires": {
        "lun": [
          [
            "08:45",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "mar": [
          [
            "08:45",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "08:45",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "ven": [
          [
            "08:45",
            "11:00"
          ],
          [
            "13:45",
            "16:00"
          ]
        ],
        "mer": [
          [
            "13:45",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Ville de Lille : lundi au vendredi 8h45-11h30 et 13h45-16h30, fermé le mercredi matin. Site de la SSVP : lundi, mardi, jeudi, vendredi 8h45-11h et 13h15-16h ; mercredi 13h15-16h ; samedi 8h30-12h.",
      "services": [
        "Parler avec un travailleur social.",
        "Douches (sur rendez-vous).",
        "Laver son linge gratuitement, 2 fois par mois.",
        "Vestiaire d'urgence (1 à 2 demi-journées par semaine).",
        "Aide alimentaire.",
        "Coiffeur, médecin et psychologue.",
        "Ateliers et cours de français."
      ],
      "conditions": "Pour toute personne en difficulté. Pour la douche et la lessive, prenez rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/206/3-accueil-de-jour-frederic-ozanam.htm",
        "https://www.ssvp.fr/accueil-frederic-ozanam-de-lille/",
        "https://lille.catholique.fr/accueil-frederic-ozanam/",
        "https://www.lillemetropole.fr/sites/default/files/2025-03/Guide%20info%20sans%20abris%20(Version%20facile%20%C3%A0%20lire%20et%20%C3%A0%20comprendre%20-%20FALC).pdf"
      ]
    },
    {
      "id": "l29",
      "cat": "accueil",
      "autresCats": [
        "sante",
        "hygiene",
        "droits"
      ],
      "nom": "Point de Repère (abej) – accueil de jour 18-25 ans",
      "structure": "abej SOLIDARITÉ (Point de Repère, aussi CAARUD)",
      "adresse": "22 parvis Saint-Michel, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 09 20",
      "horaires": {
        "lun": [
          [
            "08:00",
            "12:00"
          ],
          [
            "13:00",
            "16:00"
          ]
        ],
        "mar": [
          [
            "08:00",
            "12:00"
          ],
          [
            "13:00",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "08:00",
            "12:00"
          ],
          [
            "13:00",
            "16:00"
          ]
        ],
        "ven": [
          [
            "08:00",
            "12:00"
          ],
          [
            "13:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Lundi, mardi, jeudi, vendredi : 8h-12h et 13h-16h. Fermé le mercredi toute la journée.",
      "services": [
        "Médecin",
        "Infirmière",
        "Psychologue",
        "Toilettes et douches",
        "Petit-déjeuner",
        "Adresse postale (domiciliation)",
        "Matériel propre pour les drogues (seringues, pipes)"
      ],
      "conditions": "Pour les jeunes de 18 à 25 ans sans domicile. Gratuit. C'est aussi un lieu de réduction des risques pour les personnes qui consomment des drogues.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://solidarites.lille.fr/aide/445/2-accueil-de-jour-pour-les-jeunes-de-18-a-25-ans.htm",
        "https://solidarites.lille.fr/aide/374/2-pour-les-jeunes-de-18-a-25-ans-sans-domicile.htm",
        "https://abej-solidarite.fr/2020/05/04/un-nouvel-accueil-de-jour-pour-les-18-25-ans/",
        "https://abej-solidarite.fr/structure/centres-de-sante/"
      ]
    },
    {
      "id": "l30",
      "cat": "accueil",
      "autresCats": [
        "manger",
        "droits"
      ],
      "nom": "AIDA – accueil de jour pour personnes exilées",
      "structure": "AIDA (Aide à l'Insertion des Demandeurs d'Asile), liée à Emmaüs",
      "adresse": "58-60 rue de la Justice, 59000 Lille",
      "adresseGeo": "58 rue de la Justice, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 78 25 67",
      "horaires": {
        "lun": [
          [
            "14:00",
            "16:00"
          ]
        ],
        "mar": [
          [
            "08:30",
            "11:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ],
        "mer": [
          [
            "08:30",
            "11:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "08:30",
            "11:00"
          ],
          [
            "14:00",
            "17:00"
          ]
        ],
        "ven": [
          [
            "08:30",
            "11:00"
          ],
          [
            "14:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Mardi au vendredi 8h30-11h ; mardi et jeudi 14h-17h ; lundi, mercredi et vendredi 14h-16h. Repas de 11h30 à 12h30. Du 1er décembre au 31 mars : aussi le week-end, 8h30-17h.",
      "services": [
        "Repas sur place, de 11h30 à 12h30.",
        "Laverie.",
        "Aide juridique et sociale.",
        "Aide pour les papiers."
      ],
      "conditions": "Pour les demandeuses d'asile, les migrantes et les réfugiées. Aussi pour les personnes sans titre de séjour. Accès libre.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/242/3-aida-association-insertion-des-demandeurs-d-asile.htm",
        "https://solidarites.lille.fr/aide/477/2-repas-du-midi.htm"
      ]
    },
    {
      "id": "l31",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "L'Île de Solidarité – accueil du matin",
      "structure": "Association L'Île de Solidarité",
      "adresse": "13 rue de Rivoli, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 63 65 74 36",
      "horaires": {
        "lun": [
          [
            "08:30",
            "12:00"
          ]
        ],
        "mar": [
          [
            "08:30",
            "12:00"
          ]
        ],
        "mer": [
          [
            "08:30",
            "12:00"
          ]
        ],
        "jeu": [
          [
            "08:30",
            "12:00"
          ]
        ],
        "ven": [
          [
            "08:30",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Lundi au vendredi 8h30-12h.",
      "services": [
        "Recharger son téléphone",
        "Wifi gratuit pendant l'accueil (demandez le code sur place).",
        "Petit-déjeuner",
        "Douches",
        "Moments de détente"
      ],
      "conditions": "Pour toute personne en difficulté.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/aide/247/2-se-laver-laver-ses-vetements-acceder-aux-toilettes-se-poser.htm",
        "https://www.helloasso.com/associations/l-ile-de-solidarite",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm"
      ]
    },
    {
      "id": "l32",
      "cat": "ecoute",
      "autresCats": [
        "accueil",
        "hygiene",
        "bagagerie",
        "vetements",
        "droits"
      ],
      "nom": "Accueil de jour Rosa (SOLFA) – femmes victimes de violences",
      "structure": "SOLFA – Solidarité Femmes Accueil",
      "adresse": "94 rue de Wazemmes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 94 27",
      "horaires": {
        "lun": [
          [
            "13:00",
            "17:00"
          ]
        ],
        "mar": [
          [
            "13:00",
            "20:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "07:00",
            "15:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "13:00"
          ]
        ]
      },
      "horairesTexte": "Lundi 13h-17h, mardi 13h-20h, mercredi 9h-17h, jeudi 7h-15h, vendredi 9h-13h.",
      "services": [
        "Écoute et aide pour les femmes victimes de violences",
        "Douche",
        "Laver son linge",
        "Garder ses affaires (bagagerie)",
        "Vêtements",
        "Adresse pour recevoir son courrier (domiciliation)",
        "Coin pour se reposer",
        "Ordinateurs",
        "Espace pour les enfants",
        "Orientation vers les bons services"
      ],
      "conditions": "Réservé aux femmes victimes de violences, avec ou sans enfants. Sans rendez-vous. On ne vous demande rien, vous pouvez rester anonyme. Autre numéro : 06 58 23 65 79.",
      "criteres": {
        "femmes": true,
        "enfants": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://solidarites.lille.fr/acteur/264/3-association-solfa-solidarite-femmes-accueil-pole-violences-faites-aux-femmes.htm",
        "https://www.caf.fr/sites/default/files/medias/598/Documents/AVVC/A4%20AVVC%20Orientation%20accueil.pdf",
        "https://www.nord.gouv.fr/contenu/telechargement/94037/671863/file/Fiche%20arrondissement%20Lille_fev_2024.pdf",
        "https://www.federationsolidarite.org/wp-content/uploads/2026/01/OE-HDF-4.pdf"
      ]
    },
    {
      "id": "l33",
      "cat": "ecoute",
      "autresCats": [
        "droits"
      ],
      "nom": "AIAVM – France Victimes 59 (aide aux victimes)",
      "structure": "Association Intercommunale d'Aide aux Victimes et de Médiation (AIAVM), membre de France Victimes",
      "adresse": "Hôtel de Ville, place Roger Salengro, 59000 Lille",
      "adresseGeo": "Place Roger Salengro, 59000 Lille",
      "lat": 50.63044,
      "lng": 3.07115,
      "tel": "03 20 49 50 79",
      "horaires": {
        "lun": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:30",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h30 à 12h30 et de 13h30 à 17h. Pas d'accueil au téléphone le mercredi après-midi.",
      "services": [
        "Aide aux victimes (violences, agressions)",
        "Explications sur vos droits",
        "Aide pour les démarches et la plainte",
        "Orientation vers des professionnels"
      ],
      "conditions": "Pour toute personne victime d'une infraction (violences, agression…). Femmes et hommes.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://www.caf.fr/sites/default/files/medias/598/Documents/AVVC/A4%20AVVC%20Orientation%20accueil.pdf",
        "https://www.france-victimes.fr/index.php/docman/grand-public/offres-d-emploi/4063-07-2026-juriste-cdi-temps-complet-aiavm-france-victimes-59-lille/file",
        "https://france-victimes.fr/index.php/docman/grand-public/offres-d-emploi/4032-12-2025-juriste-cdi-temps-plein-aiavm-lille/file",
        "https://www.inc-conso.fr/node/4536"
      ]
    },
    {
      "id": "l34",
      "cat": "ecoute",
      "autresCats": [
        "sante"
      ],
      "nom": "MAVIe – Maison d'accueil des victimes de violences (CHU de Lille)",
      "structure": "CHU de Lille",
      "adresse": "Hôpital Albert Calmette, 2e étage, boulevard du Professeur Jules Leclercq, 59000 Lille",
      "adresseGeo": "Boulevard du Professeur Jules Leclercq, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 44 44 55",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Accueil des victimes de violences à l'hôpital",
        "Médecins, médecins légistes (constat des blessures)",
        "Psychologues et psychiatres",
        "Travailleurs sociaux et associations d'aide aux victimes",
        "Police sur place pour porter plainte"
      ],
      "conditions": "Pour toutes les victimes de violences : femmes, enfants, personnes âgées ou fragiles. Appeler avant de venir.",
      "criteres": {
        "enfants": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://www.chu-lille.fr/wp-content/uploads/2025/05/CHU-LILLE-Plaquette-inauguration-MAVIe-280525.pdf",
        "https://www.creditmutuel.fr/fr/alliancefederale/presse/communiques-de-presse/mavie-la-fondation-cmne-mecene-majeur.html",
        "https://www.chu-lille.fr/wp-content/uploads/2026/04/Plaquette-UMJ-2025.pdf"
      ]
    },
    {
      "id": "l35",
      "cat": "ecoute",
      "autresCats": [
        "droits"
      ],
      "nom": "CIDFF – droits des femmes et des familles",
      "structure": "CIDFF Nord / Territoires",
      "adresse": "48 rue Nicolas Leblanc, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 70 22 18",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous, du lundi au vendredi 9h-12h30 et 13h30-17h (document de la CAF du Nord). Permanence à la mairie de quartier de Lille-Sud les 2e et 4e mercredis du mois, 13h30-16h30.",
      "services": [
        "Conseils gratuits d'une juriste sur vos droits : séparation, enfants, travail.",
        "Écoute et aide pour les violences dans le couple ou la famille.",
        "Soutien avec une psychologue.",
        "Permanence à la mairie de quartier de Lille-Sud : 2e et 4e mercredis du mois, 13h30-16h30."
      ],
      "conditions": "Pour les femmes et les familles. Sur rendez-vous : appelez. Gratuit.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/263/3-cidff-centre-d-information-sur-les-droits-des-femmes-et-des-familles.htm",
        "https://www.nord.gouv.fr/index.php/contenu/telechargement/94241/673047/file/Fiche arrondissement Lille_fev_2024.pdf",
        "https://www.nord.gouv.fr/contenu/telechargement/92739/663233/file/Les contacts contre les violences conjugales dans le département du Nord.pdf",
        "https://www.caf.fr/sites/default/files/medias/598/Documents/AVVC/A4%20AVVC%20Orientation%20accueil.pdf"
      ]
    },
    {
      "id": "l36",
      "cat": "ecoute",
      "autresCats": [],
      "nom": "Hôtel de police de Lille – porter plainte",
      "structure": "Police nationale – avec l'AIAVM (France Victimes 59)",
      "adresse": "19 rue de Marquillies, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 62 59 80 00",
      "horaires": "24/7",
      "horairesTexte": "Commissariat ouvert 24h/24, 7j/7. Horaires du travailleur social non connus.",
      "services": [
        "Porter plainte, 24 h/24.",
        "Un travailleur social peut écouter les victimes et les orienter (horaires à demander).",
        "Aide en cas de crise ou d'urgence."
      ],
      "conditions": "Pour les victimes de violences, y compris dans le couple. En urgence, appeler le 17 ou le 112. Si vous ne pouvez pas parler ou entendre : SMS au 114.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://lannuaire.service-public.fr/hauts-de-france/nord/commissariat_police-59350-02",
        "https://candidat.francetravail.fr/offres/recherche/detail/191LWQJ",
        "https://france-victimes.fr/index.php/docman/grand-public/offres-d-emploi/3830-01-2024-travailleur-se-social-e-cdi-temps-plein-aiavim-lille/file"
      ]
    },
    {
      "id": "l37",
      "cat": "ecoute",
      "autresCats": [
        "sante",
        "droits"
      ],
      "nom": "Entr'Actes (Itinéraires) – personnes en situation de prostitution",
      "structure": "Association Itinéraires",
      "adresse": "10 rue de Metz, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 64 66",
      "horaires": {
        "mar": [
          [
            "14:30",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:30",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Accueil : mardi et jeudi de 14h30 à 18h, vendredi de 14h à 17h. Accès libre.",
      "services": [
        "Lieu d'accueil et d'échange",
        "Consultations avec médecins et infirmière",
        "Prévention santé, dépistages, vaccins",
        "Conseils sur vos droits",
        "Aide pour les papiers et démarches",
        "Ateliers",
        "Équipe qui vient dans la rue (unité mobile)"
      ],
      "conditions": "Pour les personnes en situation de prostitution. Accès libre, sans rendez-vous.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/183/3-itineraires-entr-actes.htm",
        "https://itineraires.asso.fr/entractes-reduction-des-risques-lies-a-la-prostitution/",
        "https://solidarites.lille.fr/aide/454/2-pour-les-personnes-dans-la-prostitution.htm"
      ]
    },
    {
      "id": "l38",
      "cat": "vetements",
      "autresCats": [],
      "nom": "Friperie solidaire Ephatha",
      "structure": "Association Ephatha",
      "adresse": "176 rue de Lannoy, 59000 Lille",
      "adresseGeo": "176 rue de Lannoy, Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 19 52 08",
      "horaires": null,
      "horairesTexte": "Friperie et café solidaire : du lundi au samedi, 14h-19h (selon un article de presse, à confirmer).",
      "services": [
        "Vêtements de 0,50 à 10 euros.",
        "Café solidaire.",
        "L'argent paie les repas gratuits du mardi."
      ],
      "conditions": "Ouvert à tous. Payant, petits prix : de 0,50 € à 10 €. Café solidaire à l'étage pour les personnes seules ou en difficulté.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "basse",
      "sources": [
        "https://www.pariszigzag.fr/lille-actu/friperie-ephatha/",
        "https://www.findglocal.com/FR/Lille/1113407548707948/Caf%C3%A9-Solidaire-Ephatha"
      ]
    },
    {
      "id": "l39",
      "cat": "droits",
      "autresCats": [],
      "nom": "Maison des Solidarités (CCAS de Lille)",
      "structure": "CCAS / Ville de Lille",
      "adresse": "104-108 boulevard de Metz, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 33 90",
      "horaires": {
        "lun": [
          [
            "13:30",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Lundi 13h30-17h. Mardi au vendredi 9h-17h sans interruption.",
      "services": [
        "Domiciliation : une adresse pour recevoir votre courrier",
        "Aide pour vos papiers et vos droits (CAF, carte d'identité, aide juridique...)",
        "Information et conseils",
        "Accompagnement social",
        "Aide aux démarches en ligne (France Services au 106)"
      ],
      "conditions": "Pour les habitants de Lille. Domiciliation : il faut un lien avec Lille. Possible de prendre rendez-vous au téléphone.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://solidarites.lille.fr/acteur/1028/3-maison-des-solidarites.htm",
        "https://www.lille.fr/Nos-equipements/La-Maison-des-Solidarites",
        "https://solidarites.lille.fr/aide/240/2-domiciliation.htm",
        "https://udccas59.fr/ressources/article/ccas-de-lille-ouverture-de-la-maison-des-solidarites/"
      ]
    },
    {
      "id": "l40",
      "cat": "droits",
      "autresCats": [
        "vetements"
      ],
      "nom": "Croix-Rouge – unité locale de Lille (domiciliation, vestiaire)",
      "structure": "Croix-Rouge française",
      "adresse": "10/12 place Guy de Dampierre, 59000 Lille",
      "adresseGeo": "10 place Guy de Dampierre, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 16 98 60",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Domiciliation et vestiaire : lundi au vendredi 9h-12h. Vestiboutique : lundi et jeudi 14h-17h.",
      "services": [
        "Domiciliation gratuite : une adresse pour recevoir votre courrier",
        "Courrier trié et donné chaque matin par des bénévoles",
        "Cette adresse aide pour : aides sociales, papiers d'identité, compte en banque, demande d'asile, listes électorales",
        "Vêtements gratuits pour les personnes en difficulté (demandez à l'accueil).",
        "Vestiboutique : vêtements à petits prix, ouverte à tous.",
        "Épicerie solidaire."
      ],
      "conditions": "Domiciliation gratuite pour les personnes sans domicile. Vêtements gratuits seulement pour les personnes en difficulté. Au téléphone, tapez 1.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://www.croix-rouge.fr/unite-locale-de-lille",
        "https://solidarites.lille.fr/acteur/95/3-croix-rouge-francaise-unite-locale-de-lille.htm",
        "https://solidarites.lille.fr/aide/240/2-domiciliation.htm",
        "https://solidarites.lille.fr/aide/319/2-se-vetir-pas-cher-ou-gratuitement.htm"
      ]
    },
    {
      "id": "l41",
      "cat": "droits",
      "autresCats": [],
      "nom": "La Cimade – permanence juridique pour les personnes étrangères",
      "structure": "La Cimade (groupe local de Lille)",
      "adresse": "9 boulevard de la Moselle, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": null,
      "horaires": {
        "mar": [
          [
            "14:00",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "17:00"
          ]
        ],
        "sam": [
          [
            "09:00",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Permanences sans rendez-vous : mardi et jeudi 14h-17h, samedi 9h-12h. Réunions d'information sur l'asile : 2e vendredi du mois 14h-16h et 4e samedi du mois 10h-12h.",
      "services": [
        "Aide pour les papiers des personnes étrangères",
        "Asile, titre de séjour, régularisation",
        "Nationalité, visa, regroupement familial",
        "Réunions d'information sur la demande d'asile"
      ],
      "conditions": "Pour les personnes étrangères (et les Français pour un membre de leur famille étranger). Sans rendez-vous. Métro Port de Lille.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://www.lacimade.org/wp-content/uploads/2024/03/LaCimadeNordPicardie_presentation-des-actions-menees_sept2025-2.pdf",
        "https://lacimade.org/wp-content/uploads/2024/03/La-Cimade-Nord-Picardie_presentation_2024.pdf"
      ]
    },
    {
      "id": "l42",
      "cat": "droits",
      "autresCats": [],
      "nom": "Point-justice – Maison de la Médiation et du Citoyen",
      "structure": "Ville de Lille / CDAD du Nord (Point d'accès au droit)",
      "adresse": "Hôtel de Ville, place Roger Salengro (côté Porte de Paris), 59000 Lille",
      "adresseGeo": "Place Roger Salengro, 59000 Lille",
      "lat": 50.63044,
      "lng": 3.07115,
      "tel": "03 20 49 50 77",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:30",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Lundi au vendredi 9h-12h30 et 13h30-17h. Fermé samedi et dimanche.",
      "services": [
        "Conseils sur la loi, gratuits",
        "Rendez-vous avec avocat, notaire, conciliateur de justice",
        "Délégué du Défenseur des droits",
        "Aide aux victimes",
        "Permanences CIDFF (droits des femmes) et AIDA (étrangers)"
      ],
      "conditions": "Ouvert à tous, gratuit, sans condition de revenus. Rendez-vous avec un juriste possible (formulaire en ligne ou téléphone).",
      "criteres": {
        "gratuit": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "haute",
      "sources": [
        "https://solidarites.lille.fr/aide/626/2-pour-tous.htm",
        "https://www.lille.fr/Annuaire-des-demarches/Conseil-juridique",
        "https://www.cdad-nord.justice.fr/c/63/1/mjd-et-point-justice-lille-et-metropole.html",
        "https://formulaires.mesdemarches.lille.fr/prendre-rendez-vous-avec-un-juriste-a-la-maison-de-la-mediation-et-du-citoyen/"
      ]
    },
    {
      "id": "l43",
      "cat": "droits",
      "autresCats": [],
      "nom": "Maison de l'Avocat – consultations gratuites",
      "structure": "Ordre des avocats de Lille",
      "adresse": "8 rue d'Angleterre, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 73 45",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Consultations gratuites avec un avocat"
      ],
      "conditions": "Appeler avant pour connaître les jours de consultation.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-07",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/975/3-maison-de-l-avocat.htm",
        "https://solidarites.lille.fr/aide/280/2-avocat.htm",
        "https://www.annuaire-administration.com/permanence-juridique/point-d-acces-au-droit-de-lille-permanence-juridique-59350-05.html"
      ]
    },
    {
      "id": "l44",
      "cat": "recharge",
      "autresCats": [
        "wifi"
      ],
      "nom": "Médiathèque Jean Lévy (Lille-Centre)",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "32-34 rue Edouard Delesalle, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 15 97 20",
      "horaires": {
        "lun": [
          [
            "14:00",
            "19:00"
          ]
        ],
        "mar": [
          [
            "14:00",
            "19:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "19:00"
          ]
        ],
        "jeu": [
          [
            "10:00",
            "19:00"
          ]
        ],
        "ven": [
          [
            "12:00",
            "20:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "19:00"
          ]
        ]
      },
      "horairesTexte": "Toute l'année : lundi et mardi 14h-19h ; mercredi, jeudi, samedi 10h-19h ; vendredi 12h-20h. En été : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-18h.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs gratuits avec internet (2 heures par jour, réserver sur place)",
        "Ordinateur rapide (15 minutes)",
        "Imprimer ou écrire des documents (traitement de texte)",
        "Conseiller numérique pour aider (mar, jeu, ven 14h-18h ; mer et sam 10h-12h)",
        "Salle pour lire et s'asseoir au chaud"
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-Lille-Centre-Jean-Levy",
        "https://bm-lille.fr/jean-levy-lille-centre.aspx?_lg=fr-FR",
        "https://bm-lille.fr/services-numeriques.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/acteur/145/3-mediatheque-jean-levy.htm",
        "https://bm-lille.fr/horaires.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires-ete-2026.aspx",
        "https://bm-lille.fr/tarifs.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://www.lille.fr/Annuaire-des-demarches/Inscription-a-la-bibliotheque",
        "https://bm-lille.fr/inscription-bibliotheque.aspx?_lg=fr-FR",
        "https://bm-lille.fr/Default/basicfilesdownload.ashx?itemGuid=26F7A5E9-B183-40C0-8435-EBD8A9F6032B"
      ]
    },
    {
      "id": "l45",
      "cat": "recharge",
      "autresCats": [
        "wifi"
      ],
      "nom": "Médiathèque de Fives",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "18 rue Bourjembois, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 47 55 14",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs gratuits avec internet, à réserver sur place.",
        "Lieu calme pour s'asseoir et lire"
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-de-Fives",
        "https://solidarites.lille.fr/acteur/148/3-mediatheque-de-fives.htm",
        "https://bm-lille.fr/fives.aspx?_lg=fr-FR",
        "https://bm-lille.fr/tarifs.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://www.lille.fr/Annuaire-des-demarches/Inscription-a-la-bibliotheque",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm",
        "https://bm-lille.fr/services-numeriques.aspx?_lg=fr-FR"
      ]
    },
    {
      "id": "l46",
      "cat": "recharge",
      "autresCats": [
        "wifi"
      ],
      "nom": "Médiathèque de Lille-Sud",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "11 rue de l'Asie, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 53 07 62",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs gratuits avec internet, à réserver sur place.",
        "Lieu calme pour s'asseoir et lire"
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-de-Lille-Sud",
        "https://bm-lille.fr/default/horaires.aspx?_lg=fr-FR",
        "https://www.citizenkid.com/sortie/mediatheque-de-lille-sud-lille-a1013027",
        "https://www.lille.fr/lille-sud/Decouvrir-le-quartier/Culture-loisirs-et-patrimoine/Mediatheque-de-Lille-Sud",
        "https://bm-lille.fr/default/lille-sud.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/acteur/149/1-mediatheque-de-lille-sud.htm",
        "https://bm-lille.fr/tarifs.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm"
      ]
    },
    {
      "id": "l47",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Médiathèque de Wazemmes",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "134 rue de l'Abbé Aerts, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 12 84 68",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Tablettes avec internet, gratuites sur place.",
        "Se poser au chaud.",
        "Accès en fauteuil (rampe et ascenseur)."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-de-Wazemmes",
        "https://www.lille.fr/Wazemmes/Decouvrir-le-quartier/Culture-loisirs-et-patrimoine/Mediatheque-de-Wazemmes",
        "https://bm-lille.fr/default/wazemmes.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/acteur/153/1-mediatheque-de-wazemmes.htm",
        "https://solidarites.lille.fr/acteur/153/3-mediatheque-de-wazemmes.htm",
        "https://bm-lille.fr/tarifs.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm",
        "https://www.citizenkid.com/sortie/kilikili-a1065437",
        "https://www.pagesjaunes.fr/pros/55382031"
      ]
    },
    {
      "id": "l48",
      "cat": "wifi",
      "autresCats": [],
      "nom": "Médiathèque du Vieux-Lille",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "25-27 place Louise de Bettignies, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 75 90",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Permanences numériques « Pause-Café Solidaire » : mardi et jeudi 14h-17h30, samedi 10h-12h.",
        "Se poser au chaud, places assises."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée). Une panne d'internet a été signalée sur les ordinateurs : appelez avant pour savoir si le wifi marche.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "basse",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-du-Vieux-Lille",
        "https://bm-lille.fr/default/vieux-lille.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/acteur/152/3-mediatheque-du-vieux-lille.htm",
        "https://bm-lille.fr/services-numeriques.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires.aspx?_lg=fr-FR",
        "https://www.lille.fr/Vieux-Lille/Decouvrir-le-quartier/Culture-loisirs-et-patrimoine/Mediatheque-du-Vieux-Lille",
        "https://bm-lille.fr/vieux-lille.aspx",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm",
        "https://rdvemploipublic.fr/offres/responsable-adjoint-de-la-mediatheque-de-vieux-lille-59-o059260827001223"
      ]
    },
    {
      "id": "l49",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Médiathèque des Bois-Blancs",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "36 avenue Marx Dormoy, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 92 52 87",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs avec internet, à réserver sur place.",
        "Se poser au chaud."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-des-Bois-Blancs",
        "https://bm-lille.fr/default/bois-blancs.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/acteur/146/3-mediatheque-des-bois-blancs.htm"
      ]
    },
    {
      "id": "l50",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Médiathèque de Moulins",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "8 allée de la Filature, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 55 30 93",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs gratuits avec internet.",
        "Impression gratuite de 5 pages par jour.",
        "Se poser au chaud."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-de-Moulins",
        "https://www.lille.fr/lille-moulins/Decouvrir-le-quartier/Culture-loisirs-et-patrimoine/Mediatheque-de-Moulins",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires.aspx?_lg=fr-FR",
        "https://solidarites.lille.fr/aide/608/2-pour-une-consultation-libre.htm?show=78",
        "https://solidarites.lille.fr/aide/586/2-acceder-au-wifi-recharger-son-telephone.htm",
        "https://www.citizenkid.com/sortie/mediatheque-de-moulins-lille-a1012047",
        "https://acceslibre.beta.gouv.fr/app/59-lille/a/bibliotheque-mediatheque/erp/mairie-de-lille-mediatheque-de-quartier-moulins/rpa_pdf"
      ]
    },
    {
      "id": "l51",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Médiathèque de Saint-Maurice Pellevoisin",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "205 bis rue du Faubourg de Roubaix, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 12 53 90",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi, vendredi 14h-18h ; mercredi et samedi 10h-13h et 14h-18h. Vacances scolaires : mardi au samedi 14h-18h. Fermé le dimanche, le lundi et les jours fériés.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs et tablettes avec internet.",
        "Impression gratuite de 5 pages par jour.",
        "Se poser au chaud."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée).",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-de-Saint-Maurice-Pellevoisin",
        "https://solidarites.lille.fr/acteur/151/3-mediatheque-de-saint-maurice-pellevoisin.htm",
        "https://solidarites.lille.fr/aide/608/1-pour-une-consultation-libre.htm?show=82",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires.aspx"
      ]
    },
    {
      "id": "l52",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Le Fil, médiathèque d'Hellemmes",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "48 rue Faidherbe, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 20 56 93 38",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi et vendredi 14h-18h ; mercredi et samedi 10h-18h. Fermé le dimanche et le lundi. Horaires différents pendant les vacances.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs ou tablettes sur place.",
        "Toilettes adaptées.",
        "Se poser au chaud."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée). Pas d'impression ni de photocopie.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://bm-lille.fr/bml/hellemmes-le-fil.aspx?_lg=fr-FR",
        "https://www.hellemmes.fr/Culture-et-loisirs/La-culture-a-Hellemmes/Le-Fil-mediatheque/La-mediatheque-infos-pratiques",
        "https://bm-lille.fr/default/horaires.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires.aspx?_lg=fr-FR",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://bm-lille.fr/services-numeriques.aspx?_lg=fr-FR",
        "https://bm-lille.fr/default/tarifs.aspx?_lg=fr-FR",
        "https://www.lille.fr/Annuaire-des-demarches/Inscription-a-la-bibliotheque"
      ]
    },
    {
      "id": "l53",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "L'Odyssée, médiathèque de Lomme",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "794 avenue de Dunkerque, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 17 27 40",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "18:00"
          ]
        ],
        "dim": [
          [
            "10:00",
            "13:00"
          ]
        ]
      },
      "horairesTexte": "Période scolaire : mardi, jeudi et vendredi 14h-18h ; mercredi et samedi 10h-18h ; dimanche 10h-13h. Fermé le lundi et les jours fériés. En été : mardi au samedi, fermé le dimanche.",
      "services": [
        "Wifi gratuit, sans rien acheter. Pour se connecter, demandez à l'accueil : le code arrive en général par SMS, ou avec la carte gratuite de consultation (pièce d'identité demandée).",
        "Ordinateurs ou tablettes sur place.",
        "80 places assises, toilettes adaptées.",
        "Ouvert le dimanche matin."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Pour le wifi : un portable qui reçoit les SMS, ou la carte gratuite de consultation sur place (pièce d'identité demandée). Pas d'impression ni de photocopie.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://bm-lille.fr/lomme.aspx?_lg=fr-FR",
        "https://bm-lille.fr/default/lomme.aspx",
        "https://bm-lille.fr/default/horaires.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires.aspx?_lg=fr-FR",
        "https://bm-lille.fr/horaires-ete-2026.aspx",
        "https://www.ville-lomme.fr/Nos-equipements/L-Odyssee-mediatheque",
        "https://www.ville-lomme.fr/Culture-et-loisirs/La-culture-a-Lomme/L-Odyssee-mediatheque",
        "https://bm-lille.fr/faq.aspx?_lg=fr-FR",
        "https://bm-lille.fr/services-numeriques.aspx?_lg=fr-FR",
        "https://www.lille.fr/Annuaire-des-demarches/Inscription-a-la-bibliotheque"
      ]
    },
    {
      "id": "l54",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Médiathèque de la Cité (hôpital Claude Huriez)",
      "structure": "CHU de Lille, avec la Bibliothèque municipale de Lille",
      "adresse": "Hall de l'hôpital Claude Huriez, rue Michel Polonovski, 59000 Lille",
      "adresseGeo": "1 place de Verdun, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 62 94 36 50",
      "horaires": {
        "lun": [
          [
            "12:00",
            "16:00"
          ]
        ],
        "mar": [
          [
            "12:00",
            "16:00"
          ]
        ],
        "mer": [
          [
            "12:00",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "12:00",
            "16:00"
          ]
        ],
        "ven": [
          [
            "12:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 12h à 16h. Fermé le samedi et le dimanche.",
      "services": [
        "Wifi gratuit : demandez à l'accueil de la médiathèque pour vous connecter.",
        "Ordinateurs avec internet en libre-service.",
        "Se poser au chaud et lire (30 à 40 places assises)."
      ],
      "conditions": "Ouverte à tout le monde, pas seulement aux patients. Gratuit. Elle est dans le hall de l'hôpital : l'accueil ou la sécurité peuvent vous demander ce que vous venez faire. Métro ligne 1, station CHU – Centre Oscar Lambret.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://bm-lille.fr/bml/mediatheque-de-la-cite-chu-de-lille.aspx?_lg=fr-FR",
        "https://www.chu-lille.fr/wp-content/uploads/2025/08/agenda-culturel-2025-2026-web.pdf",
        "https://www.chu-lille.fr/pendant-votre-hospitalisation/",
        "https://chu-lille.fr/wp-content/uploads/2023/09/huriez.pdf",
        "https://www.chu-lille.fr/connectez-vous-a-la-wifi-du-chu-de-lille"
      ]
    },
    {
      "id": "l55",
      "cat": "wifi",
      "autresCats": [
        "recharge"
      ],
      "nom": "Gare Lille Flandres (hall)",
      "structure": "SNCF Gares & Connexions",
      "adresse": "Place des Buisses, 59000 Lille",
      "lat": 50.63639,
      "lng": 3.07083,
      "tel": "",
      "horaires": {
        "lun": [
          [
            "04:35",
            "23:45"
          ]
        ],
        "mar": [
          [
            "04:35",
            "23:45"
          ]
        ],
        "mer": [
          [
            "04:35",
            "23:45"
          ]
        ],
        "jeu": [
          [
            "04:35",
            "23:45"
          ]
        ],
        "ven": [
          [
            "04:35",
            "23:45"
          ]
        ],
        "sam": [
          [
            "05:40",
            "23:45"
          ]
        ],
        "dim": [
          [
            "05:40",
            "00:00"
          ]
        ]
      },
      "horairesTexte": "Gare ouverte du lundi au vendredi de 4h35 à 23h45, le samedi de 5h40 à 23h45, le dimanche de 5h40 à minuit. Le hall historique ferme à 21h.",
      "services": [
        "Wifi gratuit de la gare, sans billet : 20 minutes sans inscription, puis on peut se reconnecter. Illimité en créant un compte (adresse e-mail).",
        "Prises pour recharger son téléphone dans les espaces d'attente (près du piano, de chaque côté de l'escalator).",
        "Se poser au chaud dans le hall."
      ],
      "conditions": "Hall en entrée libre pendant les heures d'ouverture. Pas besoin de billet ni d'achat pour le wifi.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "haute",
      "sources": [
        "https://www.garesetconnexions.sncf/fr/gares-services/lille-flandres/services-commerces/wifi",
        "https://www.garesetconnexions.sncf/en/stations-services/lille-flandres",
        "https://www.garesetconnexions.sncf/en/stations-services/lille-flandres/pratical-info",
        "https://www.sncf-connect.com/gares/lille/lille-flandres",
        "https://www.garesetconnexions.sncf/en/faq/services/how-do-i-connect-to-the-wifi-of-the-station-000001073",
        "https://www.garesetconnexions.sncf/fr/gare/fradj/lille-flandres/services/110/services-pratiques/toilettes",
        "https://www.ter.sncf.com/hauts-de-france/se-deplacer/gares/lille-flandres-87286005"
      ]
    },
    {
      "id": "l56",
      "cat": "wifi",
      "autresCats": [],
      "nom": "Centre commercial Westfield Euralille",
      "structure": "Westfield",
      "adresse": "Centre commercial Euralille, avenue Willy Brandt, 59777 Lille",
      "adresseGeo": "Avenue Willy Brandt, 59777 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 14 52 20",
      "horaires": {
        "lun": [
          [
            "09:30",
            "20:00"
          ]
        ],
        "mar": [
          [
            "09:30",
            "20:00"
          ]
        ],
        "mer": [
          [
            "09:30",
            "20:00"
          ]
        ],
        "jeu": [
          [
            "09:30",
            "20:00"
          ]
        ],
        "ven": [
          [
            "09:30",
            "20:00"
          ]
        ],
        "sam": [
          [
            "09:30",
            "20:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au samedi de 9h30 à 20h. Fermé le dimanche, sauf ouvertures exceptionnelles.",
      "services": [
        "Wifi gratuit pendant la visite (une adresse e-mail ou un numéro peut être demandé).",
        "Se poser au chaud."
      ],
      "conditions": "Entrée libre, sans achat obligatoire. C'est un lieu privé : la sécurité peut demander de partir.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-10-08",
      "confiance": "moyenne",
      "sources": [
        "https://www.westfield.com/fr/france/euralille",
        "https://www.westfield.com/fr/france/euralille/horaires",
        "https://www.westfield.com/fr/france/euralille/actualites/ouverture-exceptionnelle-dimanche-28-juin/137385",
        "https://www.118000.fr/e_C0000779757",
        "https://www.au-magasin.fr/guides-shopping/59000-lille/guide-de-shopping-au-centre-commercial-westfield-euralille-de-lille",
        "https://www.westfield.com/fr/france/aeroville/services/wifi"
      ]
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
