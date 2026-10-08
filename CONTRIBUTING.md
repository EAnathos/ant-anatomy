# Contribuer

Merci de l'intérêt porté à l'Atlas anatomique *Formicidae*. Le projet n'est pas sous licence libre
(voir [LICENSE](LICENSE)) : le dépôt sert à développer le site, pas à être réutilisé.

## Signaler un problème

Les issues sont bienvenues, en français ou en anglais, pour :

- une erreur anatomique ou de terminologie (définition, nom, synonyme, région) : préciser la source
  (publication, [AntWiki](https://antwiki.org/wiki/Morphology_and_Terminology)…) ;
- une erreur de traduction ;
- un bug d'affichage ou d'accessibilité : indiquer le navigateur, l'appareil et les étapes pour le reproduire ;
- une idée d'amélioration ou une demande d'autorisation de réutilisation.

## Proposer une modification

1. Ouvrir d'abord une issue pour en discuter : une pull request sans issue préalable peut être fermée sans suite.
2. En envoyant une contribution, tu acceptes que l'auteur du projet (EAnathos) puisse l'utiliser, la modifier, la
   publier et la placer sous la licence de son choix, sans contrepartie. Tu confirmes aussi qu'elle est ton œuvre
   ou que tu as le droit de la céder ainsi.
3. Avant de proposer la pull request :

   ```bash
   npm install
   npm run typecheck && npm test
   ```

## Conventions

- Interface en français (tutoiement) et en anglais : tout texte ajouté l'est dans les deux langues
  (`t(fr, en)` dans les composants, `src/data/parts.en.ts` pour les données).
- Pas de tiret cadratin (—) dans les textes.
- Noms de taxons en italique (*Formicidae*, *Ponerinae*).
- Définitions exactes du point de vue myrmécologique, sources à l'appui.
- Ne pas modifier le tracé de la planche de l'ouvrière (dessin du domaine public) : seuls des attributs et des
  zones cliquables y sont ajoutés.
- Couleurs uniquement via les variables de `src/styles/tokens.css`.

---

# Contributing (English)

The project is not open source (see [LICENSE](LICENSE)). Issues are welcome in French or English: anatomical or
terminology errors (with a source), translation errors, display or accessibility bugs, ideas, or permission requests.
Please open an issue before any pull request. By submitting a contribution, you agree that the author (EAnathos) may
use, modify, publish and license it as they see fit, without compensation, and you confirm you have the right to grant
this. Run `npm run typecheck && npm test` before submitting; add every text in both languages.
