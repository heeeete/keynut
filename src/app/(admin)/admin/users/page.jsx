'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import useUsers from '../_hooks/useUsers';
import Image from 'next/image';
import { useNav } from '../_contexts/NavContext';
import renderEmptyRows from '../_utils/renderEmptyRows';
import Loading from '@/app/(main)/_components/Loading';
import handleKakaoWithdrawal from '../_lib/handleKakaoWithdrawal';
import handleGoogleWithdrawal from '../_lib/handleGoogleWithdrawal';
import userBanHandler from '../_lib/userBanHandler';

const PAGE_SIZE = 100;
const PAGE_RANGE = 10;

const PageControl = ({ page, data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const totalPages = Math.ceil(data?.total / PAGE_SIZE);
  const [pageRange, setPageRange] = useState({ start: 1, end: PAGE_RANGE });

  useEffect(() => {
    if (totalPages)
      if (page > totalPages) {
        params.set('page', 1);
        router.push(`/admin/users?${params.toString()}`);
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
    newPage => {
      if (newPage < 1 || newPage > totalPages) return;
      params.set('page', newPage);
      router.push(`/admin/users?${params.toString()}`);
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

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('keyword') || '');

  const onSubmit = useCallback(
    e => {
      if (e.key === 'Enter') {
        const params = new URLSearchParams(searchParams.toString());
        if (searchText === '') params.delete('keyword');
        else params.set('keyword', searchText);
        params.delete('page');
        router.push(`/admin/users?${params.toString()}`);
      }
    },
    [searchText],
  );

  return (
    <div className="flex border max-w-sm w-full bg-white rounded px-2">
      <img src="/admin/search.svg" width={24} height={24} alt="searchSVG" />
      <input
        type="text"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onKeyDown={onSubmit}
        title="search"
        className="w-full h-full outline-none"
        placeholder="닉네임, 이메일로 검색하기"
      />
    </div>
  );
};

const Taskbar = ({ data, page, selectedUsers, setIsLoading, dataRefetch }) => {
  const handleOtherProviderWithdrawal = async _id => {
    try {
      const res = await fetch(`/api/user/${_id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Other provider user deletion error');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onClickWithdrawal = async () => {
    setIsLoading(true);
    const selectedUsersKeys = Object.keys(selectedUsers);
    try {
      for (let key of selectedUsersKeys) {
        const { _id, access_token, provider, providerAccountId } = selectedUsers[key];

        if (provider === 'kakao') {
          await handleKakaoWithdrawal(_id, providerAccountId);
        } else if (provider === 'google') {
          await handleGoogleWithdrawal(_id, access_token);
        } else {
          await handleOtherProviderWithdrawal(_id);
        }
      }
    } catch (error) {
      console.error(error);
      alert('처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      dataRefetch();
      setIsLoading(false);
    }
  };

  const banHandler = async state => {
    setIsLoading(true);
    const selectedUsersKeys = Object.keys(selectedUsers);
    let status;
    try {
      for (let key of selectedUsersKeys) {
        const { email } = selectedUsers[key];
        console.log(selectedUsers[key]);
        status = await userBanHandler(email, state);
        if (status !== 200) throw '수정중 에러 발생';
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (status === 200) alert('성공');
      else alert('실패');
      dataRefetch();
      setIsLoading(false);
    }
  };

  // const handleKakaoWithdrawal = async (_id, access_token, providerAccountId) => {
  //   try {
  //     const res = await fetch('/api/admin/kakao/unlink', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ providerAccountId, _id }),
  //     });

  //     if (!res.ok) throw new Error(await res.json());
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // const handleGoogleWithdrawal = async (_id, access_token) => {
  //   try {
  //     const res1 = await fetch(`/api/user/${_id}`, { method: 'DELETE' });
  //     if (!res1.ok) throw new Error('Google user deletion error');
  //     const res2 = await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${access_token}`);
  //     if (!res2.ok) throw new Error('Google token revocation error');
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  return (
    <div className="flex flex-col sticky top-10 space-y-2 justify-center border-x px-4 py-2 bg-slate-100">
      <div className="flex space-x-4 justify-between h-9">
        <AllUsersCnt userCnt={data?.total} />
        <div className="flex space-x-4">
          <button className="px-2 py-1 border border-black rounded bg-white" onClick={dataRefetch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
              <g fill="none" stroke="rgb(55 65 81)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747" />
                <path d="M20 4v5h-5" />
              </g>
            </svg>
          </button>
          <button
            onClick={onClickWithdrawal}
            className="px-2 py-1 border border-black rounded bg-white text-gray-700 font-semibold line-clamp-1"
          >
            탈퇴
          </button>
          <button
            onClick={() => banHandler(0)}
            className="px-2 py-1 border border-black rounded bg-white text-gray-700 font-semibold line-clamp-1"
          >
            정지
          </button>
          <button
            onClick={() => banHandler(1)}
            className="px-2 py-1 border border-black rounded bg-white text-gray-700 font-semibold line-clamp-1"
          >
            정지 해제
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <SearchBar />
        <PageControl page={page} data={data} />
      </div>
    </div>
  );
};

const Table = ({ data, selectAll, setSelectAll, selectedUsers, setSelectedUsers }) => {
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedUsers({});
    } else {
      const obj = {};
      let i = 0;
      for (let { _id, access_token, provider, email } of data.users) {
        obj[i++] = {
          _id: _id,
          access_token: access_token,
          provider: provider,
          email: email,
        };
      }
      setSelectedUsers(obj);
    }
    setSelectAll(!selectAll);
  }, [selectAll, selectedUsers, data]);

  const handleSelectUser = useCallback(
    (idx, user) => {
      if (selectedUsers[idx]) {
        const newObj = { ...selectedUsers };
        delete newObj[idx];
        setSelectedUsers(newObj);
      } else {
        const newObj = { ...selectedUsers };
        newObj[idx] = {
          _id: user._id,
          access_token: user.access_token,
          provider: user.provider,
          providerAccountId: user.providerAccountId,
          email: user.email,
        };
        setSelectedUsers(newObj);
      }
    },
    [selectedUsers],
  );

  return (
    <table className="w-full bg-slate-50 table-auto border-x border-separate border-spacing-0">
      <thead className=" bg-slate-50 sticky top-32 text-lg h-10">
        <tr>
          <th className="border-b-2 border-r">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            Nickname
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            Email
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            Products
          </th>
          <th className="border-b-2 border-r" style={{ width: '19%' }}>
            Provider
          </th>
          <th className="border-b-2" style={{ width: '19%' }}>
            state
          </th>
        </tr>
      </thead>
      <tbody className="text-lg">
        {data
          ? data?.users?.map((user, idx) => (
              <tr className="text-center h-9" key={idx}>
                <td className="border-b">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={Boolean(selectedUsers[idx])}
                      onChange={() => handleSelectUser(idx, user)}
                    />
                  </div>
                </td>
                <td className="border-b">
                  <button className="text-blue-700  underline">{user.nickname}</button>
                </td>
                <td className="border-b">{user.email}</td>
                <td className="border-b">{user.products ? user.products.length : 0}</td>
                <td className="border-b">{user.provider}</td>
                <td className="border-b">{user.state === 1 ? '활성화' : '비활성화'}</td>
              </tr>
            ))
          : renderEmptyRows()}
      </tbody>
    </table>
  );
};

const AllUsersCnt = ({ userCnt }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const initTotal = () => {
      setTotal(userCnt);
    };
    if (userCnt || userCnt === 0) initTotal();
  }, [userCnt]);

  return (
    <div className="flex text-lg">
      <p className="font-semibold whitespace-nowrap">전체 유저&nbsp;</p>
      <p className="text-gray-600">({total})</p>
    </div>
  );
};

export default function Users() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') || '';
  const { data, error, refetch } = useUsers(page, keyword, PAGE_SIZE);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { navStatus, setNavStatus } = useNav();

  useEffect(() => {
    setSelectAll(false);
    setSelectedUsers({});
  }, [page, keyword]);

  const dataRefetch = () => {
    setSelectAll(false);
    setSelectedUsers({});
    refetch();
  };

  return (
    <div className={`${navStatus ? 'pl-72' : 'pl-14'} w-full h-full`}>
      <div className={`${navStatus ? 'max-w-screen-xl' : 'max-w-screen-2xl'} w-full mx-auto h-full `}>
        <article className="py-7 h-full">
          <Taskbar
            data={data}
            page={page}
            selectedUsers={selectedUsers}
            setIsLoading={setIsLoading}
            dataRefetch={dataRefetch}
          />
          <Table
            data={data}
            selectAll={selectAll}
            selectedUsers={selectedUsers}
            setSelectAll={setSelectAll}
            setSelectedUsers={setSelectedUsers}
          />
        </article>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}
