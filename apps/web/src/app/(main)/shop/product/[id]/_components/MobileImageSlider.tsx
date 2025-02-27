import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface type {
  images: {
    width: number;
    height: number;
    name: string;
  }[];
  state: number;
  initPhotoSwipe: (
    index: number,
    imageShow: HTMLDivElement | null | undefined,
    eventFunc: (e: TouchEvent) => void,
  ) => Promise<void>;
}

export default function MobileImageSlider({ images, state, initPhotoSwipe }: type) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const imageShowRef = useRef<HTMLDivElement>(null);
  const travelRatio = useRef(0);
  const initDragPos = useRef({ x: 0, y: 0 });
  const originOffset = useRef(0);
  const isScrolling = useRef<boolean | undefined>(undefined);
  const pathname = usePathname();
  const totalChildren = images?.length;

  useEffect(() => {
    if (imageShowRef.current) {
      setClientWidth(imageShowRef.current.clientWidth / totalChildren);
    }
  }, [totalChildren]);

  const end = useCallback(() => {
    setIsTransitioning(false);
    isScrolling.current = undefined;
    if (Math.abs(travelRatio.current) >= 0.2) {
      const newIdx =
        travelRatio.current > 0
          ? Math.max(currentImageIndex - 1, 0)
          : Math.min(currentImageIndex + 1, totalChildren - 1);
      setCurrentImageIndex(newIdx);
      if (imageShowRef.current)
        imageShowRef.current.style.transform = `translateX(${newIdx * -clientWidth}px)`;

      setOffset(newIdx * -clientWidth);
    } else {
      if (imageShowRef.current)
        imageShowRef.current.style.transform = `translateX(${currentImageIndex * -clientWidth}px)`;
    }
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', end);
  }, [clientWidth, totalChildren, currentImageIndex]);

  const move = useCallback(
    (e: TouchEvent) => {
      // 터치 이동 시 X, Y축 이동 거리 계산
      const travelX = e.touches[0]!.clientX - initDragPos.current.x;
      const travelY = e.touches[0]!.clientY - initDragPos.current.y;

      // 스크롤 방향이 아직 결정되지 않은 경우, 수직 스크롤인지 수평 스크롤인지 판단
      if (isScrolling.current === undefined)
        isScrolling.current = Math.abs(travelY) >= Math.abs(travelX);

      // 수평 스크롤인 경우에만 실행
      if (isScrolling.current === false) {
        // 첫 번째 이미지에서 왼쪽으로 이동하거나 마지막 이미지에서 오른쪽으로 이동하지 않도록 제한
        if (
          (travelX > 0 && currentImageIndex === 0) ||
          (travelX < 0 && currentImageIndex === images.length - 1)
        )
          return;

        // 기본 터치 이벤트 동작 방지 (페이지 스크롤 방지)
        e.preventDefault();

        // 이동 비율이 0.8보다 작은 경우에만 슬라이더 이동 적용
        if (Math.abs(travelRatio.current) < 0.8) {
          travelRatio.current = travelX / clientWidth;

          if (imageShowRef.current)
            imageShowRef.current.style.transform = `translateX(${originOffset.current + travelX}px)`;
        }
      }
    },
    [clientWidth, currentImageIndex],
  );

  const startTouch = useCallback(
    (e: TouchEvent) => {
      isScrolling.current = undefined;
      setIsTransitioning(true);
      travelRatio.current = 0;
      initDragPos.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
      originOffset.current = offset;
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', end);
    },
    [offset, move, end],
  );

  useEffect(() => {
    if (imageShowRef.current) imageShowRef.current.addEventListener('touchstart', startTouch);

    return () => {
      if (imageShowRef.current) imageShowRef.current.removeEventListener('touchstart', startTouch);
    };
  }, [startTouch]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex justify-center w-full">
        <button className="flex relative overflow-hidden max-w-lg w-full">
          {state === 0 && (
            <div className="absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full bg-black opacity-70">
              <p className="text-white font-semibold text-3xl">판매완료</p>
            </div>
          )}
          {state === 2 && (
            <div className="absolute left-1 top-1 z-10 rounded px-3 py-1  bg-gray-500 bg-opacity-55 flex items-center justify-center text-center">
              <p className="font-semibold text-white max-md:text-sm">예약중</p>
            </div>
          )}
          <div
            id="imageShow"
            className="flex bg-gray-50 touch-pan-y"
            onClick={() => initPhotoSwipe(currentImageIndex, imageShowRef.current, startTouch)}
            ref={imageShowRef}
            style={{
              transition: isTransitioning ? 'none' : 'transform 0.3s',
            }}
          >
            {images?.length ? (
              images.map((img: { name: string }, idx: number) => (
                <div key={idx} className="flex relative max-w-lg w-screen aspect-square">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${img.name}`}
                    alt="product-img"
                    fill
                    style={
                      pathname.startsWith('/shop/product')
                        ? { objectFit: 'cover' }
                        : { objectFit: 'contain' }
                    }
                  />
                </div>
              ))
            ) : (
              <div className="flex relative max-w-lg w-screen aspect-square">
                <Image
                  src="/noImage.svg"
                  alt="product-img"
                  fill
                  style={
                    pathname.startsWith('/shop/product')
                      ? { objectFit: 'cover' }
                      : { objectFit: 'contain' }
                  }
                />
              </div>
            )}
          </div>
        </button>
      </div>
      {images?.length > 1 && (
        <div className=" absolute  bottom-4 flex space-x-3 mt-3">
          {images?.map((_, idx: number) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${currentImageIndex === idx ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => {
                if (imageShowRef.current)
                  imageShowRef.current.style.transform = `translateX(${idx * -clientWidth}px)`;
                setOffset(idx * -clientWidth);
                setCurrentImageIndex(idx);
              }}
              id="navigation-button"
              aria-label="navigation-button"
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
