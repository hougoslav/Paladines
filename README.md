# Paladines

Prototype d'application web pour les femmes à la rue, **à Lille** : en scannant un QR code,
elles arrivent sur une page qui montre **les lieux ouverts près d'elles** pour dormir, manger, se laver,
se soigner, se poser, trouver de l'écoute en cas de violences, des vêtements, une bagagerie,
une aide pour les papiers ou de quoi recharger son téléphone.

> ⚠️ **Prototype** : les 46 lieux sont de **vrais lieux de Lille**, relevés sur internet le
> 7 octobre 2026 (sources sur chaque fiche). Ils n'ont **pas encore été confirmés par téléphone** :
> c'est à faire avant tout lancement. La liste complète, à appeler, est dans
> [`docs/LIEUX-LILLE.md`](docs/LIEUX-LILLE.md).

Les idées, les choix et les questions à trancher en groupe sont dans
[`docs/IDEES.md`](docs/IDEES.md).

## Voir le prototype

**Le plus simple** : ouvrir `index.html` dans un navigateur (double-clic).
Tout marche, sauf le mode hors connexion et, parfois, le fond de carte.

**Comme sur un vrai site** (recommandé) : lancer un petit serveur dans le dossier, puis ouvrir
l'adresse indiquée.

```bash
npx serve .            # ou : python3 -m http.server 8000
```

Pour tester un QR code d'affiche : `http://localhost:3000/?pres=50.6366,3.0707&nom=Gare%20Lille%20Flandres`

## Ce qu'il y a dedans

```
index.html             la page de l'appli (en-tête, onglets, pictogrammes)
affiche.html           générateur d'affiches et d'autocollants avec QR code
css/style.css          toute la mise en forme (thème clair et sombre)
js/app.js              la logique : vues, horaires, distances, carte, réglages
js/i18n.js             les textes en français, anglais et arabe
data/lieux.js          les lieux de Lille, les catégories, l'alerte, les numéros d'urgence
data/coordonnees.js    positions GPS des lieux (générées par outils/geocoder.mjs)
outils/geocoder.mjs    calcule les positions GPS à partir des adresses
sw.js                  service worker : fonctionnement sans internet
manifest.webmanifest   pour installer l'appli sur l'écran d'accueil
vendor/                Leaflet (carte) et qrcode-generator, copiés ici pour marcher hors ligne
fonts/                 polices Atkinson Hyperlegible et Bricolage Grotesque (licence OFL)
icons/                 icônes de l'appli
docs/IDEES.md          idées, feuille de route, questions pour le groupe
docs/LIEUX-LILLE.md    les lieux de Lille, leurs sources, ce qui reste à vérifier
```

Pas de framework, pas d'étape de compilation : du HTML, du CSS et du JavaScript simples,
pour que tout le groupe puisse modifier le code.

## Modifier les données

Tout est dans [`data/lieux.js`](data/lieux.js). Un lieu ressemble à ceci :

```js
{
  id: "l02", cat: "dormir",
  autresCats: ["hygiene", "bagagerie"],      // le lieu apparaît aussi dans ces besoins
  nom: "Halte de nuit abej SOLIDARITÉ",
  adresse: "22 parvis Saint-Michel, 59000 Lille",
  lat: null, lng: null,                      // positions dans data/coordonnees.js
  tel: "03 66 19 09 30",
  horaires: { lun: [["21:00", "08:00"]], mar: [["21:00", "08:00"]] },  // ou "24/7", ou null
  horairesTexte: "Tous les soirs de 21h à 8h, 7 jours sur 7",          // texte de la source
  services: ["Un abri pour la nuit, dans une salle de repos."],
  conditions: "Pour les personnes sans abri. Les animaux sont acceptés.",
  criteres: { animaux: true, sansRdv: true },
  langues: [],
  adresseMasquee: false,   // true : jamais sur la carte (lieux protégés)
  verifie: "2026-10-07",   // date du relevé
  sources: ["https://abej-solidarite.fr/structure/halte-de-nuit/"]
}
```

