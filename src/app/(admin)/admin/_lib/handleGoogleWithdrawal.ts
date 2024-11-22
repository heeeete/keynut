const handleGoogleWithdrawal = async (_id: string, access_token: string) => {
  try {
    const res1 = await fetch(`/api/user/${_id}`, { method: 'DELETE' });
    if (!res1.ok) throw new Error('Google user deletion error');
    const res2 = await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${access_token}`);
    if (!res2.ok) throw new Error('Google token revocation error');
  } catch (error) {
    throw error;
  }
};

export default handleGoogleWithdrawal;
