import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { COOKIE, ENVS, MESSAGES } from '../../helpers/string-const';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';

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
      // Get Supabase URL and key from the service
      const supabaseUrl = process.env[ENVS.SUPABASE_URL];
      const supabaseKey = process.env[ENVS.SUPABASE_ANON_KEY];
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
        throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
      }

      // Create a new client with the token in the headers
      const supabase = createClient(
        supabaseUrl,
        supabaseKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      );

      // Get the user data
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error('Auth error details:', error);
        throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
      }

      // Attach user to request object
      request['user'] = data.user;
      return true;
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
    }
  }
} 