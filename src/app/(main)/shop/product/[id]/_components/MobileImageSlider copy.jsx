'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { touchInit } from '../utils/touch';

export default function MobileImageSlider({ images, state }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [fullScreenOffset, setFullScreenOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const [fullScreenModal, setFullScreenModal] = useState(false);
  const imageShowRef = useRef(null);
  const fullScreenRef = useRef(null);
  const innerWidth = useRef(0);
  const innerHeight = useRef(0);
  const travelRatio = useRef(0);
  const initDragPos = useRef(0);
  const originOffset = useRef(0);
  const originFullScreenOffset = useRef(0);
  const pathname = usePathname();
  const totalChildren = images.length;
  const isZoom = useRef(1);

  useEffect(() => {
    let destroyPinchZoom;
    const fullScreenImages = document.getElementsByClassName('fullScreenImage');
    if (fullScreenModal) {
      if (fullScreenRef.current && fullScreenImages.length > 0) {
        destroyPinchZoom = touchInit(fullScreenRef.current, fullScreenImages, currentImageIndex, isZoom);
      }
    } else {
      isZoom.current = 1;
    }
    return () => {
      if (destroyPinchZoom) destroyPinchZoom();
      if (fullScreenImages[currentImageIndex]) {
        fullScreenImages[currentImageIndex].style.transform = '';
      }
    };
  }, [fullScreenModal, currentImageIndex]);

  useEffect(() => {
    innerWidth.current = window.innerWidth;
    innerHeight.current = window.innerHeight;
    return () => {
      document.body.style.position = '';
    };
  }, []);

  useEffect(() => {
    if (imageShowRef.current) {
      setClientWidth(imageShowRef.current.clientWidth / totalChildren);
    }
  }, [totalChildren]);

  useEffect(() => {
    const end = () => {
      if (isZoom.current !== 1) return;
      setIsTransitioning(false);
      if (Math.abs(travelRatio.current) >= 0.2) {
        const newIdx =
          travelRatio.current > 0
            ? Math.max(currentImageIndex - 1, 0)
            : Math.min(currentImageIndex + 1, totalChildren - 1);
        setCurrentImageIndex(newIdx);
        if (imageShowRef.current) imageShowRef.current.style.transform = `translateX(${newIdx * -clientWidth}px)`;
        if (fullScreenRef.current)
          fullScreenRef.current.style.transform = `translateX(${newIdx * -innerWidth.current}px)`;
        setOffset(newIdx * -clientWidth);
        setFullScreenOffset(newIdx * -innerWidth.current);
      } else {
        if (imageShowRef.current)
          imageShowRef.current.style.transform = `translateX(${currentImageIndex * -clientWidth}px)`;
        if (fullScreenRef.current)
          fullScreenRef.current.style.transform = `translateX(${currentImageIndex * -innerWidth.current}px)`;
      }
      if (!fullScreenModal && Math.abs(travelRatio.current) < 0.01) handleFullScreenModal();
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };

    const move = e => {
      if (isZoom.current !== 1 || e.targetTouches.length > 1) return;
      if (Math.abs(travelRatio.current) < 0.8) {
        const travel = e.touches[0].clientX - initDragPos.current;
        travelRatio.current = travel / clientWidth;
        if (imageShowRef.current)
          imageShowRef.current.style.transform = `translateX(${originOffset.current + travel}px)`;
        if (fullScreenRef.current)
          fullScreenRef.current.style.transform = `translateX(${originFullScreenOffset.current + travel}px)`;
      }
    };

    const startTouch = e => {
      e.preventDefault();
      if (isZoom.current !== 1) {
        return;
      }
      setIsTransitioning(true);
      travelRatio.current = 0;
      initDragPos.current = e.touches[0].clientX;
      originOffset.current = offset;
      originFullScreenOffset.current = fullScreenOffset;
      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', end);
    };

    imageShowRef.current?.addEventListener('touchstart', startTouch);
    if (fullScreenModal) fullScreenRef.current?.addEventListener('touchstart', startTouch);

    return () => {
      imageShowRef.current?.removeEventListener('touchstart', startTouch);
      fullScreenRef.current?.removeEventListener('touchstart', startTouch);
    };
  }, [clientWidth, totalChildren, offset, fullScreenOffset, fullScreenModal]);

  const handleFullScreenModal = useCallback(() => {
    setFullScreenModal(curr => !curr);
    if (fullScreenModal) {
      document.body.style.position = '';
    } else document.body.style.position = 'fixed';
  }, [fullScreenModal]);

  const handleNavigator = useCallback(
    dir => {
      let newIdx;
      if (dir === 1) newIdx = Math.min(currentImageIndex + 1, images.length - 1);
      else newIdx = Math.max(currentImageIndex - 1, 0);
      setCurrentImageIndex(newIdx);
      setFullScreenOffset(newIdx * -innerWidth.current);
    },
    [currentImageIndex],
  );

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
      {fullScreenModal && (
        <div className={`fixed top-0 left-0 w-screen h-screen overflow-y-hidden bg-black z-90`}>
          <div className="fixed flex w-full z-60">
            <button onClick={handleFullScreenModal} className="p-3">
              <img src="/close.svg" width={30} height={30} alt="close button" />
            </button>
          </div>
          <div className="flex w-full h-full overflow-hidden">
            <div
              className="relative flex"
              ref={fullScreenRef}
              style={{
                transform: `translateX(${fullScreenOffset}px)`,
                transition: isTransitioning ? 'none' : 'transform 0.3s ',
              }}
            >
              {images.map((img, idx) => (
                <div key={idx} className={`flex relative w-screen`} style={{ height: `${innerHeight.current}px` }}>
                  <Image
                    className="fullScreenImage"
                    src={img}
                    alt="product-img"
                    sizes="100vw"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 flex justify-between items-center w-full text-white">
            <button className="p-3" onClick={() => handleNavigator(-1)}>
              <img src="/product/prev.svg" width={30} height={30} alt="adminPrevPage" />
            </button>
            <p className="font-semibold">{`${currentImageIndex + 1} / ${images.length}`}</p>
            <button className="p-3" onClick={() => handleNavigator(1)}>
              <img src="/product/next.svg" width={30} height={30} alt="adminNextPage" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
