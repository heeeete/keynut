'use client';

import React from 'react';

const RenderSubcategories = React.memo(({ mainCategory, subCategory, handleSubCategoryClick }) => {
  switch (mainCategory) {
    case 1:
      return (
        <>
          <li
            onClick={() => handleSubCategoryClick(10)}
            className={`p-3 ${subCategory === 10 ? ' font-semibold text-xl' : ''}`}
          >
            커스텀
          </li>
          <li
            onClick={() => handleSubCategoryClick(11)}
            className={`p-3 ${subCategory === 11 ? ' font-semibold text-xl' : ''}`}
          >
            기성품
          </li>
          <li
            onClick={() => handleSubCategoryClick(12)}
            className={`p-3 ${subCategory === 12 ? ' font-semibold text-xl' : ''}`}
          >
            스위치
          </li>
          <li
            onClick={() => handleSubCategoryClick(13)}
            className={`p-3 ${subCategory === 13 ? ' font-semibold text-xl' : ''}`}
          >
            보강판
          </li>
          <li
            onClick={() => handleSubCategoryClick(14)}
            className={`p-3 ${subCategory === 14 ? ' font-semibold text-xl' : ''}`}
          >
            아티산
          </li>
          <li
            onClick={() => handleSubCategoryClick(15)}
            className={`p-3 ${subCategory === 15 ? ' font-semibold text-xl' : ''}`}
          >
            키캡
          </li>
          <li
            onClick={() => handleSubCategoryClick(16)}
            className={`p-3 ${subCategory === 16 ? ' font-semibold text-xl' : ''}`}
          >
            PCB
          </li>
          <li
            onClick={() => handleSubCategoryClick(19)}
            className={`p-3 ${subCategory === 19 ? ' font-semibold text-xl' : ''}`}
          >
            기타
          </li>
        </>
      );
    case 2:
      return (
        <>
          <li
            onClick={() => handleSubCategoryClick(20)}
            className={`p-3 ${subCategory === 20 ? ' font-semibold text-xl' : ''}`}
          >
            완제품
          </li>
          <li
            onClick={() => handleSubCategoryClick(21)}
            className={`p-3 ${subCategory === 21 ? ' font-semibold text-xl' : ''}`}
          >
            마우스피트
          </li>
          <li
            onClick={() => handleSubCategoryClick(22)}
            className={`p-3 ${subCategory === 22 ? ' font-semibold text-xl' : ''}`}
          >
            그립테이프
          </li>
          <li
            onClick={() => handleSubCategoryClick(23)}
            className={`p-3 ${subCategory === 23 ? ' font-semibold text-xl' : ''}`}
          >
            PCB
          </li>
          <li
            onClick={() => handleSubCategoryClick(29)}
            className={`p-3 ${subCategory === 29 ? ' font-semibold text-xl' : ''}`}
          >
            기타
          </li>
        </>
      );
    case 3:
      return (
        <>
          <li
            onClick={() => handleSubCategoryClick(30)}
            className={`p-3 ${subCategory === 30 ? ' font-semibold text-xl' : ''}`}
          >
            마우스패드
          </li>
          <li
            onClick={() => handleSubCategoryClick(31)}
            className={`p-3 ${subCategory === 31 ? ' font-semibold text-xl' : ''}`}
          >
            장패드
          </li>
          <li
            onClick={() => handleSubCategoryClick(39)}
            className={`p-3 ${subCategory === 39 ? ' font-semibold text-xl' : ''}`}
          >
            기타
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

export default RenderSubcategories;
