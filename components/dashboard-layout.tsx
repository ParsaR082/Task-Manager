'use client';

import React, { useState, createContext, useContext } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Create a context to share search state across components
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchTags: string[];
  setSearchTags: (tags: string[]) => void;
}

export const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  searchTags: [],
  setSearchTags: () => {}
});

// Custom hook to use the search context
export const useSearch = () => useContext(SearchContext);

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);

  // Handle search from the header
  const handleSearch = (query: string, tags: string[]) => {
    setSearchQuery(query);
    setSearchTags(tags);
    console.debug(`[DashboardLayout] Search: query=${query}, tags=${tags.join(',')}`);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchTags, setSearchTags }}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onCollapsedChange={setSidebarCollapsed}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onSearch={handleSearch} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SearchContext.Provider>
  );
} 