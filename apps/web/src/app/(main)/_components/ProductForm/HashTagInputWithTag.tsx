'use client';

import React, { useCallback, useState } from 'react';

interface Props {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const HashTagInputWithTag = React.memo(({ tags, setTags }: Props) => {
  const [tempTag, setTempTag] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const removeTag = (idx: number) => {
    const newTags = [...tags];
    newTags.splice(idx, 1);
    setTags(newTags);
  };

  const activeEnter = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (tempTag.trim().length && tags.length < 10 && e.key === 'Enter') {
      let newTags = [...tags];
      newTags = [...newTags, '#' + tempTag.trim().replaceAll(' ', '')];
      setTags(newTags);
      setTempTag('');
    }
  };

  const onChangeTempTag = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTag(e.target.value);
  }, []);

  return (
    <div className="my-3">
      <div className="flex items-center">
        <p className="text-gray-400 mr-0.5">#</p>
        <input
          type="text"
          value={tempTag}
          onChange={onChangeTempTag}
          onKeyDown={activeEnter}
          maxLength={10}
          placeholder="상품 태그 최대 10개"
          className="bg-gray-100 rounded p-1 max-w-md outline-none no-underline"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <p className="flex text-xs ml-2 text-gray-400 items-center">{`(${tags.length}/10)`}</p>
      </div>
      <div className="flex text-gray-500 flex-wrap  py-1 px-2">
        {tags.map((e, idx) => (
          <div key={idx} className="flex items-center space-x-1 mr-3">
            <span>{e}</span>
            <button onClick={() => removeTag(idx)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.8rem"
                height="0.8rem"
                viewBox="0 0 2048 2048"
              >
                <path
                  fill="currentColor"
                  d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {tags.length === 0 && (
        <p
          className={`${
            isFocus ? 'opacity-100' : 'opacity-0'
          } transition-opacity text-sm text-gray-400 font-semibold px-2 max-md:text-xs`}
        >
          상품 태그는 엔터로 입력할 수 있습니다.
        </p>
      )}
    </div>
  );
});

HashTagInputWithTag.displayName = 'HashTagInputWithTag';

export default HashTagInputWithTag;
