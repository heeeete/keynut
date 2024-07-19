'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function MobileImageSlider({ images, state }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const [fullScreenModal, setFullScreenModal] = useState(false);
  const imageShowRef = useRef(null);
  const fullScreenImageRef = useRef(null);
  const isPinching = useRef(false);
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
      if (!fullScreenModal && Math.abs(travelRatio) < 0.01) handleFullScreenModal();
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };

    const move = e => {
      if (isPinching.current) return;
      if (Math.abs(travelRatio) < 0.8) {
        travel = e.touches[0].clientX - initDragPos;
        travelRatio = travel / clientWidth;
        animationFrame = requestAnimationFrame(() => {
          setOffset(originOffset + travel);
        });
      }
    };

    const startTouch = e => {
      console.log('start Touch');
      if (e.touches.length > 1) {
        isPinching.current = true;
        return;
      }
      isPinching.current = false;
      if (!fullScreenModal) e.preventDefault();
      setIsTransitioning(true);
      travelRatio = 0;
      initDragPos = e.touches[0].clientX;
      originOffset = offset;
      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', end);
    };

    imageShowRef.current?.addEventListener('touchstart', startTouch);
    fullScreenImageRef.current?.addEventListener('touchstart', startTouch);

    return () => {
      imageShowRef.current?.removeEventListener('touchstart', startTouch);
      fullScreenImageRef.current?.removeEventListener('touchstart', startTouch);
      cancelAnimationFrame(animationFrame);
    };
  }, [clientWidth, totalChildren, offset, fullScreenModal]);

  const handleFullScreenModal = () => {
    setFullScreenModal(curr => !curr);
    if (fullScreenModal) document.body.style.position = '';
    else document.body.style.position = 'fixed';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full">
        <button className="flex relative overflow-hidden max-w-lg w-full">
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
        </button>
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
      {fullScreenModal && (
        <div className="fixed top-0 left-0  w-d-screen h-d-screen bg-black z-60">
          <div className="fixed flex w-full bg-gray-500 z-60">
            <button onClick={handleFullScreenModal}>
              <img src="/close.svg" width={30} height={30} alt="" />
            </button>
          </div>
          <div className="flex w-full h-full overflow-hidden">
            <div
              className="relative flex bg-fuchsia-300"
              ref={fullScreenImageRef}
              style={{
                transform: `translateX(${offset}px)`,
                transition: isTransitioning ? 'none' : 'transform 0.3s ',
              }}
            >
              {images &&
                images.map((img, idx) => (
                  <div key={idx} className="flex relative w-d-screen h-d-screen">
                    <Image src={img} alt="product-img" fill style={{ objectFit: 'contain' }} />
                  </div>
                ))}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 flex justify-between items-center w-full h-10 px-4 bg-white">
            <button>{'<'}</button>
            <p>{`${currentImageIndex + 1} / ${images.length}`}</p>
            <button>{'>'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
