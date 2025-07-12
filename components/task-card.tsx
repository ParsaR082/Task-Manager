'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Calendar, Tag, Clock, GripVertical, ArrowRight, CheckCircle } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/types';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: {
    bg: 'bg-blue-50/80 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/40',
    text: 'text-blue-700 dark:text-blue-300',
    accent: 'bg-blue-500 dark:bg-blue-400',
    glow: 'shadow-blue-500/20 dark:shadow-blue-400/20',
    tag: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  },
  medium: {
    bg: 'bg-yellow-50/80 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800/40',
    text: 'text-yellow-700 dark:text-yellow-300',
    accent: 'bg-yellow-500 dark:bg-yellow-400',
    glow: 'shadow-yellow-500/20 dark:shadow-yellow-400/20',
    tag: 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
  },
  high: {
    bg: 'bg-red-50/80 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800/40',
    text: 'text-red-700 dark:text-red-300',
    accent: 'bg-red-500 dark:bg-red-400',
    glow: 'shadow-red-500/20 dark:shadow-red-400/20',
    tag: 'bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  },
  urgent: {
    bg: 'bg-purple-50/80 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800/40',
    text: 'text-purple-700 dark:text-purple-300',
    accent: 'bg-purple-500 dark:bg-purple-400',
    glow: 'shadow-purple-500/20 dark:shadow-purple-400/20',
    tag: 'bg-purple-100/80 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
  }
};

