'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/lib/language-context';

export default function FontDemoPage() {
  const { locale } = useLanguage();

  const persianTexts = {
    heading: "مدیریت وظایف هوشمند",
    subtitle: "سیستم مدیریت وظایف پیشرفته با رابط کاربری مدرن",
    description: "این سیستم مدیریت وظایف با استفاده از فونت زیبای وزیرمتن طراحی شده است که خوانایی فوق‌العاده‌ای دارد و برای متون فارسی بهینه‌سازی شده است.",
    features: [
      "طراحی مدرن و زیبا",
      "پشتیبانی کامل از RTL",
      "فونت بهینه برای فارسی",
      "رابط کاربری واکنش‌گرا",
      "عملکرد سریع و روان"
    ],
    sample: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است."
  };

  const englishTexts = {
    heading: "Smart Task Management",
    subtitle: "Advanced task management system with modern interface",
    description: "This task management system is designed with the beautiful Vazirmatn font that provides excellent readability and is optimized for Persian texts.",
    features: [
      "Modern and beautiful design",
      "Full RTL support",
      "Optimized font for Persian",
      "Responsive user interface",
      "Fast and smooth performance"
    ],
    sample: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  };

  const texts = locale === 'fa' ? persianTexts : englishTexts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <LanguageSwitcher />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {texts.heading}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {texts.subtitle}
            </motion.p>
          </div>

          {/* Description */}
          <motion.div 
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {texts.description}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {texts.features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {feature}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Sample Text */}
          <motion.div 
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              {locale === 'fa' ? 'نمونه متن' : 'Sample Text'}
            </h3>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {texts.sample}
              </p>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {texts.sample}
              </p>
            </div>
          </motion.div>

          {/* Font Information */}
          <motion.div 
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              {locale === 'fa' ? 'اطلاعات فونت' : 'Font Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <strong>{locale === 'fa' ? 'فونت اصلی:' : 'Primary Font:'}</strong> Vazirmatn
              </div>
              <div>
                <strong>{locale === 'fa' ? 'فونت پشتیبان:' : 'Fallback Fonts:'}</strong> Noto Nastaliq Urdu, Amiri
              </div>
              <div>
                <strong>{locale === 'fa' ? 'وزن فونت:' : 'Font Weights:'}</strong> 100-900
              </div>
              <div>
                <strong>{locale === 'fa' ? 'بهینه‌سازی:' : 'Optimization:'}</strong> RTL, Ligatures, Kerning
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 