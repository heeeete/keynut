'use client';
import Image from 'next/image';
import React from 'react';
import { useParams } from 'next/navigation';

import getUserProducts from '@/lib/getUserProducts';
import { useQuery } from '@tanstack/react-query';
import ProfileProducts from '../../_components/ProfileProducts';

const UserProfile = React.memo(({ data }) => {
  return (
    <div className="flex h-24 border border-gray-300 rounded-md items-center px-4 space-x-4 max-md:px-3 max-md:h-34 max-md:space-x-3  max-md:border-0 max-md:border-b-8 max-md:rounded-none max-md:border-gray-100">
      <div className="flex flex-1 items-center space-x-5">
        {data && data.image ? (
          <div className="flex rounded-full w-20 aspect-square relative justify-center items-center border ">
            <Image
              className="rounded-full object-cover"
              src={data.image}
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
        {data && data.nickname ? (
          <div className="text-lg max-md:text-base">{data.nickname} </div>
        ) : (
          <div className="h-6 w-32 bg-gray-100 relative rounded-sm">
            <div className="absolute top-0 left-0 h-full w-full animate-loading">
              <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default function RenderProfile() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', id],
    queryFn: () => getUserProducts(id),
    enabled: !!id,
  });

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-lg mx-auto px-10 max-md:space-y-4 max-md:px-0 max-md:mt-12 max-md:pb-3">
      <UserProfile data={data?.userProfile} />
      <ProfileProducts data={data?.userProducts} />
    </div>
  );
}
