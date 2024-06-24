'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import debounce from '../utils/debounce';

export default function ImageSlider({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullSizeCurrentImageIndex, setFullSizeCurrentImageIndex] = useState(currentImageIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const fullSizeImagesRef = useRef(null);
  const [imagesWidth, setImagesWidth] = useState([]);
  const [offset, setOffset] = useState(null);
  const pathname = usePathname();

  const imagesWidthInit = useCallback(() => {
    if (fullSizeImagesRef.current) {
      const widths = Array.from(fullSizeImagesRef.current.children).map((child, idx) => {
        if (idx === 0) setOffset(child.clientWidth / 2);
        return child.clientWidth;
      });
      setImagesWidth(widths);
    }
  }, []);

  useEffect(() => {
    imagesWidthInit();

    // const debounceImagesWidthInit = debounce(imagesWidthInit, 100);
    // window.addEventListener('resize', debounceImagesWidthInit);
    // return () => window.removeEventListener('resize', debounceImagesWidthInit);
  }, [modalStatus]);

  //이미지 슬라이더의 IDX가 변경이 되면 이미지 크게보는 곳에서 IDX도 함께 변경 해주고 offset을 맞춤
  useEffect(() => {
    let off = 0;
    for (let i = 0; i <= currentImageIndex; i++) {
      if (i === currentImageIndex) off += imagesWidth[i] / 2;
      else off += imagesWidth[i] + 40;
    }
    setOffset(off);
    setFullSizeCurrentImageIndex(currentImageIndex);
  }, [currentImageIndex, imagesWidth]);

  useEffect(() => {
    let off = 0;
    for (let i = 0; i <= fullSizeCurrentImageIndex; i++) {
      if (i === fullSizeCurrentImageIndex) off += imagesWidth[i] / 2;
      else off += imagesWidth[i] + 40;
    }
    setOffset(off);
  }, [fullSizeCurrentImageIndex, imagesWidth]);

  const handleNextFullSizeImage = e => {
    setFullSizeCurrentImageIndex(prevIndex => Math.min(prevIndex + 1, images.length - 1));
  };

  const handlePrevFullSizeImage = e => {
    setFullSizeCurrentImageIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

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

  const closeFullSizeModal = e => {
    setModalStatus(false);
    setFullSizeCurrentImageIndex(currentImageIndex);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      <div
        className="flex relative w-full max-w-lg aspect-square items-center group bg-gray-50 rounded"
        onClick={_ => setModalStatus(true)}
      >
        {/* 왼쪽 넘기기 버튼 */}
        {images && images && images.length > 1 && (
          <button
            className="absolute hidden group-hover:flex left-1 z-10 p-4 cursor-pointer max-md:flex max-md:p-2"
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
              sizes="(max-width: 24rem) 100vw, 24rem"
              className={`absolute transition-opacity duration-200 ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              placeholder="blur"
              blurDataURL={img}
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
      </div>
      {/* 인디게이터 */}
      {images && images && images.length > 1 && (
        <div className="flex space-x-3 mt-3">
          {images.map((_, idx) => {
            return (
              <button
                className={`w-3 h-3 rounded-full border ${currentImageIndex === idx ? `bg-gray-400` : 'bg-white'}`}
                onClick={() => setCurrentImageIndex(idx)}
                key={idx}
              ></button>
            );
          })}
        </div>
      )}

      {/* 전체 이미지 모달*/}
      <div
        className={`${
          modalStatus ? 'visible' : 'invisible'
        } fixed flex items-center left-0 top-0 w-d-screen h-d-screen bg-black bg-opacity-80 z-50 overflow-hidden`}
      >
        {images && images.length > 1 ? (
          <>
            <button className="absolute h-full w-1/2 left-0 z-40" onClick={handlePrevFullSizeImage}></button>
            <button className="absolute h-full w-1/2 right-0 z-40" onClick={handleNextFullSizeImage}></button>
          </>
        ) : (
          ''
        )}
        {/* 모달끄기 버튼 */}
        <button className="absolute right-5 top-3 z-50" onClick={closeFullSizeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 2048 2048">
            <path
              fill="white"
              d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
            />
          </svg>
        </button>
        <div className=" w-full h-50vw max-md:h-100vw">
          <div className="flex h-full w-full " style={{ translate: `calc(50% - ${offset}px)` }} ref={fullSizeImagesRef}>
            {images &&
              images.map((img, idx) => (
                <div
                  key={idx}
                  className={`${
                    images && images.length === 1 && 'flex justify-center'
                  } relative min-w-fit h-full w-full mr-10`}
                >
                  <img
                    src={img}
                    alt="product image"
                    className="h-full w-auto object-contain"
                    draggable="false"
                    onLoad={imagesWidthInit}
                  />
                </div>
              ))}
          </div>
          {/* 전체 이미지 인디게이터 */}
          {images && images.length > 1 && (
            <div className="flex justify-center space-x-3 mt-3 z-50 ">
              {images.map((_, idx) => {
                return (
                  <button
                    className={`w-3 h-3 rounded-full  z-50 ${
                      fullSizeCurrentImageIndex === idx ? `bg-gray-400` : 'bg-white'
                    }`}
                    onClick={() => setFullSizeCurrentImageIndex(idx)}
                    key={idx}
                  ></button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
