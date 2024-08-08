'use client';

import React, { useCallback } from 'react';
import RenderSubcategories from './RenderSubcategories';

const RenderCategory = React.memo(({ mainCategory, subCategory, setMainCategory, setSubCategory }) => {
  const handleMainCategoryClick = useCallback(id => {
    setMainCategory(id);
    if (id !== 9 && id !== 4 && id !== 5) setSubCategory(id * 10);
    else setSubCategory(id);
  }, []);

  const handleSubCategoryClick = useCallback(id => {
    setSubCategory(id);
  }, []);

  return (
    <>
      <div className="flex flex-col flex-0.4 h-full  min-w-60">
        <div className="flex font-medium text-xl my-3 max-[480px]:text-base">
          카테고리<span className="text-red-500">*</span>
        </div>
        <div className="flex h-64 border ">
          <ul className="flex-1 overflow-auto text-lg cursor-pointer text-center">
            <li className={`p-3 ${mainCategory === 1 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(1)}>
              키보드
            </li>
            <li className={`p-3 ${mainCategory === 2 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(2)}>
              마우스
            </li>
            <li className={`p-3 ${mainCategory === 3 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(3)}>
              패드
            </li>
            <li className={`p-3 ${mainCategory === 4 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(4)}>
              모니터
            </li>
            <li className={`p-3 ${mainCategory === 5 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(5)}>
              헤드셋
            </li>
            <li className={`p-3 ${mainCategory === 9 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(9)}>
              기타
            </li>
          </ul>
          <ul className="flex-1 overflow-auto text-lg cursor-pointer text-center max-[480px]:text-base">
            <RenderSubcategories
              mainCategory={mainCategory}
              subCategory={subCategory}
              handleSubCategoryClick={handleSubCategoryClick}
            />
          </ul>
        </div>
      </div>
    </>
  );
});

export default RenderCategory;
