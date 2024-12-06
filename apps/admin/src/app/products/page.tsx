'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { useNav } from '../_contexts/NavContext';
import renderEmptyRows from '../_utils/renderEmptyRows';
import Loading from '@keynut/ui/Loading';
import useProducts from '../_hooks/useProducts';
import useURLSearchParams from '@/hooks/useURLSearchParams';
import ProductData from '@keynut/type/productData';

const PAGE_SIZE = 100;
const PAGE_RANGE = 10;

interface ExtendedProductData extends ProductData {
  nickname: string;
}

interface Data {
  products: ExtendedProductData[];
  total: number;
}

interface PageControlProps {
  page: number;
  data: Data;
}

const PageControl = ({ page, data }: PageControlProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const totalPages = Math.ceil(data?.total / PAGE_SIZE);
  const [pageRange, setPageRange] = useState({ start: 1, end: PAGE_RANGE });

  useEffect(() => {
    if (totalPages)
      if (page > totalPages) {
        params.set('page', '1');
        router.push(`/admin/products?${params.toString()}`);
      }
  }, [totalPages]);

  useEffect(() => {
    const initTotalPage = () => {
      if (data) {
        const newStart = ~~((page - 1) / PAGE_RANGE) * PAGE_RANGE + 1;
        const newEnd = Math.min(newStart + PAGE_RANGE - 1, totalPages);
        setPageRange({ start: newStart, end: newEnd });
      }
    };
    initTotalPage();
  }, [data]);

  const updatePage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      params.set('page', newPage.toString());
      router.push(`/admin/products?${params.toString()}`);
    },
    [totalPages],
  );

  return (
    <div className="flex space-x-2">
      <button onClick={() => updatePage(page - 1)} disabled={page <= 1}>
        <img src="/admin/adminPrevPage.svg" alt="adminPrevPage" />
      </button>
      <div className="flex space-x-2">
        {Array(pageRange.end - pageRange.start + 1 >= 0 ? pageRange.end - pageRange.start + 1 : 0)
          .fill(0)
          .map((_, idx) => {
            const pageNumber = pageRange.start + idx;
            return (
              <button
                key={pageNumber}
                onClick={() => updatePage(pageNumber)}
                className={`${
                  page === pageNumber ? 'font-bold border text-black' : 'text-gray-600'
                } px-2 py-1 font-semibold`}
              >
                {pageNumber}
              </button>
            );
          })}
      </div>
      <button onClick={() => updatePage(page + 1)}>
        <img src="/admin/adminNextPage.svg" alt="adminNextPage" />
      </button>
    </div>
  );
};

interface TaskBarProps {
  data: Data;
  page: number;
  selectedProducts: SelectedProducts | {};
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataRefetch: () => void;
}

const Taskbar = ({ data, page, selectedProducts, setIsLoading, dataRefetch }: TaskBarProps) => {
  const onClickDelete = async () => {
    setIsLoading(true);
    const formData = new FormData();
    const ids = Object.values(selectedProducts).map((item) => item._id);
    formData.append('products', JSON.stringify(ids));
    try {
      const res = await fetch('/api/admin/products', {
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
        <AllProductsCnt userCnt={data?.total} />
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
        <PageControl page={page} data={data} />
      </div>
    </div>
  );
};

const SearchInput = ({ param }) => {
  const router = useRouter();
  const params = useURLSearchParams();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(params.get(param) || '');

  useEffect(() => {
    const query = params.get(param);
    if (!query) setValue('');
    else setValue(query);
  }, [searchParams]);

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (value === '') params.delete(param);
      else params.set(param, value);
      router.push(`/admin/products?` + params.toString());
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onSubmit}
      className="border outline-none rounded"
    />
  );
};

interface SelectedProducts {
  [key: string]: { _id: string };
}

interface TableProps {
  data: Data;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProducts: SelectedProducts | {};
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProducts | {}>>;
}

const Table = ({
  data,
  selectAll,
  setSelectAll,
  selectedProducts,
  setSelectedProducts,
}: TableProps) => {
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedProducts({});
    } else {
      const obj = {};
      let i = 0;
      for (let { _id } of data.products) {
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

  return (
    <table className="w-full bg-slate-50 table-auto border-x border-separate border-spacing-0">
      <thead className=" bg-slate-50 sticky top-32 text-lg h-10">
        <tr>
          <th className="border-b-2 border-r">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Nickname</div>
            <SearchInput param={'nickname'} />
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Title</div>
            <SearchInput param={'keyword'} />
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Price</div>
            <SearchInput param={'price'} />
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            <div>Views</div>
          </th>
          <th className="border-b-2" style={{ width: '19%' }}>
            <div>Bookmarked</div>
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
                  <button className="text-blue-700  underline">{product.nickname}</button>
                </td>
                <td className="border-b">{product.title}</td>
                <td className="border-b">{product.price.toLocaleString()} 원</td>
                <td className="border-b">{product.views}</td>
                <td className="border-b">{product.bookmarked ? product.bookmarked.length : 0}</td>
              </tr>
            ))
          : renderEmptyRows()}
      </tbody>
    </table>
  );
};

const AllProductsCnt = ({ userCnt }: { userCnt: number }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const initTotal = () => {
      setTotal(userCnt);
    };
    if (userCnt || userCnt === 0) initTotal();
  }, [userCnt]);

  return (
    <div className="flex text-lg">
      <p className="font-semibold whitespace-nowrap">전체 게시물&nbsp;</p>
      <p className="text-gray-600">({total})</p>
    </div>
  );
};

export default function Products() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const nickname = searchParams.get('nickname') || '';
  const keyword = searchParams.get('keyword') || '';
  const price = searchParams.get('price') || '';
  const { data, error, refetch } = useProducts(page, nickname, keyword, price, PAGE_SIZE);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts | {}>({});
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { navStatus, setNavStatus } = useNav();

  useEffect(() => {
    setSelectAll(false);
    setSelectedProducts({});
  }, [page, keyword]);

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
            data={data}
            page={page}
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
          />
        </article>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}
