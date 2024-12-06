'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import ImageSlider from '@/app/(main)/_components/ImageSlider';
import Image from 'next/image';
import timeAgo from '@/utils/timeAgo';
import OpenChatLink from './OpenChatLink';
import { useQuery } from '@tanstack/react-query';
import getProductWithUser from '../_lib/getProductWithUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import initRaiseCount from '@/lib/initRaiseCount';
import raiseProduct from '@/lib/raiseProduct';
import conditions from '@/app/(main)/_constants/conditions';
import DropdownMenu from '@/app/(main)/_components/DropdownMenu';
import CustomDropdownMenu from '@/app/(main)/_components/CustomDropDownMenu';
import Warning from '@/app/(main)/_components/Warning';
import { useModal } from '@/app/(main)/_components/ModalProvider';
import baseCategory from '@/app/(main)/_constants/productPage/baseCategories';
import formatDate from '@/app/(main)/_lib/formatDate';
import './button.css';
import { SessionData } from '@/type/sessionData';
import { OpenModal } from '@/type/modal';
import { RecentViewContext } from '@/app/(main)/_components/RecentViewComponent/RecentViewContext';
import ProductData from '@keynut/type/productData';
import User from '@keynut/type/user';
import deleteProduct from '@/lib/deleteProduct';

const Condition = ({ condition }) => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <div className="flex  items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        <span>상품상태</span>
      </div>
      <span>{conditions[condition]?.option}</span>
    </div>
  );
};

const Category = ({ category }) => {
  let mainCategory = { key: 0, value: '' };

  if (category >= 10 && category <= 19) mainCategory = { key: 1, value: '키보드' };
  else if (category >= 20 && category <= 29) mainCategory = { key: 2, value: '마우스' };
  else if (category >= 30 && category <= 39) mainCategory = { key: 3, value: '패드' };
  else if (category === 4) mainCategory = { key: 4, value: '모니터' };
  else if (category === 5) mainCategory = { key: 5, value: '헤드셋' };
  else mainCategory = { key: 9, value: '기타' };

  return (
    <div className="flex flex-1 items-end">
      <span className="flex items-center text-gray-400 text-sm font-medium">
        <Link href={`/shop?categories=${mainCategory.key}`}>{mainCategory.value}</Link>
        {category !== 9 && category !== 4 && category !== 5 && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3em"
              height="1.3em"
              viewBox="0 0 24 24"
            >
              <g fill="none" fillRule="evenodd">
                <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="#ababab"
                  d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
                />
              </g>
            </svg>
            <Link href={`/shop?categories=${category}`}>{baseCategory[category]}</Link>
          </>
        )}
      </span>
    </div>
  );
};

const RenderTimeAgo = ({ date }) => {
  const [clientTime, setClientTime] = useState(null);

  useEffect(() => {
    setClientTime(timeAgo(date));
  }, [date]);

  return <p>{clientTime || timeAgo(date)}</p>;
};

const RenderBookMark = ({ bookmarked }) => {
  return (
    <div className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path fill="currentColor" d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
      <p>{bookmarked?.length}</p>
    </div>
  );
};

const RenderViews = ({ views }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
        />
      </svg>
      <p>{views}</p>
    </div>
  );
};

