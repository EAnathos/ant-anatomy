import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PART_BY_ID, PARTS } from '../data/parts';
import { isCorrectName, normalize } from './answers';
import { buildQuestions, formatDuration, shuffle, summarize } from './session';

describe('normalize', () => {
  it('ignore la casse, les accents et les tirets', () => {
    expect(normalize('  Post-Pétiole ', true)).toBe('post petiole');
    expect(normalize('Œil composé', true)).toBe('oeil compose');
  });

  it('garde les accents quand demandé', () => {
    expect(normalize('Propodéum', false)).toBe('propodéum');
  });
});

describe('isCorrectName', () => {
  it('accepte le nom, les synonymes et le pluriel', () => {
    expect(isCorrectName(PART_BY_ID.funicule, 'funicule', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.funicule, 'Funiculus', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.coxa, 'hanche', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.mandibule, 'mandibules', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.oeil, 'oeil compose', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.oeil, 'oeil', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.oeil, 'Oeuil composé', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.oeil, 'oeuil', false)).toBe(true);
  });

  it('refuse une mauvaise réponse ou une réponse vide', () => {
    expect(isCorrectName(PART_BY_ID.scape, 'funicule', true)).toBe(false);
    expect(isCorrectName(PART_BY_ID.scape, '   ', true)).toBe(false);
  });

  it('exige les accents quand ils ne sont pas ignorés', () => {
    expect(isCorrectName(PART_BY_ID.propodeum, 'propodeum', false)).toBe(false);
    expect(isCorrectName(PART_BY_ID.propodeum, 'Propodéum', false)).toBe(true);
  });
});

describe('sessions', () => {
  it('mélange sans perdre d’éléments', () => {
    const items = [1, 2, 3, 4, 5];
    expect(shuffle(items).sort()).toEqual(items);
  });

  it('limite les questions aux régions choisies', () => {
    const qs = buildQuestions({ regions: ['antenne'], questionCount: 10, ignoreAccents: true });
    expect(qs.sort()).toEqual(['funicule', 'scape']);
  });

  it('calcule score, série et erreurs', () => {
    const s = summarize([
      { asked: 'scape', picked: 'scape', correct: true },
      { asked: 'tibia', picked: 'tibia', correct: true },
      { asked: 'femur', picked: 'tibia', correct: false },
      { asked: 'tarse', picked: 'tarse', correct: true },
    ]);
    expect(s).toEqual({ score: 3, total: 4, accuracy: 75, bestStreak: 2, missed: ['femur'] });
  });

  it('formate une durée', () => {
    expect(formatDuration(134_000)).toBe('2:14');
  });
});

describe('planche SVG', () => {
  it('contient exactement les structures déclarées', () => {
    const svg = readFileSync(new URL('../assets/ant.svg', import.meta.url), 'utf8');
    const inSvg = new Set([...svg.matchAll(/data-part="([a-z]+)"/g)].map((m) => m[1]));
    expect([...inSvg].sort()).toEqual(PARTS.map((p) => p.id).sort());
  });
});
