import { useState } from 'react';
import { CheckIcon, CrossIcon, ReplayIcon } from '../components/icons';
import { Rich } from '../components/Rich';
import { TERMS, TERM_BY_ID, type Term, type TermId } from '../data/parts';
import { t } from '../i18n';
import { maskTerm, pickPairs } from '../lib/quiz';
import { playableParts, shuffle, type Settings } from '../lib/session';

/** D'où viennent les mots : structures de la planche choisie (régions cochées) ou tout le glossaire. */
export type MatchSource = 'plate' | 'glossary';

const PAIRS = 5;

const T = t(
  {
    source: 'Mots tirés de',
    plate: 'La planche',
    glossary: 'Tout le glossaire',
    found: ' paires trouvées',
    mistakes: ' erreurs',
    round: (n: number) => `Série ${n}`,
    help: 'Relie chaque mot à sa définition : clique un mot, puis la définition qui lui correspond, ou l’inverse. Le mot est masqué (…) dans sa propre définition.',
    terms: 'Mots',
    definitions: 'Définitions',
    ok: (name: string) => `Exact : ${name}.`,
    ko: (name: string) => `Raté, ce n’est pas la définition de « ${name} ».`,
    done: (mistakes: number) =>
      `Série terminée, ${mistakes === 0 ? 'sans erreur' : mistakes === 1 ? 'avec 1 erreur' : `avec ${mistakes} erreurs`}.`,
    again: 'Série suivante',
  },
  {
    source: 'Words drawn from',
    plate: 'The plate',
    glossary: 'The whole glossary',
    found: ' pairs found',
    mistakes: ' mistakes',
    round: (n: number) => `Round ${n}`,
    help: 'Match each word to its definition: click a word, then the definition that goes with it, or the other way round. The word is hidden (…) in its own definition.',
    terms: 'Words',
    definitions: 'Definitions',
    ok: (name: string) => `Correct: ${name}.`,
    ko: (name: string) => `Wrong, that is not the definition of “${name}”.`,
    done: (mistakes: number) =>
      `Round complete, ${mistakes === 0 ? 'no mistakes' : mistakes === 1 ? '1 mistake' : `${mistakes} mistakes`}.`,
    again: 'Next round',
  },
);

interface MatchModeProps {
  settings: Settings;
  source: MatchSource;
  onSourceChange: (source: MatchSource) => void;
}

/** Mots de la source, sans doublon (un terme peut figurer sur plusieurs planches). */
export function matchPool(settings: Settings, source: MatchSource): Term[] {
  if (source === 'glossary') return TERMS;
  return [...new Set(playableParts(settings).map((p) => p.id))].map((id) => TERM_BY_ID[id]);
}

interface Round {
  terms: Term[];
  definitions: Term[];
}

const newRound = (pool: readonly Term[]): Round => {
  const terms = pickPairs(pool, PAIRS);
  return { terms, definitions: shuffle(terms) };
};

type Feedback = { ok: boolean; term: TermId; definition: TermId } | null;

