# Paladines

Appli web gratuite pour les femmes à la rue à Lille : les lieux ouverts maintenant, près d'elles (dormir, manger, se laver, se soigner, écoute en cas de violences…). On y arrive par QR code, sans compte. En ligne sur https://paladines.pages.dev (Cloudflare Pages, redéployé à chaque push sur `claude/homeless-women-aid-app-kg6mpg`).

## Fichiers
- `index.html` : en-tête, onglets, pictogrammes SVG. `js/app.js` : vues (routage par `#vue-param`), horaires, distances, carte, infos du moment. `js/i18n.js` : textes FR, EN, AR.
- `css/style.css`, puis `css/theme.css` (style « Nuit raffinée »), puis `css/verre.css` (« Liquid Glass » façon iOS 26 : redéfinit les jetons de theme.css, fond maillé coloré, verre transparent flouté partout, couleurs système Apple, onglets flottants ; opaque si « réduire la transparence »). Vérifier le contraste du texte sur le verre (clair et sombre) à chaque changement de couleur. `fonts/`, `icons/`, `vendor/` (Leaflet, qrcode).
- `data/lieux.js` : 56 lieux, 11 besoins, infos saisonnières, urgences. `data/coordonnees.js` : généré par `outils/geocoder.mjs` via `.github/workflows/positions.yml` (faire un pull avant de pousser).
- `functions/` (Cloudflare Pages Functions, stockage KV `SIGNALEMENTS`, voir README) : `equipe.js` = page de l'équipe `/equipe` protégée par `MOT_DE_PASSE` (onglets À traiter, Historique des signalements traités, Statistiques) ; `api/signalement.js` reçoit les signalements ; `api/visite.js` compte les visites par mois.
- `data/versions.mjs` : historique des versions et de leurs nouveautés, montré sur `/equipe`.
- `sw.js` (hors ligne), `manifest.webmanifest`, `_headers`, `affiche.html` (affiches QR), `docs/` (idées, lieux et sources, identité, kit Instagram).

## Technologies
HTML, CSS et JavaScript simples, sans framework ni compilation. PWA (service worker), Leaflet + OpenStreetMap, Base Adresse Nationale (positions des lieux), Open-Meteo (météo de Lille). Pas de tests dans le dépôt : vérifier dans un navigateur à 320 px, en arabe et en mode sombre.

## Choix importants (à respecter)
- Discrétion : le nom et le titre de l'onglet restent « Paladines », bouton « Quitter » toujours visible, aucun mot sensible dans les adresses de pages.
- Ne jamais montrer l'adresse d'un lieu protégé (`adresseMasquee`) ; ne jamais envoyer la position de la personne.
- Aucun compte, aucune statistique sur les personnes : seul un compteur anonyme de visites par mois (un téléphone une fois par jour, sans identifiant). Polices hébergées sur le site. Vouvoiement et langage respectueux.
- Tout nouveau texte va dans `js/i18n.js` en FR, EN et AR (arabe de droite à gauche ; numéros et adresses en `dir="ltr"`).
- Après toute modification d'un fichier mis en cache, augmenter `VERSION` dans `sw.js` et ajouter la version en haut de `data/versions.mjs` (titre et nouveautés en langage simple).
- Lisibilité : texte en Atkinson Hyperlegible (titres en police système), pictogrammes, cibles tactiles d'au moins 44 px, contraste AA même sur le verre.

## Terminé
Accueil « Ouvert maintenant, près de moi », 11 besoins et page « Pour les femmes », infos du moment (météo, plan hiver), listes et filtres, fiches, carte de tous les lieux, urgences, lieux gardés, réglages, signalements anonymes (fiche et « Signaler un problème », envoi différé sans internet), page de l'équipe (signalements à traiter et historique, versions, visites par mois), hors ligne, installation, affiches QR, identité (logo lanterne, style « Liquid Glass »), kit Instagram.

## Reste à faire
- Confirmer les 56 lieux par téléphone avant tout lancement (`docs/LIEUX-LILLE.md`).
- Faire relire l'anglais et l'arabe.
- Activer la réception des signalements dans Cloudflare (espace KV et mot de passe, voir README).
- Choisir un fournisseur de tuiles pour la carte et un service d'itinéraire (Google Maps pour l'instant).
- Tester avec des femmes concernées et des associations ; trancher les questions de `docs/IDEES.md`.
