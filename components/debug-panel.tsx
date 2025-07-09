'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DebugMessage {
  timestamp: string;
  component: string;
  action: string;
  details?: Record<string, unknown>;
}

interface DebugPanelProps {
  messages: DebugMessage[];
  onClear: () => void;
}

export function DebugPanel({ messages, onClear }: DebugPanelProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="debug-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Debug Panel</h3>
            <div className="space-x-2">
              <button
                onClick={onClear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-medium">{message.component}</span>
                  <span className="text-muted-foreground">{message.action}</span>
                </div>
                {message.details && (
                  <pre className="mt-1">
                    {JSON.stringify(message.details, null, 2)}
                  </pre>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-muted text-muted-foreground px-3 py-1 rounded text-xs hover:bg-background hover:text-foreground border"
          onClick={() => setIsVisible(true)}
        >
          Show Debug
        </motion.button>
      )}
    </AnimatePresence>
  );
} 