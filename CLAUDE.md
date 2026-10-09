# CLAUDE.md

Atlas anatomique interactif de la fourmi, avec six planches choisies sur l'accueil : ouvrière de *Neoponera verenae*
(vue latérale), puis tête, mandibule, antenne et patte (vues composites), et enfin aile antérieure de reine
d'*Odontomachus* sp. Trois modes de jeu :
**Trouver** (un nom est donné, on clique la structure), **Nommer** (on clique une structure, on tape son nom) et
**Relier** (associer des mots à leur définition, par séries de 5, avec les structures de la planche ou tout le glossaire).
Interface bilingue : français sur `/`, anglais sur `/en/`.

## Commandes

```bash
npm run dev        # serveur de dev Vite (http://localhost:5173)
npm run build      # typecheck + build de production dans dist/
npm run typecheck  # tsc --noEmit
npm test           # tests Vitest (logique + cohérence SVG/données)
```

Lancer `npm run typecheck && npm test` avant de considérer un changement terminé.

## Déploiement

Site 100 % statique publié sur GitHub Pages (https://ant-anatomy.anathos.me). Tout push sur `main` qui passe
la CI (`.github/workflows/ci.yml`) est déployé automatiquement par la CD (`.github/workflows/cd.yml`, déclenchée par
`workflow_run` sur la réussite de la CI) : ne pousser sur `main` que du code prêt à être en ligne. Le domaine est réglé dans les paramètres Pages du dépôt, pas via un fichier `CNAME`.

## Langues

- Deux pages HTML : `index.html` (fr) et `en/index.html` (en), déclarées dans `vite.config.ts` (`build.rollupOptions.input`).
  Chacune porte son `lang`, ses balises d'aperçu et son image (`public/og.png`, `public/og-en.png`). Garder les deux
  fichiers alignés quand on modifie le `<head>`.
- Le lien de langue transmet la planche choisie (`?planche=antenne`, `PLATE_PARAM`) ; `App` la lit au démarrage puis
  retire le paramètre de l'adresse. Le glossaire passe par son ancre (`#glossaire` / `#glossary`).
- `index.html` redirige vers `/en/` si l'anglais a été choisi (`localStorage.lang`) ou si le navigateur n'est pas en
  français et qu'aucun choix n'est mémorisé. Le sélecteur FR / EN de l'en-tête mémorise le choix.
- Textes d'interface : `const T = t({ ...fr }, { ...en })` dans chaque composant. `en` doit avoir la forme exacte de `fr`
  (`NoInfer`), le typecheck signale toute clé manquante. Pas de bibliothèque d'i18n.
- Données : `parts.ts` reste la référence en français ; tout terme ajouté doit l'être aussi dans `parts.en.ts`
  (sinon le typecheck échoue). Les tests vérifient que chaque définition est traduite et qu'aucun nom ou synonyme n'est
  partagé par deux structures d'une même planche, dans chaque langue.
- Anglais : pluriels latins en variantes (*femur/femora*, *coxa/coxae*), termes de AntWiki.

## Stack

React 19 + TypeScript (strict) + Vite. CSS natif, sans framework ni CSS-in-JS. Pas de routeur :
la navigation est un état `Screen` dans `src/App.tsx`. Chaque écran entre en fondu avec le pied de page (`#root > main`,
`.page-footer`, remonté à chaque écran) ; une partie commence par l'écran de lancement `Launch` (nom du mode, barre
ambre), le jeu et le pied de page n'étant montés qu'au début de son effacement, pour que le chronomètre parte au bon
moment. Animations coupées si `prefers-reduced-motion`.

## Structure

- `src/assets/ant.svg` (ouvrière), `src/assets/wing.svg` (aile) et `src/assets/head.svg` (tête), `src/assets/mandible.svg` (mandibule), `src/assets/antenna.svg`
  (antenne), `src/assets/leg.svg` (patte) :
  **sources uniques des dessins**. Importés en `?raw`
  et injectés par `AntPlate` selon la planche (`PlateId`). L'ouvrière est incluse dans le code principal (planche affichée
  à l'arrivée) ; les autres sont chargées à la demande (`import()` dans `LOADERS`, un fichier par dessin) et
  préchargées quand le navigateur est libre. Ajouter une planche = ajouter son chargeur dans `LOADERS`.
