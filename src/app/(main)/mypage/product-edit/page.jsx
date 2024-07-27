'use client';
import getUserProducts from '@/lib/getUserProducts';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import useProductStateMutation from '@/hooks/useProductStateMutaion';
import initRaiseCount from '@/lib/initRaiseCount';
import raiseProduct from '@/lib/raiseProduct';
import { useRouter } from 'next/navigation';
import Modal from '../../_components/Modal';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import Link from 'next/link';
import deleteProduct from '@/lib/deleteProduct';
import ProductEditSkeleton from '../_components/ProductEditSkeleton';
import timeAgo from '@/utils/timeAgo';

const UpButton = ({ id, state, router, invalidateFilters }) => {
  const [raiseCount, setRaiseCount] = useState(0);
  const [upModal, setUpModal] = useState(false);
  const fetchRaiseCount = initRaiseCount(setRaiseCount);
  const raiseHandler = async () => {
    await raiseProduct(id, () => {
      router.refresh();
      invalidateFilters();
      fetchRaiseCount();
      alert(`최상단으로 UP!\n${raiseCount - 1}회 사용가능`);
      setUpModal(false);
    });
  };
  useEffect(() => {
    fetchRaiseCount();
  }, []);

  return (
    <>
      <button
        className={`px-2 font-medium border border-gray-300 rounded flex-nowrap whitespace-nowrap ${
          state === 0 ? 'text-gray-300' : 'max-md:text-gray-600'
        } `}
        onClick={() => {
          setUpModal(true);
        }}
        disabled={state === 0}
      >
        up
      </button>
      {upModal && (
        <Modal
          message={raiseCount ? `${raiseCount}회 사용 가능` : '사용 가능 회수를 초과하셨습니다.'}
          subMessage={raiseCount ? `사용 시 1회 차감됩니다.` : ''}
          modalSet={setUpModal}
          yesCallback={raiseCount ? raiseHandler : null}
        />
      )}
    </>
  );
};

const DropdownMenu = ({ product, router }) => {
  const [dropMenu, setDropMenu] = useState(false);

  const { onClickSelling, onClickSellCompleted } = useProductStateMutation();
  return (
    <button
      id="dropDown"
      className="flex w-85 h-8 justify-between px-2 font-medium border border-gray-300 rounded flex-nowrap whitespace-nowrap items-center relative max-md:text-gray-600"
      onClick={() => {
        setDropMenu(!dropMenu);
      }}
    >
      <p>{product.state === 1 ? '판매중' : '판매완료'}</p>
      {dropMenu ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.8em"
          height="0.8em"
          viewBox="0 0 1024 1024"
          transform="rotate(180)"
        >
          <path
            fill="black"
            d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
          <path
            fill="black"
            d="M831.872 340.864L512 652.672L192.128 340.864a30.59 30.59 0 0 0-42.752 0a29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728a30.59 30.59 0 0 0-42.752 0z"
          />
        </svg>
      )}

      <div
        className={`absolute -bottom-8 border left-0 w-full h-full px-2 items-center rounded shadow bg-white text-gray-400 ${
          dropMenu ? 'flex' : 'hidden'
        }`}
        onClick={() => {
          if (product.state === 1) {
            onClickSellCompleted(product._id, product.state);
          } else onClickSelling(product._id, product.state);
        }}
      >
        {product.state ? '판매완료' : '판매중'}
      </div>
    </button>
  );
};

