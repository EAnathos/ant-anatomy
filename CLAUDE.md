# CLAUDE.md

Atlas anatomique interactif de la fourmi, avec deux planches choisies sur l'accueil : ouvrière de *Neoponera verenae*
(vue latérale) et aile antérieure de reine d'*Odontomachus* sp. Deux modes de jeu :
**Trouver** (un nom est donné, on clique la structure) et **Nommer** (on clique une structure, on tape son nom).
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
- `index.html` redirige vers `/en/` si l'anglais a été choisi (`localStorage.lang`) ou si le navigateur n'est pas en
  français et qu'aucun choix n'est mémorisé. Le sélecteur FR / EN de l'en-tête mémorise le choix.
- Textes d'interface : `const T = t({ ...fr }, { ...en })` dans chaque composant. `en` doit avoir la forme exacte de `fr`
  (`NoInfer`), le typecheck signale toute clé manquante. Pas de bibliothèque d'i18n.
- Données : `parts.ts` reste la référence en français ; toute structure ajoutée doit l'être aussi dans `parts.en.ts`
  (sinon le typecheck échoue). Les tests vérifient que chaque définition est traduite et qu'aucun nom ou synonyme n'est
  partagé par deux structures d'une même planche, dans chaque langue.
- Anglais : pluriels latins en synonymes (*femur/femora*, *coxa/coxae*), termes de AntWiki.

## Stack

React 19 + TypeScript (strict) + Vite. CSS natif, sans framework ni CSS-in-JS. Pas de routeur :
la navigation est un état `Screen` dans `src/App.tsx`.

## Structure

- `src/assets/ant.svg` (ouvrière) et `src/assets/wing.svg` (aile) : **sources uniques des dessins**. Importés en `?raw`
  et injectés par `AntPlate` selon la planche (`PlateId`).
- `src/i18n.ts` : langue de la page (`LANG`, lue dans `<html lang>`), helper `t(fr, en)`, URLs des langues.
- `src/data/parts.en.ts` : traduction anglaise des planches, régions et structures (`Record` par id).
- `src/data/parts.ts` : planches, régions (chacune rattachée à une planche), structures (nom, région, définition,
  synonymes). Source unique des données. Les id de structures et de régions sont uniques toutes planches confondues.
- `src/lib/answers.ts` : normalisation et validation des réponses tapées.
- `src/lib/session.ts` : réglages (dont la planche choisie), tirage des questions, bilan (score, série, erreurs).
- `src/components/AntPlate.tsx` : planche interactive (clic, clavier, états visuels).
- `src/screens/` : `Home`, `FindMode`, `NameMode`, `Results`.
- `index.html` : balises d'aperçu des liens (Open Graph, Twitter) pointant vers `public/og.png` (1200×630, les deux planches
  et le titre aux polices de la charte). Régénérer l'image si les planches ou le concept changent.
- `src/styles/tokens.css` : tokens de la charte. `src/styles/global.css` : tous les styles.

## Planche SVG : règles

Les règles ci-dessous valent pour la planche de l'ouvrière. La planche de l'aile (`wing.svg`) est un dessin de
l'utilisateur (EAnathos), sous licence CC BY-NC 4.0 affichée sous le texte de l'accueil, qu'on peut retoucher. Ses `id` internes sont préfixés `aile-` pour éviter les
collisions une fois injectés dans la page.

- Deux régions seulement, `cellules` et `nervures`, choisies comme les autres régions dans les paramètres de session
  (l'une, l'autre ou les deux). Le titre et l'accroche de l'accueil suivent ce choix.
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
- Au repos, la planche garde les couleurs d'origine (style inline), sauf le gastre (tergites, sternites, pygidium)
  passé au même gris que le propodéum (`#d6d6d6`) à la demande de l'utilisateur. `AntPlate` pose `data-state`
  (`rest | sel | ok | ko | done | off`) et `data-hover`, et `global.css` les colore avec `!important`.
- Ajouts au dessin d'origine : une grille hexagonale d'ommatidies dans l'œil (découpée par `clipPath`, sans
  `pointer-events`) et une marge de 6 unités dans le `viewBox` pour que l'antenne gauche ne soit pas rognée.
- Griffes : dans l'original, elles forment un seul tracé avec le dernier article du tarse. Chacune est doublée par
  un tracé `data-part="griffe"` (même géométrie, même couleur) plus un contour sans `data-part` posés par-dessus.
- Petites structures (éperons, spiracle, griffes) : un tracé transparent à contour épais (`stroke:transparent`)
  avec le même `data-part` élargit la zone cliquable.
- Éléments décoratifs (ombre de fond, croissants noirs des coxas, trait de la joue, détail du propodéum, fémur
  postérieur caché derrière le gastre, bande entre le 1er et le 2e tergite) : pas de `data-part`, `pointer-events="none"`.
- Noms : au pluriel pour les structures présentes plusieurs fois sur la planche (Fémurs, Tergites…). La validation
  des réponses traite singulier et pluriel comme équivalents.
- Ajouter ou renommer une structure = modifier le SVG de la planche **et** `PartId` + `PARTS`.
  Le test `planche SVG` échoue, pour chaque planche, si les deux divergent.

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
- Noms de taxons en italique (*Formicidae*, *Myrmicinae*).
- Les définitions doivent rester exactes du point de vue myrmécologique. Le dessin n'a qu'un pétiole
  (pas de postpétiole) ; le gastre est découpé en tergites, sternites, pygidium et aiguillon.
  Sur l'aile, les cellules submarginales et subdiscoïdales sont numérotées de la base vers l'apex.

## Accessibilité

Cibles de 44 px minimum, contrastes AA, structures de la planche atteignables au clavier (Tab + Entrée/Espace),
messages de verdict dans des zones `aria-live`. Ne pas donner aux structures un `aria-label` qui révèle leur nom
(cela donnerait la réponse en mode Trouver).
