import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MESSAGES } from '../helpers/string-const';
import { successResponse, IApiResponse } from '../helpers/response.helper';

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
}
