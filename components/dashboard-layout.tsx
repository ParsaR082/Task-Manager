'use client';

import React, { useState, createContext, useContext } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        {/* Backdrop blur for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200 dark:bg-purple-900 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        
        {/* Sidebar with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sidebarCollapsed ? 'collapsed' : 'expanded'}
            initial={{ width: sidebarCollapsed ? 80 : 240, opacity: 0.8 }}
            animate={{ width: sidebarCollapsed ? 80 : 240, opacity: 1 }}
            exit={{ width: sidebarCollapsed ? 80 : 240, opacity: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="relative z-20"
          >
            <Sidebar 
              collapsed={sidebarCollapsed} 
              onCollapsedChange={setSidebarCollapsed}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 backdrop-blur-[2px]">
          <Header onSearch={handleSearch} />
          
          {/* Page Content with animation */}
          <motion.main 
            className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </SearchContext.Provider>
  );
} 