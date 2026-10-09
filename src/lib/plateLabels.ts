// Vue légendée d'une planche : le nom de chaque structure dans une colonne à gauche ou à droite du dessin,
// relié par un trait à un point posé sur la structure. Calculé dans le DOM (boîtes, points dans le remplissage),
// donc après l'injection du SVG. Le viewBox d'origine est gardé dans data-base-view-box et rétabli au retrait.

const NS = 'http://www.w3.org/2000/svg';
const LAYER = 'plate-labels';
/** Taille visée du texte des étiquettes, en pixels à l'écran. */
const TARGET_PX = 12;
const MIN_PX = 9;

interface Box { x: number; y: number; w: number; h: number }
interface Anchor { id: string; x: number; y: number }

const parseBox = (s: string): Box => {
  const [x, y, w, h] = s.trim().split(/[\s,]+/).map(Number);
  return { x, y, w, h };
};

function baseBox(svg: SVGSVGElement): Box {
  if (!svg.dataset.baseViewBox) svg.dataset.baseViewBox = svg.getAttribute('viewBox') ?? '0 0 100 100';
  return parseBox(svg.dataset.baseViewBox);
}

export function clearLabels(svg: SVGSVGElement) {
  svg.querySelector(`:scope > g.${LAYER}`)?.remove();
  if (svg.dataset.baseViewBox) svg.setAttribute('viewBox', svg.dataset.baseViewBox);
}

/** Passe d'un point du repère d'un élément au repère du SVG racine (celui du viewBox). */
function toRoot(svg: SVGSVGElement, el: SVGGraphicsElement, x: number, y: number) {
  const m = svg.getScreenCTM()?.inverse().multiply(el.getScreenCTM() ?? new DOMMatrix());
  return new DOMPoint(x, y).matrixTransform(m);
}

const isVisibleFill = (el: SVGGraphicsElement) => {
  const fill = getComputedStyle(el).fill;
  return fill !== 'none' && fill !== 'transparent' && fill !== 'rgba(0, 0, 0, 0)';
};

/** Matrice du repère d'un élément vers celui d'un autre élément du même SVG. */
function between(from: SVGGraphicsElement, to: SVGGraphicsElement) {
  return (to.getScreenCTM() ?? new DOMMatrix()).inverse().multiply(from.getScreenCTM() ?? new DOMMatrix());
}

/** Surfaces peintes dessinées après `el` (donc par-dessus) qui chevauchent sa boîte : elles peuvent le cacher. */
function coverersOf(svg: SVGSVGElement, el: SVGGeometryElement) {
  const id = el.getAttribute('data-part');
  const box = el.getBBox();
  const toSvg = between(el, svg);
  const corners = [
    [box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height],
  ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(toSvg));
  const r = {
    x0: Math.min(...corners.map((c) => c.x)), x1: Math.max(...corners.map((c) => c.x)),
    y0: Math.min(...corners.map((c) => c.y)), y1: Math.max(...corners.map((c) => c.y)),
  };
  return Array.from(svg.querySelectorAll<SVGGeometryElement>('path, ellipse, circle, rect, polygon')).filter((other) => {
    if (other === el || other.closest(`.${LAYER}`) || other.getAttribute('data-part') === id) return false;
    if (other.classList.contains('nerv-hit') || !isVisibleFill(other)) return false;
    if (!(el.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING)) return false;
    const b = other.getBBox();
    const m = between(other, svg);
    const pts = [[b.x, b.y], [b.x + b.width, b.y + b.height], [b.x + b.width, b.y], [b.x, b.y + b.height]].map(([x, y]) =>
      new DOMPoint(x, y).matrixTransform(m),
    );
    return Math.max(...pts.map((p) => p.x)) >= r.x0 && Math.min(...pts.map((p) => p.x)) <= r.x1 &&
      Math.max(...pts.map((p) => p.y)) >= r.y0 && Math.min(...pts.map((p) => p.y)) <= r.y1;
  });
}

/** Un point au cœur de la partie visible de la surface : parmi les points d'une grille qui tombent dans son
 *  remplissage sans être recouverts par une structure dessinée par-dessus (la tête passe sous l'œil et le clypéus, un
 *  tarse sous une autre patte), celui qui est le plus loin de tout bord. Le centre de la boîte englobante ne suffit pas
 *  (contre la base d'une dent), ni le barycentre (dans l'œil, pour la tête qui l'entoure). */
