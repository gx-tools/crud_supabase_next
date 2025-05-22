import { Body, Controller, Post, Res, InternalServerErrorException, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { COOKIE, ROUTES } from '../helpers/string-const';
import { Response, Request } from 'express';
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
    
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Set JWT in HTTP-only cookie with environment-specific settings
    res.cookie(COOKIE.ACCESS_TOKEN, response.data.session.access_token, {
      httpOnly: true,
      secure: !isDevelopment, // Only use secure in production
      sameSite: isDevelopment ? 'lax' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json(successResponse(response.message));
  }

  @Post(ROUTES.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response): Promise<void> {
    const response = await this.authService.logout();
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.clearCookie(COOKIE.ACCESS_TOKEN, {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'strict',
      path: '/',
    });
    res.json(response);
  }

  @Get(ROUTES.STATUS)
  async getAuthStatus(@Req() req: Request): Promise<IApiResponse> {
    const token = req.cookies[COOKIE.ACCESS_TOKEN];
    return this.authService.checkAuthStatus(token);
  }
}
