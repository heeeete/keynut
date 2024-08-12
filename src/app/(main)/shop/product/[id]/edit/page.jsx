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
import { useModal } from '@/app/(main)/_components/ModalProvider';
import uploadToS3 from '@/lib/uploadToS3';
import getSignedUrls from '@/lib/getSignedUrls';
import RenderImageUploadButton from '@/app/(main)/_components/ProductForm/RenderImageUploadButton';
import RenderTitle from '@/app/(main)/_components/ProductForm/RenderTitle';
import RenderCategory from '@/app/(main)/_components/ProductForm/RenderCategory';
import RenderCondition from '@/app/(main)/_components/ProductForm/RenderCondition';
import RenderDescriptionInput from '@/app/(main)/_components/ProductForm/RenderDescriptionInput';
import RenderPriceInput from '@/app/(main)/_components/ProductForm/RenderPriceInput';
import RenderOpenChatUrlInput from '@/app/(main)/_components/ProductForm/RenderOpenChatUrlInput';
import RenderHashTagInputWithTag from '@/app/(main)/_components/ProductForm/RenderHashTagInputWithTag';

const RenderDNDImages = React.memo(({ uploadImages, setUploadImages, setDeleteImages }) => {
  const removeImage = useCallback(
    idx => {
      if (!uploadImages.imageUrls[idx].startsWith('blob'))
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

  console.log(uploadImages);

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
                src={
                  typeof uploadImages.imageFiles[idx] === 'object'
                    ? url
                    : `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${url}`
                }
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
    const errorHandler = async () => {
      if (error?.message === 'Not Found') {
        await openModal({ message: '삭제된 상품입니다.' });
        router.back();
      }
    };
    errorHandler();
  }, [error, router]);

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
        message: '오픈 채팅방 주소가 없습니다. 계속 진행하시겠습니까?',
        subMessage: '오픈 채팅방 주소를 입력하지 않으면, 상품에 대한 문의 및 대화를 위해 다른 수단을 제공해야 합니다.',
        isSelect: true,
        size: 'w-80',
      });

      if (!result) return;
    }

    setUploadLoading(true);

    const newImageIdx = [];
    const names = [];

    uploadImages.imageFiles.forEach((file, idx) => {
      if (typeof file === 'object') {
        newImageIdx.push(idx);
        names.push(`product_${new Date().getTime()}_${file.name}`);
      }
    });

    const { urls, status } = await getSignedUrls(names);
    if (status !== 200) {
      await openModal({ message: '상품 업로드를 실패했습니다.\n나중에 다시 시도해주세요.' });
      setUploadImages(false);
      return;
    }

    await Promise.all(
      urls.map(async (url, idx) => {
        await uploadToS3(url, uploadImages.imageFiles[newImageIdx[idx]]);
      }),
    );
    newImageIdx.forEach((idx, i) => (uploadImages.imageFiles[idx] = names[i]));

    const formData = new FormData();
    deleteImages.forEach(file => {
      formData.append('deleteFiles', file);
    });
    formData.append('imageUrls', JSON.stringify(uploadImages.imageFiles));
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
        <button className="bg-black text-white font-extrabold px-7 py-4 rounded ml-auto" onClick={handleUpload}>
          <p>업로드</p>
        </button>
      </div>
    </div>
  );
}
