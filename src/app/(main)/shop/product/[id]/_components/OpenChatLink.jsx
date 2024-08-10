'use client';

import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function OpenChatLink({ url }) {
  if (!url) return;
  return (
    <Link
      target={url?.startsWith('/auth/signin') ? '_self' : '_blank'}
      className="flex justify-center items-center rounded aspect-square w-10"
      style={url ? {} : { cursor: 'not-allowed', opacity: 0.1 }}
      href={url}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" viewBox="0 0 24 24">
        <path
          fill="black"
          d="M12 3c5.8 0 10.501 3.664 10.501 8.185c0 4.52-4.701 8.184-10.5 8.184a14 14 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866c0-4.52 4.7-8.185 10.5-8.185m5.908 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.5.5 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413l1.428 2.033a.472.472 0 1 0 .773-.543zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944m-5.857-1.091l.696-1.708l.638 1.707zm2.523.487l.002-.016a.47.47 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474a.7.7 0 0 0-.653.447l-1.662 4.075a.472.472 0 0 0 .874.357l.332-.813h2.07l.298.8a.472.472 0 1 0 .884-.33zM8.294 9.302a.47.47 0 0 0-.471-.472H4.578a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14a.47.47 0 0 0 .472-.472"
        />
      </svg>
    </Link>
  );
}
