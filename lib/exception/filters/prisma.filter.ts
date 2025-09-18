import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request } from 'express';
import { ErrorCategory } from '../types/error-types';
import { ErrorResponse } from 'lib/interfaces/response.interface';

interface PrismaErrorDefinition {
  status: number;
  message: string;
}

export const PRISMA_ERRORS: Record<string, PrismaErrorDefinition> = {
  // Client Errors (4xx)
  P2000: { status: 400, message: 'Value too long for field' },
  P2001: { status: 404, message: 'not found' },
  P2002: { status: 409, message: 'already exists' },
  P2003: { status: 400, message: 'Foreign key constraint failed' },
  P2004: { status: 400, message: 'Database constraint failed' },

  // Validation Errors
  P2006: { status: 400, message: 'Invalid field value' },
  P2007: { status: 400, message: 'Data validation error' },
  P2011: { status: 400, message: 'Null constraint violation' },

  // Relation Errors
  P2014: { status: 400, message: 'Relationship violation' },
  P2015: { status: 404, message: 'Related record not found' },

  // Common Errors
  P2025: { status: 404, message: 'not found' },
  P2026: { status: 400, message: 'Unsupported database feature' },

  // Connection Errors (5xx)
  P1000: { status: 500, message: 'Database connection failed' },
  P1001: { status: 503, message: 'Database unreachable' },
  P1017: { status: 503, message: 'Database connection closed' },

  // Default
  DEFAULT: { status: 500, message: 'Database operation failed' },
};

export class PrismaExceptionHandler {
  handle(
    error: PrismaClientKnownRequestError,
    request: Request,
  ): ErrorResponse {
    return {
      success: false,
      status: this.getPrismaErrorDetails(error.code).status,
      error: {
        type: ErrorCategory.DATABASE,
        code: `DB_${error.code}`,
        message: this.getPrismaErrorDetails(error.code).message,
        meta: {
          target: error.meta?.target as string,
          details:
            process.env.NODE_ENV !== 'production' ? error.meta : undefined,
        },
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  getPrismaErrorDetails(code: string): PrismaErrorDefinition {
    return PRISMA_ERRORS[code] || PRISMA_ERRORS.DEFAULT;
  }
}
