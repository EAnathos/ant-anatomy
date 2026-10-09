import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AntPlate, type Marks } from '../components/AntPlate';
import { CheckIcon, CrossIcon, CursorIcon, ReplayIcon } from '../components/icons';
import { Legend } from '../components/Legend';
import { Rich } from '../components/Rich';
import { PLATE_BY_ID, partIn, partsOf, type PartId } from '../data/parts';
import { isCorrectName } from '../lib/answers';
import { t } from '../i18n';
import { playableParts, type Settings } from '../lib/session';

const T = t(
  {
    attempted: 'Structures tentées',
    found: ' trouvées',
    missed: ' ratées',
    clickTitle: 'Clique une structure',
    clickHelp: 'Choisis une structure de la planche, puis écris son nom. Tu n’as qu’un essai par structure.',
    accentsIgnored: ' Les accents et les majuscules ne comptent pas.',
    accentsCount: ' Les majuscules ne comptent pas, les accents si.',
    finished: 'Planche terminée',
    allFirstTry: 'Toutes les structures ont été nommées du premier coup.',
    remaining: (n: number) => `${n} ${n > 1 ? 'structures restent' : 'structure reste'} en rouge sur la planche.`,
    restart: 'Recommencer',
    highlighted: 'Structure surlignée',
    question: 'Comment s’appelle-t-elle ?',
    example: (word: string) => `ex. ${word}`,
    submit: 'Valider',
    dontKnow: 'Je ne sais pas',
    exact: (name: string) => `Exact : ${name}`,
    notQuite: 'Pas tout à fait',
    youWrote: (text: string) => `Tu as écrit « ${text} ». `,
    expected: 'Réponse attendue : ',
    staysRed: 'Elle reste en rouge sur la planche.',
    another: 'Choisir une autre structure',
    named: 'Nommées',
    none: 'Aucune pour l’instant.',
    missedList: 'Ratées',
    answer: 'Réponse',
    plate: 'Planche anatomique',
  },
  {
    attempted: 'Structures attempted',
    found: ' found',
    missed: ' missed',
    clickTitle: 'Click a structure',
    clickHelp: 'Pick a structure on the plate, then type its name. You only get one try per structure.',
    accentsIgnored: ' Accents and capitals don’t matter.',
    accentsCount: ' Capitals don’t matter, accents do.',
    finished: 'Plate complete',
    allFirstTry: 'Every structure was named on the first try.',
    remaining: (n: number) => `${n} ${n > 1 ? 'structures remain' : 'structure remains'} in red on the plate.`,
    restart: 'Start over',
    highlighted: 'Highlighted structure',
    question: 'What is it called?',
    example: (word: string) => `e.g. ${word}`,
    submit: 'Check',
    dontKnow: 'I don’t know',
    exact: (name: string) => `Correct: ${name}`,
    notQuite: 'Not quite',
    youWrote: (text: string) => `You wrote “${text}”. `,
    expected: 'Expected answer: ',
    staysRed: 'It stays red on the plate.',
    another: 'Pick another structure',
    named: 'Named',
    none: 'None yet.',
    missedList: 'Missed',
    answer: 'Answer',
    plate: 'Anatomical plate',
  },
);

type Verdict = 'ok' | 'ko' | null;

