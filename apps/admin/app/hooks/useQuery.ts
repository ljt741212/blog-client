import { useState, useEffect, useCallback, useRef } from 'react';

interface QueryOptions<T, P = unknown> {
  queryKey: string;
  queryFn: (params?: P) => Promise<T>;
  enabled?: boolean;
}

interface QueryState<T> {
  data?: T;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useQuery<T, P = unknown>({
  queryKey,
  queryFn,
  enabled = true,
}: QueryOptions<T, P>): QueryState<T> & { refetch: typeof queryFn } {
  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    isLoading: true,
    error: null,
    isError: false,
  });

  const fn = useRef(queryFn);
  const fetchData = useCallback<typeof queryFn>(async params => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, isError: false }));
      const data = await fn.current(params);
      setState(prev => ({ ...prev, data, isLoading: false }));
      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isError: true,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    const executeQuery = async () => {
      if (!isMounted) return;
      await fetchData();
    };

    executeQuery();

    return () => {
      isMounted = false;
    };
  }, [queryKey, enabled, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
