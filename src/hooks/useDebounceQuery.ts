import { useEffect, useState } from "react";

interface Params {
  onDebounceQuery: (value: string) => void;
  timeout?: number;
}

export const useDebounceQuery = ({
  onDebounceQuery,
  timeout = 300,
}: Params) => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounceQuery(query), timeout);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, timeout]);

  useEffect(() => {
    if (debounceQuery.trim().length > 0) {
      onDebounceQuery(debounceQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceQuery]);

  return {
    setNoDebounceQuery: setQuery,
  };
};
