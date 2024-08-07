'use client';
import getProductWithUser from '../_lib/getProductWithUser';
import Image from 'next/image';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import Loading from '@/app/(main)/_components/Loading';
import Link from 'next/link';
import Modal from '@/app/(main)/_components/Modal';
import { useModal } from '@/app/(main)/_components/ModalProvider';

const RenderSubcategories = React.memo(({ mainCategory, subCategory, handleSubCategoryClick }) => {
  switch (mainCategory) {
    case 1:
      return (
        <>
          <li onClick={() => handleSubCategoryClick(10)} className={`p-3 ${subCategory === 10 ? 'bg-slate-200' : ''}`}>
            커스텀
          </li>
          <li onClick={() => handleSubCategoryClick(11)} className={`p-3 ${subCategory === 11 ? 'bg-slate-200' : ''}`}>
            기성품
          </li>
          <li onClick={() => handleSubCategoryClick(12)} className={`p-3 ${subCategory === 12 ? 'bg-slate-200' : ''}`}>
            스위치
          </li>
          <li onClick={() => handleSubCategoryClick(13)} className={`p-3 ${subCategory === 13 ? 'bg-slate-200' : ''}`}>
            보강판
          </li>
          <li onClick={() => handleSubCategoryClick(14)} className={`p-3 ${subCategory === 14 ? 'bg-slate-200' : ''}`}>
            아티산
          </li>
          <li onClick={() => handleSubCategoryClick(15)} className={`p-3 ${subCategory === 15 ? 'bg-slate-200' : ''}`}>
            키캡
          </li>
          <li onClick={() => handleSubCategoryClick(16)} className={`p-3 ${subCategory === 16 ? 'bg-slate-200' : ''}`}>
            PCB
          </li>
          <li onClick={() => handleSubCategoryClick(19)} className={`p-3 ${subCategory === 19 ? 'bg-slate-200' : ''}`}>
            기타
          </li>
        </>
      );
    case 2:
      return (
        <>
          <li onClick={() => handleSubCategoryClick(20)} className={`p-3 ${subCategory === 20 ? 'bg-slate-200' : ''}`}>
            완제품
          </li>
          <li onClick={() => handleSubCategoryClick(21)} className={`p-3 ${subCategory === 21 ? 'bg-slate-200' : ''}`}>
            마우스피트
          </li>
          <li onClick={() => handleSubCategoryClick(22)} className={`p-3 ${subCategory === 22 ? 'bg-slate-200' : ''}`}>
            그립테이프
          </li>
          <li onClick={() => handleSubCategoryClick(23)} className={`p-3 ${subCategory === 23 ? 'bg-slate-200' : ''}`}>
            PCB
          </li>
          <li onClick={() => handleSubCategoryClick(29)} className={`p-3 ${subCategory === 29 ? 'bg-slate-200' : ''}`}>
            기타
          </li>
        </>
      );
    case 3:
      return (
        <>
          <li onClick={() => handleSubCategoryClick(30)} className={`p-3 ${subCategory === 30 ? 'bg-slate-200' : ''}`}>
            마우스패드
          </li>
          <li onClick={() => handleSubCategoryClick(31)} className={`p-3 ${subCategory === 31 ? 'bg-slate-200' : ''}`}>
            장패드
          </li>
          <li onClick={() => handleSubCategoryClick(39)} className={`p-3 ${subCategory === 39 ? 'bg-slate-200' : ''}`}>
            기타
          </li>
        </>
      );
    case 4: // 모니터
      return null;
    case 5: // 헤드셋
      return null;
    case 9: // 기타
      return null;
  }
});

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
        <p className="text-gray-400">
          {uploadImages.imageUrls.length ? `( ${uploadImages.imageUrls.length} / 5 )` : '사진 등록'}
        </p>
      </button>
    </div>
  );
});

const RenderDNDImages = React.memo(({ uploadImages, setUploadImages, setDeleteImages }) => {
  const removeImage = useCallback(
    idx => {
      if (uploadImages.imageUrls[idx].startsWith('https://keynut-bucket.s3.ap-northeast-2.amazonaws.com'))
        setDeleteImages(curr => [...curr, uploadImages.imageUrls[idx]]);

      const newImageFiles = uploadImages.imageFiles.filter((_, index) => index !== idx);
      const newImageUrls = uploadImages.imageUrls.filter((_, index) => index !== idx);
      setUploadImages({
        imageFiles: newImageFiles,
        imageUrls: newImageUrls,
      });
    },
    [uploadImages.imageFiles, uploadImages.imageUrls, setDeleteImages, setUploadImages],
  );

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) return;

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
    [uploadImages.imageFiles, uploadImages.imageUrls, setUploadImages],
  );

  const draggableItems = useMemo(
    () =>
      uploadImages.imageUrls.map((url, idx) => (
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
                sizes="(max-width: 768px) 256px, 384px"
                placeholder="blur"
                blurDataURL={url}
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
      )),
    [uploadImages.imageUrls, removeImage],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} className="flex overflow-auto scrollbar-hide" {...provided.droppableProps}>
            {draggableItems}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