- `src/i18n.ts` : langue de la page (`LANG`, lue dans `<html lang>`), helper `t(fr, en)`, URLs des langues.
- `src/data/parts.en.ts` : traduction anglaise des planches, régions et termes (`Record` par id).
- `src/data/parts.ts` : source unique des données, en deux couches. Pas d'abréviations : elles varient d'un auteur à
  l'autre (Bolton, Keller, Snodgrass…).
  - `TERMS_FR` : dictionnaire des termes (nom, définition, synonymes, variantes), une entrée par terme, quelle que soit
    la planche. `synonyms` : vrais synonymes seulement, affichés dans le glossaire (pas de pluriel, de numérotation ni
    de mot voisin). `variants` : autres formes acceptées comme réponse sans être affichées (singulier/pluriel,
    « 1re submarginale », notation « m1 », forme latine ou anglaise). En anglais, les variantes ne sont pas héritées
    du français.
  - `REGIONS_FR` et `LAYOUT` (termes de chaque région, dans l'ordre de la légende). Une seule région par planche,
    portant l'id de la planche, sauf l'aile (`cellules`, `nervures`), seule à proposer un choix de régions dans les
    paramètres ; l'indice de région (Trouver) et la région dans la légende de l'accueil ne s'affichent que là. Un terme peut figurer sur plusieurs planches, une fois par planche, ou sur aucune (glossaire
    seulement : termes de Bolton en attente d'une planche) ; le glossaire le liste une seule fois avec un lien par planche. Une structure (`Part`) = un terme placé dans une région ; `PartId` = `TermId`, donc
    toujours chercher une structure avec sa planche (`partIn(plate, id)`). `PLATE_NAMES_FR` / `PLATE_NAMES_EN` : nom d'un
    terme propre à une planche (singulier ou pluriel selon le nombre d'exemplaires dessinés). Une planche sans taxon
    (dessin composite) a un `detail` en romain à la place ; `PlateName` / `plateText` affichent son libellé.
  - `DETAIL_PLATES` : planche détaillée d'une structure de la vue d'ensemble (`tete` → planche `tete`,
    `mandibule` → planche `mandibule`, `antenne` → planche `antenne`, `patte` → planche `patte`).
    Sur l'accueil, la légende de la structure propose « Voir en détail », qui ouvre cette planche avec la structure
    sélectionnée et un zoom (`.plate-focus`) parti de l'endroit où elle se trouvait. À compléter à chaque planche détaillée. Les id de régions sont uniques toutes planches
    confondues.
- `src/lib/answers.ts` : normalisation et validation des réponses tapées.
- `src/lib/session.ts` : réglages (dont la planche choisie et `allPlates`), tirage des questions, bilan (score, série,
  erreurs). Une question est un couple `{ plate, id }` (`Question`) ; une réponse garde sa planche. Avec `allPlates`
  (« Planches : Toutes » dans les paramètres), Trouver tire dans toutes les planches et affiche la planche de chaque
  question, le bilan montre une planche par planche ratée, Nommer propose des onglets de planche (`sessionPlates`) et
  Relier pioche dans toutes les planches.
- `src/components/AntPlate.tsx` : planche interactive (clic, clavier, états visuels).
- `src/screens/` : `Home`, `FindMode`, `NameMode`, `MatchMode` (Relier ; le terme est masqué dans sa définition par
  `maskTerm` de `src/lib/quiz.ts`), `Results`, `Glossary` (tous les termes du dictionnaire par ordre
  alphabétique, avec définition, synonymes, recherche et lien « voir sur la planche » et bouton Quiz qui lance Relier sur tout le glossaire ; adresse `#glossaire` /
  `#glossary`, liens dans l'en-tête et le pied de page).
- `index.html` : balises d'aperçu des liens (Open Graph, Twitter) pointant vers `public/og.png` (1200×630, les deux planches
  et le titre aux polices de la charte). Régénérer l'image si les planches ou le concept changent.
- `src/styles/tokens.css` : tokens de la charte. `src/styles/global.css` : tous les styles.

## Planche SVG : règles

Les règles ci-dessous valent pour la planche de l'ouvrière. La planche de l'aile (`wing.svg`) est un dessin de
l'utilisateur (EAnathos), sous licence CC BY-NC 4.0 affichée sous le texte de l'accueil, qu'on peut retoucher. Ses `id` internes sont préfixés `aile-` pour éviter les
collisions une fois injectés dans la page.

- Deux régions, `cellules` et `nervures`, choisies dans les paramètres de session (l'une, l'autre ou les deux) : la
  seule planche à régions. Le titre et l'accroche de l'accueil suivent ce choix.
- Cellules : `data-part` sur des surfaces blanches sans contour, découpées par le `clipPath` du contour. Ptérostigma cliquable.
- Nervures : nomenclature de la figure de référence de l'utilisateur (aile antérieure de reine d'*Odontomachus* sp. :
  costa, sous-costale, radius, secteur radial et ses branches, média 1-4, cubitus 1-3, anales, transverses 2r-rs, 3r-rs,
  rs-m, m-cu, cu-a). Ce sont des traits, pas des surfaces : chaque segment a une paroi sombre décorative, un cœur
  `.nerv-core` (porte l'état, colorié via `stroke`), une zone de clic transparente `.nerv-hit`, et pour les nervures en
  trait simple (costa, radius le long du bord, 3r-rs) un `.nerv-halo` qui s'assombrit au surlignage. Toutes portent la
  classe `.nerv`, que les règles de remplissage (`fill`) de `global.css` excluent.

- Dessin : « Scheme ant worker anatomy-clean » (LadyofHats et Sophivorus, domaine public,
  https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg), crédité sous le texte de
  l'accueil (`Home.tsx`, champ `credit`) et dans le README. **Ne pas modifier le dessin** :
  seuls des attributs (`data-part`, `pointer-events`) et des tracés invisibles ou superposés à l'identique sont ajoutés.
- Chaque tracé cliquable porte `data-part="<id>"`, id identique à un `PartId` de `parts.ts`. Une structure peut
  compter plusieurs tracés (2 antennes, 6 pattes, segments du gastre) : `AntPlate` applique états, survol et focus
  à tous les tracés du même id, et ne rend focusable que le premier.
- Au repos, la planche garde les couleurs d'origine (style inline), sauf le gastre (tergites, sternites, pygidium, hypopygium)
  passé au même gris que le propodéum (`#d6d6d6`) à la demande de l'utilisateur. `AntPlate` pose `data-state`
  (`rest | sel | ok | ko | done | off`) et `data-hover`, et `global.css` les colore avec `!important`.
- Ajouts au dessin d'origine : une grille hexagonale d'ommatidies dans l'œil (découpée par `clipPath`, sans
  `pointer-events`) et une marge de 6 unités dans le `viewBox` pour que l'antenne gauche ne soit pas rognée.
- Structures fondues : sur cette vue d'ensemble, tête (avec lobe frontal, clypéus et œil), antennes et pattes (coxa à
  griffes) ne sont chacune qu'une structure (`tete`, `antenne`, `patte`) qui ouvre sa planche détaillée. Les tracés
  d'origine (griffes doublées par-dessus le tarse, zones de clic élargies des éperons et griffes) portent tous
  `data-part="patte"`.
