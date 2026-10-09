import { useEffect, type ReactNode } from 'react';

interface LaunchProps {
  /** Nom du mode, en grand : « Trouver », « Nommer », « Relier ». */
  title: string;
  /** Ligne au-dessus du titre : la planche ou la source des mots. */
  subtitle: ReactNode;
  /** L'écran commence à s'effacer : le jeu peut être monté dessous. */
  onReveal: () => void;
  /** L'écran a disparu. */
  onDone: () => void;
}

const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Écran de lancement d'une partie : le nom du mode apparaît, une barre se remplit, puis l'écran s'efface.
 * Le jeu n'est monté qu'au début de l'effacement (`onReveal`), pour que son chronomètre parte au bon moment et
 * qu'il apparaisse sous l'écran qui s'efface, en même temps que le pied de page. Un clic l'écourte ;
 * sans animation (préférence « réduire les animations »), il s'efface aussitôt.
 */
export function Launch({ title, subtitle, onReveal, onDone }: LaunchProps) {
  useEffect(() => {
    const finish = () => {
      onReveal();
      onDone();
    };
    if (reducedMotion()) return finish();
    // Secours : un onglet masqué suspend les animations, la fin de `launch-out` n'arriverait pas.
    const timer = setTimeout(finish, 2000);
    return () => clearTimeout(timer);
  }, [onReveal, onDone]);

  return (
    <div
      className="launch"
      role="status"
      onClick={() => {
        onReveal();
        onDone();
      }}
      onAnimationStart={(e) => {
        if (e.animationName === 'launch-out') onReveal();
      }}
      onAnimationEnd={(e) => {
        if (e.animationName === 'launch-out') onDone();
      }}
    >
      <div className="launch__inner">
        <span className="eyebrow launch__subtitle">{subtitle}</span>
        <span className="launch__title">{title}</span>
        <span className="launch__bar" aria-hidden="true" />
      </div>
    </div>
  );
}
