'use client';

import { useState, useEffect, useRef } from 'react';
import { isMobile } from '@/lib/isMobile';
import DesktopImageSlider from '../shop/product/[id]/_components/DesktopImageSlider';
import MobileImageSlider from '../shop/product/[id]/_components/MobileImageSlider';
import PhotoSwipe from 'photoswipe';
import getImageSize from '@/utils/getImageSize';

const LoadingSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
      <defs>
        <symbol id="lineMdCogFilledLoop0">
          <path
            fill="#fff"
            d="M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 16.57 6.05 16.57 6.05C16.64 6.1 16.71 6.16 16.77 6.22C18.14 7.34 19.09 8.94 19.4 10.75C19.41 10.84 19.42 10.92 19.43 11C19.43 11 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z"
          >
            <animate
              fill="freeze"
              attributeName="d"
              begin="0.5s"
              dur="0.2s"
              values="M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 16.57 6.05 16.57 6.05C16.64 6.1 16.71 6.16 16.77 6.22C18.14 7.34 19.09 8.94 19.4 10.75C19.41 10.84 19.42 10.92 19.43 11C19.43 11 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z;M11 13L15.74 5.5C16.03 5.67 16.31 5.85 16.57 6.05C16.57 6.05 19.09 5.04 19.09 5.04C19.25 4.98 19.52 5.01 19.6 5.17C19.6 5.17 21.67 8.75 21.67 8.75C21.77 8.92 21.73 9.2 21.6 9.32C21.6 9.32 19.43 11 19.43 11C19.48 11.33 19.5 11.66 19.5 12z"
            />
          </path>
        </symbol>
        <mask id="lineMdCogFilledLoop1">
          <path
            fill="none"
            stroke="#fff"
            strokeDasharray="36"
            strokeDashoffset="36"
            strokeWidth="5"
            d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7z"
          >
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="36;0" />
            <set attributeName="opacity" begin="0.4s" to="0" />
          </path>
          <g opacity="0">
            <use href="#lineMdCogFilledLoop0" />
            <use href="#lineMdCogFilledLoop0" transform="rotate(60 12 12)" />
            <use href="#lineMdCogFilledLoop0" transform="rotate(120 12 12)" />
            <use href="#lineMdCogFilledLoop0" transform="rotate(180 12 12)" />
            <use href="#lineMdCogFilledLoop0" transform="rotate(240 12 12)" />
            <use href="#lineMdCogFilledLoop0" transform="rotate(300 12 12)" />
            <set attributeName="opacity" begin="0.4s" to="1" />
            <animateTransform
              attributeName="transform"
              dur="30s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </g>
          <circle cx="12" cy="12" r="3.5" />
        </mask>
      </defs>
      <rect width="24" height="24" fill="#a599ff" mask="url(#lineMdCogFilledLoop1)" />
    </svg>
  );
};

export default function ImageSlider({ images, state }) {
  const [isM, setIsMobile] = useState(null);
  const pswpRef = useRef(null); // PhotoSwipe 인스턴스를 저장할 ref

  useEffect(() => {
    setIsMobile(isMobile());
  }, []);

  const initPhotoSwipe = async (index, imageShow, eventFunc) => {
    if (imageShow) imageShow.removeEventListener('touchstart', eventFunc);
    const options = { showHideAnimationType: 'fade', errorMsg: '이미지를 찾을 수 없습니다.' };
    const imageDataPromise = images.map(async (url, idx) => {
      const { width, height } = await getImageSize(url);
      return { src: url, width, height, alt: `image-${idx}` };
    });
    const imageData = await Promise.all(imageDataPromise);

    options.dataSource = imageData;
    options.index = index;

    if (pswpRef.current) {
      pswpRef.current.destroy();
    }

    pswpRef.current = new PhotoSwipe(options);
    pswpRef.current.init();
    pswpRef.current.on('close', () => {
      if (imageShow) imageShow.addEventListener('touchstart', eventFunc);
    });
  };

  useEffect(() => {
    return () => {
      if (pswpRef.current) {
        pswpRef.current.destroy();
      }
    };
  }, []);

  if (isM === null)
    return (
      <div className="flex max-w-screen-xl mx-auto flex-col items-center justify-center">
        <div className="flex relative w-full max-w-lg aspect-square items-center group bg-gray-100 rounded"></div>
      </div>
    );
  return (
    <div id="gallery">
      {isM ? (
        <MobileImageSlider images={images} state={state} initPhotoSwipe={initPhotoSwipe} />
      ) : (
        <DesktopImageSlider images={images} state={state} initPhotoSwipe={initPhotoSwipe} />
      )}
    </div>
  );
}
