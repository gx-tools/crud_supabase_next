import { Body, Controller, Post, Res, InternalServerErrorException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { COOKIE, ROUTES } from '../helpers/string-const';
import { Response } from 'express';
import { IApiResponse, successResponse } from '../helpers/response.helper';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ROUTES.SIGNUP)
  async signup(@Body() signupDto: SignupDto): Promise<IApiResponse> {
    return this.authService.signup(signupDto);
  }

  @Post(ROUTES.LOGIN)
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const response = await this.authService.login(loginDto);

    if (!response.data || !response.data.session) {
      throw new InternalServerErrorException('Login failed: No session data returned');
    }
    
    // Set JWT in HTTP-only cookie
    res.cookie(COOKIE.ACCESS_TOKEN, response.data.session.access_token, {
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(successResponse(response.message));
  }

  @Post(ROUTES.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response): Promise<void> {
    const response = await this.authService.logout();
    res.clearCookie(COOKIE.ACCESS_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.json(response);
  }
}
