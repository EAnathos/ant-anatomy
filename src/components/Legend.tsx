import { t } from '../i18n';

export type LegendKey = 'ok' | 'ko' | 'hover' | 'sel' | 'done' | 'missed';

const LABELS = t<Record<LegendKey, string>>(
  { ok: 'Bonne réponse', ko: 'Ton clic', hover: 'Survol', sel: 'Sélection', done: 'Nommée', missed: 'Ratée' },
  { ok: 'Right answer', ko: 'Your click', hover: 'Hover', sel: 'Selected', done: 'Named', missed: 'Missed' },
);

export function Legend({ items }: { items: LegendKey[] }) {
  return (
    <ul className="legend">
      {items.map((key) => (
        <li key={key}>
          <span className={`swatch swatch--${key}`} aria-hidden="true" />
          {LABELS[key]}
        </li>
      ))}
    </ul>
  );
}
