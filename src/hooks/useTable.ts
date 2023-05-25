import React, { useState } from "react";

interface Props {
  limit?: number;
  onLimitChange?: (event: React.ChangeEvent<HTMLInputElement>, newLimit: number) => void;
  onPageChange?: (newPage: number, oldPage: number, limit: number) => void;
} 

interface UseTable {
  limit: number;
  page: number;
  handlePageChange: (_: any, newPage: number) => void;
  handleLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useTable = (props: Props): UseTable => {
  const { limit: initialLimit, onLimitChange, onPageChange } = props;
  const [limit, setLimit] = useState(initialLimit || 5);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    if (onLimitChange) {
      onLimitChange(event, parseInt(event.target.value, 10));
    }
    setPage(0);
  };

  const handlePageChange = (_: any, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage, page, limit);
    }
    setPage(newPage);
  };

  return {
    limit,
    page,
    handlePageChange,
    handleLimitChange,
  };
};
