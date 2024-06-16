'use client';
import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Post() {
  const [uploadImages, setUploadImages] = useState({
    imageFiles: [],
    imageUrls: [],
  });
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [tempTag, setTempTag] = useState('');
  const fileInputRef = useRef(null);

  const removeImage = useCallback(
    idx => {
      const newImageFiles = uploadImages.imageFiles.filter((_, index) => index !== idx);
      const newImageUrls = uploadImages.imageUrls.filter((_, index) => index !== idx);
      setUploadImages({
        imageFiles: newImageFiles,
        imageUrls: newImageUrls,
      });
    },
    [uploadImages],
  );

  const removeTag = idx => {
    const newTags = [...tags];
    newTags.splice(idx, 1);
    setTags(newTags);
  };

  const activeEnter = e => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (tempTag.trim().length && tags.length < 10 && e.key === 'Enter') {
      let newTags = [...tags];
      newTags = [...newTags, tempTag.trim()];
      setTags(newTags);
      setTempTag('');
    }
  };

  const onChangeTitle = useCallback(e => {
    setTitle(e.target.value);
  }, []);

  const onChangeTempTag = useCallback(e => {
    setTempTag(e.target.value);
  }, []);

  const onDragEnd = useCallback(
    result => {
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

  const handleImageUpload = useCallback(
    e => {
      if (!e.target.files) return;
      if (uploadImages.imageUrls.length + e.target.files.length > 5)
        return window.alert('사진은 최대 5장까지 가능합니다.');
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

  const handleImageUploadClick = useCallback(() => {
    if (uploadImages.imageUrls.length < 5) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      window.alert('사진은 최대 5장까지 가능합니다.');
    }
  }, [uploadImages]);

  const handleDisabled = () => {
    if (!uploadImages.imageUrls.length || !title.trim().length) return true;
    else return false;
  };

  return (
    <div className="max-w-screen-xl px-10 mx-auto space-y-5 max-md:px-2">
      <div className="flex w-full items-center py-3">
        <input
          type="file"
          multiple
          accept="image/*"
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
          <p className="text-gray-400">
            {uploadImages.imageUrls.length ? `( ${uploadImages.imageUrls.length} / 5 )` : '사진 등록'}
          </p>
        </button>
      </div>
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
                      className="relative min-w-28 max-w-56 w-56 aspect-4/5 mr-2 max-md:w-28"
                    >
                      <Image
                        src={url}
                        fill
                        alt={`item-${idx}`}
                        className="rounded border"
                        style={{ objectFit: 'contain' }}
                      />
                      {idx === 0 && (
                        <div className="absolute bg-black left-1 top-1 p-1 rounded-xl bg-opacity-50 text-xxs text-white">
                          대표이미지
                        </div>
                      )}
                      <button onClick={() => removeImage(idx)} title="remove-image-btn">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5rem"
                          height="1.5rem"
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

      <div className="flex no-underline max-w-md">
        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          maxLength={20}
          placeholder="제목을 입력해주세요 최대 20글자"
          className="bg-gray-100 rounded p-2 w-full outline-none no-underline text-xl"
        />
        <p className="flex text-xs ml-2 text-gray-400 items-center">{`(${title.length}/20)`}</p>
      </div>

      <div className="flex">
        <input
          type="text"
          value={tempTag}
          onChange={onChangeTempTag}
          onKeyDown={activeEnter}
          maxLength={10}
          placeholder="상품 태그 최대 10개"
          className="bg-gray-100 rounded p-1 max-w-md outline-none no-underline text-sm"
        />
        <p className="flex text-xs ml-2 text-gray-400 items-center">{`(${tempTag.length}/10)`}</p>
      </div>
      <div className="flex text-gray-500 flex-wrap">
        {tags.map((e, idx) => (
          <div key={idx} className="flex items-center space-x-1 mr-3">
            <span>#{e}</span>
            <button onClick={() => removeTag(idx)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="0.8rem" height="0.8rem" viewBox="0 0 2048 2048">
                <path
                  fill="currentColor"
                  d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <button
          className="bg-gray-300 text-white font-bold px-7 py-4 rounded ml-auto disabled:cursor-not-allowed disabled:opacity-30"
          disabled={handleDisabled()}
        >
          <p>업로드</p>
        </button>
      </div>
    </div>
  );
}
