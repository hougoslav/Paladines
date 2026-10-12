/*
 * Les versions de l'appli et ce que chacune a apporté, montrées sur la page de l'équipe
 * (/equipe → Statistiques). La plus récente en premier.
 *
 * À chaque mise à jour : augmenter VERSION dans sw.js, puis ajouter ici une entrée
 * en haut de la liste, avec le même numéro.
 */
export const VERSIONS = [
  {
    v: 25,
    date: "2026-10-12",
    titre: "Vert et rouge plus élégants",
    nouveautes: [
      "Vert émeraude profond pour « Ouvert » et « Appeler », à la place du vert sapin.",
      "Rouge framboise pour « Quitter » et les numéros d'urgence, à la place du rouge orangé.",
      "Mêmes teintes sur la page de l'équipe ; tous les textes restent bien lisibles, en clair et en sombre."
    ]
  },
  {
    v: 24,
    date: "2026-10-12",
    titre: "Finitions plus professionnelles",
    nouveautes: [
      "Fond gris système de l'iPhone (noir en mode sombre), plus net que le dégradé.",
      "Surfaces en verre plus sobres : presque blanches, liseré fin, ombre douce, sans reflet appuyé.",
      "Icônes des besoins sur un fond neutre plein ; indicateur de pages plus discret sous les infos du moment.",
      "Fondu court entre les écrans (sauf si le téléphone demande moins d'animations).",
      "Page de l'équipe : tableau de bord avec les chiffres clés (visites du mois, total, signalements à traiter, version en ligne)."
    ]
  },
  {
    v: 23,
    date: "2026-10-12",
    titre: "Finitions selon les règles de design d'Apple",
    nouveautes: [
      "Une seule police, celle du téléphone (SF Pro sur iPhone), avec une échelle de tailles claire.",
      "Accueil plus aéré : le grand titre est posé sur le fond, le bouton « Ouvert maintenant » porte l'action.",
      "Titres de section en gras (« Je cherche… ») au lieu de petites capitales espacées.",
      "Listes de lieux façon iPhone : séparateurs fins, statut en texte coloré, bouton d'appel rond et vert.",
      "« Appeler » est vert partout, y compris sur la page des urgences ; ombres plus légères ; barre d'onglets plus fine."
    ]
  },
  {
    v: 22,
    date: "2026-10-12",
    titre: "Liquid Glass en noir et blanc",
    nouveautes: [
      "Même verre transparent, en noir et blanc : fond gris clair et blanc (noir profond en mode sombre).",
      "Boutons, onglet choisi, pastilles des besoins et logo en noir (en blanc en mode sombre).",
      "Seules couleurs gardées, parce qu'elles ont un sens : vert pour « Ouvert » et « Appeler », rouge pour « Quitter » et les numéros d'urgence ; les repères de la carte gardent la couleur de leur besoin.",
      "Page de l'équipe et icône de l'engrenage au même style noir et blanc."
    ]
  },
  {
    v: 21,
    date: "2026-10-12",
    titre: "Liquid Glass, comme sur iPhone",
    nouveautes: [
      "Tout est en verre transparent : cartes, besoins, boutons, filtres, bandeaux, listes, menus, en-tête, barre d'onglets et boutons de la carte.",
      "Nouveau fond coloré (bleu, lilas, pêche, menthe, rose) qu'on voit à travers le verre ; fond profond en mode sombre.",
      "Couleurs système d'Apple : boutons bleus, « Appeler » vert, « Quitter » rouge ; l'onglet choisi est une lentille de verre.",
      "Titres en police système (celle de l'iPhone) ; le texte reste en Atkinson Hyperlegible pour bien se lire.",
      "Page de l'équipe au même style. Tous les textes ont été vérifiés lisibles sur le verre, en clair et en sombre."
    ]
  },
  {
    v: 20,
    date: "2026-10-12",
    titre: "Nouveau look : verre et lumière",
    nouveautes: [
      "Style moderne façon iPhone : fond lumineux (lampe, prune, bleu), cartes en verre translucide avec reflets, coins plus arrondis.",
      "En-tête en verre dépoli et barre d'onglets flottante ; la carte va jusqu'en bas de l'écran, sous la barre.",
      "Page de l'équipe au même style, avec des onglets façon iOS (« À traiter », « Historique », « Statistiques »).",
      "Si le téléphone demande moins de transparence, tout redevient opaque ; le flou est réservé aux barres pour rester fluide sur les vieux téléphones."
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
