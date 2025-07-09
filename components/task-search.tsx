import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Tag as TagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskSearchProps {
  onSearch?: (query: string, tags: string[]) => void;
  availableTags?: string[];
}

export function TaskSearch({ onSearch, availableTags = [] }: TaskSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowTagsDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(query, selectedTags);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, selectedTags, onSearch]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tag);
      return isSelected
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
    });
  }, []);

  const removeTag = useCallback((tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('', selectedTags);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Group tags by first letter for better organization
  const groupedTags = availableTags.reduce((acc, tag) => {
    const firstLetter = tag.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tag);
    return acc;
  }, {} as Record<string, string[]>);

  // Sort the groups alphabetically
  const sortedGroups = Object.keys(groupedTags).sort();

  return (
    <div className="w-full max-w-2xl" ref={searchRef}>
      <div
        className={cn(
          'relative flex items-center gap-2 p-2 rounded-lg transition-all duration-200',
          'bg-white dark:bg-slate-800 border shadow-sm',
          isFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
            : 'border-slate-200 dark:border-slate-700'
        )}
      >
        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400 min-w-5" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={selectedTags.length > 0 ? "Search with tags..." : "Search tasks..."}
          className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
        />
        
        {/* Show clear button when there's input */}
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={clearSearch}
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </motion.button>
        )}
        
        {/* Tag button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTagsDropdown(!showTagsDropdown)}
          className={cn(
            "p-1.5 rounded-full transition-colors relative",
            selectedTags.length > 0 
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          )}
        >
          <TagIcon className="w-4 h-4" />
          {selectedTags.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {selectedTags.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Selected Tags */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mt-2 overflow-hidden"
          >
            {selectedTags.map(tag => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
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
            
            {selectedTags.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                onClick={clearAllTags}
              >
                Clear all
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Tags Dropdown */}
      <AnimatePresence>
        {showTagsDropdown && availableTags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg max-w-md w-full max-h-[300px] overflow-y-auto"
          >
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between items-center">
              <span>Filter by tags:</span>
              {selectedTags.length > 0 && (
                <button 
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={clearAllTags}
                >
                  Clear all
                </button>
              )}
            </div>
            
            {sortedGroups.map(letter => (
              <div key={letter} className="mb-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {letter}
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupedTags[letter].map(tag => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'px-2 py-1 text-xs rounded-full transition-colors',
                        selectedTags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      )}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 