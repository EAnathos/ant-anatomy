import { useState, type ReactNode } from 'react';
import { AntPlate } from '../components/AntPlate';
import { ArrowIcon } from '../components/icons';
import { SettingsPanel } from '../components/SettingsPanel';
import { PART_BY_ID, PLATES, REGION_BY_ID, layersOf, partsInRegions, regionsOf, type LayerId, type PartId, type PlateId } from '../data/parts';
import { playableParts, type Settings } from '../lib/session';

interface HomeProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onStartFind: () => void;
  onStartName: () => void;
}

interface PlateIntro {
  title: (layers: readonly LayerId[]) => string;
  lead: (count: number, layers: readonly LayerId[]) => string;
  note: ReactNode;
}

const INTROS: Record<PlateId, PlateIntro> = {
  ouvriere: {
    title: () => 'Anatomie de la fourmi',
    lead: (n) => `${n} structures anatomiques, du scape à l’aiguillon. Repère-les sur la planche, puis nomme-les sans aide.`,
    note: (
      <>
        La planche représente une ouvrière de <em>Neoponera verenae</em>, une <em>Ponerinae</em>. D’une fourmi à l’autre, l’anatomie varie : certaines structures manquent, comme l’aiguillon
        chez les <em>Formicinae</em>, et d’autres s’ajoutent, comme le postpétiole chez les <em>Myrmicinae</em>.
      </>
    ),
  },
  aile: {
    title: (layers) =>
      layers.length === 1 ? (layers[0] === 'cellules' ? 'Cellules de l’aile' : 'Nervures de l’aile') : 'Anatomie de l’aile',
    lead: (n, layers) =>
      `${n} ${
        layers.length !== 1
          ? 'structures de l’aile antérieure, cellules et nervures'
          : layers[0] === 'cellules'
            ? 'structures de l’aile antérieure, du ptérostigma aux cellules de la base'
            : 'nervures de l’aile antérieure, de la costa aux nervures anales'
      }. Repère-les sur la planche, puis nomme-les sans aide.`,
    note: (
      <>
        La planche représente l’aile antérieure d’une reine d’<em>Odontomachus</em> sp., une autre <em>Ponerinae</em> que l’ouvrière de la première planche. La nervation n’est
        pas la même chez toutes les fourmis : selon les genres, des nervures disparaissent et des cellules fusionnent ou restent ouvertes, et les ailes des mâles diffèrent souvent de celles des
        reines. Les ouvrières, elles, n’ont jamais d’ailes.
      </>
    ),
  },
};

export function Home({ settings, onSettingsChange, onStartFind, onStartName }: HomeProps) {
  const [selected, setSelected] = useState<PartId | null>(null);
  const part = selected ? PART_BY_ID[selected] : null;
  const canPlay = playableParts(settings).length > 0;
  const intro = INTROS[settings.plate];
  const plateRegions = regionsOf(settings.plate).map((r) => r.id);
  const shown = partsInRegions(plateRegions, settings.layers).length;

  const choosePlate = (plate: PlateId) => {
    if (plate === settings.plate) return;
    setSelected(null);
    onSettingsChange({ ...settings, plate, regions: regionsOf(plate).map((r) => r.id), layers: layersOf(plate) });
  };

  return (
    <main className="container">
      <section className="hero hero--top">
        <div className="hero__text">
          <h1 className="display">{intro.title(settings.layers)}</h1>
          <p className="lead">{intro.lead(shown, settings.layers)}</p>
          <p className="note">{intro.note}</p>
        </div>
        <div className="hero__plate">
          <div className="plate-picker">
            <label className="select">
              <span className="sr-only">Planche</span>
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
              <span className="muted">Clique une structure de la planche pour l’identifier.</span>
            )}
          </figcaption>
          </figure>
        </div>
      </section>

      <section className="modes" aria-labelledby="modes-title">
        <h2 id="modes-title" className="section-title">Choisis un mode</h2>
        <div className="modes__grid">
          <article className="card mode-card">
            <h3>Trouver</h3>
            <p>Un nom s’affiche. Clique la structure correspondante sur la planche. Si elle existe en plusieurs exemplaires, n’importe laquelle compte.</p>
            <button type="button" className="btn btn--primary" onClick={onStartFind} disabled={!canPlay}>
              Commencer <ArrowIcon />
            </button>
          </article>
          <article className="card mode-card">
            <h3>Nommer</h3>
            <p>
              Clique une structure, puis tape son nom.{' '}
              {settings.ignoreAccents
                ? 'Accents, majuscules et synonymes courants sont acceptés.'
                : 'Majuscules et synonymes courants sont acceptés.'}
            </p>
            <button type="button" className="btn btn--primary" onClick={onStartName} disabled={!canPlay}>
              Commencer <ArrowIcon />
            </button>
          </article>
        </div>
      </section>

      <SettingsPanel settings={settings} onChange={onSettingsChange} />
    </main>
  );
}