export function TaskCard({ task, index }: TaskCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  const isCompleted = task.status === TaskStatus.DONE;
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Check if we're on mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced 3D tilt effect values (disabled on mobile)
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  
  // Spring animations for smooth transitions
  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springRotateZ = useSpring(rotateZ, springConfig);

  // Light reflection position with enhanced smoothing
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const springLightX = useSpring(lightX, { damping: 20, stiffness: 200 });
  const springLightY = useSpring(lightY, { damping: 20, stiffness: 200 });
  
  // Transform values for enhanced perspective and scale
  const perspective = 1000;
  const scale = useTransform(
    springRotateX,
    [-30, 0, 30],
    [0.95, 1, 0.95]
  );

  // Enhanced light position transforms
  const lightTopPosition = useTransform(springLightY, [-0.5, 0.5], ['20%', '80%']);
  const lightLeftPosition = useTransform(springLightX, [-0.5, 0.5], ['20%', '80%']);
  
  // Enhanced mouse move handler for 3D tilt (disabled on mobile)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isSpinning || isMobile) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position with enhanced sensitivity
    const centerX = (e.clientX - rect.left) / rect.width - 0.5;
    const centerY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Enhanced rotation values
    rotateX.set(-centerY * 25);
    rotateY.set(centerX * 25);
    rotateZ.set(centerX * 5);
    
    // Enhanced light reflection
    lightX.set(centerX);
    lightY.set(centerY);
  };
  
  const handleMouseLeave = () => {
    if (isSpinning || isMobile) return;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    rotateZ.set(0);
    lightX.set(0);
    lightY.set(0);
  };
  
  const handleMouseEnter = () => {
    if (isSpinning || isMobile) return;
    setIsHovered(true);
  };
  
  // Enhanced click handler with spin animation (simplified for mobile)
  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpinning) return;
    
    if (!isMobile) {
      setIsSpinning(true);
      rotateY.set(360);
      setTimeout(() => {
        router.push(`/tasks/${task.id}`);
      }, 400);
    } else {
      // Simple navigation for mobile
      router.push(`/tasks/${task.id}`);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setIsPressed(false);
    }
  };
  
  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium;
  
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
            // Disable 3D transforms on mobile
            ...(isMobile ? {} : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              rotateZ: springRotateZ,
              scale: snapshot.isDragging ? 1.05 : scale,
              transformPerspective: perspective,
              transformStyle: "preserve-3d",
            }),
            y: snapshot.isDragging ? -5 : 0,
          }}
          className={cn(
            'group relative rounded-xl sm:rounded-2xl border mobile-p',
            'backdrop-blur-[20px] backdrop-saturate-[180%]',
            'transition-all duration-300 cursor-pointer',
            'will-change-transform touch-target',
            // Simplified styles for mobile
            isMobile ? 'shadow-md' : 'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.24)]',
            // Enhanced glass morphism base styles (simplified on mobile)
            !isMobile && [
              'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr',
              'before:from-white/40 before:to-white/10 dark:before:from-white/10 dark:before:to-transparent',
              'before:pointer-events-none before:-z-10',
              'after:absolute after:inset-0 after:rounded-2xl after:p-[1px]',
              'after:bg-gradient-to-tr after:from-white/20 after:to-white/5',
              'after:dark:from-white/10 after:dark:to-transparent',
              'after:pointer-events-none',
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
            filter: 'brightness(1.1)',
          }}
          whileTap={isMobile ? { scale: 0.98 } : {}}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
        >
          {/* Enhanced glass overlay (desktop only) */}
          {!isMobile && (
            <div 
              className={cn(
                "absolute inset-0 rounded-2xl pointer-events-none",
                "bg-[url('data:image/svg+xml,...')] opacity-[0.015]",
                "mix-blend-overlay"
              )} 
            />
          )}

          {/* Enhanced light reflection effect (desktop only) */}
          {!isMobile && (
            <motion.div 
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <motion.div 
                className="absolute inset-[-100%] opacity-30 dark:opacity-20 pointer-events-none"
                style={{
                  background: isOverdue 
                    ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3) 0%, transparent 70%)' 
                    : isCompleted
                      ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
                      : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                  top: lightTopPosition,
                  left: lightLeftPosition,
                  width: '140%',
                  height: '140%',
                  filter: 'blur(10px)',
                }}
              />
            </motion.div>
          )}

          {/* Decorative floating circles (desktop only) */}
          {!isMobile && (
            <>
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-white/20 to-transparent dark:from-white/5 blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-tr from-white/20 to-transparent dark:from-white/5 blur-xl pointer-events-none" />
            </>
          )}

          {/* Priority Indicator Line */}
          <div 
            className={cn(
              "absolute top-0 left-0 right-0 h-1 rounded-t-xl sm:rounded-t-2xl z-10",
              isOverdue 
                ? "bg-red-500 dark:bg-red-400" 
                : isCompleted
                  ? "bg-green-500 dark:bg-green-400"
                  : priorityColor.accent
            )}
          />

          {/* View Details Indicator */}
          <motion.div 
            className={cn(
              "absolute right-3 sm:right-4 top-3 sm:top-4 z-10",
              "flex items-center gap-1 text-slate-700 dark:text-slate-200",
              "mobile-caption font-medium backdrop-blur-sm",
              isMobile 
                ? "opacity-60 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full shadow-sm"
                : "opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-full shadow-sm"
            )}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: isMobile ? 0.6 : 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(20px)` } : {}}
          >
            {isMobile ? (
              <ArrowRight className="w-3 h-3" />
            ) : (
              <>
                View details <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </motion.div>

          {/* Drag Handle with Animation */}
          <div {...provided.dragHandleProps} className="absolute top-0 right-0 pt-3 sm:pt-4 pr-3 sm:pr-4 z-10">
            <motion.div 
              className={cn(
                'cursor-grab active:cursor-grabbing touch-target',
                'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
                isMobile 
                  ? 'opacity-40' 
                  : 'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              )}
              whileHover={isMobile ? {} : { 
                scale: 1.15,
                rotate: [0, 5, -5, 0],
                transition: {
                  rotate: {
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "loop"
                  }
                }
              }}
              whileTap={{ scale: 0.9 }}
              style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(20px)` } : {}}
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
                  style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(15px)` } : {}}
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
                  style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(15px)` } : {}}
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
                  style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(15px)` } : {}}
                >
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Overdue
                </motion.div>
              )}
            </div>

            {/* Task Title with Animation */}
            <motion.h3 
              className={cn(
                "font-semibold mb-2 line-clamp-2 pr-12 sm:pr-16 mobile-text-lg transition-colors duration-200",
                isCompleted 
                  ? "text-slate-600 dark:text-slate-400 line-through opacity-80" 
                  : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              )}
              layout
              style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(20px)` } : {}}
            >
              {task.title}
            </motion.h3>

            {/* Task Description with Animation */}
            <motion.p 
              className={cn(
                "mobile-body mb-4 line-clamp-2",
                isCompleted 
                  ? "text-slate-500 dark:text-slate-500 opacity-70" 
                  : "text-slate-600 dark:text-slate-400"
              )}
              layout
              style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(15px)` } : {}}
            >
              {task.description}
            </motion.p>

            {/* Tags with Animation */}
            {task.tags && task.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1.5 mb-4"
                layout
                style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(15px)` } : {}}
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
                    style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(20px)` } : {}}
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

            {/* Footer with Animation */}
            <motion.div 
              className="flex items-center justify-between mobile-body"
              layout
              style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(15px)` } : {}}
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
                style={!isMobile ? { transformStyle: "preserve-3d", transform: `translateZ(20px)` } : {}}
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