import { Task, TaskStatus } from './types';

/**
 * Get tasks filtered by status
 */
export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter(task => task.status === status);
}

/**
 * Get tasks filtered by project ID
 */
export function getTasksByProject(tasks: Task[], projectId: string | null): Task[] {
  if (projectId === null) {
    return tasks; // Return all tasks if no project is selected
  }
  return tasks.filter(task => task.projectId === projectId);
}

/**
 * Get overdue tasks (due date is in the past and not completed)
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = new Date();
  return tasks.filter(task => 
    new Date(task.dueDate) < now && task.status !== TaskStatus.DONE
  );
}

/**
 * Get tasks due today
 */
export function getTasksDueToday(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today && dueDate < tomorrow;
  });
}

/**
 * Get tasks due this week
 */
export function getTasksDueThisWeek(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today && dueDate <= endOfWeek;
  });
}

/**
 * Get tasks by priority
 */
export function getTasksByPriority(tasks: Task[], priority: 'low' | 'medium' | 'high'): Task[] {
  return tasks.filter(task => task.priority === priority);
}

/**
 * Get tasks by tag
 */
export function getTasksByTag(tasks: Task[], tag: string): Task[] {
  return tasks.filter(task => task.tags?.includes(tag));
}

/**
 * Get all unique tags from tasks
 */
export function getAllTags(tasks: Task[]): string[] {
  const tagsSet = new Set<string>();
  
  tasks.forEach(task => {
    task.tags?.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Search tasks by query (searches in title and description)
 */
export function searchTasks(tasks: Task[], query: string): Task[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return tasks;
  }
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(normalizedQuery) || 
    task.description.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get task statistics
 */
export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === TaskStatus.DONE).length;
  const inProgress = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todo = tasks.filter(task => task.status === TaskStatus.TODO).length;
  const overdue = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE
  ).length;
  
  return {
    total,
    completed,
    inProgress,
    todo,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
} 