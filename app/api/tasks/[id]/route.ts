import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { TaskStatus, Priority } from '@prisma/client';

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;
    
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId
      },
      include: {
        project: {
          select: {
            name: true,
            color: true
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Format task for frontend
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
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;
    const body = await request.json();
    
    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = mapToDbTaskStatus(body.status);
    if (body.priority !== undefined) updateData.priority = mapToDbPriority(body.priority);
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.tags !== undefined) updateData.tags = body.tags;
    
    // Handle project connection/disconnection
    if (body.projectId !== undefined) {
      if (body.projectId) {
        updateData.project = { connect: { id: body.projectId } };
      } else {
        updateData.project = { disconnect: true };
      }
    }
    
    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
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
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;
    
    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId
      }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Delete task
    await prisma.task.delete({
      where: { id: taskId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
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