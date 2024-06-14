'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const ProfileName = () => {
  const [profileName, setProfileName] = useState('키린이1');
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex items-center space-x-4">
      {isEditing ? (
        <input
          className="border w-32 px-2 rounded outline-none"
          type="text"
          value={profileName}
          onChange={e => setProfileName(e.target.value)}
          autoFocus
        />
      ) : (
        <div className="border px-2 rounded w-32">{profileName}</div>
      )}
      <button
        className="px-2 border outline-none rounded"
        onClick={() => {
          setIsEditing(!isEditing);
        }}
      >
        {isEditing ? '완료' : '수정'}
      </button>
    </div>
  );
};

const ProfileImage = () => {
  const [profileImage, setProfileImage] = useState('/키보드1.webp');
  const fileInputRef = useRef(null);

  const handleImageSelect = useCallback(
    e => {
      if (!e.target.files.length) return;
      const filesArray = Array.from(e.target.files);
      setProfileImage(URL.createObjectURL(filesArray[0]));
    },
    [profileImage],
  );
  return (
    <div className="flex flex-col space-y-5 ">
      <div className="text-lg w-full border-b rounded-none">프로필 사진</div>
      <div className="flex items-end">
        <div>
          {profileImage.length ? (
            <Image
              className="rounded-full aspect-square object-cover"
              src={profileImage}
              alt="profileImage"
              width={130}
              height={130}
            />
          ) : (
            <Image
              className="rounded-full aspect-square object-cover"
              src="/defaultProfile.svg"
              alt="defaultProfile"
              width={130}
              height={130}
            />
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
              id="profileImage"
              onChange={handleImageSelect}
              hidden
            />
            변경
          </button>
          <button
            className="px-2 border outline-none rounded"
            onClick={() => {
              profileImage.length && setProfileImage('');
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
  return (
    <div className="flex flex-col items-center max-w-screen-xl mx-auto px-10 max-md:px-2 max-md:h-d-screen max-md:justify-center ">
      <div className="flex flex-col space-y-10 py-10 max-md:py-0">
        <section className="flex flex-col rounded-none space-y-10 ">
          <ProfileImage />
          <div className="flex space-y-5 flex-col">
            <div className="text-lg w-full border-b rounded-none">프로필 이름</div>
            <ProfileName />
          </div>
        </section>
        <section className="flex flex-col space-y-5">
          <div className="text-lg w-full border-b rounded-none">계정</div>
          <button
            className="flex"
            onClick={() => {
              signOut({ callbackUrl: '/' });
            }}
          >
            •로그아웃
          </button>
          <button className="flex">•회원 탈퇴</button>
        </section>
      </div>
    </div>
  );
}
