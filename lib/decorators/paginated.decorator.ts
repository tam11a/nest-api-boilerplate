// decorators/paginated.decorator.ts

import { UseInterceptors, applyDecorators } from '@nestjs/common';
import {
  ApiQuery,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PaginationInterceptor } from '../interceptors/pagination/pagination.interceptor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Paginated(DataDto?: any) {
  return applyDecorators(
    UseInterceptors(PaginationInterceptor),
    ApiQuery({
      name: 'search',
      type: 'string',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
      default: 10,
    }),
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
      default: 1,
      minimum: 1,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ApiExtraModels(DataDto ? DataDto : {}),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              result: {
                type: 'array',
                items: { $ref: getSchemaPath(DataDto) },
              },
              meta: {
                type: 'object',
                properties: {
                  total: {
                    type: 'number',
                  },
                  page: {
                    type: 'number',
                  },
                  limit: {
                    type: 'number',
                  },
                  totalPages: {
                    type: 'number',
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
}
