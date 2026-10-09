import { useState, type CSSProperties, type ReactNode } from 'react';
import { AntPlate } from '../components/AntPlate';
import { ArrowIcon, DiceIcon, MagnifierIcon } from '../components/icons';
import { Rich } from '../components/Rich';
import { PlateName, plateText } from '../components/PlateName';
import { SettingsPanel } from '../components/SettingsPanel';
import { PLATES, PLATE_BY_ID, REGION_BY_ID, detailPlateOf, partsInRegions, partsOf, regionsOf, partIn, type PartId, type PlateId, type RegionId } from '../data/parts';
import { t } from '../i18n';
import { playableParts, type Settings } from '../lib/session';

interface HomeProps {
  /** Structure sélectionnée à l'arrivée (lien « Voir sur la planche » du glossaire). */
  initialSelected?: PartId;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onStartFind: () => void;
  onStartName: () => void;
  onStartMatch: () => void;
}

/** `regions` : régions de la planche cochées dans les paramètres (toutes si aucune). */
interface PlateIntro {
  title: (regions: readonly RegionId[]) => string;
  lead: (count: number, regions: readonly RegionId[]) => string;
  note: ReactNode;
  /** Source et licence du dessin, sous le texte. */
  credit: ReactNode;
}

const WORKER_COUNT = partsOf('ouvriere').length;
const only = (regions: readonly RegionId[], id: RegionId) => regions.length === 1 && regions[0] === id;

