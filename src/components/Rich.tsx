import { Fragment } from 'react';

/** Texte des données : les noms de genres et d'espèces entre astérisques (*Eciton*) sont rendus en italique. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((chunk, i) => (i % 2 === 1 ? <em key={i}>{chunk}</em> : <Fragment key={i}>{chunk}</Fragment>))}
    </>
  );
}
