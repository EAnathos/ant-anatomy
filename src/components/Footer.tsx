import { t } from '../i18n';

const T = t(
  { before: 'Pour en apprendre davantage : ', after: ' sur AntWiki.' },
  { before: 'To learn more: ', after: ' on AntWiki.' },
);

// Les crédits des planches sont sur l'accueil, sous le texte de la planche choisie.
export function Footer() {
  return (
    <footer className="site-footer">
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
