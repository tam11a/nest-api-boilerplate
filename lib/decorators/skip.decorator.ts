import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Skip = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const skip = request.skip;
    return skip;
  },
);
