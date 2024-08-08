'use client';

import React from 'react';

const RenderSubcategories = React.memo(({ mainCategory, subCategory, handleSubCategoryClick }) => {
  switch (mainCategory) {
    case 1:
      return (
        <>
          <li onClick={() => handleSubCategoryClick(10)} className={`p-3 ${subCategory === 10 ? 'bg-slate-200' : ''}`}>
            커스텀
          </li>
          <li onClick={() => handleSubCategoryClick(11)} className={`p-3 ${subCategory === 11 ? 'bg-slate-200' : ''}`}>
            기성품
          </li>
          <li onClick={() => handleSubCategoryClick(12)} className={`p-3 ${subCategory === 12 ? 'bg-slate-200' : ''}`}>
            스위치
          </li>
          <li onClick={() => handleSubCategoryClick(13)} className={`p-3 ${subCategory === 13 ? 'bg-slate-200' : ''}`}>
            보강판
          </li>
          <li onClick={() => handleSubCategoryClick(14)} className={`p-3 ${subCategory === 14 ? 'bg-slate-200' : ''}`}>
            아티산
          </li>
          <li onClick={() => handleSubCategoryClick(15)} className={`p-3 ${subCategory === 15 ? 'bg-slate-200' : ''}`}>
            키캡
          </li>
          <li onClick={() => handleSubCategoryClick(16)} className={`p-3 ${subCategory === 16 ? 'bg-slate-200' : ''}`}>
            PCB
          </li>
          <li onClick={() => handleSubCategoryClick(19)} className={`p-3 ${subCategory === 19 ? 'bg-slate-200' : ''}`}>
            기타
          </li>
        </>
      );
    case 2:
      return (
        <>
          <li onClick={() => handleSubCategoryClick(20)} className={`p-3 ${subCategory === 20 ? 'bg-slate-200' : ''}`}>
            완제품
          </li>
          <li onClick={() => handleSubCategoryClick(21)} className={`p-3 ${subCategory === 21 ? 'bg-slate-200' : ''}`}>
            마우스피트
          </li>
          <li onClick={() => handleSubCategoryClick(22)} className={`p-3 ${subCategory === 22 ? 'bg-slate-200' : ''}`}>
            그립테이프
          </li>
          <li onClick={() => handleSubCategoryClick(23)} className={`p-3 ${subCategory === 23 ? 'bg-slate-200' : ''}`}>
            PCB
          </li>
          <li onClick={() => handleSubCategoryClick(29)} className={`p-3 ${subCategory === 29 ? 'bg-slate-200' : ''}`}>
            기타
          </li>
        </>
      );
    case 3:
      return (
        <>
          <li onClick={() => handleSubCategoryClick(30)} className={`p-3 ${subCategory === 30 ? 'bg-slate-200' : ''}`}>
            마우스패드
          </li>
          <li onClick={() => handleSubCategoryClick(31)} className={`p-3 ${subCategory === 31 ? 'bg-slate-200' : ''}`}>
            장패드
          </li>
          <li onClick={() => handleSubCategoryClick(39)} className={`p-3 ${subCategory === 39 ? 'bg-slate-200' : ''}`}>
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
