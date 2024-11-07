import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useInvalidateFiltersQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (key?: unknown) => {
      queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey.some(
            queryKeyItem =>
              typeof queryKeyItem === 'string' &&
              (queryKeyItem.includes('categories') || queryKeyItem.includes('prices')),
          ),
      });
      if (key) queryClient.invalidateQueries(key);
    },
    [queryClient],
  );
};
