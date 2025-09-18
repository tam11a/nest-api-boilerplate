import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import { ErrorCategory } from '../types/error-types';
import { ErrorResponse } from 'lib/interfaces/response.interface';

export class HttpExceptionHandler {
  handle(exception: HttpException, request: Request): ErrorResponse {
    const status = exception.getStatus();
    const response = exception.getResponse();

    return {
      success: false,
      status: status,
      error: {
        type: this.getErrorCategory(status),
        code: `HTTP_${status}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          typeof response === 'string' ? response : (response as any).message,
        meta: {
          details: typeof response === 'object' ? response : undefined,
          // stack:
          // process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
        },
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  private getErrorCategory(status: number): ErrorCategory {
    return status >= 500 ? ErrorCategory.SERVER : ErrorCategory.CLIENT;
  }
}
