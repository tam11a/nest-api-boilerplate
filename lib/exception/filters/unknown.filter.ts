import { Request } from 'express';
import { ErrorCategory } from '../types/error-types';
import { ErrorResponse } from 'lib/interfaces/response.interface';

export class UnknownExceptionHandler {
  handle(exception: unknown, request: Request): ErrorResponse {
    const isProduction = process.env.NODE_ENV === 'production';
    const error = exception as Error;

    return {
      success: false,
      status: 500,
      error: {
        type: ErrorCategory.SERVER,
        code: 'UNKNOWN_ERROR',
        message: isProduction
          ? 'Internal server error'
          : error.message || 'Unexpected error occurred',
        meta: {
          stack: isProduction ? undefined : error.stack,
        },
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}
