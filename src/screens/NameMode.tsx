import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AntPlate, type Marks } from '../components/AntPlate';
import { CheckIcon, CrossIcon, CursorIcon, ReplayIcon } from '../components/icons';
import { Legend } from '../components/Legend';
import { PART_BY_ID, PLATE_BY_ID, partsOf, type PartId } from '../data/parts';
import { isCorrectName } from '../lib/answers';
import { playableParts, type Settings } from '../lib/session';

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
  const part = selected ? PART_BY_ID[selected] : null;
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
      <section className="play__side" aria-label="Réponse">
        <div className="progress">
          <div className="progress__row">
            <span className="eyebrow">Structures tentées</span>
            <span className="score">
              <span className="score--ok"><CheckIcon /> {found.length}<span className="sr-only"> trouvées</span></span>
              <span className="score--ko"><CrossIcon /> {missed.length}<span className="sr-only"> ratées</span></span>
              <span className="ink">{attempted} / {playable.length}</span>
            </span>
          </div>
          <div
            className="bar"
            role="progressbar"
            aria-label="Structures tentées"
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
            <h1>Clique une structure</h1>
            <p className="muted">
              Choisis une structure de la planche, puis écris son nom. Tu n’as qu’un essai par structure.
              {settings.ignoreAccents ? ' Les accents et les majuscules ne comptent pas.' : ' Les majuscules ne comptent pas, les accents si.'}
            </p>
          </div>
        )}

        {!part && finished && (
          <div className="card prompt">
            <span className="eyebrow">Planche terminée</span>
            <h1 className="prompt__name">{found.length} / {playable.length}</h1>
            <p className="muted">
              {missed.length === 0
                ? 'Toutes les structures ont été nommées du premier coup.'
                : `${missed.length} ${missed.length > 1 ? 'structures restent' : 'structure reste'} en rouge sur la planche.`}
            </p>
            <button type="button" className="btn btn--primary" onClick={restart}>
              <ReplayIcon /> Recommencer
            </button>
          </div>
        )}

        {part && (
          <form className="card answer" onSubmit={submit}>
            <span className="eyebrow eyebrow--dot">Structure surlignée</span>
            <label htmlFor="answer" className="answer__label">Comment s’appelle-t-elle ?</label>
            <input
              ref={inputRef}
              id="answer"
              className="field"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder={`ex. ${PLATE_BY_ID[settings.plate].example}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={verdict !== null}
            />
            {verdict === null && (
              <div className="actions">
                <button type="submit" className="btn btn--primary">Valider</button>
                <button type="button" className="btn btn--secondary" onClick={() => conclude(false, '')}>Je ne sais pas</button>
              </div>
            )}
          </form>
        )}

        <div aria-live="polite">
          {part && verdict === 'ok' && (
            <div className="verdict verdict--ok">
              <div className="verdict__title"><CheckIcon size={20} /> Exact : {part.name}</div>
              <p>{part.definition}</p>
              <button type="button" className="btn btn--ghost" onClick={clear}>Choisir une autre structure</button>
            </div>
          )}
          {part && verdict === 'ko' && (
            <div className="verdict verdict--ko">
              <div className="verdict__title"><CrossIcon size={20} /> Pas tout à fait</div>
              <p>
                {typed ? `Tu as écrit « ${typed} ». ` : ''}
                Réponse attendue : <strong>{part.name}</strong>. Elle reste en rouge sur la planche.
              </p>
              <p className="verdict__def">{part.definition}</p>
              <button type="button" className="btn btn--ghost" onClick={clear}>Choisir une autre structure</button>
            </div>
          )}
        </div>

        <div className="found">
          <span className="eyebrow">Nommées</span>
          {found.length === 0 ? (
            <span className="muted">Aucune pour l’instant.</span>
          ) : (
            <ul className="found__list">
              {found.map((id) => <li key={id}>{PART_BY_ID[id].name}</li>)}
            </ul>
          )}
          {missed.length > 0 && (
            <>
              <span className="eyebrow">Ratées</span>
              <ul className="found__list found__list--ko">
                {missed.map((id) => <li key={id}>{PART_BY_ID[id].name}</li>)}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="plate play__plate" aria-label="Planche anatomique">
        <AntPlate plate={settings.plate} marks={marks} onPick={pick} locked={[...found, ...missed]} />
        <Legend items={['sel', 'done', 'missed', 'hover']} />
      </section>
    </main>
  );
}
