'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { touchInit } from '../utils/touch';

export default function MobileImageSlider({ images, state, initPhotoSwipe }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const imageShowRef = useRef(null);
  const travelRatio = useRef(0);
  const initDragPos = useRef(0);
  const originOffset = useRef(0);
  const pathname = usePathname();
  const totalChildren = images.length;

  useEffect(() => {
    if (imageShowRef.current) {
      setClientWidth(imageShowRef.current.clientWidth / totalChildren);
    }
  }, [totalChildren]);

  const end = useCallback(() => {
    setIsTransitioning(false);
    if (Math.abs(travelRatio.current) >= 0.2) {
      const newIdx =
        travelRatio.current > 0
          ? Math.max(currentImageIndex - 1, 0)
          : Math.min(currentImageIndex + 1, totalChildren - 1);
      setCurrentImageIndex(newIdx);
      if (imageShowRef.current) imageShowRef.current.style.transform = `translateX(${newIdx * -clientWidth}px)`;
      setOffset(newIdx * -clientWidth);
    } else {
      if (imageShowRef.current)
        imageShowRef.current.style.transform = `translateX(${currentImageIndex * -clientWidth}px)`;
    }
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', end);
  }, [clientWidth, totalChildren, offset]);

  const move = useCallback(
    e => {
      if (Math.abs(travelRatio.current) < 0.8) {
        const travel = e.touches[0].clientX - initDragPos.current;
        travelRatio.current = travel / clientWidth;
        if (imageShowRef.current)
          imageShowRef.current.style.transform = `translateX(${originOffset.current + travel}px)`;
      }
    },
    [clientWidth, totalChildren, offset],
  );

  const startTouch = useCallback(
    e => {
      setIsTransitioning(true);
      travelRatio.current = 0;
      initDragPos.current = e.touches[0].clientX;
      originOffset.current = offset;
      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', end);
    },
    [clientWidth, totalChildren, offset],
  );

  useEffect(() => {
    imageShowRef.current?.addEventListener('touchstart', startTouch);

    return () => {
      imageShowRef.current?.removeEventListener('touchstart', startTouch);
    };
  }, [clientWidth, totalChildren, offset]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <button className="flex relative overflow-hidden max-w-lg w-full">
          {state === 0 && (
            <div className="absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full bg-black opacity-70">
              <p className="text-white font-semibold text-3xl">판매완료</p>
            </div>
          )}
          {state === 2 && (
            <div className="absolute left-0 top-0 z-10 rounded-br px-3 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center text-center">
              <p className="font-semibold text-white max-md:text-sm">예약중</p>
            </div>
          )}
          <div
            id="imageShow"
            className="flex bg-gray-50"
            onClick={() => initPhotoSwipe(currentImageIndex, imageShowRef.current, startTouch)}
            ref={imageShowRef}
            style={{
              transition: isTransitioning ? 'none' : 'transform 0.3s ',
            }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="flex relative max-w-lg w-screen aspect-square">
                <Image
                  src={img}
                  alt="product-img"
                  fill
                  style={pathname.startsWith('/shop/product') ? { objectFit: 'cover' } : { objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </button>
      </div>
      {images.length > 1 && (
        <div className="flex space-x-3 mt-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border ${currentImageIndex === idx ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => {
                setOffset(idx * -clientWidth);
                setCurrentImageIndex(idx);
              }}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
