import { getSession, signIn } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const handleLogin = async (
  e: React.MouseEvent<HTMLAnchorElement>,
  router: AppRouterInstance,
  url: string,
) => {
  e.preventDefault();

  if (await getSession()) {
    router.push(url);
  } else {
    signIn(undefined, { callbackUrl: url });
  }
};

export default handleLogin;
