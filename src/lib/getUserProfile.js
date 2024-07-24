import { signIn } from 'next-auth/react';

const getUserProfile = async id => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${id}/profile`, {
    method: 'GET',
    cache: 'no-cache',
  });
  if (!res.ok) {
    if (res.status === 401) return signIn();
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch profile');
  }
  const data = await res.json();
  return data;
};

export default getUserProfile;
