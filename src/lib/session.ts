import { partsInRegions, type PartId, type RegionId } from '../data/parts';

export type QuestionCount = 10 | 20 | 'all';

export interface Settings {
  regions: RegionId[];
  questionCount: QuestionCount;
  ignoreAccents: boolean;
}

export interface Answer {
  asked: PartId;
  picked: PartId;
  correct: boolean;
}

export interface Summary {
  score: number;
  total: number;
  accuracy: number;
  bestStreak: number;
  missed: PartId[];
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildQuestions(settings: Settings, random: () => number = Math.random): PartId[] {
  const pool = shuffle(partsInRegions(settings.regions).map((p) => p.id), random);
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
    missed: log.filter((a) => !a.correct).map((a) => a.asked),
  };
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
