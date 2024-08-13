'use client';

import React from 'react';

const RenderSubcategories = React.memo(({ mainCategory, subCategory, handleSubCategoryClick }) => {
  switch (mainCategory) {
    case 1:
      return (
        <>
          <li
            onClick={() => handleSubCategoryClick(10)}
            className={`p-3 ${subCategory === 10 ? 'selected font-semibold' : ''}`}
          >
            커스텀
          </li>
          <li
            onClick={() => handleSubCategoryClick(11)}
            className={`p-3 ${subCategory === 11 ? 'selected font-semibold' : ''}`}
          >
            기성품
          </li>
          <li
            onClick={() => handleSubCategoryClick(12)}
            className={`p-3 ${subCategory === 12 ? 'selected font-semibold' : ''}`}
          >
            스위치
          </li>
          <li
            onClick={() => handleSubCategoryClick(13)}
            className={`p-3 ${subCategory === 13 ? 'selected font-semibold' : ''}`}
          >
            보강판
          </li>
          <li
            onClick={() => handleSubCategoryClick(14)}
            className={`p-3 ${subCategory === 14 ? 'selected font-semibold' : ''}`}
          >
            아티산
          </li>
          <li
            onClick={() => handleSubCategoryClick(15)}
            className={`p-3 ${subCategory === 15 ? 'selected font-semibold' : ''}`}
          >
            키캡
          </li>
          <li
            onClick={() => handleSubCategoryClick(16)}
            className={`p-3 ${subCategory === 16 ? 'selected font-semibold' : ''}`}
          >
            PCB
          </li>
          <li
            onClick={() => handleSubCategoryClick(19)}
            className={`p-3 ${subCategory === 19 ? 'selected font-semibold' : ''}`}
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
            className={`p-3 ${subCategory === 20 ? 'selected font-semibold' : ''}`}
          >
            완제품
          </li>
          <li
            onClick={() => handleSubCategoryClick(21)}
            className={`p-3 ${subCategory === 21 ? 'selected font-semibold' : ''}`}
          >
            마우스피트
          </li>
          <li
            onClick={() => handleSubCategoryClick(22)}
            className={`p-3 ${subCategory === 22 ? 'selected font-semibold' : ''}`}
          >
            그립테이프
          </li>
          <li
            onClick={() => handleSubCategoryClick(23)}
            className={`p-3 ${subCategory === 23 ? 'selected font-semibold' : ''}`}
          >
            PCB
          </li>
          <li
            onClick={() => handleSubCategoryClick(29)}
            className={`p-3 ${subCategory === 29 ? 'selected font-semibold' : ''}`}
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
            className={`p-3 ${subCategory === 30 ? 'selected font-semibold' : ''}`}
          >
            마우스패드
          </li>
          <li
            onClick={() => handleSubCategoryClick(31)}
            className={`p-3 ${subCategory === 31 ? 'selected font-semibold' : ''}`}
          >
            장패드
          </li>
          <li
            onClick={() => handleSubCategoryClick(39)}
            className={`p-3 ${subCategory === 39 ? 'selected font-semibold' : ''}`}
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
