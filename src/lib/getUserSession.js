import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const getUserSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default getUserSession;
