'use client';

import { useEffect, useRef } from 'react';
import DesktopImageSlider from '../shop/product/[id]/_components/DesktopImageSlider';
import MobileImageSlider from '../shop/product/[id]/_components/MobileImageSlider';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import { useUser } from './UserProvider';

interface Image {
  name: string;
  height: number;
  width: number;
}

interface Props {
  images: Image[];
  state: number;
}

export default function ImageSlider({ images, state }: Props) {
  const pswpRef = useRef<PhotoSwipe | null>(null); // PhotoSwipe 인스턴스를 저장할 ref
  const { user } = useUser();

  const initPhotoSwipe = async (
    index: number,
    imageShow: HTMLDivElement | null | undefined,
    eventFunc: (e: TouchEvent) => void,
  ) => {
    if (imageShow) imageShow.removeEventListener('touchstart', eventFunc);
    const options: Record<string, any> = {
      showHideAnimationType: 'fade',
      errorMsg: '이미지를 찾을 수 없습니다.',
    };
    const imageSrc = images.map((img) => ({
      ...img,
      src: `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${img.name}`,
    }));
    options.dataSource = imageSrc;
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
