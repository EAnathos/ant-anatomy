import { LANG } from '../i18n';

export function Footer() {
  return (
    <footer className="site-footer">
      {LANG === 'en' ? (
        <>
          <p>
            To learn more:{' '}
            <a href="https://antwiki.org/wiki/Morphology_and_Terminology" target="_blank" rel="noopener noreferrer">
              Morphology and Terminology
            </a>{' '}
            on AntWiki.
          </p>
          <p>
            Worker plate:{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg" target="_blank" rel="noopener noreferrer">
              Scheme ant worker anatomy
            </a>
            , worker of <em>Neoponera verenae</em> by LadyofHats and Sophivorus, public domain, via Wikimedia Commons.
          </p>
        </>
      ) : (
        <>
          <p>
            Pour en apprendre davantage :{' '}
            <a href="https://antwiki.org/wiki/Morphology_and_Terminology" target="_blank" rel="noopener noreferrer">
              Morphology and Terminology
            </a>{' '}
            sur AntWiki.
          </p>
          <p>
            Planche de l’ouvrière :{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Scheme_ant_worker_anatomy-clean.svg" target="_blank" rel="noopener noreferrer">
              Scheme ant worker anatomy
            </a>
            , ouvrière de <em>Neoponera verenae</em> par LadyofHats et Sophivorus, domaine public, via Wikimedia Commons.
          </p>
        </>
      )}
    </footer>
  );
}
