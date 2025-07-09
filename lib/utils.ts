import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setThemeVariables(isDark: boolean) {
  const root = document.documentElement;
  const variables = {
    '--primary': isDark ? '#6366f1' : '#4f46e5',
    '--card-shadow': isDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
    '--transition': 'all 0.2s ease',
    '--background': isDark ? '#0f172a' : '#ffffff',
    '--foreground': isDark ? '#f8fafc' : '#0f172a',
    '--muted': isDark ? '#334155' : '#f1f5f9',
    '--muted-foreground': isDark ? '#94a3b8' : '#64748b',
    '--border': isDark ? '#1e293b' : '#e2e8f0',
    '--ring': isDark ? '#6366f1' : '#4f46e5',
  };

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function calculateDaysLeft(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Debug utilities
export function debugLog(
  component: string,
  action: string,
  details?: Record<string, unknown>
) {
  console.debug(`[${component}] ${action}:`, details);
} 