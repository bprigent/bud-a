import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

export function useData(fetchFn, csvFile) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFnRef.current();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch, fetchFn]);

  const handleWsMessage = useCallback((changedFile) => {
    if (!csvFile) {
      refetch();
      return;
    }
    if (typeof csvFile === 'string') {
      if (changedFile === csvFile) refetch();
    } else if (Array.isArray(csvFile)) {
      if (csvFile.includes(changedFile)) refetch();
    }
  }, [csvFile, refetch]);

  useWebSocket(handleWsMessage);

  return { data, loading, error, refetch };
}
