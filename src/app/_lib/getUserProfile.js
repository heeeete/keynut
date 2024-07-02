const getUserProfile = async id => {
  const res = await fetch(`/api/user/${id}/profile`, {
    method: 'GET',
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }
  const data = await res.json();
  return data;
  //   setUserProfile(data);
};

export default getUserProfile;
