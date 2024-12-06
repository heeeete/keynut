'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Loading from '@/app/(main)/_components/Loading';
import { useRouter } from 'next/navigation';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import formatDate from '../../_lib/formatDate';
import { useModal } from '../../_components/ModalProvider';
import { Session } from 'next-auth';

const IMAGE_MAX_SIZE = 4.5 * 1024 * 1024;

interface ProfileProps {
  session: Session;
  status: 'authenticated' | 'loading' | 'unauthenticated';
}

const ProfileName = ({ session, status }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [nickname, setNickname] = useState('');
  const { openModal } = useModal();
  const { update } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      setNickname(session.user.nickname);
      setTempNickname(session.user.nickname);
    }
  }, [status]);

  const handleNickname = async () => {
    const formData = new FormData();
    formData.append('nickname', JSON.stringify(tempNickname));
    const res = await fetch('/api/user', {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      if (res.status === 403) {
        setTempNickname(nickname);
        openModal({ message: '닉네임은 변경 후 30일 내에는 변경할 수 없습니다.' });
      } else if (res.status === 409) {
        setTempNickname(nickname);
        openModal({ message: '이미 사용 중인 닉네임입니다.' });
      } else if (res.status === 402) {
        setTempNickname(nickname);
        openModal({ message: '허용되지 않는 단어가 포함되어 있습니다.' });
      } else if (res.status === 400) {
        setTempNickname(nickname);
        openModal({ message: '닉네임은 2글자 이상 10글자 이하의 한글, 영어, 숫자만 사용 가능합니다.' });
      } else console.error('API 요청 실패:', res.status, res.statusText);
    } else {
      setNickname(tempNickname);
      update({ nickname: tempNickname });
    }
  };

  return (
    <div className="flex space-y-1 flex-col md:px-2">
      <div className="w-full rounded-none text-gray-500 max-md:text-sm">프로필 이름</div>
      <div className="flex flex-col px-2">
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <input
              maxLength={10}
              className="flex border h-8 rounded px-1 outline-none items-center flex-1 max-md:text-sm"
              type="text"
              value={tempNickname}
              onChange={e => setTempNickname(e.target.value)}
              autoFocus
            />
          ) : (
            <div className="flex border rounded px-1 h-8 flex-1 items-center max-md:text-sm">{nickname}</div>
          )}
          <button
            className="px-3 py-1 border h-8 outline-none rounded-lg text-sm text-gray-500 active:bg-gray-100"
            onClick={async e => {
              if (!(await getSession())) return signIn();
              if (isEditing && nickname !== tempNickname) handleNickname();
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? '완료' : '수정'}
          </button>
        </div>
        {isEditing ? (
          <div className="flex flex-col text-sm text-gray-400 h-12 py-1 md:mb-2 max-md:text-xs">
            <p>한글, 영어, 숫자만 사용 가능합니다 (2~10자)</p>
            <p className="text-red-300">*변경 후 30일 내에는 변경이 불가합니다</p>
          </div>
        ) : (
          <div className="h-7 py-1 max-md:h-6"></div>
        )}
      </div>
    </div>
  );
};

