import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header, type NavTarget } from './components/Header';
import { regionsOf, type PartId } from './data/parts';
import { buildQuestions, playableParts, shuffle, type Answer, type Settings } from './lib/session';
import { FindMode } from './screens/FindMode';
import { Home } from './screens/Home';
import { NameMode } from './screens/NameMode';
import { Results } from './screens/Results';

type Screen =
  | { name: 'home' }
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
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [run, setRun] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    else setScreen({ name: 'home' });
  };

  const current: NavTarget | null = screen.name === 'find' || screen.name === 'name' ? screen.name : null;

  return (
    <>
      <div className="container">
        <Header current={current} onNavigate={navigate} />
      </div>
      {screen.name === 'home' && (
        <Home settings={settings} onSettingsChange={setSettings} onStartFind={() => startFind()} onStartName={startName} />
      )}
      {screen.name === 'find' && (
        <FindMode
          key={screen.run}
          plate={settings.plate}
          questions={screen.questions}
          onFinish={(log, durationMs) => setScreen({ name: 'results', log, durationMs })}
        />
      )}
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
        <Footer />
      </div>
    </>
  );
}
