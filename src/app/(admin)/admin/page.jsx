'use client';

export default function Users() {
  return (
    <div className="flex w-full">
      <div className=" grid w-full grid-cols-2 gap-2">
        <button className="flex flex-col justify-center items-center bg-gray-200 h-96">
          <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" viewBox="0 0 24 24">
            <path
              fill="white"
              d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"
            />
          </svg>
          <p className="font-semibold text-white text-2xl">전체 유저</p>
        </button>
        <button className="bg-gray-200 h-96">정지 유저</button>
        <button className="bg-gray-200 h-96">전체 게시물</button>
        <button className="bg-gray-200 h-96">신고 게시물</button>
      </div>
    </div>
  );
}
