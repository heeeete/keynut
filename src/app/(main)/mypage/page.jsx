'use client';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';

// import MyPost from './_components/MyPost';
// import LikedPost from './_components/LikedPost';
import { getSession, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/lib/getUserProfile';
import ProfileProducts from '../_components/ProfileProducts';
import formatDate from '../_lib/formatDate';

const MyProfile = React.memo(({ session, update, status, createdAt }) => {
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile(session.user.id);
      if (profile.nickname !== session.user.nickname) update({ nickname: profile.nickname });
      if (profile.image !== session.user.image) update({ image: profile.image });
    };

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  return (
    <div className="flex h-28 border border-gray-300 rounded-md items-center px-4 space-x-4 max-md:px-3 max-md:h-36  max-md:border-0 max-md:border-b-8 max-md:rounded-none max-md:border-gray-100">
      {session && session.user.image ? (
        <div className="flex rounded-full w-20 aspect-square relative justify-center items-center border">
          <Image
            className="rounded-full object-cover"
            src={session.user.image}
            alt="myprofile"
            fill
            sizes="(max-width:768px) 80px,100px"
          />
        </div>
      ) : (
        <div className="w-20 h-20 aspect-square defualt-profile">
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
              <div className="h-6 w-32 bg-gray-100 relative rounded-sm">
                <div className="absolute top-0 left-0 h-full w-full animate-loading">
                  <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-1 text-sm text-gray-400 max-md:text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
              <path
                fill="currentColor"
                d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
              />
            </svg>
            <div>{createdAt ? `${formatDate(createdAt)}에 가입` : ''}</div>
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
});

// const UserSupport = () => {
//   return (
//     <div className="flex border rounded space-x-20 p-4">
//       <Link href={'/qna/new'} className="flex flex-col w-24 aspect-square justify-center items-center">
//         <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
//           <path
//             fill="none"
//             stroke="currentColor"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             stroke-width="2"
//             d="M12 14v-3m0 0V8m0 3H9m3 0h3m-7.876 7.701L5.6 19.921c-.833.665-1.249.998-1.599.999a1 1 0 0 1-.783-.377C3 20.27 3 19.737 3 18.671V7.201c0-1.12 0-1.681.218-2.11c.192-.376.497-.681.874-.873C4.52 4 5.08 4 6.2 4h11.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.427.218.987.218 2.105v7.607c0 1.117 0 1.676-.218 2.104a2 2 0 0 1-.874.874c-.427.218-.986.218-2.104.218H9.123c-.416 0-.625 0-.824.04a2 2 0 0 0-.507.179c-.18.092-.342.221-.665.48z"
//           />
//         </svg>
//         <p>1:1 문의</p>
//       </Link>
//       <Link href={} className="flex flex-col w-24 aspect-square justify-center items-center">
//         <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
//           <g
//             fill="none"
//             stroke="currentColor"
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             stroke-width="2"
//             color="currentColor"
//           >
//             <path d="M7.998 16h4m-4-5h8M7.5 3.5c-1.556.047-2.483.22-3.125.862c-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88c.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126c-.641-.642-1.569-.815-3.125-.862" />
//             <path d="M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 1 1 0 3.5h-5.5a1.75 1.75 0 0 1-1.75-1.75" />
//           </g>
//         </svg>
//         <p>1:1 문의 내역</p>
//       </Link>
//     </div>
//   );
// };

export default function MyPage() {
  const { data: session, status, update } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  console.log(data?.userProfile);
  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-lg mx-auto px-10 max-md:space-y-4 max-md:px-0 max-md:mt-12 max-md:pb-3">
      <MyProfile
        data={data?.userProfile}
        session={session}
        update={update}
        status={status}
        createdAt={data?.userProfile.createdAt}
      />
      {/* <UserSupport /> */}
      <ProfileProducts data={data?.userProducts} />
    </div>
  );
}
