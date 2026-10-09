export type Lang = 'fr' | 'en';

/** Langue de la page, fixée par `<html lang>` : `index.html` (fr) ou `en/index.html` (en). */
export const LANG: Lang = typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'fr';

/** Texte de la langue courante. `en` doit avoir exactement la forme de `fr` (vérifié par le typecheck). */
export function t<T>(fr: T, en: NoInfer<T>): T {
  return LANG === 'en' ? en : fr;
}

export const LANG_URLS: Record<Lang, string> = {
  fr: import.meta.env.BASE_URL,
  en: `${import.meta.env.BASE_URL}en/`,
};

/** Adresse du glossaire dans la langue de la page. Les deux sont reconnues (la redirection fr → en garde le #). */
export const GLOSSARY_HASHES: Record<Lang, string> = { fr: '#glossaire', en: '#glossary' };

export const GLOSSARY_HASH = GLOSSARY_HASHES[LANG];

export const isGlossaryHash = (hash: string) => hash === '#glossaire' || hash === '#glossary';

/** Mémorise le choix explicite de langue (lu par le script de redirection de `index.html`). */
export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem('lang', lang);
  } catch {
    // stockage indisponible (navigation privée, données bloquées) : le lien suffit
  }
}
