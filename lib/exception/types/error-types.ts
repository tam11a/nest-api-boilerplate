export enum ErrorCategory {
  CLIENT = 'CLIENT', // 4xx errors
  SERVER = 'SERVER', // 5xx errors
  DATABASE = 'DATABASE', // Prisma errors
  VALIDATION = 'VALIDATION', // DTO errors
  AUTH = 'AUTH', // Authentication
  THIRD_PARTY = 'THIRD_PARTY', // External APIs
}

export type ErrorMeta = {
  code: string;
  target?: string;
  details?: unknown;
  stack?: string; // Only in development
  [key: string]: unknown;
};
