# Identité visuelle : les propositions

5 logos et 5 styles graphiques proposés le 8 octobre 2026, à comparer sur la page de choix
(captures, points forts et limites de chacun).

## Essayer un style sur son téléphone

Ajouter `?essai=` et la lettre du style à l'adresse du site :

| Style | Adresse à ouvrir |
| --- | --- |
| A · Nuit raffinée | <https://paladines.pages.dev/?essai=A> |
| B · Service public clair | <https://paladines.pages.dev/?essai=B> |
| C · Doux et chaleureux | <https://paladines.pages.dev/?essai=C> |
| D · Éditorial citron | <https://paladines.pages.dev/?essai=D> |
| E · Apaisant | <https://paladines.pages.dev/?essai=E> |

Le style ne change que pour cette adresse : l'appli normale reste comme elle est.

## Ce qu'il y a dans ce dossier

- `logos/` : chaque logo en SVG. `signe.svg` pour fond clair, `signe-clair.svg` pour fond
  sombre, `signe-mono.svg` en une couleur, `icone-appli.svg` pour l'icône du téléphone,
  `logo-horizontal*.svg` avec le nom (texte vectorisé, sans police à charger).
- `styles/` : chaque style est une feuille `theme.css` qui se charge **après** `css/style.css`,
  avec ses polices (licence SIL OFL).

## Adopter un style choisi

1. Copier `theme.css` et ses fichiers `.woff2` dans `css/`.
2. Ajouter `<link rel="stylesheet" href="css/theme.css">` juste après `css/style.css` dans
   `index.html`, puis ajouter ces fichiers à la liste `FICHIERS` de `sw.js` et changer `VERSION`.
3. Mettre la couleur de fond du style dans `<meta name="theme-color">` (index.html) et dans
   `manifest.webmanifest` (`theme_color`, `background_color`).
4. Retirer le petit script « Essai d'un style » de `index.html`.
