'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function LanguageSwitcher() {
  const { locale, setLocale, isRTL } = useLanguage();

  const handleLanguageChange = (newLocale: 'en' | 'fa') => {
    setLocale(newLocale);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {locale === 'en' ? 'Language' : 'زبان'}
        </span>
      </div>
      
      <div className="flex gap-2">
        <motion.button
          onClick={() => handleLanguageChange('en')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            locale === 'en'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          English
        </motion.button>
        <motion.button
          onClick={() => handleLanguageChange('fa')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            locale === 'fa'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          فارسی
        </motion.button>
      </div>
      
      {isRTL && (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-xs font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          RTL
        </div>
      )}
    </div>
  );
} 