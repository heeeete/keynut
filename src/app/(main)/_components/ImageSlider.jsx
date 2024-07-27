'use client';

import { useState, useEffect } from 'react';
import { isMobile } from '@/lib/isMobile';
import DesktopImageSlider from '../shop/product/[id]/_components/DesktopImageSlider';
import MobileImageSlider from '../shop/product/[id]/_components/MobileImageSlider';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import getImageSize from '@/utils/getImageSize';

export default function ImageSlider({ images, state }) {
  const [isM, setIsMobile] = useState(null);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    setIsMobile(isMobile());
  }, []);

  useEffect(() => {
    const loadImageData = async () => {
      const dataPromises = images.map(async url => {
        const { width, height } = await getImageSize(url);
        return { url, width, height };
      });
      const data = await Promise.all(dataPromises);
      setImageData(data);
    };

    loadImageData();
  }, [images]);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      mainClass: 'pswp-with-perma-preloader',
      doubleTapActiont: true,
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <div id="gallery">
      {isM === true && <MobileImageSlider images={imageData} state={state} />}
      {isM === false && <DesktopImageSlider images={imageData} state={state} />}
    </div>
  );
}
