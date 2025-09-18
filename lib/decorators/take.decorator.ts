import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Take = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const take = request.limit;
    return take;
  },
);
