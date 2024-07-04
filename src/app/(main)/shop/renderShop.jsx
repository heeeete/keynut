'use client';

import React, { useState, useRef, useEffect, useCallback, Fragment, useLayoutEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getProducts from './_lib/getProducts';
import { useInView } from 'react-intersection-observer';
import debounce from '../../../utils/debounce';
import Link from 'next/link';

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
    id: 9,
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

const conditions = {
  1: { option: '미사용' },
  2: { option: '사용감 없음' },
  3: { option: '사용감 적음' },
  4: { option: '사용감 많음' },
  5: { option: '고장 / 파손' },
};

const SearchBar = React.memo(({ paramsKeyword, setSearchText, searchFlag }) => {
  const [tempSearchText, setTempSearchText] = useState(paramsKeyword);

  useEffect(() => {
    setTempSearchText(paramsKeyword);
  }, [paramsKeyword]);

  const handleSearch = e => {
    e.preventDefault();
    searchFlag.current = false;
    setSearchText(tempSearchText);
  };
  return (
    <div className="search-bar-container-md  max-md:search-bar-container-maxmd">
      <div className="search-bar-md max-md:search-bar-maxmd">
        <form className="flex w-450 items-center" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="상품검색"
            value={tempSearchText}
            onChange={e => setTempSearchText(e.target.value)}
            className="outline-none w-full pr-2 max-md:w-full max-md:bg-transparent"
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
          <div className="flex space-x-1 items-center text-sm p-1 bg-blue-50 rounded max-md:text-xs" key={key}>
            <div className="flex text-gray-500">{categoriesState[key]?.option}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              onClick={() => handleCategoryChange(key, false)}
            >
              <path
                fill="gray"
                d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
              />
            </svg>
          </div>
        ))}
      {Object.keys(pricesState)
        .filter(key => pricesState[key].checked)
        .map(key => (
          <div className="flex space-x-1 items-center text-sm p-1  bg-blue-50 rounded  max-md:text-xs" key={key}>
            <div className="flex text-gray-500">{pricesState[key].option}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
              onClick={() => handlePriceChange(key, false)}
            >
              <path
                fill="gray"
                d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
              />
            </svg>
          </div>
        ))}
    </>
  );
};

