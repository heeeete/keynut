'use client';

import { useState } from 'react';
import SearchModal from './SearchModal';

export default function Search({ isMobile }) {
  const [searchState, setSearchState] = useState(false);

  return (
    <>
      <button onClick={() => setSearchState(!searchState)}>
        {isMobile ? (
          <p className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 32 32">
              <path
                fill="black"
                d="m29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9"
              />
            </svg>
          </p>
        ) : (
          'SEARCH'
        )}
      </button>
      <SearchModal isOpen={searchState} setSearchStatus={setSearchState} />
    </>
  );
}
