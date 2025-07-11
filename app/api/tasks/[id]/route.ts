import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';

// GET /api/tasks/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
      include: {
        project: true,
        user: true,
      }
    });

    if (!task) {
      return new NextResponse('Task not found', { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// PATCH /api/tasks/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.status) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate status
    if (!Object.values(TaskStatus).includes(body.status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Update task
    const task = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status as TaskStatus,
        priority: body.priority,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        tags: body.tags,
        updatedAt: new Date(),
      },
      include: {
        project: true,
        user: true,
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!task) {
      return new NextResponse('Task not found', { status: 404 });
    }

    // Delete task
    await prisma.task.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 