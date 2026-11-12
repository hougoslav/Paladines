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

  // Infos du moment selon la période de l'année (« du » et « au » : mois-jour, la période peut passer
  // le nouvel an). Elles défilent sur l'accueil avec la météo et les lieux ouverts en ce moment.
  // type « alerte » : en jaune, en premier. « lien » : où mène l'info (tel:115, #cat-dormir…).
  infos: [
    {
      id: "plan-hiver-bientot", du: "10-01", au: "10-31", type: "alerte", lien: "tel:115",
      texte: {
        fr: "Le plan hiver commence le 1er novembre : des places d'hébergement en plus ouvrent. Appelez le 115.",
        en: "The winter plan starts on 1 November: extra shelter beds open. Call 115.",
        ar: "تبدأ خطة الشتاء في 1 نوفمبر: تُفتح أماكن إيواء إضافية. اتصلي بالرقم 115.",
        ti: "ናይ ቁሪ ወቕቲ መደብ (plan hiver) ብ 1 ሕዳር ይጅምር: ተወሳኺ መደቀሲ ቦታታት ይኽፈቱ። ናብ 115 ደውሊ።",
        ps: "د ژمي پلان د نومبر په 1 پیلېږي: د استوګنې نور ځایونه خلاصېږي. 115 ته زنګ ووهئ.",
        fa: "پلان زمستانی از 1 نوامبر شروع می‌شود: جاهای خواب بیشتر باز می‌شوند. به 115 زنگ بزنید.",
        ro: "Planul de iarnă începe pe 1 noiembrie: se deschid locuri de cazare în plus. Sunați la 115.",
        uk: "Зимовий план починається 1 листопада: відкриваються додаткові місця для ночівлі. Телефонуйте 115.",
        es: "El plan de invierno empieza el 1 de noviembre: se abren más plazas de alojamiento. Llame al 115."
      }
    },
    {
      id: "plan-hiver", du: "11-01", au: "03-31", type: "alerte", lien: "tel:115",
      texte: {
        fr: "Plan hiver jusqu'au 31 mars : des places d'hébergement en plus. Appelez le 115.",
        en: "Winter plan until 31 March: extra shelter beds. Call 115.",
        ar: "خطة الشتاء حتى 31 مارس: أماكن إيواء إضافية. اتصلي بالرقم 115.",
        ti: "ናይ ቁሪ ወቕቲ መደብ ክሳብ 31 መጋቢት: ተወሳኺ መደቀሲ ቦታታት። ናብ 115 ደውሊ።",
        ps: "د ژمي پلان تر 31 مارچ پورې: د استوګنې نور ځایونه. 115 ته زنګ ووهئ.",
        fa: "پلان زمستانی تا 31 مارچ: جاهای خواب بیشتر. به 115 زنگ بزنید.",
        ro: "Planul de iarnă până pe 31 martie: locuri de cazare în plus. Sunați la 115.",
        uk: "Зимовий план до 31 березня: додаткові місця для ночівлі. Телефонуйте 115.",
        es: "Plan de invierno hasta el 31 de marzo: más plazas de alojamiento. Llame al 115."
      }
    },
    {
      id: "ete", du: "07-01", au: "08-31", type: "info", lien: "#proche",
      texte: {
        fr: "Vacances d'été : beaucoup de lieux changent d'horaires. Appelez avant de vous déplacer.",
        en: "Summer holidays: many places change their hours. Call before you go.",
        ar: "العطلة الصيفية: كثير من الأماكن تغيّر مواعيدها. اتصلي قبل الذهاب.",
        ti: "ዕረፍቲ ሓምለን ነሓሰን: ብዙሓት ቦታታት ሰዓታቶም ይቕይሩ። ቅድሚ ምኻድኪ ደውሊ።",
        ps: "د اوړي رخصتۍ: ډېر ځایونه خپل وختونه بدلوي. د تګ نه مخکې زنګ ووهئ.",
        fa: "رخصتی تابستان: اوقات بسیاری از جاها تغییر می‌کند. پیش از رفتن تیلفون کنید.",
        ro: "Vacanța de vară: multe locuri își schimbă programul. Sunați înainte să mergeți.",
        uk: "Літні канікули: у багатьох місцях змінюються години роботи. Зателефонуйте, перш ніж іти.",
        es: "Vacaciones de verano: muchos lugares cambian de horario. Llame antes de ir."
      }
    }
  ],

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
      "femmes": {
        "niveau": "creneau",
        "texte": "Des chambres plus petites sont prévues pour les femmes."
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
      "femmes": {
        "niveau": "reserve",
        "texte": "Cette maison est réservée aux femmes sans domicile qui consomment des drogues, et vous y avez votre propre chambre."
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
        "https://www.moncompagnonderoute.fr/fr/structures/maison-corinne-masiero-abej-solidarit-vuhh16lw5kr083xqj23gaou0",
        "https://abej-solidarite.fr/2024/10/08/maison-corinne-masiero/"
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
      "femmes": {
        "niveau": "reserve",
        "texte": "Cet hébergement d'urgence est réservé aux femmes seules : demandez une place au 115."
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
            "20:30"
          ]
        ],
        "mar": [
          [
            "18:30",
            "20:30"
          ]
        ],
        "mer": [
          [
            "18:30",
            "20:30"
          ]
        ],
        "jeu": [
          [
            "18:30",
            "20:30"
          ]
        ],
        "ven": [
          [
            "18:30",
            "20:30"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi, de 18h30 à 20h30 (site des Restos du Cœur). La fiche plus ancienne de la Ville indiquait 18h30-20h15.",
      "services": [
        "Repas chaud gratuit le soir, assis à table.",
        "Environ 180 personnes accueillies chaque soir, dans une ambiance chaleureuse.",
        "Les bénévoles peuvent vous proposer d'autres aides.",
        "Produits d'hygiène."
      ],
      "conditions": "Pour les personnes sans logement, isolées ou en grande difficulté. Sans inscription, gratuit.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.ad59a-restosducoeur.org/le-restochaud",
        "https://solidarites.lille.fr/acteur/213/4812-les-restos-du-coeur-de-la-region-lilloise-lille-centre.htm"
      ]
    },
    {
      "id": "l09",
      "cat": "manger",
      "autresCats": [
        "vetements"
      ],
      "nom": "Petit-déjeuner du samedi – Entraide protestante",
      "structure": "Entraide de l'Église protestante unie de Lille",
      "adresse": "68 rue du Marché, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 54 77 28",
      "horaires": {
        "sam": [
          [
            "08:00",
            "10:00"
          ]
        ]
      },
      "horairesTexte": "Petit-déjeuner chaque samedi de 8h à 10h, de septembre à fin juin. Aide alimentaire le jeudi de 14h à 17h. Vente solidaire de vêtements le 2e samedi du mois, de 11h à 17h30.",
      "services": [
        "Un petit-déjeuner offert chaque samedi matin.",
        "Un accueil chaleureux et fraternel.",
        "Des dons alimentaires le jeudi après-midi.",
        "Des vêtements à petit prix le 2e samedi du mois."
      ],
      "conditions": "Le petit-déjeuner est pour les personnes sans logement, en grande précarité ou seules. Gratuit. Pas de petit-déjeuner en juillet et en août.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://lille.epudf.org/entraide-eglise-protestante-unie-de-france-lille-4045657472616964/",
        "https://lille.epudf.org/",
        "https://solidarites.lille.fr/acteur/207/4812-entraide-eglise-protestante-unie-de-lille.htm"
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
      "femmes": {
        "niveau": "creneau",
        "texte": "Le vendredi de 9h à 12h est réservé aux femmes et aux enfants, et vous pouvez aussi y prendre un petit-déjeuner et laver votre linge."
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
      "femmes": {
        "niveau": "specialise",
        "texte": "Une consultation de gynécologie gratuite est proposée."
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
      "femmes": {
        "niveau": "specialise",
        "texte": "Vous pouvez y avoir gratuitement la contraception d'urgence (pilule du lendemain), en priorité sans rendez-vous."
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
      "femmes": {
        "niveau": "specialise",
        "texte": "Une conseillère vous reçoit sans rendez-vous pour la contraception, la pilule du lendemain, un test de grossesse ou une IVG."
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
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.epsm-al.fr/article/diogene-un-dispositif-pour-les-plus-precaires",
        "https://solidarites.lille.fr/acteur/126/4812-diogene.htm"
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
      "femmes": {
        "niveau": "specialise",
        "texte": "Vous pouvez y être suivie pendant votre grossesse, y accoucher et consulter en gynécologie."
      },
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
        "mar": [
          [
            "13:30",
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
        "dim": [
          [
            "08:00",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 8h à 18h, fermé le mardi matin. Dimanche de 8h à 12h.",
      "services": [
        "Se poser au chaud : café, collation, petit-déjeuner, sandwich.",
        "Douches et rasage.",
        "Recharger son téléphone et passer un appel, faire des copies.",
        "Centre de santé sur place : médecin, infirmière, psychologue.",
        "Aide d'une assistante sociale pour l'hébergement (SIAO), le RSA et les papiers."
      ],
      "conditions": "Pour toute personne sans domicile ou isolée. Accueil sans condition : « on vient comme on est ». Gratuit.",
      "criteres": {
        "inconditionnel": true,
        "sansRdv": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "creneau",
        "texte": "Un espace de repos avec casiers est réservé aux femmes : inscrivez-vous à l'accueil."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://abej-solidarite.fr/structure/accueil-solferino/",
        "https://solidarites.lille.fr/acteur/167/4812-abej-solidarite-accueil-de-jour.htm"
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
            "07:30",
            "17:00"
          ]
        ],
        "mar": [
          [
            "07:30",
            "17:00"
          ]
        ],
        "mer": [
          [
            "07:30",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "07:30",
            "17:00"
          ]
        ],
        "ven": [
          [
            "07:30",
            "17:00"
          ]
        ],
        "sam": [
          [
            "08:30",
            "17:00"
          ]
        ],
        "dim": [
          [
            "08:30",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Tous les jours : 7h30-17h du lundi au vendredi, 8h30-17h le week-end (site d'Eole). La fiche de la Ville (2019) donne 9h30-12h30 et 13h30-17h.",
      "services": [
        "Ouvert 7 jours sur 7, à l'abri pour la journée.",
        "Repas le midi et colis alimentaires.",
        "Douches, laverie et produits d'hygiène.",
        "Bagagerie : laisser vos sacs en sécurité.",
        "Domiciliation : une adresse pour recevoir votre courrier.",
        "Aide pour l'hébergement, les papiers, la santé, l'école des enfants."
      ],
      "conditions": "Pour les femmes seules, les couples et les familles sans logement, à partir de 18 ans. Pas pour les hommes seuls. Sans condition, sans orientation. Gratuit.",
      "criteres": {
        "enfants": true,
        "sansRdv": true,
        "inconditionnel": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Cet accueil reçoit les femmes seules, avec ou sans enfants, et les familles, mais pas les hommes seuls."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://prod.eole-asso.fr/actions/accueil-de-jour-femmes-familles",
        "https://solidarites.lille.fr/acteur/105/4812-association-eole-accueil-de-jour-femmes-seules-et-familles.htm"
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
      "horairesTexte": "Du lundi au vendredi de 9h à 11h45. Douches le matin, et l'après-midi sur rendez-vous.",
      "services": [
        "Café, soupe ou chocolat chaud, dans un lieu calme.",
        "Douches le matin (l'après-midi sur rendez-vous).",
        "Téléphone et ordinateur.",
        "Domiciliation : une adresse pour le courrier.",
        "Parler avec une travailleuse sociale, demander un hébergement (SIAO)."
      ],
      "conditions": "Pour toute personne isolée, à la rue ou en logement précaire. Le lieu peut difficilement accueillir les familles. Gratuit.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://magdala.asso.fr/accompagnement-social/nos-lieux/accueil-de-jour/",
        "https://solidarites.lille.fr/acteur/230/4812-association-magdala-accueil-de-jour.htm"
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
        "mer": [
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
        ]
      },
      "horairesTexte": "Ville de Lille : lundi au vendredi 8h45-11h30 et 13h45-16h30, fermé le mercredi matin. Site de la SSVP : lundi, mardi, jeudi, vendredi 8h45-11h et 13h15-16h ; mercredi 13h15-16h ; samedi 8h30-12h.",
      "services": [
        "Parler avec une travailleuse sociale.",
        "Douches (sur rendez-vous) et lessive.",
        "Vêtements et aide alimentaire.",
        "Coiffeur, médecin et psychologue.",
        "Ateliers et cours de français."
      ],
      "conditions": "Pour toute personne en difficulté. Pour la douche et la lessive, prenez rendez-vous. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/206/4812-accueil-de-jour-frederic-ozanam.htm"
      ]
    },
    {
      "id": "l29",
      "cat": "accueil",
      "autresCats": [
        "hygiene",
        "sante",
        "droits"
      ],
      "nom": "Point de Repère (abej) – accueil de jour et réduction des risques (CAARUD)",
      "structure": "abej SOLIDARITÉ – Point de Repère (CAARUD)",
      "adresse": "22 parvis Saint-Michel, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 09 20",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:00"
          ],
          [
            "13:00",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:00"
          ],
          [
            "13:00",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "11:30"
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
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Lundi et mardi : 9h-12h et 13h-17h. Mercredi : 9h-11h30, accueil réservé aux femmes. Jeudi : 9h-17h. Vendredi : 9h-12h (l'après-midi, seulement pour le matériel et le courrier).",
      "services": [
        "Un café sans alcool pour se poser et parler avec l'équipe.",
        "Repas, douche et adresse postale (domiciliation).",
        "Matériel propre pour consommer avec moins de risques.",
        "Vaccins et dépistages gratuits.",
        "Aide pour vos démarches et vos droits."
      ],
      "conditions": "Pour les personnes qui consomment des drogues, accueil sans condition et sans rendez-vous. Gratuit. Le mercredi matin est réservé aux femmes.",
      "criteres": {
        "inconditionnel": true,
        "sansRdv": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "creneau",
        "texte": "Le mercredi de 9h à 11h30, l'accueil est réservé aux femmes."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://abej-solidarite.fr/structure/point-de-repere-caarud/",
        "https://solidarites.lille.fr/acteur/168/4812-abej-solidarite-point-de-repere.htm"
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
        "Écoute et aide pour les femmes victimes de violences.",
        "Douche, laverie, vêtements.",
        "Garder ses affaires (bagagerie) et domiciliation.",
        "Coin pour se reposer et espace pour les enfants.",
        "Permanences d'avocat et consultations pour les mères et les enfants."
      ],
      "conditions": "Réservé aux femmes victimes de violences, avec ou sans enfants. Sans rendez-vous, vous pouvez rester anonyme. Gratuit.",
      "criteres": {
        "femmes": true,
        "enfants": true,
        "sansRdv": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "reserve",
        "texte": "Cet accueil est réservé aux femmes victimes de violences, avec ou sans enfants, et vous pouvez y rester anonyme."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/264/4812-association-solfa-solidarite-femmes-accueil-accueil-de-jour-rosa.htm"
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
      "structure": "CIDFF Nord / Territoires – antenne de Lille",
      "adresse": "48 rue Nicolas Leblanc, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 70 22 18",
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
            "12:00"
          ]
        ],
        "jeu": [
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
      "horairesTexte": "Lundi et mardi 9h-12h30 et 13h30-17h. Mercredi 9h-12h. Jeudi 13h30-17h. Vendredi 9h-12h30 et 13h30-17h. Permanence à la mairie de quartier de Lille-Sud (83 rue du Faubourg des Postes) les 2e et 4e mercredis du mois, 13h30-17h15.",
      "services": [
        "Conseils gratuits d'une juriste sur vos droits : séparation, enfants, travail.",
        "Écoute et aide pour les violences dans le couple ou la famille.",
        "Soutien avec une psychologue.",
        "Aide pour retrouver un travail ou une formation.",
        "Permanence à la mairie de quartier de Lille-Sud : 2e et 4e mercredis du mois, 13h30-17h15."
      ],
      "conditions": "Pour les femmes et les familles. Sur rendez-vous : appelez. Gratuit.",
      "criteres": {},
      "femmes": {
        "niveau": "specialise",
        "texte": "Une juriste vous informe gratuitement sur vos droits (séparation, enfants, travail), et vous pouvez être aidée en cas de violences dans le couple ou la famille."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://nord-territoires.cidff.info/liste-des-permanences/?departement=Nord&centre-id=cidff-antenne-de-lille-1857",
        "https://nord-territoires.cidff.info/liste-des-permanences/?departement=Nord&centre-id=mairie-de-quartier-lille-sud-3762",
        "https://nord-territoires.cidff.info/",
        "https://solidarites.lille.fr/acteur/263/4812-cidff-centre-d-information-sur-les-droits-des-femmes-et-des-familles.htm"
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
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/La-Maison-des-Solidarites",
        "https://solidarites.lille.fr/acteur/1028/4812-maison-des-solidarites.htm",
        "https://solidarites.lille.fr/acteur/1028/3-maison-des-solidarites.htm",
        "https://solidarites.lille.fr/aide/240/2-domiciliation.htm",
        "https://udccas59.fr/ressources/article/ccas-de-lille-ouverture-de-la-maison-des-solidarites/"
      ]
    },
    {
      "id": "l40",
      "cat": "droits",
      "autresCats": [
        "vetements",
        "manger"
      ],
      "nom": "Croix-Rouge – unité locale de Lille (domiciliation, vestiaire)",
      "structure": "Croix-Rouge française – unité locale de Lille Métropole",
      "adresse": "10/12 place Guy de Dampierre, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 16 98 60",
      "horaires": {
        "lun": [
          [
            "10:00",
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
          ]
        ]
      },
      "horairesTexte": "Accueil, écoute et orientation : lundi 10h-12h et 14h-17h ; mardi au jeudi 9h-12h et 14h-17h ; vendredi 9h-12h. Domiciliation : lundi 10h-12h, mardi au vendredi 9h-12h. Boutique de vêtements : lundi 10h-12h et 14h-17h, mardi au jeudi 9h-12h et 14h-17h.",
      "services": [
        "Domiciliation gratuite : une adresse pour recevoir votre courrier.",
        "Accueil, écoute et orientation, sans rendez-vous.",
        "Boutique de vêtements à petits prix ; vêtements gratuits pour les personnes en difficulté (demandez à l'accueil).",
        "Colis alimentaires, sur rendez-vous et sur orientation d'un travailleur social.",
        "Écrivain public et cours de français, sur rendez-vous."
      ],
      "conditions": "Domiciliation et accueil sans rendez-vous, gratuits. Aide alimentaire seulement sur orientation et rendez-vous. Au téléphone, tapez 1.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.croix-rouge.fr/unite-locale-de-lille",
        "https://solidarites.lille.fr/acteur/95/4812-croix-rouge-francaise-unite-locale-de-lille.htm"
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
      "horairesTexte": "Du lundi au vendredi, de 9h à 12h30 et de 13h30 à 17h.",
      "services": [
        "Des juristes vous informent gratuitement sur vos droits : logement, famille, travail, droit des étrangers, plainte…",
        "Vous pouvez avoir un rendez-vous avec un avocat, un notaire, un conciliateur de justice ou un délégué du Défenseur des droits.",
        "Des associations y tiennent des permanences : aide aux victimes, droits des femmes (CIDFF), personnes étrangères.",
        "La salle a une boucle magnétique pour les personnes sourdes ou malentendantes."
      ],
      "conditions": "Ouvert à toutes et à tous, gratuit. Prenez rendez-vous par téléphone, par courriel (pointjustice@mairie-lille.fr), sur place ou en ligne sur mesdemarches.lille.fr.",
      "criteres": {
        "gratuit": true,
        "inconditionnel": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Le CIDFF, une association pour les droits des femmes et des familles, y tient des permanences gratuites : appelez pour connaître les jours."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Maison-de-la-mediation-et-du-citoyen",
        "https://www.cdad-nord.justice.fr/c/63/1/mjd-et-point-justice-lille-et-metropole.html",
        "https://solidarites.lille.fr/acteur/18/4812-maison-de-la-mediation-et-du-citoyen.htm"
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
      "verifie": "2026-11-12",
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
      "verifie": "2026-11-12",
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
      "verifie": "2026-11-12",
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
      "verifie": "2026-11-12",
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
      "verifie": "2026-11-12",
      "confiance": "haute",
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
      "verifie": "2026-11-12",
      "confiance": "haute",
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
      "verifie": "2026-11-12",
      "confiance": "haute",
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
      "verifie": "2026-11-12",
      "confiance": "haute",
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
    },
    {
      "id": "l57",
      "cat": "manger",
      "autresCats": [
        "accueil"
      ],
      "nom": "1 Cabas pour 1 Étudiant – courses et soutien pour étudiantes en difficulté",
      "structure": "Association 1 Cabas pour 1 Étudiant",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "06 64 01 34 67",
      "horaires": null,
      "horairesTexte": "Pas de lieu d'accueil. Contact par téléphone ou par e-mail (lille@1cabaspour1etudiant.com).",
      "services": [
        "Si vous êtes étudiante et en difficulté, une marraine ou un parrain de Lille peut vous aider.",
        "Cette personne vous apporte régulièrement des courses.",
        "Elle vous propose aussi des rencontres, des sorties et un soutien moral pendant l'année universitaire.",
        "L'inscription se fait sur le site de l'association."
      ],
      "conditions": "Pour les étudiantes et étudiants en difficulté. Inscription sur le site internet. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/1039/4812-1-cabas-pour-1-etudiant.htm",
        "https://1cabaspour1etudiant.fr/"
      ]
    },
    {
      "id": "l58",
      "cat": "droits",
      "autresCats": [],
      "nom": "Eole – aide pour trouver ou garder un logement",
      "structure": "Association Eole",
      "adresse": "61 avenue du Peuple Belge, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 02 09",
      "horaires": {
        "mar": [
          [
            "09:30",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Permanence ouverte à toutes et tous le mardi de 9h30 à 12h, au siège. Possible aussi par téléphone.",
      "services": [
        "Une travailleuse sociale vous aide à trouver un logement et à vous y installer.",
        "Aide pour garder votre logement si vous avez des loyers en retard ou risquez l'expulsion.",
        "Aide contre les factures d'énergie trop lourdes.",
        "Le mardi matin, vous pouvez venir sans être envoyée par un service."
      ],
      "conditions": "Venez le mardi matin, ou bien un service social, un bailleur ou le FSL vous oriente. Pour un suivi complet, il faut des papiers en règle depuis au moins 3 mois et des ressources stables. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://prod.eole-asso.fr/actions/accompagnement-social-lie-au-logement",
        "https://solidarites.lille.fr/acteur/102/4812-association-eole-accompagnement-social-lie-au-logement.htm"
      ]
    },
    {
      "id": "l59",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Accueil de jour TARA (Hellemmes)",
      "structure": "Inconnue",
      "adresse": "28 rue du Théâtre de Verdure, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Non trouvés.",
      "services": [
        "Accueil de jour à Hellemmes : nous n'avons pas pu vérifier ce qu'on y trouve.",
        "Appelez le 115 ou un autre accueil de jour avant de vous déplacer."
      ],
      "conditions": "Inconnues : informations non vérifiées.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://api-adresse.data.gouv.fr/search/?q=28+rue+du+Th%C3%A9%C3%A2tre+de+Verdure+Lille"
      ]
    },
    {
      "id": "l60",
      "cat": "droits",
      "autresCats": [],
      "nom": "Le Gardin de Marianne (Andès) – emploi en chantier d'insertion au marché de gros de Lomme",
      "structure": "Andès – réseau des épiceries solidaires",
      "adresse": "Marché d'intérêt national (MIN), 9e avenue, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Pas d'accueil du public : on y entre en contrat de travail, sur orientation.",
      "services": [
        "Un emploi salarié dans un chantier d'insertion, avec une formation.",
        "Le travail : trier et préparer des fruits et légumes pour les épiceries solidaires.",
        "Une aide pour préparer la suite : emploi, formation."
      ],
      "conditions": "Pour les personnes éloignées de l'emploi, sur orientation (France Travail, mission locale, travailleur social). Ce n'est pas un lieu d'accueil ni de distribution.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://andes-france.com/andes/les-chantiers-dinsertion-andes/"
      ]
    },
    {
      "id": "l61",
      "cat": "manger",
      "autresCats": [],
      "nom": "Épicerie solidaire Pacte 59 – courses à petit prix (sur dossier)",
      "structure": "Pacte 59 – Pour Agir Contre Toute Exclusion",
      "adresse": "5 place Leroux de Fauquemont, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 97 57 09",
      "horaires": {
        "lun": [
          [
            "09:00",
            "16:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "16:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "16:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 16h (site de l'association).",
      "services": [
        "Une épicerie où les produits coûtent environ 20 % du prix normal.",
        "Produits de tous les jours : nourriture, hygiène.",
        "Des ateliers et des moments pour se rencontrer."
      ],
      "conditions": "Sur dossier : il faut être orientée par le CCAS ou un service social. Ce n'est pas gratuit, mais très peu cher.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://pacte59.wordpress.com/a-propos/",
        "https://solidarites.lille.fr/acteur/241/4812-pacte-59-agir-contre-toute-exclusion.htm"
      ]
    },
    {
      "id": "l62",
      "cat": "droits",
      "autresCats": [
        "ecoute"
      ],
      "nom": "Adepape du Nord – entraide pour les jeunes qui ont été placés (ASE)",
      "structure": "ADEPAPE du Nord (association d'entraide des personnes accueillies en protection de l'enfance)",
      "adresse": "71 avenue de la République, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Non trouvés.",
      "services": [
        "Si vous avez été placée enfant (Aide sociale à l'enfance), cette association peut vous aider.",
        "Écoute et conseils par des personnes qui ont vécu la même chose.",
        "Aide pour les démarches, le logement et les études."
      ],
      "conditions": "Pour les jeunes de 18 à 25 ans qui ont été accueillis en protection de l'enfance. Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.onisep.fr/orientation/le-lycee/aide-sociale-a-l-enfance-informer-pour-une-meilleure-orientation-scolaire/l-adepape-un-interlocuteur-privilegie-pour-les-jeunes-confies-a-l-aide-sociale-a-l-enfance"
      ]
    },
    {
      "id": "l63",
      "cat": "droits",
      "autresCats": [],
      "nom": "ADIL – conseils gratuits sur le logement (Maison de l'habitat durable)",
      "structure": "ADIL du Nord et du Pas-de-Calais",
      "adresse": "7 bis rue Racine, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 61 62 59",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous. Conseillers au téléphone du lundi au vendredi, 8h30-12h30 et 13h30-17h30.",
      "services": [
        "Des juristes répondent à vos questions sur le logement : bail, loyer impayé, expulsion, logement insalubre.",
        "Conseils gratuits, neutres et personnalisés.",
        "Par téléphone, ou sur place sur rendez-vous."
      ],
      "conditions": "Pour tout le monde, locataire ou non. Sur rendez-vous (téléphone ou en ligne). Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.anil.org/adil-59-62/horaires-et-permanences/",
        "https://www.anil.org/adil-59-62",
        "https://solidarites.lille.fr/acteur/376/4812-agence-interdepartementale-d-information-sur-le-logement-du-nord-et-du-pas-de-calais-adil.htm"
      ]
    },
    {
      "id": "l64",
      "cat": "sante",
      "autresCats": [
        "hygiene",
        "accueil",
        "vetements"
      ],
      "nom": "Repaire santé de l'ADSF – accueil santé réservé aux femmes",
      "structure": "ADSF – Agir pour la santé des femmes",
      "adresse": "162 rue du Faubourg des Postes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": {
        "lun": [
          [
            "09:30",
            "12:30"
          ]
        ],
        "mar": [
          [
            "09:30",
            "12:30"
          ]
        ],
        "jeu": [
          [
            "09:30",
            "12:30"
          ]
        ],
        "ven": [
          [
            "09:30",
            "12:30"
          ]
        ]
      },
      "horairesTexte": "Accueil ouvert à toutes : lundi, mardi, jeudi, vendredi de 9h30 à 12h30. Mardi, jeudi, vendredi de 13h30 à 16h30 sur rendez-vous seulement. Fermé le mercredi.",
      "services": [
        "Un lieu réservé aux femmes pour prendre soin de leur santé.",
        "Sage-femme, infirmière et psychologue.",
        "Collation et kit d'hygiène à l'arrivée.",
        "Vêtements si vous en avez besoin, et toilettes.",
        "Aide pour les rendez-vous médicaux et les dépistages."
      ],
      "conditions": "Réservé aux femmes en grande précarité. Le matin, sans rendez-vous ; l'après-midi, sur rendez-vous. Gratuit.",
      "criteres": {
        "femmes": true,
        "sansRdv": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "reserve",
        "texte": "Ce lieu est réservé aux femmes : on vous y accueille pour votre santé, en toute confidentialité."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://adsfasso.org/contact/",
        "https://adsfasso.org/qui-sommes-nous-nos-actions/",
        "https://adsfasso.org/wp-content/uploads/2026/06/Horaires-accueil-et-rdvLILLE2.png"
      ]
    },
    {
      "id": "l65",
      "cat": "droits",
      "autresCats": [],
      "nom": "Atelier populaire d'urbanisme du Vieux-Lille – aide pour les problèmes de logement",
      "structure": "Atelier populaire d'urbanisme (APU) du Vieux-Lille",
      "adresse": "14 rue des Tours, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 15 04 96",
      "horaires": null,
      "horairesTexte": "Permanence tenue par des bénévoles ; jours et heures non publiés.",
      "services": [
        "Des bénévoles vous écoutent si vous avez un problème avec votre logement ou votre propriétaire.",
        "Aide pour défendre vos droits de locataire.",
        "Des moments conviviaux pour rencontrer les habitants du quartier."
      ],
      "conditions": "Pour les habitants du Vieux-Lille. Appelez avant de venir. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/336/4812-atelier-populaire-d-urbanisme-apu-du-vieux-lille.htm"
      ]
    },
    {
      "id": "l66",
      "cat": "droits",
      "autresCats": [],
      "nom": "Article 1 – aide aux études et à l'orientation pour les jeunes",
      "structure": "Article 1 – antenne Hauts-de-France",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Pas de lieu d'accueil public connu.",
      "services": [
        "Pour les jeunes de milieux populaires, du lycée au premier emploi.",
        "Aide pour choisir ses études et réussir.",
        "Une personne bénévole (mentor) peut vous accompagner."
      ],
      "conditions": "Pour les lycéennes, étudiantes et jeunes diplômées. Inscription par l'association. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://article-1.eu/implantations/"
      ]
    },
    {
      "id": "l67",
      "cat": "manger",
      "autresCats": [
        "accueil"
      ],
      "nom": "La Passerelle – épicerie solidaire et frigo solidaire de Moulins",
      "structure": "Association La Passerelle",
      "adresse": "100 rue d'Arras, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "09 51 94 06 02",
      "horaires": null,
      "horairesTexte": "Non publiés.",
      "services": [
        "Une épicerie solidaire : des courses à petit prix.",
        "Un frigo solidaire : de la nourriture à prendre librement.",
        "Des moments conviviaux et des ateliers chaque mois."
      ],
      "conditions": "Épicerie : souvent sur orientation d'un service social. Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/254/4812-association-la-passerelle.htm"
      ]
    },
    {
      "id": "l68",
      "cat": "wifi",
      "autresCats": [
        "droits"
      ],
      "nom": "Association Perspectives – ordinateurs et internet gratuits",
      "structure": "Association Perspectives",
      "adresse": "26 boulevard de Metz, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 44 79 81",
      "horaires": null,
      "horairesTexte": "Non publiés.",
      "services": [
        "Utiliser gratuitement un ordinateur et internet.",
        "Aide pour apprendre l'informatique.",
        "Aide aux devoirs pour les enfants et soutien aux parents."
      ],
      "conditions": "Pour tout le monde. Appelez avant de venir. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/371/4812-association-perspectives.htm"
      ]
    },
    {
      "id": "l69",
      "cat": "dormir",
      "autresCats": [
        "sante"
      ],
      "nom": "VISA – logement avec accompagnement pour personnes ayant un problème d'alcool",
      "structure": "Association VISA – CHRS « Hors les murs »",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "03 20 73 25 27",
      "horaires": null,
      "horairesTexte": "Pas d'accueil sans rendez-vous.",
      "services": [
        "Un logement dans la métropole, à votre nom : vous le gardez à la fin du suivi.",
        "Une équipe vous aide à vous installer et à garder ce logement.",
        "Aide pour les droits, l'emploi et les soins liés à l'alcool ou à d'autres dépendances."
      ],
      "conditions": "Pour les personnes qui ont un problème d'alcool ou d'addiction. Demande par un travailleur social (note sociale et lettre de motivation). Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://asso-visa.fr/chrs-hors-les-murs/",
        "https://asso-visa.fr/contact/"
      ]
    },
    {
      "id": "l70",
      "cat": "droits",
      "autresCats": [],
      "nom": "Atelier populaire d'urbanisme de Moulins – aide pour les problèmes de logement",
      "structure": "Atelier populaire d'urbanisme (APU) de Moulins",
      "adresse": "84 rue d'Arras, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 97 72 94",
      "horaires": null,
      "horairesTexte": "Non publiés.",
      "services": [
        "Aide si vous avez des loyers impayés ou un logement en mauvais état.",
        "Aide en cas de conflit avec votre propriétaire.",
        "Accompagnement pour vos droits."
      ],
      "conditions": "Pour les habitants du quartier de Moulins. Appelez avant de venir. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/333/4812-atelier-populaire-d-urbanisme-apu-de-moulins.htm"
      ]
    },
    {
      "id": "l71",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Ateliers et Animations – espace de vie sociale d'Hellemmes",
      "structure": "Ateliers et Animations (espace de vie sociale)",
      "adresse": "12 rue Paul Lafargue, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Non trouvés.",
      "services": [
        "Un lieu de quartier pour se poser et rencontrer d'autres personnes.",
        "Ateliers et animations (détail non vérifié)."
      ],
      "conditions": "Inconnues. Appelez ou passez vous renseigner.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://api-adresse.data.gouv.fr/search/?q=12+rue+Paul+Lafargue+Hellemmes"
      ]
    },
    {
      "id": "l72",
      "cat": "sante",
      "autresCats": [],
      "nom": "AuditionSolidarité – appareils auditifs gratuits",
      "structure": "Association AuditionSolidarité",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "06 72 83 79 55",
      "horaires": null,
      "horairesTexte": "Pas de lieu à Lille : tout se fait par téléphone.",
      "services": [
        "Si vous entendez mal, l'association peut vous faire appareiller gratuitement.",
        "Il faut d'abord voir un médecin ORL (par exemple à la PASS de l'hôpital).",
        "Ensuite, appelez l'association : elle prend le rendez-vous chez un audioprothésiste solidaire près de chez vous.",
        "Le suivi est gratuit aussi."
      ],
      "conditions": "Pour les personnes sans couverture santé ou avec l'AME. Pas pour celles qui ont la Complémentaire santé solidaire. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.auditionsolidarite.org/fr/rdv-solidaires/",
        "https://www.auditionsolidarite.org/fr/contact/"
      ]
    },
    {
      "id": "l73",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Benenova Lille – faire du bénévolat quelques heures",
      "structure": "Benenova",
      "adresse": "70 rue Jean Sans Peur, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 64 02 02 39",
      "horaires": null,
      "horairesTexte": "Pas d'horaires d'accueil publiés. Contact par téléphone ou par e-mail (contact.lille@benenova.fr).",
      "services": [
        "Vous pouvez aider une association quelques heures, quand vous le voulez.",
        "Vous choisissez une mission : repas partagés, jardinage, aide aux devoirs, visites…",
        "L'équipe vous donne les informations pratiques avant la mission.",
        "C'est un moyen de rencontrer des gens et de vous sentir utile."
      ],
      "conditions": "Ouvert à toute personne qui veut être bénévole. Il faut s'inscrire à une mission (sur le site ou en appelant). Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.benenova.fr/nous-contacter/",
        "https://www.benenova.fr/qui-sommes-nous"
      ]
    },
    {
      "id": "l74",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Biclou – atelier vélo participatif d'Hellemmes",
      "structure": "Biclou",
      "adresse": "1 bis rue François Marceau, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "07 66 72 12 38",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés : appelez avant de venir.",
      "services": [
        "Atelier où l'on répare son vélo soi-même, avec des outils partagés.",
        "Des bénévoles vous conseillent pour réparer.",
        "Un lieu pour rencontrer des gens du quartier."
      ],
      "conditions": "Appelez avant de venir. Conditions (adhésion, prix) non vérifiées.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.lilletourism.com/app/uploads/lille-tourisme/2024/10/Livret-accueil-velo-Lille.pdf"
      ]
    },
    {
      "id": "l75",
      "cat": "ecoute",
      "autresCats": [
        "droits"
      ],
      "nom": "CAFFES – écoute et aide face à l'emprise d'une secte",
      "structure": "CAFFES – Centre national d'accompagnement familial face à l'emprise sectaire",
      "adresse": "7 rue des Jardins, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 26 77",
      "horaires": null,
      "horairesTexte": "Accueil au téléphone du mardi au vendredi, 8h30-12h30. Ensuite, rendez-vous au centre.",
      "services": [
        "Écoute par un bénévole formé, si vous êtes ou avez été sous l'emprise d'un groupe ou d'une secte.",
        "Aide aussi si un de vos proches est sous emprise.",
        "Conseils, soutien psychologique, social et juridique.",
        "Groupes de parole."
      ],
      "conditions": "Pour toute personne touchée par l'emprise sectaire, et ses proches. Appelez d'abord (mardi au vendredi matin), puis un rendez-vous vous est donné. Aussi au 06 45 32 60 05.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://caffes.fr/contact/",
        "https://caffes.fr/02-agir-se-faire-aider-parler-etre-ecoute/",
        "https://caffes.fr/",
        "https://solidarites.lille.fr/acteur/80/4812-centre-national-d-accompagnement-familial-face-a-l-emprise-sectaire-caffes.htm"
      ]
    },
    {
      "id": "l76",
      "cat": "droits",
      "autresCats": [],
      "nom": "CCAS de Lille – accueil social à l'hôtel de ville",
      "structure": "Centre communal d'action sociale (CCAS) de Lille",
      "adresse": "Hôtel de ville, place Augustin Laurent, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 49 50 00",
      "horaires": null,
      "horairesTexte": "Horaires de l'accueil social non publiés. Pour les démarches, la Maison des Solidarités (104-108 boulevard de Metz) est ouverte du lundi au vendredi.",
      "services": [
        "Accueil social à l'hôtel de ville : on vous écoute et on vous oriente.",
        "Domiciliation : une adresse pour recevoir votre courrier si vous n'avez pas de domicile.",
        "Aides et secours financiers, selon votre situation.",
        "Accompagnement dans vos démarches, avec ou sans rendez-vous, à la Maison des Solidarités."
      ],
      "conditions": "Pour les personnes qui vivent à Lille ou ont un lien avec Lille. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Votre-Mairie/Aides-et-solidarite/Le-CCAS/Le-CCAS-un-etablissement-de-proximite",
        "https://www.lille.fr/Votre-Mairie/Aides-et-solidarite/Le-CCAS"
      ]
    },
    {
      "id": "l77",
      "cat": "droits",
      "autresCats": [],
      "nom": "CCAS de Lomme – aides sociales",
      "structure": "Centre communal d'action sociale (CCAS) de Lomme",
      "adresse": "12 rue Léon Jouhaux, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 22 76 11",
      "horaires": {
        "lun": [
          [
            "13:30",
            "17:30"
          ]
        ],
        "mar": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ],
        "mer": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
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
          ],
          [
            "13:30",
            "17:30"
          ]
        ],
        "sam": [
          [
            "08:30",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Lundi 13h30-17h30. Mardi, mercredi et vendredi 8h30-12h et 13h30-17h30. Jeudi 8h30-12h. Samedi 8h30-12h.",
      "services": [
        "Aide pour les dossiers d'aides sociales (RSA…).",
        "Aides de la ville si vous êtes en difficulté.",
        "Information et orientation vers les bons services.",
        "Lien avec l'épicerie solidaire « Chez Serge » et les Maisons des Solidarités de Lomme."
      ],
      "conditions": "Pour les habitants de Lomme. Vous pouvez demander un rendez-vous par téléphone. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.ville-lomme.fr/Solidarite/C.C.A.S/Missions-et-infos-pratiques",
        "https://www.ville-lomme.fr/Solidarite/C.C.A.S/Contactez-le-CCAS"
      ]
    },
    {
      "id": "l78",
      "cat": "sante",
      "autresCats": [
        "hygiene",
        "vetements"
      ],
      "nom": "CAARUD Ellipse – accueil de jour pour les personnes qui consomment des drogues",
      "structure": "La Sauvegarde du Nord – CAARUD Ellipse",
      "adresse": "57 rue Jean Jaurès, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 52 00 97",
      "horaires": null,
      "horairesTexte": "Ouvert en journée. Horaires précis non publiés : appelez avant.",
      "services": [
        "Un lieu pour vous poser, vous reposer et prendre une collation.",
        "Douche, vêtements de dépannage et produits d'hygiène.",
        "Matériel propre pour consommer, préservatifs, conseils pour réduire les risques.",
        "Soins infirmiers et dépistage rapide du VIH et de l'hépatite C.",
        "Garde et soins pour votre chien (Atout chien) pendant vos démarches.",
        "Aide pour vos papiers et pour trouver des soins."
      ],
      "conditions": "Pour toute personne qui consomme de l'alcool ou des drogues, sans condition. Anonyme et gratuit. Un entretien d'accueil est proposé la première fois.",
      "criteres": {
        "inconditionnel": true,
        "gratuit": true,
        "animaux": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lasauvegardedunord.fr/dispositifs-etablissements/caarud-ellipse/",
        "https://solidarites.lille.fr/acteur/314/4812-la-sauvegarde-du-nord-caarud-ellipse.htm"
      ]
    },
    {
      "id": "l79",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence l'Escale (Eole) – foyer d'hébergement pour familles et femmes seules",
      "structure": "Association Eole – CHRS Familles Résidence l'Escale",
      "adresse": "2 rue de Bruxelles, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 58 04 96",
      "horaires": null,
      "horairesTexte": "Hébergement sur orientation, pas d'accueil direct.",
      "services": [
        "Foyer d'hébergement avec un accompagnement (45 places).",
        "Pour les familles, les couples et les femmes seules.",
        "Aide pour vos droits, la recherche d'un logement et d'un travail.",
        "Soutien pour vous et vos enfants."
      ],
      "conditions": "On n'y entre pas directement : il faut une demande auprès du SIAO, faite par un travailleur social, ou appeler le 115.",
      "criteres": {
        "enfants": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Ce foyer accueille les familles et aussi les femmes seules, avec un accompagnement pour trouver un logement."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://eole-asso.fr/actions/chrs-familles-residence-l-escale"
      ]
    },
    {
      "id": "l80",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence du Pont Bleu (Eole) – foyer d'hébergement pour hommes seuls",
      "structure": "Association Eole – CHRS Hommes Résidence du Pont Bleu",
      "adresse": "44 rue du Pont Neuf, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 38 13 98",
      "horaires": null,
      "horairesTexte": "Hébergement sur orientation, pas d'accueil direct.",
      "services": [
        "Foyer d'hébergement avec un accompagnement, réservé aux hommes seuls de 18 ans et plus.",
        "Ce lieu n'accueille pas les femmes : pour vous, appelez le 115.",
        "Aide pour les papiers, la santé, le travail et le logement."
      ],
      "conditions": "Réservé aux hommes de 18 ans et plus. Sur orientation du 115 et du SIAO.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://eole-asso.fr/actions/chrs-hommes-residence-du-pont-bleu",
        "https://solidarites.lille.fr/acteur/103/4812-association-eole-lits-halte-soins-sante-hommes-seuls.htm"
      ]
    },
    {
      "id": "l81",
      "cat": "accueil",
      "autresCats": [
        "wifi",
        "droits"
      ],
      "nom": "Centre social Albert Jacquard (Saint-Maurice Pellevoisin)",
      "structure": "Centre social Albert Jacquard",
      "adresse": "113-115 rue Saint-Gabriel, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 51 90 47",
      "horaires": {
        "lun": [
          [
            "08:30",
            "12:30"
          ],
          [
            "13:30",
            "18:30"
          ]
        ],
        "mar": [
          [
            "13:30",
            "18:00"
          ]
        ],
        "mer": [
          [
            "08:30",
            "12:30"
          ],
          [
            "13:30",
            "18:30"
          ]
        ],
        "jeu": [
          [
            "08:30",
            "12:30"
          ],
          [
            "13:30",
            "18:30"
          ]
        ],
        "ven": [
          [
            "08:30",
            "12:30"
          ],
          [
            "13:30",
            "18:30"
          ]
        ]
      },
      "horairesTexte": "Lundi, mercredi, jeudi, vendredi 8h30-12h30 et 13h30-18h30. Mardi 13h30-18h (fermé le matin). Parfois 9h-12h30 et 13h30-17h. Écrivain public : mardi 14h-15h30, sur rendez-vous.",
      "services": [
        "Un lieu de quartier ouvert à tous, pour vous poser et rencontrer du monde.",
        "Ordinateurs pour vos démarches en ligne (CAF, France Travail, Assurance maladie…), avec un animateur, avec ou sans rendez-vous.",
        "Écrivain public gratuit le mardi après-midi, sur rendez-vous : aide pour écrire ou comprendre un courrier.",
        "Ateliers de français."
      ],
      "conditions": "Ouvert à tous. Écrivain public gratuit, sur rendez-vous (pas pendant les vacances scolaires). Certaines activités demandent une adhésion.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.csjacquard.fr/",
        "https://www.csjacquard.fr/le-cyber-espace/",
        "https://www.csjacquard.fr/ecrivain-public/",
        "https://solidarites.lille.fr/acteur/411/4812-centre-social-albert-jacquard.htm"
      ]
    },
    {
      "id": "l82",
      "cat": "accueil",
      "autresCats": [
        "wifi",
        "droits"
      ],
      "nom": "Centre social Denise Cacheux (Lille-Sud, ex-Lazare Garreau)",
      "structure": "Centre social et culturel Denise Cacheux (anciennement Lazare Garreau)",
      "adresse": "45 rue Lazare Garreau, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 55 38 20",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés : appelez avant de venir.",
      "services": [
        "Un lieu de quartier ouvert à tous les habitants.",
        "Ordinateurs et internet gratuits, et aide pour les démarches en ligne.",
        "Ateliers de français.",
        "Aide pour chercher un travail."
      ],
      "conditions": "Ouvert à tous. Appelez pour connaître les horaires des ateliers.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/421/4812-centre-social-et-culturel-lazare-garreau.htm"
      ]
    },
    {
      "id": "l83",
      "cat": "manger",
      "autresCats": [
        "hygiene"
      ],
      "nom": "Cop1 – colis alimentaires gratuits pour étudiantes et étudiants",
      "structure": "Cop1 – Solidarités étudiantes (antenne de Lille)",
      "adresse": "Maison des Associations, 27 rue Jean Bart, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "07 60 85 29 52",
      "horaires": null,
      "horairesTexte": "Distribution 2 samedis par mois, de 15h à 16h30, sur inscription. Les dates sont données lors de l'inscription en ligne.",
      "services": [
        "Panier gratuit de nourriture et de produits d'hygiène.",
        "Distribution en dehors des universités, pour plus de discrétion.",
        "Apportez votre propre sac."
      ],
      "conditions": "Réservé aux étudiantes et étudiants : carte d'étudiant ou certificat de scolarité obligatoire. Inscription en ligne avant, places limitées. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://cop1.fr/ville/lille/",
        "https://solidarites.lille.fr/acteur/945/4812-cop1-lille.htm"
      ]
    },
    {
      "id": "l84",
      "cat": "droits",
      "autresCats": [
        "sante"
      ],
      "nom": "Assurance maladie (CPAM) – accueil de Lille",
      "structure": "Caisse primaire d'assurance maladie (CPAM) de Lille-Douai",
      "adresse": "2 rue d'Iéna, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "36 46",
      "horaires": null,
      "horairesTexte": "Horaires non vérifiés : appelez le 36 46 ou regardez sur ameli.fr avant de venir.",
      "services": [
        "Ouvrir vos droits à l'Assurance maladie pour être soignée.",
        "Demander la Complémentaire santé solidaire (mutuelle gratuite ou à petit prix).",
        "Ordinateurs pour vos démarches d'Assurance maladie, avec de l'aide.",
        "Aide financière possible pour des dépenses de santé."
      ],
      "conditions": "Pour toute personne qui a besoin d'une information sur l'Assurance maladie. Venir avec une pièce d'identité si possible. Le rendez-vous est conseillé.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/5/4812-caisse-primaire-d-assurance-maladie-cpam.htm"
      ]
    },
    {
      "id": "l85",
      "cat": "vetements",
      "autresCats": [
        "droits"
      ],
      "nom": "La Cravate Solidaire – tenue et conseils pour un entretien d'embauche",
      "structure": "La Cravate Solidaire Lille",
      "adresse": "3/5 allée Léonard de Vinci, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 44 76 10 88",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez ou écrivez (lille@lacravatesolidaire.org) pour un rendez-vous.",
      "services": [
        "Une tenue professionnelle (femme ou homme) pour aller à un entretien d'embauche.",
        "Conseils d'une conseillère en image et de recruteurs bénévoles.",
        "Entraînement à l'entretien d'embauche."
      ],
      "conditions": "Pour toute personne qui a un projet précis : emploi, stage, formation, alternance. Sur rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://lacravatesolidaire.org/reseau",
        "https://lacravatesolidaire.org/etre-accompagne",
        "https://solidarites.lille.fr/acteur/258/4812-la-cravate-solidaire.htm"
      ]
    },
    {
      "id": "l86",
      "cat": "vetements",
      "autresCats": [],
      "nom": "Croix-Rouge – boutique de vêtements Gambetta (Chez Henry)",
      "structure": "Croix-Rouge française – unité locale de Lille Métropole",
      "adresse": "156 rue Léon Gambetta, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 16 98 60",
      "horaires": {
        "mer": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "10:00",
            "18:30"
          ]
        ],
        "ven": [
          [
            "10:00",
            "18:30"
          ]
        ],
        "sam": [
          [
            "10:00",
            "18:30"
          ]
        ]
      },
      "horairesTexte": "Mercredi 14h-18h. Jeudi, vendredi et samedi 10h-18h30.",
      "services": [
        "Vêtements de seconde main à petits prix.",
        "Lieu d'accueil et d'écoute tenu par des bénévoles.",
        "Ateliers et moments conviviaux."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous. Les vêtements sont payants (petits prix). Pour des vêtements gratuits, demandez à l'accueil de la Croix-Rouge, place Guy de Dampierre.",
      "criteres": {
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.croix-rouge.fr/unite-locale-de-lille",
        "https://solidarites.lille.fr/acteur/923/4812-chez-henry-par-la-croix-rouge-francaise.htm"
      ]
    },
    {
      "id": "l87",
      "cat": "sante",
      "autresCats": [],
      "nom": "Droit de Regard – opticien, lunettes 100 % remboursées",
      "structure": "Droit de Regard (opticien)",
      "adresse": "66 rue Nationale, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 12 74 32",
      "horaires": {
        "lun": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "19:00"
          ]
        ],
        "mar": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "19:00"
          ]
        ],
        "mer": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "19:00"
          ]
        ],
        "jeu": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "19:00"
          ]
        ],
        "ven": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "19:00"
          ]
        ],
        "sam": [
          [
            "10:00",
            "13:00"
          ],
          [
            "14:00",
            "19:00"
          ]
        ]
      },
      "horairesTexte": "Lundi au samedi 10h-13h et 14h-19h.",
      "services": [
        "Opticien diplômé : contrôle de la vue et choix de lunettes.",
        "Toutes les lunettes sont 100 % remboursées, sans rien à payer (tiers payant).",
        "Lunettes garanties 2 ans."
      ],
      "conditions": "Avec ou sans rendez-vous. Pour ne rien payer, il faut l'Assurance maladie, une complémentaire santé et une ordonnance pour les lunettes.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.droitderegard.com/fr_FR/page/nos-boutiques",
        "https://www.droitderegard.com/fr_FR/"
      ]
    },
    {
      "id": "l88",
      "cat": "droits",
      "autresCats": [],
      "nom": "DUO for a JOB – un mentor pour trouver du travail (18-33 ans)",
      "structure": "DUO for a JOB Hauts-de-France",
      "adresse": "Bazaar St-So, gare Saint-Sauveur, boulevard Jean-Baptiste Lebas, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 16 79 88 22",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous. Des réunions d'information ont lieu régulièrement.",
      "services": [
        "Un mentor bénévole de plus de 50 ans vous aide à chercher un emploi, pendant plusieurs mois.",
        "Conseils pour le CV, les entretiens et le réseau.",
        "Pour les jeunes issus de l'immigration et les personnes réfugiées."
      ],
      "conditions": "Avoir entre 18 et 33 ans, un parent ou un grand-parent né hors de l'Union européenne, et un titre de séjour valide. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.duoforajob.fr/fr/branches/hauts-de-france",
        "https://www.duoforajob.fr/fr/devenir-mentee",
        "https://solidarites.lille.fr/acteur/950/4812-duo-for-a-job-metropole-lilloise.htm"
      ]
    },
    {
      "id": "l89",
      "cat": "wifi",
      "autresCats": [
        "droits"
      ],
      "nom": "Emmaüs Connect – téléphone, internet et aide au numérique",
      "structure": "Emmaüs Connect – espace de Lille",
      "adresse": "83 rue de l'Abbé Aerts, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "01 80 05 98 80",
      "horaires": {
        "mar": [
          [
            "09:15",
            "12:30"
          ],
          [
            "14:00",
            "17:30"
          ]
        ],
        "mer": [
          [
            "09:15",
            "12:30"
          ],
          [
            "14:00",
            "17:30"
          ]
        ],
        "jeu": [
          [
            "09:15",
            "12:30"
          ],
          [
            "14:00",
            "17:30"
          ]
        ],
        "ven": [
          [
            "09:15",
            "12:30"
          ]
        ],
        "sam": [
          [
            "09:30",
            "12:00"
          ]
        ]
      },
      "horairesTexte": "Mardi au jeudi 9h15-12h30 et 14h-17h30. Vendredi 9h15-12h30. Samedi 9h30-12h. Numéro gratuit pour prendre rendez-vous : du lundi au vendredi, 9h-13h et 14h-17h.",
      "services": [
        "Téléphone, smartphone ou ordinateur reconditionné à petit prix.",
        "Recharges et forfaits téléphone et internet à prix solidaire.",
        "Ateliers gratuits pour apprendre à utiliser un téléphone, un ordinateur, internet.",
        "Aide individuelle pour un problème précis sur le numérique."
      ],
      "conditions": "Seulement si vous êtes orientée par une structure sociale (bon d'orientation ou courrier avec tampon). Rendez-vous au numéro gratuit 01 80 05 98 80.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://emmaus-connect.org/lille/",
        "https://solidarites.lille.fr/acteur/238/4812-emmaus-connect.htm"
      ]
    },
    {
      "id": "l90",
      "cat": "ecoute",
      "autresCats": [
        "droits"
      ],
      "nom": "Enfance & Partage – aide pour les enfants victimes de violences",
      "structure": "Enfance & Partage – Comité Nord",
      "adresse": "27 rue Jean Bart, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "07 68 15 28 66",
      "horaires": {
        "jeu": [
          [
            "14:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Permanence le jeudi de 14h à 16h à la Maison des associations. Numéro national gratuit 0 800 05 1234.",
      "services": [
        "Une écoute si votre enfant ou un enfant que vous connaissez subit des violences.",
        "Une aide juridique avec des avocats de l'association.",
        "Un soutien psychologique pour l'enfant et sa famille.",
        "Numéro gratuit Stop Maltraitance : 0 800 05 1234."
      ],
      "conditions": "Pour les enfants victimes de violences et leurs familles. Venez à la permanence du jeudi ou appelez avant.",
      "criteres": {
        "enfants": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://enfance-et-partage.org/comite/nord/"
      ]
    },
    {
      "id": "l91",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Ensemble2Générations – chambre chez une personne âgée (moins de 30 ans)",
      "structure": "Association ensemble2generations – agence Lille Métropole",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "07 49 86 52 29",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous, contactez l'agence par téléphone ou par mail (lille@ensemble2generations.fr).",
      "services": [
        "Une chambre meublée chez une personne âgée qui vit seule.",
        "Logement gratuit ou à petit prix, en échange de présence et de petits services.",
        "L'association vous aide à trouver la personne qui vous accueille et suit la cohabitation."
      ],
      "conditions": "Pour les jeunes de moins de 30 ans, surtout étudiantes et étudiants. Inscription et entretien avant d'être logée. Ce n'est pas un hébergement d'urgence.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://ensemble2generations.fr/association/agences/lille-metropole",
        "https://solidarites.lille.fr/acteur/378/4812-ensemble2generations.htm"
      ]
    },
    {
      "id": "l92",
      "cat": "manger",
      "autresCats": [
        "accueil"
      ],
      "nom": "Épicerie solidaire Insersol – courses à petit prix (Hellemmes)",
      "structure": "InserSol – Espace de vie sociale et épicerie solidaire",
      "adresse": "12 rue Paul Lafargue, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "07 69 30 10 35",
      "horaires": {
        "mar": [
          [
            "07:00",
            "12:00"
          ]
        ],
        "ven": [
          [
            "07:00",
            "11:00"
          ]
        ]
      },
      "horairesTexte": "Épicerie : mardi de 7h à 12h, vendredi de 7h à 11h. Espace de vie sociale : du lundi au vendredi, de 8h30 à 12h et de 13h30 à 17h (fermé en août).",
      "services": [
        "Des produits alimentaires, d'hygiène et d'entretien à petit prix, y compris bio.",
        "Vous faites vos courses vous-même, avec une bénévole.",
        "Des ateliers cuisine, jardinage, bien-être, informatique.",
        "Un lieu convivial pour parler et être écoutée."
      ],
      "conditions": "Il faut habiter Hellemmes et avoir de petites ressources. Un premier entretien est nécessaire ; on vous demande de participer à des ateliers. Aide pour un temps limité.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://insersol.fr/epicerie-solidaire/",
        "https://insersol.fr/contact/",
        "https://insersol.fr/espace-de-vie-sociale/"
      ]
    },
    {
      "id": "l93",
      "cat": "manger",
      "autresCats": [],
      "nom": "Épicerie Terres de Sens (Fives)",
      "structure": "Terres de Sens",
      "adresse": "57 rue Pierre Legrand, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés. Renseignez-vous avant de venir.",
      "services": [
        "Une épicerie dans le quartier de Fives.",
        "Nous n'avons pas pu vérifier ce qu'on y trouve ni les prix."
      ],
      "conditions": "Conditions d'accès non vérifiées.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": []
    },
    {
      "id": "l94",
      "cat": "manger",
      "autresCats": [],
      "nom": "Episcéa – épicerie solidaire étudiante (campus Santé)",
      "structure": "Episcéa – association étudiante (réseau des épiceries de l'Université de Lille)",
      "adresse": "1 rue du Professeur Laguesse, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés. Contact : episcea@alpha-lille.fr.",
      "services": [
        "Des produits alimentaires à prix réduits.",
        "Une épicerie tenue par et pour les étudiantes et étudiants."
      ],
      "conditions": "Réservée aux étudiantes et étudiants inscrits à l'Université de Lille.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://lillemetropole.fr/sites/default/files/2025-10/Annuaire%20anti-gaspi%20SERD%202025%20BD.pdf",
        "https://solidarites.lille.fr/acteur/925/4812-agorae-cite-scientifique.htm"
      ]
    },
    {
      "id": "l95",
      "cat": "vetements",
      "autresCats": [
        "manger",
        "droits"
      ],
      "nom": "Équipe Saint-Vincent – vestiaire et aide alimentaire (Lille-Centre)",
      "structure": "Équipe Saint-Vincent Lille Saint-Martin",
      "adresse": "14 rue Davy, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 09 60 74",
      "horaires": {
        "jeu": [
          [
            "09:00",
            "11:00"
          ]
        ],
        "sam": [
          [
            "09:00",
            "11:00"
          ]
        ]
      },
      "horairesTexte": "Vestiaire et bric-à-brac : jeudi et samedi de 9h à 11h. Aide alimentaire : jeudi de 9h à 11h.",
      "services": [
        "Un vestiaire et un bric-à-brac ouverts à tout le monde.",
        "Un café pendant la distribution alimentaire du jeudi.",
        "Un accueil des personnes sans abri et de l'écoute.",
        "Une domiciliation (adresse pour recevoir votre courrier), des cours de français et un écrivain public.",
        "Des ateliers pour les jeunes mamans et leur enfant."
      ],
      "conditions": "Vestiaire ouvert à tout le monde. L'aide alimentaire se fait sur orientation d'une ou d'un travailleur social, avec une participation de 1 € par personne.",
      "criteres": {
        "sansRdv": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "L'équipe, composée de femmes bénévoles, propose des ateliers pour les jeunes mamans et leur enfant."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://equipes-saint-vincent.com/equipe/lille-saint-martin",
        "https://solidarites.lille.fr/acteur/208/4812-equipe-st-vincent-de-lille.htm"
      ]
    },
    {
      "id": "l96",
      "cat": "manger",
      "autresCats": [
        "vetements",
        "ecoute",
        "droits",
        "wifi"
      ],
      "nom": "Espace Fraternité – repas, colis et accompagnement (Fives)",
      "structure": "Association Espace Fraternité",
      "adresse": "13 rue Ernest Deconynck, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 89 64 81",
      "horaires": {
        "mar": [
          [
            "08:30",
            "11:30"
          ]
        ],
        "ven": [
          [
            "08:30",
            "11:30"
          ]
        ]
      },
      "horairesTexte": "Distribution alimentaire : mardi et vendredi de 8h30 à 11h30, de septembre à juin (sauf jours fériés). Accompagnement au 8 rue Ernest Deconynck : mardi et vendredi 8h30-13h et 14h-16h30, mercredi et jeudi 9h-13h et 14h-16h30, samedi 10h-13h et 14h-16h30.",
      "services": [
        "Des repas chauds pour les personnes sans domicile, et des paniers repas à cuisiner.",
        "Des vêtements donnés le mardi et le vendredi matin.",
        "Une écoute et un soutien avec une psychologue.",
        "De l'aide pour vos papiers, vos droits santé (compte Ameli) et vos démarches sur internet.",
        "Des cours de français, et de l'aide pour le CV et l'emploi."
      ],
      "conditions": "Au premier passage, les bénévoles font le point avec vous et vous remettent une carte de membre pour les distributions. L'accompagnement est ouvert à tout le monde ; les démarches administratives se font sur rendez-vous.",
      "criteres": {
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.espacefraternite.fr/aideAlimentaire.html",
        "https://www.espacefraternite.fr/aidePersonne.html",
        "https://www.espacefraternite.fr/",
        "https://solidarites.lille.fr/acteur/240/4812-espace-fraternite.htm"
      ]
    },
    {
      "id": "l97",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors des Bois-Blancs (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "39 rue Mermoz, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "07 88 68 89 70",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/896/4812-espace-seniors-bois-blancs.htm"
      ]
    },
    {
      "id": "l98",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors du Faubourg de Béthune (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "Square Verhaeren, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 07 72 69",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/898/4812-espace-seniors-faubourg-de-bethune.htm"
      ]
    },
    {
      "id": "l99",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Fives (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "80 rue de Flers, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 33 42 20",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/899/4812-espace-seniors-fives.htm"
      ]
    },
    {
      "id": "l100",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Lille-Centre (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "97 rue Saint-Sauveur (résidence les Dintellières), 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 87 95 66",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/897/4812-espace-seniors-lille-centre.htm"
      ]
    },
    {
      "id": "l101",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Lille-Sud (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "250 rue Richard Wagner, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 16 93 25",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/900/4812-espace-seniors-lille-sud.htm"
      ]
    },
    {
      "id": "l102",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Moulins (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "164 rue Alain de Lille, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 82 36 91 85",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/995/4812-espace-seniors-moulins.htm"
      ]
    },
    {
      "id": "l103",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Saint-Maurice Pellevoisin (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "74 rue Saint-Gabriel, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 36 22 55",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/901/4812-espace-seniors-saint-maurice-pellevoisin.htm"
      ]
    },
    {
      "id": "l104",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Vauban-Esquermes (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "8 rue de Toul, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 15 87 02",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/902/4812-espace-seniors-vauban-esquermes.htm"
      ]
    },
    {
      "id": "l105",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors du Vieux-Lille (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "13 rue du Pont à Raisnes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 38 06 18",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/903/4812-espace-seniors-vieux-lille.htm"
      ]
    },
    {
      "id": "l106",
      "cat": "accueil",
      "autresCats": [
        "wifi"
      ],
      "nom": "Espace Seniors de Wazemmes (Ville de Lille)",
      "structure": "Ville de Lille – Espaces seniors",
      "adresse": "48 rue des Meuniers, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 30 70 15",
      "horaires": null,
      "horairesTexte": "Ouvert tous les jours de 13h30 à 17h, selon la Ville de Lille. Appelez avant de venir.",
      "services": [
        "Un lieu calme pour vous poser l'après-midi et rencontrer d'autres personnes.",
        "Des activités sportives, culturelles et créatives.",
        "De l'aide pour vos démarches administratives sur internet.",
        "Une initiation à l'ordinateur et à internet."
      ],
      "conditions": "Lieu de la Ville pensé pour les personnes âgées (seniors). Gratuit. Appelez avant de venir pour savoir si vous pouvez être accueillie.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
        "https://solidarites.lille.fr/acteur/904/4812-espace-seniors-wazemmes.htm"
      ]
    },
    {
      "id": "l107",
      "cat": "droits",
      "autresCats": [],
      "nom": "ESAT Deltha (CCAS de Lille) – travail adapté pour les personnes handicapées",
      "structure": "ESAT Deltha du CCAS de Lille (anciennement Imprim' Services)",
      "adresse": "51 rue de Belle Vue, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 51 82",
      "horaires": null,
      "horairesTexte": "Horaires non donnés. Contact : contact@deltha.lille.fr.",
      "services": [
        "Un travail adapté et accompagné pour les personnes en situation de handicap.",
        "Ateliers restauration-traiteur, impression, courrier et conditionnement.",
        "Des stages possibles pour découvrir le travail.",
        "Un accompagnement social pour les travailleuses et travailleurs."
      ],
      "conditions": "Réservé aux personnes en situation de handicap, avec une orientation de la MDPH (maison départementale des personnes handicapées). Ce n'est pas un lieu d'accueil sans rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.imprim-services.fr/",
        "https://solidarites.lille.fr/acteur/70/4812-esat-deltha.htm"
      ]
    },
    {
      "id": "l108",
      "cat": "accueil",
      "autresCats": [
        "dormir",
        "ecoute"
      ],
      "nom": "Le Refuge – aide pour les jeunes LGBT+ de 18 à 25 ans rejetés par leur famille",
      "structure": "Fondation Le Refuge – délégation Nord / Hauts-de-France",
      "adresse": "5-7 rue du Vert Bois, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 74 00 40 29",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:00"
          ],
          [
            "12:30",
            "16:30"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:00"
          ],
          [
            "12:30",
            "16:30"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:00"
          ],
          [
            "12:30",
            "16:30"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:00"
          ],
          [
            "12:30",
            "16:30"
          ]
        ]
      },
      "horairesTexte": "Lundi, mardi, jeudi et vendredi : 9h-12h et 12h30-16h30 (fermé le mercredi). Sans rendez-vous le mardi et le jeudi après-midi. Ligne d'écoute 09 39 03 63 03, appel ou SMS, tous les jours de 8h à minuit.",
      "services": [
        "Un accueil de jour pour les jeunes LGBT+ de 18 à 25 ans.",
        "Un hébergement et un accompagnement si vous êtes rejetée par votre famille.",
        "Un soutien psychologique et une aide alimentaire.",
        "De l'aide si vous subissez des violences homophobes ou transphobes.",
        "Une ligne d'écoute au 09 39 03 63 03, par appel ou SMS, tous les jours de 8h à minuit."
      ],
      "conditions": "Pour les jeunes LGBT+ de 18 à 25 ans en rupture familiale ou victimes de discriminations. Sans rendez-vous le mardi et le jeudi après-midi. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://solidarites.lille.fr/acteur/346/4812-association-le-refuge-delegation-du-nord-hauts-de-france.htm",
        "https://le-refuge.org/la-ligne-decoute/"
      ]
    },
    {
      "id": "l109",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Générations et Cultures – « Un toit à partager », chambre chez une personne âgée",
      "structure": "Association Générations et Cultures",
      "adresse": "19 passage de l'Internationale, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 04 67",
      "horaires": null,
      "horairesTexte": "Horaires non donnés. Contactez l'association par téléphone ou par mail (cohabitation@generationsetcultures.fr).",
      "services": [
        "Une chambre meublée chez une personne plus âgée, pour un petit loyer.",
        "En échange : de la présence et de petits services au quotidien.",
        "L'association suit la cohabitation et aide en cas de difficulté.",
        "Durée d'un mois à un an."
      ],
      "conditions": "Pour les étudiantes, apprenties, travailleuses précaires ou adultes en reconversion. Inscription et rencontre avant d'être logée ; loyer et frais de suivi à payer. Ce n'est pas un hébergement d'urgence.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.generationsetcultures.fr/",
        "https://solidarites.lille.fr/acteur/379/4812-generations-et-cultures.htm"
      ]
    },
    {
      "id": "l110",
      "cat": "droits",
      "autresCats": [],
      "nom": "GRAAL – aide pour trouver ou garder un logement",
      "structure": "Groupe de Recherche pour l'Aide et l'Accès au Logement (GRAAL)",
      "adresse": "122 rue de Douai, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 54 81 14",
      "horaires": null,
      "horairesTexte": "Horaires des permanences non publiés. Appelez avant de venir.",
      "services": [
        "On vous aide à chercher un logement et à préparer votre dossier.",
        "On vous aide à ouvrir vos droits : aides au logement, demande de logement social, dépôt de garantie.",
        "On vous accompagne pour l'entrée dans le logement : état des lieux, compteurs, assurance.",
        "Des ateliers en groupe expliquent la recherche de logement et le budget.",
        "Si vous avez peur d'être expulsée, on peut vous aider à négocier avec le propriétaire."
      ],
      "conditions": "Pour les personnes en difficulté pour se loger. Contactez l'association par téléphone ; l'équipe vous oriente. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://graal-logement.fr/",
        "https://graal-logement.fr/accompagnement-au-logement",
        "https://solidarites.lille.fr/acteur/439/4812-groupe-de-recherche-pour-l-aide-et-l-acces-au-logement-graal.htm"
      ]
    },
    {
      "id": "l111",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Habitat Jeunes Béthanie – logements pour jeunes de 16 à 30 ans",
      "structure": "Association Habitat Jeunes Béthanie",
      "adresse": "15 rue Saint-Genois, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 06 72 86",
      "horaires": null,
      "horairesTexte": "Le site indique « du lundi au dimanche, 24h/24 » (résidence). La demande de logement se fait en ligne.",
      "services": [
        "Studios et petits appartements meublés (120 logements) pour les jeunes.",
        "Un loyer à payer chaque mois, adapté aux petits revenus.",
        "Une équipe vous aide à vous installer et dans votre parcours.",
        "Des animations et des repas partagés entre résidentes et résidents."
      ],
      "conditions": "Pour les jeunes de 16 à 30 ans, étudiantes ou qui travaillent, avec des revenus modestes. Demande de logement en ligne, avec des papiers à fournir. Ce n'est pas un hébergement d'urgence.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.habitatjeunesbethanie.fr/",
        "https://www.habitatjeunesbethanie.fr/demande-de-logement/",
        "https://solidarites.lille.fr/acteur/730/4812-residence-sociale-bethanie.htm"
      ]
    },
    {
      "id": "l112",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Hébergement d'urgence hommes – Eole (par le 115)",
      "structure": "Association Eole – Centre d'hébergement d'urgence hommes",
      "adresse": "27 rue des Stations, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 46 71",
      "horaires": null,
      "horairesTexte": "Entrée par le 115 uniquement.",
      "services": [
        "Un lit pour la nuit et des repas pour les hommes sans logement.",
        "Une équipe fait le point avec chacun sur ses droits et sa situation.",
        "Accompagnement vers la santé, l'emploi, un hébergement plus stable."
      ],
      "conditions": "Réservé aux hommes de 18 ans et plus. On y entre seulement en appelant le 115. Pour une femme : appelez le 115, qui vous orientera vers un lieu pour femmes.",
      "criteres": {
        "inconditionnel": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/centre-hebergement-urgence-hommes"
      ]
    },
    {
      "id": "l113",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Hébergement pour personnes en transition de genre – Eole",
      "structure": "Association Eole – Hébergement des personnes en transition de genre",
      "adresse": "2 rue de Bruxelles, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 53 81 47",
      "horaires": null,
      "horairesTexte": "Sur orientation, pas d'accueil sans rendez-vous.",
      "services": [
        "Quelques places d'hébergement sûres pour les personnes en cours de transition de genre.",
        "1 place d'urgence pour les personnes LGBTQIA+.",
        "Un accompagnement adapté, y compris pour le parcours médical de transition.",
        "Aide pour trouver ensuite un logement ou un hébergement durable."
      ],
      "conditions": "Pour les personnes en transition de genre fragilisées, sans logement. Orientation par les associations LGBTQIA+ de la métropole, le 115 ou l'accueil de jour d'Eole (8 rue de Tenremonde).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/hebergement-des-personnes-en-transition-de-genre"
      ]
    },
    {
      "id": "l114",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Logements pour familles – Eole (par le SIAO)",
      "structure": "Association Eole – Habitats disséminés familles",
      "adresse": "61 avenue du Peuple Belge, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 07 87",
      "horaires": null,
      "horairesTexte": "Sur orientation du SIAO, pas d'accueil sur place.",
      "services": [
        "10 logements dans la métropole, du studio au 4 pièces, pour vivre de façon autonome.",
        "On vous aide pour vos droits, vos papiers et la recherche d'un logement à vous.",
        "On vous soutient dans votre rôle de parent.",
        "On vous aide dans votre projet de travail."
      ],
      "conditions": "Pour les familles avec enfants, les femmes enceintes d'au moins 3 mois, ou les parents qui ont un droit de visite. Il faut des papiers en règle depuis 3 mois et des ressources. Demande par le SIAO (votre travailleuse sociale fait la demande).",
      "criteres": {
        "enfants": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Les femmes enceintes et les mères avec enfants peuvent y avoir un logement avec un accompagnement."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/habitats-dissemines-familles",
        "https://solidarites.lille.fr/acteur/102/4812-association-eole-accompagnement-social-lie-au-logement.htm"
      ]
    },
    {
      "id": "l115",
      "cat": "ecoute",
      "autresCats": [],
      "nom": "L'ASS des AS' – soutien aux personnes autistes et à leurs proches",
      "structure": "L'ASS des AS' (Association des Aspergers du Nord-Pas-de-Calais)",
      "adresse": "13 place Philippe Lebon, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 36 62 91 08",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous. Permanence d'écoute le 1er jeudi du mois, 14h-17h, au Centre Ressources Autismes (Loos), sauf juillet et août.",
      "services": [
        "Une écoute, des conseils et une orientation si vous êtes autiste ou pensez l'être.",
        "Des groupes de parole pour les proches.",
        "Des groupes pour apprendre à être à l'aise avec les autres.",
        "Un lieu d'entraide géré par et pour des personnes autistes (GEMsA)."
      ],
      "conditions": "Pour les personnes autistes sans déficience intellectuelle, leurs proches et les professionnels. Sur rendez-vous par téléphone ou par mail (ass.des.as@gmail.com).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.assdesas.fr/nous-contacter/",
        "https://www.assdesas.fr/permanences/"
      ]
    },
    {
      "id": "l116",
      "cat": "accueil",
      "autresCats": [],
      "nom": "La Cloche – point Repère du centre (place Sébastopol)",
      "structure": "La Cloche (antenne de Lille)",
      "adresse": "Place Sébastopol, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "07 66 89 78 25",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés sur une source officielle.",
      "services": [
        "La Cloche crée du lien entre voisins avec et sans domicile.",
        "Elle tient un réseau de commerces solidaires (« Le Carillon ») où l'on peut, selon le lieu, recharger son téléphone, avoir de l'eau, aller aux toilettes ou avoir le wifi.",
        "Ces commerces affichent un autocollant La Cloche sur leur vitrine."
      ],
      "conditions": "Ouvert à toutes et tous, sans condition. Gratuit.",
      "criteres": {
        "inconditionnel": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.lacloche.org/hautsdefrance-lille",
        "https://www.lacloche.org/le-carillon",
        "https://solidarites.lille.fr/acteur/380/4812-la-cloche.htm"
      ]
    },
    {
      "id": "l117",
      "cat": "manger",
      "autresCats": [],
      "nom": "Cuisine Commune de Chaud Bouillon (CCAS) – ateliers cuisine",
      "structure": "Cuisine Commune de Chaud Bouillon – CCAS de Lille",
      "adresse": "70 passage de l'Internationale, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 09 11 63 64",
      "horaires": null,
      "horairesTexte": "Ateliers selon le programme du mois (du lundi au vendredi selon la fiche de la Ville). Au 2e étage, entrée par les grandes portes vitrées.",
      "services": [
        "Des ateliers de cuisine ouverts à toutes et tous, gratuits ou à prix libre.",
        "Vous cuisinez avec d'autres puis vous partagez le repas.",
        "Un frigo solidaire et des repas du midi selon les jours (fiche de la Ville).",
        "Un endroit chaleureux pour rencontrer du monde."
      ],
      "conditions": "Ouvert à toutes et tous. Il faut souvent s'inscrire aux ateliers (programme du mois). Gratuit ou prix libre.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.chaudbouillon.earth/la-cuisine-commune/",
        "https://solidarites.lille.fr/acteur/671/4812-la-cuisine-commune-de-chaud-bouillon.htm",
        "https://www.lille.fr/Votre-Mairie/Aides-et-solidarite/Le-CCAS/Le-CCAS-un-etablissement-de-proximite"
      ]
    },
    {
      "id": "l118",
      "cat": "sante",
      "autresCats": [],
      "nom": "La Leche League – réunions sur l'allaitement",
      "structure": "La Leche League France – groupe de Lille",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Réunions environ 2 fois par mois, dates sur le site (ex. jeudi 26 novembre 2026 14h-16h30 ; une réunion en décembre 2026, 10h-12h, à la Cuisine Commune de Chaud Bouillon).",
      "services": [
        "Des réunions entre mères pour parler d'allaitement, avant et après la naissance.",
        "Des mères bénévoles formées répondent à vos questions, aussi par téléphone.",
        "Vous pouvez venir avec votre bébé et une personne proche.",
        "Sans inscription pour la plupart des réunions."
      ],
      "conditions": "Pour les femmes enceintes et les mères qui allaitent ou veulent allaiter. Sans inscription pour la plupart des réunions. Gratuit (don ou cotisation possible).",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Des mères bénévoles vous aident pour l'allaitement de votre bébé."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lllfrance.org/reunions/trouver-une-reunion?view=reunion&dept=59",
        "https://solidarites.lille.fr/acteur/310/4812-la-leche-league.htm"
      ]
    },
    {
      "id": "l119",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Maison des Marraines – logement pour jeunes femmes de 18 à 25 ans",
      "structure": "La Maison des Marraines (Impala Avenir) au centre Afpa de Lille-Lomme",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Sur orientation (mission locale), pas d'accueil sans rendez-vous.",
      "services": [
        "Une chambre pour quelques mois, dans un lieu sûr, pour les jeunes femmes sans logement.",
        "Un accompagnement par la mission locale pour la formation et le travail.",
        "Une « marraine » bénévole peut vous accompagner si vous le souhaitez.",
        "Après, on vous aide à aller vers un logement plus autonome."
      ],
      "conditions": "Réservé aux jeunes femmes de 18 à 25 ans, sans enfant, en difficulté de logement, prêtes à suivre un parcours d'insertion. Orientation par la mission locale.",
      "criteres": {
        "femmes": true
      },
      "femmes": {
        "niveau": "reserve",
        "texte": "Ce logement est réservé aux jeunes femmes de 18 à 25 ans, avec une marraine pour vous soutenir."
      },
      "langues": [],
      "adresseMasquee": true,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.afpa.fr/actualites/la-maison-des-marraines-un-cocon-au-sein-de-l-afpa-pour-donner-des-ailes-1"
      ]
    },
    {
      "id": "l120",
      "cat": "manger",
      "autresCats": [],
      "nom": "La Moulinerie – épicerie solidaire pour étudiantes et étudiants",
      "structure": "La Moulinerie (épicerie solidaire étudiante, Université de Lille)",
      "adresse": "1 place Déliot, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 44 04 45 34",
      "horaires": null,
      "horairesTexte": "Horaires non publiés sur une source officielle. Campus Moulins, bâtiment C, rez-de-chaussée au fond du couloir.",
      "services": [
        "Des produits, surtout alimentaires, vendus à 20 % de leur prix en magasin.",
        "Des ateliers de cuisine simple et contre le gaspillage.",
        "Des moments conviviaux entre étudiantes et étudiants."
      ],
      "conditions": "Réservé aux étudiantes et étudiants en difficulté financière. Produits payants à petit prix.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/926/4812-la-moulinerie.htm"
      ]
    },
    {
      "id": "l121",
      "cat": "vetements",
      "autresCats": [],
      "nom": "La Ressourcerie abej SOLIDARITÉ – vêtements et objets à petit prix",
      "structure": "abej SOLIDARITÉ – La Ressourcerie",
      "adresse": "22 rue de Mulhouse, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 66 19 10 00",
      "horaires": {
        "mer": [
          [
            "12:00",
            "18:30"
          ]
        ],
        "jeu": [
          [
            "12:00",
            "18:30"
          ]
        ],
        "ven": [
          [
            "12:00",
            "18:30"
          ]
        ],
        "sam": [
          [
            "12:00",
            "18:30"
          ]
        ]
      },
      "horairesTexte": "Magasin et dépôt : du mercredi au samedi, 12h-18h30.",
      "services": [
        "Un magasin de seconde main : vêtements, meubles, objets, livres à petit prix.",
        "Les personnes qui ont connu la rue peuvent y travailler, se former ou être bénévoles.",
        "Vous pouvez aussi y donner des vêtements et des objets."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous. Les articles sont payants, à petit prix. Métro Porte de Douai.",
      "criteres": {
        "sansRdv": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://abej-solidarite.fr/structure/la-ressourcerie/",
        "https://solidarites.lille.fr/acteur/176/4812-abej-solidarite-la-ressourcerie.htm"
      ]
    },
    {
      "id": "l122",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Le Tripostal – grandes expositions (gratuit avec le RSA)",
      "structure": "Le Tripostal – lille3000 / Ville de Lille",
      "adresse": "Avenue Willy Brandt, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 14 47 60",
      "horaires": {
        "mer": [
          [
            "11:00",
            "19:00"
          ]
        ],
        "jeu": [
          [
            "11:00",
            "19:00"
          ]
        ],
        "ven": [
          [
            "11:00",
            "19:00"
          ]
        ],
        "sam": [
          [
            "11:00",
            "19:00"
          ]
        ],
        "dim": [
          [
            "11:00",
            "19:00"
          ]
        ]
      },
      "horairesTexte": "Pendant l'exposition « Éclats du rire ! » (9 octobre 2026 – 3 janvier 2027) : du mercredi au dimanche, 11h-19h (exposition 11h-18h, jusqu'à 20h le jeudi). Fermé lundi et mardi. En dehors des expositions, le lieu est fermé.",
      "services": [
        "Une grande exposition d'art à voir au chaud, sur trois étages.",
        "Entrée gratuite si vous touchez le RSA, l'AAH, l'ASS, l'ARE, et pour les moins de 18 ans.",
        "Toilettes, bancs, tables à langer et casiers (contre une pièce d'identité).",
        "À 2 minutes à pied des gares Lille Flandres et Lille Europe."
      ],
      "conditions": "Ouvert à toutes et tous. Gratuit pour les personnes qui touchent les minima sociaux (montrer un justificatif) ; sinon 8 à 12 €.",
      "criteres": {
        "pmr": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eclatsdurire.lille3000.com/visite/",
        "https://www.lille.fr/Nos-equipements/Le-Tripostal"
      ]
    },
    {
      "id": "l123",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Les Auxiliaires des Aveugles – bénévoles pour accompagner les personnes aveugles",
      "structure": "Les Auxiliaires des Aveugles – délégation du Nord",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "06 99 83 68 49",
      "horaires": null,
      "horairesTexte": "Pas de lieu d'accueil : contact par téléphone ou par mail.",
      "services": [
        "Des bénévoles accompagnent les personnes aveugles ou malvoyantes.",
        "Aide pour lire le courrier, faire les courses, aller à un rendez-vous médical.",
        "Sorties et moments partagés pour rompre l'isolement."
      ],
      "conditions": "Pour les personnes aveugles ou malvoyantes. Contact par téléphone ou par mail (lesauxiliairesdesaveugles59@gmail.com).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lesauxiliairesdesaveugles59.fr/",
        "https://www.jeveuxaider.gouv.fr/organisations/4892-les-auxiliaires-des-aveugles-59-nord"
      ]
    },
    {
      "id": "l124",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Les Fabuleuses (rue Jeanne d'Arc)",
      "structure": "Les Fabuleuses",
      "adresse": "6 rue Jeanne d'Arc, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Informations non vérifiées : appelez ou passez avant pour savoir ce qui y est proposé."
      ],
      "conditions": "Non vérifié.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": []
    },
    {
      "id": "l125",
      "cat": "droits",
      "autresCats": [],
      "nom": "Accueil social – Maison de quartier Les Moulins",
      "structure": "Lieu d'Accueil Social (structure à confirmer), à la Maison de quartier « Les Moulins »",
      "adresse": "1 rue Armand Carrel, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 53 45 05",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Un accueil pour parler de vos difficultés et de vos démarches.",
        "La maison de quartier propose aussi des ordinateurs avec internet en accès libre et de l'aide aux démarches en ligne."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/422/4812-maison-de-quartier-les-moulins-centre-social.htm"
      ]
    },
    {
      "id": "l126",
      "cat": "droits",
      "autresCats": [],
      "nom": "Accueil social – Saint-Maurice Pellevoisin",
      "structure": "Lieu d'Accueil Social (structure à confirmer)",
      "adresse": "rue Saint-Gabriel, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 36 22 50",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Un accueil pour parler de vos difficultés et de vos démarches.",
        "La mairie de quartier voisine (74 rue Saint-Gabriel) propose la domiciliation, des aides financières et un ordinateur avec internet."
      ],
      "conditions": "Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/12/4812-mairie-de-quartier-de-saint-maurice-pellevoisin.htm"
      ]
    },
    {
      "id": "l127",
      "cat": "droits",
      "autresCats": [],
      "nom": "Accueil social – Maison du citoyen et des solidarités de Lomme",
      "structure": "Lieu d'Accueil Social (structure à confirmer)",
      "adresse": "343 avenue de Dunkerque, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Un accueil pour parler de vos difficultés et de vos démarches.",
        "Le bâtiment accueille aussi un point-justice (conseils juridiques gratuits)."
      ],
      "conditions": "Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://acceslibre.beta.gouv.fr/app/59-lille/a/point-justice/erp/point-justice-de-la-maison-du-citoyen-et-des-solidarites-de-lomme/"
      ]
    },
    {
      "id": "l128",
      "cat": "droits",
      "autresCats": [],
      "nom": "Accueil social – Lomme (avenue de la République)",
      "structure": "Lieu d'Accueil Social (structure à confirmer)",
      "adresse": "72 avenue de la République, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Un accueil pour parler de vos difficultés et de vos démarches.",
        "À cette adresse se trouve aussi le CCAS de Lomme (aides sociales de la commune)."
      ],
      "conditions": "Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": []
    },
    {
      "id": "l129",
      "cat": "droits",
      "autresCats": [],
      "nom": "Accueil social – Hellemmes (rue des Travailleurs)",
      "structure": "Lieu d'Accueil Social (structure à confirmer)",
      "adresse": "rue des Travailleurs, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Un accueil pour parler de vos difficultés et de vos démarches."
      ],
      "conditions": "Appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": []
    },
    {
      "id": "l130",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Lieu d'accueil social d'Hellemmes",
      "structure": "Lieu d'accueil social (structure non identifiée)",
      "adresse": "8 rue de la Ville de Naumbourg, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Un lieu de quartier pour être accueillie, écoutée et orientée.",
        "Vous pouvez y demander où trouver de l'aide près d'ici.",
        "Appelez la mairie d'Hellemmes avant de venir pour savoir si ce lieu est ouvert."
      ],
      "conditions": "Ouvert aux habitants. Renseignez-vous avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.hellemmes.fr/Hellemmes-solidaire/CCAS"
      ]
    },
    {
      "id": "l131",
      "cat": "accueil",
      "autresCats": [
        "droits"
      ],
      "nom": "Maison des Solidarités du Marais (Lomme) – accueil de quartier",
      "structure": "Ville de Lomme / CCAS de Lomme – Maison des Solidarités Marais",
      "adresse": "14 rue Thénard, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 93 03 85",
      "horaires": {
        "lun": [
          [
            "13:30",
            "17:30"
          ]
        ],
        "mar": [
          [
            "13:30",
            "17:30"
          ]
        ],
        "mer": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ],
        "jeu": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ],
        "ven": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ]
      },
      "horairesTexte": "Lundi et mardi 13h30-17h30 ; mercredi, jeudi et vendredi 8h30-12h et 13h30-17h30.",
      "services": [
        "Un lieu de quartier ouvert à toutes et tous, pour se poser au chaud et parler.",
        "On vous accueille, on vous informe et on vous oriente vers les bonnes aides.",
        "Aide au numérique sur rendez-vous, et écrivain public certains vendredis (sur rendez-vous à la Maison du Citoyen).",
        "Activités collectives gratuites (jardin, cuisine, santé)."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous aux heures d'ouverture. Gratuit.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ville-lomme.fr/Solidarite/Proximite/Maisons-des-Solidarites-Marais-Mitterie"
      ]
    },
    {
      "id": "l132",
      "cat": "accueil",
      "autresCats": [
        "droits"
      ],
      "nom": "Maison des Solidarités de la Mitterie (Lomme) – accueil de quartier",
      "structure": "Ville de Lomme / CCAS de Lomme – Maison des Solidarités Mitterie",
      "adresse": "1 allée des Châtaigniers, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 93 14 27",
      "horaires": {
        "lun": [
          [
            "13:30",
            "17:30"
          ]
        ],
        "mar": [
          [
            "13:30",
            "17:30"
          ]
        ],
        "mer": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ],
        "jeu": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ],
        "ven": [
          [
            "08:30",
            "12:00"
          ],
          [
            "13:30",
            "17:30"
          ]
        ]
      },
      "horairesTexte": "Lundi et mardi 13h30-17h30 ; mercredi, jeudi et vendredi 8h30-12h et 13h30-17h30.",
      "services": [
        "Un lieu de quartier ouvert à toutes et tous, pour se poser au chaud et parler.",
        "On vous accueille, on vous informe et on vous oriente vers les bonnes aides.",
        "Aide au numérique sur rendez-vous, et écrivain public certains vendredis (sur rendez-vous à la Maison du Citoyen).",
        "Activités collectives gratuites (jardin, cuisine, santé)."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous aux heures d'ouverture. Gratuit.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.ville-lomme.fr/Solidarite/Proximite/Maisons-des-Solidarites-Marais-Mitterie"
      ]
    },
    {
      "id": "l133",
      "cat": "manger",
      "autresCats": [],
      "nom": "Linkee – colis alimentaires pour étudiantes (Bazaar St So)",
      "structure": "Linkee",
      "adresse": "292 rue Camille Guérin, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Colis gratuits de fruits, légumes et produits secs, issus d'invendus.",
        "Parfois aussi des produits d'hygiène.",
        "Réservé aux étudiantes et étudiants, avec inscription en ligne."
      ],
      "conditions": "Réservé aux étudiantes et étudiants : inscription en ligne sur linkee.co, puis venir avec une carte étudiante ou un certificat de scolarité. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://linkee.co/distribution-lille/",
        "https://solidarites.lille.fr/acteur/929/4812-linkee.htm"
      ]
    },
    {
      "id": "l134",
      "cat": "manger",
      "autresCats": [],
      "nom": "Linkee – colis alimentaires pour étudiantes (Fives, le mercredi soir)",
      "structure": "Linkee",
      "adresse": "70 passage de l'Internationale, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": {
        "mer": [
          [
            "18:00",
            "19:30"
          ]
        ]
      },
      "horairesTexte": "Tous les mercredis de 18h à 19h30, sur inscription.",
      "services": [
        "Colis gratuits de fruits, légumes, produits laitiers et secs, issus d'invendus.",
        "Apportez votre sac.",
        "Un colis par personne et par distribution."
      ],
      "conditions": "Réservé aux étudiantes et étudiants : créez un compte et inscrivez-vous en ligne sur linkee.co, puis venez avec une carte étudiante ou un certificat de scolarité. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://linkee.co/distribution-lille/"
      ]
    },
    {
      "id": "l135",
      "cat": "sante",
      "autresCats": [
        "dormir"
      ],
      "nom": "Lits Halte Soins Santé femmes – Eole (se soigner avec un lit)",
      "structure": "Association Eole – LHSS Femmes, Résidence l'Escale",
      "adresse": "2 rue de Bruxelles, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 58 04 96",
      "horaires": "24/7",
      "horairesTexte": "Hébergement avec soins, jour et nuit (6 places). Entrée seulement sur orientation.",
      "services": [
        "Un lit et des soins pour les femmes sans logement qui sortent de l'hôpital ou ont besoin de soins suivis.",
        "Une équipe médicale et sociale vous accompagne pendant votre convalescence.",
        "On vous aide à préparer la suite : un hébergement ou un lieu adapté."
      ],
      "conditions": "Réservé aux femmes sans domicile qui ont besoin de soins. Sur orientation du Réseau Santé Solidarité Lille Métropole (fiche de demande sur sante-solidarite.org), faite en général par un hôpital, un médecin ou une travailleuse sociale.",
      "criteres": {
        "femmes": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "reserve",
        "texte": "Ce lieu accueille uniquement des femmes, pour se reposer et se soigner en sécurité."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/lhss-familles",
        "https://solidarites.lille.fr/acteur/104/4812-association-eole-lits-halte-soins-sante-femmes-et-familles.htm"
      ]
    },
    {
      "id": "l136",
      "cat": "sante",
      "autresCats": [
        "dormir"
      ],
      "nom": "Lits Halte Soins Santé hommes – Eole (Résidence du Pont Bleu)",
      "structure": "Association Eole – LHSS Hommes, Résidence du Pont Bleu",
      "adresse": "44 rue du Pont Neuf, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 38 13 98",
      "horaires": "24/7",
      "horairesTexte": "Hébergement avec soins, jour et nuit. Entrée seulement sur orientation.",
      "services": [
        "Un lit et des soins pour les hommes sans logement qui ont besoin de repos ou de convalescence.",
        "Réservé aux hommes : pour les femmes, voir les Lits Halte Soins Santé femmes d'Eole, rue de Bruxelles.",
        "Utile si vous accompagnez un proche malade qui vit à la rue."
      ],
      "conditions": "Réservé aux hommes de 18 ans et plus, en grande précarité. Sur orientation du Réseau Santé Solidarité Lille Métropole.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/lhss-hommes",
        "https://solidarites.lille.fr/acteur/103/4812-association-eole-lits-halte-soins-sante-hommes-seuls.htm"
      ]
    },
    {
      "id": "l137",
      "cat": "sante",
      "autresCats": [
        "dormir"
      ],
      "nom": "Lits Halte Soins Santé périnatalité – Eole (femmes enceintes, jeunes mamans, bébés)",
      "structure": "Association Eole – LHSS Périnatalité (pédiatriques), Résidence l'Escale",
      "adresse": "2 rue de Bruxelles, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 58 04 96",
      "horaires": "24/7",
      "horairesTexte": "Hébergement avec soins, jour et nuit (10 places). Entrée seulement sur orientation.",
      "services": [
        "Un lit et des soins pour les femmes enceintes à risque et les mamans qui viennent d'accoucher, sans logement.",
        "Accueille aussi les enfants de moins de 3 ans malades, avec leur parent.",
        "Une équipe médicale et sociale assure les soins et vous soutient comme parent.",
        "On vous aide à trouver une solution pour la sortie."
      ],
      "conditions": "Pour les femmes enceintes, les jeunes mamans et les enfants de moins de 3 ans sans domicile, quelle que soit la situation administrative (avec ou sans papiers). Sur orientation du Réseau Santé Solidarité Lille Métropole (fiche de demande sur sante-solidarite.org), faite en général par un hôpital, un médecin ou une travailleuse sociale.",
      "criteres": {
        "enfants": true,
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Ce lieu est pensé pour les femmes enceintes et les mamans avec leur bébé qui ont besoin de soins."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/lhss-pediatriques"
      ]
    },
    {
      "id": "l138",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Logements temporaires pour familles – Eole",
      "structure": "Association Eole – Logements Temporaires Familles",
      "adresse": "61 avenue du Peuple Belge, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 02 09",
      "horaires": null,
      "horairesTexte": "Pas d'accueil sur place : les logements (22, dans la métropole) sont attribués par le SIAO.",
      "services": [
        "22 logements dans la métropole lilloise, du studio au T4, pour vivre de façon autonome.",
        "Une équipe vous accompagne : droits, parentalité, recherche d'un logement durable, emploi.",
        "L'adresse est celle du siège de l'association, pas des logements."
      ],
      "conditions": "Pour les familles avec enfants, les femmes enceintes d'au moins 3 mois, ou les parents avec un droit de visite. Il faut des papiers en règle depuis 3 mois et des ressources (ou une démarche en cours). Demande à faire par le SIAO (115 ou travailleuse sociale).",
      "criteres": {
        "enfants": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Ce service accueille des familles et des femmes enceintes, seules ou en couple."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://eole-asso.fr/actions/Logements-temporaires-familles"
      ]
    },
    {
      "id": "l139",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier du Faubourg de Béthune",
      "structure": "Ville de Lille – Mairie de quartier du Faubourg de Béthune",
      "adresse": "17 avenue Verhaeren, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 10 96 40",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 3e mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Faubourg-de-Bethune/Mairie-de-quartier-du-Faubourg-de-Bethune",
        "https://solidarites.lille.fr/acteur/8/4812-mairie-de-quartier-du-faubourg-de-bethune.htm"
      ]
    },
    {
      "id": "l140",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Fives",
      "structure": "Ville de Lille – Mairie de quartier de Fives",
      "adresse": "127 ter rue Pierre Legrand, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 71 46 10",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 3e mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Fives/Mairie-de-quartier-de-Fives",
        "https://solidarites.lille.fr/acteur/9/4812-mairie-de-quartier-de-fives.htm"
      ]
    },
    {
      "id": "l141",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Lille-Centre",
      "structure": "Ville de Lille – Mairie de quartier de Lille-Centre",
      "adresse": "10 rue Pierre Dupont, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 15 97 40",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 1er mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Lille-Centre/Mairie-de-quartier-de-Lille-Centre",
        "https://solidarites.lille.fr/acteur/6/4812-mairie-de-quartier-de-lille-centre.htm"
      ]
    },
    {
      "id": "l142",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Lille-Moulins",
      "structure": "Ville de Lille – Mairie de quartier de Lille-Moulins",
      "adresse": "215 rue d'Arras, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 55 09 20",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 1er mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Lille-Moulins/Mairie-de-quartier-de-Lille-Moulins",
        "https://solidarites.lille.fr/acteur/10/4812-mairie-de-quartier-de-lille-moulins.htm"
      ]
    },
    {
      "id": "l143",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Saint-Maurice Pellevoisin",
      "structure": "Ville de Lille – Mairie de quartier de Saint-Maurice Pellevoisin",
      "adresse": "74 rue Saint-Gabriel, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 36 22 50",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 1er mardi du mois et les jours fériés. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Saint-Maurice-Pellevoisin/Mairie-de-quartier-de-Saint-Maurice-Pellevoisin",
        "https://solidarites.lille.fr/acteur/12/4812-mairie-de-quartier-de-saint-maurice-pellevoisin.htm"
      ]
    },
    {
      "id": "l144",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Vauban-Esquermes",
      "structure": "Ville de Lille – Mairie de quartier de Vauban-Esquermes",
      "adresse": "212 A rue Colbert, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 36 11 73",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Vauban-Esquermes/Mairie-de-quartier-de-Vauban-Esquermes",
        "https://solidarites.lille.fr/acteur/13/4812-mairie-de-quartier-de-vauban-esquermes.htm"
      ]
    },
    {
      "id": "l145",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Wazemmes",
      "structure": "Ville de Lille – Mairie de quartier de Wazemmes",
      "adresse": "100 rue de l'Abbé Aerts, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 12 84 60",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 1er mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Wazemmes/Mairie-de-quartier-de-Wazemmes",
        "https://solidarites.lille.fr/acteur/15/4812-mairie-de-quartier-de-wazemmes.htm"
      ]
    },
    {
      "id": "l146",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier des Bois-Blancs",
      "structure": "Ville de Lille – Mairie de quartier des Bois-Blancs",
      "adresse": "291 rue du Pont à Fourchon, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 17 00 40",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 1er mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Bois-Blancs/Mairie-de-quartier-des-Bois-Blancs",
        "https://solidarites.lille.fr/acteur/7/4812-mairie-de-quartier-des-bois-blancs.htm"
      ]
    },
    {
      "id": "l147",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier de Lille-Sud",
      "structure": "Ville de Lille – Mairie de quartier de Lille-Sud",
      "adresse": "83 rue du Faubourg des Postes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 54 02 30",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 3e mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Lille-Sud/Mairie-de-quartier-de-Lille-Sud",
        "https://solidarites.lille.fr/acteur/11/4812-mairie-de-quartier-de-lille-sud.htm"
      ]
    },
    {
      "id": "l148",
      "cat": "droits",
      "autresCats": [
        "wifi"
      ],
      "nom": "Mairie de quartier du Vieux-Lille",
      "structure": "Ville de Lille – Mairie de quartier du Vieux-Lille",
      "adresse": "13 rue de la Halle, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 38 91 40",
      "horaires": {
        "lun": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mar": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:30"
          ],
          [
            "13:15",
            "17:00"
          ]
        ]
      },
      "horairesTexte": "Du lundi au vendredi de 9h à 12h30 et de 13h15 à 17h. Fermé le 3e mardi du mois. Fermé le samedi et le dimanche.",
      "services": [
        "Vous pouvez y faire vos papiers : carte d'identité (sur rendez-vous), démarches de la Ville.",
        "Un ordinateur avec internet est disponible pour vos démarches, avec de l'aide si besoin.",
        "On vous informe et on vous oriente vers les aides sociales et les permanences (conciliateur, avocat via la Maison de la Médiation).",
        "Un lieu public et chauffé, en journée."
      ],
      "conditions": "Ouvert à toutes et tous, sans rendez-vous à l'accueil. Gratuit. Les pièces d'identité se font sur rendez-vous.",
      "criteres": {
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Vieux-Lille/Mairie-de-quartier-du-Vieux-Lille",
        "https://solidarites.lille.fr/acteur/14/4812-mairie-de-quartier-du-vieux-lille.htm"
      ]
    },
    {
      "id": "l149",
      "cat": "accueil",
      "autresCats": [
        "wifi",
        "droits"
      ],
      "nom": "Maison de quartier de Wazemmes (centre social)",
      "structure": "Maison de quartier de Wazemmes – Centre social",
      "adresse": "36 rue d'Eylau, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 54 60 80",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Un lieu de quartier ouvert à toutes et tous, pour se poser et rencontrer du monde.",
        "Ordinateurs et internet en accès libre, avec de l'aide pour s'en servir.",
        "Cours de français pour les personnes étrangères.",
        "Aide pour les démarches (sécurité sociale, budget) et permanence gratuite d'avocat.",
        "Écoute et soutien psychologique pour les femmes et les familles, ateliers bien-être et cuisine."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez pour connaître les horaires et les permanences. Beaucoup d'activités sont gratuites ou à petit prix.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/292/4812-maison-de-quartier-de-wazemmes-centre-social.htm"
      ]
    },
    {
      "id": "l150",
      "cat": "accueil",
      "autresCats": [
        "vetements"
      ],
      "nom": "Maison de quartier Godeleine Petit (centre social du Vieux-Lille)",
      "structure": "Maison de quartier du Vieux-Lille Godeleine Petit – Centre social",
      "adresse": "24 rue des Archives, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 06 17 22",
      "horaires": null,
      "horairesTexte": "",
      "services": [
        "Un lieu de quartier ouvert à toutes et tous, pour se poser et parler.",
        "Accueil et orientation des personnes en situation de précarité.",
        "Vêtements à petit prix ou gratuits.",
        "Ateliers de français et aide pour chercher un emploi (jeunes).",
        "Temps conviviaux et sorties."
      ],
      "conditions": "Ouvert à tous les habitants. Appelez pour connaître les horaires.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/372/4812-maison-de-quartier-godeleine-petit-centre-social-du-vieux-lille.htm"
      ]
    },
    {
      "id": "l151",
      "cat": "droits",
      "autresCats": [],
      "nom": "MDPH du Nord – accueil de Lille (droits des personnes handicapées)",
      "structure": "Maison départementale des personnes handicapées du Nord (Département du Nord)",
      "adresse": "73 avenue Kennedy, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 73 73",
      "horaires": {
        "lun": [
          [
            "09:00",
            "16:30"
          ]
        ],
        "mar": [
          [
            "09:00",
            "16:30"
          ]
        ],
        "mer": [
          [
            "09:00",
            "16:30"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "13:30"
          ],
          [
            "15:00",
            "16:30"
          ]
        ],
        "ven": [
          [
            "09:00",
            "16:30"
          ]
        ]
      },
      "horairesTexte": "Accueil du lundi au vendredi de 9h à 16h30 (sauf le jeudi entre 13h30 et 15h). Téléphone du lundi au vendredi de 8h à 17h (sauf le jeudi entre 13h30 et 15h).",
      "services": [
        "Information et conseils si vous avez un handicap ou une maladie qui dure.",
        "Aide pour faire une demande : allocation adulte handicapé (AAH), carte mobilité inclusion, reconnaissance du handicap.",
        "On peut vous aider à remplir votre dossier.",
        "Moins de monde entre 9h et 10h et après 14h."
      ],
      "conditions": "Pour les enfants et les adultes en situation de handicap et leurs proches, des territoires de Lille et de Roubaix-Tourcoing. Gratuit, sans rendez-vous aux heures d'accueil.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://mdph.lenord.fr/nous-trouver"
      ]
    },
    {
      "id": "l152",
      "cat": "accueil",
      "autresCats": [
        "droits"
      ],
      "nom": "Maison des Seniors de Lomme (CCAS)",
      "structure": "CCAS de Lomme",
      "adresse": "103 avenue de la République, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 59 08 30 90",
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
          ]
        ]
      },
      "horairesTexte": "Du lundi au jeudi de 9h à 12h30 et de 13h30 à 17h. Le vendredi de 9h à 12h30.",
      "services": [
        "Accueil et information pour les personnes âgées et leurs proches.",
        "Aide pour les démarches : allocation personnalisée d'autonomie (APA), carte mobilité inclusion.",
        "Information sur les logements pour seniors, le portage de repas et l'aide à domicile.",
        "Animations et club seniors."
      ],
      "conditions": "Pour les personnes âgées de Lomme et leurs proches. Gratuit. Vous pouvez laisser un message au téléphone en dehors des heures d'ouverture.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.ville-lomme.fr/Solidarite/Seniors"
      ]
    },
    {
      "id": "l153",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Maison Lill'Âges – appartement pour adapter son logement (CCAS de Lille)",
      "structure": "CCAS de Lille",
      "adresse": "108 rue des Meuniers, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 49 50 19",
      "horaires": {
        "mar": [
          [
            "14:00",
            "18:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:00"
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
            "09:00",
            "12:30"
          ]
        ],
        "sam": [
          [
            "09:00",
            "12:30"
          ]
        ]
      },
      "horairesTexte": "Mardi et jeudi 14h-18h ; mercredi 9h-12h et 14h-18h ; vendredi et samedi 9h-12h30. Visite uniquement sur réservation.",
      "services": [
        "Un appartement modèle pour découvrir comment adapter un logement quand on vieillit ou qu'on a un handicap.",
        "Une ergothérapeute vous montre les solutions, pièce par pièce.",
        "Ateliers gratuits : éviter les chutes, prendre soin de sa santé.",
        "Lieu peu utile pour une personne à la rue, sauf si vous avez un handicap et préparez une entrée en logement."
      ],
      "conditions": "Ouvert à tous : seniors, personnes handicapées, aidants. Gratuit, uniquement sur réservation (au 03 20 49 50 19 ou sur mesdemarches.lille.fr).",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Maison-Lill-Ages"
      ]
    },
    {
      "id": "l154",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Maison natale Charles de Gaulle (musée)",
      "structure": "Département du Nord – Maison natale Charles de Gaulle",
      "adresse": "9 rue Princesse, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 00 30",
      "horaires": {
        "lun": [
          [
            "10:00",
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
            "10:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "10:00",
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
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Tous les jours de 10h à 18h, sauf le mardi.",
      "services": [
        "Musée : la maison où Charles de Gaulle est né, avec une exposition.",
        "Entrée gratuite si vous touchez le RSA ou un autre minimum social (montrer un justificatif), pour les moins de 18 ans et les personnes handicapées.",
        "Un lieu calme et au chaud pour une visite.",
        "Sièges pliants prêtés sur demande."
      ],
      "conditions": "Entrée 8 € (réduit 6 €). Gratuit pour les bénéficiaires des minima sociaux, les moins de 18 ans et les personnes handicapées, avec un justificatif. Réservation conseillée.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://maisondegaulle.fr/preparer-sa-visite"
      ]
    },
    {
      "id": "l155",
      "cat": "droits",
      "autresCats": [
        "sante"
      ],
      "nom": "Maison Nord Solidarités – rue des Postes (Département du Nord)",
      "structure": "Département du Nord – Maison Nord Solidarités (ex-UTPAS)",
      "adresse": "11 rue des Postes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant.",
      "services": [
        "Des assistantes sociales vous aident pour vos droits (RSA, sécurité sociale, aides financières).",
        "Aide pour trouver ou garder un logement.",
        "Protection maternelle et infantile (PMI) : suivi de grossesse, consultations pour les bébés et les jeunes enfants.",
        "Soutien aux parents et aux familles, protection de l'enfance.",
        "Vous pouvez y demander à rencontrer une assistante sociale du quartier."
      ],
      "conditions": "Service public gratuit du Département du Nord. Il accueille les habitants des quartiers qu'il couvre. Appelez avant pour savoir les horaires et prendre rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": []
    },
    {
      "id": "l156",
      "cat": "droits",
      "autresCats": [
        "sante"
      ],
      "nom": "Maison Nord Solidarités de Lille-Moulins (Département du Nord)",
      "structure": "Département du Nord – Maison Nord Solidarités (ex-UTPAS)",
      "adresse": "1 rue Bayard, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 78 00",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant.",
      "services": [
        "Des assistantes sociales vous aident pour vos droits (RSA, sécurité sociale, aides financières).",
        "Aide pour trouver ou garder un logement.",
        "Protection maternelle et infantile (PMI) : suivi de grossesse, consultations pour les bébés et les jeunes enfants.",
        "Soutien aux parents et aux familles, protection de l'enfance.",
        "Vous pouvez y demander à rencontrer une assistante sociale du quartier."
      ],
      "conditions": "Service public gratuit du Département du Nord. Il accueille les habitants des quartiers qu'il couvre. Appelez avant pour savoir les horaires et prendre rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/251/4812-maison-nord-solidarites-lille-moulins.htm"
      ]
    },
    {
      "id": "l157",
      "cat": "droits",
      "autresCats": [
        "sante"
      ],
      "nom": "Maison Nord Solidarités de Lille-Fives (Département du Nord)",
      "structure": "Département du Nord – Maison Nord Solidarités (ex-UTPAS)",
      "adresse": "106 rue Pierre Legrand, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 92 70",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant.",
      "services": [
        "Pour les habitants de Fives, Saint-Maurice-Pellevoisin et du Vieux-Lille.",
        "Des assistantes sociales vous aident pour vos droits (RSA, sécurité sociale, aides financières).",
        "Aide pour trouver ou garder un logement.",
        "Protection maternelle et infantile (PMI) : suivi de grossesse, consultations pour les bébés et les jeunes enfants.",
        "Soutien aux parents et aux familles, protection de l'enfance."
      ],
      "conditions": "Service public gratuit du Département du Nord. Il accueille les habitants des quartiers qu'il couvre. Appelez avant pour savoir les horaires et prendre rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/249/4812-maison-nord-solidarites-lille-fives.htm"
      ]
    },
    {
      "id": "l158",
      "cat": "droits",
      "autresCats": [
        "sante"
      ],
      "nom": "Maison Nord Solidarités de Lille-Sud (Département du Nord)",
      "structure": "Département du Nord – Maison Nord Solidarités (ex-UTPAS)",
      "adresse": "3 rue de Cannes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 02 00",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant.",
      "services": [
        "Pour les habitants de Lille-Sud et du Faubourg de Béthune.",
        "Des assistantes sociales vous aident pour vos droits (RSA, sécurité sociale, aides financières).",
        "Aide pour trouver ou garder un logement.",
        "Protection maternelle et infantile (PMI) : suivi de grossesse, consultations pour les bébés et les jeunes enfants.",
        "Soutien aux parents et aux familles, protection de l'enfance."
      ],
      "conditions": "Service public gratuit du Département du Nord. Il accueille les habitants des quartiers qu'il couvre. Appelez avant pour savoir les horaires et prendre rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://solidarites.lille.fr/acteur/250/4812-maison-nord-solidarites-lille-sud.htm",
        "https://solidarites.lille.fr/acteur/54/4812-centre-de-consultation-de-pmi-de-lille-sud-rue-de-cannes.htm"
      ]
    },
    {
      "id": "l159",
      "cat": "droits",
      "autresCats": [
        "sante"
      ],
      "nom": "Maison Nord Solidarités d'Hellemmes (Département du Nord)",
      "structure": "Département du Nord – Maison Nord Solidarités (ex-UTPAS)",
      "adresse": "22 rue de l'Innovation, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 96 60",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant.",
      "services": [
        "Des assistantes sociales vous aident pour vos droits (RSA, sécurité sociale, aides financières).",
        "Aide pour trouver ou garder un logement.",
        "Protection maternelle et infantile (PMI) : suivi de grossesse, consultations pour les bébés et les jeunes enfants.",
        "Soutien aux parents et aux familles, protection de l'enfance.",
        "Vous pouvez y demander à rencontrer une assistante sociale du quartier."
      ],
      "conditions": "Service public gratuit du Département du Nord. Il accueille les habitants des quartiers qu'il couvre. Appelez avant pour savoir les horaires et prendre rendez-vous.",
      "criteres": {
        "gratuit": true,
        "pmr": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://acceslibre.beta.gouv.fr/app/59-lille/a/centre-social/erp/departement-du-nord-2/"
      ]
    },
    {
      "id": "l160",
      "cat": "sante",
      "autresCats": [],
      "nom": "Maraude médicale à pied de l'Ordre de Malte",
      "structure": "Ordre de Malte France – Délégation du Nord",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Pas d'horaires publics : l'équipe passe dans les rues de Lille.",
      "services": [
        "Des bénévoles médecins et infirmiers viennent vers vous dans la rue, à pied.",
        "Premiers soins gratuits pour les personnes en situation de précarité.",
        "L'Ordre de Malte fait aussi des maraudes sociales (repas, produits d'hygiène)."
      ],
      "conditions": "Gratuit, pour les personnes à la rue ou en grande précarité. L'équipe vient à vous : on ne peut pas s'y rendre. Pour la joindre, demandez dans un accueil de jour.",
      "criteres": {
        "gratuit": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ordredemaltefrance.org/delegations/nord/",
        "https://solidarites.lille.fr/acteur/905/4812-ordre-de-malte-delegation-du-nord.htm"
      ]
    },
    {
      "id": "l161",
      "cat": "accueil",
      "autresCats": [
        "hygiene",
        "recharge"
      ],
      "nom": "La Cloche – réseau de commerçants solidaires (Le Carillon)",
      "structure": "La Cloche – antenne Hauts-de-France",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "07 66 89 78 25",
      "horaires": null,
      "horairesTexte": "Appelez pour avoir la liste des commerçants et leurs horaires.",
      "services": [
        "Une centaine de commerçants solidaires à Lille et Roubaix (réseau « Le Carillon »).",
        "Chez eux, gratuitement : aller aux toilettes, recharger votre téléphone, parfois vous doucher.",
        "Des bons pour un repas, une coupe de cheveux ou une machine à laver.",
        "Activités pour créer du lien entre voisins avec et sans domicile."
      ],
      "conditions": "Gratuit, pour toutes les personnes sans domicile. Appelez La Cloche ou demandez la liste des commerçants dans un accueil de jour.",
      "criteres": {
        "gratuit": true,
        "inconditionnel": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lacloche.org/hautsdefrance-lille",
        "https://solidarites.lille.fr/acteur/380/4812-la-cloche.htm",
        "https://www.lillemetropole.fr/sites/default/files/2025-03/Guide%20info%20sans%20abris%20%28Version%20facile%20%C3%A0%20lire%20et%20%C3%A0%20comprendre%20-%20FALC%29.pdf"
      ]
    },
    {
      "id": "l162",
      "cat": "wifi",
      "autresCats": [],
      "nom": "Médiathèque du Faubourg de Béthune",
      "structure": "Bibliothèque municipale de Lille",
      "adresse": "6 bis boulevard de Metz, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 30 42 00",
      "horaires": {
        "mer": [
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
        ]
      },
      "horairesTexte": "Mercredi et vendredi de 14h à 18h.",
      "services": [
        "Ordinateurs gratuits avec internet.",
        "Aide pour les démarches administratives en ligne.",
        "Se poser au chaud et lire."
      ],
      "conditions": "Entrée libre et gratuite, sans inscription. Le prêt de livres est gratuit pour les habitants de Lille, Hellemmes et Lomme.",
      "criteres": {
        "gratuit": true,
        "sansRdv": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Mediatheque-du-Faubourg-de-Bethune",
        "https://solidarites.lille.fr/acteur/147/4812-mediatheque-du-faubourg-de-bethune.htm"
      ]
    },
    {
      "id": "l163",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Musée de l'Hospice Comtesse (Vieux-Lille)",
      "structure": "Musée de l'Hospice Comtesse – Ville de Lille",
      "adresse": "32 rue de la Monnaie, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 28 36 84 00",
      "horaires": {
        "lun": [
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
            "10:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "10:00",
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
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Lundi 14h-18h ; du mercredi au dimanche 10h-18h. Fermé le lundi matin, le mardi et certains jours fériés (1er janvier, 1er mai, 14 juillet, week-end de la braderie, 1er et 11 novembre, 25 décembre).",
      "services": [
        "Un ancien hôpital du Moyen Âge devenu musée, au calme, au chaud.",
        "Vous pouvez vous poser et visiter les salles et le jardin.",
        "L'entrée est gratuite si vous êtes demandeuse d'emploi ou si vous touchez le RSA ou une autre aide sociale (montrez un justificatif).",
        "Gratuit pour toutes et tous le 1er dimanche du mois, et chaque dimanche pour les habitantes de Lille, Lomme et Hellemmes.",
        "Le musée a un ascenseur et des rampes ; un fauteuil roulant est prêté à l'accueil."
      ],
      "conditions": "Ouvert à toutes et tous. Payant sauf gratuités (demandeuses d'emploi, minima sociaux, moins de 18 ans, 1er dimanche du mois…).",
      "criteres": {
        "sansRdv": true,
        "pmr": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://mhc.lille.fr/horaires-et-tarifs-0",
        "https://mhc.lille.fr/acces-et-accessibilite-0"
      ]
    },
    {
      "id": "l164",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Palais des Beaux-Arts de Lille (musée)",
      "structure": "Palais des Beaux-Arts – Ville de Lille",
      "adresse": "Place de la République, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 06 78 28",
      "horaires": {
        "lun": [
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
            "10:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "10:00",
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
            "18:00"
          ]
        ]
      },
      "horairesTexte": "Lundi 14h-18h ; du mercredi au dimanche 10h-18h. Fermé le mardi, le week-end de la braderie et certains jours fériés (1er janvier, 1er mai, 14 juillet, 1er novembre, 25 décembre).",
      "services": [
        "Un grand musée de peinture et de sculpture, au chaud, avec des bancs pour vous asseoir.",
        "L'entrée est gratuite si vous êtes demandeuse d'emploi ou si vous touchez une aide sociale (RSA…), sur justificatif.",
        "Gratuit pour toutes et tous le 1er dimanche du mois, et chaque dimanche pour les habitantes de Lille, Lomme et Hellemmes.",
        "Tout le musée est accessible par ascenseur (entrée boulevard de la Liberté) ; fauteuils roulants prêtés à l'accueil."
      ],
      "conditions": "Ouvert à toutes et tous. Payant (7 € / 4 €) sauf gratuités (demandeuses d'emploi, minima sociaux, moins de 18 ans, 1er dimanche du mois…).",
      "criteres": {
        "sansRdv": true,
        "pmr": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://pba.lille.fr/Infos",
        "https://pba.lille.fr/Infos/Conditions-de-reduction-et-de-gratuite",
        "https://pba.lille.fr/Accessibilite-de-votre-visite"
      ]
    },
    {
      "id": "l165",
      "cat": "droits",
      "autresCats": [
        "accueil"
      ],
      "nom": "Parcours Magdala – reprendre confiance et préparer un emploi",
      "structure": "Association Magdala",
      "adresse": "3 rue de Colmar, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 43 21",
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
      "horairesTexte": "Équipe à votre écoute lundi, mardi, jeudi et vendredi de 9h à 12h et de 14h à 17h (3 et 5 rue de Colmar).",
      "services": [
        "Un accompagnement pour sortir de l'isolement et reprendre un rythme.",
        "Une personne référente vous aide dans vos démarches (logement, santé…).",
        "Des ateliers en groupe : poterie, cuisine, santé, sport, café ouvert.",
        "Une aide pour préparer un emploi : CV, lettres, recherche de travail."
      ],
      "conditions": "Pour les personnes au RSA ou à l'AAH, sans emploi depuis longtemps, ayant connu la rue, isolées ou sortant de prison. Prenez contact par téléphone ou sur place pour entrer dans le parcours.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://magdala.asso.fr/accompagnement-social/parcours-magdala/",
        "https://solidarites.lille.fr/acteur/231/4812-association-magdala-espace-polyvalent.htm"
      ]
    },
    {
      "id": "l166",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV – aide aux locataires (Hellemmes)",
      "structure": "CLCV – Union locale de Lille",
      "adresse": "118 rue Roger Salengro, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 20 85 16 20",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non trouvés : appelez la CLCV avant.",
      "services": [
        "La CLCV est une association qui défend les locataires et les consommateurs.",
        "On vous aide en cas de problème avec votre propriétaire ou votre bailleur : bail, charges, travaux, état des lieux.",
        "On vous aide aussi à monter un dossier ou à écrire un courrier.",
        "Utile si vous avez un logement ou si vous risquez de le perdre."
      ],
      "conditions": "Pour les locataires du quartier. Appelez avant pour connaître le jour et savoir s'il faut un rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.hellemmes.fr/Hellemmes-solidaire/Proximite/Espace-citoyen/CLCV-Confederation-de-la-consommation-du-logement-et-du-cadre-de-vie-Espace-citoyen"
      ]
    },
    {
      "id": "l167",
      "cat": "droits",
      "autresCats": [],
      "nom": "SOLIHA – permanence logement (Lille-Sud – Maison Nord Solidarités)",
      "structure": "SOLIHA Métropole Nord",
      "adresse": "3 rue de Cannes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 67 67 30",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non publiés : appelez avant.",
      "services": [
        "Une personne de l'association SOLIHA vous reçoit pour parler de votre logement.",
        "Elle vous aide pour une demande de logement, un dossier d'aide ou un problème avec votre logement.",
        "Elle peut vous orienter vers un accompagnement plus long si vous en avez besoin.",
        "Le conseil est gratuit."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir pour connaître le jour de la permanence et savoir s'il faut un rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://uas.soliha.fr/content/uploads/sites/41/2026/05/soliha-mn-ra-25.pdf",
        "https://solidarites.lille.fr/acteur/250/4812-maison-nord-solidarites-lille-sud.htm"
      ]
    },
    {
      "id": "l168",
      "cat": "droits",
      "autresCats": [],
      "nom": "SOLIHA – permanence logement (mairie de Saint-Maurice Pellevoisin)",
      "structure": "SOLIHA Métropole Nord",
      "adresse": "74 rue Saint-Gabriel, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 67 67 30",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non publiés : appelez avant.",
      "services": [
        "Une personne de l'association SOLIHA vous reçoit pour parler de votre logement.",
        "Elle vous aide pour une demande de logement, un dossier d'aide ou un problème avec votre logement.",
        "Elle peut vous orienter vers un accompagnement plus long si vous en avez besoin.",
        "Le conseil est gratuit."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir pour connaître le jour de la permanence et savoir s'il faut un rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://uas.soliha.fr/content/uploads/sites/41/2026/05/soliha-mn-ra-25.pdf",
        "https://solidarites.lille.fr/acteur/12/4812-mairie-de-quartier-de-saint-maurice-pellevoisin.htm"
      ]
    },
    {
      "id": "l169",
      "cat": "droits",
      "autresCats": [],
      "nom": "SOLIHA – permanence logement (Maison de quartier de Wazemmes)",
      "structure": "SOLIHA Métropole Nord",
      "adresse": "36 rue d'Eylau, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 67 67 30",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non publiés : appelez avant.",
      "services": [
        "Une personne de l'association SOLIHA vous reçoit pour parler de votre logement.",
        "Elle vous aide pour une demande de logement, un dossier d'aide ou un problème avec votre logement.",
        "Elle peut vous orienter vers un accompagnement plus long si vous en avez besoin.",
        "Le conseil est gratuit."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir pour connaître le jour de la permanence et savoir s'il faut un rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://uas.soliha.fr/content/uploads/sites/41/2026/05/soliha-mn-ra-25.pdf",
        "https://solidarites.lille.fr/acteur/292/4812-maison-de-quartier-de-wazemmes-centre-social.htm"
      ]
    },
    {
      "id": "l170",
      "cat": "droits",
      "autresCats": [],
      "nom": "SOLIHA – permanence logement (Moulins – Maison Nord Solidarités)",
      "structure": "SOLIHA Métropole Nord",
      "adresse": "1 rue Bayard, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 67 67 30",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non publiés : appelez avant.",
      "services": [
        "Une personne de l'association SOLIHA vous reçoit pour parler de votre logement.",
        "Elle vous aide pour une demande de logement, un dossier d'aide ou un problème avec votre logement.",
        "Elle peut vous orienter vers un accompagnement plus long si vous en avez besoin.",
        "Le conseil est gratuit."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir pour connaître le jour de la permanence et savoir s'il faut un rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://uas.soliha.fr/content/uploads/sites/41/2026/05/soliha-mn-ra-25.pdf",
        "https://solidarites.lille.fr/acteur/251/4812-maison-nord-solidarites-lille-moulins.htm"
      ]
    },
    {
      "id": "l171",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV – aide aux locataires (Lomme)",
      "structure": "CLCV – Union locale de Lille",
      "adresse": "9 rue Gutenberg, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 85 16 20",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non trouvés : appelez la CLCV avant.",
      "services": [
        "La CLCV est une association qui défend les locataires et les consommateurs.",
        "On vous aide en cas de problème avec votre propriétaire ou votre bailleur : bail, charges, travaux, état des lieux.",
        "On vous aide aussi à monter un dossier ou à écrire un courrier.",
        "Utile si vous avez un logement ou si vous risquez de le perdre."
      ],
      "conditions": "Pour les locataires du quartier. Appelez avant pour connaître le jour et savoir s'il faut un rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/279/4812-clcv-union-locale-de-lille.htm"
      ]
    },
    {
      "id": "l172",
      "cat": "droits",
      "autresCats": [],
      "nom": "SOLIHA – permanence logement (CCAS d'Hellemmes)",
      "structure": "SOLIHA Métropole Nord",
      "adresse": "176 rue Roger Salengro, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 20 67 67 30",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non publiés : appelez avant.",
      "services": [
        "Une personne de l'association SOLIHA vous reçoit pour parler de votre logement.",
        "Elle vous aide pour une demande de logement, un dossier d'aide ou un problème avec votre logement.",
        "Elle peut vous orienter vers un accompagnement plus long si vous en avez besoin.",
        "Le conseil est gratuit."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir pour connaître le jour de la permanence et savoir s'il faut un rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://uas.soliha.fr/content/uploads/sites/41/2026/05/soliha-mn-ra-25.pdf",
        "https://www.hellemmes.fr/Hellemmes-solidaire/CCAS"
      ]
    },
    {
      "id": "l173",
      "cat": "droits",
      "autresCats": [],
      "nom": "SOLIHA – permanence logement (centre social de l'Arbrisseau)",
      "structure": "SOLIHA Métropole Nord",
      "adresse": "194 rue du Vaisseau le Vengeur, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 67 67 30",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non publiés : appelez avant.",
      "services": [
        "Une personne de l'association SOLIHA vous reçoit pour parler de votre logement.",
        "Elle vous aide pour une demande de logement, un dossier d'aide ou un problème avec votre logement.",
        "Elle peut vous orienter vers un accompagnement plus long si vous en avez besoin.",
        "Le conseil est gratuit."
      ],
      "conditions": "Ouvert aux habitantes et habitants. Appelez avant de venir pour connaître le jour de la permanence et savoir s'il faut un rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://uas.soliha.fr/content/uploads/sites/41/2026/05/soliha-mn-ra-25.pdf",
        "https://solidarites.lille.fr/acteur/477/4812-centre-social-et-culturel-de-l-arbrisseau.htm"
      ]
    },
    {
      "id": "l174",
      "cat": "droits",
      "autresCats": [
        "ecoute"
      ],
      "nom": "CIDFF – droits des femmes, permanence d'Hellemmes",
      "structure": "CIDFF Nord / Territoires",
      "adresse": "118 rue Roger Salengro, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 62 26 08 32",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous ; jours non publiés. Rendez-vous à l'accueil de l'Espace citoyen (03 62 26 08 32) ou de la mairie (03 20 41 82 50).",
      "services": [
        "Une juriste du CIDFF vous informe gratuitement sur vos droits.",
        "Vous pouvez parler de séparation, divorce, garde des enfants, pension alimentaire.",
        "Vous pouvez aussi parler de violences dans le couple ou dans la famille.",
        "L'entretien est confidentiel."
      ],
      "conditions": "Ouvert à toutes et tous, d'abord aux femmes. Gratuit, confidentiel et anonyme. Sur rendez-vous.",
      "criteres": {
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Le CIDFF informe d'abord les femmes sur leurs droits, notamment en cas de violences."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.hellemmes.fr/Hellemmes-solidaire/Proximite/Espace-citoyen/Le-CIDFF-Centre-d-information-sur-les-droits-des-femmes-et-de-la-famille-Espace-citoyen",
        "https://nord-territoires.cidff.info/liste-des-permanences/"
      ]
    },
    {
      "id": "l175",
      "cat": "droits",
      "autresCats": [
        "ecoute"
      ],
      "nom": "CIDFF – permanence au lycée Gaston Berger (élèves)",
      "structure": "CIDFF Nord / Territoires",
      "adresse": "Avenue Gaston Berger, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 70 22 18",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez le CIDFF.",
      "services": [
        "Une permanence du CIDFF dans le lycée, pour les élèves.",
        "On y parle de droits, d'égalité filles-garçons, de vie affective et de violences.",
        "Si vous n'êtes pas élève, allez plutôt à l'antenne du CIDFF, 48 rue Nicolas Leblanc."
      ],
      "conditions": "Réservé aux élèves du lycée. Gratuit et confidentiel.",
      "criteres": {
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Le CIDFF informe d'abord les femmes sur leurs droits, notamment en cas de violences."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://nord-territoires.cidff.info/liste-des-permanences/"
      ]
    },
    {
      "id": "l176",
      "cat": "droits",
      "autresCats": [
        "ecoute"
      ],
      "nom": "CIDFF – droits des femmes, permanence de Lomme (Maison du Citoyen)",
      "structure": "CIDFF Nord / Territoires",
      "adresse": "343 avenue de Dunkerque, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 08 90 30",
      "horaires": null,
      "horairesTexte": "Le jeudi, sur rendez-vous : 9h-12h selon le CIDFF, 14h-17h selon la Ville de Lomme. Maison du Citoyen ouverte mar. 9h-12h et 13h30-18h, mer. 9h-12h et 13h30-19h, jeu. et ven. 9h-12h et 13h30-18h, sam. 9h-13h.",
      "services": [
        "Une juriste du CIDFF vous informe gratuitement sur vos droits.",
        "Vous pouvez parler de séparation, divorce, garde des enfants, pension alimentaire.",
        "Vous pouvez aussi parler de violences dans le couple ou dans la famille.",
        "L'entretien est confidentiel.",
        "Dans la même Maison du Citoyen, d'autres permanences gratuites : avocate, aide aux victimes, écrivain public."
      ],
      "conditions": "Ouvert à toutes et tous, d'abord aux femmes. Gratuit, sans condition de ressources. Sur rendez-vous à la Maison du Citoyen.",
      "criteres": {
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Le CIDFF informe d'abord les femmes sur leurs droits, notamment en cas de violences."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://nord-territoires.cidff.info/liste-des-permanences/?departement=Nord&centre-id=maison-du-citoyen-point-d%E2%80%99acces-au-droit-lomme-612",
        "https://www.ville-lomme.fr/Solidarite/Proximite/Maison-du-Citoyen-et-des-Solidarites"
      ]
    },
    {
      "id": "l177",
      "cat": "droits",
      "autresCats": [],
      "nom": "CIDFF – permanence au tribunal judiciaire de Lille",
      "structure": "CIDFF Nord / Territoires",
      "adresse": "13 avenue du Peuple Belge, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 70 22 18",
      "horaires": null,
      "horairesTexte": "Une fois par mois (date non publiée) : appelez le CIDFF.",
      "services": [
        "Une juriste du CIDFF est présente au tribunal une fois par mois.",
        "Elle vous informe sur les questions de famille : séparation, garde des enfants, pension alimentaire.",
        "Elle vous aide à comprendre les démarches devant le juge.",
        "L'entretien est gratuit et confidentiel."
      ],
      "conditions": "Ouvert à toutes et tous, d'abord aux femmes. Gratuit. Appelez le CIDFF pour connaître la date.",
      "criteres": {
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Le CIDFF informe d'abord les femmes sur leurs droits, notamment en cas de violences."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://nord-territoires.cidff.info/liste-des-permanences/?departement=Nord&centre-id=tj-de-lille-626"
      ]
    },
    {
      "id": "l178",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV – aide aux locataires (Wazemmes, locataires LMH)",
      "structure": "CLCV – Union locale de Lille",
      "adresse": "36 rue d'Eylau, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 85 16 20",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non trouvés : appelez la CLCV avant.",
      "services": [
        "La CLCV est une association qui défend les locataires et les consommateurs.",
        "On vous aide en cas de problème avec votre propriétaire ou votre bailleur : bail, charges, travaux, état des lieux.",
        "On vous aide aussi à monter un dossier ou à écrire un courrier.",
        "Utile si vous avez un logement ou si vous risquez de le perdre."
      ],
      "conditions": "Pour les locataires du quartier. Appelez avant pour connaître le jour et savoir s'il faut un rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/279/4812-clcv-union-locale-de-lille.htm",
        "https://solidarites.lille.fr/acteur/292/4812-maison-de-quartier-de-wazemmes-centre-social.htm"
      ]
    },
    {
      "id": "l179",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV – aide aux locataires (Wazemmes, locataires Vilogia)",
      "structure": "CLCV – Union locale de Lille",
      "adresse": "Résidence Magenta Fombelle, bâtiment 1, rue Fombelle, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 85 16 20",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non trouvés : appelez la CLCV avant.",
      "services": [
        "La CLCV est une association qui défend les locataires et les consommateurs.",
        "On vous aide en cas de problème avec votre propriétaire ou votre bailleur : bail, charges, travaux, état des lieux.",
        "On vous aide aussi à monter un dossier ou à écrire un courrier.",
        "Utile si vous avez un logement ou si vous risquez de le perdre."
      ],
      "conditions": "Pour les locataires du quartier. Appelez avant pour connaître le jour et savoir s'il faut un rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/281/4812-clcv-union-locale-de-lille-permanence-secteur-vilogia.htm"
      ]
    },
    {
      "id": "l180",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV – aide aux locataires (Lille-Sud)",
      "structure": "CLCV – Union locale de Lille",
      "adresse": "7 rue de l'Asie, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 85 16 20",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non trouvés : appelez la CLCV avant.",
      "services": [
        "La CLCV est une association qui défend les locataires et les consommateurs.",
        "On vous aide en cas de problème avec votre propriétaire ou votre bailleur : bail, charges, travaux, état des lieux.",
        "On vous aide aussi à monter un dossier ou à écrire un courrier.",
        "Utile si vous avez un logement ou si vous risquez de le perdre."
      ],
      "conditions": "Pour les locataires du quartier. Appelez avant pour connaître le jour et savoir s'il faut un rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/279/4812-clcv-union-locale-de-lille.htm"
      ]
    },
    {
      "id": "l181",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV – aide aux locataires (Lille-Centre, tous bailleurs)",
      "structure": "CLCV – Union locale de Lille",
      "adresse": "1 rue Georges Lefebvre, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 85 16 20",
      "horaires": null,
      "horairesTexte": "Horaires de la permanence non trouvés : appelez la CLCV avant.",
      "services": [
        "La CLCV est une association qui défend les locataires et les consommateurs.",
        "On vous aide en cas de problème avec votre propriétaire ou votre bailleur : bail, charges, travaux, état des lieux.",
        "On vous aide aussi à monter un dossier ou à écrire un courrier.",
        "Utile si vous avez un logement ou si vous risquez de le perdre."
      ],
      "conditions": "Pour les locataires du quartier. Appelez avant pour connaître le jour et savoir s'il faut un rendez-vous.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/279/4812-clcv-union-locale-de-lille.htm",
        "https://solidarites.lille.fr/acteur/433/4812-centre-social-la-busette.htm"
      ]
    },
    {
      "id": "l182",
      "cat": "manger",
      "autresCats": [],
      "nom": "Repas du dimanche des paroisses de Lille (rue de Fleurus)",
      "structure": "Paroisses catholiques de Lille",
      "adresse": "13 bis rue de Fleurus, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Le 3e dimanche du mois (selon la fiche de la Ville de 2020) ; heures non trouvées.",
      "services": [
        "Un repas offert à toute personne en situation de précarité.",
        "Organisé par des bénévoles des paroisses de Lille.",
        "Un moment pour manger au chaud et rencontrer du monde."
      ],
      "conditions": "Ouvert à toute personne en difficulté, sans inscription. Gratuit.",
      "criteres": {
        "inconditionnel": true,
        "sansRdv": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/689/4812-repas-des-paroisses-de-lille-3eme-dimanche-du-mois.htm"
      ]
    },
    {
      "id": "l183",
      "cat": "droits",
      "autresCats": [
        "ecoute"
      ],
      "nom": "Point-justice d'Hellemmes (Espace citoyen) – conseils juridiques gratuits",
      "structure": "Espace citoyen – Ville d'Hellemmes",
      "adresse": "118 rue Roger Salengro, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 62 26 08 32",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous ; horaires d'ouverture non publiés.",
      "services": [
        "Des consultations juridiques gratuites et confidentielles avec des professionnels.",
        "Avocate (environ 15 minutes), conciliateur de justice, Défenseur des droits, CIDFF, aide aux victimes de violences.",
        "On vous aide à comprendre vos droits et à faire vos démarches.",
        "Utile en cas de violences, de séparation, de litige avec un propriétaire ou une administration."
      ],
      "conditions": "Ouvert à toutes et tous, gratuit, sans condition de ressources. Sur rendez-vous au 03 62 26 08 32 ou 03 20 41 82 50.",
      "criteres": {
        "inconditionnel": true,
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.hellemmes.fr/Hellemmes-solidaire/Proximite/Espace-citoyen",
        "https://www.hellemmes.fr/Hellemmes-solidaire/Proximite/Espace-citoyen/Les-avocats-Espace-citoyen"
      ]
    },
    {
      "id": "l184",
      "cat": "droits",
      "autresCats": [],
      "nom": "Point-justice de Lomme – conseils juridiques gratuits",
      "structure": "Maison du citoyen de Lomme (Point d'accès au droit, CDAD du Nord)",
      "adresse": "343 avenue de Dunkerque, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "03 20 08 90 30",
      "horaires": {
        "mar": [
          [
            "09:00",
            "12:00"
          ],
          [
            "13:30",
            "18:00"
          ]
        ],
        "mer": [
          [
            "09:00",
            "12:00"
          ],
          [
            "13:30",
            "18:00"
          ]
        ],
        "jeu": [
          [
            "09:00",
            "12:00"
          ],
          [
            "13:30",
            "18:00"
          ]
        ],
        "ven": [
          [
            "09:00",
            "12:00"
          ],
          [
            "13:30",
            "18:00"
          ]
        ],
        "sam": [
          [
            "09:00",
            "13:00"
          ]
        ]
      },
      "horairesTexte": "Sur rendez-vous uniquement. Du mardi au vendredi de 9h à 12h et de 13h30 à 18h, le samedi de 9h à 13h.",
      "services": [
        "Vous pouvez rencontrer gratuitement un avocat, un notaire, un commissaire de justice ou un conciliateur de justice.",
        "Un délégué du Défenseur des droits vous aide en cas de discrimination ou de problème avec une administration.",
        "L'AIAVM aide les victimes. Le CIDFF informe sur les droits des femmes et des familles.",
        "AIDA aide les personnes étrangères dans leurs démarches."
      ],
      "conditions": "Gratuit et ouvert à tout le monde. En ce moment, uniquement sur rendez-vous : appelez ou écrivez à maisonducitoyen@mairie-lomme.fr.",
      "criteres": {
        "gratuit": true,
        "inconditionnel": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "Le CIDFF y tient des permanences gratuites sur les droits des femmes et des familles : appelez pour avoir un rendez-vous."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.cdad-nord.justice.fr/c/63/1/mjd-et-point-justice-lille-et-metropole.html"
      ]
    },
    {
      "id": "l185",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence Les Canonniers (Armée du Salut) – studios avec accompagnement",
      "structure": "Fondation de l'Armée du Salut – Les Moulins de l'Espoir",
      "adresse": "10 rue Ovigneur, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 52 69 09",
      "horaires": null,
      "horairesTexte": "Ce n'est pas un lieu d'accueil sans rendez-vous. Une équipe éducative est présente sur place en semaine.",
      "services": [
        "25 petits studios pour des hommes seuls et des femmes seules.",
        "Vous vivez de façon autonome, avec une équipe éducative présente en semaine.",
        "C'est un foyer d'hébergement avec un accompagnement (CHRS) : on vous aide pour vos droits, votre santé, l'emploi ou la formation.",
        "L'objectif est de vous préparer à entrer dans un logement à vous."
      ],
      "conditions": "On n'y entre pas directement : il faut être orientée par le SIAO (le service qui attribue les places d'hébergement). Demandez à une assistante sociale ou appelez le 115.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.armeedusalut.fr/etablissements/les-moulins-de-lespoir/"
      ]
    },
    {
      "id": "l186",
      "cat": "droits",
      "autresCats": [],
      "nom": "RAIL – Réseau d'accueil des personnes immigrées",
      "structure": "RAIL (Réseau d'Accueil d'Immigrés à Lille)",
      "adresse": "27 rue Jean Bart, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés.",
      "services": [
        "Association d'accueil des personnes immigrées à Lille.",
        "Son adresse est à la Maison des associations : ce n'est peut-être qu'une adresse postale."
      ],
      "conditions": "Conditions non vérifiées. Renseignez-vous avant d'y aller.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://solidarites.lille.fr/acteur/580/4812-la-maison-des-associations.htm"
      ]
    },
    {
      "id": "l187",
      "cat": "manger",
      "autresCats": [
        "accueil"
      ],
      "nom": "Repas fraternels et solidaires – Maison solidaire Magdala",
      "structure": "Association Magdala – Maison solidaire « En Vie »",
      "adresse": "3 rue de Colmar, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "06 88 57 36 50",
      "horaires": null,
      "horairesTexte": "Repas partagés le jeudi midi et certains dimanches (heures non publiées) : appelez avant.",
      "services": [
        "Vous pouvez partager un repas dans une ambiance conviviale.",
        "On y organise aussi des temps festifs, des échanges et des activités.",
        "Le lieu accueille des personnes qui fréquentent l'accueil de jour de Magdala et des bénévoles."
      ],
      "conditions": "Conditions d'accès non précisées : appelez avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://magdala.asso.fr/dynamique-communautaire-2/la-maison-solidaire/",
        "https://solidarites.lille.fr/acteur/231/4812-association-magdala-espace-polyvalent.htm",
        "https://magdala.asso.fr/dynamique-communautaire-2/"
      ]
    },
    {
      "id": "l188",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence Henri Convain (Aréli) – logement temporaire meublé à Fives",
      "structure": "Aréli",
      "adresse": "16 rue de Lannoy, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 17 11",
      "horaires": null,
      "horairesTexte": "Pas d'accueil sans rendez-vous : demande de logement en ligne ou par téléphone.",
      "services": [
        "179 logements meublés : chambres en appartement partagé et studios, pour 2 mois à 2 ans.",
        "Loyer d'environ 390 à 500 € par mois, l'APL peut en payer une partie.",
        "Laverie et draps lavés sur place.",
        "Une équipe peut vous accompagner vers un logement durable, un emploi ou des soins."
      ],
      "conditions": "Pour les personnes qui ont besoin d'un logement pour un temps. Faites une demande sur le site d'Aréli, souvent avec l'aide d'une assistante sociale. Hébergement payant (loyer avec APL possible).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.areli.fr/logement/residence-logements-temporaires-convain-2/"
      ]
    },
    {
      "id": "l189",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence La Croisée des Vents (Aréli) – logement temporaire meublé à Moulins",
      "structure": "Aréli",
      "adresse": "8 rue Auguste Bonte, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 57 17 11",
      "horaires": null,
      "horairesTexte": "Pas d'accueil sans rendez-vous : demande de logement en ligne ou par téléphone.",
      "services": [
        "103 logements meublés, du studio au T3, pour des personnes seules ou des familles, pour 2 mois à 2 ans.",
        "Loyer d'environ 420 à 640 € par mois, l'APL peut en payer une partie.",
        "Laverie sur place, résidence fermée par badge.",
        "Une équipe peut vous accompagner vers un logement durable."
      ],
      "conditions": "Pour les personnes et les familles qui ont besoin d'un logement pour un temps. Faites une demande sur le site d'Aréli. Hébergement payant (loyer avec APL possible).",
      "criteres": {
        "enfants": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.areli.fr/logement/residence-logements-temporaires-croisee-2-2/"
      ]
    },
    {
      "id": "l190",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence Arouet (Aréli) – logement pour jeunes de 18 à 25 ans",
      "structure": "Aréli",
      "adresse": "81 rue de Jemmapes, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 63 16 80",
      "horaires": null,
      "horairesTexte": "Accueil et veille le soir, la nuit et le week-end pour les résidents. Demande de logement en ligne.",
      "services": [
        "128 chambres ou studios meublés pour les jeunes de 18 à 25 ans qui travaillent ou étudient.",
        "Loyer d'environ 510 à 720 € par mois, l'APL peut en payer une partie.",
        "Petit-déjeuner possible chaque matin, cuisine commune, laverie, salle informatique.",
        "Des travailleurs sociaux vous aident pour le budget, l'emploi ou trouver un logement."
      ],
      "conditions": "Pour les jeunes de 18 à 25 ans, actifs ou étudiants. Faites une demande sur le site d'Aréli. Hébergement payant (loyer avec APL possible).",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.areli.fr/logement/residence-jeunes-travailleurs-arouet/",
        "https://solidarites.lille.fr/acteur/729/4812-residence-jeunes-travailleurs-arouet.htm"
      ]
    },
    {
      "id": "l191",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence Les Dintellières (CCAS) – logements pour les plus de 60 ans",
      "structure": "CCAS de Lille",
      "adresse": "97 rue Saint-Sauveur, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 49 55 27",
      "horaires": null,
      "horairesTexte": "Pas d'accueil du public : appelez le CCAS.",
      "services": [
        "39 appartements à Lille-Centre.",
        "Appartements indépendants pour les personnes de plus de 60 ans qui vivent seules sans aide particulière.",
        "C'est un vrai logement avec un loyer, géré par le CCAS (service social de la Ville).",
        "Ce n'est pas un hébergement d'urgence."
      ],
      "conditions": "Pour les personnes de plus de 60 ans, autonomes. Demande auprès du CCAS de Lille (03 20 49 55 27). Logement payant.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Residence-locative-les-Dintellieres",
        "https://solidarites.lille.fr/acteur/418/4812-ccas-de-lille-residence-les-dintellieres.htm"
      ]
    },
    {
      "id": "l192",
      "cat": "dormir",
      "autresCats": [],
      "nom": "Résidence du Beigneau (CCAS) – logements pour les plus de 60 ans",
      "structure": "CCAS de Lille",
      "adresse": "112 rue de Wazemmes, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 49 55 27",
      "horaires": null,
      "horairesTexte": "Pas d'accueil du public : appelez le CCAS.",
      "services": [
        "116 appartements à Wazemmes.",
        "Appartements indépendants pour les personnes de plus de 60 ans qui vivent seules sans aide particulière.",
        "C'est un vrai logement avec un loyer, géré par le CCAS (service social de la Ville).",
        "Ce n'est pas un hébergement d'urgence."
      ],
      "conditions": "Pour les personnes de plus de 60 ans, autonomes. Demande auprès du CCAS de Lille (03 20 49 55 27). Logement payant.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://www.lille.fr/Nos-equipements/Residence-locative-du-Beigneau",
        "https://solidarites.lille.fr/acteur/417/4812-ccas-de-lille-residence-locative-du-beigneau.htm"
      ]
    },
    {
      "id": "l193",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution d'Hellemmes",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "208 rue Faidherbe, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/"
      ]
    },
    {
      "id": "l194",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution des Bois-Blancs (centre Coli)",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "39 rue Mermoz, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/",
        "https://solidarites.lille.fr/acteur/212/4812-les-restos-du-coeur-de-la-region-lilloise-lille-bois-blancs.htm"
      ]
    },
    {
      "id": "l195",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution du Vieux-Lille",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "13 rue de la Halle, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/",
        "https://solidarites.lille.fr/acteur/220/4812-les-restos-du-coeur-de-la-region-lilloise-lille-vieux-lille.htm"
      ]
    },
    {
      "id": "l196",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution de Lille-Sud (Le Vengeur)",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "250 rue Richard Wagner, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/"
      ]
    },
    {
      "id": "l197",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution de Fives (Marbrerie)",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "80 rue de Flers, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/",
        "https://solidarites.lille.fr/acteur/215/4812-les-restos-du-coeur-de-la-region-lilloise-lille-fives.htm"
      ]
    },
    {
      "id": "l198",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution de Wazemmes (Meuniers)",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "12 rue des Meuniers, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/"
      ]
    },
    {
      "id": "l199",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution de Saint-Maurice Pellevoisin",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "74 rue Saint-Gabriel, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/",
        "https://solidarites.lille.fr/acteur/217/4812-les-restos-du-coeur-de-la-region-lilloise-lille-saint-maurice.htm"
      ]
    },
    {
      "id": "l200",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution du Faubourg de Béthune",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "65 rue Saint-Bernard, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/",
        "https://solidarites.lille.fr/acteur/214/4812-les-restos-du-coeur-de-la-region-lilloise-lille-faubourg-de-bethune.htm"
      ]
    },
    {
      "id": "l201",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution de Vauban",
      "structure": "Les Restaurants du Cœur – Les Relais du Cœur (association Nord-Lille, AD59A)",
      "adresse": "8 rue de Toul, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 26 47 01",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant. Campagne d'hiver du lundi 16 novembre 2026 au dimanche 7 mars 2027.",
      "services": [
        "Vous pouvez recevoir des produits alimentaires à emporter et à cuisiner : produits frais et produits qui se conservent.",
        "Vous choisissez vous-même les produits, selon ce qui est disponible.",
        "Les bénévoles vous écoutent et peuvent vous orienter vers d'autres aides (logement, santé, droits).",
        "C'est gratuit."
      ],
      "conditions": "Il faut s'inscrire une fois par an dans le centre et montrer que vos ressources sont faibles (selon le barème de l'année). Venez avec vos papiers si vous en avez. Appelez avant pour connaître les jours d'inscription.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Fermé entre deux campagnes : la campagne d'hiver des Restos du Cœur commence le lundi 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ad59a-restosducoeur.org/lescentres",
        "https://www.google.com/maps/d/kml?mid=1h7aYlu_UtbfCWgT8RYgd2k_ee4A9408&forcekml=1",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda",
        "https://www.restosducoeur.org/nos-actions/aide-alimentaire/",
        "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-lille-a/",
        "https://solidarites.lille.fr/acteur/219/4812-les-restos-du-coeur-de-la-region-lilloise-lille-vauban.htm"
      ]
    },
    {
      "id": "l202",
      "cat": "manger",
      "autresCats": [],
      "nom": "Restos du Cœur – distribution de Lomme",
      "structure": "Les Restos du Cœur de la région lilloise (AD59A)",
      "adresse": "112 rue du 20e Siècle, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "09 74 30 07 42",
      "horaires": {
        "mar": [
          [
            "14:00",
            "16:00"
          ]
        ],
        "jeu": [
          [
            "14:00",
            "16:00"
          ]
        ],
        "ven": [
          [
            "14:00",
            "16:00"
          ]
        ]
      },
      "horairesTexte": "Distribution le mardi, le jeudi et le vendredi de 14h à 16h. Inscriptions le mardi et le jeudi de 9h à 11h. Fermé en août. La campagne d'hiver 2026-2027 commence le lundi 16 novembre 2026.",
      "services": [
        "Vous pouvez recevoir des denrées alimentaires gratuites.",
        "Il faut d'abord vous inscrire, le mardi ou le jeudi matin.",
        "Les bénévoles peuvent vous orienter vers d'autres aides."
      ],
      "conditions": "Pour les personnes qui ont peu de ressources, après inscription au centre. C'est gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "fermeTemp": {
        "jusqu": "2026-11-15",
        "texte": "Entre deux campagnes : la campagne d'hiver reprend le 16 novembre 2026."
      },
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ville-lomme.fr/Associations/Annuaire-des-associations/LES-RESTOS-DU-COEUR",
        "https://www.ad59a-restosducoeur.org/copie-de-agenda"
      ]
    },
    {
      "id": "l203",
      "cat": "accueil",
      "autresCats": [
        "droits"
      ],
      "nom": "Secours Catholique – accueil d'Hellemmes",
      "structure": "Secours Catholique – Caritas France, délégation Nord-Lille",
      "adresse": "221 rue Roger Salengro, 59260 Lille-Hellemmes",
      "lat": null,
      "lng": null,
      "tel": "03 20 91 34 66",
      "horaires": null,
      "horairesTexte": "Accueil sur rendez-vous seulement. Accueil au téléphone le mardi de 9h30 à 12h et le jeudi de 14h à 16h30.",
      "services": [
        "Des bénévoles vous écoutent et vous aident à trouver des solutions.",
        "Ils peuvent vous aider dans vos démarches et vous orienter vers d'autres aides.",
        "Un atelier couture a lieu dans un autre local du quartier ; l'inscription se fait à cet accueil."
      ],
      "conditions": "Pour toute personne en difficulté. Il faut d'abord prendre rendez-vous par téléphone. C'est gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://n-lille.secours-catholique.org/print/view/pdf/carte/block_4"
      ]
    },
    {
      "id": "l204",
      "cat": "accueil",
      "autresCats": [
        "droits"
      ],
      "nom": "Secours Catholique – accueil de Wazemmes",
      "structure": "Secours Catholique – Caritas France, délégation Nord-Lille",
      "adresse": "rue des Meuniers, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 55 62 33",
      "horaires": null,
      "horairesTexte": "Accueil le lundi matin (selon une annonce de bénévolat). Horaires exacts à demander à la délégation.",
      "services": [
        "Lieu d'accueil, d'écoute et de convivialité.",
        "Des bénévoles vous aident à comprendre vos besoins et à faire vos démarches.",
        "Aide pour l'accès aux droits, y compris pour les personnes étrangères (démarches de séjour).",
        "Ils peuvent vous orienter vers d'autres structures."
      ],
      "conditions": "Pour toute personne en difficulté. Appelez la délégation avant de venir. C'est gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.jeveuxaider.gouv.fr/missions-benevolat/40445/benevolat-secours-catholique-nord-lille",
        "https://solidarites.lille.fr/acteur/1060/4812-secours-catholique-delegation-nord-lille.htm"
      ]
    },
    {
      "id": "l205",
      "cat": "manger",
      "autresCats": [
        "vetements"
      ],
      "nom": "Secours populaire de Lomme – épicerie solidaire et friperie",
      "structure": "Secours populaire français – comité de Lomme",
      "adresse": "183 rue Anatole France, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "06 25 71 93 34",
      "horaires": {
        "mer": [
          [
            "14:00",
            "17:30"
          ]
        ],
        "ven": [
          [
            "14:00",
            "17:30"
          ]
        ],
        "sam": [
          [
            "10:00",
            "12:30"
          ],
          [
            "14:00",
            "17:30"
          ]
        ]
      },
      "horairesTexte": "Friperie et ressourcerie, ouvertes à tous : mercredi et vendredi 14h-17h30, samedi 10h-12h30 et 14h-17h30. Épicerie solidaire et Boutik Pop (avec le pass solidarité) : mercredi, vendredi et samedi 14h-17h30.",
      "services": [
        "Épicerie solidaire « La Mie Pop » : des courses à petit prix.",
        "« La Boutik Pop » : vêtements, produits de beauté et d'hygiène, jouets neufs.",
        "Friperie et ressourcerie (meubles, déco) ouvertes à tous, à petits prix.",
        "Vous pouvez aussi déposer des dons."
      ],
      "conditions": "Friperie et ressourcerie ouvertes à tous. Épicerie solidaire et Boutik Pop sous conditions de ressources, avec le pass solidarité. Ce n'est pas gratuit : les prix sont bas.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.ville-lomme.fr/Associations/Annuaire-des-associations/SECOURS-POPULAIRE-FRANCAIS-COMITE-DE-LOMME",
        "https://lillemetropole.fr/sites/default/files/2025-10/Annuaire%20r%C3%A9emploi%20SERD%202025%20BD%20.pdf"
      ]
    },
    {
      "id": "l206",
      "cat": "sante",
      "autresCats": [],
      "nom": "Service de prévention santé du Département – dépistages et vaccins gratuits",
      "structure": "Département du Nord – Service de Prévention Santé de Lille (Maison Nord Solidarités Lille Vauban)",
      "adresse": "8 rue de Valmy, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 59 73 69 60",
      "horaires": {
        "lun": [
          [
            "10:00",
            "15:15"
          ]
        ],
        "mar": [
          [
            "13:00",
            "18:15"
          ]
        ],
        "mer": [
          [
            "10:00",
            "15:15"
          ]
        ],
        "jeu": [
          [
            "10:00",
            "18:00"
          ]
        ],
        "ven": [
          [
            "10:00",
            "15:15"
          ]
        ]
      },
      "horairesTexte": "Lundi, mercredi et vendredi 10h-15h15 ; mardi 13h-18h15 ; jeudi 10h-18h. Fermé le week-end. Sur rendez-vous.",
      "services": [
        "Dépistage gratuit et anonyme du VIH (sida), des hépatites B et C et des infections sexuelles.",
        "Dépistage de la tuberculose (radio des poumons, examen) et soins.",
        "Vaccins gratuits pour vous et vos enfants.",
        "Un médecin répond à vos questions de santé.",
        "Aide pour arrêter de fumer."
      ],
      "conditions": "Pour tout le monde, gratuit. Il faut prendre rendez-vous par téléphone.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/lille-centre/Decouvrir-le-quartier/Senior-solidarite-et-sante/Service-de-prevention-sante",
        "https://info.lenord.fr/organisation/231",
        "https://solidarites.lille.fr/acteur/62/4812-sps-service-de-prevention-sante-du-nord.htm"
      ]
    },
    {
      "id": "l207",
      "cat": "droits",
      "autresCats": [],
      "nom": "Service logement de l'ALEFPA – aide pour trouver ou garder un logement",
      "structure": "ALEFPA – Pôle Inclusion Sociale Lille Métropole, service logement",
      "adresse": "284 ter rue Pierre Legrand, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 74 95 02 00",
      "horaires": null,
      "horairesTexte": "Sur rendez-vous au 03 74 95 02 00, ou en vous présentant sur place (métro Marbrerie). Horaires non publiés.",
      "services": [
        "Un accompagnement pour accéder à un logement si vous êtes sans domicile, hébergée chez quelqu'un ou victime de violences.",
        "Aide pour être reconnue prioritaire et monter un dossier (garantie FSL).",
        "Informations sur vos droits et devoirs de locataire.",
        "Aide si vous avez des dettes de loyer ou d'énergie, pour garder votre logement."
      ],
      "conditions": "Il faut avoir des ressources (RSA, salaire, AAH, retraite…) et être en situation régulière en France. Sur rendez-vous ou sur orientation d'un partenaire (Maison Nord Solidarités, CCAS, mairie). Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.alefpa.fr/etablissement/service-logement/",
        "https://solidarites.lille.fr/acteur/85/4812-alefpa-capharnaum-service-logement.htm"
      ]
    },
    {
      "id": "l208",
      "cat": "accueil",
      "autresCats": [],
      "nom": "Théâtre Moderne (Fives) – lieu culturel",
      "structure": "Théâtre Moderne",
      "adresse": "300 rue Pierre Legrand, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Horaires non trouvés : appelez ou renseignez-vous avant de venir.",
      "services": [
        "Lieu culturel du quartier de Fives (théâtre, spectacles).",
        "Vous pouvez demander s'il y a des spectacles ou des activités gratuites."
      ],
      "conditions": "Informations non vérifiées : renseignez-vous avant de venir.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": []
    },
    {
      "id": "l209",
      "cat": "ecoute",
      "autresCats": [],
      "nom": "Tombée du Nid – soutien aux familles d'enfants handicapés",
      "structure": "Association Tombée du Nid",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Pas de lieu d'accueil : aide par des bénévoles, mise en relation par l'application « Cœur du Nid ».",
      "services": [
        "Si votre enfant a un handicap, des bénévoles formés peuvent vous aider.",
        "Aide au quotidien, pour les démarches, écoute et conseils.",
        "Des bénévoles peuvent accompagner votre enfant à l'école ou à la cantine."
      ],
      "conditions": "Pour les familles qui ont un enfant porteur de handicap. Contact par l'association ou son application.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://www.jeveuxaider.gouv.fr/missions-benevolat/79220/benevolat-tombee-du-nid-59"
      ]
    },
    {
      "id": "l210",
      "cat": "droits",
      "autresCats": [],
      "nom": "Point Info Famille (UDAF) – informations pour la vie de famille",
      "structure": "UDAF du Nord – Point Info Famille Lille Métropole",
      "adresse": "10 rue Baptiste Monnoyer, 59800 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 54 97 61",
      "horaires": null,
      "horairesTexte": "Horaires non publiés : appelez avant de venir.",
      "services": [
        "On vous informe et on vous oriente pour votre vie de famille.",
        "L'équipe vous indique le bon service selon votre situation (enfants, budget, séparation, aides).",
        "Aide possible sur le budget et les démarches des familles."
      ],
      "conditions": "Pour toutes les familles et les parents. Gratuit.",
      "criteres": {
        "gratuit": true
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://www.lille.fr/lille-centre/Decouvrir-le-quartier/Senior-solidarite-et-sante/Point-Info-Famille",
        "https://solidarites.lille.fr/acteur/134/4812-union-departementale-des-associations-familiales-udaf-du-nord.htm"
      ]
    },
    {
      "id": "l211",
      "cat": "droits",
      "autresCats": [],
      "nom": "CLCV du Nord – aide pour les litiges de logement et de consommation",
      "structure": "CLCV – Union départementale du Nord (Consommation, Logement et Cadre de Vie)",
      "adresse": "2 rue Claude Bernard, 59000 Lille",
      "lat": null,
      "lng": null,
      "tel": "03 20 52 76 94",
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
          ]
        ]
      },
      "horairesTexte": "Du lundi au jeudi 9h-12h30 et 13h30-17h ; le vendredi 9h-12h30. Pour un litige, sur rendez-vous.",
      "services": [
        "Aide si vous avez un problème avec votre propriétaire ou votre bailleur.",
        "Aide pour un litige avec une entreprise (téléphone, énergie, achat).",
        "Des conseils pour régler le problème à l'amiable."
      ],
      "conditions": "Pour les locataires et les consommateurs. Pour un litige, prenez rendez-vous par téléphone. L'association peut demander une adhésion.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "basse",
      "sources": [
        "https://hautsdefrance.clcv.org/cat-clcv-nord/",
        "https://solidarites.lille.fr/acteur/280/4812-clcv-union-departementale.htm"
      ]
    },
    {
      "id": "l212",
      "cat": "accueil",
      "autresCats": [
        "dormir",
        "droits"
      ],
      "nom": "Utopia 56 Lille – aide aux jeunes exilés à la rue",
      "structure": "Utopia 56 – antenne de Lille",
      "adresse": "",
      "lat": null,
      "lng": null,
      "tel": "",
      "horaires": null,
      "horairesTexte": "Accueil de jour itinérant plusieurs après-midi par semaine. Lieux et horaires non publiés.",
      "services": [
        "L'association aide les jeunes exilés à la rue, surtout ceux dont la minorité n'a pas été reconnue.",
        "Recherche d'un hébergement, parfois chez des hébergeurs solidaires.",
        "Colis alimentaires, vêtements et activités pendant les permanences.",
        "Aide pour les démarches administratives, juridiques, l'école et la santé."
      ],
      "conditions": "Pour les jeunes exilés et exilées à la rue à Lille. Gratuit. Contact : hebergement.lille@utopia56.org.",
      "criteres": {
        "gratuit": true
      },
      "femmes": {
        "niveau": "specialise",
        "texte": "L'association mène une action pour mettre à l'abri en urgence les jeunes filles à la rue."
      },
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "moyenne",
      "sources": [
        "https://utopia56.org/lille-3/",
        "https://utopia56.org/action-en-cours-a-lille-utopia-56/"
      ]
    },
    {
      "id": "l213",
      "cat": "manger",
      "autresCats": [],
      "nom": "VRAC – épicerie à petits prix du Marais (Lomme)",
      "structure": "VRAC Hauts-de-France (Vers un Réseau d'Achat en Commun)",
      "adresse": "14 rue Thénard, 59160 Lille-Lomme",
      "lat": null,
      "lng": null,
      "tel": "06 51 01 59 05",
      "horaires": null,
      "horairesTexte": "Une épicerie par mois, le lundi de 15h30 à 18h30 (ex. lundi 7 décembre 2026), à la Maison des Solidarités du Marais. Commande deux semaines avant, en ligne, par téléphone ou à une permanence (15h30-17h).",
      "services": [
        "Des produits de qualité (bio, locaux) à prix réduits, en vrac.",
        "Vous commandez, puis vous venez chercher vos produits à l'épicerie du mois.",
        "Apportez vos bocaux, bouteilles et sacs."
      ],
      "conditions": "Il faut adhérer à l'association, puis commander à l'avance. Les produits sont payants, à petits prix.",
      "criteres": {},
      "langues": [],
      "adresseMasquee": false,
      "verifie": "2026-11-12",
      "confiance": "haute",
      "sources": [
        "https://hdf.vrac-asso.org/commander-catalogue/",
        "https://hdf.vrac-asso.org/wp-content/uploads/sites/12/2026/06/lomme-10.pdf"
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
