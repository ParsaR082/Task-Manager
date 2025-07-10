import { DashboardLayout } from '@/components/dashboard-layout';
import { ProjectProvider } from '@/components/project-provider';
import { TaskProvider } from '@/lib/task-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <TaskProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </TaskProvider>
    </ProjectProvider>
  );
} 