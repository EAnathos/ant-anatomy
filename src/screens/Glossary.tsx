import { useState } from 'react';
import { ArrowIcon } from '../components/icons';
import { PlateName } from '../components/PlateName';
import { Rich } from '../components/Rich';
import { PLATE_BY_ID, TERMS, placementsOf, type PartId, type PlateId, type Term } from '../data/parts';
import { LANG, t } from '../i18n';
import { normalize } from '../lib/answers';

const T = t(
  {
    title: 'Glossaire',
    lead: (n: number) => `${n} termes d’anatomie de la fourmi, avec leur définition et leurs synonymes. Ceux qui figurent sur une planche y renvoient.`,
    source: 'Définitions d’après Bolton (1994), ',
    sourceAfter: ', pour le corps, complétées par Keller (2011), ',
    sourceLast: ', et pour l’abdomen par Lieberman et al. (2022), ',
    sourceEnd: '.',
    quiz: 'Quiz : relier mots et définitions',
    search: 'Chercher un terme',
    placeholder: 'Nom ou synonyme',
    synonyms: 'Synonymes : ',
    plate: 'Planche : ',
    show: 'Voir sur la planche',
    count: (n: number) => (n === 1 ? '1 terme' : `${n} termes`),
    empty: 'Aucun terme ne correspond à ta recherche.',
  },
  {
    title: 'Glossary',
    lead: (n: number) => `${n} ant anatomy terms, with their definition and synonyms. Those shown on a plate link to it.`,
    source: 'Definitions follow Bolton (1994), ',
    sourceAfter: ', for the body, supplemented by Keller (2011), ',
    sourceLast: ', and for the abdomen by Lieberman et al. (2022), ',
    sourceEnd: '.',
    quiz: 'Quiz: match words and definitions',
    search: 'Search a term',
    placeholder: 'Name or synonym',
    synonyms: 'Synonyms: ',
    plate: 'Plate: ',
    show: 'Show on the plate',
    count: (n: number) => (n === 1 ? '1 term' : `${n} terms`),
    empty: 'No term matches your search.',
  },
);

const collator = new Intl.Collator(LANG);

const SORTED = [...TERMS].sort((a, b) => collator.compare(a.name, b.name));

/** Lettre de la rubrique, sans accent (« Éperons » sous E). */
const letterOf = (p: Term) => normalize(p.name, true).charAt(0).toUpperCase();

const matches = (p: Term, query: string) =>
  [p.name, ...p.synonyms, ...(p.variants ?? [])].some((s) => normalize(s, true).includes(query));

interface GlossaryProps {
  onShowPart: (plate: PlateId, id: PartId) => void;
  onStartMatch: () => void;
}

export function Glossary({ onShowPart, onStartMatch }: GlossaryProps) {
  const [query, setQuery] = useState('');
  const q = normalize(query, true);
  const found = q ? SORTED.filter((p) => matches(p, q)) : SORTED;

  const groups: { letter: string; parts: Term[] }[] = [];
  for (const p of found) {
    const letter = letterOf(p);
    if (groups.at(-1)?.letter === letter) groups.at(-1)!.parts.push(p);
    else groups.push({ letter, parts: [p] });
  }

  return (
    <main className="container glossary">
      <section className="glossary__head">
        <h1 className="display">{T.title}</h1>
        <p className="lead">{T.lead(TERMS.length)}</p>
        <p className="plate-credit">
          {T.source}
          <em>Identification Guide to the Ant Genera of the World</em>
          {T.sourceAfter}
          <em>A phylogenetic analysis of ant morphology</em>
          {T.sourceLast}
          <em>The ant abdomen</em>
          {T.sourceEnd}
        </p>
        <div className="glossary__tools">
          <label className="glossary__search">
            <span className="sr-only">{T.search}</span>
            <input
              type="search"
              className="field"
              value={query}
              placeholder={T.placeholder}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button type="button" className="btn btn--secondary" onClick={onStartMatch}>
            {T.quiz} <ArrowIcon />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {q ? T.count(found.length) : ''}
        </p>
      </section>

      {found.length === 0 && <p className="muted glossary__empty">{T.empty}</p>}

      {groups.map(({ letter, parts }) => (
        <section key={letter} className="glossary__group" aria-labelledby={`glossary-${letter}`}>
          <h2 id={`glossary-${letter}`} className="glossary__letter">
            {letter}
          </h2>
          <dl className="glossary__list">
            {parts.map((p) => {
              const { synonyms } = p;
              const placements = placementsOf(p.id);
              return (
                <div key={p.id} className="glossary__entry">
                  <dt className="plate__title">
                    <strong>{p.name}</strong>
                  </dt>
                  <dd><Rich text={p.definition} /></dd>
                  {synonyms.length > 0 && (
                    <dd className="glossary__synonyms">
                      {T.synonyms}
                      {synonyms.join(', ')}
                    </dd>
                  )}
                  {placements.length > 0 && (
                    <dd className="glossary__refs">
                      {placements.map(({ plate: id }) => {
                        const plate = PLATE_BY_ID[id];
                        return (
                          <button key={id} type="button" className="plate-ref" onClick={() => onShowPart(id, p.id)} title={T.show}>
                            <span className="sr-only">{T.plate}</span>
                            <PlateName plate={plate} />
                            <ArrowIcon size={14} />
                          </button>
                        );
                      })}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </main>
  );
}
