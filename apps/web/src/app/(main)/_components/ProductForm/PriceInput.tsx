'use client';

import React, { useCallback } from 'react';

interface Props {
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
}

const PriceInput = React.memo(({ price, setPrice }: Props) => {
  const handlePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value)) && !(value[0] === '0') && value.length <= 9) {
      setPrice(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
  }, []);

  return (
    <>
      <p className="mt-10 mb-3 font-medium text-xl max-[480px]:text-base">
        상품 가격<span className="text-red-500">*</span>
      </p>
      <div className="flex no-underline max-w-36 border-b">
        <input
          type="text"
          value={price}
          onChange={handlePrice}
          placeholder="0"
          className="w-full outline-none no-underline text-xl max-[480px]:text-base"
        />
        <p className="text-lg">원</p>
      </div>
    </>
  );
});

PriceInput.displayName = 'PriceInput';

export default PriceInput;
