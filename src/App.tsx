import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Footer } from './components/Footer';
import { Header, type NavTarget } from './components/Header';
import { Launch } from './components/Launch';
import { PlateName } from './components/PlateName';
import { PLATES, PLATE_BY_ID, partIn, regionsOf, type PartId, type PlateId } from './data/parts';
import { GLOSSARY_HASH, PLATE_PARAM, isGlossaryHash, t } from './i18n';
import { buildQuestions, playableParts, shuffle, type Answer, type Question, type Settings } from './lib/session';
import { FindMode } from './screens/FindMode';
import { Glossary } from './screens/Glossary';
import { Home } from './screens/Home';
import { MatchMode, matchPool, type MatchSource } from './screens/MatchMode';
import { NameMode } from './screens/NameMode';
import { Results } from './screens/Results';

type Screen =
  | { name: 'home'; selected?: PartId }
  | { name: 'glossary' }
  | { name: 'find'; questions: Question[]; run: number }
  | { name: 'name'; run: number }
  | { name: 'match'; run: number }
  | { name: 'results'; log: Answer[]; durationMs: number };

// Planche de départ : celle transmise par le lien de changement de langue (?planche=…), sinon l'ouvrière.
function initialSettings(): Settings {
  const asked = new URLSearchParams(location.search).get(PLATE_PARAM);
  const plate = PLATES.find((p) => p.id === asked)?.id ?? 'ouvriere';
  return { plate, regions: regionsOf(plate).map((r) => r.id), questionCount: 10, ignoreAccents: true, allPlates: false };
}

const T = t(
  { find: 'Trouver', name: 'Nommer', match: 'Relier', glossary: 'Tout le glossaire', allPlates: 'Toutes les planches' },
  { find: 'Find', name: 'Name', match: 'Match', glossary: 'The whole glossary', allPlates: 'All plates' },
);

type GameScreen = 'find' | 'name' | 'match';

export function App() {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  // Le paramètre a servi : on le retire de l'adresse, qui reste propre (la planche est dans l'état de l'app).
  useEffect(() => {
    const url = new URL(location.href);
    if (!url.searchParams.has(PLATE_PARAM)) return;
    url.searchParams.delete(PLATE_PARAM);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }, []);
  const [screen, setScreen] = useState<Screen>(() => (isGlossaryHash(location.hash) ? { name: 'glossary' } : { name: 'home' }));
  const [run, setRun] = useState(0);
  const [matchSource, setMatchSource] = useState<MatchSource>('plate');
  /** Écran de lancement affiché avant de monter le jeu. */
  const [launching, setLaunching] = useState<{ title: string; subtitle: ReactNode } | null>(null);
  /** Le jeu et le pied de page sont montés quand l'écran de lancement commence à s'effacer. */
  const [revealed, setRevealed] = useState(true);
  const revealGame = useCallback(() => setRevealed(true), []);
  const endLaunch = useCallback(() => setLaunching(null), []);
  const hidden = launching !== null && !revealed;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Le glossaire a sa propre adresse (#glossaire, #glossary) : lien partageable, retour arrière du navigateur.
  useEffect(() => {
    const onPop = () =>
      setScreen((s) => (isGlossaryHash(location.hash) ? { name: 'glossary' } : s.name === 'glossary' ? { name: 'home' } : s));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const onGlossary = isGlossaryHash(location.hash);
    if (screen.name === 'glossary' && !onGlossary) history.pushState(null, '', GLOSSARY_HASH);
    else if (screen.name !== 'glossary' && onGlossary) history.pushState(null, '', location.pathname + location.search);
  }, [screen]);

  const canPlay = playableParts(settings).length > 0;

  const plateLabel = (plate: PlateId) => <PlateName plate={PLATE_BY_ID[plate]} />;

  // Sous-titre de l'écran de lancement : la planche, ou « Toutes les planches ».
  const sessionLabel = () => (settings.allPlates ? T.allPlates : plateLabel(settings.plate));

  const launch = (game: GameScreen, subtitle: ReactNode = sessionLabel()) => {
    setLaunching({ title: T[game], subtitle });
    setRevealed(false);
    setRun((r) => r + 1);
  };

  const startFind = (questions: Question[] = buildQuestions(settings)) => {
    if (questions.length === 0) return setScreen({ name: 'home' });
    launch('find');
    setScreen({ name: 'find', questions, run: run + 1 });
  };

  const startName = () => {
    if (!canPlay) return setScreen({ name: 'home' });
    launch('name');
    setScreen({ name: 'name', run: run + 1 });
  };

  // Relier : les structures de la planche, ou tout le glossaire s'il y en a trop peu (ou si on vient du glossaire).
  const startMatch = (source: MatchSource = matchSource) => {
    const usable = source === 'plate' && matchPool(settings, 'plate').length >= 2 ? 'plate' : 'glossary';
    setMatchSource(usable);
    launch('match', usable === 'plate' ? sessionLabel() : T.glossary);
    setScreen({ name: 'match', run: run + 1 });
  };

  const navigate = (target: NavTarget) => {
    if (target === 'find') startFind();
    else if (target === 'name') startName();
    else if (target === 'match') startMatch();
    else if (target === 'glossary') setScreen({ name: 'glossary' });
    else setScreen({ name: 'home' });
  };

  // Depuis le glossaire : accueil sur la planche de la structure, toutes ses régions affichées, structure sélectionnée.
  const showPart = (plate: PlateId, id: PartId) => {
    const { region } = partIn(plate, id);
    if (plate !== settings.plate || !settings.regions.includes(region)) {
      setSettings({ ...settings, plate, regions: regionsOf(plate).map((r) => r.id) });
    }
    setScreen({ name: 'home', selected: id });
  };

  const current: NavTarget | null = screen.name === 'home' || screen.name === 'results' ? null : screen.name;

  return (
    <>
      <div className="container">
        <Header current={current} plate={settings.plate} onNavigate={navigate} />
      </div>
      {screen.name === 'home' && (
        <Home
          initialSelected={screen.selected}
          settings={settings}
          onSettingsChange={setSettings}
          onStartFind={() => startFind()}
          onStartName={startName}
          onStartMatch={() => startMatch('plate')}
        />
      )}
      {launching && <Launch title={launching.title} subtitle={launching.subtitle} onReveal={revealGame} onDone={endLaunch} />}
      {!hidden && screen.name === 'find' && (
        <FindMode
          key={screen.run}
          questions={screen.questions}
          onFinish={(log, durationMs) => setScreen({ name: 'results', log, durationMs })}
        />
      )}
      {screen.name === 'glossary' && <Glossary onShowPart={showPart} onStartMatch={() => startMatch('glossary')} />}
      {!hidden && screen.name === 'name' && <NameMode key={screen.run} settings={settings} />}
      {!hidden && screen.name === 'match' && (
        <MatchMode key={screen.run} settings={settings} source={matchSource} onSourceChange={setMatchSource} />
      )}
      {screen.name === 'results' && (
        <Results
          log={screen.log}
          durationMs={screen.durationMs}
          onReplay={(missed) => startFind(shuffle(missed))}
          onRestart={() => startFind()}
          onHome={() => setScreen({ name: 'home' })}
        />
      )}
      {/* Remonté à chaque écran pour entrer en fondu avec lui, plutôt que d'apparaître avant. */}
      {!hidden && (
        <div key={'run' in screen ? `${screen.name}-${screen.run}` : screen.name} className="container page-footer">
          <Footer onGlossary={() => navigate('glossary')} />
        </div>
      )}
    </>
  );
}