- Petites structures (spiracle) : un tracé transparent à contour épais (`stroke:transparent`) avec le même
  `data-part` élargit la zone cliquable.
- Éléments décoratifs (ombre de fond, croissants noirs des coxas, trait de la joue, détail du propodéum, fémur
  postérieur caché derrière le gastre, bande entre le 1er et le 2e tergite) : pas de `data-part`, `pointer-events="none"`.
- Noms : au pluriel pour les structures présentes plusieurs fois sur la planche (Fémurs, Tergites…). La validation
  des réponses traite singulier et pluriel comme équivalents.
- Ajouter ou renommer une structure = modifier le SVG de la planche **et** `TermId` + `TERMS_FR` + `LAYOUT`.
  Le test `planche SVG` échoue, pour chaque planche, si les deux divergent.

## Planche de la mandibule : règles

`mandible.svg` : mandibule gauche triangulaire grande ouverte, vue dorsale, dessin composite d'après la figure 527 de
Bolton (1994) (proportions et ordre des dents, pas le trait). Base en col étroit au raccord droit, bord basal droit
puis coudé à la verticale, bord externe presque droit avec un dernier tronçon droit jusqu'à l'apex.

- Structures : lame, bords masticateur, basal, externe, angle basal, puis dents (apicale, préapicale, denticules,
  prébasale, basale) et diastème. Dents de l'apex vers la base : apicale, préapicale (t2), 3 denticules, t3 (sans nom,
  non cliquable : un clic sélectionne le bord masticateur), diastème en V, prébasale (t4), basale.
