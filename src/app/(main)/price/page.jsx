'use client';

import { Suspense } from 'react';
import RenderPage from './renderPage';

export default function Page() {
  return (
    <Suspense>
      <RenderPage />
    </Suspense>
  );
}
