import { PARTS, PLATES, partsInRegions, type Part, type PartId, type PlateId, type RegionId } from '../data/parts';

export type QuestionCount = 10 | 20 | 'all';

export interface Settings {
  plate: PlateId;
  regions: RegionId[];
  questionCount: QuestionCount;
  ignoreAccents: boolean;
  /** Jouer sur toutes les planches à la fois (toutes leurs régions), plutôt que sur la planche choisie. */
  allPlates: boolean;
}

/** Une question : une structure d'une planche (le même terme peut figurer sur plusieurs planches). */
export interface Question {
  plate: PlateId;
  id: PartId;
}

export interface Answer {
  plate: PlateId;
  asked: PartId;
  picked: PartId;
  correct: boolean;
}

export interface Summary {
  score: number;
  total: number;
  accuracy: number;
  bestStreak: number;
  missed: Question[];
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function playableParts(settings: Settings): Part[] {
  return settings.allPlates ? PARTS : partsInRegions(settings.regions);
}

/** Planches de la session : toutes, ou la planche choisie. */
export function sessionPlates(settings: Settings): PlateId[] {
  return settings.allPlates ? PLATES.map((p) => p.id) : [settings.plate];
}

export function buildQuestions(settings: Settings, random: () => number = Math.random): Question[] {
  const pool = shuffle(playableParts(settings).map((p) => ({ plate: p.plate, id: p.id })), random);
  return settings.questionCount === 'all' ? pool : pool.slice(0, settings.questionCount);
}

export function summarize(log: readonly Answer[]): Summary {
  let streak = 0;
  let bestStreak = 0;
  for (const a of log) {
    streak = a.correct ? streak + 1 : 0;
    bestStreak = Math.max(bestStreak, streak);
  }
  const score = log.filter((a) => a.correct).length;
  return {
    score,
    total: log.length,
    accuracy: log.length ? Math.round((score / log.length) * 100) : 0,
    bestStreak,
    missed: log.filter((a) => !a.correct).map((a) => ({ plate: a.plate, id: a.asked })),
  };
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
