import { CalendarWrapper } from '@/components/calendar-wrapper';
import { requireAuth } from '@/lib/server-utils';
import prisma from '@/lib/prisma';
import { Task, TaskStatus, Project } from '@/lib/types';
import { Suspense } from 'react';

// Map Prisma TaskStatus to our frontend TaskStatus
function mapTaskStatus(status: any): TaskStatus {
  const mapping: Record<string, TaskStatus> = {
    'TODO': TaskStatus.TODO,
    'IN_PROGRESS': TaskStatus.IN_PROGRESS,
    'DONE': TaskStatus.DONE
  };
  return mapping[status] || TaskStatus.TODO;
}

export default async function CalendarPage() {
  // Require authentication
  const user = await requireAuth();
  
  // Fetch tasks from the database
  const dbTasks = await prisma.task.findMany({
    where: { 
      userId: user.id,
      dueDate: { not: null } // Only get tasks with due dates for the calendar
    },
    include: {
      project: true
    },
    orderBy: { dueDate: 'asc' }
  });
  
  // Fetch projects for filtering
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' }
  });
  
  // Map DB tasks to frontend Task type
  const tasks: Task[] = dbTasks.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: mapTaskStatus(task.status),
    priority: task.priority.toLowerCase() as any,
    dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    tags: task.tags as string[],
    projectId: task.projectId || undefined,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  // Map projects to frontend format
  const formattedProjects: Project[] = projects.map((project: any) => ({
    id: project.id,
    name: project.name,
    description: project.description || undefined,
    color: project.color,
    tasksCount: 0, // This will be calculated on the client
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendarWrapper tasks={tasks} projects={formattedProjects} />
    </Suspense>
  );
} 