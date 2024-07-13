const getUserProfile = async id => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${id}/profile`, {
    method: 'GET',
    cache: 'no-cache',
  });
  if (!res.ok) {
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('Failed to fetch profile');
  }
  const data = await res.json();
  return data;
  //   setUserProfile(data);
};

export default getUserProfile;
