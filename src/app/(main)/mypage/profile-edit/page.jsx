'use client';

import { useState, useRef, useCallback, fect } from 'react';
import Image from 'next/image';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Loading from '@/app/(main)/_components/Loading';
import { useRouter } from 'next/navigation';
import Modal from '../../_components/Modal';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import formatDate from '../../_lib/formatDate';

const ProfileName = ({ session, status, update }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [nickname, setNickname] = useState('');

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
        alert('닉네임은 변경 후 30일이 지나야 다시 변경할 수 있습니다.');
      } else if (res.status === 409) {
        setTempNickname(nickname);
        alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해 주세요.');
      } else if (res.status === 402) {
        setTempNickname(nickname);
        alert('사용하신 닉네임에는 허용되지 않는 단어가 포함되어 있습니다. 다시 입력해주세요');
      } else if (res.status === 400) {
        setTempNickname(nickname);
        alert('닉네임은 띄어쓰기 없이 2글자 이상 10글자 이내의 한글, 영어, 숫자로만 구성되어야 합니다.');
      } else console.error('API 요청 실패:', res.status, res.statusText);
    } else {
      const data = await res.json();
      setNickname(tempNickname);
      update({ nickname: tempNickname, nicknameChangedAt: data.time });
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

const ProfileImage = ({ session, status, update }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (status === 'authenticated') {
      setProfileImg(session.user.image);
      setIsLoading(false);
    }
  }, [status]);

  const handleImageSelect = async e => {
    if (!e.target.files.length) return;
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
      console.log('done');
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
        const data = await res.json();
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
                src={profileImg}
                alt="profileImg"
                fill
                sizes="(max-width:200px), 300px"
              />
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black bg-opacity-25 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                    <g>
                      <rect width="2" height="5" x="11" y="1" fill="white" opacity="0.14" />
                      <rect
                        width="2"
                        height="5"
                        x="11"
                        y="1"
                        fill="white"
                        opacity="0.29"
                        transform="rotate(30 12 12)"
                      />
                      <rect
                        width="2"
                        height="5"
                        x="11"
                        y="1"
                        fill="white"
                        opacity="0.43"
                        transform="rotate(60 12 12)"
                      />
                      <rect
                        width="2"
                        height="5"
                        x="11"
                        y="1"
                        fill="white"
                        opacity="0.57"
                        transform="rotate(90 12 12)"
                      />
                      <rect
                        width="2"
                        height="5"
                        x="11"
                        y="1"
                        fill="white"
                        opacity="0.71"
                        transform="rotate(120 12 12)"
                      />
                      <rect
                        width="2"
                        height="5"
                        x="11"
                        y="1"
                        fill="white"
                        opacity="0.86"
                        transform="rotate(150 12 12)"
                      />
                      <rect width="2" height="5" x="11" y="1" fill="white" transform="rotate(180 12 12)" />
                      <animateTransform
                        attributeName="transform"
                        calcMode="discrete"
                        dur="1.5s"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
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

const ProfileInfo = ({ session, status, update }) => {
  return (
    <section className="flex flex-col rounded-none space-y-4">
      <p className="font-medium border-b border-black md:text-lg">프로필 정보</p>
      <ProfileImage session={session} status={status} update={update} />
      <ProfileName session={session} status={status} update={update} />
    </section>
  );
};

const SignInInfo = ({ session }) => {
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
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalModalStatus, setWithdrawalModalStatus] = useState(false);
  const invalidateFilters = useInvalidateFiltersQuery();

  const onClickWithdrawal = async () => {
    setWithdrawalModalStatus(false);
    setIsLoading(true);

    const res = await fetch('/api/unlink', {
      method: 'POST',
    });
    if (!res.ok) {
      console.log(await res.json());
      alert('회원 탈퇴 처리에 실패했습니다. 다시 로그인 후 시도합니다.');
      await signIn();
    } else {
      alert('회원 탈퇴가 정상적으로 처리되었습니다.');
      invalidateFilters();
      router.refresh();
      signOut({ callbackUrl: '/' });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col max-w-screen-sm mx-auto px-10 md:items-center max-md:px-6 max-md:justify-center">
      <button className="h-12 w-auto md:hidden" onClick={() => router.back()}>
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
        <ProfileInfo session={session} status={status} update={update} />
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
            <button
              className="flex text-gray-500 underline"
              onClick={e => {
                setWithdrawalModalStatus(true);
              }}
            >
              회원 탈퇴
            </button>
          </div>
        </section>
      </div>
      {isLoading && <Loading />}
      {withdrawalModalStatus && (
        <Modal message={'회원탈퇴 하시겠습니까?'} yesCallback={onClickWithdrawal} modalSet={setWithdrawalModalStatus} />
      )}
    </div>
  );
}
