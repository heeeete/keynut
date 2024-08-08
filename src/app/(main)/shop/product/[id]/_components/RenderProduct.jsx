'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import ImageSlider from '@/app/(main)/_components/ImageSlider';
import Image from 'next/image';
import timeAgo from '@/utils/timeAgo';
import OpenChatLink from './OpenChatLink';
import { useQuery } from '@tanstack/react-query';
import getProductWithUser from '../_lib/getProductWithUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn, useSession } from 'next-auth/react';
import Modal from '@/app/(main)/_components/Modal';
import { useRouter } from 'next/navigation';
import { useInvalidateFiltersQuery } from '@/hooks/useInvalidateFiltersQuery';
import initRaiseCount from '@/lib/initRaiseCount';
import raiseProduct from '@/lib/raiseProduct';
import deleteProduct from '@/lib/deleteProduct';
import conditions from '@/app/(main)/_constants/conditions';
import DropdownMenu from '@/app/(main)/_components/DropdownMenu';
import CustomDropdownMenu from '@/app/(main)/_components/CustomDropDownMenu';
import Warning from '@/app/(main)/_components/Warning';
import { useModal } from '@/app/(main)/_components/ModalProvider';

const RenderCondition = ({ condition }) => {
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

const RenderCategory = ({ category }) => {
  const obj = {
    // 키보드
    10: '커스텀',
    11: '기성품',
    12: '스위치',
    13: '보강판',
    14: '아티산',
    15: '키캡',
    16: 'PCB',
    19: '기타',

    // 마우스
    20: '완제품',
    21: '마우스피트',
    22: '그립테이프',
    23: 'PCB',
    29: '기타',

    // 패드
    30: '마우스패드',
    31: '장패드',
    39: '기타',

    // 아래는 지금 필요없음 sub 카테고리 없어서
    // 모니터
    4: '모니터',
    // 헤드셋
    5: '헤드셋',
    // 기타
    9: '기타',
  };
  let mainCategory = {};

  if (category >= 10 && category <= 19) mainCategory = { key: 1, value: '키보드' };
  else if (category >= 20 && category <= 29) mainCategory = { key: 2, value: '마우스' };
  else if (category >= 30 && category <= 39) mainCategory = { key: 3, value: '패드' };
  else if (category === 4) mainCategory = { key: 4, value: '모니터' };
  else if (category === 5) mainCategory = { key: 5, value: '헤드셋' };
  else mainCategory = { key: 9, value: '키보드' };

  return (
    <div className="flex flex-1 items-end">
      <span className="flex items-center text-gray-400 text-sm font-medium">
        <Link href={`/shop?categories=${mainCategory.key}`}>{mainCategory.value}</Link>
        {category !== 9 && category !== 4 && category !== 5 && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <g fill="none" fillRule="evenodd">
                <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="#ababab"
                  d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
                />
              </g>
            </svg>
            <Link href={`/shop?categories=${category}`}>{obj[category]}</Link>
          </>
        )}
      </span>
    </div>
  );
};

