'use client';

import { useState } from 'react';
import SearchModal from './SearchModal';

export default function Search() {
  const [searchState, setSearchState] = useState(false);

  return (
    <>
      <button onClick={() => setSearchState(!searchState)}>SEARCH</button>
      <SearchModal isOpen={searchState} setSearchStatus={setSearchState} />
    </>
  );
}
