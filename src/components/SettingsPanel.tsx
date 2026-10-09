import { PARTS, regionsOf, type RegionId } from '../data/parts';
import { t } from '../i18n';
import { playableParts, type QuestionCount, type Settings } from '../lib/session';

const T = t(
  {
    title: 'Paramètres de session',
    plates: 'Planches',
    thisPlate: 'Celle-ci',
    allPlates: 'Toutes',
    included: (n: number) => `${n} structures incluses`,
    regions: 'Régions incluses',
    questions: 'Questions (Trouver)',
    all: 'Toutes',
    typing: 'Saisie (Nommer)',
    ignoreAccents: 'Ignorer les accents',
    noRegion: 'Choisis au moins une région pour jouer.',
  },
  {
    title: 'Session settings',
    plates: 'Plates',
    thisPlate: 'This one',
    allPlates: 'All',
    included: (n: number) => `${n} structures included`,
    regions: 'Regions included',
    questions: 'Questions (Find)',
    all: 'All',
    typing: 'Typing (Name)',
    ignoreAccents: 'Ignore accents',
    noRegion: 'Choose at least one region to play.',
  },
);

const COUNTS: { value: QuestionCount; label: string }[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 'all', label: T.all },
];

interface SettingsPanelProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const plateRegions = regionsOf(settings.plate);
  const included = playableParts(settings).length;
  const countIn = (region: RegionId) => PARTS.filter((p) => p.region === region).length;

  const toggleRegion = (id: RegionId) => {
    const regions = settings.regions.includes(id)
      ? settings.regions.filter((r) => r !== id)
      : plateRegions.map((r) => r.id).filter((r) => r === id || settings.regions.includes(r));
    onChange({ ...settings, regions });
  };

  return (
    <section className="settings" aria-labelledby="settings-title">
      <div className="settings__head">
        <h2 id="settings-title">{T.title}</h2>
        <span className="mono muted">{T.included(included)}</span>
      </div>
      <div className="settings__body">
        <fieldset className="settings__group">
          <legend className="eyebrow">{T.plates}</legend>
          <div className="segmented">
            <button type="button" aria-pressed={!settings.allPlates} onClick={() => onChange({ ...settings, allPlates: false })}>
              {T.thisPlate}
            </button>
            <button type="button" aria-pressed={settings.allPlates} onClick={() => onChange({ ...settings, allPlates: true })}>
              {T.allPlates}
            </button>
          </div>
        </fieldset>
        {/* Seule l'aile a des régions à choisir (cellules, nervures) ; rien à choisir sur toutes les planches. */}
        {!settings.allPlates && plateRegions.length > 1 && (
          <fieldset className="settings__group settings__group--wide">
            <legend className="eyebrow">{T.regions}</legend>
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
                  <span className="chip__count">{countIn(r.id)}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset className="settings__group">
          <legend className="eyebrow">{T.questions}</legend>
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
          <legend className="eyebrow">{T.typing}</legend>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={settings.ignoreAccents}
              onChange={(e) => onChange({ ...settings, ignoreAccents: e.target.checked })}
            />
            {T.ignoreAccents}
          </label>
        </fieldset>
      </div>
      {included === 0 && !settings.allPlates && <p className="settings__warning">{T.noRegion}</p>}
    </section>
  );
}
