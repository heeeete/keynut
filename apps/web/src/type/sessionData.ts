import { Session } from 'next-auth';

export interface SessionData {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update?: () => void;
}
