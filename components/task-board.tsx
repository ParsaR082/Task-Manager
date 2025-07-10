'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '@/lib/types';
import { TaskColumn } from './task-column';
import { motion, AnimatePresence } from 'framer-motion';
import { getTasksByStatus } from '@/lib/data';
import { PriorityFilter } from './priority-filter';
import { Calendar, Search, X, Layout, Filter } from 'lucide-react';
import { TaskCalendar } from './task-calendar';
import { useSearch } from './dashboard-layout';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

const columns = [
  { id: TaskStatus.TODO, title: 'To Do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.DONE, title: 'Done' }
];

export function TaskBoard({ tasks, onTaskMove }: TaskBoardProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get search query from context
  const { searchQuery: headerSearchQuery, searchTags } = useSearch();
  
  // Sync the local search state with the header search
  useEffect(() => {
    setSearchQuery(headerSearchQuery);
  }, [headerSearchQuery]);
  
  // Filter and group tasks by status
  const tasksByStatus = React.useMemo(() => {
    // First filter by search query
    let filteredTasks = searchQuery.trim() !== '' 
      ? localTasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : localTasks;
    
    // Filter by tags if any
    if (searchTags.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.tags && task.tags.some(tag => 
          searchTags.some(searchTag => 
            tag.toLowerCase() === searchTag.toLowerCase()
          )
        )
      );
    }
    
    // Then filter by priority
    filteredTasks = selectedPriority === null 
      ? filteredTasks 
      : filteredTasks.filter(task => task.priority === selectedPriority);

    const groups: Record<TaskStatus, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: []
    };

    filteredTasks.forEach(task => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      }
    });

    return groups;
  }, [localTasks, selectedPriority, searchQuery, searchTags]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    setLocalTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(task => task.id === draggableId);

      if (taskIndex !== -1) {
        // Create a new array with the task removed from its current position
        const updatedTasks = [
          ...newTasks.slice(0, taskIndex),
          ...newTasks.slice(taskIndex + 1)
        ];

        // Get the task we're moving
        const taskToMove = newTasks[taskIndex];

        // Update the task's status
        const updatedTask = {
          ...taskToMove,
          status: destinationStatus
        };

        // Find where to insert the task in its new column
        const tasksInDestination = updatedTasks.filter(
          task => task.status === destinationStatus
        );

        // Insert the task at the correct position
        const insertIndex = updatedTasks.findIndex(
          task => task.status === destinationStatus
        );

        if (insertIndex === -1) {
          // If no tasks in destination, add to end
          updatedTasks.push(updatedTask);
        } else {
          // Insert at the correct position
          updatedTasks.splice(
            insertIndex + destination.index,
            0,
            updatedTask
          );
        }

        return updatedTasks;
      }

      return newTasks;
    });

    if (onTaskMove) {
      onTaskMove(draggableId, destinationStatus);
    }
  }, [onTaskMove]);

  const handleAddTask = useCallback((status: TaskStatus) => {
    console.debug(`[TaskBoard] Add task requested:`, { status });
  }, []);

  const filteredTaskCount = Object.values(tasksByStatus).flat().length;
  const totalTaskCount = localTasks.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Board Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col space-y-6 p-6 border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-t-2xl shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Layout className="w-6 h-6 text-blue-500" />
              Task Board
            </motion.h1>
            <motion.p 
              className="text-slate-600 dark:text-slate-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Manage your tasks with drag and drop
            </motion.p>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Calendar Button */}
            <motion.button
              onClick={() => setIsCalendarOpen(true)}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View Calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Calendar className="w-5 h-5" />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <PriorityFilter 
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
              />
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${selectedPriority ?? 'all'}-${searchQuery}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm text-slate-600 dark:text-slate-400"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{filteredTaskCount}</span>
                {selectedPriority 
                  ? ` ${selectedPriority} priority tasks` 
                  : ` of ${totalTaskCount} tasks`}
                {searchQuery && ' matching search'}
                {searchTags.length > 0 && ` with tags: ${searchTags.join(', ')}`}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Search Bar (only show if no search from header) */}
        {!headerSearchQuery && (
          <motion.div 
            className="relative max-w-md w-full mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl 
                      bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                      placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200 shadow-sm"
              placeholder="Search tasks by title..."
            />
            {searchQuery && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex flex-1 gap-6 p-6 overflow-x-auto">
            <AnimatePresence>
              {columns.map((column, index) => (
                <motion.div 
                  key={column.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ 
                    scale: 1.01,
                    transition: { duration: 0.2 }
                  }}
                  className="flex-1 min-w-[320px] max-w-[400px]"
                >
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 h-full shadow-md hover:shadow-lg transition-all duration-300">
                    <TaskColumn
                      title={column.title}
                      status={column.id}
                      tasks={tasksByStatus[column.id]}
                      onAddTask={() => handleAddTask(column.id)}
                      searchQuery={searchQuery || headerSearchQuery}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </DragDropContext>

      {/* Calendar Modal */}
      <TaskCalendar 
        tasks={localTasks}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </motion.div>
  );
} 