- Une silhouette grise sans `pointer-events` sous les surfaces évite les liserés entre dents et lame.
- Bords et diastème : des traits comme les nervures de l'aile (`.nerv-core` visible + `.nerv-hit` transparent), le
  diastème posé sur le tronçon en V du bord masticateur. Angle basal : cercle transparent, coloré à la sélection.
- Vue légendée : le bord masticateur est montré par une accolade de l'apex à l'angle basal, d'après un segment
  invisible du SVG (`data-extent-for`, `data-extent-tick` pour le sens des retours) que `plateLabels` dessine.
  Mécanisme générique, utilisable sur d'autres planches pour une structure longue.
- Trulleum retiré pour le moment, à la demande de l'utilisateur (le terme reste au glossaire).
- Dessin d'EAnathos sous licence CC BY-NC 4.0, comme l'aile : crédit sous le texte de l'accueil, LICENSE et README.

## Planche de la tête : règles

`head.svg` : deux têtes d'ouvrière de face, sans mandibules ni antennes, dessin composite d'EAnathos d'après les
figures 523 à 526 de Bolton (1994) (CC BY-NC 4.0). Formes décrites pour la moitié droite puis reflétées.
- A (gauche) : tête entière, lobes frontaux qui cachent l'insertion antennaire (dessinés en dernier), longues carènes
  frontales, scrobes en pointillés, bord occipital et coins occipitaux, trois ocelles sur le vertex (emprunt à la reine,
  la vue étant composite), clypéus en parties médiane et latérales.
- B (droite) : moitié antérieure (`clipPath` et pointillé de coupe), sans lobes frontaux : torulus (anneau),
  fossette antennaire, fossette tentoriale antérieure, sillon paraoculo-clypéal, carènes courtes, clypéus entier (une
  seule surface `clypeus`, sans partage en parties).
- Le fond de la tête est un décor : pas de structure
  « Tête » sur cette planche. Les structures des deux têtes (yeux, genas, clypéus…) forment une seule structure, au
  pluriel sur cette planche (`PLATE_NAMES_*`).
- Œil : l'intérieur porte `ommatidies` (grille de facettes découpée par un `clipPath`), le contour porte `oeil`
  (trait `.nerv-core` + `.nerv-hit`, on le choisit en touchant le bord). Genas sans contour propre ; contour de la
  tête redessiné par-dessus en décor. Le bord antérieur est fait de tronçons partagés avec les surfaces du clypéus.
- Coins occipitaux : tronçons arrondis du contour, en traits (`.nerv-core` + `.nerv-hit`) comme le bord occipital.
- Triangle frontal : sa base suit exactement la suture fronto-clypéale (sous-courbe de la suture).
- Scrobes (tête A) : leur bord interne est la carène frontale elle-même (même courbe), le trait de la carène le recouvre.
- Sur l'ouvrière, lobe frontal, clypéus et œil (ommatidies) sont fondus dans la structure `tete`, qui ouvre cette
  planche. Le sillon paraoculo-clypéal est cliquable sur les deux têtes.

## Planche de l'antenne : règles

