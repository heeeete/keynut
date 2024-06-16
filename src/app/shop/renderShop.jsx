'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import getProducts from './_lib/getProducts';

const filters = [
  {
    id: 1,
    option: '카테고리',
    subfilters: [
      {
        id: 11,
        option: '키보드',
        subfilters: [
          { id: 111, option: '하우징' },
          { id: 112, option: '키캡' },
          { id: 113, option: '보강판' },
          { id: 114, option: '스위치' },
          { id: 115, option: 'PCB' },
        ],
      },
      {
        id: 12,
        option: '마우스',
        subfilters: [],
      },
      {
        id: 13,
        option: '기타',
        subfilters: [],
      },
    ],
  },
  {
    id: 2,
    option: '가격',
    subfilters: [
      { id: 21, option: '5만원 이하' },
      { id: 22, option: '5 - 10만원' },
      { id: 23, option: '10 - 30만원' },
      { id: 24, option: '30 - 50만원' },
      { id: 25, option: '50만원 이상' },
    ],
  },
];

const bookmarked = ['666c0cdd7b280efad4c68811', '666c0216662961209d9c18a3'];

const optionMap = {};

filters.forEach(filter => {
  optionMap[filter.id] = filter.option;
  filter.subfilters.forEach(subfilter => {
    optionMap[subfilter.id] = subfilter.option;
    subfilter.subfilters &&
      subfilter.subfilters.forEach(sub => {
        optionMap[sub.id] = sub.option;
      });
  });
});

const handleBookMarkClick = (e, id) => {
  e.stopPropagation();
};

export default function RenderShop() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [sortOption, setSortOption] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filtersState, setFiltersState] = useState({});
  const innerContainerRef = useRef(null);
  const filterRef = useRef(null);
  const router = useRouter();

  // const { data, error } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  // console.log(data);
  useEffect(() => {
    const initializeFilters = (subfilters, state = {}) => {
      subfilters.forEach(subfilter => {
        if (subfilter.subfilters && subfilter.subfilters.length) {
          state[subfilter.id] = { checked: false, subfilters: subfilter.subfilters };
          initializeFilters(subfilter.subfilters, state);
        } else {
          state[subfilter.id] = { checked: false };
        }
      });
      return state;
    };

    const initState = {};
    filters.forEach(filter => {
      if (filter.subfilters.length) {
        initializeFilters(filter.subfilters, initState);
      }
    });
    setFiltersState(initState);
  }, []);

  // console.log(filtersState);

  const handleFilterChange = (id, checked) => {
    const newState = { ...filtersState };
    const updateSelectedFilters = checked ? [...selectedFilters, id] : selectedFilters.filter(fid => fid !== id);

    const updateSubfilters = subfilters => {
      subfilters.forEach(subfilter => {
        newState[subfilter.id].checked = checked;
        if (updateSelectedFilters.includes(subfilter.id)) {
          const index = updateSelectedFilters.indexOf(subfilter.id);
          if (index > -1) {
            updateSelectedFilters.splice(index, 1);
          }
        }
        if (subfilter.subfilters) {
          updateSubfilters(subfilter.subfilters);
        }
      });
    };

    newState[id].checked = checked;
    if (newState[id].subfilters && !checked) {
      updateSubfilters(newState[id].subfilters);
    }
    setFiltersState(newState);
    setSelectedFilters(updateSelectedFilters);
  };

  return (
    <div className="flex items-start justify-start">
      <div className="flex flex-col w-full">
        <div className="sticky top-0 flex flex-col z-20 border-b bg-white">
          <div className="search-bar-container-md  max-md:search-bar-container-maxmd">
            <div className="search-bar-md max-md:search-bar-maxmd">
              <input
                type="text"
                placeholder="상품검색"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="outline-none w-450 pr-2 max-md:w-full max-md:bg-transparent"
              />
              {searchText.length ? (
                <button onClick={() => setSearchText('')}>
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
          </div>
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
            <div className="flex flex-1 flex-wrap pr-2 items-center gap-1 max-md:hidden">
              {selectedFilters.length
                ? selectedFilters.map(id => (
                    <div className="flex space-x-1 rounded-md items-center text-sm mr-2" key={id}>
                      <div className="flex ">{optionMap[id]}</div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="0.7em"
                        height="0.7em"
                        viewBox="0 0 2048 2048"
                        onClick={() => handleFilterChange(id, false)}
                      >
                        <path
                          fill="currentColor"
                          d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                        />
                      </svg>
                    </div>
                  ))
                : ''}
            </div>
            <div className="flex space-x-2 items-center">
              <button>
                <div
                  className={`${sortOption ? 'text-black' : 'text-gray-500'}`}
                  onClick={() => !sortOption && setSortOption(true)}
                >
                  인기순
                </div>
              </button>
              <button>
                <div
                  className={`${!sortOption ? 'text-black' : 'text-gray-500'}`}
                  onClick={() => sortOption && setSortOption(false)}
                >
                  최신순
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center px-2 md:hidden">
            {selectedFilters.length
              ? selectedFilters.map(id => (
                  <div className="flex space-x-1 rounded-md items-center mr-3 " key={id}>
                    <div>{optionMap[id]}</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="0.7em"
                      height="0.7em"
                      viewBox="0 0 2048 2048"
                      onClick={() => handleFilterChange(id, false)}
                    >
                      <path
                        fill="currentColor"
                        d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                      />
                    </svg>
                  </div>
                ))
              : ''}
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
            {filters.map(filter => (
              <div className="flex flex-col space-y-2" key={filter.id}>
                <div className="font-semibold">{filter.option}</div>
                {filter.subfilters.map(sub => (
                  <div className="flex-col ml-1" key={sub.id}>
                    <label className="flex space-x-1 m-1  items-center">
                      <input
                        className="accent-black"
                        type="checkbox"
                        checked={filtersState[sub.id]?.checked || false}
                        onChange={e => {
                          handleFilterChange(sub.id, e.target.checked);
                        }}
                      />
                      <div className="">{sub.option}</div>
                    </label>
                    <ul className="flex-col ml-2">
                      {filtersState[sub.id]?.checked &&
                        sub.subfilters &&
                        sub.subfilters.map((sub, key) => (
                          <label
                            className={`flex space-x-1 m-1 p-1 items-center max-md:m-1 max-md:p-2 ${
                              key === 4 ? 'mb-3' : ''
                            }`}
                            key={sub.id}
                          >
                            <input
                              className="accent-black"
                              type="checkbox"
                              checked={filtersState[sub.id]?.checked}
                              onChange={e => {
                                handleFilterChange(sub.id, e.target.checked);
                              }}
                            />
                            <div>
                              <li className="flex text-sm">{sub.option}</li>
                            </div>
                          </label>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center w-full " ref={innerContainerRef}>
            {/* <div className="h-10 w-full bg-red-600"></div> */}
            <div className={`grid grid-cols-4 gap-2 py-2 w-full overflow-auto scrollbar-hide max-md:grid-cols-2`}>
              {products.map((product, idx) => (
                <div
                  className="flex flex-col"
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
                          fill={bookmarked.includes(product._id) ? 'black' : 'white'}
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
                    <div>{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
