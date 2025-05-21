import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { COOKIE, MESSAGES } from '../../helpers/string-const';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies[COOKIE.ACCESS_TOKEN];

    if (!token) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
    }

    try {
      // Verify the token with Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !data?.user) {
        throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
      }

      // Attach user to request object
      request['user'] = data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
    }
  }
} 