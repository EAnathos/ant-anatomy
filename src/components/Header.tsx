export type NavTarget = 'home' | 'find' | 'name';

interface HeaderProps {
  current: NavTarget | null;
  onNavigate: (target: NavTarget) => void;
}

export function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        Atlas anatomique <em>Formicidae</em>
      </button>
      <nav aria-label="Modes de jeu" className="site-nav">
        <button
          type="button"
          className="nav-link"
          aria-current={current === 'find' ? 'page' : undefined}
          onClick={() => onNavigate('find')}
        >
          Trouver
        </button>
        <button
          type="button"
          className="nav-link"
          aria-current={current === 'name' ? 'page' : undefined}
          onClick={() => onNavigate('name')}
        >
          Nommer
        </button>
      </nav>
    </header>
  );
}
