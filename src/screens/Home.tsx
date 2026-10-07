import { useState } from 'react';
import { AntPlate } from '../components/AntPlate';
import { ArrowIcon } from '../components/icons';
import { SettingsPanel } from '../components/SettingsPanel';
import { PART_BY_ID, PARTS, REGION_BY_ID, REGIONS, partsInRegions, type PartId } from '../data/parts';
import type { Settings } from '../lib/session';

interface HomeProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onStartFind: () => void;
  onStartName: () => void;
}

export function Home({ settings, onSettingsChange, onStartFind, onStartName }: HomeProps) {
  const [selected, setSelected] = useState<PartId | null>(null);
  const part = selected ? PART_BY_ID[selected] : null;
  const canPlay = partsInRegions(settings.regions).length > 0;

  return (
    <main className="container">
      <section className="hero">
        <div className="hero__text">
          <h1 className="display">Anatomie de la fourmi</h1>
          <p className="lead">
            {PARTS.length} structures anatomiques, du scape à l’aiguillon. Repère-les sur la planche, puis nomme-les sans aide.
          </p>
          <dl className="stats">
            <div><dt>Structures</dt><dd>{PARTS.length}</dd></div>
            <div><dt>Régions</dt><dd>{REGIONS.length}</dd></div>
            <div><dt>Modes de jeu</dt><dd>2</dd></div>
          </dl>
        </div>
        <figure className="plate hero__plate">
          <AntPlate marks={selected ? { [selected]: 'sel' } : undefined} onPick={setSelected} />
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
      </section>

      <section className="modes" aria-labelledby="modes-title">
        <h2 id="modes-title" className="section-title">Choisis un mode</h2>
        <div className="modes__grid">
          <article className="card mode-card">
            <h3>Trouver</h3>
            <p>Un nom s’affiche. Clique la structure correspondante sur la fourmi. Si elle existe en plusieurs exemplaires, n’importe laquelle compte.</p>
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
