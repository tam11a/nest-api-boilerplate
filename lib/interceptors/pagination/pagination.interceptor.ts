/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PaginatedRequest extends Request {
  skip: number;
  limit: number;
}

export interface Response<T> {
  results: { [key: string]: unknown }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Get limit, page number, search, filter from request params
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<PaginatedRequest>();

    // Get pagination parameters from query
    const page = parseInt(request.query.page as string, 10) || 1;
    const limit = parseInt(request.query.limit as string, 10) || 10;

    // Calculate skip and take for Prisma
    const skip = (page - 1) * limit;

    // Attach pagination parameters to request for use in services
    request.skip = skip;
    request.limit = limit;

    // console.log(page, limit, skip);

    return next.handle().pipe(
      map((data) => {
        return {
          results: data.results,
          meta: {
            total: data.total,
            page,
            limit,
            totalPages: Math.ceil(data.total / limit),
          },
        };
      }),
    );
  }
}
