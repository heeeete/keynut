'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ErrorComponent() {
  const params = useSearchParams();
  const error = params.get('error');

  if (error === 'Your account has been banned.')
    return (
      <div className="flex justify-center items-center min-h-70vh">
        <p className="font-bold text-white bg-black px-2">Your account has been banned.</p>
      </div>
    );
  else if (error?.startsWith('Your account is banned until:')) {
    const expires_at = error.split(': ')[1];
    const date = new Date(Number(expires_at));

    // 한국 시간대의 날짜와 시간으로 변환
    let krTimeString = date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    krTimeString = krTimeString.replace('.', '년');
    krTimeString = krTimeString.replace('.', '월');
    krTimeString = krTimeString.replace('.', '일');

    return (
      <div className="flex justify-center items-center min-h-70vh">
        <p className="font-bold text-white bg-black px-2">{krTimeString} 이후 이용이 가능합니다.</p>
      </div>
    );
  } else
    return (
      <div className="flex justify-center items-center min-h-70vh">
        <p className="font-bold text-white bg-black px-2">ERROR</p>
      </div>
    );
}

export default function Error() {
  return (
    <Suspense>
      <ErrorComponent />
    </Suspense>
  );
}