const RenderTitle = React.memo(({ title, setTitle }) => {
  const onChangeTitle = useCallback(e => {
    setTitle(e.target.value);
  }, []);

  return (
    <>
      <p className="mt-10 mb-3 font-medium text-xl max-[480px]:text-base">
        상품명<span className="text-red-500">*</span>
      </p>
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
    </>
  );
});

const RenderCategory = React.memo(({ mainCategory, subCategory, setMainCategory, setSubCategory }) => {
  const handleMainCategoryClick = useCallback(id => {
    setMainCategory(id);
    if (id !== 9 && id !== 4 && id !== 5) setSubCategory(id * 10);
    else setSubCategory(id);
  }, []);

  const handleSubCategoryClick = useCallback(id => {
    setSubCategory(id);
  }, []);

  return (
    <>
      <div className="flex flex-col flex-0.4 h-full  min-w-60">
        <div className="flex font-medium text-xl my-3 max-[480px]:text-base">
          카테고리<span className="text-red-500">*</span>
        </div>
        <div className="flex h-64 border ">
          <ul className="flex-1 overflow-auto text-lg cursor-pointer text-center">
            <li className={`p-3 ${mainCategory === 1 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(1)}>
              키보드
            </li>
            <li className={`p-3 ${mainCategory === 2 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(2)}>
              마우스
            </li>
            <li className={`p-3 ${mainCategory === 3 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(3)}>
              패드
            </li>
            <li className={`p-3 ${mainCategory === 4 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(4)}>
              모니터
            </li>
            <li className={`p-3 ${mainCategory === 5 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(5)}>
              헤드셋
            </li>
            <li className={`p-3 ${mainCategory === 9 ? 'bg-gray-200' : ''}`} onClick={() => handleMainCategoryClick(9)}>
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
    </>
  );
});

const RenderCondition = React.memo(({ condition, setCondition }) => {
  const handleConditionClick = useCallback(id => {
    setCondition(id);
  }, []);

  return (
    <div className="flex-0.4 min-w-72 ">
      <div className="flex font-medium text-xl my-3 max-[480px]:text-base">
        상품상태<span className="text-red-500">*</span>
      </div>
      <div className="flex flex-col h-64 justify-around text-lg">
        <label className="flex items-center space-x-2">
          <input
            className="relative hover:radio-hover checked:radio-checked-before  appearance-none w-5 h-5  border rounded-full"
            type="radio"
            name="condition"
            id="1"
            checked={condition === 1}
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
            checked={condition === 2}
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
            checked={condition === 3}
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
            checked={condition === 4}
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
            checked={condition === 5}
            onChange={() => handleConditionClick(5)}
          />
          <span>파손 / 고장</span>
        </label>
      </div>
    </div>
  );
});

const RenderDescriptionInput = React.memo(({ description, setDescription, subCategory }) => {
  const [template, setTemplate] = useState(false);
  const isTyping = useRef(false);
  const { openModal } = useModal();

  const onClickTemplate = async () => {
    let res = true;
    if ((!template && description.length) || (template && isTyping.current))
      res = await openModal({
        message: '계속 진행하시겠습니까?',
        subMessage: '작성 중인 글이 초기화됩니다.',
        isSelect: true,
      });
    if (!res) return;

    if (template) setDescription('');
    else {
      isTyping.current = false;
      setDescription(`하우징 - \n스위치 - \n보강판 - \n기판 - \n키캡 - \n스테빌라이저 - \n`);
    }
    setTemplate(!template);
  };

  return (
    <>
      <div className="flex items-end mt-10 mb-3 space-x-3 max-md:justify-between">
        <p className=" font-medium text-xl max-[480px]:text-base leading-snug">
          상품 설명<span className="text-red-500">*</span>
        </p>
        {subCategory === 10 && (
          <button
            className={`${
              template ? ' text-gray-500 border-gray-500' : 'text-gray-300 border-gray-200'
            }  rounded px-2 py-0.5 text-sm border`}
            onClick={onClickTemplate}
          >
            {template ? '템플릿 끄기' : '템플릿 사용'}
          </button>
        )}
      </div>
      <div className="flex ">
        <textarea
          value={description}
          onChange={e => {
            isTyping.current = true;
            setDescription(e.target.value);
          }}
          maxLength={1000}
          placeholder="상품 설명을 입력해주세요."
          className="flex-1 p-2 bg-gray-50 outline-none no-underline text-xl  scrollbar-hide resize-none max-[480px]:text-base"
          id="description"
          rows={8}
        />
      </div>
      <p className="text-xs text-gray-400 content-end ">{`(${description.length}/1000)`}</p>
    </>
  );
});

const RenderPriceInput = React.memo(({ price, setPrice }) => {
  const handlePrice = useCallback(e => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) && value.length <= 9) {
      setPrice(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
  }, []);

  return (
    <>
      <p className="mt-10 mb-3 font-medium text-xl max-[480px]:text-base">
        상품 가격<span className="text-red-500">*</span>
      </p>
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
    </>
  );
});

const RenderOpenChatUrlInput = React.memo(({ openChatUrl, setOpenChatUrl, isValidOpenChat, setIsValidOpenChat }) => {
  const onChangeHandler = value => {
    setOpenChatUrl(value);
    if (value && !value.startsWith('https://open.kakao.com/')) setIsValidOpenChat(false);
    else setIsValidOpenChat(true);
  };

  return (
    <>
      <div className="mt-10 max-w-lg border-b">
        <div className="flex items-end my-3 justify-between">
          <div className="flex items-end">
            <div className="font-medium text-xl max-[480px]:text-base">오픈채팅방</div>
          </div>
          <Link
            href="/notices/open-chat-guide"
            target="_blank"
            className="flex justify-center items-center px-1 rounded border bg-gray-100 text-gray-400 text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m5 12l5 5L20 7"
              />
            </svg>
            가이드
          </Link>
        </div>
        <input
          type="text"
          value={openChatUrl}
          maxLength={50}
          onChange={e => onChangeHandler(e.target.value)}
          className="w-full outline-none no-underline text-xl max-[480px]:text-base"
          placeholder="카카오톡의 오픈 채팅방을 개설하여 주소를 입력해주세요."
        />
      </div>
      {!isValidOpenChat && (
        <div className="text-xs text-gray-400">
          <p>올바르지 않은 오픈 채팅방 주소입니다. 올바른 주소를 입력해주세요.</p>
          <p>예: https://open.kakao.com/o/sBsuGODg</p>
          <p className="text-red-400 font-semibold">사용하지 않을 경우, 입력란을 비워주세요.</p>
        </div>
      )}
    </>
  );
});

const RenderHashTagInputWithTag = React.memo(({ tags, setTags }) => {
  const [tempTag, setTempTag] = useState('');

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
      newTags = [...newTags, '#' + tempTag.trim().replaceAll(' ', '')];
      setTags(newTags);
      setTempTag('');
    }
  };

  const onChangeTempTag = useCallback(e => {
    setTempTag(e.target.value);
  }, []);

  return (
    <div className="my-3">
      <div className="flex">
        <input
          type="text"
          value={tempTag}
          onChange={onChangeTempTag}
          onKeyDown={activeEnter}
          maxLength={10}
          placeholder="상품 태그 최대 10개"
          className="bg-gray-100 rounded p-1 max-w-md outline-none no-underline"
          enterKeyHint="next"
        />
        <p className="flex text-xs ml-2 text-gray-400 items-center">{`(${tags.length}/10)`}</p>
      </div>
      <div className="flex text-gray-500 flex-wrap h-4">
        {tags.map((e, idx) => (
          <div key={idx} className="flex items-center space-x-1 mr-3">
            <span>{e}</span>
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
    </div>
  );
});

export default function Edit() {
  const { id } = useParams();
  const [uploadImages, setUploadImages] = useState({
    imageFiles: [],
    imageUrls: [],
  });
  const [deleteImages, setDeleteImages] = useState([]);
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState(1);
  const [subCategory, setSubCategory] = useState(null);
  const [condition, setCondition] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [openChatUrl, setOpenChatUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [isValidOpenChat, setIsValidOpenChat] = useState(true);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const invalidateFilters = useInvalidateFiltersQuery();
  const { openModal } = useModal();

  const { data, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductWithUser(id),
  });

  useEffect(() => {
    const originalDataInit = async () => {
      if ((session && data.userId !== session.user.id) || status === 'unauthenticated') {
        await openModal({ message: '비정상적인 접근입니다.' });
        return router.push('/');
      } else {
        setTitle(data.title);
        const originalUploadImages = { imageFiles: [], imageUrls: [] };
        data.images.map(img => {
          originalUploadImages.imageFiles.push(img);
          originalUploadImages.imageUrls.push(img);
        });
        setUploadImages(originalUploadImages);
        setMainCategory(~~(data.category / 10) ? ~~(data.category / 10) : data.category);
        setSubCategory(data.category);
        setCondition(data.condition);
        setDescription(data.description);
        setPrice(data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        setOpenChatUrl(data.openChatUrl);
        setTags(data.tags);
      }
    };

    if (data) originalDataInit();
  }, [status, session, data, router]);

  const handleDisabled = () => {
    return (
      !uploadImages.imageUrls.length ||
      !title.trim().length ||
      !mainCategory ||
      (mainCategory !== 9 && !subCategory) ||
      !price.length ||
      !condition ||
      !description.trim().length ||
      !isValidOpenChat
    );
  };

  const handleUpload = async () => {
    if (!openChatUrl) {
      const result = await openModal({
        message: '오픈 채팅방 주소가 없습니다. 계속 진행하시겠습니까?',
        subMessage: '오픈 채팅방 주소를 입력하지 않으면, 상품에 대한 문의 및 대화를 위해 다른 수단을 제공해야 합니다.',
        isSelect: true,
        size: 'w-80',
      });

      if (!result) return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    uploadImages.imageFiles.forEach(file => {
      formData.append('uploadFiles', file);
    });
    deleteImages.forEach(file => {
      formData.append('deleteFiles', file);
    });
    formData.append('title', title.replace(/ +/g, ' ').trim());
    formData.append('subCategory', subCategory);
    formData.append('condition', condition);
    formData.append('description', description);
    formData.append('openChatUrl', openChatUrl.trim());
    formData.append('price', price.replaceAll(',', ''));
    formData.append('tags', tags);
    formData.append('id', id);

    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        update({ openChatUrl: openChatUrl });
        invalidateFilters();
        router.push(`/shop/product/${id}`);
        router.refresh();
      } else if (res.status === 401) {
        await openModal({ message: '로그인이 만료되었습니다. 다시 로그인해 주세요.' });
        signIn();
      } else {
        const data = await res.json();
        // if (res.status === 403 && data.error === 'Your account has been banned.')
        // return router.push(`/auth/error?error=${encodeURIComponent(data.error)}`);
        const errorData = await res.json();
        console.error(errorData.error);
        await openModal({ message: '상품 수정에 실패했습니다. 나중에 다시 시도해주세요.' });
      }
    } catch (error) {
      console.error('Error edit files:', error);
      await openModal({ message: '상품을 수정하는 도중 에러가 발생했습니다. 나중에 다시 시도해 주세요.' });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg px-10 mx-auto max-md:px-2 max-md:main-768">
      {uploadLoading && <Loading />}
      <RenderImageUploadButton
        fileInputRef={fileInputRef}
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
      />
      <RenderDNDImages
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
        setDeleteImages={setDeleteImages}
      />
      <RenderTitle title={title} setTitle={setTitle} />
      <RenderHashTagInputWithTag tags={tags} setTags={setTags} />
      <div className="flex flex-1 justify-between my-3 max-md:flex-col">
        <RenderCategory
          mainCategory={mainCategory}
          subCategory={subCategory}
          setMainCategory={setMainCategory}
          setSubCategory={setSubCategory}
        />
        <RenderCondition condition={condition} setCondition={setCondition} />
      </div>

      <RenderDescriptionInput description={description} setDescription={setDescription} subCategory={subCategory} />
      <RenderOpenChatUrlInput
        openChatUrl={openChatUrl}
        setOpenChatUrl={setOpenChatUrl}
        isValidOpenChat={isValidOpenChat}
        setIsValidOpenChat={setIsValidOpenChat}
      />
      <RenderPriceInput price={price} setPrice={setPrice} />

      <div className="w-full flex justify-end">
        <button
          className="bg-gray-300 text-white font-bold px-7 py-4 rounded ml-auto disabled:cursor-not-allowed disabled:opacity-10"
          disabled={handleDisabled()}
          onClick={handleUpload}
        >
          <p>수정</p>
        </button>
      </div>
      <Modal />
    </div>
  );
}
