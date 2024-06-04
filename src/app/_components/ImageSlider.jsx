'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ImageSlider({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const fullSizeImagesRef = useRef(null);
  const [imagesWidth, setImagesWidth] = useState([]);
  const [offset, setOffset] = useState(null);

  useEffect(() => {
    const asd = () => {
      if (fullSizeImagesRef.current) {
        const widths = Array.from(fullSizeImagesRef.current.children).map((child, idx) => {
          if (idx === 0) setOffset(child.clientWidth / 2);
          return child.clientWidth;
        });
        setImagesWidth(widths);
      }
    };

    asd();
    window.addEventListener('resize', asd);
    return () => window.removeEventListener('resize', asd);
  }, []);

  useEffect(() => {
    let off = 0;
    for (let i = 0; i <= currentImageIndex; i++) {
      if (i === currentImageIndex) off += imagesWidth[i] / 2;
      else off += imagesWidth[i] + 40;
    }
    setOffset(off);
  }, [currentImageIndex, imagesWidth]);

  console.log(imagesWidth);

  const handleNextImage = e => {
    e.stopPropagation(); // 이벤트 전파 중지
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const handlePrevImage = e => {
    e.stopPropagation(); // 이벤트 전파 중지
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const closeFullSizeModal = e => {
    if (e.target === e.currentTarget) setModalStatus(false);
  };

  console.log(offset);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      <div
        className="flex relative w-full max-w-lg aspect-square items-center group"
        onClick={e => setModalStatus(true)}
      >
        <button
          onClick={handlePrevImage}
          className="absolute hidden group-hover:flex left-1 z-10 opacity-55 bg-black rounded-full w-10 h-10 justify-center items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 20 20">
            <path fill="white" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" />
          </svg>
        </button>
        {images.map((img, idx) => (
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
            style={{ objectFit: 'cover' }}
          />
        ))}
        <button
          onClick={handleNextImage}
          className="absolute hidden group-hover:flex right-1 z-10 opacity-55 bg-black rounded-full w-10 h-10 justify-center items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 20 20">
            <path fill="white" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
          </svg>
        </button>
      </div>
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
      <div
        className={`${
          modalStatus ? 'visible' : 'invisible'
        } absolute flex items-center left-0 top-0 w-screen h-screen bg-black bg-opacity-80 z-50 overflow-hidden`}
        onClick={closeFullSizeModal}
      >
        <div className=" w-full" style={{ height: '50vw' }}>
          <div className="flex h-full w-full" style={{ translate: `calc(50% - ${offset}px)` }} ref={fullSizeImagesRef}>
            {images.map((img, idx) => (
              <div key={idx} className="relative min-w-fit h-full w-full mr-10">
                <img src={img} alt="product image" className="h-full w-auto object-contain" draggable="false" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