const RenderProfile = ({ user, id }) => {
  if (!user) return;

  const LoginDate = ({ createdAt }) => {
    return (
      <div className="flex items-center space-x-1 text-sm text-gray-400 max-[960px]:text-xs">
        <svg
          className=""
          xmlns="http://www.w3.org/2000/svg"
          width="1.1em"
          height="1.1em"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="#afb2b6"
            d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
          />
        </svg>
        {createdAt ? (
          <div>{formatDate(createdAt)}에 가입</div>
        ) : (
          <div className="flex h-4 w-32 bg-gray-100"></div>
        )}
      </div>
    );
  };

  const Provider = ({ provider }) => {
    return (
      <div className="flex text-gray-400 items-center space-x-1 text-sm max-[960px]:text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
          <g fill="#afb2b6">
            <path d="M10.243 16.314L6 12.07l1.414-1.414l2.829 2.828l5.656-5.657l1.415 1.415z" />
            <path
              fillRule="evenodd"
              d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12m11 9a9 9 0 1 1 0-18a9 9 0 0 1 0 18"
              clipRule="evenodd"
            />
          </g>
        </svg>
        {provider ? (
          <div className="flex items-end space-x-1 text-center">
            <p className="flex items-end leading-snug">{provider}</p>
            <p className="flex items-end leading-tight">로그인</p>
          </div>
        ) : (
          <div className="flex h-5 w-20 bg-gray-100 mt-1 max-[960px]:h-4"></div>
        )}
      </div>
    );
  };

  return (
    <>
      <Link
        href={`/shop/${user._id}`}
        className="relative flex flex-col p-4  justify-between border rounded flex-wrap space-y-4 "
      >
        <div className="relative flex justify-center items-center bg-black rounded">
          <p className=" font-semibold text-white">판매자 정보</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.3em"
            height="1.3em"
            viewBox="0 0 24 24"
            className="absolute right-0"
          >
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="white"
                d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
              />
            </g>
          </svg>
        </div>
        <div className="flex justify-between">
          <div className=" items-center space-y-2">
            <div className="flex flex-col">
              <p className="text-lg font-semibold max-[960px]:text-base line-clamp-1">
                {user.nickname}
              </p>
              {user.memo && user.memo[id] ? (
                <p className="text-sm text-gray-400">{user.memo[id]}</p>
              ) : (
                ''
              )}
            </div>
            <div>
              <LoginDate createdAt={user.createdAt} />
              <Provider provider={user.provider} />
            </div>
          </div>
          <div className="flex relative rounded-full  aspect-square justify-center items-center cursor-pointer">
            {user.image ? (
              <div className="relative w-20 h-20">
                <Image
                  className="rounded-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user.image}`}
                  sizes="80px"
                  alt="profile"
                  fill
                />
              </div>
            ) : (
              <div className="w-20 h-20 defualt-profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="rgba(0,0,0,0.2)"
                    d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

const RenderBookmarkButton = ({ productId, bookmarked, session, queryClient }) => {
  const isBookmarked = session && bookmarked?.includes(session.user.id);
  const color = isBookmarked ? 'black' : 'white';

  const mutation = useMutation({
    mutationFn: async ({ productId }: { productId: string; isBookmarked: boolean }) => {
      const res = await fetch(`/api/products/${productId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBookmarked }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      return data;
    },
    onMutate: async ({ productId, isBookmarked }: { productId: string; isBookmarked: boolean }) => {
      await queryClient.cancelQueries(['product', productId]);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], (old: ProductData) => ({
        ...old,
        bookmarked: isBookmarked
          ? old.bookmarked.filter((id) => id !== session.user.id)
          : [...old.bookmarked, session.user.id],
      }));
      return { previousProduct };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['product', variables.productId], context.previousProduct);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(['product', variables.productId]);
    },
  });

  const handleClick = async () => {
    if (!(await getSession())) return signIn();
    mutation.mutate({ productId, isBookmarked });
  };

  return (
    <button
      aria-label="bookmark button"
      onClick={handleClick}
      className="flex justify-center items-center w-7 rounded"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="shadow-button"
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
      >
        <path
          fill={color}
          stroke="black"
          strokeWidth={3}
          d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2"
        />
      </svg>
    </button>
  );
};

const RenderHashTag = ({ product }) => {
  return (
    <div className="flex text-gray-500 flex-wrap">
      {product.tags?.map((e, idx) => (
        <Link
          href={`/shop?keyword=${encodeURIComponent(e)}`}
          key={idx}
          className="flex items-center mr-3 max-[960px]:text-sm"
        >
          <span>{e}</span>
        </Link>
      ))}
    </div>
  );
};

const RenderDescriptor = ({ product }) => {
  return (
    <div className="min-[960px]:mt-5 px-0 py-1 rounded min-h-24 break-all">
      <p className="text-xl font-semibold  max-[960px]:text-lg">상품 설명</p>
      <div
        className="w-full bg-gray-300 rounded-full my-4 max-[960px]:my-2"
        style={{ height: '2px' }}
      ></div>
      <p className="whitespace-pre-wrap min-h-28 px-2">{product.description}</p>
    </div>
  );
};

const UpButton = ({
  setSettingModal,
  raiseCount,
  state,
  raiseHandler,
  openModal,
}: {
  setSettingModal?: React.Dispatch<React.SetStateAction<boolean>>;
  raiseCount: number;
  state: number;
  raiseHandler: () => Promise<void>;
  openModal: (props: {
    message: string;
    subMessage?: string;
    isSelect?: boolean;
    size?: string | number;
  }) => Promise<boolean>;
}) => {
  const openUpModal = async () => {
    if (!(await getSession())) return signIn();
    if (setSettingModal) setSettingModal(false);

    const res = await openModal({
      message: raiseCount > 0 ? `${raiseCount}회 사용 가능` : '사용 가능 회수를 초과하셨습니다.',
      subMessage: raiseCount > 0 ? `사용 시 1회 차감됩니다.` : '',
      isSelect: raiseCount > 0 ? true : false,
    });
    if (!res) return;
    raiseHandler();
  };
  return (
    <button
      className={`min-[480px]:flex-1 min-[480px]:max-w-44 min-[480px]:px-4 min-[480px]:py-1 min-[480px]:border min-[480px]:rounded min-[480px]:border-gray-300 flex items-center justify-center font-semibold flex-nowrap whitespace-nowrap  max-[480px]:w-full max-[480px]:py-4 max-[480px]:border-b  ${
        state !== 1 ? 'text-gray-300' : 'text-black'
      }`}
      onClick={() => openUpModal()}
      disabled={state === 0 || state === 2}
    >
      <p>UP</p>
    </button>
  );
};

const DeleteButton = ({
  setSettingModal,
  openModal,
  deleteHandler,
}: {
  setSettingModal?: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: OpenModal;
  deleteHandler: () => void;
}) => {
  const openDeleteModal = async () => {
    if (!(await getSession())) return signIn();
    if (setSettingModal) setSettingModal(false);

    const res = await openModal({
      message: '삭제하시겠습니까?',
      isSelect: true,
    });
    if (!res) return;
    deleteHandler();
  };

  return (
    <button
      className="min-[480px]:flex-1 min-[480px]:max-w-44 min-[480px]:px-4 min-[480px]:py-1 min-[480px]:border min-[480px]:rounded min-[480px]:border-gray-300 flex items-center justify-center max-[480px]:w-full max-[480px]:py-4 font-semibold text-red-500"
      onClick={openDeleteModal}
    >
      <p>삭제</p>
    </button>
  );
};

const ModifyButton = ({ id }) => {
  return (
    <Link
      className="min-[480px]:flex-1 min-[480px]:max-w-44 min-[480px]:px-4 min-[480px]:py-1 min-[480px]:border min-[480px]:rounded min-[480px]:border-gray-300 flex items-center justify-center w-full max-[480px]:py-4 max-[480px]:border-b font-semibold"
      href={`/shop/product/${id}/edit`}
    >
      <p>수정</p>
    </Link>
  );
};

const SettingModal = ({
  id,
  setSettingModal,
  state,
  raiseHandler,
  raiseCount,
  deleteHandler,
  openModal,
}) => {
  return (
    <div
      className="fixed w-screen custom-dvh top-0 left-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.currentTarget === e.target) setSettingModal(false);
      }}
    >
      <div className="flex flex-col justify-center items-center rounded-md border space-y-1 bg-white w-72">
        <ModifyButton id={id} />
        <UpButton
          setSettingModal={setSettingModal}
          raiseCount={raiseCount}
          state={state}
          raiseHandler={raiseHandler}
          openModal={openModal}
        />
        <DeleteButton
          setSettingModal={setSettingModal}
          openModal={openModal}
          deleteHandler={deleteHandler}
        />
      </div>
    </div>
  );
};

const MobileSettingModal = ({ writer, session, setSettingModal }) => {
  if (writer || session?.admin)
    return (
      <button
        onClick={() => {
          setSettingModal(true);
        }}
      >
        <img
          src="/product/more.svg"
          width={24}
          height={24}
          alt="MORE"
          className="hidden max-[480px]:flex"
        />
      </button>
    );
};

const ComplainModal = ({ setComplainModal, productId }) => {
  const [state, setState] = useState(0);
  const [text, setText] = useState('');
  const placeholder = '신고 유형을 선택해주세요.';
  const values = ['외부 채널 유도', '광고성 컨텐츠', '전문 업자 의심', '기타'];
  const { openModal } = useModal();

  const descriptions = [
    '사용자가 거래를 위해 외부 채널(카카오톡, 텔레그램 등)로 유도하는 경우',
    '상품 내용과 관련 없는 광고성 컨텐츠인 경우',
    '일반 사용자가 아닌 전문 업자로 의심되는 경우',
    '기타 다른 이유로 신고하고 싶은 경우',
  ];

  const postComplain = async () => {
    try {
      const data = {
        category: values[state - 1],
        text: text,
      };
      const res = await fetch(`/api/products/${productId}/complain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) signIn();
        else openModal({ message: '잠시 후 다시 시도해 주세요.' });
      } else {
        openModal({ message: '정상적으로 처리되었습니다.' });
        setComplainModal(false);
      }
    } catch (error) {
      console.error(error);
      openModal({ message: '에러가 발생했습니다. 나중에 다시 시도해 주세요.' });
    }
  };

  return (
    <div
      className="flex flex-col fixed w-screen custom-dvh top-0 left-0 z-50 px-5 justify-center items-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.currentTarget === e.target) setComplainModal(false);
      }}
    >
      <div className="flex flex-col space-y-2 justify-around max-w-lg w-full bg-white rounded px-4 py-2">
        <div>
          <img src="/product/complain-red.svg" width={35} height={35} alt="" />
          <CustomDropdownMenu
            placeholder={placeholder}
            values={values}
            onChange={(e) => setState(e)}
          />
        </div>
        <div className="bg-gray-100 border rounded">
          <textarea
            className={`${
              state === 0 && 'cursor-not-allowed'
            } w-full scrollbar-hide p-2 resize-none bg-gray-100 outline-none`}
            placeholder={state > 0 ? descriptions[state - 1] : placeholder}
            rows={10}
            maxLength={1000}
            onChange={(e) => setText(e.target.value)}
            disabled={state === 0}
          ></textarea>
          <p className=" text-end text-sm text-gray-300">{`${text.length} / 1000`}</p>
        </div>
        <div className="flex justify-end">
          <button
            className="disabled:opacity-40 disabled:cursor-not-allowed border rounded px-2 py-1"
            onClick={postComplain}
            disabled={state === 0}
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

const incrementViewCount = async (productId) => {
  const res = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
  });
  return res.json();
};

const onPaste = async (id, openModal) => {
  try {
    await navigator.clipboard.writeText(`https://keynut.co.kr/shop/product/${id}`);
    openModal({
      message: 'URL복사',
      subMessage: `URL이 복사되었습니다.\n다른 곳에 공유해 보세요!`,
    });
  } catch (error) {
    openModal({
      message: 'URL복사',
      subMessage: `에러가 발생했습니다.\n잠시 후 다시 시도해 주세요`,
    });
  }
};

const modifyRecentView = (data: ProductWithUserData, setRecentViewChange) => {
  let item = localStorage.getItem('recentView');
  let curList = item && item !== '' ? JSON.parse(item) : null;
  if (!curList || curList.length === 0) {
    localStorage.setItem('recentView', JSON.stringify([data]));
    setRecentViewChange(true);
    return;
  }
  if (curList[0]._id === data._id) return;
  curList = curList.filter((product) => product._id !== data._id);
  if (curList.length === 6) curList.pop();
  localStorage.setItem('recentView', JSON.stringify([data, ...curList]));
  setRecentViewChange(true);
};

interface ProductWithUserData extends ProductData {
  user: User | null;
}

export default function RenderProduct({ id }): JSX.Element {
  const queryClient = useQueryClient();
  const { setRecentViewChange } = useContext(RecentViewContext);
  const [settingModal, setSettingModal] = useState(null);
  const [complainModal, setComplainModal] = useState(false);
  const [raiseCount, setRaiseCount] = useState(0);
  const posY = useRef(0);
  const router = useRouter();
  const { data: session, status }: SessionData = useSession();
  const { data, error, isLoading } = useQuery<ProductWithUserData>({
    queryKey: ['product', id],
    queryFn: () => getProductWithUser(id),
    staleTime: Infinity,
  });
  const invalidateFilters = useInvalidateFiltersQuery();
  const fetchRaiseCount = initRaiseCount(setRaiseCount);
  const user = data?.user ?? null; // Optional chaining 사용
  const product = data;
  const writer = status !== 'loading' && session ? session.user.id === product?.userId : false;
  const { openModal } = useModal();

  useEffect(() => {
    modifyRecentView(data, setRecentViewChange);
  }, []);

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
    if (settingModal) {
      if (posY.current === 0) posY.current = window.scrollY;
      document.documentElement.style.setProperty('--posY', `-${posY.current}px`);
      document.body.classList.add('fixed');
    } else {
      document.body.classList.remove('fixed');
      window.scrollTo(0, posY.current);
      posY.current = 0;
    }
    return () => {
      document.body.classList.remove('fixed');
    };
  }, [settingModal]);

  useEffect(() => {
    const fetchUpdateViews = async () => {
      const data = await incrementViewCount(id);
      if (!data) {
        await openModal({ message: '삭제된 상품입니다.' });
        invalidateFilters();
        router.back();
        setTimeout(() => {
          router.refresh();
        }, 300);
        return;
      }
      queryClient.setQueryData(['product', id], (oldData: ProductData) => {
        return {
          ...oldData,
          views: data.views,
        };
      });
    };
    fetchUpdateViews();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchRaiseCount();
  }, [status]);

  const deleteHandler = useCallback(async () => {
    await deleteProduct(id, () => {
      invalidateFilters(['product', id]);
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 100);
    });
  }, [router]);

  const raiseHandler = async () => {
    await raiseProduct(id, async () => {
      await openModal({ message: '최상단으로 UP!', subMessage: `${raiseCount - 1}회 사용가능` });
      router.refresh();
      invalidateFilters();
      fetchRaiseCount();
    });
  };

  const onClickComplain = async () => {
    if (!(await getSession())) return signIn();
    setComplainModal(true);
  };

  if (!data && isLoading === false) {
    return <Warning message={'삭제되었거나 존재하지 않는 상품입니다.'} />;
  }
  if (!data || !product) return <div>데이터를 가져오고 있습니다...</div>;
  return (
    <div className="min-[960px]:mt-5 min-[960px]:flex-1 min-[960px]:px-10 max-w-screen-lg mx-auto min-h-80vh max-[960px]:max-w-screen-md max-[960px]:max-w- max-[960px]:mt-12">
      {session?.admin && <div className="font-extrabold text-3xl">ADMIN ACCOUNT</div>}
      <div className="flex items-end justify-between max-[960px]:py-3 max-[960px]:px-3">
        <Category category={Number(product.category)} />
        {/* 글쓴이 || 어드민 계정 */}
        <MobileSettingModal writer={writer} session={session} setSettingModal={setSettingModal} />
        {!writer && status !== 'loading' && (
          <button onClick={onClickComplain} className="flex items-center h-6 space-x-1">
            <img src="/product/complain.svg" width={20} height={20} alt="complain" />
          </button>
        )}
      </div>
      <div
        className="w-full mt-2 mb-6 bg-gray-300 max-[960px]:hidden"
        style={{ height: '1px' }}
      ></div>
      <div className="min-[960px]:flex min-[960px]:space-x-6">
        <div className="min-[960px]:flex-1">
          <ImageSlider images={product.images} state={product.state} />
        </div>
        <div className="min-[960px]:flex-1 flex flex-col max-[960px]:px-3">
          <div className="w-full h-full flex flex-col space-y-6">
            <div className="mt-6">
              <p className="text-2xl font-bold break-all max-[960px]:text-lg max-[960px]:mb-4">
                {product.title}
              </p>
              <RenderHashTag product={product} />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between max-[960px]:items-center space-x-2">
                <div>
                  <span className="text-2xl font-bold">
                    {Number(product.price).toLocaleString()}
                  </span>
                  <span className="text-xl">원</span>
                </div>
                <div className="flex self-end h-8 items-center space-x-2">
                  <button
                    className="flex justify-center items-center rounded w-7 h-7 font-semibold bg-black text-white shadow-button"
                    style={{ fontSize: '10px' }}
                    onClick={() => onPaste(id, openModal)}
                  >
                    URL
                  </button>
                  {status !== 'loading' ? (
                    writer ? (
                      <div className="hidden max-[480px]:block">
                        <DropdownMenu id={id} state={product.state} />
                      </div>
                    ) : (
                      product.state !== 0 && (
                        <>
                          <OpenChatLink url={product.openChatUrl} session={session} id={id} />
                          <RenderBookmarkButton
                            productId={id}
                            bookmarked={product.bookmarked}
                            session={session}
                            queryClient={queryClient}
                          />
                        </>
                      )
                    )
                  ) : null}
                </div>
              </div>
              <div className="flex w-full justify-between text-sm text-gray-500 font-semibold">
                <Condition condition={Number(product.condition)} />
                <div className="flex space-x-2 font-normal text-gray-400">
                  <RenderTimeAgo date={product.createdAt} />
                  <RenderBookMark bookmarked={product.bookmarked} />
                  <RenderViews views={product.views} />
                </div>
              </div>
              {status !== 'loading' && !writer && (
                <RenderProfile user={user} id={session?.user?.id} />
              )}
            </div>
            {status !== 'loading'
              ? (writer || session?.admin) && (
                  <div className="flex space-x-4 text-sm max-[480px]:hidden">
                    <DropdownMenu id={id} state={product.state} />
                    <div className="flex flex-1 space-x-4">
                      <UpButton
                        raiseCount={raiseCount}
                        state={product.state}
                        raiseHandler={raiseHandler}
                        openModal={openModal}
                      />
                      <ModifyButton id={id} />
                      <DeleteButton openModal={openModal} deleteHandler={deleteHandler} />
                    </div>
                  </div>
                )
              : ''}
          </div>
        </div>
      </div>
      <div className="max-[960px]:px-3 mt-3">
        <RenderDescriptor product={product} />
      </div>
      {settingModal && (
        <SettingModal
          openModal={openModal}
          id={id}
          setSettingModal={setSettingModal}
          state={product.state}
          raiseHandler={raiseHandler}
          raiseCount={raiseCount}
          deleteHandler={deleteHandler}
        />
      )}
      {complainModal && <ComplainModal setComplainModal={setComplainModal} productId={id} />}
    </div>
  );
}
