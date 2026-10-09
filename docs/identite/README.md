# Identité visuelle : les propositions

5 logos et 5 styles graphiques proposés le 8 octobre 2026, à comparer sur la page de choix
(captures, points forts et limites de chacun).

## Choix du groupe

**Logo 2, « La lanterne »** et **style A, « Nuit raffinée »**. Ils sont en place dans l'appli :
`css/theme.css` (style), logo dans l'en-tête de `index.html` et sur l'affiche, icônes dans
`icons/`. Les autres propositions restent ici pour mémoire.

## Ce qu'il y a dans ce dossier

- `logos/` : chaque logo en SVG. `signe.svg` pour fond clair, `signe-clair.svg` pour fond
  sombre, `signe-mono.svg` en une couleur, `icone-appli.svg` pour l'icône du téléphone,
  `logo-horizontal*.svg` avec le nom (texte vectorisé, sans police à charger).
- `styles/` : chaque style est une feuille `theme.css` qui se charge **après** `css/style.css`,
  avec ses polices (licence SIL OFL).
- `reseaux/` : la photo de profil Instagram (lanterne) et, dans `reseaux/instagram/`, les visuels
  pour présenter le projet (6 posts, 8 stories, 4 couvertures « À la une ») avec la bio, les
  légendes, les textes alternatifs et le calendrier dans `LISEZMOI.md`.
