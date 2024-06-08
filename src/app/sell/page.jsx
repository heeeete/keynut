'use client';
import Image from 'next/image';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// 나중에 서버로 전송할때 title은 replace(/ +/g, ' ').trim()으로 공백 치환하고 보내기

const RenderSubcategories = React.memo(({ mainCategory, subCategory, handleSubCategoryClick }) => {
  if (mainCategory === 'keyboard') {
    return (
      <>
        <li
          onClick={() => handleSubCategoryClick('housing')}
          className={`p-3 ${subCategory === 'housing' ? 'bg-slate-200' : ''}`}
        >
          하우징
        </li>
        <li
          onClick={() => handleSubCategoryClick('switch')}
          className={`p-3 ${subCategory === 'switch' ? 'bg-slate-200' : ''}`}
        >
          스위치
        </li>
        <li
          onClick={() => handleSubCategoryClick('plate')}
          className={`p-3 ${subCategory === 'plate' ? 'bg-slate-200' : ''}`}
        >
          보강판
        </li>
        <li
          onClick={() => handleSubCategoryClick('artisan')}
          className={`p-3 ${subCategory === 'artisan' ? 'bg-slate-200' : ''}`}
        >
          아티산
        </li>
        <li
          onClick={() => handleSubCategoryClick('keycap')}
          className={`p-3 ${subCategory === 'keycap' ? 'bg-slate-200' : ''}`}
        >
          키캡
        </li>
        <li
          onClick={() => handleSubCategoryClick('pcb')}
          className={`p-3 ${subCategory === 'pcb' ? 'bg-slate-200' : ''}`}
        >
          PCB
        </li>
        <li
          onClick={() => handleSubCategoryClick('others')}
          className={`p-3 ${subCategory === 'keyboard-others' ? 'bg-slate-200' : ''}`}
        >
          기타
        </li>
      </>
    );
  } else if (mainCategory === 'mouse') {
    return (
      <>
        <li
          onClick={() => handleSubCategoryClick('others')}
          className={`p-3 ${subCategory === 'mouse-others' ? 'bg-slate-200' : ''}`}
        >
          기타
        </li>
      </>
    );
  } else {
    return <></>;
  }
});

RenderSubcategories.displayName = 'RenderSubcategories';

export default function Sell() {
  const [uploadImages, setUploadImages] = useState({
    imageFiles: [],
    imageUrls: [],
  });
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState('keyboard');
  const [subCategory, setSubCategory] = useState(null);
  const [condition, setCondition] = useState(null);
  const [description, setDescription] = useState(''); // 설명 상태 변수 추가
  const [price, setPrice] = useState('');
  const fileInputRef = useRef(null); //file input ref

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

  const onChangeTitle = useCallback(e => {
    setTitle(e.target.value);
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

  const handlePrice = useCallback(e => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) && value.length <= 9) {
      setPrice(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
  }, []);

  const handleMainCategoryClick = useCallback(id => {
    setMainCategory(id);
    setSubCategory(null);
  }, []);

  const handleSubCategoryClick = useCallback(id => {
    setSubCategory(id);
  }, []);

  const handleConditionClick = useCallback(id => {
    setCondition(id);
  }, []);

  const handleDisabled = () => {
    if (
      !uploadImages.imageUrls.length ||
      !title.trim().length ||
      !mainCategory ||
      !subCategory ||
      !price.length ||
      !condition ||
      !description.trim().length
    )
      return true;
    else return false;
  };

  return (
    <div className="max-w-screen-xl px-10 mx-auto max-md:px-2">
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
                      className="relative min-w-28 max-w-56 w-56 aspect-square mr-2 max-md:w-28"
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

      <p className="mt-10 mb-3 font-medium text-xl">상품명</p>
      <div className="flex no-underline max-w-lg border-b">
        <input
          type="text"
          value={title}
          onChange={onChangeTitle}
          maxLength={40}
          placeholder="상품명을 입력해주세요."
          className="w-full outline-none no-underline text-xl"
        />
        <p className="flex text-xs text-gray-400 items-center">{`(${title.length}/40)`}</p>
      </div>

      <div className="flex flex-1 justify-between my-10 max-md:flex-col">
        <div className="flex flex-col flex-0.4 h-full  min-w-60">
          <div className="flex font-medium text-xl my-3">카테고리</div>
          <div className="flex h-64 border ">
            <ul className="flex-1 overflow-auto text-lg cursor-pointer text-center">
              <li
                className={`p-3 ${mainCategory === 'keyboard' ? 'bg-gray-200' : ''}`}
                onClick={() => handleMainCategoryClick('keyboard')}
              >
                키보드
              </li>
              <li
                className={`p-3 ${mainCategory === 'mouse' ? 'bg-gray-200' : ''}`}
                onClick={() => handleMainCategoryClick('mouse')}
              >
                마우스
              </li>
              <li
                className={`p-3 ${mainCategory === 'others' ? 'bg-gray-200' : ''}`}
                onClick={() => handleMainCategoryClick('others')}
              >
                기타
              </li>
            </ul>
            <ul className="flex-1 overflow-auto text-lg cursor-pointer text-center">
              <RenderSubcategories
                mainCategory={mainCategory}
                subCategory={subCategory}
                handleSubCategoryClick={handleSubCategoryClick}
              />
            </ul>
          </div>
        </div>
        <div className="flex-0.4 min-w-72 ">
          <div className="flex font-medium text-xl my-3 ">상품상태</div>
          <div className="flex flex-col h-64 justify-around text-lg">
            <label className="flex items-center space-x-2">
              <input
                className="relative hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
                type="radio"
                name="condition"
                id="1"
                onChange={() => handleConditionClick(1)}
              />
              <span>미사용</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                className="relative hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
                type="radio"
                name="condition"
                id="2"
                onChange={() => handleConditionClick(2)}
              />
              <span>사용감 없음</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                className="relative hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
                type="radio"
                name="condition"
                id="3"
                onChange={() => handleConditionClick(3)}
              />
              <span>사용감 적음</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                className="relative hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
                type="radio"
                name="condition"
                id="4"
                onChange={() => handleConditionClick(4)}
              />
              <span>사용감 많음</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                className="relative hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
                type="radio"
                name="condition"
                id="5"
                onChange={() => handleConditionClick(5)}
              />
              <span>파손 / 고장</span>
            </label>
          </div>
        </div>
      </div>

      <p className="mt-10 mb-3 font-medium text-xl">상품 설명</p>
      <div className="flex ">
        <textarea
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          maxLength={1000}
          placeholder="상품 설명을 입력해주세요."
          className="flex-1 outline-none no-underline text-xl  border scrollbar-hide resize-none"
          rows={8}
        />
      </div>
      <p className="text-xs text-gray-400 content-end ">{`(${description.length}/1000)`}</p>

      <p className="mt-10 mb-3 font-medium text-xl">상품 가격</p>
      <div className="flex no-underline max-w-36 border-b">
        <input
          type="text"
          value={price}
          onChange={handlePrice}
          placeholder="0"
          className="w-full outline-none no-underline text-xl"
        />
        <p className="text-lg">원</p>
      </div>
      <div className="w-full flex justify-end">
        <button
          className="bg-gray-300 text-white font-bold px-7 py-4 rounded ml-auto disabled:cursor-not-allowed disabled:opacity-10"
          disabled={handleDisabled()}
        >
          <p>업로드</p>
        </button>
      </div>
    </div>
  );
}
