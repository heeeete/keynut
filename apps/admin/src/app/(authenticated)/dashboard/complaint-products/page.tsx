'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { useNav } from '../_contexts/NavContext';
import renderEmptyRows from '../_utils/renderEmptyRows';
import useComplaintProductsQuery from '../_hooks/useComplaintProductsQuery';
import Link from 'next/link';
import { KakaoAccounts, NaverAccounts } from '@keynut/type/accounts';
import Loading from '@keynut/ui/Loading';
import User from '@keynut/type/user';
import ProductData from '@keynut/type/productData';
import deleteProduct from '@keynut/lib/deleteProduct';
import userBanHandler from '@keynut/lib/userBanHandler';

interface SelectedProduct {
  _id: string;
}

interface SelectedProducts {
  [key: string]: SelectedProduct;
}

interface Data extends ProductData {
  userAccount: NaverAccounts | KakaoAccounts;
  userInfo: Partial<User>;
}

const PAGE_SIZE = 100;

// interface ProductsType {
//   products: Data[] | [];
// }

interface TaskbarProps {
  selectedProducts: SelectedProducts;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataRefetch: () => void;
}

const Taskbar = ({ selectedProducts, setIsLoading, dataRefetch }: TaskbarProps) => {
  const onClickDelete = async () => {
    setIsLoading(true);
    const formData = new FormData();
    const ids = Object.values(selectedProducts).map((item) => item._id);
    formData.append('products', JSON.stringify(ids));
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        body: formData,
      });
      if (!res.ok) return alert('상품 삭제중 문제가 발생했습니다.');
      return dataRefetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sticky top-10 space-y-2 justify-center border-x px-4 py-2 bg-slate-100">
      <div className="flex space-x-4 justify-between h-9">
        {/* <AllProductsCnt userCnt={data?.total} /> */}
        <div className="flex space-x-4">
          <button className="px-2 py-1 border border-black rounded bg-white" onClick={dataRefetch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="rgb(55 65 81)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
                <path d="M20 4v5h-5" />
              </g>
            </svg>
          </button>
          <button
            onClick={onClickDelete}
            className="px-2 py-1 border border-black rounded bg-white text-gray-700 font-semibold line-clamp-1"
          >
            삭제
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div></div>
        {/* <PageControl page={page} data={data} /> */}
      </div>
    </div>
  );
};

interface TableProps {
  data: { products: [] | Data[] } | undefined;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProducts: SelectedProducts;
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProducts | {}>>;
  setDetailProduct: React.Dispatch<React.SetStateAction<Data | null>>;
  setIsDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Table = ({
  data,
  selectAll,
  setSelectAll,
  selectedProducts,
  setSelectedProducts,
  setDetailProduct,
  setIsDetailModal,
}: TableProps) => {
  console.log(data);
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedProducts({});
    } else {
      const obj: Record<string, { _id: string }> = {};
      let i = 0;
      for (let { _id } of data?.products ?? []) {
        obj[i++] = {
          _id: _id,
        };
      }
      setSelectedProducts(obj);
    }
    setSelectAll(!selectAll);
  }, [selectAll, selectedProducts, data]);

  const handleSelectUser = useCallback(
    (idx: number, userId: string) => {
      if (selectedProducts[idx]) {
        const newObj = { ...selectedProducts };
        delete newObj[idx];
        setSelectedProducts(newObj);
      } else {
        const newObj = { ...selectedProducts };
        newObj[idx] = {
          _id: userId,
        };
        setSelectedProducts(newObj);
      }
    },
    [selectedProducts],
  );

  const onClickProduct = (e: React.MouseEvent, product: Data) => {
    setDetailProduct(product);
    setIsDetailModal(true);
  };

  return (
    <table className="w-full bg-slate-50 table-auto border-x border-separate border-spacing-0">
      <thead className=" bg-slate-50 sticky top-32 text-lg h-10">
        <tr>
          <th className="border-b-2 border-r">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Nickname</div>
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Title</div>
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Price</div>
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Views</div>
          </th>
          <th className="border-b-2" style={{ width: '19%' }}>
            <div>ComplaintsCount</div>
          </th>
        </tr>
      </thead>
      <tbody className="text-lg">
        {data
          ? data?.products?.map((product, idx) => (
              <tr className="text-center h-9" key={idx}>
                <td className="border-b">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={Boolean(selectedProducts[idx])}
                      onChange={() => handleSelectUser(idx, product._id)}
                    />
                  </div>
                </td>
                <td className="border-b">
                  <button
                    className="text-blue-700 underline"
                    onClick={(e) => onClickProduct(e, product)}
                  >
                    {product.userInfo.nickname}
                  </button>
                </td>
                <td className="border-b">
                  <button
                    className="text-blue-700 underline"
                    onClick={(e) => onClickProduct(e, product)}
                  >
                    {product.title}
                  </button>
                </td>
                <td className="border-b">{product.price.toLocaleString()} 원</td>
                <td className="border-b">{product.views}</td>
                <td className="border-b">{product.complain.length}</td>
              </tr>
            ))
          : renderEmptyRows()}
      </tbody>
    </table>
  );
};