const DeleteButton = ({ id, router, invalidateFilters, refetch, setShowSetting, setShowModal }) => {
  return (
    <>
      <button
        className="px-2 font-medium border border-gray-300 text-red-400 rounded flex-nowrap whitespace-nowrap max-md:border-0 max-md:flex-1 max-md:w-full max-md:text-base max-md:font-semibold"
        onClick={() => {
          if (setShowSetting) setShowSetting(false);
          setShowModal(true);
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

const SettingModal = ({ id, router, invalidateFilters, refetch, setShowSetting, setShowModal }) => {
  return (
    <div
      className="fixed w-screen custom-dvh top-0 left-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50"
      onClick={e => {
        if (e.currentTarget === e.target) setShowSetting(false);
      }}
    >
      <div className="flex flex-col items-center rounded-md border space-y-1 bg-white w-52 h-32">
        <ModifyButton id={id} />
        <DeleteButton
          id={id}
          router={router}
          invalidateFilters={invalidateFilters}
          refetch={refetch}
          setShowSetting={setShowSetting}
          setShowModal={setShowModal}
        />
      </div>
    </div>
  );
};

const SettingButton = ({ id, router, invalidateFilters, refetch, setShowModal }) => {
  const [showSetting, setShowSetting] = useState(false);
  return (
    <>
      <button
        className="md:hidden"
        onClick={() => {
          setShowSetting(true);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 1024 1024">
          <path
            fill="gray"
            d="M176 416a112 112 0 1 1 0 224a112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224a112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224a112 112 0 0 1 0-224"
          />
        </svg>
      </button>
      {showSetting ? (
        <SettingModal
          id={id}
          router={router}
          invalidateFilters={invalidateFilters}
          refetch={refetch}
          setShowSetting={setShowSetting}
          setShowModal={setShowModal}
        />
      ) : (
        ''
      )}
    </>
  );
};

const Product = ({ product, router, invalidateFilters, refetch }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteHandler = useCallback(async () => {
    await deleteProduct(product._id, () => {
      invalidateFilters();
      refetch();
    });
  }, [router, invalidateFilters, refetch]);

  return (
    <>
      <div className="flex space-x-3 border p-3 rounded relative mb-3 max-md:border-0 max-md:border-b max-md:border-gray-100 max-md:mb-0 max-md:py-4">
        <div className="w-28 aspect-square relative bg-gray-100 max-md:w-24">
          <Link href={`/shop/product/${product._id}`}>
            <Image
              className="rounded object-cover"
              src={product.images[0]}
              alt={product._id}
              fill
              sizes="(max-width:768px) 200px,(max-width:1280px) 20vw, (max-width:1500px) 20vw, 250px"
            />
          </Link>
          {product.state === 0 ? (
            <Link
              href={`/shop/product/${product._id}`}
              className="absolute top-0 left-0 z-10 w-full h-full rounded bg-black opacity-70 flex items-center justify-center"
            >
              <p className="font-semibold text-white text-lg">판매 완료</p>
            </Link>
          ) : (
            ''
          )}
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex justify-between gap-4">
            <p className="break-all line-clamp-1">{product.title}</p>
            <SettingButton
              id={product._id}
              router={router}
              invalidateFilters={invalidateFilters}
              refetch={refetch}
              setShowModal={setShowModal}
            />
          </div>
          <div className="space-x-1 font-semibold items-center line-clamp-1 break-all mb-2">
            <span>{product.price.toLocaleString()}</span>
            <span className="text-sm">원</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 text-sm max-md:space-x-1">
              <DropdownMenu product={product} />
              <UpButton id={product._id} state={product.state} router={router} invalidateFilters={invalidateFilters} />
              <div className="flex  space-x-2 max-md:hidden">
                <ModifyButton id={product._id} />
                <DeleteButton
                  id={product._id}
                  router={router}
                  invalidateFilters={invalidateFilters}
                  refetch={refetch}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 max-md:space-x-1">
              <p className="text-gray-400 text-sm max-md:text-xs">{timeAgo(product.createdAt)}</p>
              <div className="flex justify-center items-center">
                <svg className="" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 32 32">
                  <path
                    stroke="lightgray"
                    fill="lightgray"
                    d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
                  />
                </svg>
                <p className=" text-gray-400 text-sm max-md:text-xs">
                  {product.bookmarked ? product.bookmarked.length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal ? <Modal message={'삭제하시겠습니까?'} yesCallback={deleteHandler} modalSet={setShowModal} /> : ''}
    </>
  );
};

export default function ProductEdit() {
  const { data: session, status } = useSession();
  const [productState, setProductState] = useState(2);
  const router = useRouter();
  const invalidateFilters = useInvalidateFiltersQuery();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userProducts', session?.user?.id],
    queryFn: () => getUserProducts(session?.user?.id),
    enabled: status === 'authenticated' && !!session?.user?.id,
  });

  // console.log(isLoading);

  return (
    <div className="flex justify-start flex-col max-w-screen-lg mx-auto px-10 max-md:px-0 max-md:mt-12 md:min-h-70vh">
      <div className="sticky top-16 z-40 flex space-x-2 pb-2 pt-3 bg-white mb-2 max-md:text-sm max-md:px-3 max-md:top-0 max-md:mb-0 max-md:border-b">
        <button
          className={`px-2 py-1 border border-black ${productState === 2 ? 'bg-black text-white ' : ''} rounded`}
          onClick={() => {
            if (productState !== 2) setProductState(2);
          }}
        >
          전체 {data?.userProducts.length}
        </button>
        <button
          className={`px-2 py-1 border border-black rounded ${productState === 1 ? 'bg-black text-white ' : ''}`}
          onClick={() => {
            if (productState !== 1) setProductState(1);
          }}
        >
          판매중 {data?.userProducts.filter(a => a.state === 1).length}
        </button>
        <button
          className={`px-2 py-1 border border-black rounded ${productState === 0 ? 'bg-black text-white ' : ''}`}
          onClick={() => {
            if (productState !== 0) setProductState(0);
          }}
        >
          판매완료 {data?.userProducts.filter(a => a.state === 0).length}
        </button>
      </div>

      {!data ? (
        // <></>
        <ProductEditSkeleton />
      ) : (
        <div className="flex flex-col max-md:text-sm">
          {productState === 2 ? (
            data.userProducts.length ? (
              data.userProducts.map((product, idx) => (
                <Fragment key={idx}>
                  <Product product={product} router={router} invalidateFilters={invalidateFilters} refetch={refetch} />
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
                  <Product product={product} router={router} invalidateFilters={invalidateFilters} refetch={refetch} />
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
                {productState === 1 ? '판매 중인 상품이 없습니다' : '판매 완료된 상품이 없습니다'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
