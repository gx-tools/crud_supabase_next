import { Body, Controller, Post, Res, InternalServerErrorException, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { COOKIE, ROUTES } from '../helpers/string-const';
import { Response, Request } from 'express';
import { IApiResponse, successResponse } from '../helpers/response.helper';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ROUTES.SIGNUP)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signup(@Body() signupDto: SignupDto): Promise<IApiResponse> {
    return this.authService.signup(signupDto);
  }

  @Post(ROUTES.LOGIN)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Log out a user' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
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
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'Authentication status' })
  async getAuthStatus(@Req() req: Request): Promise<IApiResponse> {
    const token = req.cookies[COOKIE.ACCESS_TOKEN];
    return this.authService.checkAuthStatus(token);
  }
}
