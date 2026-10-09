import { GLOSSARY_HASH, t } from '../i18n';

const T = t(
  { glossary: 'Glossaire', glossaryText: ' : tous les termes, leurs abréviations et leurs synonymes.', before: 'Pour en apprendre davantage : ', after: ' sur AntWiki.' },
  { glossary: 'Glossary', glossaryText: ': every term, with its abbreviation and synonyms.', before: 'To learn more: ', after: ' on AntWiki.' },
);

// Les crédits des planches sont sur l'accueil, sous le texte de la planche choisie.
export function Footer({ onGlossary }: { onGlossary: () => void }) {
  return (
    <footer className="site-footer">
      <p>
        <a
          href={GLOSSARY_HASH}
          onClick={(e) => {
            e.preventDefault();
            onGlossary();
          }}
        >
          {T.glossary}
        </a>
        {T.glossaryText}
      </p>
      <p>
        {T.before}
        <a href="https://antwiki.org/wiki/Morphology_and_Terminology" target="_blank" rel="noopener noreferrer">
          Morphology and Terminology
        </a>
        {T.after}
      </p>
    </footer>
  );
}
