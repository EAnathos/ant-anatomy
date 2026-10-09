import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PLATES, TERM_BY_ID, partIn, partsFor, partsOf, regionsOf, termsFor } from '../data/parts';
import { isCorrectName, normalize } from './answers';
import { maskTerm, pickPairs } from './quiz';
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
    expect(isCorrectName(TERM_BY_ID.funicule, 'funicule', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.funicule, 'Funiculus', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.coxa, 'hanche', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.mandibule, 'mandibules', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.mandibule, 'mandibule', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.femur, 'fémur', false)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.eperon, 'éperon tibial', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.lobe, 'lobes frontaux', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.lobe, 'carène frontale', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID.lobe, 'torulus', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID.ommatidies, 'ommatidie', false)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.ommatidies, 'Ommatidium', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.ommatidies, 'œil composé', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID['submarginale-1'], '1re submarginale', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID.marginale, 'cellule radiale', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID['subdiscoidale-2'], 'subdiscoidale 1', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID['2r-rs'], '2r-rs', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID['rs-plus-m'], 'Rs + M', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID['media-3'], 'M3', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID['m-cu'], 'media-cubitus', true)).toBe(true);
    expect(isCorrectName(TERM_BY_ID['m-plus-cu'], 'media-cubitus', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID.griffe, 'ongle', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID['sillon-metanotal'], 'métanotum', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID.presclerite, 'prétergite', true)).toBe(false);
  });

  it('accepte les variantes sans les afficher comme synonymes', () => {
    expect(isCorrectName(TERM_BY_ID['submarginale-1'], '1re submarginale', true)).toBe(true);
    expect(TERM_BY_ID['submarginale-1'].synonyms).not.toContain('1re submarginale');
    expect(isCorrectName(TERM_BY_ID.coxa, 'hanches', true)).toBe(true);
    expect(TERM_BY_ID.coxa.synonyms).toEqual(['hanche']);
  });

  it('refuse une mauvaise réponse ou une réponse vide', () => {
    expect(isCorrectName(TERM_BY_ID.scape, 'funicule', true)).toBe(false);
    expect(isCorrectName(TERM_BY_ID.scape, '   ', true)).toBe(false);
  });

  it('exige les accents quand ils ne sont pas ignorés', () => {
    expect(isCorrectName(TERM_BY_ID.propodeum, 'propodeum', false)).toBe(false);
    expect(isCorrectName(TERM_BY_ID.propodeum, 'Propodéum', false)).toBe(true);
  });
});

describe('anglais', () => {
  const EN = Object.fromEntries(termsFor('en').map((t) => [t.id, t])) as typeof TERM_BY_ID;

  it('accepte les noms, synonymes et pluriels anglais', () => {
    expect(isCorrectName(EN.femur, 'femur', true)).toBe(true);
    expect(isCorrectName(EN.femur, 'Femora', true)).toBe(true);
    expect(isCorrectName(EN.coxa, 'coxa', true)).toBe(true);
    expect(isCorrectName(EN.griffe, 'claw', true)).toBe(true);
    expect(isCorrectName(EN.aiguillon, 'stinger', true)).toBe(true);
    expect(isCorrectName(EN['rs-plus-m'], 'Rs + M', true)).toBe(true);
    expect(isCorrectName(EN['submarginale-1'], '1st submarginal', true)).toBe(true);
    expect(isCorrectName(EN.femur, 'fémur', false)).toBe(false);
  });

  it('traduit tous les termes', () => {
    for (const t of termsFor('en')) expect(t.definition, t.id).not.toBe(TERM_BY_ID[t.id].definition);
  });
});

describe('noms sans ambiguïté', () => {
  it.each(['fr', 'en'] as const)('%s : aucun nom ni synonyme partagé par deux structures d’une planche', (lang) => {
    for (const plate of PLATES) {
      const seen = new Map<string, string>();
      for (const part of partsFor(lang).filter((p) => p.plate === plate.id)) {
        for (const label of new Set([part.name, ...part.synonyms, ...(part.variants ?? [])].map((s) => normalize(s, true).replace(/s$/, '')))) {
          expect(seen.get(label) ?? part.id, `« ${label} »`).toBe(part.id);
          seen.set(label, part.id);
        }
      }
    }
  });
});

