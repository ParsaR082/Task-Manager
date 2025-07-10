import { Session } from 'next-auth';

export interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function AuthProvider(props: AuthProviderProps): JSX.Element; 