'use client';

import { useRouter } from 'next/navigation';

function NotFoundPage() {
  const router = useRouter();
  router.push('/');
  return <h1></h1>;
}

export default NotFoundPage;
