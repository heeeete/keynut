'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Loading from '../_components/Loading';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import getUserProfile from '@/lib/getUserProfile';
import { useModal } from '../_components/ModalProvider';
import getSignedUrls from '@/lib/getSignedUrls';
import uploadToS3 from '@/lib/uploadToS3';
import ImageUploadButton from '@/app/(main)/_components/ProductForm/ImageUploadButton';
import TitleInput from '@/app/(main)/_components/ProductForm/TitleInput';
import Category from '@/app/(main)/_components/ProductForm/CategorySelector';
import Condition from '@/app/(main)/_components/ProductForm/ConditionSelector';
import DescriptionInput from '@/app/(main)/_components/ProductForm/DescriptionInput';
import PriceInput from '@/app/(main)/_components/ProductForm/PriceInput';
import OpenChatUrlInput from '@/app/(main)/_components/ProductForm/OpenChatUrlInput';
import HashTagInputWithTag from '@/app/(main)/_components/ProductForm/HashTagInputWithTag';
import { UploadImagesProps } from './_type/uploadImagesProps';
import DNDImages from './_components/DNDImages';
import validateProductForm from './utils/validateProductForm';
import useAutoSaveDraft from './_hooks/useAutoSaveDraft';
import useValidateAndRemoveDraft from './_hooks/useValidateAndRemoveDraft';

interface ImageDetails {
  name: string;
  width: number;
  height: number;
}