describe('dictionnaire', () => {
  it.each(['fr', 'en'] as const)('%s : aucun nom partagé par deux termes du glossaire', (lang) => {
    const seen = new Map<string, string>();
    for (const t of termsFor(lang)) {
      const label = normalize(t.name, true).replace(/s$/, '');
      expect(seen.get(label) ?? t.id, `« ${label} »`).toBe(t.id);
      seen.set(label, t.id);
    }
  });

  it('ne place un terme qu’une fois par planche', () => {
    for (const plate of PLATES) {
      const ids = partsOf(plate.id).map((p) => p.id);
      expect(new Set(ids).size, plate.id).toBe(ids.length);
    }
  });

  it('rattache chaque région à la planche de ses structures', () => {
    for (const p of partsFor('fr')) expect(regionsOf(p.plate).map((r) => r.id), p.id).toContain(p.region);
  });
});

describe('quiz du glossaire', () => {
  it('tire des termes distincts', () => {
    const picked = pickPairs(termsFor('fr'), 5);
    expect(new Set(picked.map((t) => t.id)).size).toBe(5);
  });

  it('masque le terme dans sa définition, au singulier comme au pluriel', () => {
    const term = { ...TERM_BY_ID.tibia, name: 'Tibias', definition: 'Le tibia porte un éperon ; les tibias sont longs.' };
    expect(maskTerm(term)).toBe('Le … porte un éperon ; les … sont longs.');
  });

  it('ne masque pas un mot qui contient le terme', () => {
    const term = { ...TERM_BY_ID.tibia, definition: 'Voir la métatibia.' };
    expect(maskTerm(term)).toBe('Voir la métatibia.');
  });
});

describe('sessions', () => {
  it('mélange sans perdre d’éléments', () => {
    const items = [1, 2, 3, 4, 5];
    expect(shuffle(items).sort()).toEqual(items);
  });

  it('n’a de régions à choisir que sur l’aile', () => {
    for (const plate of PLATES) expect(regionsOf(plate.id).length, plate.id).toBe(plate.id === 'aile' ? 2 : 1);
    const qs = buildQuestions({ plate: 'antenne', regions: ['antenne'], questionCount: 'all', ignoreAccents: true, allPlates: false });
    expect(qs.map((q) => q.id).sort()).toEqual(partsOf('antenne').map((p) => p.id).sort());
  });

  it('sépare cellules et nervures de l’aile', () => {
    expect(regionsOf('aile').map((r) => r.id)).toEqual(['cellules', 'nervures']);
    const qs = buildQuestions({ plate: 'aile', regions: ['nervures'], questionCount: 'all', ignoreAccents: true, allPlates: false });
    expect(qs).toHaveLength(22);
    expect(qs.every((q) => q.plate === 'aile' && partIn('aile', q.id).region === 'nervures')).toBe(true);
  });

  it('tire dans toutes les planches quand on le demande, en gardant la planche de chaque question', () => {
    const settings = { plate: 'aile', regions: ['nervures'], questionCount: 'all', ignoreAccents: true, allPlates: true } as const;
    const qs = buildQuestions({ ...settings, regions: [...settings.regions] });
    expect(qs).toHaveLength(partsFor('fr').length);
    expect(new Set(qs.map((q) => q.plate))).toEqual(new Set(PLATES.map((p) => p.id)));
    expect(qs.every((q) => partIn(q.plate, q.id) !== undefined)).toBe(true);
  });

  it('calcule score, série et erreurs', () => {
    const s = summarize([
      { plate: 'antenne', asked: 'scape', picked: 'scape', correct: true },
      { plate: 'patte', asked: 'tibia', picked: 'tibia', correct: true },
      { plate: 'patte', asked: 'femur', picked: 'tibia', correct: false },
      { plate: 'patte', asked: 'tarse', picked: 'tarse', correct: true },
    ]);
    expect(s).toEqual({ score: 3, total: 4, accuracy: 75, bestStreak: 2, missed: [{ plate: 'patte', id: 'femur' }] });
  });

  it('formate une durée', () => {
    expect(formatDuration(134_000)).toBe('2:14');
  });
});

describe('planche SVG', () => {
  const FILES = { ouvriere: 'ant.svg', aile: 'wing.svg', tete: 'head.svg', mandibule: 'mandible.svg', antenne: 'antenna.svg', mesosoma: 'mesosoma.svg', patte: 'leg.svg' } as const;

  it.each(PLATES.map((p) => p.id))('%s : contient exactement les structures déclarées', (plate) => {
    const svg = readFileSync(new URL(`../assets/${FILES[plate]}`, import.meta.url), 'utf8');
    const inSvg = new Set([...svg.matchAll(/data-part="([a-z0-9-]+)"/g)].map((m) => m[1]));
    expect([...inSvg].sort()).toEqual(partsOf(plate).map((p) => p.id).sort());
  });
});
