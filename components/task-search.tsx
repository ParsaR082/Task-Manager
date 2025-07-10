'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Tag, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSearch } from './dashboard-layout';

interface TaskSearchProps {
  onSearch?: (query: string, tags: string[]) => void;
  availableTags?: string[];
}

export function TaskSearch({ onSearch, availableTags = [] }: TaskSearchProps) {
  // Use search context
  const { searchQuery, setSearchQuery, searchTags, setSearchTags } = useSearch();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localTags, setLocalTags] = useState<string[]>(searchTags);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Group tags alphabetically
  const groupedTags = availableTags.reduce((acc, tag) => {
    const firstLetter = tag.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tag);
    return acc;
  }, {} as Record<string, string[]>);
  
  const sortedGroups = Object.keys(groupedTags).sort();
  
  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Sync local state with context
  useEffect(() => {
    setLocalQuery(searchQuery);
    setLocalTags(searchTags);
  }, [searchQuery, searchTags]);
  
  // Handle search input changes
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
    
    if (onSearch) {
      onSearch(value, localTags);
    }
  };
  
  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const newTags = localTags.includes(tag)
      ? localTags.filter(t => t !== tag)
      : [...localTags, tag];
    
    setLocalTags(newTags);
    setSearchTags(newTags);
    
    if (onSearch) {
      onSearch(localQuery, newTags);
    }
  };
  
  // Clear all filters
  const handleClearAll = () => {
    setLocalQuery('');
    setLocalTags([]);
    setSearchQuery('');
    setSearchTags([]);
    
    if (onSearch) {
      onSearch('', []);
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Remove a single tag
  const handleRemoveTag = (tag: string) => {
    const newTags = localTags.filter(t => t !== tag);
    setLocalTags(newTags);
    setSearchTags(newTags);
    
    if (onSearch) {
      onSearch(localQuery, newTags);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center w-full rounded-xl transition-all duration-300",
        "bg-white dark:bg-slate-800 border shadow-sm",
        inputFocused
          ? "border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"
          : "border-slate-200 dark:border-slate-700",
        (localQuery || localTags.length > 0) && "bg-blue-50/50 dark:bg-slate-800/80"
      )}>
        <div className="flex items-center pl-3 text-slate-400 dark:text-slate-500">
          <Search className="h-4 w-4" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleQueryChange}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          className={cn(
            "flex-1 py-2.5 px-3 bg-transparent",
            "text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500",
            "focus:outline-none text-sm"
          )}
          placeholder="Search tasks..."
        />
        
        {/* Tag Filter Button */}
        <div className="flex items-center gap-1.5 pr-2">
          {localTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full"
            >
              <span>{localTags.length}</span>
            </motion.div>
          )}
          
          <motion.button
            type="button"
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "hover:bg-slate-100 dark:hover:bg-slate-700",
              showTagDropdown ? "bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Filter by tags"
            title="Filter by tags"
          >
            <Tag className="h-4 w-4" />
          </motion.button>
          
          {(localQuery || localTags.length > 0) && (
            <motion.button
              type="button"
              onClick={handleClearAll}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Selected Tags */}
      {localTags.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-1.5 mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {localTags.map((tag, index) => (
              <motion.span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 ml-1"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* Tags Dropdown */}
      <AnimatePresence>
        {showTagDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 w-full mt-1 py-2 rounded-xl shadow-lg",
              "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
              "max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
            )}
          >
            <div className="px-3 pb-2 mb-1 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Filter by tags
              </h3>
              {localTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalTags([]);
                    setSearchTags([]);
                    if (onSearch) {
                      onSearch(localQuery, []);
                    }
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all tags
                </button>
              )}
            </div>
            
            {sortedGroups.length > 0 ? (
              <div className="pt-1">
                {sortedGroups.map(group => (
                  <div key={group} className="mb-2">
                    <div className="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-700/50">
                      {group}
                    </div>
                    <div className="py-1">
                      {groupedTags[group].sort().map(tag => {
                        const isSelected = localTags.includes(tag);
                        return (
                          <motion.button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={cn(
                              "flex items-center w-full px-3 py-1.5 text-sm transition-colors",
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                            )}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded mr-2 flex items-center justify-center",
                              isSelected 
                                ? "bg-blue-500 dark:bg-blue-600 text-white" 
                                : "border border-slate-300 dark:border-slate-600"
                            )}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            {tag}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 text-center">
                No tags available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 