export function MatchMode({ settings, source, onSourceChange }: MatchModeProps) {
  const pool = matchPool(settings, source);
  const plateUsable = matchPool(settings, 'plate').length >= 2;
  const [round, setRound] = useState(() => newRound(pool));
  const [roundNumber, setRoundNumber] = useState(1);
  const [term, setTerm] = useState<TermId | null>(null);
  const [definition, setDefinition] = useState<TermId | null>(null);
  const [matched, setMatched] = useState<TermId[]>([]);
  const [roundMistakes, setRoundMistakes] = useState(0);
  const [totals, setTotals] = useState({ found: 0, mistakes: 0 });
  const [feedback, setFeedback] = useState<Feedback>(null);
  const finished = matched.length === round.terms.length;

  // Une paire est jugée dès qu'un mot et une définition sont choisis, dans n'importe quel ordre.
  const choose = (nextTerm: TermId | null, nextDefinition: TermId | null) => {
    if (nextTerm && nextDefinition) {
      const ok = nextTerm === nextDefinition;
      setFeedback({ ok, term: nextTerm, definition: nextDefinition });
      if (ok) setMatched((m) => [...m, nextTerm]);
      else setRoundMistakes((n) => n + 1);
      setTotals((s) => (ok ? { ...s, found: s.found + 1 } : { ...s, mistakes: s.mistakes + 1 }));
      setTerm(null);
      setDefinition(null);
    } else {
      setFeedback(null);
      setTerm(nextTerm);
      setDefinition(nextDefinition);
    }
  };

  const nextRound = (from: readonly Term[] = pool) => {
    setRound(newRound(from));
    setRoundNumber((n) => n + 1);
    setTerm(null);
    setDefinition(null);
    setMatched([]);
    setRoundMistakes(0);
    setFeedback(null);
  };

  // Changer de source relance une partie à zéro.
  const changeSource = (next: MatchSource) => {
    if (next === source) return;
    onSourceChange(next);
    nextRound(matchPool(settings, next));
    setRoundNumber(1);
    setTotals({ found: 0, mistakes: 0 });
  };

  const stateOf = (id: TermId, selected: TermId | null, side: 'term' | 'definition') => {
    if (matched.includes(id)) return 'ok';
    if (feedback && !feedback.ok && feedback[side] === id) return 'ko';
    return id === selected ? 'sel' : 'rest';
  };

  return (
    <main className="container match">
      <div className="match__top">
        <div className="progress__row">
          <span className="eyebrow">{T.round(roundNumber)}</span>
          <span className="score mono">
            <span className="score--ok"><CheckIcon /> {totals.found}<span className="sr-only">{T.found}</span></span>
            <span className="score--ko"><CrossIcon /> {totals.mistakes}<span className="sr-only">{T.mistakes}</span></span>
          </span>
        </div>
        <div className="match__source">
          <span className="eyebrow">{T.source}</span>
          <div className="segmented" role="group" aria-label={T.source}>
            <button type="button" aria-pressed={source === 'plate'} disabled={!plateUsable} onClick={() => changeSource('plate')}>
              {T.plate}
            </button>
            <button type="button" aria-pressed={source === 'glossary'} onClick={() => changeSource('glossary')}>
              {T.glossary}
            </button>
          </div>
        </div>
      </div>

      <p className="muted match__help">{T.help}</p>

      <div className="match__grid">
        <ul className="match__terms" aria-label={T.terms}>
          {round.terms.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="match__term"
                data-state={stateOf(p.id, term, 'term')}
                aria-pressed={p.id === term}
                disabled={matched.includes(p.id)}
                onClick={() => choose(p.id === term ? null : p.id, definition)}
              >
                {matched.includes(p.id) && <CheckIcon />}
                {p.name}
              </button>
            </li>
          ))}
        </ul>
        <ul className="match__definitions" aria-label={T.definitions}>
          {round.definitions.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="match__definition"
                data-state={stateOf(p.id, definition, 'definition')}
                aria-pressed={p.id === definition}
                disabled={matched.includes(p.id)}
                onClick={() => choose(term, p.id === definition ? null : p.id)}
              >
                {matched.includes(p.id) && <strong>{p.name}</strong>}
                <span>
                  <Rich text={maskTerm(p)} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div aria-live="polite">
        {finished ? (
          <div className="verdict verdict--ok">
            <div className="verdict__title">
              <CheckIcon size={20} /> {T.done(roundMistakes)}
            </div>
            <button type="button" className="btn btn--primary btn--small" onClick={() => nextRound()}>
              <ReplayIcon /> {T.again}
            </button>
          </div>
        ) : (
          feedback && (
            <p className={`match__feedback match__feedback--${feedback.ok ? 'ok' : 'ko'}`}>
              {feedback.ok ? <CheckIcon /> : <CrossIcon />}
              {feedback.ok ? T.ok(TERM_BY_ID[feedback.term].name) : T.ko(TERM_BY_ID[feedback.term].name)}
            </p>
          )
        )}
      </div>
    </main>
  );
}
