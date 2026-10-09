# Atlas anatomique *Formicidae*

Application web pour apprendre l'anatomie externe de la fourmi, structure par structure,
sur des planches interactives. Cinq planches au choix :

- **Ouvrière *Neoponera verenae*** (Ponerinae), en vue latérale. L'anatomie varie selon les fourmis : certaines
  structures manquent chez d'autres espèces (l'aiguillon chez les Formicinae, par exemple) et d'autres s'ajoutent
  (le postpétiole chez les Myrmicinae).
- **Aile de reine *Odontomachus* sp.** (Ponerinae), aile antérieure, avec ses cellules et ses nervures. La nervation varie selon les genres
  (nervures absentes, cellules fusionnées ou ouvertes) et entre reines et mâles ; les ouvrières n'ont pas d'ailes.
- **Tête**, vue composite de deux têtes de face d'après les figures 523 à 526 de Bolton (1994) : l'une entière avec
  lobes frontaux et scrobes, l'autre sans lobes, montrant l'insertion des antennes.
- **Mandibule**, vue composite d'une mandibule gauche triangulaire grande ouverte, d'après la figure 527 de
  Bolton (1994) : bords, angle basal, dents et diastème.
- **Antenne**, vue composite d'une antenne d'ouvrière de 12 articles : bulbe condylaire, col du bulbe, scape,
  pédicelle, funicule et massue.

## Fonctionnalités

- **Planches interactives** : sur l'ouvrière, 21 structures cliquables réparties en 6 régions (tête, antenne, mésosoma,
  pétiole, gastre, pattes), sur les deux antennes et les six pattes ; sur l'aile, 2 régions : cellules (10 cellules et le
  ptérostigma) et nervures (22) ; sur la mandibule, 2 régions : lame et bords (5), dents (6) ; sur l'antenne, 2 régions : scape et base (3),
  funicule et massue (3). Sur la tête, 3 régions : capsule (6), région frontale (3), clypéus et
  insertion antennaire (7). La tête, les antennes et les mandibules de l'ouvrière ouvrent leur planche détaillée.
  Un clic sur l'accueil affiche le nom, la région et une définition.
- **Mode Trouver** : un nom s'affiche, il faut cliquer la bonne structure. Indice de région, correction immédiate,
  progression et bilan détaillé (score, précision, durée, meilleure série), avec la possibilité de rejouer ses erreurs.
- **Mode Nommer** : on clique une structure et on tape son nom, avec un seul essai par structure. Une structure ratée
  reste en rouge et ne peut plus être choisie. Les majuscules, les accents (réglable) et les synonymes courants sont
  acceptés (« hanche » pour coxa, « épinotum » pour propodéum, « ommatidie » pour ommatidies…).
- **Mode Relier** : des mots et des définitions mélangés à associer, par séries de cinq, avec les structures de la
  planche ou tout le glossaire.
- **Glossaire** : tous les termes par ordre alphabétique, avec définition et synonymes, d'après Bolton (1994) et
  Keller (2011), et un lien vers chaque planche où le terme figure.
- **Paramètres de session** : choix de la planche (sur l'accueil), des régions (pour l'aile : cellules, nervures ou les deux ; pour la tête : capsule, région frontale, clypéus ; pour la mandibule : lame, dents ou les deux ; pour l'antenne : base, funicule ou les deux), nombre de questions (10, 20 ou toutes), tolérance aux accents.
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
  assets/head.svg       planche de la tête, même principe
  assets/mandible.svg   planche de la mandibule, même principe
  assets/antenna.svg    planche de l'antenne, même principe
  i18n.ts               langue de la page et helper de traduction t(fr, en)
  data/parts.ts         planches, régions, dictionnaire des termes et placement sur les planches (français)
  data/parts.en.ts      traduction anglaise des données
  lib/answers.ts        validation des réponses tapées
  lib/session.ts        tirage des questions et calcul du bilan
  components/           planche SVG, en-tête, légende, paramètres, icônes
  screens/              accueil, Trouver, Nommer, Relier, bilan, glossaire
  styles/               tokens de la charte et styles globaux
```

## Ajouter ou modifier une structure

1. Dans le SVG de la planche (`src/assets/*.svg`, Inkscape convient), ajouter `data-part="mon-id"` sur chaque tracé de la structure.
   Une structure peut avoir plusieurs tracés (par exemple une par patte).
2. Si le terme n'existe pas encore, l'ajouter au type `TermId` et à `TERMS_FR` (`src/data/parts.ts`) avec nom,
   définition, synonymes et variantes, puis sa traduction dans `TERMS_EN` (`src/data/parts.en.ts`). Le placer ensuite
   dans la région voulue de `LAYOUT`.
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

Planche de la mandibule : dessin composite d'EAnathos, d'après la figure 527 de Bolton (1994), sous la même licence
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.fr).

Planche de l'antenne : dessin composite d'EAnathos, sous la même licence CC BY-NC 4.0.

Planche de la tête : dessin composite d'EAnathos, d'après les figures 523 à 526 de Bolton (1994), sous la même
licence CC BY-NC 4.0.

Les mentions sont affichées sur l'accueil, sous le texte de la planche choisie.

Pour aller plus loin : [Morphology and Terminology](https://antwiki.org/wiki/Morphology_and_Terminology) sur AntWiki.

## Licence

Tous droits réservés : le code, les textes et les données de ce dépôt ne peuvent pas être réutilisés sans
autorisation. Seules les planches de l'aile, de la tête, de la mandibule et de l'antenne sont réutilisables, sous licence CC BY-NC 4.0, et le dessin d'origine de
l'ouvrière reste dans le domaine public. Détails dans [LICENSE](LICENSE).

## Contribuer

Les signalements d'erreurs (anatomie, traduction, bugs) sont bienvenus. Voir [CONTRIBUTING.md](CONTRIBUTING.md).
