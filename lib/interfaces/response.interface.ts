import { ErrorCategory, ErrorMeta } from '../exception/types/error-types';

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path?: string;
}

export interface ErrorResponse {
  success: false;
  status: number;
  error: {
    type: ErrorCategory;
    code: string;
    message: string;
    meta?: Omit<ErrorMeta, 'code'>;
  };
  timestamp: string;
  path?: string;
}
