'use client';

import React, { useState, useRef, useEffect, useCallback, Fragment, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import getProducts from '../_lib/getProducts';
import { useInView } from 'react-intersection-observer';
import debounce from '../../../../utils/debounce';
import Link from 'next/link';
import fetchHotProducts from '../_lib/fetchHotProducts';
import Skeletons from './Skeletons';
import conditions from '../../_constants/conditions';

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
    id: 4,
    option: '모니터',
  },
  {
    id: 5,
    option: '헤드셋',
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

const RecentSearch = React.memo(
  ({ recentSearches, setSearchText, setRecentSearches, inputRef, searchFlag, setIsFocused }) => {
    const handleRecentSearch = search => {
      searchFlag.current = false;
      const newRecentSearches = [search, ...recentSearches.filter(item => item !== search)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      setSearchText(search);
      setIsFocused(false);
      // inputRef.current.blur();
    };

    const deleteRecentSearch = search => {
      const newRecentSearches = [...recentSearches.filter(item => item !== search)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    };
    return (
      <ul className="w-full flex-1">
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
                className="min-w-3"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 2048 2048"
              >
                <path
                  fill="gray"
                  d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                />
              </svg>
            </li>
          ))
        ) : (
          <p className="text-gray-400 py-2">최근 검색어가 없습니다</p>
        )}
      </ul>
    );
  },
);

