'use client';

import React, { useCallback } from 'react';
import { useModal } from '../ModalProvider';

const RenderImageUploadButton = React.memo(({ fileInputRef, uploadImages, setUploadImages }) => {
  const { openModal } = useModal();

  const handleImageUploadClick = useCallback(() => {
    if (uploadImages.imageUrls.length < 5) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else openModal({ message: '사진은 최대 5장까지 가능합니다.' });
  }, [uploadImages]);

  const handleImageUpload = useCallback(
    async e => {
      if (!e.target.files) return;
      if (uploadImages.imageUrls.length + e.target.files.length > 5)
        return openModal({ message: '사진은 최대 5장까지 가능합니다.' });
      const files = e.target.files;
      const filesArray = Array.from(files);

      const newArray = filesArray.map(file => URL.createObjectURL(file));
      setUploadImages({
        imageFiles: [...uploadImages.imageFiles, ...filesArray],
        imageUrls: [...uploadImages.imageUrls, ...newArray],
      });
    },
    [uploadImages],
  );

  return (
    <div className="flex w-full items-center py-3">
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/bmp,image/webp,image/svg+xml,image/tiff"
        ref={fileInputRef}
        onChange={handleImageUpload}
        id="images"
        hidden
      />
      <button
        onClick={handleImageUploadClick}
        className="flex flex-col justify-center items-center aspect-square w-28  mr-1 border rounded "
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 16 16">
          <g fill="#878787">
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0" />
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0" />
          </g>
        </svg>
        <p className="text-gray-400 max-[480px]:text-base">
          {uploadImages.imageUrls.length ? `( ${uploadImages.imageUrls.length} / 5 )` : '사진 등록'}
        </p>
      </button>
    </div>
  );
});

export default RenderImageUploadButton;
