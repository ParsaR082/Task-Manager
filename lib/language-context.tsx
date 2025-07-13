'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  locale: 'en' | 'fa';
  setLocale: (locale: 'en' | 'fa') => void;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<'en' | 'fa'>('en');

  // RTL languages
  const rtlLanguages: ('en' | 'fa')[] = ['fa'];
  const isRTL = rtlLanguages.includes(locale);
  const dir = isRTL ? 'rtl' : 'ltr';

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as 'en' | 'fa';
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fa')) {
      setLocaleState(savedLocale);
    }
  }, []);

  // Update document direction and language when locale changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  const setLocale = (newLocale: 'en' | 'fa') => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Update document direction immediately
    document.documentElement.dir = rtlLanguages.includes(newLocale) ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const value: LanguageContextType = {
    locale,
    setLocale,
    isRTL,
    dir,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
} 