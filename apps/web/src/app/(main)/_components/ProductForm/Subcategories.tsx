'use client';

import React from 'react';

interface Props {
  mainCategory: number;
  subCategory: number;
  handleSubCategoryClick: (id: number) => void;
}

const Subcategories = React.memo(({ mainCategory, subCategory, handleSubCategoryClick }: Props) => {
  switch (mainCategory) {
    case 1:
      return (
        <>
          <li className={`${subCategory === 10 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(10)}>
              커스텀
            </button>
          </li>
          <li className={`${subCategory === 11 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(11)}>
              기성품
            </button>
          </li>
          <li className={`${subCategory === 12 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(12)}>
              스위치
            </button>
          </li>
          <li className={`${subCategory === 13 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(13)}>
              보강판
            </button>
          </li>
          <li className={`${subCategory === 14 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(14)}>
              아티산
            </button>
          </li>
          <li className={`${subCategory === 15 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(15)}>
              키캡
            </button>
          </li>
          <li className={`${subCategory === 16 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(16)}>
              PCB
            </button>
          </li>
          <li className={`${subCategory === 19 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(19)}>
              기타
            </button>
          </li>
        </>
      );
    case 2:
      return (
        <>
          <li className={`${subCategory === 20 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(20)}>
              완제품
            </button>
          </li>
          <li className={`${subCategory === 21 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(21)}>
              마우스피트
            </button>
          </li>
          <li className={`${subCategory === 22 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(22)}>
              그립테이프
            </button>
          </li>
          <li className={`${subCategory === 23 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(23)}>
              PCB
            </button>
          </li>
          <li className={`${subCategory === 29 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(29)}>
              기타
            </button>
          </li>
        </>
      );
    case 3:
      return (
        <>
          <li className={`${subCategory === 30 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(30)}>
              마우스패드
            </button>
          </li>
          <li className={`${subCategory === 31 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(31)}>
              장패드
            </button>
          </li>
          <li className={`${subCategory === 39 ? 'selected font-semibold' : ''}`}>
            <button className="w-full py-3" onClick={() => handleSubCategoryClick(39)}>
              기타
            </button>
          </li>
        </>
      );
    case 4: // 모니터
      return null;
    case 5: // 헤드셋
      return null;
    case 9: // 기타
      return null;
    default:
      return null;
  }
});

Subcategories.displayName = 'Subcategories';

export default Subcategories;
