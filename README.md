# Atlas anatomique *Formicidae*

Application web pour apprendre l'anatomie externe de la fourmi, structure par structure,
sur des planches interactives. Deux planches au choix :

- **Ouvrière *Neoponera verenae*** (*Ponerinae*), en vue latérale. L'anatomie varie selon les fourmis : certaines
  structures manquent chez d'autres espèces (l'aiguillon chez les *Formicinae*, par exemple) et d'autres s'ajoutent
  (le postpétiole chez les *Myrmicinae*).
- **Aile de reine *Odontomachus* sp.** (*Ponerinae*), aile antérieure, avec ses cellules et ses nervures. La nervation varie selon les genres
  (nervures absentes, cellules fusionnées ou ouvertes) et entre reines et mâles ; les ouvrières n'ont pas d'ailes.

## Fonctionnalités

- **Planches interactives** : sur l'ouvrière, 24 structures cliquables réparties en 6 régions (tête, antenne, mésosoma,
  pétiole, gastre, pattes), sur les deux antennes et les six pattes ; sur l'aile, 2 régions : cellules (10 cellules et le
  ptérostigma) et nervures (22).
  Un clic sur l'accueil affiche le nom, la région et une définition.
- **Mode Trouver** : un nom s'affiche, il faut cliquer la bonne structure. Indice de région, correction immédiate,
  progression et bilan détaillé (score, précision, durée, meilleure série), avec la possibilité de rejouer ses erreurs.
- **Mode Nommer** : on clique une structure et on tape son nom, avec un seul essai par structure. Une structure ratée
  reste en rouge et ne peut plus être choisie. Les majuscules, les accents (réglable) et les synonymes courants sont
  acceptés (« hanche » pour coxa, « épinotum » pour propodéum, « ommatidie » pour ommatidies…).
- **Paramètres de session** : choix de la planche (sur l'accueil), des régions (pour l'aile : cellules, nervures ou les deux), nombre de questions (10, 20 ou toutes), tolérance aux accents.
- En français (`/`) et en anglais (`/en/`), avec un sélecteur dans l'en-tête et des aperçus de liens traduits.
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
  assets/ant.svg        planche de l'ouvrière, data-part="…" sur chaque tracé cliquable
  assets/wing.svg       planche de l'aile, même principe
  i18n.ts               langue de la page et helper de traduction t(fr, en)
  data/parts.ts         planches, régions, structures, définitions et synonymes (français)
  data/parts.en.ts      traduction anglaise des données
  lib/answers.ts        validation des réponses tapées
  lib/session.ts        tirage des questions et calcul du bilan
  components/           planche SVG, en-tête, légende, paramètres, icônes
  screens/              accueil, Trouver, Nommer, bilan
  styles/               tokens de la charte et styles globaux
```

## Ajouter ou modifier une structure

1. Dans le SVG de la planche (`src/assets/ant.svg` ou `wing.svg`, Inkscape convient), ajouter `data-part="mon-id"` sur chaque tracé de la structure.
   Une structure peut avoir plusieurs tracés (par exemple une par patte).
2. Ajouter `mon-id` au type `PartId` et une entrée dans `PARTS` (`src/data/parts.ts`) avec nom, région (d'une région
   de cette planche), définition et synonymes, puis sa traduction dans `PARTS_EN` (`src/data/parts.en.ts`).
3. Lancer `npm test` : un test vérifie, pour chaque planche, que le SVG et les données déclarent exactement les mêmes structures.

## Charte graphique

Inspirée des planches naturalistes tirées en cyanotype : fond blanc, une seule encre bleu de Prusse (`#1D3557`),
l'ambre (`#F2A93B`) pour la sélection et les indices, vert mousse et terracotta pour les verdicts.
Polices Hanken Grotesk et DM Mono. Les valeurs sont dans `src/styles/tokens.css`.

## Crédits

Planche de l'ouvrière : [Scheme ant worker anatomy (version sans légende)](https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg),
par LadyofHats (original) et Sophivorus (version sans légende), domaine public, via Wikimedia Commons.
Le tracé n'est pas modifié : les noms des structures et des zones cliquables ont été ajoutés, les griffes détourées
séparément du tarse, et le gastre passé au même gris que le propodéum.

Planche de l'aile : dessin d'EAnathos, sous licence [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.fr) :
réutilisation libre à des fins non commerciales, en citant l'auteur.

Les deux mentions sont affichées sur l'accueil, sous le texte de la planche choisie.

Pour aller plus loin : [Morphology and Terminology](https://antwiki.org/wiki/Morphology_and_Terminology) sur AntWiki.

## Licence

Tous droits réservés : le code, les textes et les données de ce dépôt ne peuvent pas être réutilisés sans
autorisation. Seule la planche de l'aile est réutilisable, sous licence CC BY-NC 4.0, et le dessin d'origine de
l'ouvrière reste dans le domaine public. Détails dans [LICENSE](LICENSE).

## Contribuer

Les signalements d'erreurs (anatomie, traduction, bugs) sont bienvenus. Voir [CONTRIBUTING.md](CONTRIBUTING.md).
