const getSession = async () => {
  const res = await fetch('/api/auth/user-session', {
    method: 'GET',
  });
  return res.json();
};

export default getSession;
