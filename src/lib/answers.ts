import type { Term } from '../data/parts';

export function normalize(input: string, ignoreAccents: boolean): string {
  let s = input.toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  if (ignoreAccents) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.normalize('NFC').replace(/[-'’]/g, ' ').replace(/\s+/g, ' ').trim();
}

const singular = (s: string) => s.replace(/s$/, '');

export function isCorrectName(part: Term, answer: string, ignoreAccents: boolean): boolean {
  const given = normalize(answer, ignoreAccents);
  if (!given) return false;
  return [part.name, ...part.synonyms, ...(part.variants ?? [])].some((s) => singular(normalize(s, ignoreAccents)) === singular(given));
}
