import { useState } from 'react';
import { ArrowIcon } from '../components/icons';
import { PLATE_BY_ID, REGION_BY_ID, TERMS, placementsOf, type PartId, type PlateId, type Term } from '../data/parts';
import { LANG, t } from '../i18n';
import { normalize } from '../lib/answers';

const T = t(
  {
    title: 'Glossaire',
    lead: (n: number) => `${n} termes d’anatomie de la fourmi, avec leur définition, leur abréviation et leurs synonymes. Ceux qui figurent sur une planche y renvoient.`,
    source: 'Définitions et abréviations d’après le glossaire de Bolton (1994), ',
    sourceAfter: ', pour le corps.',
    notOnPlate: 'Pas encore sur une planche',
    search: 'Chercher un terme',
    placeholder: 'Nom, synonyme ou abréviation',
    abbr: 'Abréviation',
    abbrSr: 'Abréviation : ',
    synonyms: 'Synonymes : ',
    plate: 'Planche : ',
    show: 'Voir sur la planche',
    count: (n: number) => (n === 1 ? '1 terme' : `${n} termes`),
    empty: 'Aucun terme ne correspond à ta recherche.',
  },
  {
    title: 'Glossary',
    lead: (n: number) => `${n} ant anatomy terms, with their definition, abbreviation and synonyms. Those shown on a plate link to it.`,
    source: 'Definitions and abbreviations follow the glossary of Bolton (1994), ',
    sourceAfter: ', for the body.',
    notOnPlate: 'Not on a plate yet',
    search: 'Search a term',
    placeholder: 'Name, synonym or abbreviation',
    abbr: 'Abbreviation',
    abbrSr: 'Abbreviation: ',
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

// Synonymes affichés : sans ceux qui répètent l'abréviation (« sc », « rs »…).
const shownSynonyms = (p: Term) => p.synonyms.filter((s) => !p.abbr || normalize(s, true) !== normalize(p.abbr, true));

const matches = (p: Term, query: string) =>
  [p.name, p.abbr ?? '', ...p.synonyms].some((s) => normalize(s, true).includes(query));

export function Glossary({ onShowPart }: { onShowPart: (plate: PlateId, id: PartId) => void }) {
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
        </p>
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
              const synonyms = shownSynonyms(p);
              const placements = placementsOf(p.id);
              return (
                <div key={p.id} className="glossary__entry">
                  <dt className="plate__title">
                    <strong>{p.name}</strong>
                    {p.abbr && (
                      <span className="part-abbr" title={T.abbr}>
                        <span className="sr-only">{T.abbrSr}</span>
                        {p.abbr}
                      </span>
                    )}
                  </dt>
                  <dd>{p.definition}</dd>
                  {synonyms.length > 0 && (
                    <dd className="glossary__synonyms">
                      {T.synonyms}
                      {synonyms.join(', ')}
                    </dd>
                  )}
                  <dd className="glossary__refs">
                    {placements.length === 0 && <span className="glossary__off">{T.notOnPlate}</span>}
                    {placements.map(({ plate: id, region }) => {
                      const plate = PLATE_BY_ID[id];
                      return (
                        <button key={id} type="button" className="plate-ref" onClick={() => onShowPart(id, p.id)} title={T.show}>
                          <span className="sr-only">{T.plate}</span>
                          {plate.subject} · <em>{plate.taxon}</em>
                          {plate.sp ? ' sp.' : ''}
                          <span className="eyebrow">{REGION_BY_ID[region].label}</span>
                          <ArrowIcon size={14} />
                        </button>
                      );
                    })}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </main>
  );
}
