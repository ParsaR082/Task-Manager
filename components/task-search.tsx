'use client';

import React, { useState } from 'react';
import { Search, Tag, X, ChevronDown } from 'lucide-react';

export function TaskSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);

  const handleSearch = () => {
    // Handle search logic
    console.log('Searching for:', searchQuery, 'with tags:', tags);
  };

  const addTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isTagInputVisible) {
        addTag();
      } else {
        handleSearch();
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="pl-3 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks..."
          className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        <button
          onClick={() => setIsTagInputVisible(!isTagInputVisible)}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          title="Add tags"
        >
          <Tag className="h-5 w-5" />
        </button>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
        >
          Search
        </button>
      </div>

      {/* Tag input */}
      {isTagInputVisible && (
        <div className="mt-2 flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="pl-3 text-slate-400">
            <Tag className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag and press Enter..."
            className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <button
            onClick={addTag}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
            disabled={!tagInput.trim()}
          >
            Add
          </button>
        </div>
      )}

      {/* Tags display */}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {tags.length > 0 && (
            <button
              onClick={() => setTags([])}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
} 