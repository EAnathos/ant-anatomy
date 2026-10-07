import { useState, type ReactNode } from 'react';
import { AntPlate } from '../components/AntPlate';
import { ArrowIcon } from '../components/icons';
import { SettingsPanel } from '../components/SettingsPanel';
import { PART_BY_ID, PLATES, REGION_BY_ID, partsInRegions, partsOf, regionsOf, type PartId, type PlateId, type RegionId } from '../data/parts';
import { t } from '../i18n';
import { playableParts, type Settings } from '../lib/session';

interface HomeProps {
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
          La planche représente une ouvrière de <em>Neoponera verenae</em>, une <em>Ponerinae</em>. D’une fourmi à l’autre, l’anatomie varie : certaines structures manquent, comme
          l’aiguillon chez les <em>Formicinae</em>, et d’autres s’ajoutent, comme le postpétiole chez les <em>Myrmicinae</em>.
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
          La planche représente l’aile antérieure d’une reine d’<em>Odontomachus</em> sp., une autre <em>Ponerinae</em> que l’ouvrière de la première planche. La nervation
          n’est pas la même chez toutes les fourmis : selon les genres, des nervures disparaissent et des cellules fusionnent ou restent ouvertes, et les ailes des mâles diffèrent souvent
          de celles des reines. Les ouvrières, elles, n’ont jamais d’ailes.
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
          The plate shows a worker of <em>Neoponera verenae</em>, a member of the <em>Ponerinae</em>. Anatomy varies from one ant to another: some structures are missing, such as
          the sting in <em>Formicinae</em>, and others are added, such as the postpetiole in <em>Myrmicinae</em>.
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
          The plate shows the forewing of an <em>Odontomachus</em> sp. queen, a different <em>Ponerinae</em> from the worker on the first plate. Venation is not the same in every
          ant: depending on the genus, veins disappear and cells merge or stay open, and the wings of males often differ from those of queens. Workers never have wings.
        </>
      ),
    },
  },
);

const T = t(
  {
    plate: 'Planche',
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

export function Home({ settings, onSettingsChange, onStartFind, onStartName }: HomeProps) {
  const [selected, setSelected] = useState<PartId | null>(null);
  const part = selected ? PART_BY_ID[selected] : null;
  const canPlay = playableParts(settings).length > 0;
  const intro = INTROS[settings.plate];
  const plateRegions = regionsOf(settings.plate).map((r) => r.id);
  const checked = plateRegions.filter((r) => settings.regions.includes(r));
  const active = checked.length > 0 ? checked : plateRegions;
  const shown = partsInRegions(active).length;

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
          </div>
          <figure className="plate">
          <AntPlate plate={settings.plate} marks={selected ? { [selected]: 'sel' } : undefined} onPick={setSelected} />
          <figcaption className="plate__caption" aria-live="polite">
            {part ? (
              <>
                <div className="plate__title">
                  <strong>{part.name}</strong>
                  <span className="eyebrow">{REGION_BY_ID[part.region].label}</span>
                </div>
                <span className="muted">{part.definition}</span>
              </>
            ) : (
              <span className="muted">{T.pickHint}</span>
            )}
          </figcaption>
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