const ProfileImage = ({ session, status }: ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImg, setProfileImg] = useState<null | string>(null);
  const { openModal } = useModal();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (status === 'authenticated') {
      setProfileImg(session.user.image);
      setIsLoading(false);
    }
  }, [status]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files.length) return;
    if (e.target.files[0].size > IMAGE_MAX_SIZE) {
      openModal({ message: '이미지 용량 초과', subMessage: '4.5MB 이하로 업로드해 주세요.' });
      e.target.value = '';
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('oldImage', JSON.stringify(profileImg));
    formData.append('newImage', e.target.files[0]);
    const res = await fetch('/api/user', {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      if (res.status === 401) return signIn();
    } else {
      const data = await res.json();
      update({ image: data.url });
    }
  };

  const handleImageDelete = async () => {
    if (profileImg) {
      const formData = new FormData();
      formData.append('oldImage', JSON.stringify(profileImg));
      const res = await fetch('/api/user', {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) {
        console.error('API 요청 실패:', res.status, res.statusText);
      } else {
        update({ image: null });
      }
    }
  };

  return (
    <div className="flex-col space-y-1 pb-1 md:px-2">
      <div className=" rounded-none text-gray-500 max-md:text-sm">프로필 사진</div>
      <div className="flex space-x-5 px-2">
        <div>
          {profileImg ? (
            <div className="relative w-32 aspect-square max-md:w-24">
              <Image
                className="absolute rounded-full aspect-square object-cover"
                src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${profileImg}`}
                alt="profileImg"
                fill
                sizes="(max-width:200px), 300px"
              />
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black bg-opacity-25 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                    <g stroke="white" opacity={0.8}>
                      <circle cx="12" cy="12" r="9.5" fill="none" strokeLinecap="round" strokeWidth="3">
                        <animate
                          attributeName="stroke-dasharray"
                          calcMode="spline"
                          dur="2.25s"
                          keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                          keyTimes="0;0.475;0.95;1"
                          repeatCount="indefinite"
                          values="0 150;42 150;42 150;42 150"
                        />
                        <animate
                          attributeName="stroke-dashoffset"
                          calcMode="spline"
                          dur="2.25s"
                          keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                          keyTimes="0;0.475;0.95;1"
                          repeatCount="indefinite"
                          values="0;-16;-59;-59"
                        />
                      </circle>
                      <animateTransform
                        attributeName="transform"
                        dur="3s"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 12 12;360 12 12"
                      />
                    </g>
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="w-32 aspect-square defualt-profile max-md:w-24">
              <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
                <path
                  fill="rgba(0,0,0,0.2)"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex space-x-2 items-end">
          <button
            className="px-3 py-1 border outline-none rounded-lg text-sm text-gray-500  active:bg-gray-100"
            onClick={e => {
              fileInputRef.current.click();
            }}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/bmp,image/webp,image/svg+xml,image/tiff"
              ref={fileInputRef}
              id="profileImg"
              onChange={handleImageSelect}
              hidden
            />
            <p className="flex-nowrap whitespace-nowrap">변경</p>
          </button>
          <button
            className="px-3 py-1 border outline-none rounded-lg text-sm text-gray-500  active:bg-gray-100"
            onClick={async e => {
              if (!(await getSession())) return signIn();
              handleImageDelete();
            }}
          >
            <p className="flex-nowrap whitespace-nowrap">삭제</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = ({ session, status }: ProfileProps) => {
  return (
    <section className="flex flex-col rounded-none space-y-4">
      <p className="font-medium border-b border-black md:text-lg">프로필 정보</p>
      <ProfileImage session={session} status={status} />
      <ProfileName session={session} status={status} />
    </section>
  );
};

const SignInInfo = ({ session }: { session: Session }) => {
  return (
    <section className="flex flex-col space-y-4 mb-6">
      <p className="font-medium border-b border-black md:text-lg">가입 정보</p>
      <div className="flex flex-col md:px-2">
        <p className="text-gray-500 max-md:text-sm">연결 서비스</p>
        {session?.user?.provider ? (
          <p className="text-gray-400 px-2 max-md:text-sm">{session?.user?.provider}</p>
        ) : (
          <div className="h-5 mt-1 ml-2 w-16 bg-gray-100 max-md:h-4"></div>
        )}
      </div>
      <div className="flex flex-col md:px-2">
        <p className="text-gray-500 max-md:text-sm">가입일</p>
        <div className="flex items-center space-x-1 px-2 text-gray-400 max-md:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
            />
          </svg>

          {session?.user?.createdAt ? (
            <div>{formatDate(session.user.createdAt)}</div>
          ) : (
            <div className="h-5 mt-1 w-28 bg-gray-100 max-md:h-4"></div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:px-2">
        <p className="text-gray-500 max-md:text-sm">이메일</p>
        {session?.user?.email ? (
          <p className="text-gray-400 px-2 no-underline max-md:text-sm">{session.user.email}</p>
        ) : (
          <div className="h-5 mt-1 ml-2 w-36 bg-gray-100 max-md:h-4"></div>
        )}
      </div>
    </section>
  );
};

export default function ProfileEdit() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const invalidateFilters = useInvalidateFiltersQuery();
  const { openModal } = useModal();

  const onClickWithdrawal = async () => {
    setIsLoading(true);

    const date = new Date();
    date.setMonth(date.getMonth() + 3);

    const res = await fetch('/api/unlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: session.user.id, expires_at: Math.floor(date.getTime() / 1000) }),
    });

    if (!res.ok) {
      openModal({ message: '회원 탈퇴 처리에 실패했습니다. 다시 로그인 후 시도해주세요.' });
      await signIn();
    } else {
      openModal({ message: '회원 탈퇴가 정상적으로 처리되었습니다.' });

      invalidateFilters();
      router.refresh();
      signOut({ callbackUrl: '/' });
    }

    setIsLoading(false);
  };
  const openWithdrawal = async () => {
    const res = await openModal({
      message: '회원탈퇴 하시겠습니까?',
      subMessage: '탈퇴 후 3개월간 서비스 이용 불가',
      isSelect: true,
    });
    if (!res) return;
    onClickWithdrawal();
  };

  return (
    <div className="flex flex-col max-w-screen-sm mx-auto px-10 md:items-center max-[960px]:mt-16 max-md:mt-0 max-[960px]:px-6 max-md:justify-center md:min-h-80vh">
      <button className="h-12 w-full md:hidden items-start" onClick={() => router.back()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20 12H4m0 0l6-6m-6 6l6 6"
          />
        </svg>
      </button>
      <div className="flex flex-col w-full md:py-5 max-md:py-0 max-md:w-full">
        <ProfileInfo session={session} status={status} />
        <SignInInfo session={session} />
        <section className="flex md:justify-end">
          <div className="flex space-x-4">
            <button
              className="flex text-gray-500 underline"
              onClick={e => {
                signOut({ callbackUrl: '/' });
              }}
            >
              로그아웃
            </button>
            <button className="flex text-gray-500 underline" onClick={openWithdrawal}>
              회원 탈퇴
            </button>
          </div>
        </section>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}
