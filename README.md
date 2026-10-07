# Paladines

Prototype d'application web pour les femmes à la rue : en scannant un QR code, elles arrivent
sur une page qui montre **les lieux ouverts près d'elles** pour dormir, manger, se laver,
se soigner, se poser, trouver de l'écoute en cas de violences, des vêtements, une bagagerie,
une aide pour les papiers ou de quoi recharger son téléphone.

> ⚠️ **Prototype** : tous les lieux sont **fictifs** (noms, adresses, téléphones en
> 01 99 00 xx xx, réservés à la fiction). Seuls les **numéros d'urgence nationaux** sont réels.

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

Pour tester un QR code d'affiche : `http://localhost:3000/?pres=48.8809,2.3553&nom=Gare%20du%20Nord`

## Ce qu'il y a dedans

```
index.html             la page de l'appli (en-tête, onglets, pictogrammes)
affiche.html           générateur d'affiches et d'autocollants avec QR code
css/style.css          toute la mise en forme (thème clair et sombre)
js/app.js              la logique : vues, horaires, distances, carte, réglages
js/i18n.js             les textes en français, anglais et arabe
data/lieux.js          les lieux, les catégories, l'alerte, les numéros d'urgence
sw.js                  service worker : fonctionnement sans internet
manifest.webmanifest   pour installer l'appli sur l'écran d'accueil
vendor/                Leaflet (carte) et qrcode-generator, copiés ici pour marcher hors ligne
fonts/                 polices Atkinson Hyperlegible et Bricolage Grotesque (licence OFL)
icons/                 icônes de l'appli
docs/IDEES.md          idées, feuille de route, questions pour le groupe
```

Pas de framework, pas d'étape de compilation : du HTML, du CSS et du JavaScript simples,
pour que tout le groupe puisse modifier le code.

## Modifier les données

Tout est dans [`data/lieux.js`](data/lieux.js). Un lieu ressemble à ceci :

```js
{
  id: "p01", cat: "dormir",
  nom: "Halte de nuit Les Veilleuses",
  adresse: "14 rue de l'Exemple, 75010 Paris",
  lat: 48.8762, lng: 2.3589,
  tel: "01 99 00 10 01",
  horaires: { lun: [["19:00", "08:00"]], mar: [["19:00", "08:00"]] },  // ou "24/7", ou null
  services: ["Lits pour la nuit", "Douches"],
  conditions: "Réservé aux femmes, avec ou sans enfants.",
  criteres: { femmes: true, enfants: true, animaux: false, gratuit: true,
              sansRdv: true, pmr: false, inconditionnel: true },
  langues: ["fr", "en", "ar"],
  adresseMasquee: false,   // true : jamais sur la carte (centres pour victimes de violences)
  verifie: "2026-09-28"    // date de la dernière vérification
}
```

- Une plage qui finit avant de commencer (`["19:00", "08:00"]`) passe minuit.
- Catégories possibles : `dormir`, `manger`, `hygiene`, `sante`, `accueil`, `ecoute`,
  `vetements`, `bagagerie`, `droits`, `recharge`.
- Pour changer de ville : modifier `ville` (centre de la carte) en haut du fichier.
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
- Les traductions anglaise et arabe sont un premier jet, à faire relire.

## Crédits et licences

- Carte : [Leaflet](https://leafletjs.com/) (BSD-2) et données © contributeurs
  [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL)
- QR codes : [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) de Kazuhiko Arase (MIT)
- Polices : Atkinson Hyperlegible (Braille Institute) et Bricolage Grotesque, licence SIL Open Font
- Pictogrammes : dessinés pour le projet
