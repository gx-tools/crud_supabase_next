import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MESSAGES } from '../helpers/string-const';
import { successResponse, IApiResponse, errorResponse } from '../helpers/response.helper';
import { createClient } from '@supabase/supabase-js';
import { ENVS } from '../helpers/string-const';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signup(signupDto: SignupDto): Promise<IApiResponse> {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.signUp({
        email: signupDto.email,
        password: signupDto.password,
      });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.SIGNUP_SUCCESS);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto): Promise<IApiResponse<{session: any}>> {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

      if (error) {
        throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
      }

      return successResponse(MESSAGES.LOGIN_SUCCESS, { session: data.session });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async logout(): Promise<IApiResponse> {
    try {
      const { error } = await this.supabaseService.getClient().auth.signOut();
      if (error) {
        throw new InternalServerErrorException(error.message);
      }
      return successResponse(MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
  async checkAuthStatus(token: string | undefined): Promise<IApiResponse> {
    if (!token) {
      return errorResponse(MESSAGES.UNAUTHORIZED);
    }

    try {
      const supabaseUrl = process.env[ENVS.SUPABASE_URL];
      const supabaseKey = process.env[ENVS.SUPABASE_ANON_KEY];

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables for auth check');
        throw new InternalServerErrorException('Server configuration error');
      }

      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        },
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return errorResponse(MESSAGES.UNAUTHORIZED);
      }

      return successResponse(MESSAGES.AUTHENTICATED, 
        {email: user.email, id: user.id, role: user.user_metadata.role});
    } catch (error) {
      console.error('Auth status check error:', error);
      throw new InternalServerErrorException('Error checking authentication status');
    }
  }
}
