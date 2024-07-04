import { useState } from 'react';

const recentSearch = [
  'gmk dark olivia',
  'neo ergo',
  'kohaku',
  '한무무 키보드',
  '네오 어고 키보드',
  'asdhjdasdjka sjdka sjdka jksd ajksd kasajsdk ajksd aksd kjads jka dsjkdj',
];

export default function Search({ isOpen, setSearchStatus }) {
  const [text, setText] = useState('');
  const closeModal = e => {
    if (e.target === e.currentTarget) setSearchStatus(false);
  };

  const clearText = () => {
    setText('');
  };

  if (isOpen)
    return (
      <div className="absolute top-0 left-0 w-screen h-screen" onClick={closeModal}>
        <div className="fixed top-1/3 left-2/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 border rounded-xl bg-white p-6 z-40">
          <div className="flex relative border-b-4 w-full items-center">
            <input
              className="w-11/12 outline-none"
              placeholder="상품명"
              value={text}
              onChange={e => setText(e.target.value)}
              type="text"
            />
            {text.length ? (
              <button className="absolute right-0" onClick={clearText}>
                <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 2048 2048">
                  <path
                    fill="currentColor"
                    d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                  />
                </svg>
              </button>
            ) : (
              ''
            )}
          </div>
          <div>
            <p className="text-sm py-2">최근 검색어</p>
            {recentSearch.map((e, idx) => (
              <div className="flex w-full justify-between pb-1" key={idx}>
                <p className="text-sm line-clamp-1 w-4/5">{e}</p>
                <button title="delete-recent-search">
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 2048 2048">
                    <path
                      fill="currentColor"
                      d="m1115 1024l690 691l-90 90l-691-690l-691 690l-90-90l690-691l-690-691l90-90l691 690l691-690l90 90z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
