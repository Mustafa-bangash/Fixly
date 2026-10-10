import { useContext } from 'react';
import { LanguageContext } from '../context/languageContext.js';

// Usage:  const { lang, setLang, t } = useLanguage();
export function useLanguage() {
  return useContext(LanguageContext);
}
