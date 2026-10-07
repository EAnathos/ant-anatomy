import { LAYERS, PARTS, REGION_BY_ID, layersOf, regionsOf, type LayerId, type RegionId } from '../data/parts';
import { playableParts, type QuestionCount, type Settings } from '../lib/session';

const COUNTS: { value: QuestionCount; label: string }[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 'all', label: 'Toutes' },
];

interface SettingsPanelProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const plateLayers = LAYERS.filter((l) => layersOf(settings.plate).includes(l.id));
  const plateRegions = regionsOf(settings.plate).filter((r) => !r.layer || settings.layers.includes(r.layer));
  const included = playableParts(settings).length;
  const countIn = (pred: (region: RegionId) => boolean) => PARTS.filter((p) => pred(p.region)).length;

  const toggleLayer = (id: LayerId) => {
    const layers = settings.layers.includes(id)
      ? settings.layers.filter((l) => l !== id)
      : LAYERS.map((l) => l.id).filter((l) => l === id || settings.layers.includes(l));
    onChange({ ...settings, layers });
  };

  const toggleRegion = (id: RegionId) => {
    const regions = settings.regions.includes(id)
      ? settings.regions.filter((r) => r !== id)
      : regionsOf(settings.plate).map((r) => r.id).filter((r) => r === id || settings.regions.includes(r));
    onChange({ ...settings, regions });
  };

  return (
    <section className="settings" aria-labelledby="settings-title">
      <div className="settings__head">
        <h2 id="settings-title">Paramètres de session</h2>
        <span className="mono muted">{included} structures incluses</span>
      </div>
      <div className="settings__body">
        {plateLayers.length > 0 && (
          <fieldset className="settings__group settings__group--wide">
            <legend className="eyebrow">Structures</legend>
            <div className="chips">
              {plateLayers.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="chip"
                  aria-pressed={settings.layers.includes(l.id)}
                  onClick={() => toggleLayer(l.id)}
                >
                  {l.label}
                  <span className="chip__count">
                    {countIn((region) => REGION_BY_ID[region].layer === l.id)}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset className="settings__group settings__group--wide">
          <legend className="eyebrow">Régions incluses</legend>
          <div className="chips">
            {plateRegions.map((r) => (
              <button
                key={r.id}
                type="button"
                className="chip"
                aria-pressed={settings.regions.includes(r.id)}
                onClick={() => toggleRegion(r.id)}
              >
                {r.label}
                <span className="chip__count">{countIn((region) => region === r.id)}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="settings__group">
          <legend className="eyebrow">Questions (Trouver)</legend>
          <div className="segmented">
            {COUNTS.map((c) => (
              <button
                key={c.label}
                type="button"
                aria-pressed={settings.questionCount === c.value}
                onClick={() => onChange({ ...settings, questionCount: c.value })}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="settings__group">
          <legend className="eyebrow">Saisie (Nommer)</legend>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={settings.ignoreAccents}
              onChange={(e) => onChange({ ...settings, ignoreAccents: e.target.checked })}
            />
            Ignorer les accents
          </label>
        </fieldset>
      </div>
      {included === 0 && (
        <p className="settings__warning">
          {plateLayers.length > 0 && settings.layers.length === 0
            ? 'Choisis au moins un type de structure pour jouer.'
            : 'Choisis au moins une région pour jouer.'}
        </p>
      )}
    </section>
  );
}