// const AllProductsCnt = ({ userCnt }: { userCnt: number }) => {
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     const initTotal = () => {
//       setTotal(userCnt);
//     };
//     if (userCnt || userCnt === 0) initTotal();
//   }, [userCnt]);

//   return (
//     <div className="flex text-lg">
//       <p className="font-semibold whitespace-nowrap">신고 게시물&nbsp;</p>
//       <p className="text-gray-600">({total})</p>
//     </div>
//   );
// };

interface DetailModalProps {
  setIsDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  detailProduct: Data;
}

const DetailModal = ({ setIsDetailModal, detailProduct }: DetailModalProps) => {
  return (
    <div
      className="fixed left-0 top-0 flex justify-center items-center w-d-screen custom-dvh bg-black bg-opacity-50 z-90"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsDetailModal(false);
      }}
    >
      <div className="max-w-70vh w-full h-70vh bg-white overflow-auto space-y-3">
        <p>상품명: {detailProduct.title}</p>
        <p>상품설명: {detailProduct.description}</p>
        <div>
          <h3 className="text-center">신고사항</h3>
          <div className="space-y-3">
            {detailProduct.complain.map((data, idx) => {
              return (
                <div key={idx}>
                  <p>{data.category}</p>
                  <p>{data.text}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <button
            className="border"
            onClick={async () => {
              const { email } = detailProduct.userInfo;
              const status = await userBanHandler(email as string, 0);
              if (status === 200) alert('성공');
              else alert('실패');
            }}
          >
            회원정지
          </button>
          <button
            className="border"
            onClick={async () => {
              const { _id } = detailProduct;
              const status = await deleteProduct(_id);
              if (status === 200) alert('성공');
              else alert('실패');
            }}
          >
            게시물 삭제
          </button>
          <Link href={`/shop/product/${detailProduct._id}`} className="border">
            게시물 바로가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');
  const { data, refetch } = useComplaintProductsQuery(page, PAGE_SIZE);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts | {}>({});
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Data | null>(null);
  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);
  const { navStatus } = useNav();

  useEffect(() => {
    setSelectAll(false);
    setSelectedProducts({});
  }, [page]);

  const dataRefetch = () => {
    setSelectAll(false);
    setSelectedProducts({});
    refetch();
  };

  return (
    <div className={`${navStatus ? 'pl-72' : 'pl-14'} w-full h-full`}>
      <div
        className={`${navStatus ? 'max-w-screen-xl' : 'max-w-screen-2xl'} w-full mx-auto h-full `}
      >
        <article className="py-7 h-full">
          <Taskbar
            selectedProducts={selectedProducts}
            setIsLoading={setIsLoading}
            dataRefetch={dataRefetch}
          />
          <Table
            data={data}
            selectAll={selectAll}
            selectedProducts={selectedProducts}
            setSelectAll={setSelectAll}
            setSelectedProducts={setSelectedProducts}
            setDetailProduct={setDetailProduct}
            setIsDetailModal={setIsDetailModal}
          />
        </article>
      </div>
      {isLoading && <Loading />}
      {isDetailModal && (
        <DetailModal setIsDetailModal={setIsDetailModal} detailProduct={detailProduct as Data} />
      )}
    </div>
  );
}
