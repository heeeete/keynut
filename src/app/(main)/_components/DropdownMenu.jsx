'use client';
import useProductStateMutation from '@/hooks/useProductStateMutaion';
import { useState } from 'react';

const DropdownMenu = ({ state, id }) => {
  const [dropMenu, setDropMenu] = useState(false);
  const { onClickSelling, onClickSellCompleted } = useProductStateMutation();
  return (
    <button
      id="dropDown"
      className="flex w-85 h-8 justify-between font-medium border text-sm border-gray-300 rounded flex-nowrap whitespace-nowrap items-center relative max-md:text-gray-600"
      onClick={() => {
        setDropMenu(!dropMenu);
      }}
    >
      <p className="pl-2">{state === 1 ? '판매중' : '판매완료'}</p>
      <div className="flex h-full px-1 items-center justify-center border-l">
        {dropMenu ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
            <path
              fill="darkgray"
              d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 1024 1024">
            <path
              fill="darkgray"
              d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
            />
          </svg>
        )}
      </div>
      <div
        className={`absolute -bottom-8 border left-0 w-full h-full px-2 items-center rounded shadow bg-white text-gray-400 ${
          dropMenu ? 'flex' : 'hidden'
        }`}
        onClick={() => {
          if (state === 1) {
            onClickSellCompleted(id, state);
          } else onClickSelling(id, state);
        }}
      >
        {state ? '판매완료' : '판매중'}
      </div>
    </button>
  );
};

export default DropdownMenu;
