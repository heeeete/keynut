'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function MobileImageSlider({ images, state }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageShowRef = useRef(null);
  const [clientWidth, setClientWidth] = useState(0);
  const pathname = usePathname();
  let travelRatio;
  let initDragPos;
  let originOffset;
  let travel;
  let totalChildren = images.length;
  let animationFrame;

  useEffect(() => {
    if (imageShowRef.current) {
      setClientWidth(imageShowRef.current.clientWidth / totalChildren);
    }
  }, [totalChildren]);

  useEffect(() => {
    const imageShowElement = imageShowRef.current;
    if (!imageShowElement) return;

    const end = () => {
      setIsTransitioning(false);
      cancelAnimationFrame(animationFrame);
      if (Math.abs(travelRatio) > 0.2) {
        const newIdx =
          travelRatio > 0 ? Math.max(currentImageIndex - 1, 0) : Math.min(currentImageIndex + 1, totalChildren - 1);
        setCurrentImageIndex(newIdx);

        setOffset(newIdx * -clientWidth);
      } else {
        setOffset(currentImageIndex * -clientWidth);
      }
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };

    const move = e => {
      if (Math.abs(travelRatio) < 0.8) {
        travel = e.touches[0].clientX - initDragPos;
        travelRatio = travel / clientWidth;
        animationFrame = requestAnimationFrame(() => {
          setOffset(originOffset + travel);
        });
      }
    };

    const startTouch = e => {
      e.preventDefault();
      setIsTransitioning(true);
      travelRatio = 0;
      initDragPos = e.touches[0].clientX;
      originOffset = offset;
      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', end);
    };

    imageShowElement.addEventListener('touchstart', startTouch);

    return () => {
      imageShowElement.removeEventListener('touchstart', startTouch);
      cancelAnimationFrame(animationFrame);
    };
  }, [clientWidth, totalChildren, offset]);

  const handleImageClick = useCallback(() => {
    window.open(images[currentImageIndex], '_blank');
  }, [currentImageIndex]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <div className="flex relative overflow-hidden max-w-lg w-full">
          {state === 0 && (
            <div className="absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full bg-black opacity-70">
              <p className="text-white font-semibold text-3xl">판매완료</p>
            </div>
          )}
          <div
            className="flex"
            ref={imageShowRef}
            style={{
              transform: `translateX(${offset}px)`,
              transition: isTransitioning ? 'none' : 'transform 0.3s ',
            }}
          >
            {images &&
              images.map((img, idx) => (
                <div key={idx} className="flex relative max-w-lg w-d-screen aspect-square">
                  <Image
                    src={img}
                    alt="product-img"
                    fill
                    style={pathname.startsWith('/shop/product') ? { objectFit: 'cover' } : { objectFit: 'contain' }}
                  />
                </div>
              ))}
          </div>
          <button
            className={`absolute flex  items-center bg-black bg-opacity-50 text-white py-1 px-2 rounded-2xl bottom-1 right-1 transition-opacity cursor-pointer ${
              isTransitioning ? ' opacity-0 pointer-events-none' : ' opacity-100'
            }`}
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
      </div>
      {images && images.length > 1 && (
        <div className="flex space-x-3 mt-3">
          {images.map((_, idx) => {
            return (
              <button
                className={`w-3 h-3 rounded-full border ${currentImageIndex === idx ? `bg-gray-400` : 'bg-white'}`}
                onClick={() => {
                  setOffset(idx * -clientWidth);
                  setCurrentImageIndex(idx);
                }}
                key={idx}
              ></button>
            );
          })}
        </div>
      )}
    </div>
  );
}
