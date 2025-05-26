import { Body, Controller, Post, Res, InternalServerErrorException, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { COOKIE, ROUTES } from '../helpers/string-const';
import { Response, Request } from 'express';
import { IApiResponse, successResponse } from '../helpers/response.helper';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 500 },
      message: { type: 'string', example: 'Internal server error' },
      error: { type: 'string', example: 'Internal Server Error' }
    }
  }
})
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ROUTES.SIGNUP)
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided email and password. The password must be at least 6 characters long.' 
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User registered successfully' },
        data: {
          type: 'object',
          properties: {
            user: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' },
                email: { type: 'string', example: 'user@example.com' },
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid email or password format' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  async signup(@Body() signupDto: SignupDto): Promise<IApiResponse> {
    return this.authService.signup(signupDto);
  }

  @Post(ROUTES.LOGIN)
  @ApiOperation({ 
    summary: 'Log in a user',
    description: 'Authenticates a user with the provided email and password and sets an HTTP-only cookie with the session token.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid email or password' })
  @ApiResponse({ status: 404, description: 'Not Found - User not found' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const response = await this.authService.login(loginDto);

    if (!response.data || !response.data.session) {
      throw new InternalServerErrorException('Login failed: No session data returned');
    }
    
    // Set JWT in HTTP-only cookie with environment-specific settings
    res.cookie(COOKIE.ACCESS_TOKEN, response.data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json(successResponse(response.message));
  }

  @Post(ROUTES.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Log out a user',
    description: 'Logs out the currently authenticated user by clearing the session cookie.'
  })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Not logged in' })
  async logout(@Res() res: Response): Promise<void> {
    const response = await this.authService.logout();
    res.clearCookie(COOKIE.ACCESS_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    res.json(response);
  }

  @Get(ROUTES.STATUS)
  @ApiOperation({ 
    summary: 'Check authentication status',
    description: 'Verifies if the current user is authenticated by validating the session token in the cookie.'
  })
  @ApiCookieAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Authentication status',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User is authenticated' },
        data: {
          type: 'object',
          properties: {
            authenticated: { type: 'boolean', example: true },
            user: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' },
                email: { type: 'string', example: 'user@example.com' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
  async getAuthStatus(@Req() req: Request): Promise<IApiResponse> {
    const token = req.cookies[COOKIE.ACCESS_TOKEN];
    return this.authService.checkAuthStatus(token);
  }
}
