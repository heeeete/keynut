'use client';
import Image from 'next/image';
import React, { Suspense, useEffect } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ProfileProducts from '../_components/ProfileProducts';
import formatDate from '../_lib/formatDate';
import { Session } from 'next-auth';
import { UserData } from '@/type/userData';
import { SessionData } from '@/type/sessionData';

const MyProfile = React.memo(
  ({
    session,
    update,
    status,
    userProfile,
  }: {
    session: Session;
    update: Function;
    status: string;
    userProfile: any;
  }) => {
    const router = useRouter();
    useEffect(() => {
      const checkProfile = async () => {
        if (userProfile.nickname !== session.user.nickname) update({ nickname: userProfile.nickname });
        if (userProfile.image !== session.user.image) update({ image: userProfile.image });
      };

      if (status === 'authenticated' && userProfile) {
        checkProfile();
      }
    }, [status, userProfile]);

    return (
      <div className="flex h-28 border border-gray-300 rounded-md items-center px-4 space-x-4 max-md:px-3 max-md:h-36  max-md:border-0 max-md:border-b-8 max-md:rounded-none max-md:border-gray-100">
        {session && session.user.image ? (
          <div className="flex rounded-full w-85 aspect-square relative justify-center items-center border">
            <Image
              className="rounded-full object-cover"
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${session.user.image}`}
              alt="myprofile"
              fill
              sizes="150px"
            />
          </div>
        ) : (
          <div className="w-85 aspect-square defualt-profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
              <path
                fill="rgba(0,0,0,0.2)"
                d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
              />
            </svg>
          </div>
        )}
        <div className="flex flex-1 items-center max-md:flex-col max-md:items-start space-y-1 max-md:space-y-2">
          <div className="flex flex-1 flex-col">
            {session?.user.nickname ? (
              <div className="flex flex-1 text-lg max-md:text-base">{session.user.nickname}</div>
            ) : (
              <div className="flex flex-1">
                <div className="h-5 mb-2 w-32 bg-gray-100 relative rounded-sm max-md:mb-1"></div>
              </div>
            )}
            <div className="flex items-center space-x-1 text-sm text-gray-400 max-md:text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 1024 1024">
                <path
                  fill="#afb2b6"
                  d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
                />
              </svg>
              {session?.user?.createdAt ? (
                <div>{formatDate(session?.user?.createdAt)}에 가입</div>
              ) : (
                <div className="flex h-4 w-32 bg-gray-100"></div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              onClick={async e => {
                e.preventDefault();
                if (!(await getSession())) {
                  return signIn();
                }
                router.push('/mypage/product-edit');
              }}
              className="flex text-base px-2 py-1 border border-gray-300 rounded-md items-center justify-center  max-md:text-gray-400 max-md:text-sm"
              href={'/mypage/product-edit'}
            >
              상품 관리
            </Link>
            <Link
              onClick={async e => {
                e.preventDefault();
                if (!(await getSession())) {
                  return signIn();
                }
                router.push('/mypage/profile-edit');
              }}
              className="flex text-base px-2 py-1 border border-gray-300 rounded-md  items-center justify-center  max-md:text-gray-400 max-md:text-sm"
              href={'/mypage/profile-edit'}
            >
              프로필 관리
            </Link>
          </div>
        </div>
      </div>
    );
  },
);

export default function MyPage() {
  const { data: session, status, update }: SessionData = useSession();

  const { data, isLoading, error }: { data: UserData; isLoading: boolean; error: Error } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  return (
    <Suspense>
      <div className="flex flex-col h-full space-y-8 max-w-screen-lg mx-auto px-10 max-[960px]:mt-16 max-md:space-y-4 max-md:px-0 max-md:mt-12 max-md:pb-3 min-[960px]:min-h-80vh">
        <MyProfile session={session} update={update} status={status} userProfile={data?.userProfile} />
        <ProfileProducts data={data?.userProducts} />
      </div>
    </Suspense>
  );
}
