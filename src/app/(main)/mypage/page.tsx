'use client';
import React, { Suspense, useEffect } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ProfileProducts from '../_components/ProfileProducts';
import formatDate from '../_lib/formatDate';
import { UserData } from '@/type/userData';
import { User } from '@/type/user';
import ProfileImage from '../_components/ProfileImage';

const MyProfileName = ({ nickname }) => {
  return (
    <>
      {nickname ? (
        <div className="flex flex-1 text-lg max-md:text-base">{nickname}</div>
      ) : (
        <div className="flex flex-1">
          <div className="h-5 mb-2 w-32 bg-gray-100 relative rounded-sm max-md:mb-1"></div>
        </div>
      )}
    </>
  );
};

const MyProfileLoginDate = ({ createdAt }) => {
  return (
    <div className="flex items-center space-x-1 text-sm text-gray-400 max-md:text-xs">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 1024 1024">
        <path
          fill="#afb2b6"
          d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
        />
      </svg>
      {createdAt ? <div>{formatDate(createdAt)}에 가입</div> : <div className="flex h-4 w-32 bg-gray-100"></div>}
    </div>
  );
};

const ManagementButton = ({ type }) => {
  const router = useRouter();
  return (
    <Link
      onClick={async e => {
        e.preventDefault();
        if (!(await getSession())) {
          return signIn();
        }
        router.push(`/mypage/${type}`);
      }}
      className="flex text-base px-2 py-1 border border-gray-300 rounded-md  items-center justify-center  max-md:text-gray-400 max-md:text-sm"
      href={`/mypage/${type}`}
    >
      프로필 관리
    </Link>
  );
};

const MyProfile = React.memo(({ userProfile }: { userProfile: User }) => {
  const { data: session, status, update } = useSession();

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
      <ProfileImage image={session?.user.image} />
      <div className="flex flex-1 items-center max-md:flex-col max-md:items-start space-y-1 max-md:space-y-2">
        <div className="flex flex-1 flex-col">
          <MyProfileName nickname={session?.user.nickname} />
          <MyProfileLoginDate createdAt={session?.user.createdAt} />
        </div>
        <div className="flex space-x-2">
          <ManagementButton type={'product-edit'} />
          <ManagementButton type={'profile-edit'} />
        </div>
      </div>
    </div>
  );
});

export default function MyPage() {
  const { data: session, status, update } = useSession();

  const { data, isLoading, error } = useQuery<UserData>({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  return (
    <Suspense>
      <div className="flex flex-col h-full space-y-8 max-w-screen-lg mx-auto px-10 max-[960px]:mt-16 max-md:space-y-4 max-md:px-0 max-md:mt-12 max-md:pb-3 min-[960px]:min-h-80vh">
        <MyProfile userProfile={data?.userProfile} />
        <ProfileProducts data={data?.userProducts} />
      </div>
    </Suspense>
  );
}
