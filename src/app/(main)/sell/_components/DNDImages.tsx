'use client';

import Image from 'next/image';
import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { UploadImagesHookProps } from '../_type/uploadImagesProps';

const DNDImages = React.memo(({ uploadImages, setUploadImages }: UploadImagesHookProps) => {
  const removeImage = useCallback(
    (idx: number) => {
      const newImageFiles = uploadImages.imageFiles.filter((_, index) => index !== idx);
      const newImageUrls = uploadImages.imageUrls.filter((_, index) => index !== idx);
      setUploadImages({
        imageFiles: newImageFiles,
        imageUrls: newImageUrls,
      });
    },
    [uploadImages],
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      const newImageFiles = Array.from(uploadImages.imageFiles);
      const newImageUrls = Array.from(uploadImages.imageUrls);

      const [removedFile] = newImageFiles.splice(result.source.index, 1);
      const [removedUrl] = newImageUrls.splice(result.source.index, 1);

      newImageFiles.splice(result.destination.index, 0, removedFile);
      newImageUrls.splice(result.destination.index, 0, removedUrl);

      setUploadImages({
        imageFiles: newImageFiles,
        imageUrls: newImageUrls,
      });
    },
    [uploadImages],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} className="flex  overflow-auto  scrollbar-hide" {...provided.droppableProps}>
            {uploadImages.imageUrls.map((url, idx) => (
              <Draggable key={idx} draggableId={`draggable-${idx}`} index={idx}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative min-w-28 max-w-56 w-56 aspect-square mr-2 max-[960px]:w-28"
                  >
                    <Image
                      src={url}
                      fill
                      alt={`item-${idx}`}
                      className="rounded border"
                      style={{ objectFit: 'cover' }}
                    />
                    {idx === 0 && (
                      <div className="absolute bg-black left-1 top-1 p-1 rounded-xl bg-opacity-50 text-xxs text-white">
                        대표이미지
                      </div>
                    )}
                    <button onClick={() => removeImage(idx)} title="remove-image-btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        className="absolute opacity-50 right-1 top-1"
                      >
                        <path
                          fill="black"
                          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default DNDImages;
