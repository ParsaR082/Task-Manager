import { PrismaClient, TaskStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      image: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
    },
  });

  console.log(`Created demo user with id: ${demoUser.id}`);

  // Create projects
  const projects = [
    {
      name: 'Website Redesign',
      description: 'Redesign the company website',
      color: 'bg-blue-500',
      userId: demoUser.id,
    },
    {
      name: 'Mobile App',
      description: 'Develop the mobile application',
      color: 'bg-green-500',
      userId: demoUser.id,
    },
    {
      name: 'Marketing Campaign',
      description: 'Q3 marketing campaign',
      color: 'bg-purple-500',
      userId: demoUser.id,
    },
    {
      name: 'API Development',
      description: 'Build new API endpoints',
      color: 'bg-orange-500',
      userId: demoUser.id,
    },
  ];

  // Clear existing projects and tasks
  await prisma.task.deleteMany({ where: { userId: demoUser.id } });
  await prisma.project.deleteMany({ where: { userId: demoUser.id } });

  // Create projects
  const createdProjects = await Promise.all(
    projects.map(project => 
      prisma.project.create({
        data: project
      })
    )
  );

  console.log(`Created ${createdProjects.length} projects`);

  // Create tasks
  const tasks = [
    {
      title: 'Design new dashboard',
      description: 'Create wireframes and mockups for the new dashboard layout',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['design', 'ui/ux'],
      userId: demoUser.id,
      projectId: createdProjects[0].id,
    },
    {
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tags: ['backend', 'security'],
      userId: demoUser.id,
      projectId: createdProjects[1].id,
    },
    {
      title: 'Write API documentation',
      description: 'Document all API endpoints and parameters',
      status: TaskStatus.DONE,
      priority: Priority.LOW,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['documentation', 'api'],
      userId: demoUser.id,
      projectId: createdProjects[3].id,
    },
    {
      title: 'Create social media content',
      description: 'Design and schedule posts for the campaign',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      tags: ['marketing', 'content'],
      userId: demoUser.id,
      projectId: createdProjects[2].id,
    },
    {
      title: 'Optimize database queries',
      description: 'Improve performance of slow queries',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      tags: ['backend', 'performance'],
      userId: demoUser.id,
      projectId: createdProjects[3].id,
    },
    {
      title: 'Test responsive design',
      description: 'Ensure website works on all device sizes',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      tags: ['testing', 'frontend'],
      userId: demoUser.id,
      projectId: createdProjects[0].id,
    },
  ];

  // Create tasks
  const createdTasks = await Promise.all(
    tasks.map(task => 
      prisma.task.create({
        data: task
      })
    )
  );

  console.log(`Created ${createdTasks.length} tasks`);
  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 