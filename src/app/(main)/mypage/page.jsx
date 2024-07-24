'use client';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';

// import MyPost from './_components/MyPost';
// import LikedPost from './_components/LikedPost';
import { getSession, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import getUserProducts from '@/lib/getUserProducts';
import { useQuery } from '@tanstack/react-query';
import ProfileSkeleton from '../_components/ProfileSkeleton';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/lib/getUserProfile';

const MyProfile = React.memo(({ session, update, status }) => {
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
    <div className="flex h-24 border border-gray-300 rounded-md items-center px-4 max-md:px-2">
      <div className="flex flex-1 items-center space-x-5">
        {session && session.user.image ? (
          <div className="flex rounded-full w-20 aspect-square relative justify-center items-center border max-md:w-16 ">
            <Image
              className="rounded-full object-cover"
              src={session.user.image}
              alt="myprofile"
              fill
              sizes="(max-width:768px) 80px,100px"
            />
          </div>
        ) : (
          <div className="w-20 h-20 defualt-profile max-md:w-16 max-md:h-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
              <path
                fill="rgba(0,0,0,0.2)"
                d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
              />
            </svg>
          </div>
        )}
        {session?.user.nickname ? (
          <div className="text-lg max-md:text-base">{session.user.nickname}</div>
        ) : (
          <div className="h-6 w-32 bg-gray-100 relative rounded-sm">
            <div className="absolute top-0 left-0 h-full w-full animate-loading">
              <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
            </div>
          </div>
        )}
      </div>
      <Link
        onClick={async e => {
          e.preventDefault();
          if (!(await getSession())) {
            return signIn();
          }
          router.push('/mypage/profile-edit');
        }}
        className="flex text-base px-3 py-1 border border-gray-300 rounded-md max-md:text-sm"
        href={'/mypage/profile-edit'}
      >
        프로필 관리
      </Link>
    </div>
  );
});

const MyProducts = ({ data }) => {
  const [productOption, setProductOption] = useState(1);
  return (
    <div className="flex flex-col h-full space-y-8">
      <section className="space-y-3">
        <h2 className="text-xl max-md:text-lg">내 상품</h2>
        <nav className="mb-2">
          <ul className="grid grid-cols-2 items-center bg-gray-100 border-gray-100 border-t border-l border-r">
            <button>
              <li
                className={`flex justify-center py-2 text-lg max-md:text-base ${productOption == 1 ? 'bg-white' : ''}`}
                onClick={() => {
                  productOption !== 1 && setProductOption(1);
                }}
              >
                판매 중 {data?.filter(a => a.state === 1).length}
              </li>
            </button>
            <button>
              <li
                className={`flex justify-center py-2 text-lg  max-md:text-base ${productOption == 0 ? 'bg-white' : ''}`}
                onClick={() => {
                  productOption !== 0 && setProductOption(0);
                }}
              >
                판매 완료 {data?.filter(a => a.state === 0).length}
              </li>
            </button>
          </ul>
        </nav>
        <div>
          {data ? (
            data.filter(a => a.state === productOption).length ? (
              <div className="grid grid-cols-3 gap-1 max-md:grid-cols-1">
                {data
                  .filter(a => a.state === productOption)
                  .map((product, index) => {
                    return (
                      <div
                        className="p-2 items-center border cursor-pointer border-gray-300 justify-between max-md:border-0 max-md:border-b rounded-sm relative max-md:border-gray-200 max-md:rounded-none"
                        key={index}
                      >
                        {!productOption && (
                          <Link
                            href={`/shop/product/${product._id}`}
                            className="absolute top-0 left-0 z-10 w-full h-full rounded bg-black opacity-70 flex items-center justify-center"
                          >
                            <p className="font-semibold text-white text-lg">판매 완료</p>
                          </Link>
                        )}
                        <div className="flex">
                          <div className="w-48 aspect-square relative mr-4 bg-gray-100">
                            <Image
                              className="rounded object-cover"
                              src={product.images[0]}
                              alt={index}
                              fill
                              sizes="(max-width:768px) 200px,(max-width:1280px) 20vw, (max-width: 1500px) 20vw, 250px"
                            ></Image>
                          </div>
                          <div className="flex flex-col justify-center w-full">
                            <div className="break-all line-clamp-1 mr-5">{product.title}</div>
                            <div className="space-x-1 font-semibold items-center line-clamp-1 break-all">
                              <span>{product.price.toLocaleString()}</span>
                              <span className="text-sm">원</span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/shop/product/${product._id}`}
                          className="absolute top-0 left-0 w-full h-full rounded"
                        ></Link>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center h-44 justify-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 256 256">
                  <path
                    fill="lightgray"
                    d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24M158 46.48L193.52 82H158ZM202 216a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50Zm-45.76-92.24a6 6 0 0 1 0 8.48L136.49 152l19.75 19.76a6 6 0 1 1-8.48 8.48L128 160.49l-19.76 19.75a6 6 0 0 1-8.48-8.48L119.51 152l-19.75-19.76a6 6 0 1 1 8.48-8.48L128 143.51l19.76-19.75a6 6 0 0 1 8.48 0"
                  />
                </svg>
                <p className="text-gray-300 font-medium">
                  {productOption === 1 ? '판매 중인 상품이 없습니다' : '판매 완료된 상품이 없습니다'}
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-3 gap-1 min-h-14 relative max-md:grid-cols-1">
              {Array.from({ length: 30 }).map((_, index) => (
                <Fragment key={index}>
                  <ProfileSkeleton />
                </Fragment>
              ))}
              <div className="absolute top-0 left-0 h-full w-full animate-loading">
                <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

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

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-xl mx-auto px-10 max-md:px-3 max-md:main-768 max-md:pb-3">
      <MyProfile data={data?.userProfile} session={session} update={update} status={status} />
      {/* <UserSupport /> */}
      <MyProducts data={data?.userProducts} />
    </div>
  );
}
