import { GLOSSARY_HASH, GLOSSARY_HASHES, LANG, LANG_URLS, rememberLang, t, type Lang } from '../i18n';

export type NavTarget = 'home' | 'find' | 'name' | 'glossary';

interface HeaderProps {
  current: NavTarget | null;
  onNavigate: (target: NavTarget) => void;
}

const T = t(
  { modes: 'Navigation', find: 'Trouver', name: 'Nommer', glossary: 'Glossaire', language: 'Langue' },
  { modes: 'Navigation', find: 'Find', name: 'Name', glossary: 'Glossary', language: 'Language' },
);

const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: 'fr', short: 'FR', label: 'Français' },
  { id: 'en', short: 'EN', label: 'English' },
];

export function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        {LANG === 'en' ? 'Formicidae anatomy atlas' : 'Atlas anatomique Formicidae'}
      </button>
      <div className="site-header__end">
        <nav aria-label={T.modes} className="site-nav">
          <button
            type="button"
            className="nav-link"
            aria-current={current === 'find' ? 'page' : undefined}
            onClick={() => onNavigate('find')}
          >
            {T.find}
          </button>
          <button
            type="button"
            className="nav-link"
            aria-current={current === 'name' ? 'page' : undefined}
            onClick={() => onNavigate('name')}
          >
            {T.name}
          </button>
          <a
            href={GLOSSARY_HASH}
            className="nav-link"
            aria-current={current === 'glossary' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('glossary');
            }}
          >
            {T.glossary}
          </a>
        </nav>
        <nav aria-label={T.language} className="lang-switch">
          {LANGS.map((l) => (
            <a
              key={l.id}
              href={LANG_URLS[l.id] + (current === 'glossary' ? GLOSSARY_HASHES[l.id] : '')}
              hrefLang={l.id}
              lang={l.id}
              aria-label={l.label}
              aria-current={l.id === LANG ? 'page' : undefined}
              onClick={() => rememberLang(l.id)}
            >
              {l.short}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
