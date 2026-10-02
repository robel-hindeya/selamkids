import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './app-error';
import { ApiResponse } from '@/types/api';

export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  // Log server-side
  if (process.env.NODE_ENV !== 'test') {
    console.error('[API_ERROR_HANDLER]', error);
  }

  // Zod validation error
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The submitted data was invalid',
          details: formattedErrors,
        },
      },
      { status: 422 }
    );
  }

  // Known AppError / AuthError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.statusCode }
    );
  }

  // Generic or unexpected error
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : error instanceof Error
        ? error.message
        : 'An unexpected internal server error occurred.';

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message,
      },
    },
    { status: 500 }
  );
}
