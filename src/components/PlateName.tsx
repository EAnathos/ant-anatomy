import type { Plate } from '../data/parts';

/** Libellé d'une planche : « Ouvrière · *Neoponera verenae* », « Aile de reine · *Odontomachus* sp. », « Mandibule · vue composite ». */
export function PlateName({ plate }: { plate: Plate }) {
  return (
    <>
      {plate.subject} ·{' '}
      {plate.taxon ? (
        <>
          <em>{plate.taxon}</em>
          {plate.sp ? ' sp.' : ''}
        </>
      ) : (
        plate.detail
      )}
    </>
  );
}

/** Même libellé en texte brut, pour les listes déroulantes. */
export const plateText = (plate: Plate) =>
  `${plate.subject} · ${plate.taxon ? `${plate.taxon}${plate.sp ? ' sp.' : ''}` : plate.detail ?? ''}`;
