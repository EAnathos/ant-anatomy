import { AntPlate, type Marks } from '../components/AntPlate';
import { CheckIcon, CrossIcon, ReplayIcon } from '../components/icons';
import { REGION_BY_ID, partIn, type PartId, type PlateId } from '../data/parts';
import { LANG, t } from '../i18n';
import { formatDuration, summarize, type Answer } from '../lib/session';

const T = t(
  {
    perfect: 'Sans faute. Toutes les structures demandées ont été trouvées.',
    missed: (n: number, names: string) => `${n === 1 ? 'Une structure te résiste' : `${n} structures te résistent`} encore : ${names}.`,
    accuracy: 'Précision',
    accuracyValue: (n: number) => `${n} %`,
    duration: 'Durée',
    streak: 'Série max',
    replay: (n: number) => `Rejouer mes ${n > 1 ? `${n} erreurs` : 'erreur'}`,
    newGame: 'Nouvelle partie',
    changeMode: 'Changer de mode',
    missedCaption: 'Structures manquées pendant la session',
    details: 'Détail des réponses',
    asked: 'Demandé',
    region: 'Région',
    yourClick: 'Ton clic',
    yourClickLabel: 'Ton clic : ',
    result: 'Résultat',
    correct: 'Correct',
    wrong: 'Raté',
  },
  {
    perfect: 'Flawless. Every structure asked was found.',
    missed: (n: number, names: string) => `${n === 1 ? 'One structure still eludes you' : `${n} structures still elude you`}: ${names}.`,
    accuracy: 'Accuracy',
    accuracyValue: (n: number) => `${n}%`,
    duration: 'Time',
    streak: 'Best streak',
    replay: (n: number) => `Replay my ${n > 1 ? `${n} mistakes` : 'mistake'}`,
    newGame: 'New game',
    changeMode: 'Change mode',
    missedCaption: 'Structures missed during the session',
    details: 'Answer details',
    asked: 'Asked',
    region: 'Region',
    yourClick: 'Your click',
    yourClickLabel: 'Your click: ',
    result: 'Result',
    correct: 'Correct',
    wrong: 'Missed',
  },
);

interface ResultsProps {
  plate: PlateId;
  log: Answer[];
  durationMs: number;
  onReplay: (questions: PartId[]) => void;
  onRestart: () => void;
  onHome: () => void;
}

const listFormat = new Intl.ListFormat(LANG, { type: 'conjunction' });

export function Results({ plate, log, durationMs, onReplay, onRestart, onHome }: ResultsProps) {
  const summary = summarize(log);
  const missedNames = summary.missed.map((id) => partIn(plate, id).name);
  const marks: Marks = Object.fromEntries(summary.missed.map((id) => [id, 'ko']));

  const message =
    summary.missed.length === 0
      ? T.perfect
      : T.missed(summary.missed.length, listFormat.format(missedNames));

  return (
    <main className="container">
      <section className="hero">
        <div className="hero__text">
          <h1 className="big-score">
            <span>{summary.score}</span>
            <span className="big-score__total">/ {summary.total}</span>
          </h1>
          <p className="lead">{message}</p>
          <dl className="stats stats--small">
            <div><dt>{T.accuracy}</dt><dd>{T.accuracyValue(summary.accuracy)}</dd></div>
            <div><dt>{T.duration}</dt><dd>{formatDuration(durationMs)}</dd></div>
            <div><dt>{T.streak}</dt><dd>{summary.bestStreak}</dd></div>
          </dl>
          <div className="actions">
            {summary.missed.length > 0 ? (
              <button type="button" className="btn btn--primary" onClick={() => onReplay(summary.missed)}>
                <ReplayIcon /> {T.replay(summary.missed.length)}
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={onRestart}>
                <ReplayIcon /> {T.newGame}
              </button>
            )}
            <button type="button" className="btn btn--secondary" onClick={onHome}>{T.changeMode}</button>
          </div>
        </div>
        <figure className="plate hero__plate">
          <AntPlate plate={plate} marks={marks} />
          <figcaption className="plate__caption plate__caption--row">
            <span className="swatch swatch--ko" aria-hidden="true" />
            <span className="muted">{T.missedCaption}</span>
          </figcaption>
        </figure>
      </section>

      <section className="details" aria-labelledby="details-title">
        <h2 id="details-title" className="section-title">{T.details}</h2>
        <div className="table-scroll">
          <table className="results-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{T.asked}</th>
                <th scope="col">{T.region}</th>
                <th scope="col">{T.yourClick}</th>
                <th scope="col">{T.result}</th>
              </tr>
            </thead>
            <tbody>
              {log.map((a, i) => (
                <tr key={`${a.asked}-${i}`}>
                  <td className="mono muted">{String(i + 1).padStart(2, '0')}</td>
                  <td className="results-table__asked">{partIn(plate, a.asked).name}</td>
                  <td className="muted">{REGION_BY_ID[partIn(plate, a.asked).region].label}</td>
                  <td className={a.correct ? 'results-table__click results-table__click--same' : 'results-table__click'}>
                    <span className="results-table__label">{T.yourClickLabel}</span>
                    {partIn(plate, a.picked).name}
                  </td>
                  <td>
                    {a.correct ? (
                      <span className="tag tag--ok"><CheckIcon size={14} /> {T.correct}</span>
                    ) : (
                      <span className="tag tag--ko"><CrossIcon size={14} /> {T.wrong}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
