'use client';
import getProductWithUser from '../_lib/getProductWithUser';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import Loading from '@/app/(main)/_components/Loading';
import { useModal } from '@/app/(main)/_components/ModalProvider';
import uploadToS3 from '@/lib/uploadToS3';
import getSignedUrls from '@/lib/getSignedUrls';
import ImageUploadButton from '@/app/(main)/_components/ProductForm/ImageUploadButton';
import TitleInput from '@/app/(main)/_components/ProductForm/TitleInput';
import Category from '@/app/(main)/_components/ProductForm/CategorySelector';
import Condition from '@/app/(main)/_components/ProductForm/ConditionSelector';
import DescriptionInput from '@/app/(main)/_components/ProductForm/DescriptionInput';
import PriceInput from '@/app/(main)/_components/ProductForm/PriceInput';
import OpenChatUrlInput from '@/app/(main)/_components/ProductForm/OpenChatUrlInput';
import HashTagInputWithTag from '@/app/(main)/_components/ProductForm/HashTagInputWithTag';
import ProductData from '@keynut/type/productData';
import validateProductForm from '@/app/(main)/sell/utils/validateProductForm';
import { EditUploadImagesProps } from './_type/editUploadImagesProps';
import DNDImages from './_components/DNDImages';

interface Image {
  name: string;
  width: number;
  height: number;
}

interface UploadImages {
  imageFiles: Image[];
  imageUrls: string[];
}

interface ImageDetails {
  name?: string;
  file?: File;
  width: number;
  height: number;
}

export default function Edit() {
  const { id } = useParams();
  const [uploadImages, setUploadImages] = useState<EditUploadImagesProps>({
    imageFiles: [],
    imageUrls: [],
  });
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState(1);
  const [subCategory, setSubCategory] = useState(10);
  const [condition, setCondition] = useState(1);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [openChatUrl, setOpenChatUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isValidOpenChat, setIsValidOpenChat] = useState(true);
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const invalidateFilters = useInvalidateFiltersQuery();
  const { openModal } = useModal();
  const { data } = useQuery<ProductData>({
    queryKey: ['product', id],
    queryFn: () => getProductWithUser(id as string),
    staleTime: Infinity,
  });

  console.log(uploadImages.imageFiles);

  useEffect(() => {
    const errorHandler = async () => {
      if (data === null) {
        await openModal({ message: '삭제된 상품입니다.' });
        router.back();
      }
    };
    errorHandler();
  }, [data, router]);

  useEffect(() => {
    const originalDataInit = async () => {
      if ((session && data && data.userId !== session.user.id) || status === 'unauthenticated') {
        await openModal({ message: '비정상적인 접근입니다.' });
        return router.push('/');
      } else if (data) {
        setTitle(data.title);
        const originalUploadImages: UploadImages = { imageFiles: [], imageUrls: [] };
        data.images.map((img) => {
          originalUploadImages.imageFiles.push(img);
          originalUploadImages.imageUrls.push(img.name);
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

    originalDataInit();
  }, [status, session, data]);

  const getImageDetails = (newImageIdx: number[]) => {
    return uploadImages.imageFiles.map((file, idx) => {
      if (file.name === undefined) {
        newImageIdx.push(idx);
        return {
          name: `product_${new Date().getTime()}_${file.file?.name}`,
          width: file.width,
          height: file.height,
        };
      } else return file;
    });
  };

  const batchUploadToS3 = async (urls: string[], newImageIdx: number[]) => {
    await Promise.all(
      urls.map((url, idx) => {
        const imageIdx = newImageIdx[idx];
        if (imageIdx === undefined) {
          return console.error(`newImageIdx[${idx}] is undefined`);
        }

        const file = uploadImages.imageFiles[imageIdx];
        if (!file) {
          return console.error(`uploadImages.imageFiles[${imageIdx}] is undefined`);
        }

        return uploadToS3(url, file);
      }),
    );
  };

  const generateFormData = (imageDetails: ImageDetails[]) => {
    const tempFrom = new FormData();
    deleteImages.forEach((file) => {
      tempFrom.append('deleteFiles', file);
    });
    tempFrom.append('imageDetails', JSON.stringify(imageDetails));
    tempFrom.append('title', title.replace(/ +/g, ' ').trim());
    tempFrom.append('subCategory', subCategory.toString());
    tempFrom.append('condition', condition.toString());
    tempFrom.append('description', description);
    tempFrom.append('openChatUrl', openChatUrl.trim());
    tempFrom.append('price', price.replaceAll(',', ''));
    tempFrom.append('tags', JSON.stringify(tags));
    tempFrom.append('id', id!.toString());
    return tempFrom;
  };

  const putProduct = async (formData: FormData) => {
    const res = await fetch('/api/products', {
      method: 'PUT',
      body: formData,
    });
    return res;
  };

  const uploadProduct = async (formData: FormData) => {
    const res = await putProduct(formData);
    if (res.ok) {
      update({ openChatUrl: openChatUrl });
      invalidateFilters(['product', id]);
      router.push(`/shop/product/${id}`);
      router.refresh();
      return;
    }

    if (res.status === 401) {
      await openModal({ message: '로그인이 만료되었습니다. 다시 로그인해 주세요.' });
      signIn();
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error);
    }
  };

  const getSignedUrlAndUploadImages = async (
    imageDetails: ImageDetails[],
    newImageIdx: number[],
  ) => {
    const { urls, status } = await getSignedUrls(
      imageDetails.filter((e, idx) => newImageIdx.includes(idx)),
    );
    if (status !== 200) {
      throw new Error('getSignedUrl 생성 실패');
    }
    await batchUploadToS3(urls!, newImageIdx);
  };

  const formGenerateAndUploadProduct = async (imageDetails: ImageDetails[]) => {
    const formData = generateFormData(imageDetails);
    await uploadProduct(formData);
  };

  const handleUpload = async () => {
    // 폼 양식 확인하고 모달 띄우기
    try {
      const result = await validateProductForm(
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
      if (!result) {
        return;
      }

      setUploadLoading(true);

      const newImageIdx: number[] = [];
      const imageDetails: ImageDetails[] = getImageDetails(newImageIdx);
      await getSignedUrlAndUploadImages(imageDetails, newImageIdx);
      await formGenerateAndUploadProduct(imageDetails);
    } catch (error) {
      console.error(error);
      await openModal({ message: '상품 업로드를 실패했습니다.\n나중에 다시 시도해주세요.' });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg px-10 mx-auto max-md:px-2 max-md:main-768">
      {uploadLoading && <Loading />}
      <ImageUploadButton uploadImages={uploadImages} setUploadImages={setUploadImages} />
      <DNDImages
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
        setDeleteImages={setDeleteImages}
      />
      <TitleInput title={title} setTitle={setTitle} />
      <HashTagInputWithTag tags={tags} setTags={setTags} />
      <div className="flex flex-1 justify-between my-3 max-md:flex-col">
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
