import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskSearchProps {
  onSearch: (query: string, tags: string[]) => void;
  availableTags?: string[];
}

export function TaskSearch({ onSearch, availableTags = [] }: TaskSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(query, selectedTags);
  }, [query, selectedTags, onSearch]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tag);
      const newTags = isSelected
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      onSearch(query, newTags);
      return newTags;
    });
  }, [query, onSearch]);

  const removeTag = useCallback((tagToRemove: string) => {
    setSelectedTags(prev => {
      const newTags = prev.filter(tag => tag !== tagToRemove);
      onSearch(query, newTags);
      return newTags;
    });
  }, [query, onSearch]);

  return (
    <div className="w-full max-w-2xl">
      <div
        className={cn(
          'relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200',
          'bg-white dark:bg-slate-800 border',
          isFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-slate-200 dark:border-slate-700'
        )}
      >
        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            handleSearch();
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search tasks..."
          className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
        />
      </div>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        <AnimatePresence>
          {selectedTags.map(tag => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Available Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {availableTags.map(tag => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleTag(tag)}
            className={cn(
              'px-2 py-1 text-sm rounded-full transition-colors',
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 