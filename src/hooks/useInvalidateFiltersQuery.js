import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useInvalidateFiltersQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({
      predicate: query =>
        query.queryKey.some(key => typeof key === 'string' && (key.includes('categories') || key.includes('prices'))),
    });
  }, [queryClient]);
};
