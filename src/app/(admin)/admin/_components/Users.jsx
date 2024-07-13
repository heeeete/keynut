'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import getUsers from '../_lib/getUsers';

const PAGE_SIZE = 30;

const useUsers = page => {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page, PAGE_SIZE),
  });
};

export default function Users() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useUsers(page);

  return <div></div>;
}
