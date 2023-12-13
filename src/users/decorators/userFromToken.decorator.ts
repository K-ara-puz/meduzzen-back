import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUserFromToken } from '../../utils/getUserIdFromToken';

export const UserFromToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return getUserFromToken(request.headers.authorization);
  },
);