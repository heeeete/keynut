'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function NotFoundPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, []);
  return <h1></h1>;
}

export default NotFoundPage;
