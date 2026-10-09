import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import antSvg from '../assets/ant.svg?raw';
import { PLATES, partsOf, type PartId, type PlateId } from '../data/parts';
import { t } from '../i18n';
import { clearLabels, drawLabels } from '../lib/plateLabels';

export type Mark = 'sel' | 'ok' | 'ko' | 'done' | 'off';
export type Marks = Partial<Record<PartId, Mark>>;

interface AntPlateProps {
  plate: PlateId;
  marks?: Marks;
  onPick?: (id: PartId) => void;
  locked?: readonly PartId[];
  /** Vue légendée : le nom de chaque structure autour du dessin, relié par un trait. */
  labels?: boolean;
}

const LABELS = t<Record<PlateId, string>>(
  {
    ouvriere: 'Planche : fourmi ouvrière en vue latérale',
    aile: 'Planche : aile antérieure de reine',
    tete: 'Planche : têtes d’ouvrière en vue de face',
    mandibule: 'Planche : mandibule gauche ouverte, vue dorsale',
    antenne: 'Planche : antenne d’ouvrière, vue latérale',
    mesosoma: 'Planche : mésosoma d’ouvrière, vue latérale',
    gastre: 'Planche : taille et gastre d’ouvrière, vue latérale',
    patte: 'Planche : patte postérieure d’ouvrière, vue latérale',
  },
  { ouvriere: 'Plate: worker ant, side view', aile: 'Plate: queen forewing', tete: 'Plate: worker heads, full-face view', mandibule: 'Plate: open left mandible, dorsal view', antenne: 'Plate: worker antenna, side view', mesosoma: 'Plate: worker mesosoma, side view', gastre: 'Plate: worker waist and gaster, side view', patte: 'Plate: worker hind leg, side view' },
);

const withLabel = (svg: string, label: string) => svg.replace(/aria-label="[^"]*"/, `aria-label="${label}"`);

// Dessins chargés à la demande, chacun dans son propre fichier, pour garder le code principal léger. Seule
// l'ouvrière, affichée à l'arrivée, est incluse d'office : pas de cadre vide au premier affichage.
const LOADERS: Record<Exclude<PlateId, 'ouvriere'>, () => Promise<{ default: string }>> = {
  aile: () => import('../assets/wing.svg?raw'),
  tete: () => import('../assets/head.svg?raw'),
  mandibule: () => import('../assets/mandible.svg?raw'),
  antenne: () => import('../assets/antenna.svg?raw'),
  mesosoma: () => import('../assets/mesosoma.svg?raw'),
  gastre: () => import('../assets/gaster.svg?raw'),
  patte: () => import('../assets/leg.svg?raw'),
};

const SVG_CACHE = new Map<PlateId, string>([['ouvriere', withLabel(antSvg, LABELS.ouvriere)]]);
const PENDING = new Map<PlateId, Promise<string>>();

function loadPlate(plate: PlateId): Promise<string> {
  const cached = SVG_CACHE.get(plate);
  if (cached) return Promise.resolve(cached);
  if (plate === 'ouvriere') return Promise.resolve(withLabel(antSvg, LABELS.ouvriere));
  let pending = PENDING.get(plate);
  if (!pending) {
    pending = LOADERS[plate]().then((m) => {
      const svg = withLabel(m.default, LABELS[plate]);
      SVG_CACHE.set(plate, svg);
      return svg;
    });
    PENDING.set(plate, pending);
  }
  return pending;
}

// Les autres planches sont préchargées dès que le navigateur est libre : changer de planche reste instantané.
if (typeof window !== 'undefined') {
  const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
  idle(() => PLATES.forEach((p) => void loadPlate(p.id).catch(() => undefined)));
}

const EMPTY_MARKS: Marks = {};
const EMPTY_LOCKED: readonly PartId[] = [];

// Une étiquette de la vue légendée (data-label-for) compte comme sa structure.
const partOf = (target: EventTarget | null): PartId | null => {
  const el = target instanceof Element ? target.closest('[data-part], [data-label-for]') : null;
  return ((el?.getAttribute('data-part') ?? el?.getAttribute('data-label-for')) as PartId | null) ?? null;
};

// Each plate's SVG file is the single source of truth for its drawing. A structure can span several
// elements (both antennae, six legs); states are applied as data attributes on every one of them.
export function AntPlate({ plate, marks = EMPTY_MARKS, onPick, locked = EMPTY_LOCKED, labels = false }: AntPlateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const interactive = Boolean(onPick);
  // Dessin de la planche, chargé si besoin ; en attendant, le cadre reste vide (sa taille ne change pas).
  const [loaded, setLoaded] = useState<{ plate: PlateId; svg: string } | null>(null);
  const svg = SVG_CACHE.get(plate) ?? (loaded?.plate === plate ? loaded.svg : null);
  useEffect(() => {
    if (SVG_CACHE.has(plate)) return;
    let live = true;
    loadPlate(plate).then((s) => live && setLoaded({ plate, svg: s }));
    return () => {
      live = false;
    };
  }, [plate]);
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

  const selected = (Object.keys(marks) as PartId[]).find((id) => marks[id] === 'sel') ?? null;

  useLayoutEffect(() => {
    const svg = ref.current?.querySelector('svg');
    if (!svg) return;
    if (!labels) {
      clearLabels(svg);
      return;
    }
    const names = Object.fromEntries(partsOf(plate).map((p) => [p.id, p.name]));
    const draw = () => drawLabels(svg, names, selected);
    draw();
    // La taille du texte dépend de la place à l'écran : on recalcule quand le cadre change de taille, en largeur
    // comme en hauteur (un dessin calculé pendant un chargement, cadre encore aplati, resterait sinon minuscule).
    let width = ref.current?.clientWidth ?? 0;
    let height = ref.current?.clientHeight ?? 0;
    const observer = new ResizeObserver(() => {
      const w = ref.current?.clientWidth ?? 0;
      const h = ref.current?.clientHeight ?? 0;
      if (Math.abs(w - width) > 1 || Math.abs(h - height) > 1) {
        width = w;
        height = h;
        draw();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [plate, labels, selected, svg]);

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
      aria-busy={svg === null}
      dangerouslySetInnerHTML={{ __html: svg ?? '' }}
    />
  );
}
