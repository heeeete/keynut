'use client';

import React, { useCallback } from 'react';
import Subcategories from './Subcategories';
import './categorySelector.css';
import baseCategory from '../../_constants/productPage/baseCategories';

interface Props {
  mainCategory: number;
  subCategory: number;
  setMainCategory: React.Dispatch<React.SetStateAction<number>>;
  setSubCategory: React.Dispatch<React.SetStateAction<number>>;
}

const CategorySelector = React.memo(
  ({ mainCategory, subCategory, setMainCategory, setSubCategory }: Props) => {
    const handleMainCategoryClick = useCallback((id: number) => {
      setMainCategory(id);
      if (id !== 9 && id !== 4 && id !== 5) setSubCategory(id * 10);
      else setSubCategory(id);
    }, []);

    const handleSubCategoryClick = useCallback((id: number) => {
      setSubCategory(id);
    }, []);

    return (
      <>
        <div className="flex flex-col flex-0.4 h-full  min-w-60">
          <div className="flex font-medium text-xl my-3 max-[480px]:text-base">
            카테고리<span className="text-red-500">*</span>
          </div>
          <div className=" h-72 border rounded">
            <div className="flex bg-gray-100 text-gray-500 rounded-t justify-center font-semibold max-[480px]:text-sm">
              <p>{baseCategory[mainCategory]}</p>
              {mainCategory !== 4 && mainCategory !== 5 && mainCategory !== 9 && (
                <p>&nbsp;-&nbsp;{baseCategory[subCategory]}</p>
              )}
            </div>
            <div className="flex h-64">
              <ul className="scroll-bar flex-1 overflow-auto text-lg cursor-pointer text-center max-[480px]:text-base">
                <li className={` ${mainCategory === 1 ? 'selected font-semibold' : ''}`}>
                  <button className="w-full py-3" onClick={() => handleMainCategoryClick(1)}>
                    키보드
                  </button>
                </li>
                <li className={`${mainCategory === 2 ? 'selected font-semibold' : ''}`}>
                  <button className="w-full py-3" onClick={() => handleMainCategoryClick(2)}>
                    마우스
                  </button>
                </li>
                <li className={`${mainCategory === 3 ? 'selected font-semibold' : ''}`}>
                  <button className="w-full py-3" onClick={() => handleMainCategoryClick(3)}>
                    패드
                  </button>
                </li>
                <li className={`${mainCategory === 4 ? 'selected font-semibold' : ''}`}>
                  <button className="w-full py-3" onClick={() => handleMainCategoryClick(4)}>
                    모니터
                  </button>
                </li>
                <li className={`${mainCategory === 5 ? 'selected font-semibold' : ''}`}>
                  <button className="w-full py-3" onClick={() => handleMainCategoryClick(5)}>
                    헤드셋
                  </button>
                </li>
                <li className={`${mainCategory === 9 ? 'selected font-semibold' : ''}`}>
                  <button className="w-full py-3" onClick={() => handleMainCategoryClick(9)}>
                    기타
                  </button>
                </li>
              </ul>
              <ul className="scroll-bar flex-1 overflow-auto text-lg cursor-pointer text-center max-[480px]:text-base">
                <Subcategories
                  mainCategory={mainCategory}
                  subCategory={subCategory}
                  handleSubCategoryClick={handleSubCategoryClick}
                />
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  },
);

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;