- Une plage qui finit avant de commencer (`["21:00", "08:00"]`) passe minuit.
- `horaires: null` : l'appli affiche « appeler avant » et le texte de la source.
- `adresseGeo` (facultatif) : adresse simplifiée pour le calcul de la position, quand
  l'adresse affichée contient des précisions (« cour de la mairie de quartier… »).
- Catégories possibles : `dormir`, `manger`, `hygiene`, `sante`, `accueil`, `ecoute`,
  `vetements`, `bagagerie`, `droits`, `recharge`.
- Pour changer de ville : modifier `ville` (centre de la carte) en haut du fichier.

## Positions GPS des lieux

La carte et le tri par distance ont besoin de la position de chaque lieu. Depuis le dossier
du projet, sur un ordinateur avec internet (Node 18 ou plus) :

```bash
node outils/geocoder.mjs
```

Le script cherche chaque adresse dans la **Base Adresse Nationale** (service public gratuit)
et écrit `data/coordonnees.js`. À relancer après chaque changement d'adresse.
Tant que ce fichier est vide, l'appli fait ce calcul elle-même au premier chargement et
le garde sur le téléphone.
- Pour le bandeau d'alerte : `alerte.actif` à `true` ou `false`.

## Ajouter une langue

Copier le bloc `en` de [`js/i18n.js`](js/i18n.js), le traduire, puis ajouter le code de la
langue dans `LANGUES` (début de `js/app.js`) et un bouton dans le menu de langue
(`index.html`). Un texte manquant s'affiche en français.

## Mettre le site en ligne

Avec **GitHub Pages** (gratuit) : dans le dépôt GitHub, *Settings → Pages*, choisir la branche
et le dossier racine. Le site sera à une adresse du type
`https://<compte>.github.io/Paladines/`. C'est cette adresse à mettre dans `affiche.html`
pour générer les QR codes.

À chaque mise à jour, changer `VERSION` dans `sw.js` pour que les téléphones récupèrent
les nouveaux fichiers.

## En faire une appli de téléphone

1. **Dès maintenant (PWA)** : sur Android, Chrome propose « Installer l'application » ;
   sur iPhone, Safari → Partager → « Sur l'écran d'accueil ». L'appli a alors son icône,
   s'ouvre en plein écran et marche sans internet.
2. **Sur le Play Store** : [PWABuilder](https://www.pwabuilder.com/) transforme le site en
   paquet Android à partir de son adresse en ligne.
3. **Sur l'App Store et le Play Store** : [Capacitor](https://capacitorjs.com/) emballe ce
   même code dans une vraie appli native (il faut un Mac pour iOS et un compte développeur).

## Points à connaître

- Le fond de carte vient des serveurs d'OpenStreetMap, qui ne sont pas faits pour un usage
  intensif : pour un vrai lancement, passer par un fournisseur de tuiles (gratuit ou payant).
- « Itinéraire » ouvre Google Maps ; c'est un choix à discuter (voir `docs/IDEES.md`).
- « Signaler une erreur » n'envoie encore rien : il faudra un petit serveur ou un formulaire.
- Le calcul des positions dans l'appli envoie **les adresses des lieux** (jamais la position
  de la personne) au service de géocodage de l'IGN. Lancer `outils/geocoder.mjs` l'évite.
- Les traductions anglaise et arabe sont un premier jet, à faire relire.

## Crédits et licences

- Carte : [Leaflet](https://leafletjs.com/) (BSD-2) et données © contributeurs
  [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL)
- QR codes : [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) de Kazuhiko Arase (MIT)
- Polices : Atkinson Hyperlegible (Braille Institute) et Bricolage Grotesque, licence SIL Open Font
- Pictogrammes : dessinés pour le projet
