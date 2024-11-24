'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Loading from '../_components/Loading';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import getUserProfile from '@/lib/getUserProfile';
import { useModal } from '../_components/ModalProvider';
import getSignedUrls from '@/lib/getSignedUrls';
import uploadToS3 from '@/lib/uploadToS3';
import RenderImageUploadButton from '@/app/(main)/_components/ProductForm/RenderImageUploadButton';
import RenderTitle from '@/app/(main)/_components/ProductForm/RenderTitle';
import RenderCategory from '@/app/(main)/_components/ProductForm/RenderCategory';
import RenderCondition from '@/app/(main)/_components/ProductForm/RenderCondition';
import RenderDescriptionInput from '@/app/(main)/_components/ProductForm/RenderDescriptionInput';
import RenderPriceInput from '@/app/(main)/_components/ProductForm/RenderPriceInput';
import RenderOpenChatUrlInput from '@/app/(main)/_components/ProductForm/RenderOpenChatUrlInput';
import RenderHashTagInputWithTag from '@/app/(main)/_components/ProductForm/RenderHashTagInputWithTag';

interface UploadImagesProps {
  imageFiles: { file: File; width: number; height: number }[]; // 문자열과 숫자의 튜플 배열
  imageUrls: string[];
}

interface UploadImagesHookProps {
  uploadImages: UploadImagesProps;
  setUploadImages: React.Dispatch<React.SetStateAction<UploadImagesProps>>;
}

const RenderDNDImages = React.memo(({ uploadImages, setUploadImages }: UploadImagesHookProps) => {
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

export default function Sell() {
  const [uploadImages, setUploadImages] = useState<UploadImagesProps>({
    imageFiles: [],
    imageUrls: [],
  });
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState(1);
  const [subCategory, setSubCategory] = useState(10);
  const [condition, setCondition] = useState(1);
  const [description, setDescription] = useState(''); // 설명 상태 변수 추가
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openChatUrl, setOpenChatUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [isValidOpenChat, setIsValidOpenChat] = useState(true);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const invalidateFilters = useInvalidateFiltersQuery();
  const isInitialRender = useRef(true); // 첫 번째 렌더링인지 확인하는 ref
  const { openModal } = useModal();

  useEffect(() => {
    const openDraftModal = async () => {
      const draft = JSON.parse(sessionStorage.getItem('draft'));
      if (!draft) return;

      const proceed = await openModal({
        message: '이전에 작성 중인 글이 있습니다.',
        subMessage: '이어서 작성하시겠습니까?',
        isSelect: true,
      });
      if (proceed) {
        setTitle(draft.title);
        setMainCategory(draft.mainCategory);
        setSubCategory(draft.subCategory);
        setCondition(draft.condition);
        setDescription(draft.description);
        setPrice(draft.price);
        setOpenChatUrl(draft.openChatUrl);
        setTags(draft.tags);
      } else sessionStorage.removeItem('draft');
    };

    const fetchUserProfile = async () => {
      const user = await getUserProfile(session.user.id);
      if (session.user.openChatUrl !== user?.openChatUrl) update({ openChatUrl: user.openChatUrl });
    };

    const initializeData = async () => {
      if (status !== 'loading' && status === 'unauthenticated') return signIn();
      if (status === 'authenticated') {
        await fetchUserProfile();
        setOpenChatUrl(session.user.openChatUrl || '');
        await openDraftModal();
        isInitialRender.current = false;
      }
    };

    initializeData();
  }, [status]);

  useEffect(() => {
    if (isInitialRender.current) return;
    const draft = { title, mainCategory, subCategory, condition, description, price, openChatUrl, tags };
    sessionStorage.setItem('draft', JSON.stringify(draft));
  }, [title, mainCategory, subCategory, condition, description, price, openChatUrl, tags]);

  useEffect(() => {
    return () => {
      const draft = JSON.parse(sessionStorage.getItem('draft'));
      if (draft && !draft.title && !draft.description && !draft.price && (!draft.tags || !draft.tags.length)) {
        sessionStorage.removeItem('draft');
      }
    };
  }, []);

  const handleUpload = async () => {
    if (
      !uploadImages.imageUrls.length ||
      !title.trim().length ||
      !mainCategory ||
      (mainCategory !== 9 && !subCategory) ||
      !price.length ||
      !condition ||
      !description.trim().length ||
      !isValidOpenChat
    ) {
      openModal({
        message: `필수 항목을 입력해주세요.`,
      });
      return;
    } else if (!openChatUrl) {
      const result = await openModal({
        message: `오픈 채팅방 주소가 없습니다.\n계속 진행하시겠습니까?`,
        subMessage: '오픈 채팅방 주소를 입력하지 않으면, 상품에 대한 문의 및 대화를 위해 다른 수단을 제공해야 합니다.',
        isSelect: true,
        size: 'w-80',
      });
      if (!result) return;
    }

    setIsLoading(true);
    const imageDetails = uploadImages.imageFiles.map(file => ({
      name: `product_${new Date().getTime()}_${file.file.name}`,
      width: file.width,
      height: file.height,
    }));
    const { urls, status } = await getSignedUrls(imageDetails);
    if (status !== 200) {
      await openModal({ message: '상품 업로드를 실패했습니다.\n나중에 다시 시도해주세요.' });
      setIsLoading(false);
      return;
    }

    await Promise.all(
      urls.map(async (url, idx) => {
        await uploadToS3(url, uploadImages.imageFiles[idx]);
      }),
    );

    const formData = new FormData();
    formData.append('imageDetails', JSON.stringify(imageDetails));
    formData.append('title', title.replace(/ +/g, ' ').trim());
    formData.append('subCategory', subCategory.toString());
    formData.append('condition', condition.toString());
    formData.append('description', description);
    formData.append('openChatUrl', openChatUrl.trim());
    formData.append('price', price.replaceAll(',', ''));
    formData.append('tags', JSON.stringify(tags));

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        update({ openChatUrl: openChatUrl });
        sessionStorage.removeItem('draft');
        if (data) {
          invalidateFilters();
          router.push(`/shop/product/${data.insertedId}`);
          router.refresh();
        }
      } else if (res.status === 401) {
        await openModal({ message: '로그인이 만료되었습니다.\n다시 로그인해 주세요.' });
        signIn();
      } else if (res.status === 403 && data.error === 'Your account has been banned.') {
        return router.push(`/auth/error?error=${encodeURIComponent(data.error)}`);
      } else {
        console.error(data.error);
        await openModal({ message: '상품 업로드를 실패했습니다.\n나중에 다시 시도해주세요.' });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      await openModal({ message: '상품 업로드를 실패했습니다.\n나중에 다시 시도해주세요.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg px-10 mx-auto max-[960px]:px-10 max-md:px-2 max-[960px]:main-768 max-[960px]:mb-5">
      {isLoading && <Loading />}
      <p className="min-[960px]:mt-10 font-medium text-xl max-[480px]:text-base">
        사진<span className="text-red-500">*</span>
      </p>
      <RenderImageUploadButton uploadImages={uploadImages} setUploadImages={setUploadImages} />
      <RenderDNDImages uploadImages={uploadImages} setUploadImages={setUploadImages} />
      <RenderTitle title={title} setTitle={setTitle} />
      <RenderHashTagInputWithTag tags={tags} setTags={setTags} />
      <div className="flex flex-1 justify-between my-3 max-[960px]:flex-col">
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
        <button className="bg-black text-white font-extrabold px-7 py-4 rounded ml-auto" onClick={handleUpload}>
          <p>업로드</p>
        </button>
      </div>
    </div>
  );
}
