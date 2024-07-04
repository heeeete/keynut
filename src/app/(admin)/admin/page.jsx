'use client';

import { useState } from 'react';
import RenderArticle from './_components/RenderArticle';

export default function Users() {
  const [is, setIs] = useState(0);

  return (
    <div className="max-w-screen-xl h-80vh mx-auto max-md:main-768">
      <ul className="flex space-x-4">
        <button onClick={() => setIs(0)} className={`${is === 0 ? 'font-semibold' : 'text-gray-600'}`}>
          전체 유저
        </button>
        <button onClick={() => setIs(1)} className={`${is === 1 ? 'font-semibold' : 'text-gray-600'}`}>
          정지 유저
        </button>
        <button onClick={() => setIs(2)} className={`${is === 2 ? 'font-semibold' : 'text-gray-600'}`}>
          전체 게시물
        </button>
        <button onClick={() => setIs(3)} className={`${is === 3 ? 'font-semibold' : 'text-gray-600'}`}>
          신고 게시물
        </button>
      </ul>
      <article className="bg-gray-200 max-w-full h-full">
        <RenderArticle is={is} />
      </article>
    </div>
  );
}
