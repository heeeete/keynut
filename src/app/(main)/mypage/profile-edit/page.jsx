'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import getUserProfile from '@/lib/getUserProfile';
import Loading from '@/app/(main)/_components/Loading';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Modal from '../../_components/Modal';
import onClickProduct from '@/app/(admin)/admin/_utils/onClickProduct';

const ProfileName = ({ session, update }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [nickname, setNickname] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const fetchNickname = async () => {
    const profile = await getUserProfile(session.user.id);
    setNickname(profile.nickname);
    setTempNickname(profile.nickname);
  };

  useEffect(() => {
    if (session) {
      if (!session.user.nickname) fetchNickname();
      else {
        setNickname(session.user.nickname);
        setTempNickname(session.user.nickname);
      }
    }
  }, [session]);

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
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-3">
        {isEditing ? (
          <input
            className="border w-32 h-7 px-1 rounded outline-none"
            type="text"
            value={tempNickname}
            onChange={e => setTempNickname(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="border px-1 h-7 rounded w-32">{nickname}</div>
        )}
        <button
          className="px-2 border outline-none rounded"
          onClick={e => {
            onClickProduct(e);
            if (isEditing && nickname !== tempNickname) handleNickname();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? '완료' : '수정'}
        </button>
      </div>
      {isEditing ? (
        <div className="flex flex-col text-xs text-gray-400 h-12 max-md:h-14">
          <p>띄어쓰기 없이 2~10자의 한글, 영어, 숫자 조합으로 입력해주세요</p>
          <p>(변경 후 30일 내에는 변경이 불가합니다)</p>
        </div>
      ) : (
        <div className="h-10 py-1"></div>
      )}
    </div>
  );
};

const ProfileImage = ({ session, update }) => {
  const [profileImg, setProfileImg] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (session) setProfileImg(session.user.image);
  }, [session]);

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
    <div className="flex flex-col space-y-5 ">
      <div className="text-lg w-full border-b rounded-none">프로필 사진</div>
      <div className="flex items-end">
        <div>
          {profileImg ? (
            <Image
              className="rounded-full aspect-square object-cover"
              src={profileImg}
              alt="profileImg"
              width={130}
              height={130}
            />
          ) : (
            <div className="w-130 h-130 defualt-profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
                <path
                  fill="rgb(229, 231, 235)"
                  d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            className="px-2 border outline-none rounded"
            onClick={e => {
              onClickProduct(e);
              fileInputRef.current.click();
            }}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              id="profileImg"
              onChange={handleImageSelect}
              hidden
            />
            변경
          </button>
          <button
            className="px-2 border outline-none rounded"
            onClick={e => {
              onClickProduct(e);
              handleImageDelete();
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProfileEdit() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalModalStatus, setWithdrawalModalStatus] = useState(false);

  const onClickWithdrawal = async () => {
    setWithdrawalModalStatus(false);
    setIsLoading(true);

    const res = await fetch('/api/unlink', {
      method: 'POST',
    });
    if (!res.ok) {
      alert('회원 탈퇴 처리에 실패했습니다. 다시 로그인 후 시도합니다.');
      await signIn();
    } else {
      alert('회원 탈퇴가 정상적으로 처리되었습니다.');
      signOut();
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:h-d-screen max-md:justify-center ">
      <div className="flex flex-col w-350 py-10 max-md:py-0 max-md:w-64">
        <section className="flex flex-col rounded-none space-y-10 ">
          <ProfileImage session={session} update={update} />
          <div className="flex space-y-5 flex-col">
            <div className="text-lg w-full border-b rounded-none">프로필 이름</div>
            <ProfileName session={session} update={update} />
          </div>
        </section>
        <section className="flex flex-col space-y-5">
          <div className="text-lg w-full border-b rounded-none">계정</div>
          <div className="space-y-4">
            <button
              className="flex rounded"
              onClick={e => {
                onClickProduct(e);
                signOut({ callbackUrl: '/' });
              }}
            >
              •로그아웃
            </button>
            <button
              className="flex"
              onClick={e => {
                onClickProduct(e);
                setWithdrawalModalStatus(true);
              }}
            >
              •회원 탈퇴
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
