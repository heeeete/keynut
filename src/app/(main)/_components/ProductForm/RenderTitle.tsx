'use client';
import React, { useCallback } from 'react';

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>
}

const RenderTitle = React.memo(({ title, setTitle }: Props) => {
  const onChangeTitle = useCallback(e => {
    setTitle(e.target.value);
  }, []);

  return (
    <>
      <p className="mt-10 mb-3 font-medium text-xl max-[480px]:text-base">
        상품명<span className="text-red-500">*</span>
      </p>
      <div className="flex no-underline max-w-lg border-b">
        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          maxLength={40}
          placeholder="상품명을 입력해주세요."
          className="w-full outline-none no-underline text-xl"
        />
        <p className="flex text-xs text-gray-400 items-center">{`(${title.length}/40)`}</p>
      </div>
    </>
  );
});

export default RenderTitle;
