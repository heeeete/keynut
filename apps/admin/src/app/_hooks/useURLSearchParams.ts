'use client';

import { useSearchParams } from 'next/navigation';

export default function useURLSearchParams() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  return params;
}
