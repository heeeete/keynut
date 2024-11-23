'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { useInvalidateFiltersQuery } from './useInvalidateFiltersQuery';
import { ProductData } from '@/type/productData';

interface Props {
  productId: string;
  state: number;
}

const useProductStateMutation = () => {
  const queryClient = useQueryClient();
  const invalidateFilters = useInvalidateFiltersQuery();

  const mutation = useMutation({
    mutationFn: async ({ productId, state }: Props) => {
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
      await queryClient.cancelQueries({ queryKey: ['product', productId] });
      const previousProduct = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], (old: ProductData) => ({
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
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });

  const onClickSelling = async (id: string, state: number) => {
    if (!(await getSession())) return signIn();
    if (state === 1) return;
    mutation.mutate({ productId: id, state: 1 });
  };

  const onClickSellCompleted = async (id: string, state: number) => {
    if (!(await getSession())) return signIn();
    if (state === 0) return;
    mutation.mutate({ productId: id, state: 0 });
  };

  const onClickBooked = async (id: string, state: number) => {
    if (!(await getSession())) return signIn();
    if (state === 2) return;
    mutation.mutate({ productId: id, state: 2 });
  };

  return {
    onClickSelling,
    onClickSellCompleted,
    onClickBooked,
  };
};

export default useProductStateMutation;