const RenderProducts = React.memo(({ params }) => {
  const initialQueryString = () => {
    let query = '';
    if (params.get('keyword')) {
      query += 'keyword=' + encodeURIComponent(params.get('keyword'));
    }
    if (params.get('categories')) {
      if (query.length > 0) query += '&';
      query += 'categories=' + params.get('categories');
    }
    if (params.get('prices')) {
      if (query.length > 0) query += '&';
      query += 'prices=' + params.get('prices');
    }
    return query;
  };
  const router = useRouter();
  const useProducts = queryString => {
    return useInfiniteQuery({
      queryKey: ['products', queryString],
      queryFn: ({ pageParam }) => getProducts(queryString, pageParam),
      initialPageParam: 0, //[1,2,3,4,5] [6,7,8,9,10] [11,12,13,14,15] -> 데이터를 페이지별로 관리 , 이차원 배열
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return lastPage[lastPage.length - 1]._id; // `_id` 기준으로 페이징
      },
    });
  };

  const { ref, inView } = useInView({ threshold: 0, delay: 0 });
  const { data, fetchNextPage, hasNextPage, isFetching, error, isLoading } = useProducts(initialQueryString());

  useEffect(() => {
    const scrollPos = Number(sessionStorage.getItem('scrollPos'));
    sessionStorage.removeItem('scrollPos');
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 100);
  }, []);

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const onClickProduct = (e, id) => {
    e.preventDefault();
    // const target = e.currentTarget;
    // target.style.backgroundColor = 'lightgray';
    // setTimeout(e => {
    //   target.style.backgroundColor = 'white';
    // }, 100);
    sessionStorage.setItem('scrollPos', window.scrollY);
    router.push(`/shop/product/${id}`);
  };

  return (
    <>
      <div className={`grid grid-cols-4 gap-2 py-2 w-full overflow-auto scrollbar-hide max-md:grid-cols-2 max-md:px-2`}>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((product, idx) => (
              <Link
                href={``}
                onClick={e => onClickProduct(e, product._id)}
                className="flex flex-col cursor-pointer relative rounded"
                key={product._id}
              >
                <div className="w-full relative aspect-square min-h-32 min-w-32 bg-gray-50">
                  <Image
                    className="rounded object-cover"
                    src={product.images.length ? product.images[0] : '/키보드1.webp'}
                    alt={product.title}
                    fill
                    sizes="(max-width:768px) 60vw, (max-width:1300px) 20vw , 500px"
                  />
                  <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white max-md:text-xxs">
                    {conditions[product.condition].option}
                  </div>
                  {product.images.length !== 1 && (
                    <svg
                      className="absolute right-1 top-1 opacity-90 max-md:w-7"
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="white"
                        d="M6.085 4H5.05A2.5 2.5 0 0 1 7.5 2H14a4 4 0 0 1 4 4v6.5a2.5 2.5 0 0 1-2 2.45v-1.035a1.5 1.5 0 0 0 1-1.415V6a3 3 0 0 0-3-3H7.5a1.5 1.5 0 0 0-1.415 1M2 7.5A2.5 2.5 0 0 1 4.5 5h8A2.5 2.5 0 0 1 15 7.5v8a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 2 15.5z"
                      />
                    </svg>
                  )}
                </div>
                <div className=" flex flex-col py-1 max-md:text-sm justify-center h-14">
                  <div className="break-all overflow-hidden line-clamp-1">{product.title}</div>
                  <div className="space-x-1 font-semibold break-all line-clamp-1">
                    <span className="">{product.price.toLocaleString()}</span>
                    <span className="text-sm">원</span>
                  </div>
                </div>
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="h-12 -translate-y-96" ref={ref}></div>
      {isFetching ? (
        <div className="flex w-full items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24">
            <path
              fill="#a599ff"
              d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
              opacity="0.5"
            />
            <path fill="#a599ff" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
              <animateTransform
                attributeName="transform"
                dur="1.5s"
                from="0 12 12"
                repeatCount="indefinite"
                to="360 12 12"
                type="rotate"
              />
            </path>
          </svg>
        </div>
      ) : (
        ''
      )}
    </>
  );
});