export function NameMode({ settings }: { settings: Settings }) {
  const [selected, setSelected] = useState<PartId | null>(null);
  const [answer, setAnswer] = useState('');
  const [typed, setTyped] = useState('');
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [found, setFound] = useState<PartId[]>([]);
  const [missed, setMissed] = useState<PartId[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const playable = playableParts(settings).map((p) => p.id);
  const part = selected ? partIn(settings.plate, selected) : null;
  const attempted = found.length + missed.length;
  const finished = playable.length > 0 && attempted === playable.length;

  useEffect(() => {
    if (selected && verdict === null) inputRef.current?.focus();
  }, [selected, verdict]);

  const marks: Marks = {};
  for (const p of partsOf(settings.plate)) if (!playable.includes(p.id)) marks[p.id] = 'off';
  for (const id of found) marks[id] = 'done';
  for (const id of missed) marks[id] = 'ko';
  if (selected) marks[selected] = verdict ?? 'sel';

  const pick = (id: PartId) => {
    setSelected(id);
    setAnswer('');
    setTyped('');
    setVerdict(null);
  };

  const clear = () => {
    setSelected(null);
    setVerdict(null);
  };

  const restart = () => {
    clear();
    setFound([]);
    setMissed([]);
  };

  const conclude = (good: boolean, given: string) => {
    if (!part) return;
    setTyped(given);
    setVerdict(good ? 'ok' : 'ko');
    if (good) setFound((f) => [...f, part.id]);
    else setMissed((m) => [...m, part.id]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!part || !answer.trim()) return;
    conclude(isCorrectName(part, answer, settings.ignoreAccents), answer.trim());
  };

  const pct = (n: number) => (playable.length ? (n / playable.length) * 100 : 0);

  return (
    <main className="container play">
      <section className="play__side" aria-label={T.answer}>
        <div className="progress">
          <div className="progress__row">
            <span className="eyebrow">{T.attempted}</span>
            <span className="score">
              <span className="score--ok"><CheckIcon /> {found.length}<span className="sr-only">{T.found}</span></span>
              <span className="score--ko"><CrossIcon /> {missed.length}<span className="sr-only">{T.missed}</span></span>
              <span className="ink">{attempted} / {playable.length}</span>
            </span>
          </div>
          <div
            className="bar"
            role="progressbar"
            aria-label={T.attempted}
            aria-valuemin={0}
            aria-valuemax={playable.length}
            aria-valuenow={attempted}
          >
            <div className="bar__fill" style={{ width: `${pct(found.length)}%` }} />
            <div className="bar__fill bar__fill--ko" style={{ width: `${pct(missed.length)}%` }} />
          </div>
        </div>

        {!part && !finished && (
          <div className="empty">
            <span className="icon-disc"><CursorIcon /></span>
            <h1>{T.clickTitle}</h1>
            <p className="muted">
              {T.clickHelp}
              {settings.ignoreAccents ? T.accentsIgnored : T.accentsCount}
            </p>
          </div>
        )}

        {!part && finished && (
          <div className="card prompt">
            <span className="eyebrow">{T.finished}</span>
            <h1 className="prompt__name">{found.length} / {playable.length}</h1>
            <p className="muted">
              {missed.length === 0
                ? T.allFirstTry
                : T.remaining(missed.length)}
            </p>
            <button type="button" className="btn btn--primary" onClick={restart}>
              <ReplayIcon /> {T.restart}
            </button>
          </div>
        )}

        {part && (
          <form className="card answer" onSubmit={submit}>
            <span className="eyebrow eyebrow--dot">{T.highlighted}</span>
            <label htmlFor="answer" className="answer__label">{T.question}</label>
            <input
              ref={inputRef}
              id="answer"
              className="field"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder={T.example(PLATE_BY_ID[settings.plate].example)}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={verdict !== null}
            />
            {verdict === null && (
              <div className="actions">
                <button type="submit" className="btn btn--primary">{T.submit}</button>
                <button type="button" className="btn btn--secondary" onClick={() => conclude(false, '')}>{T.dontKnow}</button>
              </div>
            )}
          </form>
        )}

        <div aria-live="polite">
          {part && verdict === 'ok' && (
            <div className="verdict verdict--ok">
              <div className="verdict__title"><CheckIcon size={20} /> {T.exact(part.name)}</div>
              <p><Rich text={part.definition} /></p>
              <button type="button" className="btn btn--ghost" onClick={clear}>{T.another}</button>
            </div>
          )}
          {part && verdict === 'ko' && (
            <div className="verdict verdict--ko">
              <div className="verdict__title"><CrossIcon size={20} /> {T.notQuite}</div>
              <p>
                {typed ? T.youWrote(typed) : ''}
                {T.expected}<strong>{part.name}</strong><br />{T.staysRed}
              </p>
              <p className="verdict__def"><Rich text={part.definition} /></p>
              <button type="button" className="btn btn--ghost" onClick={clear}>{T.another}</button>
            </div>
          )}
        </div>

        <div className="found">
          <span className="eyebrow">{T.named}</span>
          {found.length === 0 ? (
            <span className="muted">{T.none}</span>
          ) : (
            <ul className="found__list">
              {found.map((id) => <li key={id}>{partIn(settings.plate, id).name}</li>)}
            </ul>
          )}
          {missed.length > 0 && (
            <>
              <span className="eyebrow">{T.missedList}</span>
              <ul className="found__list found__list--ko">
                {missed.map((id) => <li key={id}>{partIn(settings.plate, id).name}</li>)}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="plate play__plate" aria-label={T.plate}>
        <AntPlate plate={settings.plate} marks={marks} onPick={pick} locked={[...found, ...missed]} />
        <Legend items={['sel', 'done', 'missed', 'hover']} />
      </section>
    </main>
  );
}
