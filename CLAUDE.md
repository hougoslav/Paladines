# Paladines

Appli web gratuite pour les femmes à la rue à Lille : les lieux ouverts maintenant, près d'elles (dormir, manger, se laver, se soigner, écoute en cas de violences…). On y arrive par QR code, sans compte. En ligne sur https://paladines.pages.dev (Cloudflare Pages, redéployé à chaque push sur `claude/homeless-women-aid-app-kg6mpg`).

## Fichiers
- `index.html` : en-tête, onglets, pictogrammes SVG. `js/app.js` : vues (routage par `#vue-param`), horaires, distances, carte (lieu touché = carte simple en bas), guidage à pied (`#guide-<id>`), infos du moment. `js/chemins.js` : calcul d'itinéraire à pied sur le téléphone (A*, consignes, suivi). `js/i18n.js` : textes FR, EN, AR.
- `css/style.css`, puis `css/theme.css` (style « Nuit raffinée »), puis `css/verre.css` (le seul style : « Liquid Glass » bleu nuit et jaune, `data-theme="paladines"` sur `<html>`, même en mode clair du téléphone ; fond bleu nuit uni, verre transparent flouté ; peu de couleurs, primaires et franches : jaune = choisir/accent, vert = ouvert/appeler, rouge = quitter/urgence, bleu = itinéraire et position ; opaque si « réduire la transparence »). Pas de pastel, pas de dégradés colorés dans le fond. Vérifier le contraste du texte sur le verre à chaque changement de couleur. `fonts/`, `icons/`, `vendor/` (Leaflet, MapLibre, qrcode).
- `data/lieux.js` : 56 lieux, 11 besoins, infos saisonnières, urgences. `data/coordonnees.js` : généré par `outils/geocoder.mjs` via `.github/workflows/positions.yml` (faire un pull avant de pousser). `data/chemins.json` : rues et chemins à pied de Lille pour le guidage hors ligne, généré chaque mois par `outils/chemins.mjs` via `.github/workflows/chemins.yml` (extrait Geofabrik + osmium) ; gardé par le service worker dans un cache à part. `data/equipements.js` : toilettes, eau potable, lieux sûrs (police nationale, urgences), généré par `outils/equipements.mjs` dans la même tâche mensuelle.
- `functions/` (Cloudflare Pages Functions, stockage KV `SIGNALEMENTS`, voir README) : `equipe.js` = page de l'équipe `/equipe` protégée par `MOT_DE_PASSE` (onglets À traiter, Historique des signalements traités, Lieux = corrections et ajouts dessinés par `js/equipe.js`, Statistiques avec les avis) ; `api/signalement.js` reçoit les signalements ; `api/visite.js` compte les visites par mois ; `api/corrections.js` donne à l'appli les corrections (`correction:<id>`) et lieux ajoutés (`ajout:<id>`) ; `api/avis.js` compte les « Ce lieu vous a aidée ? » (`avis:<lieu>:AAAA-MM`).
- `data/versions.mjs` : historique des versions et de leurs nouveautés, montré sur `/equipe`.
- `sw.js` (hors ligne), `manifest.webmanifest`, `_headers`, `affiche.html` (affiches QR), `pro.html` (guide imprimable pour les professionnelles), `docs/` (idées, lieux et sources, identité, kit Instagram).

## Technologies
HTML, CSS et JavaScript simples, sans framework ni compilation. PWA (service worker), Leaflet + fond de carte OpenFreeMap « Positron » (vectoriel, gratuit, sans clé, via MapLibre chargé à l'ouverture de la carte ; tuiles OpenStreetMap en secours ; CARTO et Stadia demandent une clé), Base Adresse Nationale (positions des lieux), Open-Meteo (météo de Lille). Pas de tests dans le dépôt : vérifier dans un navigateur à 320 px et en arabe.

## Choix importants (à respecter)
- Aller droit au but : listes avec « Près de moi » (tri par distance, GPS seulement), « Ouvert maintenant » et le reste dans « Plus de filtres ». Pas de repères « Je suis près de… » ni de position posée sur la carte.
- Discrétion : le nom et le titre de l'onglet restent « Paladines », bouton « Quitter » toujours visible, aucun mot sensible dans les adresses de pages.
- Ne jamais montrer l'adresse d'un lieu protégé (`adresseMasquee`) ni y guider (guidage vers le lieu public `acces`) ; ne jamais envoyer la position de la personne (le guidage est calculé sur le téléphone ; voix coupée par défaut).
- Aucun compte, aucune statistique sur les personnes : seuls un compteur anonyme de visites par mois (un téléphone une fois par jour, sans identifiant) et les avis Oui/Non par lieu et par mois. Polices hébergées sur le site. Vouvoiement et langage respectueux.
- Tout nouveau texte va dans `js/i18n.js` en FR, EN et AR (arabe de droite à gauche ; numéros et adresses en `dir="ltr"`).
- Après toute modification d'un fichier mis en cache, changer `VERSION` dans `sw.js` (`paladines-v<version>.<révision>`, ex. `paladines-v21.0` : augmenter la révision, nom jamais utilisé avant) ; pour une nouvelle version, l'ajouter en haut de `data/versions.mjs` (titre et nouveautés en langage simple). Les versions v20 à v28 ont été réunies dans la v20.
- Lisibilité : police système du téléphone (SF Pro sur iPhone, Roboto sur Android), échelle de tailles d'Apple (34/28/20/17/15/13/11), pictogrammes, cibles tactiles d'au moins 44 px, contraste AA même sur le verre. Même action = même apparence (« Appeler » toujours vert).

## Terminé
Accueil « Ouvert maintenant, près de moi », 11 besoins et page « Pour les femmes », infos du moment (météo, plan hiver), listes et filtres, fiches, carte de tous les lieux, urgences, lieux gardés, réglages, signalements anonymes (fiche et « Signaler un problème », envoi différé sans internet), page de l'équipe (signalements à traiter et historique, versions, visites par mois), hors ligne, installation, affiches QR, identité (logo lanterne, style « Liquid Glass » bleu nuit et jaune), refonte v21 (listes épurées, infos en fiches, carte épurée), guidage à pied hors ligne (v22), toilettes, eau, lieux sûrs et écran « Je ne me sens pas en sécurité » `#aide` (v23), corrections des lieux par l'équipe et avis anonymes (v24), carnet `#carnet` (gardé sur le téléphone, effaçable par « Quitter »), lecture facile, guide pour les pros `pro.html` (v25), kit Instagram.

## Reste à faire
- Confirmer les 56 lieux par téléphone avant tout lancement (`docs/LIEUX-LILLE.md`).
- Faire relire l'anglais et l'arabe.
- Activer la réception des signalements dans Cloudflare (espace KV et mot de passe, voir README).
- Tester avec des femmes concernées et des associations ; trancher les questions de `docs/IDEES.md`.
