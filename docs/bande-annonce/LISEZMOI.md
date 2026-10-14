# Bande-annonce de Paladines

`paladines-bande-annonce.mp4` : 64 secondes, 1920×1080, avec musique. La musique est fabriquée par
`musique.py`, donc libre de droits.

## Le contenu

1. « Chaque soir, à Lille, des femmes cherchent où dormir. »
2. « Dormir. Manger. Se laver. Être en sécurité. »
3. Le logo Paladines : « Les lieux ouverts maintenant, près de vous. »
4. De vrais écrans de l'appli, dans un téléphone :
   - l'accueil et « Ouvert maintenant, près de moi » ;
   - la carte et un lieu, avec ses trois gestes ;
   - le guidage à pied sans réseau ;
   - les toilettes, l'eau potable et les lieux sûrs ;
   - le bouton « Je ne me sens pas en sécurité ».
5. « 9 langues » : trois téléphones, en arabe, ukrainien et tigrinya.
6. « Sans compte. Gratuite. » : le bouton « Quitter ».
7. La fin : le QR code et paladines.pages.dev.

## La refaire après une mise à jour de l'appli

Il faut Node, Playwright, Python avec numpy et ffmpeg. Lancer l'appli en local
(http://localhost:8787), puis, depuis ce dossier :

    PW=<chemin de playwright> node captures.cjs   # écrans dans ecrans/
    python3 musique.py && ffmpeg -i musique-brute.wav -af "aecho=0.8:0.6:90|170|260:0.25|0.18|0.12,lowpass=f=9000,loudnorm=I=-18:TP=-2:LRA=9" -ar 48000 musique.wav
    PW=<chemin de playwright> node rendu.cjs      # 1 920 images dans images/
    ffmpeg -framerate 30 -i images/%05d.jpg -i musique.wav -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart paladines-bande-annonce.mp4

Les textes et le minutage se règlent dans `bande-annonce.html` (fonction `rendre(t)`).
Il faut aussi y copier `icons/icon.svg` (sous le nom `logo.svg`) et `vendor/qrcode/qrcode.js`.
