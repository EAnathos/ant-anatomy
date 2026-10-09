import { useRef, useState } from 'react';
import { AntPlate, type Marks } from '../components/AntPlate';
import { ArrowIcon, BulbIcon, CheckIcon, CrossIcon } from '../components/icons';
import { Legend } from '../components/Legend';
import { Rich } from '../components/Rich';
import { REGION_BY_ID, partIn, type PartId, type PlateId } from '../data/parts';
import { t } from '../i18n';
import type { Answer } from '../lib/session';

const T = t(
  {
    current: 'Question en cours',
    good: ' bonnes réponses',
    bad: ' erreurs',
    clickOn: 'Clique sur',
    region: (label: string) => `Région : ${label}`,
    hint: 'Indice : afficher la région',
    right: 'Bien vu !',
    wrong: (name: string) => `Raté, tu as cliqué « ${name} »`,
    shownInGreen: 'La bonne structure est surlignée en vert.',
    results: 'Voir le bilan',
    next: 'Question suivante',
    help: 'Survole la planche : les structures s’éclairent au passage.',
    helpRepeated: ' Pour une structure présente plusieurs fois (fémurs, denticules…), n’importe laquelle compte.',
    plate: 'Planche anatomique',
  },
  {
    current: 'Current question',
    good: ' correct answers',
    bad: ' mistakes',
    clickOn: 'Click on',
    region: (label: string) => `Region: ${label}`,
    hint: 'Hint: show the region',
    right: 'Well spotted!',
    wrong: (name: string) => `Missed, you clicked “${name}”`,
    shownInGreen: 'The right structure is highlighted in green.',
    results: 'See results',
    next: 'Next question',
    help: 'Hover over the plate: structures light up as you go.',
    helpRepeated: ' For a structure present several times (femora, denticles…), any of them counts.',
    plate: 'Anatomical plate',
  },
);

interface FindModeProps {
  plate: PlateId;
  questions: PartId[];
  onFinish: (log: Answer[], durationMs: number) => void;
}

export function FindMode({ plate, questions, onFinish }: FindModeProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<PartId | null>(null);
  const [log, setLog] = useState<Answer[]>([]);
  const [hint, setHint] = useState(false);
  const startedAt = useRef(Date.now());

  const asked = questions[index];
  const part = partIn(plate, asked);
  const answered = picked !== null;
  const correct = picked === asked;
  const isLast = index === questions.length - 1;
  const good = log.filter((a) => a.correct).length;

  const marks: Marks = {};
  if (picked) {
    if (!correct) marks[picked] = 'ko';
    marks[asked] = 'ok';
  }

  const pick = (id: PartId) => {
    if (answered) return;
    setPicked(id);
    setLog((l) => [...l, { asked, picked: id, correct: id === asked }]);
  };

  const next = () => {
    if (isLast) {
      onFinish(log, Date.now() - startedAt.current);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setHint(false);
  };

  return (
    <main className="container play">
      <section className="play__side" aria-label={T.current}>
        <div className="progress">
          <div className="progress__row">
            <span className="mono ink">Question {index + 1} / {questions.length}</span>
            <span className="score">
              <span className="score--ok"><CheckIcon /> {good}<span className="sr-only">{T.good}</span></span>
              <span className="score--ko"><CrossIcon /> {log.length - good}<span className="sr-only">{T.bad}</span></span>
            </span>
          </div>
          <div className="dots" aria-hidden="true">
            {questions.map((q, i) => {
              const a = log[i];
              const state = a ? (a.correct ? 'ok' : 'ko') : i === index ? 'current' : 'todo';
              return <span key={`${q}-${i}`} className={`dot dot--${state}`} />;
            })}
          </div>
        </div>

        <div className="card prompt">
          <span className="eyebrow">{T.clickOn}</span>
          <h1 className="prompt__name">{part.name}</h1>
          {hint ? (
            <span className="hint-pill"><BulbIcon /> {T.region(REGION_BY_ID[part.region].label)}</span>
          ) : (
            <button type="button" className="btn btn--secondary btn--small" onClick={() => setHint(true)} disabled={answered}>
              {T.hint}
            </button>
          )}
        </div>

        <div aria-live="polite">
          {answered && correct && (
            <div className="verdict verdict--ok">
              <div className="verdict__title"><CheckIcon size={20} /> {T.right}</div>
              <p><Rich text={part.definition} /></p>
            </div>
          )}
          {answered && !correct && picked && (
            <div className="verdict verdict--ko">
              <div className="verdict__title"><CrossIcon size={20} /> {T.wrong(partIn(plate, picked).name)}</div>
              <p>{T.shownInGreen} <Rich text={part.definition} /></p>
            </div>
          )}
        </div>

        {answered ? (
          <button type="button" className="btn btn--primary" onClick={next} autoFocus>
            {isLast ? T.results : T.next} <ArrowIcon />
          </button>
        ) : (
          <p className="muted play__help">
            {T.help}
            {plate !== 'aile' && T.helpRepeated}
          </p>
        )}
      </section>

      <section className="plate play__plate" aria-label={T.plate}>
        <AntPlate plate={plate} marks={marks} onPick={pick} />
        <Legend items={['ok', 'ko', 'hover']} />
      </section>
    </main>
  );
}
