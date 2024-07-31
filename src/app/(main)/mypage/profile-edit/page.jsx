'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import getUserProfile from '@/lib/getUserProfile';
import Loading from '@/app/(main)/_components/Loading';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Modal from '../../_components/Modal';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';

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
    <div className="flex space-y-3 flex-col">
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
          <div className="flex flex-col text-sm text-gray-400 h-12 max-md:h-12 py-1 max-md:text-xs">
            <p>띄어쓰기 없이 2~10자의 한글, 영어, 숫자 조합으로 입력해주세요</p>
            <p>(변경 후 30일 내에는 변경이 불가합니다)</p>
          </div>
        ) : (
          <div className="h-6 py-1"></div>
        )}
      </div>
    </div>
  );
};

const ProfileImage = ({ session, status, update }) => {
  const [profileImg, setProfileImg] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (status === 'authenticated') setProfileImg(session.user.image);
  }, [status]);

  const handleImageSelect = async e => {
    if (!e.target.files.length) return;
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
        const data = await res.json();
        update({ image: null });
      }
    }
  };

  return (
    <div className="flex-col space-y-3 mb-6">
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
                // width={100}
                // height={100}
              />
            </div>
          ) : (
            <div className="w-130 h-130 defualt-profile">
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

  console.log(session?.user ? session.user : '');
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
      <div className="flex flex-col w-full py-10 max-md:py-0 max-md:w-full">
        <section className="flex flex-col rounded-none">
          <p className="font-medium mb-4 border-b border-black md:text-lg max-md:mb-2">프로필 정보</p>
          <ProfileImage session={session} status={status} update={update} />
          <ProfileName session={session} status={status} update={update} />
        </section>
        <section className="flex flex-col space-y-2 mb-6">
          <p className="font-medium border-b border-black md:text-lg md:mb-2">가입 정보</p>
          <div className="flex flex-col space-y-1">
            <p className="text-gray-500 max-md:text-sm">연결 서비스</p>
            <p className="text-gray-400 px-2 max-md:text-sm">KAKAO</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-gray-500 max-md:text-sm">가입일</p>
            <div className="flex items-center space-x-1 px-2 text-gray-400 max-md:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
                />
              </svg>
              <div>2024년 7월 31일</div>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-gray-500 max-md:text-sm">이메일</p>
            <p className="text-gray-400 px-2 no-underline max-md:text-sm">{session?.user.email}</p>
          </div>
        </section>
        <section className="flex flex-col">
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
