import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header, type NavTarget } from './components/Header';
import { partIn, regionsOf, type PartId, type PlateId } from './data/parts';
import { GLOSSARY_HASH, isGlossaryHash } from './i18n';
import { buildQuestions, playableParts, shuffle, type Answer, type Settings } from './lib/session';
import { FindMode } from './screens/FindMode';
import { Glossary } from './screens/Glossary';
import { Home } from './screens/Home';
import { NameMode } from './screens/NameMode';
import { Results } from './screens/Results';

type Screen =
  | { name: 'home'; selected?: PartId }
  | { name: 'glossary' }
  | { name: 'find'; questions: PartId[]; run: number }
  | { name: 'name'; run: number }
  | { name: 'results'; log: Answer[]; durationMs: number };

const DEFAULT_SETTINGS: Settings = {
  plate: 'ouvriere',
  regions: regionsOf('ouvriere').map((r) => r.id),
  questionCount: 10,
  ignoreAccents: true,
};

export function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [screen, setScreen] = useState<Screen>(() => (isGlossaryHash(location.hash) ? { name: 'glossary' } : { name: 'home' }));
  const [run, setRun] = useState(0);

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

  const startFind = (questions: PartId[] = buildQuestions(settings)) => {
    if (questions.length === 0) return setScreen({ name: 'home' });
    setRun((r) => r + 1);
    setScreen({ name: 'find', questions, run: run + 1 });
  };

  const startName = () => {
    if (!canPlay) return setScreen({ name: 'home' });
    setRun((r) => r + 1);
    setScreen({ name: 'name', run: run + 1 });
  };

  const navigate = (target: NavTarget) => {
    if (target === 'find') startFind();
    else if (target === 'name') startName();
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

  const current: NavTarget | null = screen.name === 'find' || screen.name === 'name' || screen.name === 'glossary' ? screen.name : null;

  return (
    <>
      <div className="container">
        <Header current={current} onNavigate={navigate} />
      </div>
      {screen.name === 'home' && (
        <Home initialSelected={screen.selected} settings={settings} onSettingsChange={setSettings} onStartFind={() => startFind()} onStartName={startName} />
      )}
      {screen.name === 'find' && (
        <FindMode
          key={screen.run}
          plate={settings.plate}
          questions={screen.questions}
          onFinish={(log, durationMs) => setScreen({ name: 'results', log, durationMs })}
        />
      )}
      {screen.name === 'glossary' && <Glossary onShowPart={showPart} />}
      {screen.name === 'name' && <NameMode key={screen.run} settings={settings} />}
      {screen.name === 'results' && (
        <Results
          plate={settings.plate}
          log={screen.log}
          durationMs={screen.durationMs}
          onReplay={(missed) => startFind(shuffle(missed))}
          onRestart={() => startFind()}
          onHome={() => setScreen({ name: 'home' })}
        />
      )}
      <div className="container">
        <Footer onGlossary={() => navigate('glossary')} />
      </div>
    </>
  );
}