interface Draft {
  condition: number;
  description: string;
  mainCategory: number;
  openChatUrl: string;
  price: string;
  subCategory: number;
  tags: string[];
  title: string;
}

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
  const [tags, setTags] = useState<string[]>([]);
  const [isValidOpenChat, setIsValidOpenChat] = useState(true);
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const invalidateFilters = useInvalidateFiltersQuery();
  const isInitialRender = useRef<boolean>(true); // 첫 번째 렌더링인지 확인하는 ref
  const { openModal } = useModal();

  // 자동 임시저장
  useAutoSaveDraft(isInitialRender, {
    title,
    mainCategory,
    subCategory,
    condition,
    description,
    price,
    openChatUrl,
    tags,
  });
  // 폼이 비면 Draft 객체 삭제
  useValidateAndRemoveDraft();

  // 처음 페이지 진입시 초안 체크
  useEffect(() => {
    const checkAndRestoreDraft = async () => {
      const draft = sessionStorage.getItem('draft');
      if (!draft) {
        return;
      }

      const parseDraft: Draft = JSON.parse(draft);
      if (!parseDraft) {
        return;
      }

      const proceed = await openModal({
        message: '이전에 작성 중인 글이 있습니다.',
        subMessage: '이어서 작성하시겠습니까?',
        isSelect: true,
      });
      if (proceed) {
        setTitle(parseDraft.title);
        setMainCategory(parseDraft.mainCategory);
        setSubCategory(parseDraft.subCategory);
        setCondition(parseDraft.condition);
        setDescription(parseDraft.description);
        setPrice(parseDraft.price);
        setOpenChatUrl(parseDraft.openChatUrl);
        setTags(parseDraft.tags);
      } else sessionStorage.removeItem('draft');
    };

    const updateOpenChatUrl = async () => {
      const user = await getUserProfile(session!.user.id!);
      if (session?.user.openChatUrl !== user?.openChatUrl)
        update({ openChatUrl: user?.openChatUrl });
      setOpenChatUrl(user?.openChatUrl || '');
    };

    const initializeData = async () => {
      if (status !== 'loading' && status === 'unauthenticated') return signIn();
      if (status === 'authenticated') {
        await updateOpenChatUrl();
        await checkAndRestoreDraft();
        isInitialRender.current = false;
      }
    };

    initializeData();
  }, [status]);

  const getImageDetails = () => {
    return uploadImages.imageFiles.map((file) => ({
      name: `product_${new Date().getTime()}_${file.file.name}`,
      width: file.width,
      height: file.height,
    }));
  };

  const batchUploadToS3 = async (urls: string[]) => {
    await Promise.all(urls.map((url, idx) => uploadToS3(url, uploadImages.imageFiles[idx]!)));
  };

  const generationFormData = (imageDetails: ImageDetails[]) => {
    const tempFrom = new FormData();
    tempFrom.append('imageDetails', JSON.stringify(imageDetails));
    tempFrom.append('title', title.replace(/ +/g, ' ').trim());
    tempFrom.append('subCategory', subCategory.toString());
    tempFrom.append('condition', condition.toString());
    tempFrom.append('description', description);
    tempFrom.append('openChatUrl', openChatUrl.trim());
    tempFrom.append('price', price.replaceAll(',', ''));
    tempFrom.append('tags', JSON.stringify(tags));
    return tempFrom;
  };

  const postProduct = async (formData: FormData) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });
    return res;
  };

  const uploadProduct = async (formData: FormData) => {
    const res = await postProduct(formData);
    const data = await res.json();
    if (res.ok) {
      update({ openChatUrl: openChatUrl });
      sessionStorage.removeItem('draft');
      if (data) {
        invalidateFilters();
        router.push(`/shop/product/${data.insertedId}`);
        router.refresh();
      }
      return;
    }
    if (res.status === 401) {
      await openModal({ message: '로그인이 만료되었습니다.\n다시 로그인해 주세요.' });
      return signIn();
    }
    if (res.status === 403 && data.error === 'Your account has been banned.') {
      return router.push(`/auth/error?error=${encodeURIComponent(data.error)}`);
    }
    console.error(data.error);
    await openModal({ message: '상품 업로드를 실패했습니다.\n나중에 다시 시도해주세요.' });
  };

  const getSignedUrlAndUploadImages = async (imageDetails: ImageDetails[]) => {
    const { urls, status } = await getSignedUrls(imageDetails);
    if (status !== 200) {
      throw new Error('이미지 URL 생성 실패');
    }
    await batchUploadToS3(urls as string[]);
  };

  const formGenerateAndUploadProduct = async (imageDetails: ImageDetails[]) => {
    const formData = generationFormData(imageDetails);
    await uploadProduct(formData);
  };

  const handleUpload = async () => {
    try {
      // 폼 검증
      const isFormValid = await validateProductForm(
        uploadImages,
        title,
        mainCategory,
        subCategory,
        price,
        condition,
        description,
        openChatUrl,
        isValidOpenChat,
        openModal,
      );
      if (!isFormValid) return;

      setIsLoading(true);

      const imageDetails = getImageDetails();
      await getSignedUrlAndUploadImages(imageDetails);
      await formGenerateAndUploadProduct(imageDetails);
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg px-10 mx-auto max-[960px]:px-10 max-md:px-2 max-[960px]:main-768 max-[960px]:mb-5">
      {isLoading && <Loading />}
      <p className="min-[960px]:mt-10 font-medium text-xl max-[480px]:text-base">
        사진<span className="text-red-500">*</span>
      </p>
      <ImageUploadButton uploadImages={uploadImages} setUploadImages={setUploadImages} />
      <DNDImages uploadImages={uploadImages} setUploadImages={setUploadImages} />
      <TitleInput title={title} setTitle={setTitle} />
      <HashTagInputWithTag tags={tags} setTags={setTags} />
      <div className="flex flex-1 justify-between my-3 max-[960px]:flex-col">
        <Category
          mainCategory={mainCategory}
          subCategory={subCategory}
          setMainCategory={setMainCategory}
          setSubCategory={setSubCategory}
        />
        <Condition condition={condition} setCondition={setCondition} />
      </div>

      <DescriptionInput
        description={description}
        setDescription={setDescription}
        subCategory={subCategory}
      />
      <OpenChatUrlInput
        openChatUrl={openChatUrl}
        setOpenChatUrl={setOpenChatUrl}
        isValidOpenChat={isValidOpenChat}
        setIsValidOpenChat={setIsValidOpenChat}
      />
      <PriceInput price={price} setPrice={setPrice} />

      <div className="w-full flex justify-end">
        <button
          className="bg-black text-white font-extrabold px-7 py-4 rounded ml-auto"
          onClick={handleUpload}
        >
          <p>업로드</p>
        </button>
      </div>
    </div>
  );
}
