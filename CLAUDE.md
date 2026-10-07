# CLAUDE.md

Atlas anatomique interactif de la fourmi (ouvrière de *Neoponera verenae*, vue latérale). Deux modes de jeu :
**Trouver** (un nom est donné, on clique la structure) et **Nommer** (on clique une structure, on tape son nom).
Interface entièrement en français.

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

## Stack

React 19 + TypeScript (strict) + Vite. CSS natif, sans framework ni CSS-in-JS. Pas de routeur :
la navigation est un état `Screen` dans `src/App.tsx`.

## Structure

- `src/assets/ant.svg` : **source unique du dessin**. Importé en `?raw` et injecté par `AntPlate`.
- `src/data/parts.ts` : régions, structures (nom, région, définition, synonymes). Source unique des données.
- `src/lib/answers.ts` : normalisation et validation des réponses tapées.
- `src/lib/session.ts` : réglages, tirage des questions, bilan (score, série, erreurs).
- `src/components/AntPlate.tsx` : planche interactive (clic, clavier, états visuels).
- `src/screens/` : `Home`, `FindMode`, `NameMode`, `Results`.
- `src/styles/tokens.css` : tokens de la charte. `src/styles/global.css` : tous les styles.

## Planche SVG : règles

- Dessin : « Scheme ant worker anatomy-clean » (LadyofHats et Sophivorus, domaine public,
  https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg), crédité dans le pied de page
  (`Footer.tsx`) et le README. **Ne pas modifier le dessin** :
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
- Éléments décoratifs (ombre de fond, croissants noirs des coxas, trait de la joue, détail du propodéum, trochanters, fémur
  postérieur caché derrière le gastre, bande entre le 1er et le 2e tergite) : pas de `data-part`, `pointer-events="none"`.
- Noms : au pluriel pour les structures présentes plusieurs fois sur la planche (Fémurs, Tergites…). La validation
  des réponses traite singulier et pluriel comme équivalents.
- Ajouter ou renommer une structure = modifier `ant.svg` **et** `PartId` + `PARTS`.
  Le test `planche SVG` échoue si les deux divergent.

## Charte graphique « planche cyanotype »

- Une seule encre : bleu de Prusse `--prusse` pour titres, traits et actions. Beaucoup de blanc.
- L'ambre est réservé à la sélection, au survol et aux indices.
- Vert mousse et terracotta uniquement pour les verdicts (correct / erreur), toujours avec un texte ou une icône.
- Polices : Hanken Grotesk (texte), DM Mono (étiquettes, chiffres). Boutons en pilule, cartes rayon 28, pas d'ombres.
- Toute couleur passe par une variable de `tokens.css`, jamais de valeur en dur dans les composants.
- La maquette de référence et la page « Charte graphique » sont sur le canvas Claude Design du projet.

## Conventions de contenu

- Textes d'interface en français, tutoiement.
- **Pas de tiret cadratin (—) dans les textes** : utiliser un point, une virgule, deux-points ou « · » selon le contexte.
- Noms de taxons en italique (*Formicidae*, *Myrmicinae*).
- Les définitions doivent rester exactes du point de vue myrmécologique. Le dessin n'a qu'un pétiole
  (pas de postpétiole) ; le gastre est découpé en tergites, sternites, pygidium et aiguillon.

## Accessibilité

Cibles de 44 px minimum, contrastes AA, structures de la planche atteignables au clavier (Tab + Entrée/Espace),
messages de verdict dans des zones `aria-live`. Ne pas donner aux structures un `aria-label` qui révèle leur nom
(cela donnerait la réponse en mode Trouver).
