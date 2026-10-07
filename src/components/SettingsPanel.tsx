import { PARTS, REGIONS, partsInRegions, type RegionId } from '../data/parts';
import type { QuestionCount, Settings } from '../lib/session';

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
  const included = partsInRegions(settings.regions).length;

  const toggleRegion = (id: RegionId) => {
    const regions = settings.regions.includes(id)
      ? settings.regions.filter((r) => r !== id)
      : REGIONS.map((r) => r.id).filter((r) => r === id || settings.regions.includes(r));
    onChange({ ...settings, regions });
  };

  return (
    <section className="settings" aria-labelledby="settings-title">
      <div className="settings__head">
        <h2 id="settings-title">Paramètres de session</h2>
        <span className="mono muted">{included} structures incluses</span>
      </div>
      <div className="settings__body">
        <fieldset className="settings__group settings__group--wide">
          <legend className="eyebrow">Régions incluses</legend>
          <div className="chips">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                className="chip"
                aria-pressed={settings.regions.includes(r.id)}
                onClick={() => toggleRegion(r.id)}
              >
                {r.label}
                <span className="chip__count">{PARTS.filter((p) => p.region === r.id).length}</span>
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
      {included === 0 && <p className="settings__warning">Choisis au moins une région pour jouer.</p>}
    </section>
  );
}
