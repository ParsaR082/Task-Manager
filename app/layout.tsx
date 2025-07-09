'use client';

import './globals.css';
import React from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import { DebugPanel } from '@/components/debug-panel';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [debugMessages, setDebugMessages] = React.useState<Array<{
    timestamp: string;
    component: string;
    action: string;
    details?: Record<string, unknown>;
  }>>([]);

  // Listen for debug messages
  React.useEffect(() => {
    const originalDebug = console.debug;
    console.debug = (...args) => {
      originalDebug.apply(console, args);
      
      // Parse debug message
      if (typeof args[0] === 'string' && args[0].startsWith('[')) {
        const component = args[0].split(']')[0].slice(1);
        const action = args[0].split(']:')[1]?.trim() || '';
        const details = args[1];
        
        setDebugMessages(prev => [...prev, {
          timestamp: new Date().toISOString(),
          component,
          action,
          details
        }]);
      }
    };

    return () => {
      console.debug = originalDebug;
    };
  }, []);

  const clearDebugMessages = () => setDebugMessages([]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <DebugPanel 
            messages={debugMessages} 
            onClear={clearDebugMessages} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
