'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getProducts from './_lib/getProducts';
import debounce from '../utils/debounce';

const categories = [
  {
    id: 1,
    option: '키보드',
    subCategories: [
      { id: 10, option: '하우징' },
      { id: 11, option: '스위치' },
      { id: 12, option: '보강판' },
      { id: 13, option: '아티산' },
      { id: 14, option: '키캡' },
      { id: 15, option: 'PCB' },
      { id: 19, option: '기타' },
    ],
  },
  {
    id: 2,
    option: '마우스',
    subCategories: [{ id: 29, option: '기타' }],
  },
  {
    id: 3,
    option: '기타',
    subCategories: [],
  },
];

const prices = [
  { id: 1, option: '5만원 이하' },
  { id: 2, option: '5 - 10만원' },
  { id: 3, option: '10 - 30만원' },
  { id: 4, option: '30 - 50만원' },
  { id: 5, option: '50만원 이상' },
];

const handleBookMarkClick = (e, id) => {
  e.stopPropagation();
};

const SearchBar = React.memo(({ c, setSearchText }) => {
  const [tempSearchText, setTempSearchText] = useState(c);
  const handleSearch = e => {
    e.preventDefault();
    setSearchText(tempSearchText);
  };
  return (
    <div className="search-bar-container-md  max-md:search-bar-container-maxmd">
      <div className="search-bar-md max-md:search-bar-maxmd">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="상품검색"
            value={tempSearchText}
            onChange={e => setTempSearchText(e.target.value)}
            className="outline-none w-450 pr-2 max-md:w-full max-md:bg-transparent"
          />
        </form>
        {tempSearchText.length ? (
          <button onClick={() => setTempSearchText('')}>
            <svg className="" xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 2048 2048">
              <path
                fill="currentColor"
                d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
              />
            </svg>
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
});

const SelectedFilters = ({ categoriesState, pricesState, handleCategoryChange, handlePriceChange }) => {
  return (
    <>
      {Object.keys(categoriesState)
        .filter(key => categoriesState[key].checked)
        .map(key => (
          <div className="flex space-x-1 items-center text-sm p-1" key={key}>
            <div className="flex text-gray-700">{categoriesState[key]?.option}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              onClick={() => handleCategoryChange(key, false)}
            >
              <path
                fill="currentColor"
                d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
              />
            </svg>
          </div>
        ))}
      {Object.keys(pricesState)
        .filter(key => pricesState[key].checked)
        .map(key => (
          <div className="flex space-x-1 items-center text-sm p-1" key={key}>
            <div className="flex text-gray-700">{pricesState[key].option}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              onClick={() => handlePriceChange(key, false)}
            >
              <path
                fill="currentColor"
                d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
              />
            </svg>
          </div>
        ))}
    </>
  );
};

export default function RenderShop() {
  const params = useSearchParams();
  const a = params.get('categories') ? params.get('categories').split(',').map(Number) : [];
  const b = params.get('prices') ? params.get('prices').split(',').map(Number) : [];
  const c = params.get('keyword') ? params.get('keyword') : '';
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState(c);
  const [categoriesState, setCategoriesState] = useState({
    1: { option: '키보드', checked: false },
    10: { option: '하우징', checked: false, parentId: 1 },
    11: { option: '스위치', checked: false, parentId: 1 },
    12: { option: '보강판', checked: false, parentId: 1 },
    13: { option: '아티산', checked: false, parentId: 1 },
    14: { option: '키캡', checked: false, parentId: 1 },
    15: { option: 'PCB', checked: false, parentId: 1 },
    19: { option: '기타', checked: false, parentId: 1 },
    2: { option: '마우스', checked: false },
    29: { option: '기타', checked: false, parentId: 2 },
    3: { option: '기타', checked: false },
  });
  const [pricesState, setPricesState] = useState({
    1: { option: '5만원 이하', checked: false },
    2: { option: '5 - 10만원', checked: false },
    3: { option: '10 - 30만원', checked: false },
    4: { option: '30 - 50만원', checked: false },
    5: { option: '50만원 이상', checked: false },
  });
  // const [queryString, setQueryString] = useState(window.location.search.substring(1));
  const [queryString, setQueryString] = useState('');

  const innerContainerRef = useRef(null);
  const filterRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // queryString을 URL에서 설정
    setQueryString(window.location.search.substring(1));
  }, []);

  useEffect(() => {
    const updateStateFromParams = () => {
      const newCategoriesState = { ...categoriesState };
      const newPricesState = { ...pricesState };

      Object.keys(newCategoriesState).forEach(key => {
        newCategoriesState[key].checked = false;
      });
      Object.keys(newPricesState).forEach(key => {
        newPricesState[key].checked = false;
      });
      if (a.length > 0) {
        a.forEach(e => {
          newCategoriesState[e].checked = true;
        });
      }

      if (b.length > 0) {
        b.forEach(e => {
          newPricesState[e].checked = true;
        });
      }
      setCategoriesState(newCategoriesState);
      setPricesState(newPricesState);
      // const { data, error, isLoading } = useProducts(window.location.search.substring(1));
      // setQueryString(window.location.search.substring(1));
    };
    updateStateFromParams();
  }, [params]);

  const useProducts = queryString => {
    return useQuery({
      queryKey: ['products', queryString],
      queryFn: () => getProducts(queryString), //함수 참조를 전달해야함
      // staleTime: 1000 * 60,
    });
  };

  const { data, error, isLoading } = useProducts(queryString);

  const createQueryString = useCallback(() => {
    const categoryQuery = Object.keys(categoriesState)
      .filter(key => categoriesState[key].checked)
      .join(',');

    const priceQuery = Object.keys(pricesState)
      .filter(key => pricesState[key].checked)
      .join(',');

    const queryParams = [];
    if (searchText.length) queryParams.push(`keyword=${searchText}`);
    if (categoryQuery) queryParams.push(`categories=${categoryQuery}`);
    if (priceQuery) queryParams.push(`prices=${priceQuery}`);

    return queryParams.join('&');
  }, [categoriesState, pricesState, searchText]);

  const debounceSetQueryString = useCallback(debounce(setQueryString, 500), []);

  useEffect(() => {
    debounceSetQueryString(createQueryString());
  }, [debounceSetQueryString, createQueryString]);

  useEffect(() => {
    if (queryString.length) router.push(`/shop?${queryString}`);
    else router.push('/shop');
  }, [queryString]);

  const handleCategoryChange = (id, checked) => {
    const newState = { ...categoriesState };
    const updateParentCategory = cId => {
      const pId = categoriesState[cId].parentId;
      if (pId && categoriesState[pId].checked) {
        newState[pId].checked = false;
      }
    };
    newState[id].checked = checked;
    if (checked) {
      updateParentCategory(id);
    }
    setCategoriesState(newState);
  };

  const handlePriceChange = (id, checked) => {
    const newState = { ...pricesState };
    newState[id].checked = checked;
    setPricesState(newState);
  };

  return (
    <div className="flex items-start justify-start">
      <div className="flex flex-col w-full">
        <div className="sticky top-0 flex flex-col z-20 border-b bg-white">
          <SearchBar c={c} setSearchText={setSearchText} />
          {/* <div className="search-bar-container-md  max-md:search-bar-container-maxmd">
            <div className="search-bar-md max-md:search-bar-maxmd">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="상품검색"
                  value={tempSearchText}
                  onChange={e => setTempSearchText(e.target.value)}
                  className="outline-none w-450 pr-2 max-md:w-full max-md:bg-transparent"
                />
              </form>
              {tempSearchText.length ? (
                <button onClick={() => setTempSearchText('')}>
                  <svg
                    className=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.7em"
                    height="0.7em"
                    viewBox="0 0 2048 2048"
                  >
                    <path
                      fill="currentColor"
                      d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                    />
                  </svg>
                </button>
              ) : (
                ''
              )}
            </div>
          </div> */}
          <div className="flex justify-end items-end w-full px-10 pb-1 pt-6 max-w-screen-xl mx-auto max-md:justify-between max-md:p-2 max-md:pt-0">
            <div className="flex items-center md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                onClick={() => setFilterActive(true)}
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="1.5"
                  d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"
                />
              </svg>
            </div>
            <div className="flex flex-1 flex-wrap pr-2 items-center gap-x-1 max-md:hidden">
              <SelectedFilters
                categoriesState={categoriesState}
                pricesState={pricesState}
                handleCategoryChange={handleCategoryChange}
                handlePriceChange={handlePriceChange}
              />
              {/* {Object.keys(categoriesState)
                .filter(key => categoriesState[key].checked)
                .map(key => (
                  <div className="flex space-x-1 items-center text-sm p-1" key={key}>
                    <div className="flex text-gray-700">{categoriesState[key]?.option}</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      onClick={() => handleCategoryChange(key, false)}
                    >
                      <path
                        fill="currentColor"
                        d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
                      />
                    </svg>
                  </div>
                ))}
              {Object.keys(pricesState)
                .filter(key => pricesState[key].checked)
                .map(key => (
                  <div className="flex space-x-1 items-center text-sm p-1" key={key}>
                    <div className="flex text-gray-700">{pricesState[key].option}</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      onClick={() => handlePriceChange(key, false)}
                    >
                      <path
                        fill="currentColor"
                        d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
                      />
                    </svg>
                  </div>
                ))} */}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-1 px-2 md:hidden">
            <SelectedFilters
              categoriesState={categoriesState}
              pricesState={pricesState}
              handleCategoryChange={handleCategoryChange}
              handlePriceChange={handlePriceChange}
            />
            {/* {Object.keys(categoriesState)
              .filter(key => categoriesState[key].checked)
              .map(key => (
                <div className="flex space-x-1 items-center text-sm p-1" key={key}>
                  <div className="flex text-gray-700">{categoriesState[key]?.option}</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                    onClick={() => handleCategoryChange(key, false)}
                  >
                    <path
                      fill="currentColor"
                      d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
                    />
                  </svg>
                </div>
              ))}
            {Object.keys(pricesState)
              .filter(key => pricesState[key].checked)
              .map(key => (
                <div className="flex space-x-1 items-center text-sm p-1" key={key}>
                  <div className="flex text-gray-700">{pricesState[key].option}</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                    onClick={() => handlePriceChange(key, false)}
                  >
                    <path
                      fill="currentColor"
                      d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
                    />
                  </svg>
                </div>
              ))} */}
          </div>
        </div>
        <div className="flex items-start w-full px-10 max-w-screen-xl mx-auto max-md:overflow-auto max-md:px-2">
          <div
            className={`${
              filterActive ? 'flex' : 'hidden'
            }  sticky w-44 space-y-5 z-30 top-52 flex-col h-full overflow-y-auto bg-white md:flex max-md:fixed max-md:top-0 max-md:pt-20 max-md:left-0 max-md:mt-0  max-md:border-r max-md:pl-4 max-md:pb-28`}
            ref={filterRef}
          >
            <div className="md:hidden fixed top-20 left-36 flex justify-end z-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 2048 2048"
                onClick={() => {
                  setFilterActive(false);
                }}
              >
                <path
                  fill="currentColor"
                  d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                />
              </svg>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="">
                <div className="mb-1">카테고리</div>
                {categories.map(category => (
                  <div key={category.id}>
                    <label className="flex items-center space-x-1 p-1 max-md:m-1">
                      <input
                        className="accent-black"
                        type="checkbox"
                        checked={categoriesState[category.id]?.checked || false}
                        onChange={e => {
                          handleCategoryChange(category.id, e.target.checked);
                        }}
                      />
                      <div>{category.option}</div>
                    </label>
                    {categoriesState[category.id] &&
                      (category.subCategories?.some(sub => categoriesState[sub.id]?.checked) ||
                        categoriesState[category.id].checked) &&
                      category.subCategories?.map(sub => (
                        <div key={sub.id}>
                          <label className="flex items-center space-x-1 ml-3 p-1 max-md:my-1">
                            <input
                              className="accent-black"
                              type="checkbox"
                              checked={categoriesState[sub.id]?.checked || false}
                              onChange={e => {
                                handleCategoryChange(sub.id, e.target.checked);
                              }}
                            />
                            <div>{sub.option}</div>
                          </label>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-1">가격</div>
                {prices.map(price => (
                  <div key={price.id}>
                    <label className="flex items-center space-x-1 p-1 max-md:m-1">
                      <input
                        className="accent-black"
                        type="checkbox"
                        checked={pricesState[price.id]?.checked || false}
                        onChange={e => {
                          handlePriceChange(price.id, e.target.checked);
                        }}
                      />
                      <div>{price.option}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center w-full " ref={innerContainerRef}>
            <div className={`grid grid-cols-4 gap-2 py-2 w-full overflow-auto scrollbar-hide max-md:grid-cols-2`}>
              {data?.length ? (
                data.map((product, idx) => (
                  <div
                    className="flex flex-col hover:bg-gray-100 cursor-pointer"
                    key={idx}
                    onClick={() => {
                      router.push(`/shop/product/${product._id}`);
                    }}
                  >
                    <div className="w-full aspect-square relative min-h-32 min-w-32">
                      <div className="absolute top-1 right-1 z-10">
                        <svg
                          className="w-7 h-7  max-md:w-5 max-md:h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 32 32"
                          onClick={e => {
                            handleBookMarkClick(e, product._id);
                          }}
                        >
                          <path
                            stroke="black"
                            fill="white"
                            // fill={bookmarked.includes(product._id) ? 'black' : 'white'}
                            d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
                          />
                        </svg>
                      </div>
                      <Image
                        className="rounded object-cover"
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(max-width:768px) 50vw, (max-width:1300px) 20vw , 256px"
                      />
                    </div>
                    <div className="py-1">
                      <div className="text-lg break-all overflow-hidden line-clamp-2">{product.title}</div>
                      <div className="space-x-1 font-semibold">
                        <span>{product.price.toLocaleString()}</span>
                        <span className="text-sm">원</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className=""></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
