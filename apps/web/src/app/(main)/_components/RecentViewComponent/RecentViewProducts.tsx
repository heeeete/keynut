'use client';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { RecentViewContext } from './RecentViewContext';
import Link from 'next/link';
import ProductData from '@keynut/type/productData';
import { useUser } from '../UserProvider';

type SetRecentViewType = React.Dispatch<React.SetStateAction<ProductData[]>>;

const deleteViewProduct = (id: string, setRecentView: SetRecentViewType) => {
  const prev = JSON.parse(localStorage.getItem('recentView') || '[]');

  const updated = prev.filter((data: ProductData) => data._id !== id);

  localStorage.setItem('recentView', JSON.stringify(updated));
  setRecentView(updated);
};

interface ImageProps {
  name: string;
  width: number;
  height: number;
}

const RecentViewImage = ({ images }: { images: ImageProps[] }) => {
  return (
    <div className="w-16 aspect-square relative max-[960px]:rounded-full max-[960px]:w-11 max-[960px]:border max-[960px]:border-gray-300">
      <Image
        className="object-cover max-[960px]:rounded-full"
        src={
          images.length
            ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${images[0]!.name}`
            : '/noImage.svg'
        }
        alt="이미지"
        fill
        sizes="200px"
      />
    </div>
  );
};

const RecentViewTitleAndPrice = ({
  product,
  setRecentView,
}: {
  product: ProductData;
  setRecentView: SetRecentViewType;
}) => {
  return (
    <div className="hidden group-hover:flex flex-col justify-center text-sm absolute right-16 top-0 w-32 h-full border border-r-0 bg-white p-2">
      <p className="break-all line-clamp-1">{product.title}</p>
      <div className="space-x-1 break-all line-clamp-1 font-semibold">
        <span className="">{product.price.toLocaleString()}</span>
        <span className="text-sm">원</span>
      </div>
      <button
        className="absolute bg-black -top-1 -left-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteViewProduct(product._id, setRecentView);
        }}
      >
        <Image src="/close.svg" alt="deleteRecentView" width={15} height={15} />
      </button>
    </div>
  );
};

const RecentViewProduct = ({
  product,
  setRecentView,
}: {
  product: ProductData;
  setRecentView: SetRecentViewType;
}) => {
  return (
    <Link className="relative group" key={product._id} href={`/shop/product/${product._id}`}>
      <RecentViewImage images={product.images} />
      <RecentViewTitleAndPrice product={product} setRecentView={setRecentView} />
    </Link>
  );
};

const RecentViewProductMobile = ({
  product,
  showRecentViewMobile,
  setShowRecentViewMobile,
}: {
  product: ProductData;
  showRecentViewMobile: boolean;
  setShowRecentViewMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {showRecentViewMobile ? (
        <Link className="relative group" href={`/shop/product/${product._id}`}>
          <RecentViewImage images={product.images} />
        </Link>
      ) : (
        <button className="relative group" onClick={() => setShowRecentViewMobile(true)}>
          <RecentViewImage images={product.images} />
        </button>
      )}
    </>
  );
};

const CloseRecentViewBtn = ({
  showRecentView,
  setShowRecentView,
}: {
  showRecentView: boolean;
  setShowRecentView: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button
      className="flex justify-center"
      onClick={() => {
        setShowRecentView(!showRecentView);
      }}
    >
      {!showRecentView ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
          <path
            fill="gray"
            d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
          <path
            fill="gray"
            d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"
          />
        </svg>
      )}
    </button>
  );
};

const RecentViewProducts = () => {
  const context = useContext(RecentViewContext);
  if (!context) throw new Error('');
  const { recentViewChange, setRecentViewChange } = context;
  const [recentView, setRecentView] = useState<ProductData[]>([]);
  const [showRecentView, setShowRecentView] = useState(false);
  const [showRecentViewMobile, setShowRecentViewMobile] = useState(false);
  const { user } = useUser();
  const ref = useRef(null);

  useEffect(() => {
    let cur = localStorage.getItem('recentView');
    if (cur && cur.length) setRecentView(JSON.parse(cur));
    else setRecentView([]);
    setRecentViewChange(false);
  }, [recentViewChange]);

  return (
    <>
      {user.device.type === 'desktop' && (
        <>
          <CloseRecentViewBtn
            showRecentView={showRecentView}
            setShowRecentView={setShowRecentView}
          />
          <div className="flex flex-col w-24 min-h-30 p-2 rounded-md border bg-white border-gray-300 items-center">
            <p className="px-2 pb-1 mb-2 text-xs border-b text-gray-700 font-semibold relative">
              최근 본 상품
            </p>
            <div
              className={`flex flex-col space-y-3 transition-all duration-300 ${showRecentView ? 'max-h-0 overflow-hidden' : 'max-h-[500px]'}`}
            >
              {recentView && recentView.length ? (
                recentView.map((product) => (
                  <Fragment key={product._id}>
                    <RecentViewProduct product={product} setRecentView={setRecentView} />
                  </Fragment>
                ))
              ) : (
                <div className="p-5">
                  <Image src="/emptyRecentView.svg" alt="emptyView" height={30} width={30} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {user.device.type === 'mobile' && (
        <>
          {showRecentViewMobile ? (
            <button
              className="flex justify-center bg-white rounded-full w-11 items-center opacity-65 border  border-gray-300 mb-2"
              onClick={() => {
                setShowRecentViewMobile(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="gray"
                  d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
                />
              </svg>
            </button>
          ) : (
            ''
          )}
          <div ref={ref} className="flex flex-col space-y-1 min-[960px]:hidden">
            {recentView && recentView.length ? (
              <RecentViewProductMobile
                product={recentView[0]!}
                showRecentViewMobile={showRecentViewMobile}
                setShowRecentViewMobile={setShowRecentViewMobile}
              />
            ) : (
              ''
            )}
            <div
              className={`flex flex-col space-y-1 transition-all duration-300 ${showRecentViewMobile ? 'max-h-[500px]' : 'max-h-0 overflow-hidden'}`}
            >
              {recentView.slice(1).map((product) => (
                <Fragment key={product._id}>
                  <RecentViewProductMobile
                    product={product}
                    showRecentViewMobile={showRecentViewMobile}
                    setShowRecentViewMobile={setShowRecentViewMobile}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RecentViewProducts;
