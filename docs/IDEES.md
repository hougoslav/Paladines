# Paladines : idées, choix et suite du projet

Ce document accompagne le prototype. Il sert de base de discussion pour le groupe :
ce qui est déjà dans l'appli, les idées ajoutées et pourquoi, ce qui reste à décider.

## Le principe en une phrase

Une femme à la rue scanne un QR code (affiche, autocollant, carte donnée par une maraude)
et arrive, sans rien installer ni créer de compte, sur une page qui lui montre **les lieux
ouverts maintenant, près d'elle**, pour dormir, manger, se laver, se soigner ou être aidée.

## Ce que fait déjà le prototype

| Fonction | Où la voir |
| --- | --- |
| Accueil avec 10 besoins en pictogrammes et le nombre de lieux ouverts pour chacun | `#accueil` |
| Bouton « Ouvert maintenant, près de moi » : tous les lieux ouverts, triés par distance | `#proche` |
| Liste par besoin, avec filtres et statut en direct (ouvert, ferme bientôt, ouvre demain à 9 h) | `#cat-dormir`, etc. |
| Fiche d'un lieu : horaires de la semaine, services, conditions, langues parlées, itinéraire, appel | `#lieu-p01` |
| Carte des lieux (OpenStreetMap), filtrable par besoin et « ouvert maintenant » | `#carte` |
| Numéros d'urgence nationaux, avec explication de chacun | `#urgences` |
| Infos pratiques : 115, violences, santé gratuite, règles, domiciliation, papiers, sécurité | `#infos` |
| Lieux gardés (favoris), disponibles sans internet | `#favoris` |
| Réglages : langue, taille du texte, clair / sombre, installation, effacement des données | `#reglages` |
| Générateur d'affiches et d'autocollants avec QR code | `affiche.html` |

## Les idées ajoutées, et pourquoi

### Sécurité des femmes victimes de violences

1. **Bouton « Quitter » toujours visible.** Un appui remplace l'appli par une page météo
   (sur ordinateur : deux fois Échap). Beaucoup de femmes à la rue fuient des violences et
   leur téléphone peut être surveillé.
2. **Historique neutre.** Le titre de l'onglet reste « Paladines » et les adresses de pages ne
   contiennent pas de mots sensibles (`#cat-ecoute` et non `#violences`).
3. **Adresses confidentielles.** Les centres qui hébergent des victimes ne sont jamais placés
   sur la carte. L'adresse est donnée par téléphone, comme le font les associations.
4. **Conseils de sécurité** : effacer l'appel au 3919 de l'historique, navigation privée.
5. **SMS au 114** mis en avant pour celles qui ne peuvent pas parler (agresseur à côté).

### Accès pour toutes

