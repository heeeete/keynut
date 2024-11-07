'use client';

import React, { useCallback } from 'react';

interface Props {
  condition: number;
  setCondition: React.Dispatch<React.SetStateAction<number>>
}

const RenderCondition = React.memo(({ condition, setCondition }: Props) => {
  const handleConditionClick = useCallback(id => {
    setCondition(id);
  }, []);

  return (
    <div className="flex-0.4 min-w-72 ">
      <div className="flex font-medium text-xl my-3 max-[480px]:text-base">
        상품상태<span className="text-red-500">*</span>
      </div>
      <div className="flex flex-col h-64 justify-around text-lg max-[480px]:text-base">
        <label className="flex items-center space-x-2 ">
          <input
            className="relative md:hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
            type="radio"
            name="condition"
            id="1"
            checked={condition === 1}
            onChange={() => handleConditionClick(1)}
          />
          <span>미사용</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            className="relative md:hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
            type="radio"
            name="condition"
            id="2"
            checked={condition === 2}
            onChange={() => handleConditionClick(2)}
          />
          <span>사용감 없음</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            className="relative md:hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
            type="radio"
            name="condition"
            id="3"
            checked={condition === 3}
            onChange={() => handleConditionClick(3)}
          />
          <span>사용감 적음</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            className="relative md:hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
            type="radio"
            name="condition"
            id="4"
            checked={condition === 4}
            onChange={() => handleConditionClick(4)}
          />
          <span>사용감 많음</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            className="relative md:hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
            type="radio"
            name="condition"
            id="5"
            checked={condition === 5}
            onChange={() => handleConditionClick(5)}
          />
          <span>파손 / 고장</span>
        </label>
      </div>
    </div>
  );
});

export default RenderCondition;