const RenderTimeAgo = ({ date }) => {
  return <p>{timeAgo(date)}</p>;
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

  return (
    <>
      <Link href={`/shop/${user._id}`} className="flex max-w-md  justify-between border rounded flex-wrap p-2">
        <div className="flex items-center space-x-2">
          <div className="flex relative rounded-full  aspect-square justify-center items-center cursor-pointer">
            {user.image ? (
              <div className="relative w-12 h-12">
                <Image className="rounded-full object-cover" src={user.image} sizes="80px" alt="profile" fill />
              </div>
            ) : (
              <div className="w-10 h-10 defualt-profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 448 512">
                  <path
                    fill="rgba(0,0,0,0.2)"
                    d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-lg max-md:text-base line-clamp-1">{user.nickname}</p>
            {user.memo && user.memo[id] ? <p className="text-sm text-gray-400">{user.memo[id]}</p> : ''}
          </div>
        </div>
        <div className="flex items-center rounded" href={`/shop/${user._id}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="#dcdddf"
                d="M10.772 2.688a2 2 0 0 1 2.456 0l8.384 6.52c.753.587.337 1.792-.615 1.792H20v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8h-.997c-.953 0-1.367-1.206-.615-1.791zM5.625 9.225c.229.185.375.468.375.785V19h12v-8.99c0-.317.146-.6.375-.785L12 4.267z"
              />
            </g>
          </svg>
        </div>
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
            <path
              fill="#d6d8db"
              d="M5.06 3c-.43 0-.84.14-1.22.42s-.6.64-.7 1.08L2.11 8.91c-.25 1.09-.05 2.04.61 2.86l.28.28V19c0 .5.2 1 .61 1.39S4.5 21 5 21h14c.5 0 1-.2 1.39-.61S21 19.5 21 19v-6.95l.28-.28c.66-.82.86-1.77.61-2.86L20.86 4.5c-.13-.44-.36-.8-.73-1.08A1.88 1.88 0 0 0 18.94 3zm13.83 1.97l1.08 4.41c.09.43 0 .82-.28 1.17c-.25.31-.56.45-.94.45c-.31 0-.58-.1-.8-.34c-.22-.23-.34-.5-.37-.82L16.97 5zM5.06 5h1.97l-.61 4.84C6.3 10.63 5.91 11 5.25 11c-.41 0-.72-.14-.94-.45c-.28-.35-.37-.74-.28-1.17zm3.99 0H11v4.7c0 .35-.11.65-.36.92c-.25.26-.56.38-.94.38c-.34 0-.63-.12-.86-.41S8.5 10 8.5 9.66V9.5zM13 5h1.95l.55 4.5c.08.42 0 .77-.29 1.07c-.26.3-.6.43-1.01.43c-.31 0-.59-.12-.84-.38A1.3 1.3 0 0 1 13 9.7zm-5.55 7.05c.63.62 1.41.95 2.35.95c.84 0 1.58-.33 2.2-.95c.69.62 1.45.95 2.3.95c.87 0 1.62-.33 2.25-.95c.56.62 1.31.95 2.25.95h.23v6H5v-6h.25c.91 0 1.64-.33 2.2-.95"
            />
          </svg> */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="2.2em" height="2.2em" viewBox="0 0 24 24">
            <path
              fill="#d6d8db"
              d="M6.44 9.86L7.02 5H5.05L4.04 9.36c-.1.42-.01.84.25 1.17c.14.18.44.47.94.47c.61 0 1.13-.49 1.21-1.14M9.71 11c.74 0 1.29-.59 1.29-1.31V5H9.04l-.55 4.52c-.05.39.07.78.33 1.07c.23.26.55.41.89.41m4.51 0c.41 0 .72-.15.96-.41c.25-.29.37-.68.33-1.07L14.96 5H13v4.69c0 .72.55 1.31 1.22 1.31m4.69-6.01L16.98 5l.58 4.86c.08.65.6 1.14 1.21 1.14c.49 0 .8-.29.93-.47c.26-.33.35-.76.25-1.17z"
              opacity="0.7"
            />
            <path
              fill="#d6d8db"
              d="m21.9 8.89l-1.05-4.37c-.22-.9-1-1.52-1.91-1.52H5.05c-.9 0-1.69.63-1.9 1.52L2.1 8.89c-.24 1.02-.02 2.06.62 2.88c.08.11.19.19.28.29V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6.94c.09-.09.2-.18.28-.28c.64-.82.87-1.87.62-2.89M13 5h1.96l.54 4.52c.05.39-.07.78-.33 1.07c-.22.26-.54.41-.95.41c-.67 0-1.22-.59-1.22-1.31zM8.49 9.52L9.04 5H11v4.69c0 .72-.55 1.31-1.29 1.31c-.34 0-.65-.15-.89-.41a1.42 1.42 0 0 1-.33-1.07m-4.2 1.01c-.26-.33-.35-.76-.25-1.17L5.05 5h1.97l-.58 4.86c-.08.65-.6 1.14-1.21 1.14c-.5 0-.8-.29-.94-.47M19 19H5v-6.03c.08.01.15.03.23.03c.87 0 1.66-.36 2.24-.95c.6.6 1.4.95 2.31.95c.87 0 1.65-.36 2.23-.93c.59.57 1.39.93 2.29.93c.84 0 1.64-.35 2.24-.95c.58.59 1.37.95 2.24.95c.08 0 .15-.02.23-.03V19zm.71-8.47c-.14.18-.44.47-.94.47c-.61 0-1.14-.49-1.21-1.14L16.98 5l1.93-.01l1.05 4.37c.1.42.01.85-.25 1.17"
            />
          </svg> */}
        {/* </Link> */}
      </Link>
    </>
  );
};

const RenderBookmarkButton = ({ productId, bookmarked, session, queryClient }) => {
  const isBookmarked = session && bookmarked?.includes(session.user.id);
  const color = isBookmarked ? 'black' : 'white';

  const mutation = useMutation({
    mutationFn: async ({ productId }) => {
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
    onMutate: async ({ productId, isBookmarked }) => {
      await queryClient.cancelQueries(['product', productId]);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], old => ({
        ...old,
        bookmarked: isBookmarked
          ? old.bookmarked.filter(id => id !== session.user.id)
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
    <button onClick={handleClick} className="flex justify-center items-center w-10 rounded -mr-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 32 32">
        <path fill={color} stroke="black" strokeWidth={3} d="M24 2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V4a2 2 0 0 0-2-2" />
      </svg>
    </button>
  );
};

const RenderHashTag = ({ product }) => {
  return (
    <div className="flex text-gray-500 flex-wrap">
      {product.tags?.map((e, idx) => (
        <Link href={`/shop?keyword=${encodeURIComponent(e)}`} key={idx} className="flex items-center mr-3">
          <span>{e}</span>
        </Link>
      ))}
    </div>
  );
};

const RenderDescriptor = ({ product }) => {
  return (
    <div className="border px-2 py-1 rounded min-h-24 break-all">
      <p className="whitespace-pre-wrap p-2">{product.description}</p>
    </div>
  );
};

const IsWriter = ({ id, state, setSettingModal }) => {
  return (
    <>
      <div className="flex space-x-2 flex-nowrap whitespace-nowrap items-center justify-center">
        <button
          className="align-text-top items-center rounded max-[480px]:hidden"
          onClick={e => {
            setSettingModal(true);
          }}
        >
          <img className="min-w-6" src="/product/more.svg" width={24} height={24} alt="MORE" />
        </button>
        <DropdownMenu id={id} state={state} />
      </div>
    </>
  );
};

const SettingModal = ({ id, setSettingModal, state, raiseHandler, raiseCount, deleteHandler }) => {
  const { openModal } = useModal();

  const openUpModal = async () => {
    if (!(await getSession())) return signIn();
    setSettingModal(false);

    const res = await openModal({
      message: raiseCount ? `${raiseCount}회 사용 가능` : '사용 가능 회수를 초과하셨습니다.',
      subMessage: raiseCount ? `사용 시 1회 차감됩니다.` : '',
      isSelect: true,
    });
    if (!res) return;
    raiseHandler();
  };

  const openDeleteModal = async () => {
    if (!(await getSession())) return signIn();
    setSettingModal(false);

    const res = await openModal({
      message: '삭제하시겠습니까?',
      isSelect: true,
    });
    if (!res) return;
    deleteHandler();
  };

  return (
    <div
      className="fixed w-screen custom-dvh top-0 left-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50"
      onClick={e => {
        if (e.currentTarget === e.target) setSettingModal(false);
      }}
    >
      <div className="flex flex-col justify-center items-center rounded-md border space-y-1 bg-white w-72">
        <Link
          className="flex items-center justify-center w-full py-4 text-center font-semibold border-b"
          href={`/shop/product/${id}/edit`}
        >
          <p>수정</p>
        </Link>
        <button
          className={`flex items-center justify-center w-full py-4 font-semibold border-b ${
            state !== 1 ? 'text-gray-300' : 'text-black'
          }`}
          onClick={() => openUpModal()}
          disabled={state === 0 || state === 2}
        >
          <p>UP</p>
        </button>
        <button
          className="flex items-center justify-center w-full py-4 font-semibold text-red-500"
          onClick={openDeleteModal}
        >
          <p>삭제</p>
        </button>
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
        <img src="/product/more.svg" width={24} height={24} alt="MORE" className="hidden max-[480px]:flex" />
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
      onClick={e => {
        if (e.currentTarget === e.target) setComplainModal(false);
      }}
    >
      <div className="flex flex-col space-y-2 justify-around max-w-lg w-full bg-white rounded px-4 py-2">
        <div>
          <img src="/product/complain-red.svg" width={35} height={35} alt="" />
          <CustomDropdownMenu placeholder={placeholder} values={values} onChange={e => setState(e)} />
        </div>
        <div className="bg-gray-100 border rounded">
          <textarea
            className={`${
              state === 0 && 'cursor-not-allowed'
            } w-full scrollbar-hide p-2 resize-none bg-gray-100 outline-none`}
            placeholder={state > 0 ? descriptions[state - 1] : placeholder}
            rows={10}
            maxLength={1000}
            onChange={e => setText(e.target.value)}
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

const incrementViewCount = async productId => {
  const res = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
  });
  return res.json();
};

export default function RenderProduct({ id }) {
  const queryClient = useQueryClient();
  const [settingModal, setSettingModal] = useState(null);
  const [complainModal, setComplainModal] = useState(false);
  const [raiseCount, setRaiseCount] = useState(0);
  const posY = useRef(0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductWithUser(id),
    staleTime: Infinity,
  });
  const invalidateFilters = useInvalidateFiltersQuery();
  const fetchRaiseCount = initRaiseCount(setRaiseCount);
  const { user = null, ...product } = data || {};
  const writer = status !== 'loading' && session ? session.user.id === product.userId : false;
  const { openModal } = useModal();

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
      queryClient.setQueryData(['product', id], oldData => ({
        ...oldData,
        views: data.views,
      }));
    };
    fetchUpdateViews();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchRaiseCount();
  }, [status]);

  const deleteHandler = useCallback(async () => {
    await deleteProduct(id, () => {
      invalidateFilters();
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
  // if (status === 'loading') return;
  if (error) return <div>Error loading product</div>;
  if (!data || !product) return <div>데이터를 가져오고 있습니다...</div>;
  return (
    <div className="max-w-screen-lg mx-auto max-md:mt-12">
      <div className="flex px-10 items-end md:h-6 max-md:py-3 max-md:px-3 max-md:h-12">
        <RenderCategory category={Number(product.category)} />
        {/* 글쓴이 || 어드민 계정 */}
        <MobileSettingModal writer={writer} session={session} setSettingModal={setSettingModal} />
        {!writer && status !== 'loading' && (
          <button onClick={onClickComplain} className="flex items-center h-6 space-x-1">
            <img src="/product/complain.svg" width={20} height={20} alt="complain" />
            <p className="flex flex-nowrap whitespace-nowrap h-5 text-gray-500 max-md:hidden">신고하기</p>
          </button>
        )}
      </div>
      <ImageSlider images={product.images} state={product.state} />
      <div className="p-10 space-y-6 max-md:px-3">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold break-all mr-4">{product.title}</p>
          <div className="flex self-end h-8 items-center">
            {status !== 'loading' ? (
              writer || session?.admin ? (
                <IsWriter id={id} state={product.state} setSettingModal={setSettingModal} />
              ) : (
                <>
                  <OpenChatLink url={product.openChatUrl} />
                  <RenderBookmarkButton
                    productId={id}
                    bookmarked={product.bookmarked}
                    session={session}
                    queryClient={queryClient}
                  />
                </>
              )
            ) : null}
          </div>
        </div>
        <RenderHashTag product={product} />
        <p className="space-x-2">
          <span className="text-2xl font-bold">{Number(product.price).toLocaleString()}</span>
          <span className="text-xl">원</span>
        </p>
        <div className="flex w-full justify-between text-sm text-gray-500 font-semibold">
          <RenderCondition condition={Number(product.condition)} />
          <div className="flex space-x-2 font-normal text-gray-400">
            <RenderTimeAgo date={product.createdAt} />
            <RenderBookMark bookmarked={product.bookmarked} />
            <RenderViews views={product.views} />
          </div>
        </div>
        {status !== 'loading' && !writer && <RenderProfile user={user} id={session?.user?.id} />}
        <RenderDescriptor product={product} />
      </div>
      {settingModal && (
        <SettingModal
          id={id}
          session={session}
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
