import { AntPlate, type Marks } from '../components/AntPlate';
import { CheckIcon, CrossIcon, ReplayIcon } from '../components/icons';
import { PART_BY_ID, REGION_BY_ID, type PartId, type PlateId } from '../data/parts';
import { formatDuration, summarize, type Answer } from '../lib/session';

interface ResultsProps {
  plate: PlateId;
  log: Answer[];
  durationMs: number;
  onReplay: (questions: PartId[]) => void;
  onRestart: () => void;
  onHome: () => void;
}

const listFormat = new Intl.ListFormat('fr', { type: 'conjunction' });

export function Results({ plate, log, durationMs, onReplay, onRestart, onHome }: ResultsProps) {
  const summary = summarize(log);
  const missedNames = summary.missed.map((id) => PART_BY_ID[id].name);
  const marks: Marks = Object.fromEntries(summary.missed.map((id) => [id, 'ko']));

  const message =
    summary.missed.length === 0
      ? 'Sans faute. Toutes les structures demandées ont été trouvées.'
      : `${summary.missed.length === 1 ? 'Une structure te résiste' : `${summary.missed.length} structures te résistent`} encore : ${listFormat.format(missedNames)}.`;

  return (
    <main className="container">
      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow">Bilan · Trouver</span>
          <h1 className="big-score">
            <span>{summary.score}</span>
            <span className="big-score__total">/ {summary.total}</span>
          </h1>
          <p className="lead">{message}</p>
          <dl className="stats stats--small">
            <div><dt>Précision</dt><dd>{summary.accuracy} %</dd></div>
            <div><dt>Durée</dt><dd>{formatDuration(durationMs)}</dd></div>
            <div><dt>Série max</dt><dd>{summary.bestStreak}</dd></div>
          </dl>
          <div className="actions">
            {summary.missed.length > 0 ? (
              <button type="button" className="btn btn--primary" onClick={() => onReplay(summary.missed)}>
                <ReplayIcon /> Rejouer mes {summary.missed.length > 1 ? `${summary.missed.length} erreurs` : 'erreur'}
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={onRestart}>
                <ReplayIcon /> Nouvelle partie
              </button>
            )}
            <button type="button" className="btn btn--secondary" onClick={onHome}>Changer de mode</button>
          </div>
        </div>
        <figure className="plate hero__plate">
          <AntPlate plate={plate} marks={marks} />
          <figcaption className="plate__caption plate__caption--row">
            <span className="swatch swatch--ko" aria-hidden="true" />
            <span className="muted">Structures manquées pendant la session</span>
          </figcaption>
        </figure>
      </section>

      <section className="details" aria-labelledby="details-title">
        <h2 id="details-title" className="section-title">Détail des réponses</h2>
        <div className="table-scroll">
          <table className="results-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Demandé</th>
                <th scope="col">Région</th>
                <th scope="col">Ton clic</th>
                <th scope="col">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {log.map((a, i) => (
                <tr key={`${a.asked}-${i}`}>
                  <td className="mono muted">{String(i + 1).padStart(2, '0')}</td>
                  <td className="results-table__asked">{PART_BY_ID[a.asked].name}</td>
                  <td className="muted">{REGION_BY_ID[PART_BY_ID[a.asked].region].label}</td>
                  <td>{PART_BY_ID[a.picked].name}</td>
                  <td>
                    {a.correct ? (
                      <span className="tag tag--ok"><CheckIcon size={14} /> Correct</span>
                    ) : (
                      <span className="tag tag--ko"><CrossIcon size={14} /> Raté</span>
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
