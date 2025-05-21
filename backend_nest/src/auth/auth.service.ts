import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MESSAGES } from '../helpers/string-const';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signup(signupDto: SignupDto) {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.signUp({
        email: signupDto.email,
        password: signupDto.password,
      });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return {
        message: MESSAGES.SIGNUP_SUCCESS
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

      if (error) {
        throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
      }

      return {
        message: MESSAGES.LOGIN_SUCCESS,
        session: data.session,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