function insidePoint(svg: SVGSVGElement, el: SVGGeometryElement, clip: SVGGeometryElement | null): { p: DOMPoint; area: number } {
  const b = el.getBBox();
  const covers = coverersOf(svg, el).map((other) => ({ other, m: between(el, other) }));
  const visible = (x: number, y: number) => {
    if (!el.isPointInFill(new DOMPoint(x, y))) return false;
    if (clip) {
      const p = toRoot(svg, el, x, y);
      if (!clip.isPointInFill(new DOMPoint(p.x, p.y))) return false;
    }
    return !covers.some(({ other, m }) => other.isPointInFill(new DOMPoint(x, y).matrixTransform(m)));
  };
  // Grille sur la boîte : points visibles et points cachés ou hors de la forme (dont un cadre tout autour).
  const n = 24;
  const shown: { x: number; y: number }[] = [];
  const hidden: { x: number; y: number }[] = [];
  for (let i = -1; i <= n; i++) {
    for (let j = -1; j <= n; j++) {
      const x = b.x + (b.width * (i + 0.5)) / n;
      const y = b.y + (b.height * (j + 0.5)) / n;
      const border = i < 0 || j < 0 || i === n || j === n;
      (!border && visible(x, y) ? shown : hidden).push({ x, y });
    }
  }
  if (shown.length === 0) return { p: toRoot(svg, el, b.x + b.width / 2, b.y + b.height / 2), area: 0 };
  const area = (shown.length * b.width * b.height) / (n * n);
  // Le point visible le plus loin de tout point caché : au cœur de la partie visible, même quand elle forme un
  // croissant (la tête autour de l'œil). À distance égale, le plus proche du barycentre.
  const cx = shown.reduce((sum, p) => sum + p.x, 0) / shown.length;
  const cy = shown.reduce((sum, p) => sum + p.y, 0) / shown.length;
  const depth = (p: { x: number; y: number }) => Math.min(...hidden.map((h) => (h.x - p.x) ** 2 + (h.y - p.y) ** 2));
  const best = shown
    .map((p) => ({ p, d: depth(p), c: (p.x - cx) ** 2 + (p.y - cy) ** 2 }))
    .reduce((a, q) => (q.d > a.d * 1.0001 || (Math.abs(q.d - a.d) <= a.d * 0.0001 && q.c < a.c) ? q : a));
  return { p: toRoot(svg, el, best.p.x, best.p.y), area };
}

/** Étendue d'une structure longue (bord masticateur) : segment invisible du SVG (`data-extent-for`), affiché en
 *  accolade dans la vue légendée. `data-extent-tick` donne la direction des petits retours vers la structure. */
interface Extent { id: string; a: DOMPoint; b: DOMPoint; tick: [number, number] }

function extentsOf(svg: SVGSVGElement): Map<string, Extent> {
  const out = new Map<string, Extent>();
  for (const el of svg.querySelectorAll<SVGGeometryElement>('[data-extent-for]')) {
    const id = el.getAttribute('data-extent-for') ?? '';
    const [tx, ty] = (el.getAttribute('data-extent-tick') ?? '0 0').split(/\s+/).map(Number);
    const a = el.getPointAtLength(0);
    const b = el.getPointAtLength(el.getTotalLength());
    out.set(id, { id, a: toRoot(svg, el, a.x, a.y), b: toRoot(svg, el, b.x, b.y), tick: [tx, ty] });
  }
  return out;
}

/** Accolade d'une étendue : un trait et deux petits retours vers la structure. */
function drawExtent(layer: SVGGElement, e: Extent, size: number, selected: boolean) {
  const t = size * 1.1;
  const line = document.createElementNS(NS, 'polyline');
  line.setAttribute(
    'points',
    `${e.a.x + e.tick[0] * t},${e.a.y + e.tick[1] * t} ${e.a.x},${e.a.y} ${e.b.x},${e.b.y} ${e.b.x + e.tick[0] * t},${e.b.y + e.tick[1] * t}`,
  );
  line.setAttribute('class', `plate-label__extent${selected ? ' plate-label__extent--sel' : ''}`);
  layer.appendChild(line);
}

