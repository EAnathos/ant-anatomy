import { useRef, useState } from 'react';
import { AntPlate, type Marks } from '../components/AntPlate';
import { ArrowIcon, BulbIcon, CheckIcon, CrossIcon } from '../components/icons';
import { Legend } from '../components/Legend';
import { PART_BY_ID, REGION_BY_ID, type PartId, type PlateId } from '../data/parts';
import type { Answer } from '../lib/session';

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
  const part = PART_BY_ID[asked];
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
      <section className="play__side" aria-label="Question en cours">
        <div className="progress">
          <div className="progress__row">
            <span className="mono ink">Question {index + 1} / {questions.length}</span>
            <span className="score">
              <span className="score--ok"><CheckIcon /> {good}<span className="sr-only"> bonnes réponses</span></span>
              <span className="score--ko"><CrossIcon /> {log.length - good}<span className="sr-only"> erreurs</span></span>
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
          <span className="eyebrow">Clique sur</span>
          <h1 className="prompt__name">{part.name}</h1>
          {hint ? (
            <span className="hint-pill"><BulbIcon /> Région : {REGION_BY_ID[part.region].label}</span>
          ) : (
            <button type="button" className="btn btn--secondary btn--small" onClick={() => setHint(true)} disabled={answered}>
              Indice : afficher la région
            </button>
          )}
        </div>

        <div aria-live="polite">
          {answered && correct && (
            <div className="verdict verdict--ok">
              <div className="verdict__title"><CheckIcon size={20} /> Bien vu !</div>
              <p>{part.definition}</p>
            </div>
          )}
          {answered && !correct && picked && (
            <div className="verdict verdict--ko">
              <div className="verdict__title"><CrossIcon size={20} /> Raté, tu as cliqué « {PART_BY_ID[picked].name} »</div>
              <p>La bonne structure est surlignée en vert. {part.definition}</p>
            </div>
          )}
        </div>

        {answered ? (
          <button type="button" className="btn btn--primary" onClick={next} autoFocus>
            {isLast ? 'Voir le bilan' : 'Question suivante'} <ArrowIcon />
          </button>
        ) : (
          <p className="muted play__help">
            Survole la planche : les structures s’éclairent au passage.
            {plate === 'ouvriere' && ' Pour une structure présente plusieurs fois (fémur, griffe…), n’importe laquelle compte.'}
          </p>
        )}
      </section>

      <section className="plate play__plate" aria-label="Planche anatomique">
        <AntPlate plate={plate} marks={marks} onPick={pick} />
        <Legend items={['ok', 'ko', 'hover']} />
      </section>
    </main>
  );
}
