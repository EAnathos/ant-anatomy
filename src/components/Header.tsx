import { LANG, LANG_URLS, rememberLang, t, type Lang } from '../i18n';

export type NavTarget = 'home' | 'find' | 'name';

interface HeaderProps {
  current: NavTarget | null;
  onNavigate: (target: NavTarget) => void;
}

const T = t(
  { modes: 'Modes de jeu', find: 'Trouver', name: 'Nommer', language: 'Langue' },
  { modes: 'Game modes', find: 'Find', name: 'Name', language: 'Language' },
);

const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: 'fr', short: 'FR', label: 'Français' },
  { id: 'en', short: 'EN', label: 'English' },
];

export function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        {LANG === 'en' ? (
          <>
            <em>Formicidae</em> anatomy atlas
          </>
        ) : (
          <>
            Atlas anatomique <em>Formicidae</em>
          </>
        )}
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
        </nav>
        <nav aria-label={T.language} className="lang-switch">
          {LANGS.map((l) => (
            <a
              key={l.id}
              href={LANG_URLS[l.id]}
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