function anchorOf(svg: SVGSVGElement, id: string, clip: SVGGeometryElement | null): Anchor | null {
  const els = Array.from(svg.querySelectorAll<SVGGeometryElement>(`[data-part="${CSS.escape(id)}"]`)).filter(
    (el) => !el.classList.contains('nerv-hit') && !el.classList.contains('nerv-halo'),
  );
  // Surfaces : la plus visible. Nervures et bords (traits) : le milieu du plus long cœur.
  const surfaces = els.filter((el) => !el.classList.contains('nerv') && isVisibleFill(el));
  if (surfaces.length > 0) {
    // Plusieurs tracés (six pattes) : celui dont la partie visible est la plus grande.
    const best = surfaces.map((el) => insidePoint(svg, el, clip)).reduce((a, b) => (b.area > a.area ? b : a));
    return { id, x: best.p.x, y: best.p.y };
  }
  const cores = els.filter((el) => el.classList.contains('nerv-core'));
  if (cores.length === 0) {
    // Zone transparente (angle basal de la mandibule) : le centre de sa boîte.
    if (els.length === 0) return null;
    const b = els[0].getBBox();
    const p = toRoot(svg, els[0], b.x + b.width / 2, b.y + b.height / 2);
    return { id, x: p.x, y: p.y };
  }
  const el = cores.reduce((a, b) => (b.getTotalLength() > a.getTotalLength() ? b : a));
  const mid = el.getPointAtLength(el.getTotalLength() / 2);
  const p = toRoot(svg, el, mid.x, mid.y);
  return { id, x: p.x, y: p.y };
}

/** Ordonnées des étiquettes d'une colonne : à mi-chemin entre leur point et une répartition régulière sur
 *  toute la hauteur (les traits restent courts sans que les noms se tassent), puis sans chevauchement. */
function spread(ys: number[], gap: number, top: number, bottom: number) {
  const step = (bottom - top) / Math.max(ys.length, 1);
  const out = ys.map((y, i) => (y + top + step * (i + 0.5)) / 2);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(out[i], top, i > 0 ? out[i - 1] + gap : top);
  for (let i = out.length - 1; i >= 0; i--) out[i] = Math.min(out[i], bottom, i < out.length - 1 ? out[i + 1] - gap : bottom);
  return out;
}

/** Écran étroit : pas de place pour des colonnes de noms. Les structures portent un numéro, dans l'ordre
 *  de `names`, et la liste numérotée s'affiche sous la planche (`.plate-legend` dans Home). */
export const COMPACT_LABELS = '(max-width: 640px)';

const ANCHORS = new WeakMap<SVGSVGElement, Map<string, Anchor | null>>();

