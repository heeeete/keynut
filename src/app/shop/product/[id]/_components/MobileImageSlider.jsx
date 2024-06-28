'use client';

import { useState, useRef, useEffect } from 'react';
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
      setIsTransitioning(true);
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
      setIsTransitioning(false);
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

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <div className="flex overflow-hidden max-w-lg w-full">
          <div
            className="flex"
            ref={imageShowRef}
            style={{
              transform: `translateX(${offset}px)`,
              transition: isTransitioning ? 'transform 0.3s ' : 'none',
            }}
          >
            {images &&
              images.map((img, idx) => (
                <div key={idx} className="flex relative max-w-lg w-d-screen aspect-square">
                  <Image
                    src={img}
                    alt="product-img"
                    fill
                    sizes="100dvw"
                    style={pathname.startsWith('/shop/product') ? { objectFit: 'cover' } : { objectFit: 'contain' }}
                  />
                </div>
              ))}
          </div>
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
