'use client';
import getUserProducts from '@/lib/getUserProducts';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Fragment, Suspense, useCallback, useEffect, useState } from 'react';
import useProductStateMutation from '@/hooks/useProductStateMutaion';
import initRaiseCount from '@/lib/initRaiseCount';
import raiseProduct from '@/lib/raiseProduct';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '../../_components/Modal';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import Link from 'next/link';
import deleteProduct from '@/lib/deleteProduct';
import ProductEditSkeleton from '../_components/ProductEditSkeleton';
import timeAgo from '@/utils/timeAgo';
import DropdownMenu from '../../_components/DropdownMenu';
import { useModal } from '../../_components/ModalProvider';
import conditions from '../../_constants/conditions';

const UpButton = ({ state, raiseCount, raiseHandler, openModal }) => {
  const openUpModal = async () => {
    const res = await openModal({
      message: raiseCount ? `${raiseCount}회 사용 가능` : '사용 가능 회수를 초과하셨습니다.',
      subMessage: raiseCount ? `사용 시 1회 차감됩니다.` : '',
      isSelect: true,
    });
    if (!res) return;
    raiseHandler();
  };

  return (
    <>
      <button
        className={`px-2 font-medium border border-gray-300 rounded flex-nowrap whitespace-nowrap ${
          state !== 1 ? 'text-gray-300' : 'max-md:text-gray-600'
        } `}
        onClick={openUpModal}
        disabled={state === 0 || state === 2}
      >
        up
      </button>
    </>
  );
};

const DeleteButton = ({ setShowSetting, openDeleteModal }) => {
  return (
    <>
      <button
        className="px-2 font-medium border border-gray-300 text-red-400 rounded flex-nowrap whitespace-nowrap max-md:border-0 max-md:flex-1 max-md:w-full max-md:text-base max-md:font-semibold"
        onClick={() => {
          if (setShowSetting) setShowSetting(false);
          openDeleteModal();
        }}
      >
        삭제
      </button>
    </>
  );
};

const ModifyButton = ({ id }) => {
  return (
    <Link
      className="flex  items-center justify-center px-2 font-medium border border-gray-300 rounded flex-nowrap whitespace-nowrap max-md:flex-1 max-md:w-full max-md:border-0 max-md:border-b max-md:rounded-none max-md:text-base max-md:font-semibold"
      href={`/shop/product/${id}/edit`}
    >
      수정
    </Link>
  );
};

const SettingModal = ({ id, setShowSetting, openDeleteModal }) => {
  return (
    <div
      className="fixed w-screen custom-dvh top-0 left-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50"
      onClick={e => {
        if (e.currentTarget === e.target) setShowSetting(false);
      }}
    >
      <div className="flex flex-col items-center rounded-md border space-y-1 bg-white w-52 h-32">
        <ModifyButton id={id} />
        <DeleteButton setShowSetting={setShowSetting} openDeleteModal={openDeleteModal} />
      </div>
    </div>
  );
};

