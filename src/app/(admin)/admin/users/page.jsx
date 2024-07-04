'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import getUsers from '../_lib/getUsers';
import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 100;
const PAGE_RANGE = 10;

const useUsers = page => {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page, PAGE_SIZE),
    enabled: page !== undefined,
  });
};

const PageControl = ({ page, data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(data?.total / PAGE_SIZE);
  const [pageRange, setPageRange] = useState({ start: 1, end: PAGE_RANGE });

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

  const updatePage = newPage => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => updatePage(page - 1)} disabled={page <= 1}>{`<`}</button>
      <div className="flex space-x-2">
        {Array(pageRange.end - pageRange.start + 1)
          .fill(0)
          .map((_, idx) => {
            const pageNumber = pageRange.start + idx;
            return (
              <button
                key={pageNumber}
                onClick={() => updatePage(pageNumber)}
                className={page === pageNumber ? 'font-bold' : ''}
              >
                {pageNumber}
              </button>
            );
          })}
      </div>
      <button onClick={() => updatePage(page + 1)}>{`>`}</button>
    </div>
  );
};

const AllUsersCnt = React.memo(({ total }) => {
  console.log('RENDER!!!', total);
  return <p>전체 유저 : {total}</p>;
});

export default function Users() {
  const page = parseInt(useSearchParams().get('page')) || 1;
  const { data, error, isLoading, refetch } = useUsers(page);

  return (
    <div className="w-full h-full">
      <h1 className="text-lg">USERS</h1>
      <article className="bg-slate-100">
        <div className="flex space-x-4 sticky top-10 bg-slate-100">
          <AllUsersCnt total={data?.total} />
          <button
            onClick={() => {
              refetch();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <g fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
                <path d="M20 4v5h-5" />
              </g>
            </svg>
          </button>
          <PageControl page={page} data={data} />
        </div>
        <table className="w-full bg-slate-50 table-auto  border-separate border-spacing-0">
          <thead className="bg-slate-50 sticky top-16">
            <tr>
              <th className="border-b-2 border-r ">
                <input type="checkbox" />
              </th>
              <th className="border-b-2 border-r ">Nickname</th>
              <th className="border-b-2 border-r ">Email</th>
              <th className="border-b-2 border-r ">Products</th>
              <th className="border-b-2 ">bookmarked</th>
            </tr>
          </thead>
          {data?.users?.map((user, idx) => (
            <tbody key={idx}>
              <tr className="text-center">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>{user.products ? user.products.length : 0}</td>
                <td>{user.bookmarked ? user.bookmarked.length : 0}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </article>
    </div>
  );
}
