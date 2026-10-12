/*
 * Les versions de l'appli et ce que chacune a apporté, montrées sur la page de l'équipe
 * (/equipe → Statistiques). La plus récente en premier.
 *
 * À chaque nouvelle version : ajouter ici une entrée en haut de la liste. Dans sw.js,
 * VERSION vaut « paladines-v<numéro>.<révision> » (ex. paladines-v21.0) : augmenter la
 * révision à chaque mise en ligne, même sans nouvelle version affichée ici.
 */
export const VERSIONS = [
  {
    v: 21,
    date: "2026-10-12",
    titre: "Refonte : plus simple, bleu nuit et jaune",
    nouveautes: [
      "Un seul style, bleu nuit et jaune, sur un fond uni ; peu de couleurs et de vraies couleurs : jaune pour choisir, vert pour « Ouvert » et « Appeler », rouge pour « Quitter » et les urgences, bleu pour « Itinéraire ».",
      "Listes plus courtes : un bouton « Près de moi » pour trier du plus proche au plus loin, « Ouvert maintenant », et les autres filtres rangés dans « Plus de filtres ».",
      "Fini « Je suis près de… » et « Me placer sur la carte » : seul le tri par distance reste.",
      "Infos pratiques en fiches claires : une phrase pour l'essentiel, le détail en touchant la fiche, et les boutons « Appeler » ou « Voir les lieux » directement dedans.",
      "Nouvelle carte sombre et sobre (CARTO) : les lieux ouverts en jaune ressortent, les autres en gris.",
      "Page de l'équipe aux mêmes couleurs."
    ]
  },
  {
    v: 20,
    date: "2026-10-12",
    titre: "Nouveau look façon iPhone (Liquid Glass)",
    nouveautes: [
      "Verre transparent partout (cartes, boutons, menus), en-tête en verre et barre d'onglets flottante ; la carte va jusqu'en bas de l'écran.",
      "Style noir et blanc soigné : fond gris de l'iPhone (noir profond en mode sombre), ombres légères, fondu entre les écrans.",
      "Une seule police, celle du téléphone, avec des tailles claires ; titres de section en gras ; listes de lieux façon iPhone avec bouton d'appel rond.",
      "Vert pour « Ouvert » et « Appeler », rouge pour « Quitter » et les numéros d'urgence ; tous les textes vérifiés lisibles.",
      "Carte : repères noirs pour les lieux ouverts, blancs pour les autres ; l'icône dit le besoin.",
      "Réglages : sélecteurs façon iPhone et nouveau style de couleurs « Paladines » (bleu nuit, jaune lampe, verre lumineux).",
      "Page de l'équipe au même style, avec onglets « À traiter », « Historique », « Statistiques » et un tableau de bord des chiffres clés.",
      "Corrections : « A++ » dans le bon sens en arabe, mode sombre lisible sur les navigateurs sans flou, 110 Ko de moins à l'installation."
    ]
  },
  {
    v: 19,
    date: "2026-10-12",
    titre: "Page de l'équipe : signalements et statistiques",
    nouveautes: [
      "La page /equipe a deux onglets : « Signalements » et « Statistiques ».",
      "Statistiques : la version en ligne, l'historique des versions et le nombre de visites par mois.",
      "Compteur de visites anonyme : un téléphone compte une fois par jour, sans aucune donnée sur la personne."
    ]
  },
  {
    v: 18,
    date: "2026-10-12",
    titre: "Adresse courte pour l'équipe",
    nouveautes: [
      "La page des signalements s'ouvre à l'adresse paladines.pages.dev/equipe.",
      "Bouton « Lire les signalements reçus » dans la page « À propos »."
    ]
  },
  {
    v: 17,
    date: "2026-10-12",
    titre: "Les signalements partent vraiment",
    nouveautes: [
      "« Signaler une erreur » sur chaque fiche envoie le message à l'équipe, avec un texte facultatif.",
      "Nouvelle page « Signaler un problème » : lieu manquant, souci dans l'appli, traduction fausse.",
      "Sans internet, le message attend sur le téléphone et part au retour de la connexion.",
      "Page de l'équipe protégée par mot de passe pour lire et supprimer les messages."
    ]
  },
  {
    v: 16,
    date: "2026-10-09",
    titre: "Correction de l'arabe",
    nouveautes: ["Températures en arabe écrites avec le symbole ° (« حتى 3° »), sans faute d'accord."]
  },
  {
    v: 15,
    date: "2026-10-09",
    titre: "Accueil relu et corrigé",
    nouveautes: [
      "Accueil plus serré sur les petits écrans ; « Pour les femmes » devient la première tuile.",
      "« Appeler avant » au lieu de « Fermé » quand les horaires sont inconnus.",
      "GPS refusé : le message renvoie vers « Je suis près de… »."
    ]
  },
  {
    v: 14,
    date: "2026-10-09",
    titre: "Infos du moment",
    nouveautes: [
      "Un bandeau qui défile sur l'accueil : plan hiver, météo de Lille (froid, chaleur, pluie), lieux ouverts en ce moment.",
      "Pas de défilement automatique si le téléphone demande moins d'animations."
    ]
  },
  {
    v: 13,
    date: "2026-10-09",
    titre: "Accueil épuré",
    nouveautes: [
      "Accueil deux fois moins long : « Ouvert maintenant, près de moi », les besoins en grille, les numéros d'urgence.",
      "Fiche d'un lieu : « Itinéraire » et « Appeler » en grand.",
      "Tout tient sur les petits téléphones (320 px)."
    ]
  },
  {
    v: 12,
    date: "2026-10-09",
    titre: "Pensée pour les femmes",
    nouveautes: [
      "Nouvelle page « Pour les femmes » : lieux réservés, créneaux femmes, santé, protections périodiques.",
      "Badges « Réservé aux femmes » et « Créneau femmes » dans les listes, les fiches et sur la carte.",
      "13 lieux décrits pour les femmes."
    ]
  },
  {
    v: 11,
    date: "2026-10-08",
    titre: "Identité choisie",
    nouveautes: [
      "Style « Nuit raffinée » : bleu nuit et lampe jaune.",
      "Logo « La lanterne » dans l'appli, sur les affiches et les icônes du téléphone."
    ]
  },
  {
    v: 10,
    date: "2026-10-08",
    titre: "Propositions d'identité",
    nouveautes: ["5 logos et 5 styles à essayer directement sur son téléphone, pour le choix du groupe."]
  },
  {
    v: 9,
    date: "2026-10-08",
    titre: "Wifi gratuit",
    nouveautes: [
      "Nouvelle catégorie « Wifi gratuit » : 15 lieux à Lille (médiathèques, gare Lille Flandres, Euralille…).",
      "Comment se connecter, pour chaque lieu."
    ]
  },
  {
    v: 8,
    date: "2026-10-08",
    titre: "Tous les lieux sur la carte",
    nouveautes: [
      "Positions des lieux vérifiées rue par rue.",
      "Lieux à adresse protégée : repère au lieu public où demander à y aller, jamais à la vraie adresse.",
      "Services sans adresse (115, équipe mobile) : bouton « Par téléphone » sur la carte."
    ]
  },
  {
    v: 7,
    date: "2026-10-08",
    titre: "Mise en ligne",
    nouveautes: [
      "L'appli est en ligne sur paladines.pages.dev.",
      "Correction : l'appli installée sur iPhone s'ouvre de nouveau."
    ]
  },
  {
    v: 6,
    date: "2026-10-08",
    titre: "Heures lisibles",
    nouveautes: ["Les heures ne sont plus coupées en fin de ligne (« 20 h 30 »)."]
  },
  {
    v: 5,
    date: "2026-10-08",
    titre: "Repères « Je suis près de »",
    nouveautes: [
      "15 repères (gares, métro, Grand Place…) pour trier les lieux par distance sans GPS.",
      "Positions des lieux confirmées par deux recherches."
    ]
  },
  {
    v: 4,
    date: "2026-10-08",
    titre: "Près de moi, appel direct et carte",
    nouveautes: [
      "Tri par distance : GPS, « Je suis près de… » ou toucher la carte.",
      "Bouton « Appeler » sur chaque lieu.",
      "Installation sur le téléphone (Android et iPhone) et QR code « Ouvrir sur mon téléphone »."
    ]
  },
  {
    v: 3,
    date: "2026-10-07",
    titre: "De vrais lieux à Lille",
    nouveautes: [
      "46 vrais lieux de Lille, avec leurs sources.",
      "Adresses des hébergements de femmes masquées ; 115 et équipe mobile présentés comme numéros à appeler.",
      "Alerte plan hiver."
    ]
  },
  {
    v: 2,
    date: "2026-10-07",
    titre: "Un lieu, plusieurs besoins",
    nouveautes: [
      "Un lieu apparaît dans chaque besoin qu'il couvre (par exemple douches et bagagerie).",
      "Positions GPS des lieux calculées à partir des adresses."
    ]
  },
  {
    v: 1,
    date: "2026-10-07",
    titre: "Premier prototype",
    nouveautes: [
      "Lieux ouverts près de soi pour dormir, manger, se laver, se soigner, être aidée.",
      "Fiches, carte, numéros d'urgence, lieux gardés, bouton « Quitter ».",
      "Français, anglais, arabe, lecture à voix haute, mode sombre.",
      "Marche sans internet et s'installe sans store ; affiches avec QR code."
    ]
  }
];
