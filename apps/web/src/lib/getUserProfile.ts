import User from '@keynut/type/user';

const getUserProfile = async (id: string) => {
  if (id.length !== 24) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${id}/profile`, {
    method: 'GET',
    cache: 'no-cache',
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch profile');
  }
  const data: User = await res.json();

  return data;
};

export default getUserProfile;
