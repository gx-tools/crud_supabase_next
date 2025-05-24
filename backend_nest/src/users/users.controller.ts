import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { AccessToken } from '../common/decorators/access-token.decorator';
import { ROUTES } from '../helpers/string-const';
import { IApiResponse } from '../helpers/response.helper';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller(ROUTES.USERS)
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Return the user info' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserInfo(
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.usersService.getUserInfo(userId, accessToken);
  }
} 