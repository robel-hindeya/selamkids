'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { ApiPaginationMeta } from '@/types/api';

export interface PaginationProps {
  meta: ApiPaginationMeta;
  onPageChange: (newPage: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, totalItems, hasNextPage, hasPrevPage } = meta;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3">
      <div className="text-xs font-medium text-slate-500">
        Showing page <span className="font-semibold text-slate-800">{page}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalPages}</span> ({totalItems} items)
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="gap-1 px-3 text-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="gap-1 px-3 text-xs"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
