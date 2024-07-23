import { getSession, signIn } from 'next-auth/react';

const handleLogin = async (e, router, url) => {
  e.preventDefault();

  if (await getSession()) {
    router.push(url);
  } else {
    signIn(null, { callbackUrl: url });
  }
};

export default handleLogin;
