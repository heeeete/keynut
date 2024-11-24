import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(admin)/admin/_lib/authOptions';

const getUserSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default getUserSession;
