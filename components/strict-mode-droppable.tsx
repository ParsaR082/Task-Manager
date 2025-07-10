'use client';

import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

/**
 * StrictModeDroppable is a wrapper around react-beautiful-dnd's Droppable
 * that works with React 18's Strict Mode by handling the double-mounting behavior
 * 
 * This is needed because react-beautiful-dnd doesn't officially support React 18 yet
 * and the double-mounting in strict mode causes issues with the Droppable component
 */
export function StrictModeDroppable(props: DroppableProps) {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    // We need to wait for a tick to ensure that React has finished the initial mount
    // This helps avoid issues with the Droppable component in React 18 Strict Mode
    const animation = requestAnimationFrame(() => setEnabled(true));
    
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  
  if (!enabled) {
    // Render a placeholder with the same structure during the initial mount
    return <div className="min-h-[200px]" />;
  }
  
  // Once enabled, render the actual Droppable
  return <Droppable {...props} />;
} 