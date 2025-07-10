import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { TaskStatus, Priority } from '@prisma/client';

// GET /api/tasks - Get all tasks for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    // Build query based on filters
    const query: any = { userId };
    if (projectId) {
      query.projectId = projectId;
    }
    
    const tasks = await prisma.task.findMany({
      where: query,
      include: {
        project: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to match our frontend Task type
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: mapTaskStatus(task.status),
      priority: mapPriority(task.priority),
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      tags: task.tags,
      projectId: task.projectId,
      projectName: task.project?.name,
      projectColor: task.project?.color,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    // Convert status and priority to database enum values
    const status = mapToDbTaskStatus(body.status);
    const priority = mapToDbPriority(body.priority);
    
    // Format due date
    const dueDate = body.dueDate ? new Date(body.dueDate) : null;
    
    // Create task
    const taskData: any = {
      title: body.title,
      description: body.description || '',
      status,
      priority,
      dueDate,
      tags: body.tags || [],
      user: { connect: { id: userId } }
    };
    
    // Add project if provided
    if (body.projectId) {
      taskData.project = { connect: { id: body.projectId } };
    }
    
    const task = await prisma.task.create({ 
      data: taskData,
      include: {
        project: {
          select: {
            name: true,
            color: true
          }
        }
      }
    });

    // Return formatted task
    return NextResponse.json({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: mapTaskStatus(task.status),
      priority: mapPriority(task.priority),
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      tags: task.tags,
      projectId: task.projectId,
      projectName: task.project?.name,
      projectColor: task.project?.color,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions to map between our frontend enums and Prisma enums
function mapTaskStatus(status: TaskStatus): string {
  const mapping: Record<TaskStatus, string> = {
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    DONE: 'done'
  };
  return mapping[status];
}

function mapPriority(priority: Priority): string {
  return priority.toLowerCase();
}

function mapToDbTaskStatus(status: string): TaskStatus {
  const mapping: Record<string, TaskStatus> = {
    'todo': TaskStatus.TODO,
    'in-progress': TaskStatus.IN_PROGRESS,
    'done': TaskStatus.DONE
  };
  return mapping[status] || TaskStatus.TODO;
}

function mapToDbPriority(priority: string): Priority {
  const mapping: Record<string, Priority> = {
    'low': Priority.LOW,
    'medium': Priority.MEDIUM,
    'high': Priority.HIGH
  };
  return mapping[priority] || Priority.MEDIUM;
} 