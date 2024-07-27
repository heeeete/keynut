import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import 'photoswipe/style.css';

export default function DesktopImageSlider({ images, state }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const handleNextImage = e => {
    e.stopPropagation();
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const handlePrevImage = e => {
    e.stopPropagation();
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      <div className="flex relative w-full max-w-lg aspect-square items-center group bg-gray-50 rounded">
        {state === 0 && (
          <div className="absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full bg-black opacity-70">
            <p className="text-white font-semibold text-3xl">판매완료</p>
          </div>
        )}
        {images && images.length > 1 && (
          <button
            className="absolute hidden group-hover:flex left-1 z-50 p-4 cursor-pointer max-md:flex max-md:p-2"
            onClick={handlePrevImage}
          >
            <div className="flex justify-center items-center opacity-55 bg-black rounded-full w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 20 20">
                <path fill="white" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" />
              </svg>
            </div>
          </button>
        )}
        {images.map((img, idx) => (
          <a
            key={idx}
            href={img.url}
            data-pswp-width={img.width}
            data-pswp-height={img.height}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              unoptimized
              src={img.url}
              alt="product-img"
              fill
              sizes="(max-width: 24rem) 100vw, 50rem"
              className={`absolute bg-blue-300 transition-opacity duration-200 cursor-pointer ${
                currentImageIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={pathname.startsWith('/shop/product') ? { objectFit: 'cover' } : { objectFit: 'contain' }}
            />
          </a>
        ))}
        {images && images.length > 1 && (
          <button
            className="absolute hidden group-hover:flex right-1 z-10 p-4 cursor-pointer max-md:flex max-md:p-2"
            onClick={handleNextImage}
          >
            <div className="flex justify-center items-center opacity-55 bg-black rounded-full w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 20 20">
                <path fill="white" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
              </svg>
            </div>
          </button>
        )}
      </div>
      {images && images.length > 1 && (
        <div className="flex space-x-3 mt-3">
          {images.map((_, idx) => (
            <button
              className={`w-3 h-3 rounded-full border ${currentImageIndex === idx ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => setCurrentImageIndex(idx)}
              key={idx}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
