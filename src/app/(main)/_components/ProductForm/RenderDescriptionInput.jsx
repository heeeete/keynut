'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useModal } from '../ModalProvider';

const RenderDescriptionInput = React.memo(({ description, setDescription, subCategory }) => {
  const [template, setTemplate] = useState(false);
  const isTyping = useRef(null);
  const { openModal } = useModal();

  const onClickTemplate = async () => {
    let res = true;
    if ((!template && description.length) || (template && isTyping.current))
      res = await openModal({
        message: '계속 진행하시겠습니까?',
        subMessage: '작성 중인 글이 초기화됩니다.',
        isSelect: true,
      });
    if (!res) return;

    if (template) setDescription('');
    else {
      isTyping.current = false;
      setDescription(`하우징 - \n스위치 - \n보강판 - \n기판 - \n키캡 - \n스테빌라이저 - \n`);
    }
    setTemplate(!template);
  };

  return (
    <>
      <div className="flex items-end mt-10 mb-3 space-x-3 max-md:justify-between">
        <p className=" font-medium text-xl max-[480px]:text-base leading-snug">
          상품 설명<span className="text-red-500">*</span>
        </p>
        {subCategory === 10 && (
          <button
            className={`${
              template ? ' text-gray-500 border-gray-500' : 'text-gray-300 border-gray-200'
            }  rounded px-2 py-0.5 text-sm border`}
            onClick={onClickTemplate}
          >
            {template ? '템플릿 끄기' : '템플릿 사용'}
          </button>
        )}
      </div>
      <div className="flex ">
        <textarea
          value={description}
          onChange={e => {
            isTyping.current = true;
            setDescription(e.target.value);
          }}
          maxLength={1000}
          placeholder="상품 설명을 입력해주세요."
          className="flex-1 p-2 bg-gray-50 outline-none no-underline text-xl  scrollbar-hide resize-none max-[480px]:text-base"
          id="description"
          rows={8}
        />
      </div>
      <p className="text-xs text-gray-400 content-end ">{`(${description.length}/1000)`}</p>
    </>
  );
});

export default RenderDescriptionInput;