`antenna.svg` : antenne gauche d'ouvrière isolée, vue latérale, dessin composite d'EAnathos (CC BY-NC 4.0). 12 articles :
scape (fin à la base, courbe, s'épaississant), coude d'environ 125°, funicule de 11 articles (pédicelle, 7 articles,
massue de 3 dont le dernier en ogive). Base : bulbe condylaire et col du bulbe.

- Structures : bulbe condylaire, col du bulbe, scape, pédicelle, funicule, massue.
- Le funicule comprend en réalité le pédicelle et la massue, mais un tracé n'a qu'un `data-part` : `funicule` est porté
  par les 7 articles du milieu, et la vue légendée montre son étendue complète par une accolade (`data-extent-for`).
- Chaque article est un tracé à contour ; dessinés de l'apex vers la base, chacun recouvre la base du suivant.
- Sur l'ouvrière, les deux antennes ne forment qu'une structure, `antenne` (« Antennes »), qui ouvre cette planche.

## Planche de la patte : règles

`leg.svg` : patte postérieure d'ouvrière, vue latérale, dessin composite d'EAnathos (CC BY-NC 4.0). Coxa en haut,
fémur presque horizontal, tibia descendant, tarse étalé vers l'avant ; articles dessinés de l'extrémité vers la base.
- Structures : coxa, trochanter, fémur, tibia, éperons, basitarse, tarse (articles 2 à 4), prétarse, griffes,
  arolium. Accolade `data-extent-for="tarse"` du basitarse au prétarse.
- Deux éperons à l'apex du tibia, sur sa face inférieure, sous le tarse : le grand en lame courbe pectinée (peigne
  sur le bord intérieur), le petit simple. Base enfoncée dans le tibia, éperons et peigne dessinés avant le tarse.
- Griffes en crochet recourbées vers le bas, arolium entre elles ; zones de clic élargies pour griffes et éperons.
- Sur l'ouvrière, toutes les parties des six pattes sont fondues dans `patte` (« Pattes »), qui ouvre cette planche.

## Charte graphique « planche cyanotype »

- Une seule encre : bleu de Prusse `--prusse` pour titres, traits et actions. Beaucoup de blanc.
- L'ambre est réservé à la sélection, au survol et aux indices.
- Vert mousse et terracotta uniquement pour les verdicts (correct / erreur), toujours avec un texte ou une icône.
- Polices : Hanken Grotesk (texte), DM Mono (étiquettes, chiffres). Boutons en pilule, cartes rayon 28, pas d'ombres.
- Toute couleur passe par une variable de `tokens.css`, jamais de valeur en dur dans les composants.
- La maquette de référence et la page « Charte graphique » sont sur le canvas Claude Design du projet.

## Conventions de contenu

- Textes d'interface en français (tutoiement) et en anglais.
- **Pas de tiret cadratin (—) dans les textes**, dans les deux langues : utiliser un point, une virgule, deux-points ou « · » selon le contexte.
- Italique pour les genres et les espèces seulement (*Eciton*, *Neoponera verenae*, *Odontomachus* sp.) ; les rangs
  au-dessus du genre (sous-famille, tribu, famille, ordre : Ponerinae, Dacetini, Formicidae, Hymenoptera) restent en romain.
- Les définitions doivent rester exactes du point de vue myrmécologique. Référence pour le corps : le glossaire de
  Bolton (1994, *Identification Guide to the Ant Genera of the World*, p. 191-201), à paraphraser, jamais recopier ;
  il ne couvre pas l'aile. Complément : Keller (2011, *A phylogenetic analysis of ant morphology*, Bull. AMNH 355),
  terminologie plus récente et plus stricte (sulcus/suture, lobe torulaire, aire supraclypéale…), citée dans les
  définitions quand elle diffère de Bolton. Noms de genres et d'espèces entre astérisques (`*Eciton*`) dans les données : `Rich`
  les rend en italique. Le dessin n'a qu'un pétiole
  (pas de postpétiole) ; le gastre est découpé en tergites, sternites, pygidium, hypopygium et aiguillon.
  Sur l'aile, les cellules submarginales et subdiscoïdales sont numérotées de la base vers l'apex.

## Accessibilité

Cibles de 44 px minimum, contrastes AA, structures de la planche atteignables au clavier (Tab + Entrée/Espace),
messages de verdict dans des zones `aria-live`. Ne pas donner aux structures un `aria-label` qui révèle leur nom
(cela donnerait la réponse en mode Trouver).
