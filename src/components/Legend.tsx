export type LegendKey = 'ok' | 'ko' | 'hover' | 'sel' | 'done' | 'missed';

const LABELS: Record<LegendKey, string> = {
  ok: 'Bonne réponse',
  ko: 'Ton clic',
  hover: 'Survol',
  sel: 'Sélection',
  done: 'Nommée',
  missed: 'Ratée',
};

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
