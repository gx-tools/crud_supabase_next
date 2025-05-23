import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { COOKIE } from '../../helpers/string-const';

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies[COOKIE.ACCESS_TOKEN];
  },
); 