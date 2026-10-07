import type { Part } from '../data/parts';

export function normalize(input: string, ignoreAccents: boolean): string {
  let s = input.toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  if (ignoreAccents) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.normalize('NFC').replace(/[-'’]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isCorrectName(part: Part, answer: string, ignoreAccents: boolean): boolean {
  const given = normalize(answer, ignoreAccents);
  if (!given) return false;
  const accepted = [part.name, ...part.synonyms].map((s) => normalize(s, ignoreAccents));
  if (accepted.includes(given)) return true;
  return given.endsWith('s') && accepted.includes(given.slice(0, -1));
}
