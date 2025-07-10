import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSession();
  
  // If authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  } else {
    // If not authenticated, redirect to login
    redirect('/login');
  }
} 