const RenderPopularProducts = React.memo(({ data, category, router }) => {
  let categoryTitle =
    category === 0 ? '전체' : category === 1 ? '키보드' : category === 2 ? '마우스' : category === 9 ? '기타' : '';
  return (
    <div className="border-x-2 border-b-2 bg-gray-100 px-2 max-md:border-0 max-md:border-b">
      <p className="z-30 py-2 font-semibold">{categoryTitle} 인기 매물</p>
      <div className="grid grid-cols-6 gap-2 pb-2 w-full max-md:flex overflow-x-scroll scrollbar-hide">
        {data?.length ? (
          data.map((product, idx) => (
            <Link
              href={`/shop/product/${product._id}`}
              className="flex flex-col  cursor-pointer max-md:min-w-28 max-md:w-36"
              key={idx}
            >
              <div className="w-full aspect-square relative min-h-20 min-w-20 bg-gray-100">
                <Image
                  className="rounded object-cover"
                  src={product.images.length ? product.images[0] : '/키보드4.png'}
                  alt={product.title}
                  fill
                  sizes="(max-width:768px) 50vw, (max-width:1300px) 20vw , 240px"
                />
                <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white max-md:text-xxs">
                  {conditions[product.condition].option}
                </div>
              </div>
              <div className=" flex flex-col py-1 max-md:text-sm justify-center h-14">
                <div className="break-all overflow-hidden line-clamp-1">{product.title}</div>
                <div className="space-x-1 font-semibold break-all line-clamp-1">
                  <span className="">{product.price.toLocaleString()}</span>
                  <span className="text-sm">원</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );
});

const fetchHotProducts = async category => {
  const url = category ? `api/products/hot?category=${category}` : 'api/products/hot';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function RenderShop() {
  const router = useRouter();
  const params = useSearchParams();
  const paramsCategories = params.get('categories') ? params.get('categories').split(',').map(Number) : [];
  const paramsPrices = params.get('prices') ? params.get('prices').split(',').map(Number) : [];
  const paramsKeyword = params.get('keyword') ? params.get('keyword') : '';
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState(paramsKeyword);
  const [categoriesState, setCategoriesState] = useState({
    1: { option: '키보드', checked: false, childId: [10, 11, 12, 13, 14, 15, 19] },
    10: { option: '하우징', checked: false, parentId: 1 },
    11: { option: '스위치', checked: false, parentId: 1 },
    12: { option: '보강판', checked: false, parentId: 1 },
    13: { option: '아티산', checked: false, parentId: 1 },
    14: { option: '키캡', checked: false, parentId: 1 },
    15: { option: 'PCB', checked: false, parentId: 1 },
    19: { option: '기타', checked: false, parentId: 1 },
    2: { option: '마우스', checked: false, childId: [29] },
    29: { option: '기타', checked: false, parentId: 2 },
    9: { option: '기타', checked: false },
  });
  const [pricesState, setPricesState] = useState({
    1: { option: '5만원 이하', checked: false },
    2: { option: '5 - 10만원', checked: false },
    3: { option: '10 - 30만원', checked: false },
    4: { option: '30 - 50만원', checked: false },
    5: { option: '50만원 이상', checked: false },
  });
  const hotProductFlag = useRef(0);
  const searchFlag = useRef(true);
  const obj = {};
  // const b = new URLSearchParams(params.toString());
  // b.set('category', 3);
  // router.push(`/shop?${b.toString()}`);

  const initialQueryString = () => {
    let query = '';
    if (paramsKeyword.length) {
      query += 'keyword=' + encodeURIComponent(paramsKeyword);
    }
    if (paramsCategories.length) {
      if (query.length > 0) query += '&';
      query += 'categories=' + paramsCategories;
    }
    if (paramsPrices.length) {
      if (query.length > 0) query += '&';
      query += 'prices=' + paramsPrices;
    }
    return query;
  };

  const [queryString, setQueryString] = useState(initialQueryString());
  const innerContainerRef = useRef(null);
  const filterRef = useRef(null);

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
      if (paramsCategories.length > 0) {
        paramsCategories.forEach(e => {
          newCategoriesState[e].checked = true;
        });
      }

      if (paramsPrices.length > 0) {
        paramsPrices.forEach(e => {
          newPricesState[e].checked = true;
        });
      }
      setCategoriesState(newCategoriesState);
      setPricesState(newPricesState);
      setSearchText(paramsKeyword);
    };
    updateStateFromParams();
  }, [params]);

  const createQueryString = useCallback(() => {
    const categoryQuery = Object.keys(categoriesState)
      .filter(key => categoriesState[key].checked)
      .join(',');

    const priceQuery = Object.keys(pricesState)
      .filter(key => pricesState[key].checked)
      .join(',');

    const queryParams = [];
    if (searchText.length) queryParams.push(`keyword=${encodeURIComponent(searchText)}`);
    if (categoryQuery) queryParams.push(`categories=${categoryQuery}`);
    if (priceQuery) queryParams.push(`prices=${priceQuery}`);

    return queryParams.join('&');
  }, [categoriesState, pricesState, searchText]);

  const debounceSetQueryString = useCallback(debounce(setQueryString, 1000), []);

  useEffect(() => {
    if (searchFlag.current) debounceSetQueryString(createQueryString());
    else setQueryString(createQueryString());
  }, [debounceSetQueryString, createQueryString]);

  useEffect(() => {
    if (queryString.length) router.push(`/shop?${queryString}`);
    else router.push('/shop');
  }, [queryString]);

  const handleCategoryChange = (id, checked) => {
    searchFlag.current = true;
    const newState = { ...categoriesState };
    const updateParentCategory = cId => {
      const pId = categoriesState[cId].parentId;
      const childId = categoriesState[cId].childId;
      if (pId && categoriesState[pId].checked) {
        newState[pId].checked = false;
      }
      if (childId) {
        for (let i of childId) newState[i].checked = false;
      }
    };
    newState[id].checked = checked;
    if (checked) {
      updateParentCategory(id);
    }
    setCategoriesState(newState);
  };

  const handlePriceChange = (id, checked) => {
    searchFlag.current = true;
    const newState = { ...pricesState };
    newState[id].checked = checked;
    setPricesState(newState);
  };

  const categoriesCheck = () => {
    paramsCategories.map(c => {
      if (c >= 10) {
        obj[~~(c / 10)] = true;
      } else {
        obj[c] = true;
      }
    });
  };

  useEffect(() => {
    categoriesCheck();
  }, [paramsCategories]);

  useEffect(() => {
    if (Object.keys(obj).length > 1) hotProductFlag.current = -1;
    else if (Object.keys(obj).length === 1) hotProductFlag.current = Number(Object.keys(obj)[0]);
    else hotProductFlag.current = 0;
  }, [obj]);

  const useHotProducts = category => {
    // console.log(category);
    return useQuery({
      queryKey: ['topProducts', category],
      queryFn: () => fetchHotProducts(category),
      staleTime: 60 * 60 * 1000, // 1시간
      cacheTime: 70 * 60 * 1000,
      enabled: !paramsKeyword && (category === 1 || category === 2 || category === 9 || category === 0),
    });
  };

  const { data: top, error, isLoading } = useHotProducts(hotProductFlag.current);

  return (
    <div className="flex items-start justify-start ">
      <div className="flex flex-col w-full">
        <div className="sticky top-0 flex flex-col z-20 border-b bg-white">
          <SearchBar paramsKeyword={paramsKeyword} setSearchText={setSearchText} searchFlag={searchFlag} />
          <div className="flex justify-end items-end w-full px-10 pb-1 pt-6 max-w-screen-xl mx-auto max-md:justify-between max-md:px-2 max-md:pt-0">
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
            <div className="flex flex-1 flex-wrap pr-2 items-center gap-2 max-md:hidden">
              <SelectedFilters
                categoriesState={categoriesState}
                pricesState={pricesState}
                handleCategoryChange={handleCategoryChange}
                handlePriceChange={handlePriceChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-2 pb-2 md:hidden">
            <SelectedFilters
              categoriesState={categoriesState}
              pricesState={pricesState}
              handleCategoryChange={handleCategoryChange}
              handlePriceChange={handlePriceChange}
            />
          </div>
        </div>
        <div className="flex items-start w-full px-10 max-w-screen-xl mx-auto max-md:overflow-auto max-md:px-0">
          <div
            className={`${
              filterActive ? 'flex' : 'hidden'
            }  sticky w-44 space-y-5 z-30 top-52 flex-col h-full overflow-y-auto bg-white md:flex max-md:fixed max-md:top-0 max-md:pt-20 max-md:left-0 max-md:mt-0  max-md:border-r max-md:pb-28`}
            ref={filterRef}
          >
            <div className="md:hidden fixed top-16 left-36 flex justify-end z-30">
              <svg
                stroke="gray"
                strokeWidth={30}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 2048 2048"
                onClick={() => {
                  setFilterActive(false);
                }}
              >
                <path
                  fill="gray"
                  d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                />
              </svg>
            </div>
            <div className="flex flex-col space-y-4 max-md:pl-2">
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
            {!paramsKeyword && top && top.length ? (
              <RenderPopularProducts data={top} category={hotProductFlag.current} router={router} />
            ) : (
              ''
            )}
            <RenderProducts params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}
