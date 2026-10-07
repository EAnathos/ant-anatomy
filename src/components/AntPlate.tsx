import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import antSvg from '../assets/ant.svg?raw';
import wingSvg from '../assets/wing.svg?raw';
import type { PartId, PlateId } from '../data/parts';

export type Mark = 'sel' | 'ok' | 'ko' | 'done' | 'off';
export type Marks = Partial<Record<PartId, Mark>>;

interface AntPlateProps {
  plate: PlateId;
  marks?: Marks;
  onPick?: (id: PartId) => void;
  locked?: readonly PartId[];
}

const SVG_BY_PLATE: Record<PlateId, string> = { ouvriere: antSvg, aile: wingSvg };

const EMPTY_MARKS: Marks = {};
const EMPTY_LOCKED: readonly PartId[] = [];

const partOf = (target: EventTarget | null): PartId | null =>
  target instanceof Element ? ((target.closest('[data-part]')?.getAttribute('data-part') as PartId | null) ?? null) : null;

// Each plate's SVG file is the single source of truth for its drawing. A structure can span several
// elements (both antennae, six legs); states are applied as data attributes on every one of them.
export function AntPlate({ plate, marks = EMPTY_MARKS, onPick, locked = EMPTY_LOCKED }: AntPlateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const interactive = Boolean(onPick);
  const isPickable = (id: PartId) => marks[id] !== 'off' && !locked.includes(id);

  const elements = () => Array.from(ref.current?.querySelectorAll<SVGElement>('[data-part]') ?? []);

  useEffect(() => {
    const seen = new Set<string>();
    for (const el of elements()) {
      const id = el.getAttribute('data-part') as PartId;
      el.setAttribute('data-state', marks[id] ?? 'rest');
      el.toggleAttribute('data-locked', locked.includes(id));
      const focusable = interactive && marks[id] !== 'off' && !locked.includes(id) && !seen.has(id);
      seen.add(id);
      if (focusable) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Structure ${seen.size}`);
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }
    }
  });

  const highlight = (id: PartId | null) => {
    const active = interactive && id !== null && isPickable(id) ? id : null;
    for (const el of elements()) el.toggleAttribute('data-hover', el.getAttribute('data-part') === active);
  };

  const pick = (target: EventTarget) => {
    const id = partOf(target);
    if (onPick && id && isPickable(id)) onPick(id);
  };

  return (
    <div
      ref={ref}
      className="ant-plate"
      data-plate={plate}
      data-interactive={interactive}
      onClick={(e: MouseEvent) => pick(e.target)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick(e.target);
        }
      }}
      onMouseOver={(e: MouseEvent) => highlight(partOf(e.target))}
      onMouseLeave={() => highlight(null)}
      onFocus={(e) => highlight(partOf(e.target))}
      onBlur={() => highlight(null)}
      dangerouslySetInnerHTML={{ __html: SVG_BY_PLATE[plate] }}
    />
  );
}
