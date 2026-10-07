# CLAUDE.md

Atlas anatomique interactif de la fourmi (ouvrière, vue latérale). Deux modes de jeu :
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

- Chaque structure est un `<g data-part="<id>">` dont l'id correspond exactement à un `PartId` de `parts.ts`.
  Une structure répétée (fémur, tibia, griffe…) reste **un seul** `<g>` contenant plusieurs formes.
- Les couleurs des états ne sont jamais dans le SVG : `AntPlate` pose `data-state`
  (`rest | sel | ok | ko | done | off`) et `global.css` colore via `[data-state]`.
- Petites structures : ajouter dans le même `<g>` un tracé `class="hit"` avec `fill="none" stroke="transparent" stroke-width="7"`
  pour agrandir la zone cliquable.
- Les éléments décoratifs (sutures du gastre) n'ont pas de `data-part` et ont `pointer-events="none"`.
- Ajouter une structure = la dessiner dans `ant.svg` **et** l'ajouter à `PartId` + `PARTS`.
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
- Les définitions doivent rester exactes du point de vue myrmécologique. La région « Pétiole » regroupe
  pédoncule, nœud du pétiole, processus subpétiolaire et postpétiole.

## Accessibilité

Cibles de 44 px minimum, contrastes AA, structures de la planche atteignables au clavier (Tab + Entrée/Espace),
messages de verdict dans des zones `aria-live`. Ne pas donner aux structures un `aria-label` qui révèle leur nom
(cela donnerait la réponse en mode Trouver).
