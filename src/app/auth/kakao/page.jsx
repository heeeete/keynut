'use client';

import { ok } from 'assert';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';

export default function Kakao() {
  const router = useRouter();
  const [authCode, setAuthCode] = useState(null);
  const [kakaoServerError, setKakaoServerError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    const error = query.get('error');

    if (code) setAuthCode(code);
    if (error) setKakaoServerError(error);
  }, [router]);

  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authCode,
          }),
        });
        const data = await res.json();
        console.log(data);

        if (res.ok) {
          router.push('/');
        } else {
          router.push('/notifications/authentication-failed');
        }
      } catch (error) {
        console.error('Failed to login:', error);
        router.push('/notifications/authentication-failed');
      }
    };

    if (authCode) {
      kakaoLogin();
    } else if (kakaoServerError) {
      router.push('/notifications/authentication-failed');
    }
  }, [authCode, kakaoServerError, router]);

  console.log(authCode, kakaoServerError);

  return <div>로그인중</div>;
}
