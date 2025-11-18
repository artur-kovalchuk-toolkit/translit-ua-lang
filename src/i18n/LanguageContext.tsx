import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Language } from './translations';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlLang = searchParams.get('lang');
  
  // Validate URL language parameter
  const getValidLanguage = (lang: string | null | undefined): Language => {
    if (lang === 'uk' || lang === 'en') {
      return lang;
    }
    return 'uk'; // default
  };

  // Get initial language from URL or fallback
  const getInitialLanguage = (): Language => {
    if (urlLang) {
      return getValidLanguage(urlLang);
    }
    
    // Fallback to localStorage or browser language
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('translit-language') as Language;
        if (saved && (saved === 'uk' || saved === 'en')) {
          return saved;
        }
      } catch (e) {
        console.warn('localStorage not available:', e);
      }
      
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('uk')) {
          return 'uk';
        }
      }
    }
    
    return 'uk';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Sync with URL parameter changes
  useEffect(() => {
    if (urlLang) {
      const validLang = getValidLanguage(urlLang);
      if (validLang !== language) {
        setLanguageState(validLang);
      }
    }
  }, [urlLang, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Update URL with query parameter
    setSearchParams({ lang });
    
    // Also save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('translit-language', lang);
      } catch (e) {
        console.warn('Failed to save language preference:', e);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('translit-language', language);
      } catch (e) {
        console.warn('Failed to save language preference:', e);
      }
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