export function drawLabels(svg: SVGSVGElement, names: Record<string, string>, selected: string | null) {
  clearLabels(svg);
  const base = baseBox(svg);
  const clip = svg.querySelector<SVGGeometryElement>('#aile-contour');

  const ids = [...new Set(Array.from(svg.querySelectorAll('[data-part]'), (el) => el.getAttribute('data-part') ?? ''))].filter(
    (id) => id in names,
  );
  // Une structure avec une étendue est repérée au milieu de son accolade, pas sur un point du dessin.
  const extents = extentsOf(svg);
  // Les points ne dépendent que du dessin (repère du viewBox), pas de la taille à l'écran : calculés une fois par
  // SVG, ils servent aux redessins suivants (redimensionnement, changement de sélection).
  let cache = ANCHORS.get(svg);
  if (!cache) ANCHORS.set(svg, (cache = new Map()));
  const anchors = ids
    .map((id): Anchor | null => {
      const e = extents.get(id);
      if (e) return { id, x: (e.a.x + e.b.x) / 2, y: (e.a.y + e.b.y) / 2 };
      if (!cache.has(id)) cache.set(id, anchorOf(svg, id, clip));
      return cache.get(id) ?? null;
    })
    .filter((a): a is Anchor => a !== null);
  const visibleExtents = [...extents.values()].filter((e) => ids.includes(e.id));

  if (window.matchMedia(COMPACT_LABELS).matches) {
    drawNumbers(svg, base, anchors, Object.keys(names), selected, visibleExtents);
    return;
  }

  // Côté : celui du point par rapport au milieu du dessin, puis équilibrage des deux colonnes.
  const mid = base.x + base.w / 2;
  const left = anchors.filter((a) => a.x < mid).sort((a, b) => a.x - b.x);
  const right = anchors.filter((a) => a.x >= mid).sort((a, b) => b.x - a.x);
  while (left.length > right.length + 1) right.push(left.pop()!);
  while (right.length > left.length + 1) left.push(right.pop()!);
  left.sort((a, b) => a.y - b.y);
  right.sort((a, b) => a.y - b.y);

  const layer = document.createElementNS(NS, 'g');
  layer.setAttribute('class', LAYER);
  layer.setAttribute('aria-hidden', 'true');
  svg.appendChild(layer);

  const rect = svg.getBoundingClientRect();
  for (const e of visibleExtents) drawExtent(layer, e, TARGET_PX * (base.w / Math.max(rect.width, 1)), e.id === selected);
  const texts = new Map<string, SVGTextElement>();
  for (const a of anchors) {
    const text = document.createElementNS(NS, 'text');
    text.textContent = names[a.id];
    text.setAttribute('class', `plate-label__text${a.id === selected ? ' plate-label__text--sel' : ''}`);
    texts.set(a.id, text);
    layer.appendChild(text);
  }

  // Taille du texte en unités du viewBox : on vise TARGET_PX à l'écran une fois les marges ajoutées,
  // ce qui demande quelques itérations (les marges dépendent de la largeur du texte, et l'échelle des marges).
  let fs = TARGET_PX * (base.w / Math.max(rect.width, 1));
  let box = base;
  for (let k = 0; k < 4; k++) {
    for (const t of texts.values()) t.setAttribute('font-size', String(fs));
    const width = Math.max(0, ...Array.from(texts.values(), (t) => t.getComputedTextLength()));
    const margin = width + fs * 2.2;
    const gap = fs * 1.55;
    const h = Math.max(base.h, Math.max(left.length, right.length) * gap + fs * 2);
    box = { x: base.x - margin, y: base.y - (h - base.h) / 2, w: base.w + 2 * margin, h };
    const scale = Math.min(rect.width / box.w, rect.height / box.h) || 1;
    const next = TARGET_PX / scale;
    if (Math.abs(next - fs) < fs * 0.02) break;
    // Sur un cadre étroit, les marges mangent le dessin : on accepte un texte plus petit, jusqu'à MIN_PX.
    fs = Math.min(next, (TARGET_PX / MIN_PX) * fs);
  }

  const gap = fs * 1.55;
  const top = box.y + fs;
  const bottom = box.y + box.h - fs * 0.5;
  const place = (column: Anchor[], side: 'left' | 'right') => {
    const ys = spread(column.map((a) => a.y), gap, top, bottom);
    const edge = side === 'left' ? base.x - fs * 0.6 : base.x + base.w + fs * 0.6;
    column.forEach((a, i) => {
      const y = ys[i];
      const line = document.createElementNS(NS, 'polyline');
      line.setAttribute('points', `${a.x},${a.y} ${edge},${y}`);
      line.setAttribute('class', 'plate-label__line');
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', String(a.x));
      dot.setAttribute('cy', String(a.y));
      dot.setAttribute('r', String(fs * 0.22));
      dot.setAttribute('class', `plate-label__dot${a.id === selected ? ' plate-label__dot--sel' : ''}`);
      layer.insertBefore(line, layer.firstChild);
      layer.appendChild(dot);
      const text = texts.get(a.id)!;
      text.setAttribute('x', String(side === 'left' ? edge - fs * 0.4 : edge + fs * 0.4));
      text.setAttribute('y', String(y));
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('text-anchor', side === 'left' ? 'end' : 'start');
      text.setAttribute('data-label-for', a.id);
    });
  };
  place(left, 'left');
  place(right, 'right');
  svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
}

function drawNumbers(
  svg: SVGSVGElement,
  base: Box,
  anchors: Anchor[],
  order: string[],
  selected: string | null,
  extents: Extent[],
) {
  const rect = svg.getBoundingClientRect();
  const scale = Math.min(rect.width / base.w, rect.height / base.h) || 1;
  const fs = 8 / scale;
  const layer = document.createElementNS(NS, 'g');
  layer.setAttribute('class', LAYER);
  layer.setAttribute('aria-hidden', 'true');
  for (const e of extents) drawExtent(layer, e, fs, e.id === selected);
  for (const a of anchors) {
    const sel = a.id === selected;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', `plate-label__badge${sel ? ' plate-label__badge--sel' : ''}`);
    g.setAttribute('data-label-for', a.id);
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', String(a.x));
    circle.setAttribute('cy', String(a.y));
    circle.setAttribute('r', String(fs * 0.8));
    const text = document.createElementNS(NS, 'text');
    text.textContent = String(order.indexOf(a.id) + 1);
    text.setAttribute('x', String(a.x));
    text.setAttribute('y', String(a.y));
    text.setAttribute('font-size', String(fs));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    g.append(circle, text);
    layer.appendChild(g);
  }
  svg.appendChild(layer);
}
