import { signIn } from 'next-auth/react';

const handleLogin = (e, router, session, url) => {
  e.preventDefault();

  if (session) {
    router.push(url);
  } else {
    signIn(null, { callbackUrl: url });
  }
};

export default handleLogin;
