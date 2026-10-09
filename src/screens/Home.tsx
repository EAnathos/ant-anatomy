import { useState, type ReactNode } from 'react';
import { AntPlate } from '../components/AntPlate';
import { ArrowIcon, DiceIcon, MagnifierIcon } from '../components/icons';
import { Rich } from '../components/Rich';
import { SettingsPanel } from '../components/SettingsPanel';
import { PLATES, REGION_BY_ID, partsInRegions, partsOf, regionsOf, partIn, type PartId, type PlateId, type RegionId } from '../data/parts';
import { t } from '../i18n';
import { playableParts, type Settings } from '../lib/session';

interface HomeProps {
  /** Structure sélectionnée à l'arrivée (lien « Voir sur la planche » du glossaire). */
  initialSelected?: PartId;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onStartFind: () => void;
  onStartName: () => void;
}

/** `regions` : régions de la planche cochées dans les paramètres (toutes si aucune). */
interface PlateIntro {
  title: (regions: readonly RegionId[]) => string;
  lead: (count: number, regions: readonly RegionId[]) => string;
  note: ReactNode;
  /** Source et licence du dessin, sous le texte. */
  credit: ReactNode;
}

const WORKER_COUNT = partsOf('ouvriere').length;
const only = (regions: readonly RegionId[], id: RegionId) => regions.length === 1 && regions[0] === id;

