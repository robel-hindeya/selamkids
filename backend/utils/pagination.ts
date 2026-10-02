import { ApiPaginationMeta } from '@/types/api';

export interface PaginationParams {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
}

export function parsePaginationParams(urlSearchParams: URLSearchParams): PaginationParams {
  const pageRaw = parseInt(urlSearchParams.get('page') || '1', 10);
  const pageSizeRaw = parseInt(urlSearchParams.get('pageSize') || '10', 10);

  const page = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw;
  const pageSize = isNaN(pageSizeRaw) || pageSizeRaw < 1 ? 10 : Math.min(pageSizeRaw, 100);

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return { page, pageSize, offset, limit };
}

export function createPaginationMeta(
  totalItems: number,
  page: number,
  pageSize: number
): ApiPaginationMeta {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
