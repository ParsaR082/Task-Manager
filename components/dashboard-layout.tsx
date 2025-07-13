'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '@/hooks/useAuth';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false); // Reset collapsed state on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onCollapsedChange={handleSidebarCollapse}
        isMobileOpen={mobileMenuOpen}
        onMobileToggle={handleMobileMenuToggle}
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-0">
        <Header 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-y-auto mobile-p scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 