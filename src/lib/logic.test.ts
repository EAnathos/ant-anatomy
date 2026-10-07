import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PART_BY_ID, PLATES, REGION_BY_ID, partsOf, regionsOf } from '../data/parts';
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
    expect(isCorrectName(PART_BY_ID.mandibule, 'mandibule', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.femur, 'fémur', false)).toBe(true);
    expect(isCorrectName(PART_BY_ID.eperon, 'éperon tibial', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.lobe, 'carène frontale', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.ommatidies, 'ommatidie', false)).toBe(true);
    expect(isCorrectName(PART_BY_ID.ommatidies, 'Ommatidium', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.ommatidies, 'œil composé', true)).toBe(false);
    expect(isCorrectName(PART_BY_ID['submarginale-1'], '1re submarginale', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID.marginale, 'cellule radiale', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID['subdiscoidale-2'], 'subdiscoidale 1', true)).toBe(false);
    expect(isCorrectName(PART_BY_ID['2r-rs'], '2r-rs', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID['rs-plus-m'], 'Rs + M', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID['media-3'], 'M3', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID['m-cu'], 'media-cubitus', true)).toBe(true);
    expect(isCorrectName(PART_BY_ID['m-plus-cu'], 'media-cubitus', true)).toBe(false);
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
    const qs = buildQuestions({ plate: 'ouvriere', regions: ['antenne'], layers: [], questionCount: 10, ignoreAccents: true });
    expect(qs.sort()).toEqual(['funicule', 'scape']);
  });

  it('ne tire que les couches choisies', () => {
    const regions = regionsOf('aile').map((r) => r.id);
    const qs = buildQuestions({ plate: 'aile', regions, layers: ['nervures'], questionCount: 'all', ignoreAccents: true });
    expect(qs).toHaveLength(22);
    expect(qs.every((id) => REGION_BY_ID[PART_BY_ID[id].region].layer === 'nervures')).toBe(true);
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
  const FILES = { ouvriere: 'ant.svg', aile: 'wing.svg' } as const;

  it.each(PLATES.map((p) => p.id))('%s : contient exactement les structures déclarées', (plate) => {
    const svg = readFileSync(new URL(`../assets/${FILES[plate]}`, import.meta.url), 'utf8');
    const inSvg = new Set([...svg.matchAll(/data-part="([a-z0-9-]+)"/g)].map((m) => m[1]));
    expect([...inSvg].sort()).toEqual(partsOf(plate).map((p) => p.id).sort());
  });
});
