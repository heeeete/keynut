'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Error() {
  const params = useSearchParams();
  const error = params.get('error');

  if (error === 'Your account has been banned.')
    return (
      <div className="flex justify-center items-center min-h-70vh">
        <p className="font-bold text-white bg-black px-2">Your account has been banned.</p>
      </div>
    );
  else
    return (
      <div className="flex justify-center items-center min-h-70vh">
        <p className="font-bold text-white bg-black px-2">ERROR</p>
      </div>
    );
}
