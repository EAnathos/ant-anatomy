import type { Term } from '../data/parts';
import { shuffle } from './session';

/** Termes tirés au hasard pour une série du quiz d'association du glossaire. */
export function pickPairs(terms: readonly Term[], count: number, random: () => number = Math.random): Term[] {
  return shuffle(terms, random).slice(0, count);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Définition sans le terme lui-même : son nom et ses synonymes (singulier ou pluriel) deviennent « … »,
 * pour que la définition ne donne pas la réponse. Les mots de moins de 4 lettres sont laissés.
 */
export function maskTerm(term: Term): string {
  const labels = [term.name, ...term.synonyms].filter((l) => l.length >= 4).sort((a, b) => b.length - a.length);
  return labels.reduce((text, label) => {
    const stem = escape(label.replace(/s$/i, ''));
    return text.replace(new RegExp(`(?<![\\p{L}])${stem}s?(?![\\p{L}])`, 'giu'), '…');
  }, term.definition);
}
