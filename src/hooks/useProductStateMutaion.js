'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { useInvalidateFiltersQuery } from './useInvalidateFiltersQuery';

const useProductStateMutation = () => {
  const queryClient = useQueryClient();
  const invalidateFilters = useInvalidateFiltersQuery();

  const mutation = useMutation({
    mutationFn: async ({ productId, state }) => {
      const res = await fetch(`/api/products/${productId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Network response was not ok');
      return data;
    },
    onMutate: async ({ productId, state }) => {
      await queryClient.cancelQueries(['product', productId]);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], old => ({
        ...old,
        state: state,
      }));
      return { previousProduct };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['product', variables.productId], context.previousProduct);
    },
    onSettled: (data, error, variables) => {
      invalidateFilters();
      queryClient.invalidateQueries(['product', variables.productId]);
    },
  });

  const onClickSelling = async (id, state) => {
    if (!(await getSession())) return signIn();
    if (state === 1) return;
    mutation.mutate({ productId: id, state: 1 });
  };

  const onClickSellCompleted = async (id, state) => {
    if (!(await getSession())) return signIn();
    if (state === 0) return;
    mutation.mutate({ productId: id, state: 0 });
  };

  return {
    onClickSelling,
    onClickSellCompleted,
  };
};

export default useProductStateMutation;
