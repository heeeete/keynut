'use client';

import { useState, useEffect, useRef } from 'react';
import { isMobile } from '@/lib/isMobile';
import DesktopImageSlider from '../shop/product/[id]/_components/DesktopImageSlider';
import MobileImageSlider from '../shop/product/[id]/_components/MobileImageSlider';
import PhotoSwipe from 'photoswipe';
import getImageSize from '@/utils/getImageSize';

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

  return (
    <div id="gallery">
      {isM === true && <MobileImageSlider images={images} state={state} initPhotoSwipe={initPhotoSwipe} />}
      {isM === false && <DesktopImageSlider images={images} state={state} initPhotoSwipe={initPhotoSwipe} />}
    </div>
  );
}
