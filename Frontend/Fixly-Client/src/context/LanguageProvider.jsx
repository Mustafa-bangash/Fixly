import { useEffect, useState } from 'react';
import { LanguageContext } from './languageContext.js';
import { UR } from '../utils/translations.js';

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en'); // 'en' or 'ur'

  // Urdu is written right-to-left, so the whole page direction changes.
  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // t('Sign In') returns the Urdu text when Urdu is selected, otherwise the same English text.
  const t = (text) => (lang === 'ur' && UR[text]) || text;

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}
