'use client';

import { useState } from 'react';
import Image from 'next/image';
export default function ProfileEdit() {
  const [profileName, setProfileName] = useState('키린이1');
  return (
    <div
      className="flex flex-col items-center max-w-screen-xl mx-auto px-10 bg-red-700 max-md:px-2 "
      style={{ height: '100dvh' }}
    >
      <div className="flex flex-col space-y-1">
        <section className="flex flex-col rounded-none space-y-1 ">
          <div className="flex flex-col space-y-5 ">
            <div className="text-lg w-full border-b rounded-none">프로필 사진</div>
            <div className="flex items-end">
              <div>
                <Image className="rounded-full" src="/키보드1.webp" alt="profileImage" width={130} height={130} />
              </div>
              <div className="flex space-x-2">
                <button className="px-2 border outline-none rounded">변경</button>
                <button className="px-2 border outline-none rounded">삭제</button>
              </div>
            </div>
          </div>
          <div className="flex space-y-1 flex-col">
            <div className="text-lg w-full border-b rounded-none">프로필 이름</div>
            <div className="flex items-center space-x-4">
              <div className="border px-4 rounded">{profileName}</div>
              <button className="px-2 border outline-none rounded">수정</button>
            </div>
          </div>
        </section>
        <section className="flex flex-col space-y-5 items-center">
          <button>•고객센터</button>
          <button>•로그아웃</button>
          <button>•회원 탈퇴</button>
        </section>
      </div>
    </div>
  );
}