const INTROS = t<Record<PlateId, PlateIntro>>(
  {
    ouvriere: {
      title: () => 'Anatomie de la fourmi',
      lead: () => `${WORKER_COUNT} structures anatomiques, du scape à l’aiguillon. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche représente une ouvrière de <em>Neoponera verenae</em>, une Ponerinae. D’une fourmi à l’autre, l’anatomie varie : certaines structures manquent, comme
          l’aiguillon chez les Formicinae, et d’autres s’ajoutent, comme le postpétiole chez les Myrmicinae.
        </>
      ),
      credit: (
        <>
          Planche :{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg" target="_blank" rel="noopener noreferrer">
            Scheme ant worker anatomy
          </a>
          , par LadyofHats et Sophivorus, domaine public, via Wikimedia Commons.
        </>
      ),
    },
    aile: {
      title: (regions) =>
        only(regions, 'cellules') ? 'Cellules de l’aile' : only(regions, 'nervures') ? 'Nervures de l’aile' : 'Anatomie de l’aile',
      lead: (n, regions) =>
        `${n} ${
          only(regions, 'cellules')
            ? 'structures de l’aile antérieure, du ptérostigma aux cellules de la base'
            : only(regions, 'nervures')
              ? 'nervures de l’aile antérieure, de la costa aux nervures anales'
              : 'structures de l’aile antérieure, cellules et nervures'
        }. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche représente l’aile antérieure d’une reine d’<em>Odontomachus</em> sp., une autre Ponerinae que l’ouvrière de la première planche. La nervation
          n’est pas la même chez toutes les fourmis : selon les genres, des nervures disparaissent et des cellules fusionnent ou restent ouvertes, et les ailes des mâles diffèrent souvent
          de celles des reines. Les ouvrières, elles, n’ont jamais d’ailes.
        </>
      ),
      credit: (
        <>
          Planche : dessin d’EAnathos, sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
  },
  {
    ouvriere: {
      title: () => 'Ant anatomy',
      lead: () => `${WORKER_COUNT} anatomical structures, from scape to sting. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows a worker of <em>Neoponera verenae</em>, a member of the Ponerinae. Anatomy varies from one ant to another: some structures are missing, such as
          the sting in Formicinae, and others are added, such as the postpetiole in Myrmicinae.
        </>
      ),
      credit: (
        <>
          Plate:{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg" target="_blank" rel="noopener noreferrer">
            Scheme ant worker anatomy
          </a>
          , by LadyofHats and Sophivorus, public domain, via Wikimedia Commons.
        </>
      ),
    },
    aile: {
      title: (regions) => (only(regions, 'cellules') ? 'Wing cells' : only(regions, 'nervures') ? 'Wing veins' : 'Wing anatomy'),
      lead: (n, regions) =>
        `${n} ${
          only(regions, 'cellules')
            ? 'structures of the forewing, from the pterostigma to the basal cells'
            : only(regions, 'nervures')
              ? 'veins of the forewing, from the costa to the anal veins'
              : 'structures of the forewing, cells and veins'
        }. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows the forewing of an <em>Odontomachus</em> sp. queen, a different Ponerinae from the worker on the first plate. Venation is not the same in every
          ant: depending on the genus, veins disappear and cells merge or stay open, and the wings of males often differ from those of queens. Workers never have wings.
        </>
      ),
      credit: (
        <>
          Plate: drawing by EAnathos, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
  },
);

const T = t(
  {
    plate: 'Planche',
    random: 'Structure au hasard',
    showLabels: 'Afficher tous les noms sur la planche',
    legend: 'Structures numérotées sur la planche',
    pickHint: 'Clique une structure de la planche pour l’identifier.',
    chooseMode: 'Choisis un mode',
    find: 'Trouver',
    findText: 'Un nom s’affiche. Clique la structure correspondante sur la planche. Si elle existe en plusieurs exemplaires, n’importe laquelle compte.',
    name: 'Nommer',
    nameText: 'Clique une structure, puis tape son nom.',
    acceptedAccents: 'Accents, majuscules et synonymes courants sont acceptés.',
    accepted: 'Majuscules et synonymes courants sont acceptés.',
    start: 'Commencer',
  },
  {
    plate: 'Plate',
    random: 'Random structure',
    showLabels: 'Show every name on the plate',
    legend: 'Structures numbered on the plate',
    pickHint: 'Click a structure on the plate to identify it.',
    chooseMode: 'Choose a mode',
    find: 'Find',
    findText: 'A name appears. Click the matching structure on the plate. If it occurs several times, any of them counts.',
    name: 'Name',
    nameText: 'Click a structure, then type its name.',
    acceptedAccents: 'Accents, capitals and common synonyms are accepted.',
    accepted: 'Capitals and common synonyms are accepted.',
    start: 'Start',
  },
);

export function Home({ initialSelected, settings, onSettingsChange, onStartFind, onStartName }: HomeProps) {
  const [selected, setSelected] = useState<PartId | null>(initialSelected ?? null);
  const [labels, setLabels] = useState(false);
  const part = selected ? partIn(settings.plate, selected) : null;
  const canPlay = playableParts(settings).length > 0;
  const intro = INTROS[settings.plate];
  const plateRegions = regionsOf(settings.plate).map((r) => r.id);
  const checked = plateRegions.filter((r) => settings.regions.includes(r));
  const active = checked.length > 0 ? checked : plateRegions;
  const shown = partsInRegions(active).length;

  // Une structure tirée au hasard parmi celles des régions affichées, jamais deux fois la même d'affilée.
  const pickRandom = () => {
    const pool = partsInRegions(active).filter((p) => p.id !== selected);
    if (pool.length > 0) setSelected(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const choosePlate = (plate: PlateId) => {
    if (plate === settings.plate) return;
    setSelected(null);
    onSettingsChange({ ...settings, plate, regions: regionsOf(plate).map((r) => r.id) });
  };

  return (
    <main className="container">
      <section className="hero hero--top">
        <div className="hero__text">
          <h1 className="display">{intro.title(active)}</h1>
          <p className="lead">{intro.lead(shown, active)}</p>
          <p className="note">{intro.note}</p>
          <p className="plate-credit">{intro.credit}</p>
        </div>
        <div className="hero__plate">
          <div className="plate-picker">
            <label className="select">
              <span className="sr-only">{T.plate}</span>
              <select value={settings.plate} onChange={(e) => choosePlate(e.target.value as PlateId)}>
                {PLATES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.subject} · {p.taxon}{p.sp ? ' sp.' : ''}
                  </option>
                ))}
              </select>
            </label>
            <div className="plate-tools">
              <button type="button" className="icon-btn" onClick={pickRandom} aria-label={T.random} title={T.random}>
                <DiceIcon />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setLabels((v) => !v)}
                aria-pressed={labels}
                aria-label={T.showLabels}
                title={T.showLabels}
              >
                <MagnifierIcon />
              </button>
            </div>
          </div>
          <figure className="plate">
          <AntPlate plate={settings.plate} marks={selected ? { [selected]: 'sel' } : undefined} onPick={setSelected} labels={labels} />
          <figcaption className="plate__caption" aria-live="polite">
            {part ? (
              <>
                <div className="plate__title">
                  <strong>{part.name}</strong>
                  <span className="eyebrow">{REGION_BY_ID[part.region].label}</span>
                </div>
                <span className="muted"><Rich text={part.definition} /></span>
              </>
            ) : (
              <span className="muted">{T.pickHint}</span>
            )}
          </figcaption>
          {labels && (
            <ol className="plate-legend" aria-label={T.legend}>
              {partsOf(settings.plate).map((p, i) => (
                <li key={p.id} className={p.id === selected ? 'plate-legend__item--sel' : undefined}>
                  <button type="button" onClick={() => setSelected(p.id)}>
                    <span className="plate-legend__num" aria-hidden="true">{i + 1}</span>
                    {p.name}
                  </button>
                </li>
              ))}
            </ol>
          )}
          </figure>
        </div>
      </section>

      <section className="modes" aria-labelledby="modes-title">
        <h2 id="modes-title" className="section-title">{T.chooseMode}</h2>
        <div className="modes__grid">
          <article className="card mode-card">
            <h3>{T.find}</h3>
            <p>{T.findText}</p>
            <button type="button" className="btn btn--primary" onClick={onStartFind} disabled={!canPlay}>
              {T.start} <ArrowIcon />
            </button>
          </article>
          <article className="card mode-card">
            <h3>{T.name}</h3>
            <p>
              {T.nameText} {settings.ignoreAccents ? T.acceptedAccents : T.accepted}
            </p>
            <button type="button" className="btn btn--primary" onClick={onStartName} disabled={!canPlay}>
              {T.start} <ArrowIcon />
            </button>
          </article>
        </div>
      </section>

      <SettingsPanel settings={settings} onChange={onSettingsChange} />
    </main>
  );
}
