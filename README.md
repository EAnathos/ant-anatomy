# Atlas anatomique *Formicidae*

Application web pour apprendre l'anatomie externe de la fourmi ouvrière, structure par structure,
sur une planche interactive en vue latérale.

## Fonctionnalités

- **Planche interactive** : 25 structures cliquables réparties en 6 régions (tête, antenne, mésosoma, pétiole, gastre, pattes),
  sur les deux antennes et les six pattes.
  Un clic sur l'accueil affiche le nom, la région et une définition.
- **Mode Trouver** : un nom s'affiche, il faut cliquer la bonne structure. Indice de région, correction immédiate,
  progression et bilan détaillé (score, précision, durée, meilleure série), avec la possibilité de rejouer ses erreurs.
- **Mode Nommer** : on clique une structure et on tape son nom, avec un seul essai par structure. Une structure ratée
  reste en rouge et ne peut plus être choisie. Les majuscules, les accents (réglable) et les synonymes courants sont
  acceptés (« hanche » pour coxa, « épinotum » pour propodéum, « oeuil » pour œil…).
- **Paramètres de session** : choix des régions, nombre de questions (10, 20 ou toutes), tolérance aux accents.
- Utilisable au clavier et sur mobile.

## Démarrer

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173.

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification des types et build de production (`dist/`) |
| `npm run preview` | Sert le build de production en local |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |

## Déploiement

Le site est publié sur https://ant-anatomy.anathos.me via GitHub Pages, avec deux workflows :

- **CI** (`.github/workflows/ci.yml`) : sur chaque push vers `main` et chaque pull request, vérifie les types,
  lance les tests et construit le site.
- **CD** (`.github/workflows/cd.yml`) : se déclenche quand la CI réussit sur un push vers `main`, reconstruit
  le site à partir du même commit et le déploie sur GitHub Pages. Un déploiement manuel est possible depuis
  l'onglet Actions (workflow CD, « Run workflow »).

Le domaine est configuré dans les réglages Pages du dépôt et pointe via un enregistrement DNS
`CNAME ant-anatomy → eanathos.github.io`.

## Organisation du code

```
src/
  assets/ant.svg        dessin de la fourmi, une balise <g data-part="…"> par structure
  data/parts.ts         régions, structures, définitions et synonymes
  lib/answers.ts        validation des réponses tapées
  lib/session.ts        tirage des questions et calcul du bilan
  components/           planche SVG, en-tête, légende, paramètres, icônes
  screens/              accueil, Trouver, Nommer, bilan
  styles/               tokens de la charte et styles globaux
```

## Ajouter ou modifier une structure

1. Dans `src/assets/ant.svg` (Inkscape convient), ajouter `data-part="mon-id"` sur chaque tracé de la structure.
   Une structure peut avoir plusieurs tracés (par exemple une par patte).
2. Ajouter `mon-id` au type `PartId` et une entrée dans `PARTS` (`src/data/parts.ts`) avec nom, région, définition et synonymes.
3. Lancer `npm test` : un test vérifie que le SVG et les données déclarent exactement les mêmes structures.

## Charte graphique

Inspirée des planches naturalistes tirées en cyanotype : fond blanc, une seule encre bleu de Prusse (`#1D3557`),
l'ambre (`#F2A93B`) pour la sélection et les indices, vert mousse et terracotta pour les verdicts.
Polices Hanken Grotesk et DM Mono. Les valeurs sont dans `src/styles/tokens.css`.

## Crédits

Planche : « Scheme ant worker anatomy » de Mariana Ruiz Villarreal (LadyofHats), via Wikimedia Commons.
Le dessin n'est pas modifié : seuls les noms des structures et des zones cliquables ont été ajoutés,
et les griffes ont été détourées séparément du tarse.