const INTROS = t<Record<PlateId, PlateIntro>>(
  {
    ouvriere: {
      title: () => 'Anatomie de la fourmi',
      lead: () => `${WORKER_COUNT} grandes parties du corps, de la tête au gastre. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche représente une ouvrière de <em>Neoponera verenae</em>, une Ponerinae, dans sa structure générale. Elle sert de point d’entrée : chaque
          partie (tête, mandibules, antennes, mésosoma, gastre, pattes) ouvre une planche composite détaillée, où l’on retrouve ses structures une à une.
        </>
      ),
      credit: (
        <>
          Planche :{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg" target="_blank" rel="noopener noreferrer">
            Scheme ant worker anatomy
          </a>
          , par LadyofHats et Sophivorus, domaine public, via Wikimedia Commons.
        </>
      ),
    },
    aile: {
      title: (regions) =>
        only(regions, 'cellules') ? 'Cellules de l’aile' : only(regions, 'nervures') ? 'Nervures de l’aile' : 'Anatomie de l’aile',
      lead: (n, regions) =>
        `${n} ${
          only(regions, 'cellules')
            ? 'structures de l’aile antérieure, du ptérostigma aux cellules de la base'
            : only(regions, 'nervures')
              ? 'nervures de l’aile antérieure, de la costa aux nervures anales'
              : 'structures de l’aile antérieure, cellules et nervures'
        }. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche représente l’aile antérieure d’une reine d’<em>Odontomachus</em> sp., une autre Ponerinae que l’ouvrière de la première planche. La nervation
          n’est pas la même chez toutes les fourmis : selon les genres, des nervures disparaissent et des cellules fusionnent ou restent ouvertes, et les ailes des mâles diffèrent souvent
          de celles des reines. Les ouvrières, elles, n’ont jamais d’ailes.
        </>
      ),
      credit: (
        <>
          Planche : dessin d’EAnathos, sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
    tete: {
      title: () => 'Anatomie de la tête',
      lead: (n) => `${n} structures de la tête vue de face, du bord occipital au clypéus. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche montre deux têtes d’ouvrière de face, sans mandibules ni antennes, d’après les figures 523 à 526 de Bolton (1994). À gauche, une tête
          entière dont les lobes frontaux cachent l’insertion des antennes, avec de longues carènes frontales bordant des scrobes. À droite, la moitié antérieure
          d’une tête sans lobes frontaux, où l’on voit le torulus et la fossette antennaire. Ces structures varient beaucoup d’un genre à l’autre.
        </>
      ),
      credit: (
        <>
          Planche : dessin composite d’EAnathos, d’après Bolton (1994), sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
    mandibule: {
      title: () => 'Anatomie de la mandibule',
      lead: (n) => `${n} structures de la mandibule, de la dent apicale à l’angle basal. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche montre une mandibule gauche triangulaire, grande ouverte, vue de dessus. C’est un dessin composite, qui ne représente aucune espèce, d’après la
          figure 527 de Bolton (1994). Les dents se comptent depuis l’apex. La forme de la mandibule varie beaucoup selon les genres : triangulaire chez la plupart
          des fourmis, longue et étroite chez <em>Odontomachus</em>, en faux et presque sans dents chez <em>Polyergus</em>.
        </>
      ),
      credit: (
        <>
          Planche : dessin composite d’EAnathos, d’après la figure 527 de Bolton (1994), sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
    antenne: {
      title: () => 'Anatomie de l’antenne',
      lead: (n) => `${n} parties de l’antenne, du bulbe condylaire à la massue. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche montre une antenne gauche d’ouvrière, vue de côté. C’est un dessin composite, qui ne représente aucune espèce : 12 articles, le scape puis un
          funicule de 11 articles, dont le premier est le pédicelle et les trois derniers forment la massue. Le nombre d’articles varie de 4 à 12 selon les genres,
          et la massue, de un à quatre articles, manque chez beaucoup de fourmis.
        </>
      ),
      credit: (
        <>
          Planche : dessin composite d’EAnathos, sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
    mesosoma: {
      title: () => 'Anatomie du mésosoma',
      lead: (n) => `${n} structures du mésosoma, du pronotum aux lobes propodéaux. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche montre le mésosoma d’une ouvrière, vue de côté, d’après la figure 529 de Bolton (1994). C’est un dessin composite, qui ne représente
          aucune espèce. Il réunit les trois segments du thorax et le propodéum, premier segment de l’abdomen soudé au thorax. Ici, un sillon divise la
          mésopleure en anépisterne et katépisterne, et la bulle de la glande métapleurale s’ouvre par un orifice au-dessus de la coxa postérieure.
        </>
      ),
      credit: (
        <>
          Planche : dessin composite d’EAnathos, sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
    gastre: {
      title: () => 'Anatomie du gastre',
      lead: (n) => `${n} structures de la taille et du gastre, du pétiole à l’aiguillon. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche montre la taille et le gastre d’une ouvrière, vue de côté, d’après la figure 530 de Bolton (1994). C’est un dessin composite, qui ne
          représente aucune espèce. Le pétiole s’articule au gastre par le helcium. Entre les deux premiers segments du gastre, le présclérite de l’A4, d’ordinaire
          caché sous l’A3, est montré à nu en pointillé, comme sur la figure 531, devant l’étranglement annulaire.
        </>
      ),
      credit: (
        <>
          Planche : dessin composite d’EAnathos, sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
    patte: {
      title: () => 'Anatomie de la patte',
      lead: (n) => `${n} parties de la patte, de la coxa aux griffes. Repère-les sur la planche, puis nomme-les sans aide.`,
      note: (
        <>
          La planche montre une patte postérieure d’ouvrière, vue de côté. C’est un dessin composite, qui ne représente aucune espèce. Le tibia porte à son
          apex deux éperons, un grand pectiné et un petit simple ; selon les genres, il en porte un seul ou aucun. Sur la patte antérieure, l’éperon forme avec
          l’encoche du basitarse le strigile, qui sert à nettoyer les antennes.
        </>
      ),
      credit: (
        <>
          Planche : dessin composite d’EAnathos, sous licence{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          {' '}: réutilisation libre à des fins non commerciales, en citant l’auteur.
        </>
      ),
    },
  },
  {
    ouvriere: {
      title: () => 'Ant anatomy',
      lead: () => `${WORKER_COUNT} main body parts, from head to gaster. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows a worker of <em>Neoponera verenae</em>, a member of the Ponerinae, in its general structure. It is the entry point: each part (head,
          mandibles, antennae, mesosoma, gaster, legs) opens a detailed composite plate, where its structures can be found one by one.
        </>
      ),
      credit: (
        <>
          Plate:{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg" target="_blank" rel="noopener noreferrer">
            Scheme ant worker anatomy
          </a>
          , by LadyofHats and Sophivorus, public domain, via Wikimedia Commons.
        </>
      ),
    },
    aile: {
      title: (regions) => (only(regions, 'cellules') ? 'Wing cells' : only(regions, 'nervures') ? 'Wing veins' : 'Wing anatomy'),
      lead: (n, regions) =>
        `${n} ${
          only(regions, 'cellules')
            ? 'structures of the forewing, from the pterostigma to the basal cells'
            : only(regions, 'nervures')
              ? 'veins of the forewing, from the costa to the anal veins'
              : 'structures of the forewing, cells and veins'
        }. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows the forewing of an <em>Odontomachus</em> sp. queen, a different Ponerinae from the worker on the first plate. Venation is not the same in every
          ant: depending on the genus, veins disappear and cells merge or stay open, and the wings of males often differ from those of queens. Workers never have wings.
        </>
      ),
      credit: (
        <>
          Plate: drawing by EAnathos, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
    tete: {
      title: () => 'Head anatomy',
      lead: (n) => `${n} structures of the head in full-face view, from the occipital margin to the clypeus. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows two worker heads in full-face view, without mandibles or antennae, after figures 523 to 526 of Bolton (1994). On the left, a whole head
          whose frontal lobes conceal the antennal insertions, with long frontal carinae bordering scrobes. On the right, the front half of a head without frontal
          lobes, showing the torulus and antennal socket. These structures vary widely between genera.
        </>
      ),
      credit: (
        <>
          Plate: composite drawing by EAnathos, after Bolton (1994), licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
    mandibule: {
      title: () => 'Mandible anatomy',
      lead: (n) => `${n} structures of the mandible, from the apical tooth to the basal angle. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows a fully opened triangular left mandible, seen from above. It is a composite drawing, not based on any species, after figure 527 of
          Bolton (1994). Teeth are counted from the apex. Mandible shape varies widely between genera: triangular in most ants, long and narrow in{' '}
          <em>Odontomachus</em>, sickle-shaped and nearly toothless in <em>Polyergus</em>.
        </>
      ),
      credit: (
        <>
          Plate: composite drawing by EAnathos, after figure 527 of Bolton (1994), licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
    antenne: {
      title: () => 'Antenna anatomy',
      lead: (n) => `${n} parts of the antenna, from the condylar bulb to the club. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows the left antenna of a worker, seen from the side. It is a composite drawing, not based on any species: 12 segments, the scape then an
          11-segmented funiculus, whose first segment is the pedicel and last three form the club. The number of segments ranges from 4 to 12 depending on the genus,
          and the club, of one to four segments, is absent in many ants.
        </>
      ),
      credit: (
        <>
          Plate: composite drawing by EAnathos, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
    mesosoma: {
      title: () => 'Mesosoma anatomy',
      lead: (n) => `${n} structures of the mesosoma, from the pronotum to the propodeal lobes. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows the mesosoma of a worker, seen from the side, after figure 529 of Bolton (1994). It is a composite drawing, not based on any
          species. It combines the three thoracic segments and the propodeum, the first abdominal segment fused to the thorax. Here a groove divides the
          mesopleuron into anepisternum and katepisternum, and the metapleural gland bulla opens through an orifice above the hind coxa.
        </>
      ),
      credit: (
        <>
          Plate: composite drawing by EAnathos, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
    gastre: {
      title: () => 'Gaster anatomy',
      lead: (n) => `${n} structures of the waist and gaster, from the petiole to the sting. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows the waist and gaster of a worker, seen from the side, after figure 530 of Bolton (1994). It is a composite drawing, not based on any
          species. The petiole articulates with the gaster through the helcium. Between the first two gastral segments, the presclerite of A4, normally hidden
          under A3, is shown exposed and stippled, as in figure 531, in front of the girdling constriction.
        </>
      ),
      credit: (
        <>
          Plate: composite drawing by EAnathos, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
    patte: {
      title: () => 'Leg anatomy',
      lead: (n) => `${n} parts of the leg, from the coxa to the claws. Find them on the plate, then name them unaided.`,
      note: (
        <>
          The plate shows the hind leg of a worker, seen from the side. It is a composite drawing, not based on any species. The tibia bears two spurs at its
          apex, a large pectinate one and a small simple one; depending on the genus there may be one or none. On the foreleg, the spur and the notch of the
          basitarsus form the strigil, used to clean the antennae.
        </>
      ),
      credit: (
        <>
          Plate: composite drawing by EAnathos, licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC 4.0
          </a>
          : free to reuse for non-commercial purposes, with credit to the author.
        </>
      ),
    },
  },
);

const T = t(
  {
    plate: 'Planche',
    random: 'Structure au hasard',
    showLabels: 'Afficher tous les noms sur la planche',
    legend: 'Structures numérotées sur la planche',
    pickHint: 'Clique une structure de la planche pour l’identifier.',
    detail: 'Voir en détail : ',
    chooseMode: 'Choisis un mode',
    find: 'Trouver',
    findText: 'Un nom s’affiche. Clique la structure correspondante sur la planche. Si elle existe en plusieurs exemplaires, n’importe laquelle compte.',
    name: 'Nommer',
    nameText: 'Clique une structure, puis tape son nom.',
    acceptedAccents: 'Accents, majuscules et synonymes courants sont acceptés.',
    accepted: 'Majuscules et synonymes courants sont acceptés.',
    start: 'Commencer',
    match: 'Relier',
    matchText: 'Des mots et des définitions mélangés. Relie chaque mot à la sienne, par séries de cinq, avec les structures de la planche ou tout le glossaire.',
  },
  {
    plate: 'Plate',
    random: 'Random structure',
    showLabels: 'Show every name on the plate',
    legend: 'Structures numbered on the plate',
    pickHint: 'Click a structure on the plate to identify it.',
    detail: 'See in detail: ',
    chooseMode: 'Choose a mode',
    find: 'Find',
    findText: 'A name appears. Click the matching structure on the plate. If it occurs several times, any of them counts.',
    name: 'Name',
    nameText: 'Click a structure, then type its name.',
    acceptedAccents: 'Accents, capitals and common synonyms are accepted.',
    accepted: 'Capitals and common synonyms are accepted.',
    start: 'Start',
    match: 'Match',
    matchText: 'Words and definitions, shuffled. Match each word to its own, five at a time, with the structures of the plate or the whole glossary.',
  },
);

export function Home({ initialSelected, settings, onSettingsChange, onStartFind, onStartName, onStartMatch }: HomeProps) {
  const [selected, setSelected] = useState<PartId | null>(initialSelected ?? null);
  const [labels, setLabels] = useState(false);
  const part = selected ? partIn(settings.plate, selected) : null;
  const canPlay = playableParts(settings).length > 0;
  const intro = INTROS[settings.plate];
  const plateRegions = regionsOf(settings.plate).map((r) => r.id);
  const checked = plateRegions.filter((r) => settings.regions.includes(r));
  const active = checked.length > 0 ? checked : plateRegions;
  const shown = partsInRegions(active).length;

  // Une structure tirée au hasard parmi celles des régions affichées, jamais deux fois la même d'affilée.
  const pickRandom = () => {
    const pool = partsInRegions(active).filter((p) => p.id !== selected);
    if (pool.length > 0) setSelected(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const choosePlate = (plate: PlateId) => {
    if (plate === settings.plate) return;
    setSelected(null);
    onSettingsChange({ ...settings, plate, regions: regionsOf(plate).map((r) => r.id) });
  };

  // Zoom vers la planche détaillée : la nouvelle planche grandit depuis l'endroit de la structure sur l'ancienne.
  const [focus, setFocus] = useState<{ n: number; origin: string } | null>(null);
  const detail = part ? detailPlateOf(settings.plate, part.id) : null;
  const openDetail = (plate: PlateId, id: PartId) => {
    const frame = document.querySelector('.hero__plate .ant-plate')?.getBoundingClientRect();
    const target = document.querySelector(`.hero__plate [data-part="${CSS.escape(id)}"]`)?.getBoundingClientRect();
    const origin =
      frame && target && frame.width > 0
        ? `${(((target.left + target.width / 2 - frame.left) / frame.width) * 100).toFixed(1)}% ${(((target.top + target.height / 2 - frame.top) / frame.height) * 100).toFixed(1)}%`
        : '50% 50%';
    onSettingsChange({ ...settings, plate, regions: regionsOf(plate).map((r) => r.id) });
    setSelected(id);
    setFocus((f) => ({ n: (f?.n ?? 0) + 1, origin }));
  };

  return (
    <main className="container">
      <section className="hero hero--top">
        <div className="hero__text">
          <h1 className="display">{intro.title(active)}</h1>
          <p className="lead">{intro.lead(shown, active)}</p>
          <p className="note">{intro.note}</p>
          <p className="plate-credit">{intro.credit}</p>
        </div>
        <div className="hero__plate">
          <div className="plate-picker">
            <label className="select">
              <span className="sr-only">{T.plate}</span>
              <select value={settings.plate} onChange={(e) => choosePlate(e.target.value as PlateId)}>
                {PLATES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {plateText(p)}
                  </option>
                ))}
              </select>
            </label>
            <div className="plate-tools">
              <button type="button" className="icon-btn" onClick={pickRandom} aria-label={T.random} title={T.random}>
                <DiceIcon />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setLabels((v) => !v)}
                aria-pressed={labels}
                aria-label={T.showLabels}
                title={T.showLabels}
              >
                <MagnifierIcon />
              </button>
            </div>
          </div>
          <figure className="plate">
          <div
            key={focus?.n ?? 0}
            className={focus ? 'plate-focus' : undefined}
            style={focus ? ({ '--focus-origin': focus.origin } as CSSProperties) : undefined}
          >
            <AntPlate plate={settings.plate} marks={selected ? { [selected]: 'sel' } : undefined} onPick={setSelected} labels={labels} />
          </div>
          <figcaption className="plate__caption" aria-live="polite">
            {part ? (
              <>
                <div className="plate__title">
                  <strong>{part.name}</strong>
                  {regionsOf(settings.plate).length > 1 && <span className="eyebrow">{REGION_BY_ID[part.region].label}</span>}
                </div>
                <span className="muted"><Rich text={part.definition} /></span>
                {detail && (
                  <button type="button" className="plate-ref" onClick={() => openDetail(detail, part.id)}>
                    {T.detail}
                    <PlateName plate={PLATE_BY_ID[detail]} />
                    <ArrowIcon size={14} />
                  </button>
                )}
              </>
            ) : (
              <span className="muted">{T.pickHint}</span>
            )}
          </figcaption>
          {labels && (
            <ol className="plate-legend" aria-label={T.legend}>
              {partsOf(settings.plate).map((p, i) => (
                <li key={p.id} className={p.id === selected ? 'plate-legend__item--sel' : undefined}>
                  <button type="button" onClick={() => setSelected(p.id)}>
                    <span className="plate-legend__num" aria-hidden="true">{i + 1}</span>
                    {p.name}
                  </button>
                </li>
              ))}
            </ol>
          )}
          </figure>
        </div>
      </section>

      <section className="modes" aria-labelledby="modes-title">
        <h2 id="modes-title" className="section-title">{T.chooseMode}</h2>
        <div className="modes__grid">
          <article className="card mode-card">
            <h3>{T.find}</h3>
            <p>{T.findText}</p>
            <button type="button" className="btn btn--primary" onClick={onStartFind} disabled={!canPlay}>
              {T.start} <ArrowIcon />
            </button>
          </article>
          <article className="card mode-card">
            <h3>{T.name}</h3>
            <p>
              {T.nameText} {settings.ignoreAccents ? T.acceptedAccents : T.accepted}
            </p>
            <button type="button" className="btn btn--primary" onClick={onStartName} disabled={!canPlay}>
              {T.start} <ArrowIcon />
            </button>
          </article>
          <article className="card mode-card">
            <h3>{T.match}</h3>
            <p>{T.matchText}</p>
            <button type="button" className="btn btn--primary" onClick={onStartMatch}>
              {T.start} <ArrowIcon />
            </button>
          </article>
        </div>
      </section>

      <SettingsPanel settings={settings} onChange={onSettingsChange} />
    </main>
  );
}
