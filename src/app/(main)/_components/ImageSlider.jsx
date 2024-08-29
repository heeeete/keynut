'use client';

import { useEffect, useRef } from 'react';
import DesktopImageSlider from '../shop/product/[id]/_components/DesktopImageSlider';
import MobileImageSlider from '../shop/product/[id]/_components/MobileImageSlider';
import PhotoSwipe from 'photoswipe';
import getImageSize from '@/utils/getImageSize';
import { useUser } from './UserProvider';

export default function ImageSlider({ images, state }) {
  const pswpRef = useRef(null); // PhotoSwipe 인스턴스를 저장할 ref
  const { user } = useUser();

  const initPhotoSwipe = async (index, imageShow, eventFunc) => {
    if (imageShow) imageShow.removeEventListener('touchstart', eventFunc);
    const options = { showHideAnimationType: 'fade', errorMsg: '이미지를 찾을 수 없습니다.' };
    const imageDataPromise = images.map(async (url, idx) => {
      const { width, height } = await getImageSize(url);
      return { src: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${url}`, width, height, alt: `image-${idx}` };
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

  if (user && user.device.type === undefined)
    return (
      <div className="flex max-w-screen-xl mx-auto flex-col items-center justify-center">
        <div className="flex relative max-w-lg w-full aspect-square items-center group bg-gray-100 rounded-xl max-md:rounded-none"></div>
      </div>
    );

  return (
    <div id="gallery">
      {user && user.device.type === 'mobile' ? (
        <MobileImageSlider images={images} state={state} initPhotoSwipe={initPhotoSwipe} />
      ) : (
        <DesktopImageSlider images={images} state={state} initPhotoSwipe={initPhotoSwipe} />
      )}
    </div>
  );
}