6. **Aucun compte, aucune donnée envoyée.** La position reste sur le téléphone. Pas d'outil de
   statistiques, polices hébergées sur le site (pas d'appel à Google), `no-referrer`.
7. **Fonctionne sans internet** une fois ouverte (PWA) et **s'installe sans passer par un store**.
   Les forfaits et les batteries sont souvent limités.
8. **Plusieurs langues**, dont l'arabe (écriture de droite à gauche), détectées
   automatiquement et changeables en un geste depuis l'en-tête.
9. **Lecture à voix haute** des fiches, pour celles qui lisent difficilement le français.
10. **Pictogrammes partout**, police **Atkinson Hyperlegible** (conçue pour les personnes
    malvoyantes), taille du texte réglable, cibles tactiles de 48 px.
11. **Mode sombre** qui économise la batterie sur les écrans OLED.

### Des infos utiles et fiables

12. **Statut en direct**, y compris pour les haltes de nuit dont les horaires passent minuit.
13. **Filtres pensés pour la rue** : femmes uniquement, enfants acceptés, **animaux acceptés**
    (beaucoup de femmes refusent un hébergement pour ne pas abandonner leur chien),
    **sans condition de papiers**, sans rendez-vous, accessible en fauteuil.
14. **Besoins souvent oubliés** : protections périodiques, bagagerie (garder ses affaires et ses
    papiers), recharge du téléphone et wifi, domiciliation (adresse postale).
15. **Date de vérification** sur chaque fiche et **« Signaler une erreur »**, avec le choix
    « J'ai été mal accueillie » pour repérer les lieux où les femmes ne se sentent pas en sécurité.
16. **Le bon numéro au bon endroit** : rappel du 115 dans « Dormir », du 17, du 3919 et du 114
    dans « Violences ».
17. **Bandeau d'alerte saisonnière** (Plan Grand Froid, canicule) modifiable dans les données.
18. **Distance et temps de marche** estimé, puisque la plupart des déplacements se font à pied.

### Les QR codes eux-mêmes

19. **Un QR code qui sait où il est collé.** Le lien contient la position de l'affiche
    (`?pres=48.8809,2.3553&nom=Gare du Nord`). Même si la femme refuse le GPS, la liste est
    triée depuis l'affiche.
20. **Affiche à languettes détachables** avec le 115 et le 3919, pour celles qui n'ont pas de
    smartphone ou plus de batterie.
21. **Format autocollant** de 10 cm pour l'intérieur des portes de toilettes : un des rares
    endroits où une femme est seule et peut scanner sans être vue.
22. **Entraide** : envoyer un lieu à une amie par SMS.

## Ce que la recherche sur Lille a montré

- Il n'y a **pas de halte de nuit en accès direct réservée aux femmes** à Lille : les places
  pour femmes passent par le 115.
- **Aucun point public de distribution de protections périodiques** pour les femmes à la rue
  n'a été trouvé. C'est un manque concret sur lequel le projet pourrait agir (partenariat avec
  une association, une pharmacie, la Ville).
- Les **bains-douches municipaux ont fermé** : les douches sont dans les accueils de jour.
- **Peu de repas le soir et le week-end.**
- Beaucoup d'**horaires se contredisent** d'une source à l'autre : l'appli ne montre « ouvert »
  que sur les heures communes à toutes les sources. Appeler chaque lieu est indispensable.

## Où coller les QR codes ?

- Toilettes pour femmes des gares, centres commerciaux, bibliothèques, hôpitaux
- Laveries, pharmacies, PMI, centres de planification familiale
- Distributions alimentaires, accueils de jour, maraudes (sous forme de petites cartes)
- Salles d'attente des urgences, commissariats, mairies
- Bus de nuit et grandes stations de métro (avec l'accord des transporteurs)

Penser à demander l'autorisation des lieux, et à noter où chaque affiche est collée pour
pouvoir la remplacer.

## Idées pour plus tard

- **Places disponibles ce soir**, en lien avec le 115 / SIAO ou les centres partenaires.
- **Espace associations** : chaque structure met à jour ses horaires et ses fermetures
  exceptionnelles (vacances, travaux, Plan Grand Froid).
- **Version SMS ou serveur vocal** pour les téléphones sans internet : envoyer « DORMIR » à un
  numéro et recevoir les 3 lieux ouverts les plus proches.
- **Statistiques anonymes par affiche** (nombre de scans, sans aucune donnée personnelle) pour
  savoir quelles affiches servent et montrer l'impact aux financeurs.
- **Avis des femmes** sur l'accueil reçu (modérés), pour signaler les lieux bienveillants.
- **Appli native avec icône discrète** (par exemple une icône « Notes » ou « Météo »).
- **Notifications** (avec accord) : alerte grand froid, distribution exceptionnelle.
- **Plus de langues** : dari, pachto, tigrinya, ukrainien, roumain, espagnol. Traduire aussi les
  fiches des lieux.
- **Points d'eau potable et toilettes publiques**, depuis les données ouvertes des villes.
- **Vétérinaires solidaires** et lieux qui gardent les animaux.
- **Hébergement citoyen** (réseaux de particuliers qui accueillent).

## Sources de données possibles

Le prototype contient **46 vrais lieux de Lille**, relevés sur internet en octobre 2026 et
contre-vérifiés, mais **pas encore confirmés par téléphone**. La liste, les sources et ce qui
reste à vérifier sont dans [`LIEUX-LILLE.md`](LIEUX-LILLE.md).

Pour les tenir à jour :

- **L'annuaire Solidarités de la Ville de Lille** ([solidarites.lille.fr](https://solidarites.lille.fr/))
  est la source la plus complète et la plus à jour pour Lille. Un partenariat avec le CCAS
  serait idéal.
- **Soliguide** (association Solinum) couvre la métropole de Lille et propose une API à ses
  partenaires : à contacter.
- **Les guides de la CMAO** (115, Samu social, SIAO de la métropole) et le guide « Info sans
  abris » de la Métropole.
- **Données ouvertes** de la Ville et de la Métropole (toilettes publiques, points d'eau).
- **Partenariats locaux** : SIAO / 115, CCAS, associations féministes, Restos du cœur,
  Samu social, CIDFF, Planning familial.
- Vérifier les **licences** de chaque source avant de réutiliser les données.

Quelle que soit la source, il faut une personne ou une structure qui **vérifie et met à jour**
les infos régulièrement. Une info fausse (un lieu fermé, une heure erronée) peut coûter une
nuit dehors.

## Questions à trancher en groupe

1. **Tutoiement ou vouvoiement ?** Le prototype vouvoie, par respect. Certaines associations
   tutoient pour être plus proches.
2. **Lille est choisie.** Par quel quartier commencer les affiches ? (Gare Lille Flandres,
   Wazemmes, Fives, Moulins… où sont les accueils de jour.)
3. **Qui met à jour les données**, à quelle fréquence, et comment ?
4. **Quelles langues** en priorité, selon les publics rencontrés ?
5. **Nom de l'appli** : « Paladines » est-il assez discret sur un écran d'accueil ?
6. **Itinéraire** : Google Maps (installé partout) ou une solution plus respectueuse de la vie
   privée ?
7. **Hébergement du site** : Cloudflare Pages pour l'instant (gratuit,
   <https://paladines.pages.dev>). Passer plus tard à un hébergeur en Europe ?
8. **Avec qui tester ?** L'idéal est de construire l'appli **avec** des femmes concernées et
   des travailleuses sociales : entretiens, tests du prototype sur le terrain.

## Feuille de route proposée

1. **Prototype** (ici) : valider le principe et l'interface en groupe.
2. **Pilote** : vraies données pour un quartier ou une ville, 10 à 20 affiches, tests avec
   des femmes et des associations, corrections.
3. **Espace associations** pour la mise à jour des lieux.
4. **Applis Android et iOS** à partir du même code (voir le README), si le besoin se confirme.
