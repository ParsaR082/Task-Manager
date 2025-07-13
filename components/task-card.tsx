'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle, 
  ArrowRight, 
  GripVertical 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Task, TaskStatus, TaskPriority } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: {
    bg: 'bg-blue-50/30 dark:bg-blue-900/20',
    border: 'border-blue-200/40 dark:border-blue-800/30',
    tag: 'bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  },
  medium: {
    bg: 'bg-yellow-50/30 dark:bg-yellow-900/20',
    border: 'border-yellow-200/40 dark:border-yellow-800/30',
    tag: 'bg-yellow-100/70 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  },
  high: {
    bg: 'bg-red-50/30 dark:bg-red-900/20',
    border: 'border-red-200/40 dark:border-red-800/30',
    tag: 'bg-red-100/70 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
};

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  const isCompleted = task.status === TaskStatus.DONE;
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Optimized mobile detection with memoization
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  }, []);
  
  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Optimized hover state management
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Simplified motion values for better performance
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Optimized spring configurations
  const springConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Optimized scale transform
  const scale = useTransform(
    springRotateX,
    [-15, 0, 15],
    [0.98, 1, 0.98]
  );

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isSpinning || isMobile) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = (e.clientX - rect.left) / rect.width - 0.5;
    const centerY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Reduced rotation values for better performance
    rotateX.set(-centerY * 15);
    rotateY.set(centerX * 15);
  }, [isSpinning, isMobile, rotateX, rotateY]);
  
  const handleMouseLeave = useCallback(() => {
    if (isSpinning || isMobile) return;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [isSpinning, isMobile, rotateX, rotateY]);
  
  const handleMouseEnter = useCallback(() => {
    if (isSpinning || isMobile) return;
    setIsHovered(true);
  }, [isSpinning, isMobile]);

  // Optimized click handler
  const handleTaskClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpinning) return;
    
    if (!isMobile) {
      setIsSpinning(true);
      rotateY.set(360);
      setTimeout(() => {
        router.push(`/tasks/${task.id}`);
      }, 300);
    } else {
      router.push(`/tasks/${task.id}`);
    }
  }, [isSpinning, isMobile, rotateY, router, task.id]);

  // Optimized touch handlers
  const handleTouchStart = useCallback(() => {
    if (isMobile) {
      setIsPressed(true);
    }
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isMobile) {
      setIsPressed(false);
    }
  }, [isMobile]);
  
  // Memoized priority color
  const priorityColor = useMemo(() => 
    priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium,
    [task.priority]
  );
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={(node) => {
            provided.innerRef(node);
            // @ts-ignore
            cardRef.current = node;
          }}
          {...provided.draggableProps}
          initial={false}
          animate={{
            scale: snapshot.isDragging ? 1.05 : isPressed ? 0.98 : 1,
            zIndex: snapshot.isDragging ? 9999 : isHovered ? 10 : 1,
          }}
          style={{
            // Optimized transforms for mobile
            ...(isMobile ? {} : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              scale: snapshot.isDragging ? 1.05 : scale,
              transformPerspective: 800,
              willChange: 'transform',
            }),
            y: snapshot.isDragging ? -5 : 0,
          }}
          className={cn(
            'group relative rounded-xl sm:rounded-2xl border mobile-p',
            'backdrop-blur-[20px] backdrop-saturate-[180%]',
            'transition-all duration-300 cursor-pointer',
            'will-change-transform touch-target',
            // Optimized styles for mobile
            isMobile ? 'shadow-md' : 'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.24)]',
            // Simplified glass morphism for better performance
            !isMobile && [
              'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr',
              'before:from-white/30 before:to-white/10 dark:before:from-white/10 dark:before:to-transparent',
              'before:pointer-events-none before:-z-10',
            ],
            // Priority and status-based colors
            isOverdue 
              ? 'border-red-200/40 dark:border-red-800/30 bg-red-50/30 dark:bg-red-900/20' 
              : isCompleted
                ? 'border-green-200/40 dark:border-green-800/30 bg-green-50/30 dark:bg-green-900/20'
                : `${priorityColor.border} ${priorityColor.bg}`,
            snapshot.isDragging && 'ring-2 ring-blue-400/30 dark:ring-blue-500/30',
            // Enhanced base background
            'bg-white/40 dark:bg-slate-900/40',
            // Mobile pressed state
            isMobile && isPressed && 'bg-slate-100/60 dark:bg-slate-800/60'
          )}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleTaskClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          whileHover={isMobile ? {} : {
            filter: 'brightness(1.05)',
          }}
          whileTap={isMobile ? { scale: 0.98 } : {}}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.8
          }}
        >
          {/* Optimized light reflection effect (desktop only) */}
          {!isMobile && (
            <motion.div 
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <motion.div 
                className="absolute inset-[-50%] opacity-20 dark:opacity-15 pointer-events-none"
                style={{
                  background: isOverdue 
                    ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)' 
                    : isCompleted
                      ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
                      : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                  width: '120%',
                  height: '120%',
                  filter: 'blur(8px)',
                  willChange: 'transform',
                }}
                animate={{
                  x: isHovered ? [0, 10, -10, 0] : 0,
                  y: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}

          {/* Drag Handle */}
          <div {...provided.dragHandleProps} className="absolute left-2 top-2 z-20">
            <motion.div 
              className={cn(
                'cursor-grab active:cursor-grabbing touch-target',
                'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
                isMobile 
                  ? 'opacity-40' 
                  : 'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              )}
              whileHover={isMobile ? {} : { 
                scale: 1.1,
                rotate: [0, 3, -3, 0],
                transition: {
                  rotate: {
                    repeat: Infinity,
                    duration: 0.8,
                    repeatType: "loop"
                  }
                }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <GripVertical className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Content Container */}
          <div 
            className="relative z-10" 
            style={!isMobile ? { 
              transformStyle: "preserve-3d",
              transform: `translateZ(10px)`
            } : {}}
          >
            {/* Status & Priority Section */}
            <div className="flex items-center justify-between mb-3 mt-1">
              {isCompleted ? (
                <motion.div 
                  className="flex items-center gap-1 text-green-600 dark:text-green-400 mobile-caption font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Completed
                </motion.div>
              ) : (
                <motion.span 
                  className={cn(
                    'inline-flex items-center px-2.5 py-1 rounded-full mobile-caption font-medium',
                    priorityColor.tag
                  )}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </motion.span>
              )}
              
              {isOverdue && !isCompleted && (
                <motion.div 
                  className="flex items-center text-red-600 dark:text-red-400 mobile-caption font-medium"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Overdue
                </motion.div>
              )}
            </div>

            {/* Task Title */}
            <motion.h3 
              className={cn(
                "font-semibold mb-2 line-clamp-2 pr-12 sm:pr-16 mobile-text-lg transition-colors duration-200",
                isCompleted 
                  ? "text-slate-600 dark:text-slate-400 line-through opacity-80" 
                  : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              )}
              layout
            >
              {task.title}
            </motion.h3>

            {/* Task Description */}
            <motion.p 
              className={cn(
                "mobile-body mb-4 line-clamp-2",
                isCompleted 
                  ? "text-slate-500 dark:text-slate-500 opacity-70" 
                  : "text-slate-600 dark:text-slate-400"
              )}
              layout
            >
              {task.description}
            </motion.p>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1.5 mb-4"
                layout
              >
                {task.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                  <motion.span
                    key={index}
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md mobile-caption",
                      isCompleted
                        ? "bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                        : "bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300",
                      "backdrop-blur-sm"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Tag className="w-3 h-3 mr-1.5 opacity-70" />
                    {tag}
                  </motion.span>
                ))}
                {task.tags.length > (isMobile ? 2 : 3) && (
                  <motion.span
                    className="inline-flex items-center px-2 py-1 rounded-md mobile-caption bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    +{task.tags.length - (isMobile ? 2 : 3)}
                  </motion.span>
                )}
              </motion.div>
            )}

            {/* Footer */}
            <motion.div 
              className="flex items-center justify-between mobile-body"
              layout
            >
              <motion.div 
                className={cn(
                  "flex items-center px-2.5 py-1 rounded-md",
                  "backdrop-blur-sm touch-target",
                  "bg-white/60 dark:bg-slate-800/60",
                  isCompleted
                    ? "text-slate-500 dark:text-slate-400"
                    : isOverdue
                      ? "text-red-600 dark:text-red-400"
                      : "text-slate-600 dark:text-slate-300"
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                <span className={cn(
                  "font-medium mobile-caption",
                  isOverdue && !isCompleted && 'text-red-600 dark:text-red-400'
                )}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Hover and Drag Indicator Animation */}
          <AnimatePresence>
            {snapshot.isDragging ? (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20
                }}
                className="absolute inset-0 bg-blue-400/5 dark:bg-blue-500/10 rounded-xl sm:rounded-2xl pointer-events-none"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ opacity: isMobile ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none",
                  isOverdue 
                    ? "bg-gradient-to-tr from-transparent via-transparent to-red-500/5 dark:to-red-400/10" 
                    : isCompleted
                      ? "bg-gradient-to-tr from-transparent via-transparent to-green-500/5 dark:to-green-400/10"
                      : "bg-gradient-to-tr from-transparent via-transparent to-blue-500/5 dark:to-blue-400/10"
                )}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </Draggable>
  );
} 