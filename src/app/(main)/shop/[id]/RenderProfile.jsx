'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import getUserProducts from '@/lib/getUserProducts';
import { useQuery } from '@tanstack/react-query';
import ProfileProducts from '../../_components/ProfileProducts';
import formatDate from '../../_lib/formatDate';
import Warning from '../../_components/Warning';
import { useSession } from 'next-auth/react';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';

const ProfileImage = ({ image }) => {
  return (
    <>
      {image ? (
        <div className="flex rounded-full w-85 aspect-square relative justify-center items-center border ">
          <Image className="rounded-full object-cover" src={image} alt="myprofile" fill sizes="150px" />
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
    </>
  );
};

const ProfileName = ({ name }) => {
  return (
    <div className="flex flex-1">
      {name ? (
        <div className="text-lg max-md:text-base">{name} </div>
      ) : (
        <div className="h-6 w-32 bg-gray-100 relative rounded-sm">
          <div className="absolute top-0 left-0 h-full w-full animate-loading">
            <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginDate = ({ createdAt }) => {
  return (
    <div className="flex items-center space-x-1 text-sm text-gray-400 max-md:text-xs">
      <svg className="" xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 1024 1024">
        <path
          fill="#afb2b6"
          d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
        />
      </svg>
      {createdAt ? (
        <div className="">{formatDate(createdAt)}에 가입</div>
      ) : (
        <div className="flex h-5 w-32 bg-gray-100 max-md:h-4"></div>
      )}
    </div>
  );
};

const Provider = ({ provider }) => {
  return (
    <div className="flex text-gray-400 items-center space-x-1 text-sm max-md:text-xs">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
        <g fill="#afb2b6">
          <path d="M10.243 16.314L6 12.07l1.414-1.414l2.829 2.828l5.656-5.657l1.415 1.415z" />
          <path
            fillRule="evenodd"
            d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m11 9a9 9 0 1 1 0-18a9 9 0 0 1 0 18"
            clipRule="evenodd"
          />
        </g>
      </svg>
      {provider ? (
        <div className="flex items-end space-x-1 text-center">
          <p className="flex items-end leading-snug">{provider}</p>
          <p className="flex items-end leading-tight">로그인</p>
        </div>
      ) : (
        <div className="flex h-5 w-20 bg-gray-100 mt-1 max-md:h-4"></div>
      )}
    </div>
  );
};

const uploadMemo = async (userId, tempMemo, resetQuery) => {
  const memo = {
    userId: userId,
    tempMemo: tempMemo,
  };
  const res = await fetch('/api/user/memo', {
    method: 'PUT',
    body: JSON.stringify({ memo }),
  });
  if (!res.ok) {
    console.log('error', res.statusText);
    return;
  }

  const data = await res.json();
};

const Memo = ({ status, data, session }) => {
  const router = useRouter();
  const [memo, setMemo] = useState('');
  const [tempMemo, setTempMemo] = useState('');
  const memoRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (status === 'authenticated' && data) {
      if (data.memo && session.user.id && data.memo[session.user.id]) {
        setMemo(data.memo[session.user.id]);
        setTempMemo(data.memo[session.user.id]);
      }
    }
  }, [status, data]);
  const resetQuery = useInvalidateFiltersQuery();
  return (
    <form
      className="flex items-end text-gray-400 max-md:mb-1"
      onSubmit={e => {
        e.preventDefault();
        memoRef.current.blur();
      }}
    >
      <input
        ref={memoRef}
        className="border-b border-gray-400 max-md:border-gray-300 rounded-none outline-none max-md:text-sm"
        placeholder="사용자 메모하기"
        value={tempMemo}
        type="text"
        maxLength={10}
        autoComplete="off"
        onBlur={() => {
          if (isFocused === true) {
            setIsFocused(false);
            if (memo !== tempMemo) {
              uploadMemo(data._id, tempMemo, resetQuery);
              setMemo(tempMemo);
              router.refresh();
            }
          }
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onChange={e => setTempMemo(e.target.value)}
      ></input>
    </form>
  );
};

const UserProfile = React.memo(({ data, provider }) => {
  const { data: session, status, update } = useSession();

  return (
    <div className="flex h-28 border border-gray-300 rounded-md px-6 space-x-4 max-md:px-3 max-md:h-36 max-md:space-x-3  max-md:border-0 max-md:border-b-8 max-md:rounded-none max-md:border-gray-100">
      <div className="flex flex-1 items-center space-x-5">
        <ProfileImage image={data?.image} />
        <div className="flex flex-1 md:items-center max-md:flex-col max-md:space-y-1">
          <div className="flex flex-1 flex-col">
            <ProfileName name={data?.nickname} />
            <Memo status={status} data={data} session={session} />
          </div>
          <div className="flex flex-col">
            <LoginDate createdAt={data?.createdAt} />
            <Provider provider={provider} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default function RenderProfile() {
  const { id } = useParams();
  if (id.length !== 24) return <Warning message={'사용자를 찾을 수 없습니다'} />;

  const { data, isLoading, error } = useQuery({
    queryKey: ['userProducts', id],
    queryFn: () => getUserProducts(id),
    enabled: !!id,
  });

  if (!isLoading && !data) {
    return <Warning message={'사용자를 찾을 수 없습니다'} />;
  }

  return (
    <div className="flex flex-col h-full space-y-8 max-w-screen-lg mx-auto px-10 md:mb-5 max-md:space-y-4 max-md:px-0 max-md:mt-12 max-md:pb-3 md:min-h-70vh">
      <UserProfile data={data?.userProfile} provider={data?.provider} />
      <ProfileProducts data={data?.userProducts} />
    </div>
  );
}
