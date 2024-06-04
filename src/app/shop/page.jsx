'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const images = [
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원', bookMarked: false },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원', bookMarked: false },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원', bookMarked: false },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원', bookMarked: false },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '12,5000원', bookMarked: false },
  { path: '/키보드4.png', name: 'yellow keyboard', price: '60,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard sjdhfkajshd', price: '20,5000원', bookMarked: true },
  { path: '/키보드3.jpeg', name: 'purple keyboard', price: '15,5000원', bookMarked: false },
  { path: '/키보드1.webp', name: 'orange keyboard', price: '35,5000원', bookMarked: false },
];

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
      { id: 22, option: '5 ~ 10만원' },
      { id: 23, option: '10 ~ 30만원' },
      { id: 24, option: '30 ~ 50만원' },
      { id: 25, option: '50만원 이상' },
    ],
  },
];

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

export default function Shop() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeMainFilter, setActiveMainFilter] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [sortOption, setSortOption] = useState(true);
  const innerContainerRef = useRef(null);
  const filterRef = useRef(null);
  const toggleFilter = id => {
    setSelectedFilters(prev => (prev.includes(id) ? prev.filter(c => c != id) : [...prev, id]));
  };
  const handleMainFilter = filter => {
    if (activeMainFilter.includes(filter.id)) {
      filter.subfilters && setSelectedFilters(prev => prev.filter(id => !filter.subfilters.some(sub => sub.id === id)));
      setActiveMainFilter(prev => prev.filter(a => a !== filter.id));
    } else setActiveMainFilter(prev => [...prev, filter.id]);
  };

  const handleSelectedFilters = id => {
    if (id === 11) {
      setSelectedFilters(prev => prev.filter(id => !filters[0].subfilters[0].subfilters.some(sub => sub.id === id)));
      setActiveMainFilter(prev => prev.filter(a => a !== id));
    }
    toggleFilter(id);
  };

  return (
    <div className="flex items-start justify-start">
      <div className="flex flex-col w-full max-w-screen-xl mx-auto">
        <div className="sticky top-20 flex flex-col z-20 bg-white border-b max-md:top-10">
          <div className="flex w-full justify-center items-center min-h-40 max-md:min-h-20">
            <input
              type="text"
              placeholder="상품검색"
              className="border-b rounded-none border-gray-400 border-solid w-96 min-w-48 outline-none max-md:w-64"
            ></input>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <g fill="none" stroke="rgb(156,163,175)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21l-4.3-4.3" />
                </g>
              </svg>
            </button>
          </div>
          <div className="flex space-x-2 justify-end py-2 px-2">
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
          <div className="z-20 flex flex-wrap ml-3 items-center  max-md:top-34">
            <div className="flex items-center mb-1 mr-3 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                onClick={() => setFilterActive(true)}
                // className="md:hidden"
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
            {selectedFilters.length
              ? selectedFilters.map(id => (
                  <div className="flex px-2 space-x-1 rounded-md items-center bg-slate-200 mr-1 mb-1" key={id}>
                    <div>{optionMap[id]}</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="0.7em"
                      height="0.7em"
                      viewBox="0 0 2048 2048"
                      onClick={() => {
                        handleSelectedFilters(id);
                      }}
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
        <div className="flex items-start w-full px-2">
          <div
            className={`${
              filterActive ? 'flex' : 'hidden'
            } sticky w-44 space-y-5 z-30 top-80 flex-col mt-20 bg-white md:flex max-md:fixed max-md:top-0 max-md:pt-36 max-md:left-0 max-md:mt-14 max-md:h-full max-md:border-r max-md:pl-4`}
            ref={filterRef}
          >
            <div className="md:hidden absolute top-10 right-2 flex justify-end pr-3">
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
                  <div className="  flex-col" key={sub.id}>
                    <button
                      className={`flex items-center px-2 rounded-md ${
                        selectedFilters.includes(sub.id) ? 'bg-slate-200' : 'bg-transparent'
                      }`}
                      onClick={() => {
                        handleMainFilter(sub);
                        toggleFilter(sub.id);
                      }}
                    >
                      {sub.option}
                    </button>
                    <ul className=" flex-col">
                      {activeMainFilter.includes(sub.id) &&
                        sub.subfilters &&
                        sub.subfilters.map((sub, key) => (
                          <button
                            className={`flex mt-2 ml-3 px-2 rounded-md ${
                              selectedFilters.includes(sub.id) ? 'bg-slate-200' : 'bg-transparent'
                            } ${key === 4 ? 'mb-3' : ''}`}
                            key={sub.id}
                            onClick={() => toggleFilter(sub.id)}
                          >
                            <li className="flex text-sm">{sub.option}</li>
                          </button>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center w-full" ref={innerContainerRef}>
            <div
              className={`grid grid-cols-4 gap-5 max-md:grid-cols-3 py-2 max-[510px]:grid-cols-2 overflow-auto scrollbar-hide`}
            >
              {images.map((img, idx) => (
                <div className="flex flex-col" key={idx}>
                  <div className="w-full aspect-square relative min-h-32 min-w-32">
                    <div className="absolute top-1 right-1 z-10">
                      <svg
                        className="w-7 h-7  max-md:w-5 max-md:h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 32 32"
                      >
                        <path
                          stroke="black"
                          fill={img.bookMarked ? 'black' : 'white'}
                          d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
                        />
                      </svg>
                    </div>
                    <Image src={img.path} alt={img.name} fill className="rounded-md" />
                  </div>
                  <div className="mt-2">
                    <div className="text-lg line-clamp-2">{img.name}</div>
                    <div>{img.price}</div>
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
