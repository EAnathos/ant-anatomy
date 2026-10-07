import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import antSvg from '../assets/ant.svg?raw';
import type { PartId } from '../data/parts';

export type Mark = 'sel' | 'ok' | 'ko' | 'done' | 'off';
export type Marks = Partial<Record<PartId, Mark>>;

interface AntPlateProps {
  marks?: Marks;
  onPick?: (id: PartId) => void;
  locked?: readonly PartId[];
}

const EMPTY_MARKS: Marks = {};
const EMPTY_LOCKED: readonly PartId[] = [];

// The SVG file is the single source of truth for the drawing; states are applied as data attributes.
export function AntPlate({ marks = EMPTY_MARKS, onPick, locked = EMPTY_LOCKED }: AntPlateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const interactive = Boolean(onPick);
  const isPickable = (id: PartId) => marks[id] !== 'off' && !locked.includes(id);

  useEffect(() => {
    const parts = ref.current?.querySelectorAll<SVGGElement>('[data-part]') ?? [];
    parts.forEach((el, i) => {
      const id = el.dataset.part as PartId;
      el.dataset.state = marks[id] ?? 'rest';
      el.toggleAttribute('data-locked', locked.includes(id));
      if (interactive && marks[id] !== 'off' && !locked.includes(id)) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Structure ${i + 1}`);
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }
    });
  }, [marks, interactive, locked]);

  const pickFrom = (target: EventTarget) => {
    if (!onPick || !(target instanceof Element)) return;
    const el = target.closest<SVGGElement>('[data-part]');
    const id = el?.dataset.part as PartId | undefined;
    if (id && isPickable(id)) onPick(id);
  };

  return (
    <div
      ref={ref}
      className="ant-plate"
      data-interactive={interactive}
      onClick={(e: MouseEvent) => pickFrom(e.target)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pickFrom(e.target);
        }
      }}
      dangerouslySetInnerHTML={{ __html: antSvg }}
    />
  );
}
