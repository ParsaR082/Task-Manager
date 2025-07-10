'use client';

import React, { useState, useRef } from 'react';
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
  
  // 3D tilt effect values
  const [isHovered, setIsHovered] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Spring animations for smooth transitions
  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Light reflection position
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const springLightX = useSpring(lightX, springConfig);
  const springLightY = useSpring(lightY, springConfig);
  
  // Transform values for perspective and scale
  const perspective = 800;
  const scale = useTransform(
    springRotateX,
    [-20, 0, 20],
    [0.97, 1, 0.97]
  );
  
  // Create transform values for light position outside of the render function
  const lightTopPosition = useTransform(springLightY, [-0.5, 0.5], ['30%', '70%']);
  const lightLeftPosition = useTransform(springLightX, [-0.5, 0.5], ['30%', '70%']);
  
  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (in percentage -0.5 to 0.5)
    const centerX = (e.clientX - rect.left) / rect.width - 0.5;
    const centerY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Set rotation values (multiplied for more pronounced effect)
    rotateX.set(-centerY * 20); // Negative because we want to tilt toward the cursor
    rotateY.set(centerX * 20);
    
    // Set light reflection position
    lightX.set(centerX);
    lightY.set(centerY);
  };
  
  // Handle mouse leave to reset tilt
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(0);
    lightY.set(0);
  };
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent triggering drag when clicking
    e.stopPropagation();
    router.push(`/tasks/${task.id}`);
  };
  
  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium;
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={(node) => {
            // Combine refs: one for Draggable and one for our mouse tracking
            provided.innerRef(node);
            // @ts-ignore - TypeScript doesn't like this pattern but it works
            cardRef.current = node;
          }}
          {...provided.draggableProps}
          initial={false}
          animate={{
            scale: snapshot.isDragging ? 1.05 : 1,
            zIndex: snapshot.isDragging ? 9999 : isHovered ? 10 : 1,
          }}
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            scale: snapshot.isDragging ? 1.05 : scale,
            transformPerspective: perspective,
            transformStyle: "preserve-3d",
            y: snapshot.isDragging ? -5 : 0,
            boxShadow: snapshot.isDragging 
              ? '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)'
              : isHovered
                ? `0 20px 25px -5px ${isOverdue ? 'rgba(239, 68, 68, 0.15)' : isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)'}, 0 10px 10px -5px rgba(0, 0, 0, 0.1)`
                : '0 2px 10px rgba(0, 0, 0, 0.05)',
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleTaskClick}
          className={cn(
            'group relative rounded-2xl border p-5 mb-4',
            'backdrop-blur-md backdrop-saturate-150',
            'transition-all duration-300 cursor-pointer',
            'will-change-transform',
            isOverdue 
              ? 'border-red-200/60 dark:border-red-800/40 bg-red-50/70 dark:bg-red-900/30' 
              : isCompleted
                ? 'border-green-200/60 dark:border-green-800/40 bg-green-50/70 dark:bg-green-900/30'
                : `${priorityColor.border} ${priorityColor.bg}`,
            snapshot.isDragging && 'ring-2 ring-blue-400 dark:ring-blue-500',
            // Glass effect enhancements
            'bg-white/60 dark:bg-slate-900/50',
            'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]',
            'dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]'
          )}
        >
          {/* Glass overlay for enhanced glassmorphism */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-white/5 dark:via-white/5 dark:to-transparent pointer-events-none" />
          
          {/* Animated light reflection effect */}
          <motion.div 
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            style={{
              zIndex: 2,
            }}
          >
            <motion.div 
              className="absolute inset-[-100%] opacity-20 dark:opacity-10 pointer-events-none"
              style={{
                background: isOverdue 
                  ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, transparent 50%)' 
                  : isCompleted
                    ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.4) 0%, transparent 50%)'
                    : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
                top: lightTopPosition,
                left: lightLeftPosition,
                width: '100%',
                height: '100%',
              }}
            />
          </motion.div>

          {/* Priority Indicator Line */}
          <div 
            className={cn(
              "absolute top-0 left-0 right-0 h-1 rounded-t-2xl z-10",
              isOverdue 
                ? "bg-red-500 dark:bg-red-400" 
                : isCompleted
                  ? "bg-green-500 dark:bg-green-400"
                  : priorityColor.accent
            )}
          />

          {/* View Details Indicator (only visible on hover) */}
          <motion.div 
            className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 rounded-full shadow-sm z-10 font-medium backdrop-blur-sm"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ transformStyle: "preserve-3d", transform: `translateZ(20px)` }}
          >
            View details <ArrowRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </motion.div>

          {/* Drag Handle with Animation */}
          <div {...provided.dragHandleProps} className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <motion.div 
              className={cn(
                'cursor-grab active:cursor-grabbing',
                'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              )}
              whileHover={{ 
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
              style={{ transformStyle: "preserve-3d", transform: `translateZ(20px)` }}
            >
              <GripVertical className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Content Container - with 3D layering */}
          <div 
            className="relative z-10" 
            style={{ 
              transformStyle: "preserve-3d",
              transform: `translateZ(10px)`
            }}
          >
            {/* Status & Priority Section */}
            <div className="flex items-center justify-between mb-3 mt-1">
              {isCompleted ? (
                <motion.div 
                  className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformStyle: "preserve-3d", transform: `translateZ(15px)` }}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Completed
                </motion.div>
              ) : (
                <motion.span 
                  className={cn(
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    priorityColor.tag
                  )}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  style={{ transformStyle: "preserve-3d", transform: `translateZ(15px)` }}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </motion.span>
              )}
              
              {isOverdue && !isCompleted && (
                <motion.div 
                  className="flex items-center text-red-600 dark:text-red-400 text-xs font-medium"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformStyle: "preserve-3d", transform: `translateZ(15px)` }}
                >
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Overdue
                </motion.div>
              )}
            </div>

            {/* Task Title with Animation */}
            <motion.h3 
              className={cn(
                "font-semibold mb-2 line-clamp-2 pr-6 text-lg transition-colors duration-200",
                isCompleted 
                  ? "text-slate-600 dark:text-slate-400 line-through opacity-80" 
                  : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              )}
              layout
              style={{ transformStyle: "preserve-3d", transform: `translateZ(20px)` }}
            >
              {task.title}
            </motion.h3>

            {/* Task Description with Animation */}
            <motion.p 
              className={cn(
                "text-sm mb-4 line-clamp-2",
                isCompleted 
                  ? "text-slate-500 dark:text-slate-500 opacity-70" 
                  : "text-slate-600 dark:text-slate-400"
              )}
              layout
              style={{ transformStyle: "preserve-3d", transform: `translateZ(15px)` }}
            >
              {task.description}
            </motion.p>

            {/* Tags with Animation */}
            {task.tags && task.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1.5 mb-4"
                layout
                style={{ transformStyle: "preserve-3d", transform: `translateZ(15px)` }}
              >
                {task.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md text-xs",
                      isCompleted
                        ? "bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                        : "bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300",
                      "backdrop-blur-sm"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    style={{ transformStyle: "preserve-3d", transform: `translateZ(20px)` }}
                  >
                    <Tag className="w-3 h-3 mr-1.5 opacity-70" />
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Footer with Animation */}
            <motion.div 
              className="flex items-center justify-between text-sm"
              layout
              style={{ transformStyle: "preserve-3d", transform: `translateZ(15px)` }}
            >
              <motion.div 
                className={cn(
                  "flex items-center px-2.5 py-1 rounded-md",
                  "backdrop-blur-sm",
                  "bg-white/60 dark:bg-slate-800/60",
                  isCompleted
                    ? "text-slate-500 dark:text-slate-400"
                    : isOverdue
                      ? "text-red-600 dark:text-red-400"
                      : "text-slate-600 dark:text-slate-300"
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ transformStyle: "preserve-3d", transform: `translateZ(20px)` }}
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                <span className={cn(
                  "font-medium",
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
                className="absolute inset-0 bg-blue-400/5 dark:bg-blue-500/10 rounded-2xl pointer-events-none"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute inset-0 rounded-2xl pointer-events-none",
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