const SettingButton = ({ id, openDeleteModal }) => {
  const [showSetting, setShowSetting] = useState(false);
  return (
    <>
      <button
        className="md:hidden"
        onClick={() => {
          setShowSetting(true);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 1024 1024">
          <path
            fill="gray"
            d="M176 416a112 112 0 1 1 0 224a112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224a112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224a112 112 0 0 1 0-224"
          />
        </svg>
      </button>
      {showSetting ? <SettingModal id={id} setShowSetting={setShowSetting} openDeleteModal={openDeleteModal} /> : ''}
    </>
  );
};

const Product = ({ product, router, invalidateFilters, refetch, fetchRaiseCount, raiseCount, openModal }) => {
  const raiseHandler = async () => {
    await raiseProduct(product._id, () => {
      router.refresh();
      invalidateFilters();
      fetchRaiseCount();
      openModal({ message: '최상단으로 UP!', subMessage: `${raiseCount - 1}회 사용가능` });
    });
  };

  const openDeleteModal = useCallback(async () => {
    const res = await openModal({ message: '삭제하시겠습니까', isSelect: true });
    if (!res) return;

    await deleteProduct(product._id, () => {
      invalidateFilters();
      refetch();
    });
  }, [router, invalidateFilters, refetch]);

  return (
    <div className="flex space-x-3 border p-3 rounded relative mb-3 max-md:border-0 max-md:border-b max-md:border-gray-100 max-md:mb-0 max-md:py-4">
      <div className="w-28 aspect-square relative bg-gray-100 max-md:w-24">
        <Link href={`/shop/product/${product._id}`} className="after_selling">
          <Image
            className="rounded object-cover relative"
            src={product.images[0]}
            alt={product._id}
            fill
            sizes="(max-width:768px) 200px, 250px"
          />
          {product.state === 0 || product.state === 2 ? (
            <div className="absolute top-0 left-0 z-10 w-full h-full rounded bg-black opacity-70 flex items-center justify-center">
              <p className="font-semibold text-white text-lg max-md:text-base">
                {product.state === 0 ? '판매 완료' : '예약 중'}
              </p>
            </div>
          ) : (
            ''
          )}
          {product.images.length !== 1 && (
            <svg
              className="absolute right-1 top-1 opacity-90 max-md:w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 20 20"
            >
              <path
                fill="white"
                d="M6.085 4H5.05A2.5 2.5 0 0 1 7.5 2H14a4 4 0 0 1 4 4v6.5a2.5 2.5 0 0 1-2 2.45v-1.035a1.5 1.5 0 0 0 1-1.415V6a3 3 0 0 0-3-3H7.5a1.5 1.5 0 0 0-1.415 1M2 7.5A2.5 2.5 0 0 1 4.5 5h8A2.5 2.5 0 0 1 15 7.5v8a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 2 15.5z"
              />
            </svg>
          )}
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1">
        <div className="flex justify-between gap-4 mb-2">
          <Link href={`/shop/product/${product._id}`} className="break-all line-clamp-1">
            {product.title}
          </Link>
          <SettingButton id={product._id} openDeleteModal={openDeleteModal} />
        </div>
        <div className="flex items-end space-x-2 mb-2">
          <div className="space-x-1 font-semibold items-center line-clamp-1 break-all">
            <span>{product.price.toLocaleString()}</span>
            <span className="text-sm">원</span>
          </div>
          <p className="text-gray-500 text-sm flex items-center leading-normal max-md:text-xs  max-md:leading-relaxed max-md:font-medium">
            {conditions[product.condition].option}
          </p>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex space-x-2 text-sm max-md:space-x-1">
            <DropdownMenu state={product.state} id={product._id} />
            <UpButton state={product.state} raiseCount={raiseCount} raiseHandler={raiseHandler} openModal={openModal} />
            <div className="flex  space-x-2 max-md:hidden">
              <ModifyButton id={product._id} />
              <DeleteButton openDeleteModal={openDeleteModal} />
            </div>
          </div>
          <div className="flex items-center space-x-2 max-md:space-x-1">
            <p className="text-gray-400 text-sm max-md:text-xs">{timeAgo(product.createdAt)}</p>
            <div className="flex justify-center items-center">
              <div className="md:w-4 max-md:w-3">
                <svg className="" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32">
                  <path
                    stroke="lightgray"
                    fill="lightgray"
                    d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
                  />
                </svg>
              </div>
              <p className=" text-gray-400 text-sm max-md:text-xs">
                {product.bookmarked ? product.bookmarked.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ProductEdit() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const { openModal } = useModal();
  const [raiseCount, setRaiseCount] = useState(0);
  const fetchRaiseCount = initRaiseCount(setRaiseCount);
  const invalidateFilters = useInvalidateFiltersQuery();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });
  const productState = params.get('state') === null ? 3 : Number(params.get('state'));

  const updateURL = useCallback(state => {
    if (state === 'all') return router.push(window.location.pathname);
    const currentParams = new URLSearchParams(params.toString());
    currentParams.set('state', state);
    const newURL = `${window.location.pathname}?${currentParams.toString()}`;
    router.push(newURL);
  }, []);

  useEffect(() => {
    fetchRaiseCount();
  }, []);

  return (
    <div className="flex justify-start flex-col max-w-screen-lg mx-auto px-10 max-md:px-0 max-md:mt-12 md:min-h-70vh">
      <div className="sticky top-16 z-40 flex space-x-2 pb-2 pt-3 bg-white mb-2 max-md:text-sm max-md:px-3 max-md:top-0 max-md:mb-0 max-md:border-b">
        <button
          className={`px-2 py-1 border border-black ${productState === 3 ? 'bg-black text-white ' : ''} rounded`}
          onClick={() => updateURL('all')}
        >
          전체 {data?.userProducts.length}
        </button>
        <button
          className={`px-2 py-1 border border-black rounded ${productState === 1 ? 'bg-black text-white ' : ''}`}
          onClick={() => updateURL(1)}
        >
          판매중 {data?.userProducts.filter(a => a.state === 1).length}
        </button>
        <button
          className={`px-2 py-1 border border-black rounded ${productState === 2 ? 'bg-black text-white ' : ''}`}
          onClick={() => updateURL(2)}
        >
          예약 중 {data?.userProducts.filter(a => a.state === 2).length}
        </button>
        <button
          className={`px-2 py-1 border border-black rounded ${productState === 0 ? 'bg-black text-white ' : ''}`}
          onClick={() => updateURL(0)}
        >
          판매완료 {data?.userProducts.filter(a => a.state === 0).length}
        </button>
      </div>

      {!data ? (
        <ProductEditSkeleton />
      ) : (
        <div className="flex flex-col max-md:text-sm">
          {productState === 3 ? (
            data.userProducts.length ? (
              data.userProducts.map((product, idx) => (
                <Fragment key={idx}>
                  <Product
                    product={product}
                    router={router}
                    invalidateFilters={invalidateFilters}
                    refetch={refetch}
                    raiseCount={raiseCount}
                    fetchRaiseCount={fetchRaiseCount}
                    openModal={openModal}
                  />
                </Fragment>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1 md:h-50vh max-md: h-52">
                <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 256 256">
                  <path
                    fill="lightgray"
                    d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24M158 46.48L193.52 82H158ZM202 216a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50Zm-45.76-92.24a6 6 0 0 1 0 8.48L136.49 152l19.75 19.76a6 6 0 1 1-8.48 8.48L128 160.49l-19.76 19.75a6 6 0 0 1-8.48-8.48L119.51 152l-19.75-19.76a6 6 0 1 1 8.48-8.48L128 143.51l19.76-19.75a6 6 0 0 1 8.48 0"
                  />
                </svg>
                <p className="text-gray-300 font-medium">등록된 상품이 없습니다</p>
              </div>
            )
          ) : data.userProducts.filter(a => a.state === productState).length ? (
            data.userProducts
              .filter(a => a.state === productState)
              .map((product, idx) => (
                <Fragment key={idx}>
                  <Product
                    product={product}
                    router={router}
                    invalidateFilters={invalidateFilters}
                    refetch={refetch}
                    raiseCount={raiseCount}
                    fetchRaiseCount={fetchRaiseCount}
                    openModal={openModal}
                  />
                </Fragment>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 md:h-50vh max-md:h-52">
              <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 256 256">
                <path
                  fill="lightgray"
                  d="m212.24 83.76l-56-56A6 6 0 0 0 152 26H56a14 14 0 0 0-14 14v176a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14V88a6 6 0 0 0-1.76-4.24M158 46.48L193.52 82H158ZM202 216a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2V40a2 2 0 0 1 2-2h90v50a6 6 0 0 0 6 6h50Zm-45.76-92.24a6 6 0 0 1 0 8.48L136.49 152l19.75 19.76a6 6 0 1 1-8.48 8.48L128 160.49l-19.76 19.75a6 6 0 0 1-8.48-8.48L119.51 152l-19.75-19.76a6 6 0 1 1 8.48-8.48L128 143.51l19.76-19.75a6 6 0 0 1 8.48 0"
                />
              </svg>
              <p className="text-gray-300 font-medium">
                {productState === 1
                  ? '판매 중인 상품이 없습니다'
                  : productState === 0
                  ? '판매 완료된 상품이 없습니다'
                  : '예약 중인 상품이 없습니다'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ProductEdit />
    </Suspense>
  );
}
