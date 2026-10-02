import { NextResponse } from 'next/server';
import { ApiResponse, ApiPaginationMeta } from '@/types/api';

export function apiSuccess<T>(
  data: T,
  meta?: ApiPaginationMeta,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

export function apiCreated<T>(data: T): NextResponse<ApiResponse<T>> {
  return apiSuccess(data, undefined, 201);
}

export function apiNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
