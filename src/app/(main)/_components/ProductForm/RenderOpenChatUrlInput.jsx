'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';

const RenderOpenChatUrlInput = React.memo(({ openChatUrl, setOpenChatUrl, isValidOpenChat, setIsValidOpenChat }) => {
  const onChangeHandler = value => {
    setOpenChatUrl(value);
    if (value && !value.startsWith('https://open.kakao.com/')) setIsValidOpenChat(false);
    else setIsValidOpenChat(true);
  };

  const handlePaste = async event => {
    const clipboardData = await navigator.clipboard.readText(); // 클립보드에서 텍스트 읽기
    const httpsIndex = clipboardData.indexOf('https');

    if (httpsIndex !== -1) {
      const httpsContent = clipboardData.substring(httpsIndex);
      onChangeHandler(httpsContent);
    }
  };

  return (
    <>
      <div className="mt-10 max-w-lg border-b">
        <div className="flex items-end my-3 justify-between">
          <div className="flex items-end">
            <div className="font-medium text-xl max-[480px]:text-base">오픈채팅방</div>
          </div>
          <Link
            href="/notices/open-chat-guide"
            target="_blank"
            className="flex justify-center items-center px-1 rounded border bg-gray-100 text-gray-400 text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m5 12l5 5L20 7"
              />
            </svg>
            가이드
          </Link>
        </div>
        <input
          type="text"
          value={openChatUrl}
          maxLength={50}
          onChange={e => onChangeHandler(e.target.value)}
          className="w-full outline-none no-underline text-xl max-[480px]:text-base"
          placeholder="카카오톡의 오픈 채팅방을 개설하여 주소를 입력해주세요."
          onPaste={handlePaste}
        />
      </div>
      {!isValidOpenChat && (
        <div className="text-xs text-gray-400">
          <p>올바르지 않은 오픈 채팅방 주소입니다. 올바른 주소를 입력해주세요.</p>
          <p>예: https://open.kakao.com/o/sBsuGODg</p>
          <p className="text-red-400 font-semibold">사용하지 않을 경우, 입력란을 비워주세요.</p>
        </div>
      )}
    </>
  );
});

export default RenderOpenChatUrlInput;
