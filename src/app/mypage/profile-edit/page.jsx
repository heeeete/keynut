'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import getUserProfile from '@/app/_lib/getUserProfile';

const ProfileName = ({ session, update }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [nickname, setNickname] = useState('');

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
      console.error('API 요청 실패:', res.status, res.statusText);
    } else {
      if (res.status === 203) {
        setTempNickname(nickname);
        alert('닉네임은 변경 후 30일이 지나야 다시 변경할 수 있습니다.');
      } else {
        const data = await res.json();
        setNickname(tempNickname);
        update({ nickname: tempNickname, nicknameChangedAt: data.time });
      }
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
          onClick={() => {
            if (isEditing && nickname !== tempNickname) handleNickname();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? '완료' : '수정'}
        </button>
      </div>
      {isEditing ? <div className="text-xs text-gray-400">변경 후 30일 내에는 변경이 불가합니다</div> : ''}
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
            onClick={() => {
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
            onClick={() => {
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
  return (
    <div className="flex flex-col items-center max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:h-d-screen max-md:justify-center ">
      <div className="flex flex-col space-y-10 py-10 max-md:py-0">
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
              className="flex"
              onClick={() => {
                signOut({ callbackUrl: '/' });
              }}
            >
              •로그아웃
            </button>
            <button className="flex">•회원 탈퇴</button>
          </div>
        </section>
      </div>
    </div>
  );
}
