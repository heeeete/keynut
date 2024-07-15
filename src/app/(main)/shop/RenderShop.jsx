'use client';

import React, { useState, useRef, useEffect, useCallback, Fragment, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import getProducts from './_lib/getProducts';
import { useInView } from 'react-intersection-observer';
import debounce from '../../../utils/debounce';
import Link from 'next/link';
import fetchHotProducts from './_lib/fetchHotProducts';
import onClickProduct from '@/utils/onClickProduct';
import { isMobile } from '@/lib/isMobile';

const categories = [
  {
    id: 1,
    option: '키보드',
    subCategories: [
      { id: 10, option: '커스텀' },
      { id: 11, option: '기성품' },
      { id: 12, option: '스위치' },
      { id: 13, option: '보강판' },
      { id: 14, option: '아티산' },
      { id: 15, option: '키캡' },
      { id: 16, option: 'PCB' },
      { id: 19, option: '기타' },
    ],
  },
  {
    id: 2,
    option: '마우스',
    subCategories: [
      { id: 20, option: '완제품' },
      { id: 21, option: '마우스피트' },
      { id: 22, option: '그립테이프' },
      { id: 23, option: 'PCB' },
      { id: 29, option: '기타' },
    ],
  },
  {
    id: 3,
    option: '패드',
    subCategories: [
      { id: 30, option: '마우스패드' },
      { id: 31, option: '장패드' },
      { id: 39, option: '기타' },
    ],
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

const RecentSearch = React.memo(
  ({ recentSearches, setSearchText, setRecentSearches, inputRef, searchFlag, setIsFocused }) => {
    const handleRecentSearch = search => {
      searchFlag.current = false;
      const newRecentSearches = [search, ...recentSearches.filter(item => item !== search)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      setSearchText(search);
      setIsFocused(false);
      inputRef.current.blur();
    };

    const deleteRecentSearch = search => {
      const newRecentSearches = [...recentSearches.filter(item => item !== search)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    };
    return (
      <ul className=" w-full flex-1">
        {recentSearches.length ? (
          recentSearches.map((search, index) => (
            <li
              key={index}
              className="flex items-center cursor-pointer justify-between py-2 min-w-9"
              onClick={() => {
                handleRecentSearch(search);
              }}
            >
              <p className="break-all line-clamp-1 pr-3">{search}</p>
              <svg
                onClick={e => {
                  e.stopPropagation();
                  deleteRecentSearch(search);
                }}
                className="min-w-10"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 2048 2048"
              >
                <path
                  fill="currentColor"
                  d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                />
              </svg>
            </li>
          ))
        ) : (
          <p className="text-gray-400">최근 검색어가 없습니다</p>
        )}
      </ul>
    );
  },
);

const SearchBar = React.memo(({ paramsKeyword, setSearchText, searchFlag }) => {
  const [tempSearchText, setTempSearchText] = useState(paramsKeyword);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const recentRef = useRef(null);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
    const handleClickOutside = event => {
      if (inputRef.current && !recentRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.top <= 5) {
          setIsFocused(false);
          if (inputRef.current) inputRef.current.blur();
        }
      },
      {
        //실제로 요소의 상단이 뷰포트 상단보다 100픽셀 더 아래에 있을 때 교차로 인식
        rootMargin: '-100px',
        threshold: 0, // 요소의 0%가 보일 때 콜백이 호출됨
      },
    );

    if (recentRef.current) {
      observer.observe(recentRef.current);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (recentRef.current) {
        observer.unobserve(recentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTempSearchText(paramsKeyword);
  }, [paramsKeyword]);

  const handleSearch = e => {
    e.preventDefault();
    searchFlag.current = false;
    if (tempSearchText.trim() !== '') {
      const newRecentSearches = [tempSearchText, ...recentSearches.filter(item => item !== tempSearchText)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
    setSearchText(tempSearchText.trim());
    setIsFocused(false);
    inputRef.current.blur();
  };
  const deleteAllRecentSearch = () => {
    setRecentSearches([]);
    localStorage.setItem('recentSearches', JSON.stringify([]));
  };
  return (
    <div className="search-bar-container-md  max-md:search-bar-container-maxmd flex-col" ref={recentRef}>
      <div className="max-md:search-bar-maxmd max-md:px">
        <div className="search-bar-md max-md:search-bar-maxmd">
          <form className="flex w-450 max-md:w-full items-center" onSubmit={handleSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder="상품검색"
              value={tempSearchText}
              onFocus={() => {
                setIsFocused(true);
              }}
              onChange={e => setTempSearchText(e.target.value)}
              className="outline-none w-full  pr-2  max-md:bg-transparent"
            />
          </form>
          {tempSearchText.length ? (
            <button
              onClick={() => {
                setTempSearchText('');
                inputRef.current.focus();
              }}
            >
              <svg
                className="max-md:mr-1"
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
        {isFocused && tempSearchText === '' ? (
          <div className="flex flex-col absolute min-h-32 bg-white w-450 top-20 left-1/2 -translate-x-1/2 p-2 rounded-sm border max-md:w-full max-md:border-0 max-md:border-b max-md:translate-x-0  max-md:top-14 max-md:left-0">
            <p className="border-b">최근 검색어</p>
            <RecentSearch
              recentSearches={recentSearches}
              setTempSearchText={setTempSearchText}
              setSearchText={setSearchText}
              setRecentSearches={setRecentSearches}
              inputRef={inputRef}
              searchFlag={searchFlag}
              setIsFocused={setIsFocused}
            />
            <div className="flex  space-x-2 justify-end text-gray-400 text-sm">
              <button
                className="p-1"
                onClick={() => {
                  deleteAllRecentSearch();
                }}
              >
                전체 삭제
              </button>
              <button
                className="p-1"
                onClick={() => {
                  setIsFocused(false);
                }}
              >
                닫기
              </button>
            </div>
          </div>
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
          <div
            className="flex space-x-1 items-center text-sm p-1 rounded md:bg-blue-50 max-md:flex-nowrap max-md:whitespace-nowrap max-md:text-xs max-md:bg-white"
            key={key}
          >
            <div className="flex md:text-gray-500 max-md:text-black max-md:font-semibold">
              {categoriesState[key]?.option}
            </div>
            <div className="cursor-pointer" onClick={() => handleCategoryChange(key, false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
                <path
                  fill="gray"
                  d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
                />
              </svg>
            </div>
          </div>
        ))}
      {Object.keys(pricesState)
        .filter(key => pricesState[key].checked)
        .map(key => (
          <div
            className="flex space-x-1 items-center text-sm p-1  rounded md:bg-blue-50  max-md:text-xs max-md:flex-nowrap max-md:whitespace-nowrap max-md:bg-white"
            key={key}
          >
            <div className="flex md:text-gray-500  max-md:text-black max-md:font-semibold">
              {pricesState[key].option}
            </div>

            <svg
              className="cursor-pointer"
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

const onClickAllProduct = ({ e, mobile }) => {
  mobile && onClickProduct(e);
  sessionStorage.setItem('scrollPos', window.scrollY);
};

const RenderProducts = React.memo(({ params, mobile }) => {
  const createQueryString = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (params.get('keyword')) queryParams.append('keyword', params.get('keyword'));
    if (params.get('categories')) queryParams.append('categories', params.get('categories'));
    if (params.get('prices')) queryParams.append('prices', params.get('prices'));
    return queryParams.toString();
  }, [params]);

  const queryString = createQueryString();

  const useProducts = queryString => {
    return useInfiniteQuery({
      queryKey: ['products', queryString],
      queryFn: ({ pageParam }) => getProducts(queryString, pageParam),
      initialPageParam: 0, //[1,2,3,4,5] [6,7,8,9,10] [11,12,13,14,15] -> 데이터를 페이지별로 관리 , 이차원 배열
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.products.length === 0) return undefined;
        return lastPage.products[lastPage.products.length - 1]._id; // `_id` 기준으로 페이징
      },
      staleTime: Infinity,
    });
  };

  const { ref, inView } = useInView({ threshold: 0, delay: 0, rootMargin: '500px' });
  const { data, fetchNextPage, hasNextPage, isFetching, error, isLoading } = useProducts(queryString);

  const total = data?.pages[0]?.total;
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

  return (
    <>
      <div className="flex max-md:px-3 max-md:py-1 max-md:text-sm">
        <p className="font-semibold">{total}</p>개의 검색 결과
      </div>
      <div
        className={`grid grid-cols-4 gap-2 py-2 w-full overflow-auto scrollbar-hide max-md:grid-cols-2 max-md:px-3 max-md:pt-1`}
      >
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.products.map((product, idx) => (
              <div className="flex flex-col cursor-pointer relative rounded" key={product._id}>
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
                <Link
                  href={`/shop/product/${product._id}`}
                  className="absolute top-0 left-0 w-full h-full rounded"
                  onClick={e => onClickAllProduct(e, mobile)}
                ></Link>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="h-12" ref={ref}></div>
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

const RenderPopularProducts = React.memo(({ data, category, mobile }) => {
  let categoryTitle =
    category === 0 ? '전체' : category === 1 ? '키보드' : category === 2 ? '마우스' : category === 9 ? '기타' : '';
  return (
    <div className="px-2 md:bg-gray-100 max-md:border-0 max-md:border-b-8 max-md:px-3">
      <p className="z-30 py-2 font-semibold">{categoryTitle} 인기 매물</p>
      <div className="grid grid-cols-6 gap-2 pb-2 w-full max-md:flex overflow-x-scroll scrollbar-hide">
        {data?.length ? (
          data.map((product, idx) => (
            <div className="flex flex-col  cursor-pointer relative max-md:min-w-28 max-md:w-36" key={idx}>
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
              <Link
                href={`/shop/product/${product._id}`}
                onClick={e => mobile && onClickProduct(e)}
                className="absolute left-0 right-0 w-full h-full rounded"
              ></Link>
            </div>
          ))
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );
});

export default function RenderShop() {
  const router = useRouter();
  const params = useSearchParams();
  const paramsCategories = params.get('categories') ? params.get('categories').split(',').map(Number) : [];
  const paramsPrices = params.get('prices') ? params.get('prices').split(',').map(Number) : [];
  const paramsKeyword = params.get('keyword') ? params.get('keyword') : '';
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState(paramsKeyword);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [isMaxmd, setIsMaxmd] = useState(true);
  const pageRef = useRef(null);

  const [categoriesState, setCategoriesState] = useState({
    1: { option: '키보드', checked: false, childId: [10, 11, 12, 13, 14, 15, 16, 19] },
    10: { option: '커스텀', checked: false, parentId: 1 },
    11: { option: '기성품', checked: false, parentId: 1 },
    12: { option: '스위치', checked: false, parentId: 1 },
    13: { option: '보강판', checked: false, parentId: 1 },
    14: { option: '아티산', checked: false, parentId: 1 },
    15: { option: '키캡', checked: false, parentId: 1 },
    16: { option: 'PCB', checked: false, parentId: 1 },
    19: { option: '키보드-기타', checked: false, parentId: 1 },
    2: { option: '마우스', checked: false, childId: [20, 21, 22, 23, 29] },
    20: { option: '완제품', checked: false, parentId: 2 },
    21: { option: '마우스피트', checked: false, parentId: 2 },
    22: { option: '그립테이프', checked: false, parentId: 2 },
    23: { option: 'PCB', checked: false, parentId: 2 },
    29: { option: '마우스-기타', checked: false, parentId: 2 },
    3: { option: '패드', checked: false, childId: [30, 31, 39] },
    30: { option: '마우스패드', checked: false, parentId: 3 },
    31: { option: '장패드', checked: false, parentId: 3 },
    39: { option: '패드-기타', checked: false, parentId: 3 },
    9: { option: '기타', checked: false },
  });
  const [pricesState, setPricesState] = useState({
    1: { option: '5만원 이하', checked: false },
    2: { option: '5 - 10만원', checked: false },
    3: { option: '10 - 30만원', checked: false },
    4: { option: '30 - 50만원', checked: false },
    5: { option: '50만원 이상', checked: false },
  });

  const [queryString, setQueryString] = useState(() => {
    const queryParams = new URLSearchParams();
    if (paramsKeyword.length) queryParams.append('keyword', paramsKeyword);
    if (paramsCategories.length) queryParams.append('categories', paramsCategories);
    if (paramsPrices.length) queryParams.append('prices', paramsPrices);
    return queryParams.toString();
  });

  const mobile = isMobile();
  const hotProductFlag = useRef(0);
  const currPosY = useRef(0);
  const searchFlag = useRef(true);
  const obj = {};

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (filterActive) {
      // 현재 스크롤 위치 저장
      currPosY.current = window.scrollY;

      // 페이지 컨테이너에 스타일 적용
      if (pageRef.current) {
        pageRef.current.style.position = 'fixed';
        pageRef.current.style.top = `-${currPosY.current}px`;
        pageRef.current.style.left = '0';
        pageRef.current.style.right = '0';
        footer.style.visibility = 'hidden';
      }
    } else {
      // 스타일 제거 및 스크롤 위치 복원
      if (pageRef.current) {
        pageRef.current.style.removeProperty('position');
        pageRef.current.style.removeProperty('top');
        pageRef.current.style.removeProperty('left');
        pageRef.current.style.removeProperty('right');
        footer.style.visibility = 'visible';
        window.scrollTo(0, currPosY.current);
      }
    }
  }, [filterActive]);

  useEffect(() => {
    const debounceViewResizing = debounce(e => {
      if (e.target?.innerWidth >= 768) {
        setIsMaxmd(false);
        setFilterActive(false);
      } else {
        if (e >= 768) setIsMaxmd(false);
        else setIsMaxmd(true);
      }
    }, 100);

    // console.log(window);
    debounceViewResizing(window.innerWidth);
    window.addEventListener('resize', debounceViewResizing);
    return () => window.removeEventListener('resize', debounceViewResizing);
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

  useEffect(() => {
    const categoriesCheck = () => {
      paramsCategories.forEach(c => {
        if (c >= 10) {
          obj[Math.floor(c / 10)] = true;
        } else {
          obj[c] = true;
        }
      });
    };
    categoriesCheck();
  }, [paramsCategories]);

  useEffect(() => {
    if (Object.keys(obj).length > 1) hotProductFlag.current = -1;
    else if (Object.keys(obj).length === 1) hotProductFlag.current = Number(Object.keys(obj)[0]);
    else hotProductFlag.current = 0;
  }, [obj]);

  // ======================================================
  const createQueryString = useCallback(() => {
    const categoryQuery = Object.keys(categoriesState)
      .filter(key => categoriesState[key].checked)
      .join(',');
    const priceQuery = Object.keys(pricesState)
      .filter(key => pricesState[key].checked)
      .join(',');
    const queryParams = new URLSearchParams();
    if (searchText.length) queryParams.append('keyword', searchText);
    if (categoryQuery) queryParams.append('categories', categoryQuery);
    if (priceQuery) queryParams.append('prices', priceQuery);
    return queryParams.toString();
  }, [categoriesState, pricesState, searchText]);

  const debounceSetQueryString = useCallback(debounce(setQueryString, 1000), []);
  useEffect(() => {
    if (searchFlag.current && !isMaxmd) debounceSetQueryString(createQueryString());
    else if (!searchFlag.current) setQueryString(createQueryString());
  }, [debounceSetQueryString, createQueryString]);
  // ======================================================

  useEffect(() => {
    if (queryString.length) router.push(`/shop?${queryString}`);
    else router.push('/shop');
  }, [queryString, router]);

  const handleCategoryChange = (id, checked) => {
    searchFlag.current = true;
    const newState = { ...categoriesState };
    newState[id].checked = checked;

    if (newState[id].childId) {
      newState[id].childId.forEach(childId => {
        newState[childId].checked = false;
      });
    }

    if (newState[id].parentId) {
      const parentId = newState[id].parentId;
      newState[parentId].checked = false;
    }

    setCategoriesState(newState);
  };

  const handlePriceChange = (id, checked) => {
    searchFlag.current = true;
    const newState = { ...pricesState };
    newState[id].checked = checked;
    setPricesState(newState);
  };

  const initFilter = () => {
    const newCategoriesState = { ...categoriesState };
    const newPriceState = { ...pricesState };
    paramsCategories.map(id => (newCategoriesState[id].checked = true));
    paramsPrices.map(id => (newPriceState[id].checked = true));
    setCategoriesState(newCategoriesState);
    setPricesState(newPriceState);
  };

  const useHotProducts = category => {
    return useQuery({
      queryKey: ['topProducts', category],
      queryFn: () => fetchHotProducts(category),
      enabled:
        !paramsKeyword && (category === 1 || category === 2 || category === 9 || category === 3 || category === 0),
      staleTime: Infinity,
    });
  };
  const { data: top, error, isLoading } = useHotProducts(hotProductFlag.current);

  return (
    <div className="flex items-start justify-start z-60" ref={pageRef}>
      {isMaxmd ? (
        <>
          <div className="flex flex-col w-full">
            <div className="sticky top-0  border-b flex flex-col z-60 bg-white">
              <SearchBar paramsKeyword={paramsKeyword} setSearchText={setSearchText} searchFlag={searchFlag} />
            </div>
            <div className="flex flex-col justify-center w-full">
              {!paramsKeyword && top && top.length ? (
                <RenderPopularProducts data={top} category={hotProductFlag.current} mobile={mobile} />
              ) : (
                ''
              )}
              <div className="sticky z-50 top-14 bg-white border-b flex w-full max-w-screen-xl mx-auto p-3 items-center">
                <div className="flex flex-1 space-x-2">
                  <button
                    className="flex items-center justify-center py-1 px-2 rounded-xl border border-gray-300 relative"
                    onClick={() => {
                      initFilter();
                      setPriceOpen(true);
                      setCategoryOpen(true);
                      setFilterActive(true);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke="gray"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="1.5"
                        d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"
                      />
                    </svg>
                    {paramsCategories.length + paramsPrices.length ? (
                      <div className="absolute bg-black text-xs font-medium w-4 h-4 flex items-center justify-center rounded-full -right-1 -top-1 text-white">
                        {paramsCategories.length + paramsPrices.length}
                      </div>
                    ) : (
                      ''
                    )}
                  </button>
                  <button
                    className={`flex py-1 px-2 border rounded-2xl text-sm items-center space-x-1 flex-nowrap whitespace-nowrap           ${
                      paramsCategories.length
                        ? 'border-black border-1.5 font-semibold'
                        : 'border-gray-300 text-gray-500'
                    }`}
                    onClick={() => {
                      initFilter();
                      setCategoryOpen(true);
                      setPriceOpen(false);
                      setFilterActive(true);
                    }}
                  >
                    <p>카테고리</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
                      <path
                        fill="currentColor"
                        d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
                      />
                    </svg>
                  </button>
                  <button
                    className={`flex py-1 px-2 border rounded-2xl text-sm items-center space-x-1 flex-nowrap whitespace-nowrap ${
                      paramsPrices.length ? 'border-black border-1.5 font-semibold' : 'border-gray-300 text-gray-500'
                    }`}
                    onClick={() => {
                      initFilter();
                      setPriceOpen(true);
                      setCategoryOpen(false);
                      setFilterActive(true);
                    }}
                  >
                    <p>가격</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
                      <path
                        fill="currentColor"
                        d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
                      />
                    </svg>
                  </button>
                </div>
                <Link href={'/shop'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 21 21">
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3.578 6.487A8 8 0 1 1 2.5 10.5" />
                      <path d="M7.5 6.5h-4v-4" />
                    </g>
                  </svg>
                </Link>
              </div>
              <RenderProducts params={params} mobile={mobile} />
            </div>
          </div>
          {filterActive ? (
            <div
              className={`flex z-60 fixed left-0 top-0 w-full h-full bg-black bg-opacity-20 items-end`}
              onClick={() => {
                setFilterActive(false);
              }}
            >
              <div
                className={`flex-col bg-white w-full border border-b-0 rounded-t-2xl`}
                onClick={e => e.stopPropagation()}
              >
                <div className="h-10 w-full rounded-t-2xl border-b flex items-center justify-center relative font-medium text-lg">
                  필터
                  <div
                    className="absolute flex h-full w-10 right-0 z-30 cursor-pointer items-center justify-center"
                    onClick={() => {
                      setFilterActive(false);
                    }}
                  >
                    <svg
                      stroke="lightgray"
                      strokeWidth={30}
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 2048 2048"
                    >
                      <path
                        fill="lightgray"
                        d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="py-3 h-500 overflow-auto scrollbar-hide">
                  <div className="border-b">
                    <button
                      className={`flex justify-between items-center px-3 mb-2 w-full
                  `}
                      onClick={() => setCategoryOpen(!categoryOpen)}
                    >
                      <p className="font-semibold ">카테고리</p>
                      {categoryOpen ? (
                        <svg
                          // stroke="lightgray"
                          // strokeWidth={0}
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 1024 1024"
                          transform="rotate(180)"
                        >
                          <path
                            fill="lightgray"
                            d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
                          />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                          <path
                            fill="lightgray"
                            d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
                          />
                        </svg>
                      )}
                    </button>
                    {categoryOpen ? (
                      <ul className="">
                        {categories.map(category => (
                          <li key={category.id} className="">
                            <p className="px-3 text-sm font-medium">{category.option}</p>
                            <ul className="filter-container">
                              <button
                                className={`filter-button ${
                                  categoriesState[category.id].checked ? 'bg-black text-white' : 'bg-white text-black'
                                }`}
                                onClick={e => {
                                  handleCategoryChange(category.id, !categoriesState[category.id].checked);
                                }}
                              >
                                <li>전체</li>
                              </button>
                              {category.subCategories.map(sub => (
                                <button
                                  key={sub.id}
                                  className={`filter-button ${
                                    categoriesState[sub.id].checked ? 'bg-black text-white' : 'bg-white text-black'
                                  }`}
                                  onClick={e => {
                                    handleCategoryChange(sub.id, !categoriesState[sub.id].checked);
                                  }}
                                >
                                  <li>{sub.option}</li>
                                </button>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="py-3">
                    <button
                      className="flex px-3 justify-between w-full items-center"
                      onClick={() => {
                        setPriceOpen(!priceOpen);
                      }}
                    >
                      <p className="font-semibold">가격</p>
                      {priceOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 1024 1024"
                          transform="rotate(180)"
                        >
                          <path
                            fill="lightgray"
                            d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
                          />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                          <path
                            fill="lightgray"
                            d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
                          />
                        </svg>
                      )}
                    </button>
                    {priceOpen ? (
                      <ul className="filter-container">
                        {prices.map(price => (
                          <button
                            key={price.id}
                            className={`filter-button ${
                              pricesState[price.id].checked ? 'bg-black text-white' : 'bg-white text-black'
                            }`}
                            onClick={e => {
                              handlePriceChange(price.id, !pricesState[price.id].checked);
                            }}
                          >
                            <li>{price.option}</li>
                          </button>
                        ))}
                      </ul>
                    ) : (
                      ''
                    )}
                  </div>
                  {Object.keys(categoriesState).filter(key => categoriesState[key].checked).length +
                  Object.keys(pricesState).filter(key => pricesState[key].checked).length ? (
                    <div className="h-6"></div>
                  ) : (
                    ''
                  )}
                  <div className="py-2 h-14"></div>
                </div>
                <div className="flex flex-col absolute bottom-0 w-full border-t bg-white">
                  {Object.keys(categoriesState).filter(key => categoriesState[key].checked).length +
                  Object.keys(pricesState).filter(key => pricesState[key].checked).length ? (
                    <div className="flex flex-1 m-2 items-center gap-2  overflow-auto scrollbar-hide">
                      <SelectedFilters
                        categoriesState={categoriesState}
                        pricesState={pricesState}
                        handleCategoryChange={handleCategoryChange}
                        handlePriceChange={handlePriceChange}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="flex justify-end items-center space-x-3 px-10 py-2 h-14 bg-white">
                    <Link href={'/shop'} className="px-4 py-2 border rounded-xl">
                      초기화
                    </Link>
                    <button
                      className="px-4 py-2 border rounded-xl bg-black text-white"
                      onClick={() => {
                        setQueryString(createQueryString());
                      }}
                    >
                      적용
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      ) : (
        <div className="flex flex-col w-full">
          <div className="sticky top-0 flex flex-col z-20 border-b bg-white">
            <SearchBar paramsKeyword={paramsKeyword} setSearchText={setSearchText} searchFlag={searchFlag} />
            <div className="flex justify-end items-end w-full px-10 pb-1 pt-6 max-w-screen-xl mx-auto">
              <div className="flex flex-1 pr-2 items-center gap-2  overflow-auto scrollbar-hide flex-wrap">
                <SelectedFilters
                  categoriesState={categoriesState}
                  pricesState={pricesState}
                  handleCategoryChange={handleCategoryChange}
                  handlePriceChange={handlePriceChange}
                />
              </div>
            </div>
          </div>
          <div className="flex items-start w-full px-10 max-w-screen-xl mx-auto">
            <div className={`sticky w-44 space-y-5 z-30 top-52 mt-10 flex flex-col h-full bg-white`}>
              <div className="flex flex-col space-y-4 overflow-y-auto scrollbar-hide">
                <div className="">
                  <div className="mb-1">카테고리</div>
                  {categories.map(category => (
                    <div key={category.id}>
                      <label className="flex items-center space-x-1 p-1">
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
                            <label className="flex items-center space-x-1 ml-3 p-1">
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
                      <label className="flex items-center space-x-1 p-1">
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
            <div className="flex flex-col justify-center w-full ">
              {!paramsKeyword && top && top.length ? (
                <RenderPopularProducts data={top} category={hotProductFlag.current} mobile={mobile} />
              ) : (
                ''
              )}
              <RenderProducts params={params} mobile={mobile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