const SearchBar = React.memo(({ paramsKeyword, setSearchText, searchFlag, isFocused, setIsFocused }) => {
  const [tempSearchText, setTempSearchText] = useState(paramsKeyword);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const $nav = document.getElementById('nav');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsFocused(false);
          inputRef.current?.blur();
          $nav.style.borderBottom = '1px solid lightgray';
        } else {
          $nav.style.borderBottom = '';
        }
      },
      {
        rootMargin: '-114px 0px 0px 0px',
        threshold: 0,
      },
    );

    if (searchContainerRef.current && window.innerWidth >= 768) {
      observer.observe(searchContainerRef.current);
    }

    return () => {
      if (searchContainerRef.current) observer.unobserve(searchContainerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleTouchStart = event => {
      if (searchContainerRef.current && searchContainerRef.current.contains(event.target)) {
        return;
      }
      if (document.activeElement === inputRef.current) {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
    const handleClickOutside = event => {
      if (
        inputRef.current &&
        searchRef.current &&
        !inputRef.current.contains(event.target) &&
        !searchRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div
      ref={searchContainerRef}
      className="search-bar-container-md  max-[960px]:search-bar-container-maxtb max-md:search-bar-container-maxmd flex-col "
    >
      <div className="max-[960px]:search-bar-maxmd">
        <div className="search-bar-md max-[960px]:search-bar-maxmd ">
          <form className="flex w-450 max-[960px]:w-full items-center" onSubmit={handleSearch}>
            <input
              id="searchInput"
              ref={inputRef}
              type="text"
              autoComplete="off"
              placeholder="상품명, #태그 입력"
              value={tempSearchText}
              onFocus={() => {
                setIsFocused(true);
              }}
              onChange={e => setTempSearchText(e.target.value)}
              className="outline-none w-full md:placeholder:text-lg  pr-2  max-[960px]:bg-transparent"
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
                className="max-[960px]:mr-1"
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
          <div
            className="flex flex-col absolute min-h-34 bg-white w-450  top-20 left-1/2 -translate-x-1/2 p-4 rounded-lg border max-[960px]:w-full max-[960px]:rounded-none max-[960px]:border-0 max-[960px]:border-b max-md:translate-x-0  max-[960px]:top-14 max-md:left-0 max-[960px]:px-10 max-md:px-4"
            ref={searchRef}
          >
            <p className=" border-b">최근 검색어</p>
            <RecentSearch
              recentSearches={recentSearches}
              setTempSearchText={setTempSearchText}
              setSearchText={setSearchText}
              setRecentSearches={setRecentSearches}
              inputRef={inputRef}
              searchFlag={searchFlag}
              setIsFocused={setIsFocused}
            />
            <div className="flex space-x-2 justify-end text-gray-400 text-sm">
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
      {Object.keys(categoriesState).filter(key => categoriesState[key].checked).length +
      Object.keys(pricesState).filter(key => pricesState[key].checked).length ? (
        <div className="flex flex-1 items-center gap-2 overflow-auto scrollbar-hide min-[960px]:flex-wrap min-[960px]:pb-4 max-[960px]:m-2">
          {Object.keys(categoriesState)
            .filter(key => categoriesState[key].checked)
            .map(key => (
              <div
                className="flex space-x-1 items-center text-sm p-1 rounded min-[960px]:bg-blue-50 max-[960px]:flex-nowrap max-[960px]:whitespace-nowrap max-md:text-xs max-[960px]:bg-white"
                key={key}
              >
                <div className="flex min-[960px]:text-gray-500 max-[960px]:text-black max-[960px]:font-semibold">
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
                className="flex space-x-1 items-center text-sm p-1  rounded min-[960px]:bg-gray-100  max-md:text-xs max-[960px]:flex-nowrap max-[960px]:whitespace-nowrap max-[960px]:bg-white"
                key={key}
              >
                <div className="flex min-[960px]:text-gray-500  max-[960px]:text-black max-[960px]:font-semibold">
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
        </div>
      ) : (
        ''
      )}
    </>
  );
};

const RenderProductsNum = ({ data, includeBooked }) => {
  const totalCount = data
    ? includeBooked
      ? data.pages.reduce((acc, page) => acc + page.length, 0)
      : data.pages.reduce((acc, page) => acc + page.filter(a => a.state === 1).length, 0)
    : 0;
  return (
    <>
      {data === undefined ? (
        <div className="flex h-5 w-32 my-4 max-[960px]:my-2 max-[960px]:mx-10 max-md:mx-3 bg-gray-100 relative rounded-sm">
          <div className="absolute top-0 left-0 h-full w-full animate-loading">
            <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
          </div>
        </div>
      ) : (
        <div className="flex py-4 text-sm max-[960px]:py-2 max-[960px]:px-10 max-md:px-3">
          <p className="font-semibold">{totalCount}</p>개의 검색 결과
        </div>
      )}
    </>
  );
};

const Product = ({ product }) => {
  return (
    <Link
      href={`/shop/product/${product._id}`}
      className="flex flex-col cursor-pointer relative rounded"
      // key={product._id}
      onClick={() => {
        sessionStorage.setItem('scrollPos', window.scrollY);
      }}
    >
      <div className="w-full relative aspect-square min-h-32 min-w-32 bg-gray-50">
        <Image
          className="rounded object-cover"
          src={
            product.images.length ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${product.images[0].name}` : '/noImage.svg'
          }
          alt={product.title}
          fill
          sizes="(max-width:768px) 60vw, (max-width:1300px) 30vw , 500px"
        />
        {product.state === 2 ? (
          <div className="absolute left-1 top-1 z-10 rounded px-2 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center">
            <p className="font-semibold text-white text-sm max-[1024px]:text-xs max-md:text-xxs">예약중</p>
          </div>
        ) : (
          ''
        )}
        <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white max-md:text-xxs">
          {conditions[product.condition].option}
        </div>
        {product.images.length > 1 && (
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
  );
};

const RenderProducts = React.memo(
  ({ params, categoriesState, pricesState, handleCategoryChange, handlePriceChange, isMaxtb, includeBooked }) => {
    const initPageRef = useRef(true);
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
          if (lastPage.length === 0) return undefined;
          const lastProduct = lastPage[lastPage.length - 1];
          return { lastId: lastProduct._id, lastCreatedAt: lastProduct.createdAt };
        },
        staleTime: 60 * 1000,
      });
    };

    const { ref, inView } = useInView({ threshold: 0, delay: 0, rootMargin: '500px' });
    const { data, fetchNextPage, hasNextPage, isFetching, error, isLoading } = useProducts(queryString);

    const hasProducts = data?.pages.some(page => page.length > 0);

    useEffect(() => {
      if (inView && !isFetching && hasNextPage) {
        fetchNextPage();
      }
    }, [inView, fetchNextPage]);

    useEffect(() => {
      initPageRef.current = true;
    }, [params]);

    useEffect(() => {
      if (!isFetching) initPageRef.current = false;
    }, [isFetching]);

    return (
      <div className="flex-col w-full">
        <RenderProductsNum data={data} includeBooked={includeBooked} />
        {!isMaxtb && (
          <SelectedFilters
            categoriesState={categoriesState}
            pricesState={pricesState}
            handleCategoryChange={handleCategoryChange}
            handlePriceChange={handlePriceChange}
          />
        )}
        {/* 검색 결과 없을 때 일단 min-h로.. */}
        {isFetching && initPageRef.current ? (
          <Skeletons />
        ) : hasProducts ? (
          <>
            <div className="grid grid-cols-4 md:gap-3 max-[960px]:gap-2 pb-2 w-full overflow-auto scrollbar-hide max-md:grid-cols-2 max-[960px]:px-10 max-md:px-3">
              {includeBooked
                ? data?.pages.map((page, i) => (
                    <Fragment key={i}>
                      {page.map((product, idx) => (
                        <Fragment key={idx}>
                          <Product product={product} />
                        </Fragment>
                      ))}
                    </Fragment>
                  ))
                : data?.pages.map((page, i) => (
                    <Fragment key={i}>
                      {page
                        .filter(a => a.state === 1)
                        .map((product, idx) => (
                          <Fragment key={idx}>
                            <Product product={product} />
                          </Fragment>
                        ))}
                    </Fragment>
                  ))}
            </div>
            {isFetching && <Skeletons />}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1 h-52">
            <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 256 256">
              <path
                fill="lightgray"
                d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24M158 46.48L193.52 82H158ZM202 216a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50Zm-45.76-92.24a6 6 0 0 1 0 8.48L136.49 152l19.75 19.76a6 6 0 1 1-8.48 8.48L128 160.49l-19.76 19.75a6 6 0 0 1-8.48-8.48L119.51 152l-19.75-19.76a6 6 0 1 1 8.48-8.48L128 143.51l19.76-19.75a6 6 0 0 1 8.48 0"
              />
            </svg>
            <p className="text-gray-300 font-medium">해당하는 상품이 없습니다</p>
          </div>
        )}
        <div className="h-12" ref={ref}></div>
      </div>
    );
  },
);

const RenderPopularProducts = React.memo(({ data, category, isLoading }) => {
  let categoryTitle =
    category === 0
      ? '전체'
      : category === 1
      ? '키보드'
      : category === 2
      ? '마우스'
      : category === 3
      ? '패드'
      : category === 4
      ? '모니터'
      : category === 5
      ? '헤드셋'
      : category === 9
      ? '기타'
      : '';

  if (isLoading) {
    return (
      <div className="max-[960px]:border-0 max-[960px]:border-b-8 max-md:px-3 md:max-w-screen-xl md:mx-auto px-10">
        <p className="z-30 py-2 font-semibold">{categoryTitle} 인기 매물</p>
        <div className="grid grid-cols-6 gap-2 pb-2 w-full relative max-md:flex overflow-x-scroll scrollbar-hide">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex flex-col rounded max-md:min-w-28 max-md:w-36" key={index}>
              <div className="w-full aspect-square  min-h-20 min-w-20 bg-gray-100"></div>
              <div className="flex flex-col py-1 justify-center h-14 space-y-1">
                <div className="w-3/4  bg-gray-100 h-5 min-h-3"></div>
                <div className="w-2/3 bg-gray-100 h-5 min-h-3"></div>
              </div>
            </div>
          ))}
          <div className="absolute top-0 left-0 h-full w-full animate-loading">
            <div className="w-20 h-full bg-white bg-gradient-to-r from-white blur-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {data?.length ? (
        <div className="px-10 max-w-screen-xl md:py-1 max-[960px]:border-0 max-[960px]:border-b-8 max-md:px-3 md:mx-auto">
          <p className="z-30 py-2 font-semibold">{categoryTitle} 인기 매물</p>
          <div className="grid grid-cols-6 gap-2 pb-2 w-full max-md:flex overflow-x-scroll scrollbar-hide">
            {data?.length ? (
              data.map((product, idx) => (
                <Link
                  href={`/shop/product/${product._id}`}
                  className="flex flex-col  cursor-pointer relative max-md:min-w-28 max-md:w-36"
                  key={idx}
                >
                  <div className="w-full aspect-square relative min-h-20 min-w-20 bg-gray-100">
                    <Image
                      className="rounded object-cover"
                      src={
                        product.images.length
                          ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${product.images[0].name}`
                          : '/noImage.svg'
                      }
                      alt={product.title}
                      fill
                      sizes="(max-width:768px) 50vw, (max-width:1300px) 20vw , 240px"
                    />
                    {product.state === 2 ? (
                      <div className="absolute left-1 top-1 z-10 rounded px-2 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center">
                        <p className="font-semibold text-white text-xs max-md:text-xxs">예약중</p>
                      </div>
                    ) : (
                      ''
                    )}
                    <div className="absolute bottom-1 right-1 text-xs break-all line-clamp-1 bg-gray-500 bg-opacity-55 p-1 rounded-sm font-semibold text-white max-[960px]:text-xxs">
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
      ) : (
        ''
      )}
    </>
  );
});

const RenderMdFilter = ({
  categoriesState,
  pricesState,
  handleCategoryChange,
  handlePriceChange,
  resetFilter,
  paramsCategories,
  paramsPrices,
  params,
  includeBooked,
  setIncludeBooked,
}) => {
  const [showCategory, setShowCategory] = useState(paramsCategories.length ? true : false);
  const [showPrice, setShowPrice] = useState(paramsPrices.length ? true : false);

  useEffect(() => {
    setShowCategory(paramsCategories.length ? true : false);
    setShowPrice(paramsPrices.length ? true : false);
  }, [params]);

  return (
    <div className="flex flex-col space-y-3 overflow-y-auto scrollbar-hide text-sm h-full max-[960px]:hidden">
      <div className="flex flex-col items-end space-y-2 pr-8">
        <button
          className="flex text-xs space-x-1 items-center border px-1 rounded flex-nowrap whitespace-nowrap w-auto"
          onClick={() => {
            resetFilter();
          }}
        >
          <p className="text-gray-400">초기화</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 21 21">
            <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.578 6.487A8 8 0 1 1 2.5 10.5" />
              <path d="M7.5 6.5h-4v-4" />
            </g>
          </svg>
        </button>
      </div>
      <div>
        <div className="mr-8 border-b">
          <button
            className="flex items-center justify-between mb-1 w-full pt-2 border-gray"
            onClick={() => {
              setShowCategory(!showCategory);
            }}
          >
            <p className="text-base">카테고리</p>
            {showCategory ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 1024 1024"
                stroke="darkgray"
                strokeWidth={20}
              >
                <path fill="darkgray" d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="darkgray"
                  d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
                />
              </svg>
            )}
          </button>
          <div className="flex flex-col pb-2">
            {showCategory &&
              categories.map(category => (
                <div key={category.id}>
                  <label className="flex items-center space-x-1.5 p-1">
                    <input
                      className="accent-gray-600"
                      type="checkbox"
                      checked={categoriesState[category.id]?.checked || false}
                      onChange={e => {
                        handleCategoryChange(category.id, e.target.checked);
                      }}
                    />
                    <div className={`${categoriesState[category.id].checked ? 'font-semibold' : ''}`}>
                      {category.option}
                    </div>
                  </label>
                  {categoriesState[category.id] &&
                    (category.subCategories?.some(sub => categoriesState[sub.id]?.checked) ||
                      categoriesState[category.id].checked) &&
                    category.subCategories?.map(sub => (
                      <div key={sub.id}>
                        <label className="flex items-center space-x-1.5 ml-5 p-1">
                          <input
                            className="accent-gray-600"
                            type="checkbox"
                            checked={categoriesState[sub.id]?.checked || false}
                            onChange={e => {
                              handleCategoryChange(sub.id, e.target.checked);
                            }}
                          />
                          <div className={`${categoriesState[sub.id].checked ? 'font-semibold' : ''}`}>
                            {sub.option}
                          </div>
                        </label>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
        <div className="mr-8 border-b">
          <button
            className="flex items-center justify-between mb-1 w-full pt-2"
            onClick={() => {
              setShowPrice(!showPrice);
            }}
          >
            <p className="text-base">가격</p>
            {showPrice ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 1024 1024"
                stroke="darkgray"
                strokeWidth={20}
              >
                <path fill="darkgray" d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="darkgray"
                  d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
                />
              </svg>
            )}
          </button>
          <div className="flex flex-col pb-2">
            {showPrice &&
              prices.map(price => (
                <div key={price.id}>
                  <label className="flex items-center space-x-1.5 py-1">
                    <input
                      className="accent-gray-600"
                      type="checkbox"
                      checked={pricesState[price.id]?.checked || false}
                      onChange={e => {
                        handlePriceChange(price.id, e.target.checked);
                      }}
                    />
                    <div className={`${pricesState[price.id].checked ? 'font-semibold' : ''}`}>{price.option}</div>
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex items-start">
        <button
          className={`flex text-xs space-x-1 items-center border px-1 rounded flex-nowrap whitespace-nowrap ${
            includeBooked ? 'text-black border-black' : 'text-gray-400 border-gray-300'
          }`}
          onClick={() => {
            setIncludeBooked(!includeBooked);
          }}
        >
          <p>예약 포함</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FilterBar = ({
  paramsCategories,
  paramsPrices,
  initFilter,
  resetFilter,
  setPriceOpen,
  setCategoryOpen,
  setFilterActive,
  includeBooked,
  setIncludeBooked,
}) => {
  return (
    <>
      <div className="flex-1 space-x-2 hidden max-[960px]:flex max-[960px]:mx-8 max-md:mx-0">
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
          className={`flex py-1 px-2 border rounded-2xl text-sm items-center space-x-1 flex-nowrap whitespace-nowrap       ${
            paramsCategories.length ? 'border-black border-1.5 font-semibold' : 'border-gray-300 text-gray-500'
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
        <button
          className={`flex py-1 px-2 border rounded-2xl text-sm items-center space-x-1 flex-nowrap whitespace-nowrap
          ${includeBooked ? 'border-black border-1.5 font-semibold' : 'border-gray-300 text-gray-500'}`}
          onClick={() => {
            setIncludeBooked(!includeBooked);
          }}
        >
          예약 포함
        </button>
      </div>
      <button onClick={e => resetFilter()} className="p-1 md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 21 21">
          <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.578 6.487A8 8 0 1 1 2.5 10.5" />
            <path d="M7.5 6.5h-4v-4" />
          </g>
        </svg>
      </button>
    </>
  );
};

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
  const [isMaxtb, setIsMaxtb] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const pageRef = useRef(null);
  const [includeBooked, setIncludeBooked] = useState(true);
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
    4: { option: '모니터', checked: false },
    5: { option: '헤드셋', checked: false },
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

  const hotProductFlag = useRef(0);
  const currPosY = useRef(0);
  const searchFlag = useRef(true);
  const obj = {};

  useLayoutEffect(() => {
    if (window.innerWidth > 960) setIsMaxtb(false);
  }, []);

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (filterActive) {
      currPosY.current = window.scrollY;
      document.documentElement.style.setProperty('--posY', `-${currPosY.current}px`);
      document.body.classList.add('fixed');
      footer.style.display = 'hidden';
    } else {
      footer.style.visibility = 'visible';
      document.body.classList.remove('fixed');
      window.scrollTo(0, currPosY.current);
    }
    return () => {
      document.body.classList.remove('fixed');
      footer.style.visibility = 'visible';
    };
  }, [filterActive]);

  useEffect(() => {
    const debounceViewResizing = debounce(e => {
      if (e.target.innerWidth > 960) {
        setIsMaxtb(false);
        setFilterActive(false);
      } else {
        setIsMaxtb(true);
      }
    }, 100);

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
          if (newCategoriesState[e]) newCategoriesState[e].checked = true;
        });
      }

      if (paramsPrices.length > 0) {
        paramsPrices.forEach(e => {
          if (newPricesState[e]) newPricesState[e].checked = true;
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
    if (searchFlag.current && !isMaxtb) debounceSetQueryString(createQueryString());
    else if (!searchFlag.current) setQueryString(createQueryString());
  }, [debounceSetQueryString, createQueryString]);
  // ======================================================

  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

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
    const newPricesState = { ...pricesState };

    Object.keys(newCategoriesState).map(key => (newCategoriesState[key].checked = false));
    Object.keys(newPricesState).map(key => (newPricesState[key].checked = false));
    paramsCategories.map(id => (newCategoriesState[id].checked = true));
    paramsPrices.map(id => (newPricesState[id].checked = true));
    setCategoriesState(newCategoriesState);
    setPricesState(newPricesState);
  };

  const resetFilter = () => {
    const searchParams = new URLSearchParams();
    paramsKeyword?.length && searchParams.append('keyword', paramsKeyword);
    router.push(`/shop?${searchParams.toString()}`);
  };

  const useHotProducts = category => {
    return useQuery({
      queryKey: ['topProducts', category],
      queryFn: () => fetchHotProducts(category),
      enabled:
        !paramsKeyword &&
        (category === 1 ||
          category === 2 ||
          category === 3 ||
          category === 4 ||
          category === 5 ||
          category === 9 ||
          category === 0),
      staleTime: Infinity,
    });
  };
  const { data: top, error, isLoading } = useHotProducts(hotProductFlag.current);
  return (
    <div className="flex items-start justify-start z-60" ref={pageRef}>
      <div className="flex flex-col w-full">
        <div className="sticky top-0 flex flex-col border-b z-20 bg-white max-[960px]:z-60">
          <SearchBar
            paramsKeyword={paramsKeyword}
            setSearchText={setSearchText}
            searchFlag={searchFlag}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
          />
        </div>
        <div className="border-b max-[960px]:border-0">
          {!paramsKeyword ? (
            <RenderPopularProducts isLoading={isLoading} data={top} category={hotProductFlag.current} />
          ) : (
            ''
          )}
        </div>

        <div
          className={`flex items-start w-full min-h-60vh md:max-w-screen-xl md:mx-auto min-[960px]:px-10 max-[960px]:flex-col max-[960px]:px-0 ${
            top?.length ? 'max-md:min-h-96' : 'max-md:min-h-70vh'
          }`}
        >
          <div
            className={`sticky flex bg-white min-[960px]:mt-5 min-[960px]:w-48 min-[960px]:z-30 min-[960px]:top-34 md:flex-col md:h-full max-[960px]:z-50 max-[960px]:top-14 max-[960px]:w-full max-[960px]:border-b max-[960px]:p-3 max-[960px]:items-start`}
          >
            <FilterBar
              paramsCategories={paramsCategories}
              paramsPrices={paramsPrices}
              initFilter={initFilter}
              resetFilter={resetFilter}
              setPriceOpen={setPriceOpen}
              setCategoryOpen={setCategoryOpen}
              setFilterActive={setFilterActive}
              includeBooked={includeBooked}
              setIncludeBooked={setIncludeBooked}
            />
            <RenderMdFilter
              categoriesState={categoriesState}
              pricesState={pricesState}
              handleCategoryChange={handleCategoryChange}
              handlePriceChange={handlePriceChange}
              resetFilter={resetFilter}
              paramsCategories={paramsCategories}
              paramsPrices={paramsPrices}
              params={params}
              includeBooked={includeBooked}
              setIncludeBooked={setIncludeBooked}
            />
          </div>
          <div className="flex flex-col w-full">
            <RenderProducts
              params={params}
              categoriesState={categoriesState}
              pricesState={pricesState}
              handleCategoryChange={handleCategoryChange}
              handlePriceChange={handlePriceChange}
              isMaxtb={isMaxtb}
              includeBooked={includeBooked}
            />
          </div>
        </div>
      </div>
      {/* max-md: filterModal */}
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
            <div className="py-3 overflow-auto scrollbar-hide max-md:h-500 max-[960px]:h-750">
              <div className="border-b">
                <button
                  className={`flex justify-between items-center px-3 mb-2 w-full
                  `}
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  <p className="font-semibold  ">카테고리</p>
                  {categoryOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
                      <path
                        fill="lightgray"
                        d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
                      <path
                        fill="lightgray"
                        d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
                      />
                    </svg>
                  )}
                </button>
                {categoryOpen ? (
                  <ul className="">
                    {categories.map(category => (
                      <li key={category.id} className="">
                        <p className="px-3 text-sm font-medium max-[960px]:px-6 max-md:px-3">{category.option}</p>
                        <ul className="filter-container max-[960px]:mx-10 max-md:mx-0">
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
                          {category.subCategories?.map(sub => (
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
                      <path
                        fill="lightgray"
                        d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
                      <path
                        fill="lightgray"
                        d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
                      />
                    </svg>
                  )}
                </button>
                {priceOpen ? (
                  <ul className="filter-container max-[960px]:mx-10 max-md:mx-0">
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
              <SelectedFilters
                categoriesState={categoriesState}
                pricesState={pricesState}
                handleCategoryChange={handleCategoryChange}
                handlePriceChange={handlePriceChange}
              />

              <div className="flex justify-end items-center space-x-3 px-10 py-2 h-14 bg-white">
                <button
                  className="px-4 py-2 border rounded-xl"
                  onClick={() => {
                    resetFilter();
                    setFilterActive(false);
                  }}
                >
                  초기화
                </button>
                <button
                  className="px-4 py-2 border rounded-xl bg-black text-white"
                  onClick={() => {
                    setQueryString(createQueryString());
                    setFilterActive(false);
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
    </div>
  );
}
