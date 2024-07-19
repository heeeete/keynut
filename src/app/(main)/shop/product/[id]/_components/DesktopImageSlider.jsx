'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DesktopImageSlider({ images, state }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const handleNextImage = e => {
    e.stopPropagation(); // 이벤트 전파 중지
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const handlePrevImage = e => {
    e.stopPropagation();
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const handleImageClick = () => {
    window.open(images[currentImageIndex], '_blank');
  };

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      <div
        className="flex relative w-full max-w-lg aspect-square items-center group bg-gray-50 rounded "
        href={images[currentImageIndex]}
        target="_blank"
      >
        {state === 0 && (
          <div className="absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full bg-black opacity-70">
            <p className="text-white font-semibold text-3xl">판매완료</p>
          </div>
        )}
        {/* 왼쪽 넘기기 버튼 */}
        {images && images.length > 1 && (
          <button
            className="absolute hidden group-hover:flex left-1 z-50 p-4 cursor-pointer max-md:flex max-md:p-2"
            onClick={handlePrevImage}
          >
            <div className="flex justify-center items-center opacity-55 bg-black rounded-full w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 20 20">
                <path fill="white" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" />
              </svg>
            </div>
          </button>
        )}
        {images &&
          images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt="product-img"
              fill
              draggable={false}
              onClick={handleImageClick}
              sizes="(max-width: 24rem) 100vw, 50rem"
              className={`absolute transition-opacity duration-200 cursor-pointer ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={pathname.startsWith('/shop/product') ? { objectFit: 'cover' } : { objectFit: 'contain' }}
            />
          ))}
        {/* 오른쪽 넘기기 버튼 */}
        {images && images.length > 1 && (
          <button
            className="absolute hidden group-hover:flex right-1 z-10 p-4 cursor-pointer max-md:flex max-md:p-2"
            onClick={handleNextImage}
          >
            <div className="flex justify-center items-center opacity-55 bg-black rounded-full w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 20 20">
                <path fill="white" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
              </svg>
            </div>
          </button>
        )}
        {/* 확대 버튼 */}
        <button
          className={`hello absolute flex items-center bg-black bg-opacity-50 text-white py-1 px-2 rounded-2xl bottom-1 right-1 transition-opacity opacity-0 ${
            !isTransitioning && 'group-hover:opacity-100'
          } `}
          onClick={handleImageClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M456.69 421.39L362.6 327.3a173.8 173.8 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.8 173.8 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3M97.92 222.72a124.8 124.8 0 1 1 124.8 124.8a124.95 124.95 0 0 1-124.8-124.8"
            />
          </svg>
          확대
        </button>
      </div>
      {/* 인디케이터 */}
      {images && images.length > 1 && (
        <div className="flex space-x-3 mt-3">
          {images.map((_, idx) => (
            <button
              className={`w-3 h-3 rounded-full border ${currentImageIndex === idx ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => setCurrentImageIndex(idx)}
              key={idx}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
